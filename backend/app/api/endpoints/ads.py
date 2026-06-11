from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from datetime import datetime
import uuid
import shutil
import os

from app.database import get_db
from app.models.ad import Ad
from app.models.category import Category
from app.api.endpoints.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("")
async def create_ad(
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
        images=images_str,
        user_id=current_user.id
    )
    
    db.add(new_ad)
    await db.commit()
    await db.refresh(new_ad)
    
    return {"message": "E'lon muvaffaqiyatli qo'shildi!", "ad_id": new_ad.id}

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
            "category_id": ad.category_id,
            "user_id": ad.user_id,
            "created_at": ad.created_at,
            "seller": {
                "name": ad.user.name if ad.user else "Noma'lum",
                "phone": ad.user.phone if ad.user else ""
            } if ad.user else None
        })
        
    return response_ads
