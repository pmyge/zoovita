from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from fastapi.responses import HTMLResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from datetime import datetime
import uuid
import shutil
import os
import httpx
import asyncio
import urllib.parse
import json
from sqlalchemy import update
from app.database import AsyncSessionLocal

async def send_ad_to_telegram(ad_data: dict, image_urls: list):
    bot_token = "8638632041:AAGCkuYkMnvTLxJseS1VN0zurMxZUGWuF8c"
    channel_id = "-1002461052259"
    
    encoded_location = urllib.parse.quote(ad_data['location'])
    
    message = f"📢 <b>Yangi E'lon:</b> {ad_data['title']}\n\n"
    message += f"💰 <b>Narxi:</b> {ad_data['price']}\n"
    message += f"📍 <b>Manzil:</b> <a href='https://yandex.com/maps/?text={encoded_location}'>{ad_data['location']}</a>\n\n"
    message += f"📝 <b>Tavsif:</b>\n{ad_data['description']}\n\n"
    
    if ad_data.get('category'):
        message += f"📂 <b>Kategoriya:</b> {ad_data['category']}\n"
    if ad_data.get('breed'):
        message += f"🏷 <b>Zoti:</b> {ad_data['breed']}\n"
    if ad_data.get('age'):
        message += f"⏳ <b>Yoshi:</b> {ad_data['age']}\n"
        
    message += f"\n📞 <b>Aloqa:</b> {ad_data['contact_phone']} ({ad_data['contact_name']})"
    if ad_data.get('contact_telegram'):
        message += f"\n✈️ <b>Telegram:</b> {ad_data['contact_telegram']}"
        
    # message += "\n\n📱 <i>Zoovita ilovasi orqali yuborildi</i>"
    
    reply_markup = {
        "inline_keyboard": [[
            {"text": "📱 Ilovada Ko'rish", "url": f"https://api.zoovita.uz/api/v1/ads/redirect/{ad_data['id']}"}
        ]]
    }
    
    message_ids = []
    
    async with httpx.AsyncClient() as client:
        try:
            if image_urls and len(image_urls) > 0:
                if len(image_urls) == 1:
                    res = await client.post(
                        f"https://api.telegram.org/bot{bot_token}/sendPhoto",
                        json={"chat_id": channel_id, "photo": image_urls[0], "caption": message, "parse_mode": "HTML", "reply_markup": reply_markup}
                    )
                    if res.status_code == 200:
                        message_ids.append(res.json()['result']['message_id'])
                else:
                    # Send media group first without caption
                    media = []
                    for i, url in enumerate(image_urls[:10]):
                        media.append({"type": "photo", "media": url})
                        
                    res1 = await client.post(
                        f"https://api.telegram.org/bot{bot_token}/sendMediaGroup",
                        json={"chat_id": channel_id, "media": media}
                    )
                    if res1.status_code == 200:
                        for msg in res1.json().get('result', []):
                            message_ids.append(msg['message_id'])
                            
                    # Send text with inline button as a separate message
                    res2 = await client.post(
                        f"https://api.telegram.org/bot{bot_token}/sendMessage",
                        json={"chat_id": channel_id, "text": message, "parse_mode": "HTML", "reply_markup": reply_markup}
                    )
                    if res2.status_code == 200:
                        message_ids.append(res2.json()['result']['message_id'])
            else:
                res = await client.post(
                    f"https://api.telegram.org/bot{bot_token}/sendMessage",
                    json={"chat_id": channel_id, "text": message, "parse_mode": "HTML", "reply_markup": reply_markup}
                )
                if res.status_code == 200:
                    message_ids.append(res.json()['result']['message_id'])
            
            # Save message IDs to the database for later deletion
            if message_ids:
                async with AsyncSessionLocal() as session:
                    await session.execute(
                        update(Ad).where(Ad.id == ad_data['id']).values(telegram_message_id=json.dumps(message_ids))
                    )
                    await session.commit()
                    
        except Exception as e:
            print(f"Failed to post ad to Telegram: {e}")

from app.database import get_db
from app.models.ad import Ad
from app.models.category import Category
from app.api.endpoints.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("")
async def create_ad(
    background_tasks: BackgroundTasks,
    title: str = Form(...),
    description: str = Form(...),
    price: str = Form(...),
    location: str = Form(...),
    contact_name: str = Form(...),
    contact_phone: str = Form(...),
    category_id: int = Form(...),
    contact_email: Optional[str] = Form(None),
    contact_telegram: Optional[str] = Form(None),
    has_delivery: bool = Form(False),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    gender: Optional[str] = Form(None),
    age: Optional[str] = Form(None),
    breed: Optional[str] = Form(None),
    health: Optional[str] = Form(None),
    milk_yield: Optional[str] = Form(None),
    weight: Optional[str] = Form(None),
    vaccinated: Optional[str] = Form(None),
    service_type: Optional[str] = Form(None),
    experience: Optional[str] = Form(None),
    volume: Optional[str] = Form(None),
    images: List[UploadFile] = File(default=[]),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Process images
    os.makedirs("uploads/ads", exist_ok=True)
    image_urls = []
    for image in images:
        if image.filename:
            ext = image.filename.split(".")[-1]
            filename = f"{uuid.uuid4().hex}.{ext}"
            filepath = f"uploads/ads/{filename}"
            with open(filepath, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            
            # Use dynamically or the production domain
            image_url = f"https://api.zoovita.uz/uploads/ads/{filename}"
            image_urls.append(image_url)
            
    images_str = ",".join(image_urls) if image_urls else None

    new_ad = Ad(
        title=title,
        description=description,
        price=price,
        location=location,
        contact_name=contact_name,
        contact_phone=contact_phone,
        category_id=category_id,
        contact_email=contact_email,
        contact_telegram=contact_telegram,
        has_delivery=has_delivery,
        latitude=latitude,
        longitude=longitude,
        gender=gender,
        age=age,
        breed=breed,
        health=health,
        milk_yield=milk_yield,
        weight=weight,
        vaccinated=vaccinated,
        service_type=service_type,
        experience=experience,
        volume=volume,
        images=images_str,
        user_id=current_user.id
    )
    
    db.add(new_ad)
    
    # Create notification
    from app.models.notification import Notification
    notif = Notification(
        user_id=current_user.id, 
        title="E'loningiz qabul qilindi", 
        message=f"'{title}' nomli e'loningiz tizimga qo'shildi va tez orada ommaga ko'rinadi.", 
        type="new_ad"
    )
    db.add(notif)
    
    await db.commit()
    await db.refresh(new_ad)
    
    # Fetch category name for Telegram
    cat_result = await db.execute(select(Category).filter(Category.id == category_id))
    cat = cat_result.scalars().first()
    category_name = cat.name if cat else "Noma'lum"
    
    ad_data = {
        "id": new_ad.id,
        "title": title,
        "price": price,
        "location": location,
        "description": description,
        "category": category_name,
        "breed": breed,
        "age": age,
        "contact_phone": contact_phone,
        "contact_name": contact_name,
        "contact_telegram": contact_telegram
    }
    
    background_tasks.add_task(send_ad_to_telegram, ad_data, image_urls)
    
    return {"message": "E'lon muvaffaqiyatli qo'shildi!", "ad_id": new_ad.id}

@router.get("/redirect/{ad_id}")
async def redirect_to_ad(ad_id: int):
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Zoovita: E'lonni ko'rish</title>
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
        <a href="exp://172.20.10.2:19000/--/ad/{ad_id}" class="btn">Ilovani ochish (Expo)</a>
        <a href="zoovita://ad/{ad_id}" class="btn" style="margin-top: 12px; background-color: #A3B1A0;">Ilovani ochish (Asl)</a>
        
        <script>
            window.location.href = "exp://172.20.10.2:19000/--/ad/{ad_id}";
            setTimeout(function() {{
                window.location.href = "zoovita://ad/{ad_id}";
            }}, 800);
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@router.get("")
async def get_ads(
    category_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Ad).options(selectinload(Ad.user)).filter(Ad.is_active == True)
    if category_id:
        query = query.filter(Ad.category_id == category_id)
        
    query = query.order_by(Ad.created_at.desc())
    result = await db.execute(query)
    ads = result.scalars().all()
    
    # Format response
    response_ads = []
    for ad in ads:
        response_ads.append({
            "id": ad.id,
            "title": ad.title,
            "description": ad.description,
            "price": ad.price,
            "location": ad.location,
            "contact_name": ad.contact_name,
            "contact_phone": ad.contact_phone,
            "contact_email": ad.contact_email,
            "contact_telegram": ad.contact_telegram,
            "has_delivery": ad.has_delivery,
            "latitude": ad.latitude,
            "longitude": ad.longitude,
            "images": ad.images.split(",") if ad.images else [],
            "gender": ad.gender,
            "age": ad.age,
            "breed": ad.breed,
            "health": ad.health,
            "milk_yield": ad.milk_yield,
            "weight": ad.weight,
            "vaccinated": ad.vaccinated,
            "service_type": ad.service_type,
            "experience": ad.experience,
            "volume": ad.volume,
            "category_id": ad.category_id,
            "user_id": ad.user_id,
            "created_at": ad.created_at,
            "seller": {
                "name": ad.user.name if ad.user else "Noma'lum",
                "phone": ad.user.phone if ad.user else ""
            } if ad.user else None
        })
        
    return response_ads
