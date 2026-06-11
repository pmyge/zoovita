from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import or_
from typing import List, Optional
from app.database import get_db
from app.models.chat import Chat, Message
from app.models.ad import Ad
from app.models.user import User
from app.api.endpoints.auth import get_current_user

router = APIRouter()

@router.get("")
async def get_chats(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = select(Chat).options(
        selectinload(Chat.ad),
        selectinload(Chat.buyer),
        selectinload(Chat.seller)
    ).filter(
        or_(Chat.buyer_id == current_user.id, Chat.seller_id == current_user.id)
    ).order_by(Chat.created_at.desc())
    
    result = await db.execute(query)
    chats = result.scalars().all()
    
    response = []
    for chat in chats:
        other_user = chat.seller if chat.buyer_id == current_user.id else chat.buyer
        response.append({
            "id": chat.id,
            "ad_id": chat.ad_id,
            "ad_title": chat.ad.title if chat.ad else "O'chirilgan e'lon",
            "ad_image": chat.ad.images.split(",")[0] if chat.ad and chat.ad.images else None,
            "other_user_id": other_user.id if other_user else None,
            "other_user_name": other_user.name if other_user else "Noma'lum",
            "created_at": chat.created_at
        })
    return response

@router.post("")
async def create_or_get_chat(
    ad_id: int = Form(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if ad exists
    ad_query = await db.execute(select(Ad).filter(Ad.id == ad_id))
    ad = ad_query.scalar_one_or_none()
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")
        
    if ad.user_id == current_user.id:
        raise HTTPException(status_code=400, detail="O'zingizning e'loningizga xabar yoza olmaysiz")

    # Check if chat exists
    chat_query = await db.execute(
        select(Chat).filter(Chat.ad_id == ad_id, Chat.buyer_id == current_user.id, Chat.seller_id == ad.user_id)
    )
    existing_chat = chat_query.scalar_one_or_none()
    
    if existing_chat:
        return {"chat_id": existing_chat.id}
        
    # Create new chat
    new_chat = Chat(
        ad_id=ad_id,
        buyer_id=current_user.id,
        seller_id=ad.user_id
    )
    db.add(new_chat)
    await db.commit()
    await db.refresh(new_chat)
    return {"chat_id": new_chat.id}

@router.get("/{chat_id}/messages")
async def get_messages(
    chat_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    chat_query = await db.execute(select(Chat).filter(Chat.id == chat_id))
    chat = chat_query.scalar_one_or_none()
    
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
        
    if chat.buyer_id != current_user.id and chat.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Ruxsat etilmagan")
        
    msg_query = select(Message).filter(Message.chat_id == chat_id).order_by(Message.created_at.asc())
    msg_result = await db.execute(msg_query)
    messages = msg_result.scalars().all()
    
    return [
        {
            "id": m.id,
            "text": m.text,
            "sender_id": m.sender_id,
            "is_me": m.sender_id == current_user.id,
            "created_at": m.created_at
        } for m in messages
    ]

@router.post("/{chat_id}/messages")
async def send_message(
    chat_id: int,
    text: str = Form(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    chat_query = await db.execute(select(Chat).filter(Chat.id == chat_id))
    chat = chat_query.scalar_one_or_none()
    
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
        
    if chat.buyer_id != current_user.id and chat.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Ruxsat etilmagan")
        
    new_message = Message(
        chat_id=chat_id,
        sender_id=current_user.id,
        text=text
    )
    db.add(new_message)
    
    # Create notification for the receiver
    from app.models.notification import Notification
    receiver_id = chat.seller_id if current_user.id == chat.buyer_id else chat.buyer_id
    notif = Notification(
        user_id=receiver_id,
        title="Yangi xabar",
        message=f"{current_user.name} sizga xabar yubordi: {text[:30]}...",
        type="new_message"
    )
    db.add(notif)
    
    await db.commit()
    await db.refresh(new_message)
    
    return {
        "id": new_message.id,
        "text": new_message.text,
        "sender_id": new_message.sender_id,
        "is_me": True,
        "created_at": new_message.created_at
    }
