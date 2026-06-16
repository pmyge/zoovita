import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import async_session
import sqlalchemy

async def main():
    async with async_session() as db:
        user_id = 999999
        try:
            print("1. Delete messages from user's ads chats...")
            await db.execute(sqlalchemy.text("""
                DELETE FROM messages WHERE chat_id IN (
                    SELECT id FROM chats WHERE ad_id IN (SELECT id FROM ads WHERE user_id = :uid)
                )
            """), {"uid": user_id})
            
            print("2. Delete chats related to user's ads...")
            await db.execute(sqlalchemy.text("""
                DELETE FROM chats WHERE ad_id IN (SELECT id FROM ads WHERE user_id = :uid)
            """), {"uid": user_id})
            
            print("3. Delete messages from user's chats...")
            await db.execute(sqlalchemy.text("""
                DELETE FROM messages WHERE chat_id IN (
                    SELECT id FROM chats WHERE buyer_id = :uid OR seller_id = :uid
                )
            """), {"uid": user_id})
            
            print("4. Delete user's chats...")
            await db.execute(sqlalchemy.text("DELETE FROM chats WHERE buyer_id = :uid OR seller_id = :uid"), {"uid": user_id})
            
            print("5. Delete user's other messages...")
            await db.execute(sqlalchemy.text("DELETE FROM messages WHERE sender_id = :uid"), {"uid": user_id})
            
            print("6. Delete user's ads...")
            await db.execute(sqlalchemy.text("DELETE FROM ads WHERE user_id = :uid"), {"uid": user_id})
            
            print("7. Delete user's notifications...")
            await db.execute(sqlalchemy.text("DELETE FROM notifications WHERE user_id = :uid"), {"uid": user_id})
            
            print("8. Delete user's addresses...")
            await db.execute(sqlalchemy.text("DELETE FROM addresses WHERE user_id = :uid"), {"uid": user_id})

            print("All SQL executed successfully without syntax errors!")
        except Exception as e:
            print(f"Error executing SQL: {e}")

if __name__ == "__main__":
    asyncio.run(main())
