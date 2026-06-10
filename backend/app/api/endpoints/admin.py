from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from typing import List, Optional

from app.database import get_db
from app.models.user import User
from app.security import verify_password, create_access_token

router = APIRouter()

class AdminLoginRequest(BaseModel):
    username: str
    password: str

class AdminLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin_name: str

class UserResponse(BaseModel):
    id: int
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    avatar: Optional[str] = None
    is_active: bool
    is_superuser: bool
    created_at: Optional[str] = None

@router.post("/login", response_model=AdminLoginResponse)
async def admin_login(request: AdminLoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.phone == request.username, User.is_superuser == True))
    admin_user = result.scalars().first()
    
    if not admin_user or not verify_password(request.password, admin_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Noto'g'ri foydalanuvchi nomi yoki parol",
        )
    
    access_token = create_access_token(subject=admin_user.id)
    return AdminLoginResponse(
        access_token=access_token,
        admin_name=admin_user.name
    )

@router.get("/users", response_model=List[UserResponse])
async def get_all_users(db: AsyncSession = Depends(get_db)):
    # In a real app, verify admin token here using a dependency.
    # For now, we will just return the users list.
    result = await db.execute(select(User).order_by(User.id.desc()))
    users = result.scalars().all()
    
    return [
        UserResponse(
            id=u.id,
            name=u.name,
            phone=u.phone,
            email=u.email,
            avatar=u.avatar,
            is_active=u.is_active,
            is_superuser=u.is_superuser,
            created_at=u.created_at.strftime("%Y-%m-%d %H:%M") if u.created_at else None
        ) for u in users
    ]

from fastapi import BackgroundTasks
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import shutil
import uuid
from app.models.banner import Banner
from app.models.category import Category

@router.get("/banners")
async def get_banners(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Banner).order_by(Banner.id.desc()))
    banners = result.scalars().all()
    return [
        {
            "id": b.id,
            "image": b.image_url,
            "status": "Faol" if b.is_active else "Faol emas",
            "createdAt": b.created_at.strftime("%Y-%m-%d %H:%M") if b.created_at else None
        }
        for b in banners
    ]

@router.post("/banners")
async def create_banner(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = f"uploads/banners/{filename}"
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    image_url = f"http://10.20.19.169:8000/uploads/banners/{filename}"
    
    new_banner = Banner(image_url=image_url)
    db.add(new_banner)
    await db.commit()
    await db.refresh(new_banner)
    
    return {"message": "Banner yuklandi", "id": new_banner.id, "image": image_url}

@router.delete("/banners/{banner_id}")
async def delete_banner(banner_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Banner).filter(Banner.id == banner_id))
    banner = result.scalars().first()
    if not banner:
        raise HTTPException(status_code=404, detail="Banner topilmadi")
    
    await db.delete(banner)
    await db.commit()
    return {"message": "Banner muvaffaqiyatli o'chirildi"}

@router.put("/banners/{banner_id}/toggle-status")
async def toggle_banner_status(banner_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Banner).filter(Banner.id == banner_id))
    banner = result.scalars().first()
    if not banner:
        raise HTTPException(status_code=404, detail="Banner topilmadi")
    
    banner.is_active = not banner.is_active
    await db.commit()
    return {"message": "Banner holati o'zgartirildi", "is_active": banner.is_active}

# --- CATEGORY ENDPOINTS ---

@router.post("/categories")
async def create_category(
    name: str = Form(...),
    section: str = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Fayl turi rasm bo'lishi kerak")
        
    filename = f"{uuid.uuid4().hex}_{file.filename}"
    filepath = f"uploads/categories/{filename}"
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Make sure to use the correct domain/IP in production or dynamically
    image_url = f"http://10.20.19.169:8000/uploads/categories/{filename}"
    
    new_cat = Category(name=name, section=section, image_url=image_url)
    db.add(new_cat)
    await db.commit()
    return {"message": "Kategoriya muvaffaqiyatli qo'shildi"}

@router.get("/categories")
async def get_admin_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category).order_by(Category.id.desc()))
    categories = result.scalars().all()
    return [
        {
            "id": c.id,
            "name": c.name,
            "image": c.image_url,
            "section": c.section,
            "createdAt": c.created_at.strftime("%Y-%m-%d %H:%M") if c.created_at else None
        }
        for c in categories
    ]

@router.delete("/categories/{category_id}")
async def delete_category(category_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category).filter(Category.id == category_id))
    cat = result.scalars().first()
    if not cat:
        raise HTTPException(status_code=404, detail="Kategoriya topilmadi")
    
    await db.delete(cat)
    await db.commit()
    return {"message": "Kategoriya muvaffaqiyatli o'chirildi"}

def send_otp_email(to_email: str, otp_code: str):
    sender_email = "masharipovergashboy555@gmail.com"
    sender_password = "jeomreyvfclgactc"
    
    msg = MIMEMultipart("alternative")
    msg['Subject'] = "Zoovita: Tasdiqlash kodi"
    msg['From'] = sender_email
    msg['To'] = to_email
    
    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #F7FBF4; padding: 20px; text-align: center;">
        <h2 style="color: #2B3D26;">Zoovita - Yangi foydalanuvchi</h2>
        <p style="color: #5C7153;">Tizimga yangi foydalanuvchi qo'shish uchun tasdiqlash kodi:</p>
        <h1 style="color: #3C8E2D; font-size: 32px; letter-spacing: 4px;">{otp_code}</h1>
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
    except Exception as e:
        print("Email jo'natishda xatolik yuz berdi:", e)

class SendOtpRequest(BaseModel):
    email: str

@router.post("/users/send-otp")
async def send_otp(req: SendOtpRequest, background_tasks: BackgroundTasks):
    import random
    otp_code = str(random.randint(100000, 999999))
    background_tasks.add_task(send_otp_email, req.email, otp_code)
    return {"message": "OTP yuborildi", "otp": otp_code}

class AddUserRequest(BaseModel):
    name: str
    phone: str
    email: str
    password: str
    status: str

from app.security import hash_password

@router.post("/users")
async def add_user(req: AddUserRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter((User.phone == req.phone) | (User.email == req.email)))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Telefon yoki email allaqachon ro'yxatdan o'tgan")
        
    new_user = User(
        name=req.name,
        phone=req.phone,
        email=req.email,
        is_active=(req.status == "Faol"),
        password_hash=hash_password(req.password)
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return {"message": "Foydalanuvchi qo'shildi", "user_id": new_user.id}

@router.delete("/users/{user_id}")
async def delete_user(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="Foydalanuvchi topilmadi")
    
    await db.delete(user)
    await db.commit()
    return {"message": "Foydalanuvchi muvaffaqiyatli o'chirildi"}
@router.put("/users/{user_id}/block")
async def block_user(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="Foydalanuvchi topilmadi")
    
    # Toggle active status
    user.is_active = not user.is_active
    await db.commit()
    
    status_str = "Faol" if user.is_active else "Faol emas"
    return {"message": f"Foydalanuvchi holati '{status_str}' ga o'zgartirildi"}
class EditUserRequest(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    status: Optional[str] = None

@router.put("/users/{user_id}")
async def edit_user(user_id: int, req: EditUserRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="Foydalanuvchi topilmadi")
    
    user.name = req.name
    if req.phone is not None:
        user.phone = req.phone
    if req.email is not None:
        user.email = req.email
    if req.status is not None:
        user.is_active = (req.status == "Faol")
        
    await db.commit()
    return {"message": "Foydalanuvchi muvaffaqiyatli yangilandi"}


