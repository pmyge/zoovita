import requests
import asyncio
from app.database import async_session
from sqlalchemy.future import select
from app.models.chat import Chat, Message
from app.models.user import User

async def main():
    async with async_session() as db:
        chat = await db.execute(select(Chat))
        first_chat = chat.scalars().first()
        if not first_chat:
            print("No chats found")
            return
            
        print(f"Testing chat {first_chat.id}")
        
        user = await db.execute(select(User).filter(User.id == first_chat.buyer_id))
        buyer = user.scalars().first()
        
        print(f"Buyer ID: {buyer.id}")
        
        # Test the endpoint by directly simulating the query
        msg_query = select(Message).filter(Message.chat_id == first_chat.id).order_by(Message.created_at.asc())
        msg_result = await db.execute(msg_query)
        messages = msg_result.scalars().all()
        
        res = [
            {
                "id": m.id,
                "text": m.text,
                "sender_id": m.sender_id,
                "is_me": m.sender_id == buyer.id,
                "created_at": m.created_at.isoformat() if m.created_at else None
            } for m in messages
        ]
        
        print(res)

if __name__ == "__main__":
    asyncio.run(main())
