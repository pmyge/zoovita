import os
import asyncio
import logging
import fcntl
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import CommandStart, Command
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import AsyncSessionLocal
from app.models.telegram_session import TelegramSession
from app.models.user import User
from app.security import create_access_token

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

bot = Bot(token=TELEGRAM_BOT_TOKEN)
dp = Dispatcher()

# Simple in-memory state mapping chat_id -> session_id
chat_sessions = {}

from aiogram.utils.keyboard import ReplyKeyboardBuilder

@dp.message(CommandStart())
async def cmd_start(message: types.Message):
    args = message.text.split(maxsplit=1)
    
    builder = ReplyKeyboardBuilder()
    builder.add(KeyboardButton(text="📱 Telefon raqamni yuborish", request_contact=True))
    keyboard = builder.as_markup(resize_keyboard=True, one_time_keyboard=True)

    if len(args) > 1:
        session_id = args[1]
        chat_sessions[message.chat.id] = session_id
        
        await message.answer(
            "Xush kelibsiz! Tizimga kirish uchun quyidagi tugma orqali telefon raqamingizni tasdiqlang:",
            reply_markup=keyboard
        )
    else:
        await message.answer(
            "Iltimos, avval mobil ilovadagi 'Telegram orqali kirish' tugmasini bosing. Agar bosgan bo'lsangiz, quyidagi tugma orqali raqamingizni yuborishingiz mumkin:",
            reply_markup=keyboard
        )

@dp.message(F.contact)
async def handle_contact(message: types.Message):
    contact = message.contact
    chat_id = message.chat.id
    
    # Ensure the user is sharing their own contact
    if contact.user_id != message.from_user.id:
        await message.answer("Iltimos, o'zingizning telefon raqamingizni yuboring.")
        return

    session_id = chat_sessions.get(chat_id)
    if not session_id:
        await message.answer("Sessiya topilmadi. Iltimos, ilovaga qaytib qaytadan urinib ko'ring.")
        return

    phone = contact.phone_number
    if not phone.startswith('+'):
        phone = '+' + phone

    async with AsyncSessionLocal() as db_session:
        # Update the session id as authenticated
        result = await db_session.execute(select(TelegramSession).where(TelegramSession.session_id == session_id))
        t_session = result.scalar_one_or_none()
        
        if not t_session:
            await message.answer("Xatolik: Sessiya muddati tugagan yoki topilmadi.")
            return

        # Check if the user exists in DB, or create them
        result = await db_session.execute(select(User).where(User.phone == phone))
        user = result.scalar_one_or_none()
        
        if not user:
            # Create a new user with data from session
            user = User(
                name=t_session.name if t_session.name else message.from_user.full_name,
                email=t_session.email,
                password_hash=t_session.password_hash,
                phone=phone,
                telegram_id=str(message.from_user.id)
            )
            db_session.add(user)
            await db_session.commit()
        else:
            # Update telegram_id if missing
            if not user.telegram_id:
                user.telegram_id = str(message.from_user.id)
                await db_session.commit()

        if t_session:
            t_session.is_authenticated = True
            t_session.phone = phone
            await db_session.commit()
            
            await message.answer("Tasdiqlandi...", reply_markup=ReplyKeyboardRemove())
            
            # Generate JWT token for the user
            access_token = create_access_token(subject=user.id)
            
            from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
            markup = InlineKeyboardMarkup(inline_keyboard=[
                 [InlineKeyboardButton(
                       text="📱 Mobil ilovaga qaytish",
                       url=f"https://api.zoovita.uz/api/v1/auth/redirect-to-app?token={access_token}"
                 )]
           ])
            await message.answer(
                "✅ Muvaffaqiyatli tasdiqlandi! Endi mobil ilovaga qaytishingiz mumkin.",
                reply_markup=markup
            )
            # Remove from local memory
            if chat_id in chat_sessions:
                del chat_sessions[chat_id]

_bot_lock_handle = None


def _acquire_single_instance_lock():
    """Ensure only one process/worker runs the polling bot (avoids 409 conflicts)."""
    global _bot_lock_handle
    try:
        _bot_lock_handle = open("/tmp/zoovita_login_bot.lock", "w")
        fcntl.flock(_bot_lock_handle, fcntl.LOCK_EX | fcntl.LOCK_NB)
        return True
    except (IOError, OSError):
        logging.info("Zoovita bot already running in another process; skipping polling here.")
        return False


async def start_bot():
    if not TELEGRAM_BOT_TOKEN:
        logging.warning("TELEGRAM_BOT_TOKEN is not set; bot will not start.")
        return
    if not _acquire_single_instance_lock():
        return
    # Keep the bot alive: if polling crashes (e.g. a transient Telegram outage),
    # log it and restart after a short delay instead of dying silently.
    while True:
        try:
            # Clear any stale webhook so long-polling is not blocked by a 409.
            await bot.delete_webhook(drop_pending_updates=False)
            logging.info("Zoovita login bot: starting polling...")
            await dp.start_polling(bot)
            logging.warning("Zoovita login bot: polling stopped; restarting in 5s.")
            await asyncio.sleep(5)
        except Exception as e:
            logging.exception("Zoovita login bot crashed: %s. Restarting in 10s.", e)
            await asyncio.sleep(10)
