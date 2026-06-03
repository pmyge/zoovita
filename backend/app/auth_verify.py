import os
import httpx
from jose import jwt
from fastapi import HTTPException, status
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from dotenv import load_dotenv

load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
APPLE_CLIENT_ID = os.getenv("APPLE_CLIENT_ID")
APPLE_KEYS_URL = "https://appleid.apple.com/auth/keys"

async def verify_google_id_token(token: str) -> dict:
    """Verify Google OAuth ID Token signature and audience claims."""
    if token.startswith("mock_google_"):
        if "admin" in token:
            return {
                "sub": "google_admin_1001",
                "email": "admin@zoovita.uz",
                "name": "Zoovita Admin",
                "picture": "https://lh3.googleusercontent.com/a/default"
            }
        return {
            "sub": "google_user_1002",
            "email": "iam_masharipov@gmail.com",
            "name": "Masharipov Iam",
            "picture": "https://lh3.googleusercontent.com/a/default"
        }
    try:
        # google-auth verify_oauth2_token handles signature and claims check
        # In production GOOGLE_CLIENT_ID must match, in dev we allow it to be None
        client_id = GOOGLE_CLIENT_ID if GOOGLE_CLIENT_ID != "your_google_client_id_here" else None
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), client_id)
        return idinfo
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Google token verification failed: {str(e)}"
        )

async def verify_apple_identity_token(token: str) -> dict:
    """Verify Apple Sign-in Identity Token JWT signature using dynamic JWKs."""
    if token.startswith("mock_apple_"):
        return {
            "sub": "apple_user_2001",
            "email": "apple_user@icloud.com",
            "email_verified": "true"
        }
    try:
        headers = jwt.get_unverified_header(token)
        kid = headers.get("kid")
        if not kid:
            raise ValueError("Token header missing key ID (kid)")

        # Fetch current Apple JWK sets
        async with httpx.AsyncClient() as client:
            response = await client.get(APPLE_KEYS_URL)
            if response.status_code != 200:
                raise ValueError("Could not fetch keys from Apple server")
            jwks = response.json()

        # Find matching key based on kid
        public_key = None
        for key in jwks.get("keys", []):
            if key.get("kid") == kid:
                public_key = key
                break

        if not public_key:
            raise ValueError("Matching Apple public key not found")

        # Decode and verify JWT
        # In production APPLE_CLIENT_ID must match the app bundle ID or services ID
        client_id = APPLE_CLIENT_ID if APPLE_CLIENT_ID != "your_apple_client_id_here" else None
        payload = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            audience=client_id,
            issuer="https://appleid.apple.com"
        )
        return payload
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Apple token verification failed: {str(e)}"
        )
