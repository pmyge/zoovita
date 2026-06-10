from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from typing import Optional
from sqlalchemy.future import select
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.schemas.auth import (
    TokenResponse,
    PhoneRegisterRequest,
    PhoneLoginRequest,
    GoogleLoginRequest,
    AppleLoginRequest,
    InitiateTelegramAuthRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest
)
from app.security import hash_password, verify_password, create_access_token, JWT_SECRET, JWT_ALGORITHM
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")
from app.auth_verify import verify_google_id_token, verify_apple_identity_token
import uuid
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.models.telegram_session import TelegramSession

router = APIRouter()

def send_reset_email(to_email: str, reset_link: str):
    sender_email = "ergashmasharipov88@gmail.com"
    sender_password = "ghftuejopeetzowc"  # New App password provided by user
    
    msg = MIMEMultipart("alternative")
    msg['Subject'] = "Zoovita: Parolingizni tiklang"
    msg['From'] = sender_email
    msg['To'] = to_email
    
    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #F7FBF4; padding: 20px; text-align: center;">
        <h2 style="color: #2B3D26;">Zoovita</h2>
        <p style="color: #5C7153;">Siz parolni tiklash bo'yicha so'rov yubordingiz. Agar bu siz bo'lmasangiz, ushbu xatni e'tiborsiz qoldiring.</p>
        <br>
        <a href="{reset_link}" style="background-color: #3C8E2D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Parolni tiklash</a>
        <br><br>
        <p style="color: #A3B1A0; font-size: 12px;">Yoki ushbu havolani nusxalang: <br>{reset_link}</p>
      </body>
    </html>
    """
    
    part = MIMEText(html, "html")
    msg.attach(part)
    
    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to_email, msg.as_string())
        server.quit()
        print(f"Email muvaffaqiyatli yuborildi -> {to_email}")
    except Exception as e:
        print("Email jo'natishda xatolik yuz berdi:", e)

@router.post("/register-phone", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register_phone(req: PhoneRegisterRequest, db: AsyncSession = Depends(get_db)):
    """Register a new user using a phone number and password."""
    # Check if user already exists with this phone
    result = await db.execute(select(User).filter(User.phone == req.phone))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ushbu telefon raqami allaqachon ro'yxatdan o'tgan!"
        )

    # Create new user
    new_user = User(
        name=req.name,
        phone=req.phone,
        password_hash=hash_password(req.password)
    )
    db.add(new_user)
    await db.flush() # Populate the ID
    
    # Generate access token
    access_token = create_access_token(subject=new_user.id)
    return TokenResponse(access_token=access_token, user=new_user)


@router.post("/login-phone", response_model=TokenResponse)
async def login_phone(req: PhoneLoginRequest, db: AsyncSession = Depends(get_db)):
    """Authenticate a user using phone number and password."""
    result = await db.execute(select(User).filter(User.phone == req.phone))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bu raqam hali ro'yxatdan o'tmagan"
        )
        
    if not user.password_hash or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Kiritilgan parol noto'g'ri"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Foydalanuvchi hisobi faolsizlantirilgan!"
        )

    access_token = create_access_token(subject=user.id)
    return TokenResponse(access_token=access_token, user=user)

@router.get("/check-status/{phone}")
async def check_user_status(phone: str, db: AsyncSession = Depends(get_db)):
    """Check if the user is still active in the database."""
    result = await db.execute(select(User).filter(User.phone == phone))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Foydalanuvchi topilmadi")
    
    return {
        "is_active": user.is_active,
        "name": user.name,
        "phone": user.phone,
        "email": user.email,
        "avatar": user.avatar
    }

@router.post("/google", response_model=TokenResponse)
async def login_google(req: GoogleLoginRequest, db: AsyncSession = Depends(get_db)):
    """Verify Google token, link or create user, and issue access token."""
    id_info = await verify_google_id_token(req.id_token)
    
    google_id = id_info.get("sub")
    email = id_info.get("email")
    name = id_info.get("name", "Google User")

    if not google_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google ID (sub) ma'lumoti topilmadi!"
        )

    # 1. Search by Google ID
    result = await db.execute(select(User).filter(User.google_id == google_id))
    user = result.scalars().first()

    if not user:
        # 2. Try searching by email to link accounts
        if email:
            result = await db.execute(select(User).filter(User.email == email))
            user = result.scalars().first()
            if user:
                # Link account
                user.google_id = google_id
                if not user.name:
                    user.name = name
                await db.flush()

        # 3. If still not found, create new user
        if not user:
            user = User(
                name=name,
                email=email,
                google_id=google_id
            )
            db.add(user)
            await db.flush()

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Foydalanuvchi hisobi faolsizlantirilgan!"
        )

    access_token = create_access_token(subject=user.id)
    return TokenResponse(access_token=access_token, user=user)


@router.post("/apple", response_model=TokenResponse)
async def login_apple(req: AppleLoginRequest, db: AsyncSession = Depends(get_db)):
    """Verify Apple identity token, link or create user, and issue access token."""
    payload = await verify_apple_identity_token(req.id_token)
    
    apple_id = payload.get("sub")
    email = payload.get("email")
    
    # Establish a default name if not provided
    name = "Apple User"
    if req.first_name:
        name = req.first_name
        if req.last_name:
            name += f" {req.last_name}"
    elif email:
        name = email.split("@")[0].capitalize()

    if not apple_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Apple ID (sub) ma'lumoti topilmadi!"
        )

    # 1. Search by Apple ID
    result = await db.execute(select(User).filter(User.apple_id == apple_id))
    user = result.scalars().first()

    if not user:
        # 2. Try searching by email to link accounts
        if email:
            result = await db.execute(select(User).filter(User.email == email))
            user = result.scalars().first()
            if user:
                # Link account
                user.apple_id = apple_id
                await db.flush()

        # 3. If still not found, create new user
        if not user:
            user = User(
                name=name,
                email=email,
                apple_id=apple_id
            )
            db.add(user)
            await db.flush()

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Foydalanuvchi hisobi faolsizlantirilgan!"
        )

    access_token = create_access_token(subject=user.id)
    return TokenResponse(access_token=access_token, user=user)


import uuid
from app.models.telegram_session import TelegramSession
from pydantic import BaseModel

class InitiateTelegramAuthResponse(BaseModel):
    session_id: str
    bot_url: str

@router.post("/initiate-telegram-auth", response_model=InitiateTelegramAuthResponse)
async def initiate_telegram_auth(req: InitiateTelegramAuthRequest, db: AsyncSession = Depends(get_db)):
    """Generate a session ID for Telegram Auth."""
    if req.phone:
        result = await db.execute(select(User).filter(User.phone == req.phone))
        if result.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ushbu telefon raqami oldin ro'yxatdan o'tgan. Iltimos, tizimga kiring."
            )

    if req.email:
        email_clean = req.email.strip().lower()
        result = await db.execute(select(User).filter(func.lower(User.email) == email_clean))
        if result.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bu emaildan oldin ro'yxatdan o'tilgan"
            )

    session_id = str(uuid.uuid4())
    
    password_hash = hash_password(req.password) if req.password else None
    
    new_session = TelegramSession(
        session_id=session_id,
        name=req.name,
        email=req.email,
        password_hash=password_hash
    )
    db.add(new_session)
    await db.commit()
    
    return InitiateTelegramAuthResponse(
        session_id=session_id,
        bot_url=f"https://t.me/zoovita_login_bot?start={session_id}"
    )

@router.get("/check-telegram-auth/{session_id}", response_model=TokenResponse)
async def check_telegram_auth(session_id: str, db: AsyncSession = Depends(get_db)):
    """Check if the session has been authenticated via Telegram."""
    result = await db.execute(select(TelegramSession).filter(TelegramSession.session_id == session_id))
    t_session = result.scalars().first()
    
    if not t_session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
        
    if not t_session.is_authenticated:
        raise HTTPException(status_code=status.HTTP_202_ACCEPTED, detail="Pending authentication")
        
    # User is authenticated
    result = await db.execute(select(User).filter(User.phone == t_session.phone))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found after auth")
        
    # Optional: Delete the session to prevent replay attacks
    await db.delete(t_session)
    await db.commit()
    
    access_token = create_access_token(subject=user.id)
    return TokenResponse(access_token=access_token, user=user)
from fastapi.responses import HTMLResponse

@router.get("/redirect-to-app")
async def redirect_to_app(token: Optional[str] = None):
    """Redirect user back to the mobile app using deep link."""
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Zoovita Ilovasiga Qaytish</title>
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #F7FBF4; color: #2B3D26; text-align: center; padding: 20px; }}
            .loader {{ border: 4px solid #E6F4EA; border-top: 4px solid #3C8E2D; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 20px; }}
            @keyframes spin {{ 0% {{ transform: rotate(0deg); }} 100% {{ transform: rotate(360deg); }} }}
            .btn {{ margin-top: 20px; padding: 12px 24px; background-color: #3C8E2D; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }}
        </style>
    </head>
    <body>
        <div class="loader"></div>
        <h2>Ilovaga qaytarilmoqda...</h2>
        <p>Agar ilova avtomatik ochilmasa, quyidagi tugmani bosing:</p>
        <a href="exp://10.20.19.169:19000/--/login?token={token or ''}" class="btn">Ilovani ochish (Expo)</a>
        <a href="zoovita://app" class="btn" style="margin-top: 12px; background-color: #A3B1A0;">Ilovani ochish (Asl)</a>
        
        <script>
            // Try to redirect to Expo Go first, then fallback to standalone app scheme
            window.location.href = "exp://10.20.19.169:19000/--/login?token={token or ''}";
            setTimeout(function() {{
                window.location.href = "zoovita://app";
            }}, 800);
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@router.get("/reset-password-redirect")
async def reset_password_redirect(token: str):
    """Redirect user back to the mobile app for password reset using deep link."""
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Zoovita: Parolni Tiklash</title>
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #F7FBF4; color: #2B3D26; text-align: center; padding: 20px; }}
            .loader {{ border: 4px solid #E6F4EA; border-top: 4px solid #3C8E2D; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 20px; }}
            @keyframes spin {{ 0% {{ transform: rotate(0deg); }} 100% {{ transform: rotate(360deg); }} }}
            .btn {{ margin-top: 20px; padding: 12px 24px; background-color: #3C8E2D; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }}
        </style>
    </head>
    <body>
        <div class="loader"></div>
        <h2>Ilovaga qaytarilmoqda...</h2>
        <p>Agar ilova avtomatik ochilmasa, quyidagi tugmani bosing:</p>
        <a href="exp://10.20.19.169:19000/--/reset-password?token={token}" class="btn">Ilovani ochish (Expo)</a>
        <a href="zoovita://reset-password?token={token}" class="btn" style="margin-top: 12px; background-color: #A3B1A0;">Ilovani ochish (Asl)</a>
        
        <script>
            // Try to redirect to Expo Go first, then fallback to standalone app scheme
            window.location.href = "exp://10.20.19.169:19000/--/reset-password?token={token}";
            setTimeout(function() {{
                window.location.href = "zoovita://reset-password?token={token}";
            }}, 800);
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest, background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    """Generate password reset token and send email via SMTP."""
    print(f"DEBUG: req.phone='{req.phone}', req.email='{req.email}'")
    if req.phone:
        result = await db.execute(select(User).filter(User.phone == req.phone, User.email == req.email))
    else:
        result = await db.execute(select(User).filter(User.email == req.email))
        
    user = result.scalars().first()
    
    if not user:
        if req.phone:
            raise HTTPException(status_code=404, detail="Kiritilgan telefon raqami yoki email tizimda topilmadi. Iltimos, ma'lumotlarni tekshiring.")
        raise HTTPException(status_code=404, detail="Bu email tizimda yo'q. Iltimos, ro'yxatdan o'tgan emailingizni kiriting.")
        
    reset_token = str(uuid.uuid4())
    user.reset_password_token = reset_token
    user.reset_password_expires = datetime.utcnow() + timedelta(minutes=3)
    
    await db.commit()
    
    # Send email in background
    deep_link = f"http://10.20.19.169:8000/api/v1/auth/reset-password-redirect?token={reset_token}"
    background_tasks.add_task(send_reset_email, req.email, deep_link)
    
    return {"message": "Parolni tiklash havolasi elektron pochtangizga yuborildi!"}

@router.post("/reset-password")
async def reset_password(req: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    """Reset password using token."""
    result = await db.execute(select(User).filter(User.reset_password_token == req.token))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=400, detail="Yaroqsiz yoki eskirgan token!")
        
    if user.reset_password_expires and user.reset_password_expires < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token muddati tugagan!")
        
    user.password_hash = hash_password(req.new_password)
    user.reset_password_token = None
    user.reset_password_expires = None
    
    await db.commit()
    return {"message": "Parolingiz muvaffaqiyatli o'zgartirildi!"}

from app.models.banner import Banner

@router.get("/banners")
async def get_public_banners(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Banner).filter(Banner.is_active == True).order_by(Banner.id.desc()))
    banners = result.scalars().all()
    return [
        {
            "id": b.id,
            "image": b.image_url
        }
        for b in banners
    ]

from app.models.category import Category

@router.get("/categories")
async def get_public_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category).order_by(Category.id.desc()))
    categories = result.scalars().all()
    return [
        {
            "id": c.id,
            "name": c.name,
            "image": c.image_url,
            "section": c.section
        }
        for c in categories
    ]

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token yaroqsiz yoki muddati tugagan",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    result = await db.execute(select(User).filter(User.id == int(user_id)))
    user = result.scalars().first()
    if user is None:
        raise credentials_exception
    return user

@router.get("/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "phone": current_user.phone,
        "email": current_user.email,
        "avatar": current_user.avatar,
        "is_active": current_user.is_active
    }
