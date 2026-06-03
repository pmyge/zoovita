from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.schemas.auth import (
    TokenResponse,
    PhoneRegisterRequest,
    PhoneLoginRequest,
    GoogleLoginRequest,
    AppleLoginRequest
)
from app.security import hash_password, verify_password, create_access_token
from app.auth_verify import verify_google_id_token, verify_apple_identity_token

router = APIRouter()

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
    
    if not user or not user.password_hash or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Telefon raqam yoki parol noto'g'ri!"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Foydalanuvchi hisobi faolsizlantirilgan!"
        )

    access_token = create_access_token(subject=user.id)
    return TokenResponse(access_token=access_token, user=user)


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
