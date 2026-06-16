import asyncio
from fastapi.testclient import TestClient
from app.main import app

def test_address_endpoints():
    client = TestClient(app)
    
    # We need to simulate an authenticated user.
    # The endpoint depends on get_current_user. 
    # Let's mock get_current_user
    from app.api.endpoints.auth import get_current_user
    from app.models.user import User
    
    async def override_get_current_user():
        # Mock user
        mock_user = User(id=1, name="Test User")
        return mock_user

    app.dependency_overrides[get_current_user] = override_get_current_user
    
    print("Testing GET /addresses...")
    response = client.get("/api/v1/auth/addresses")
    print(response.status_code, response.text)
    
    print("Testing POST /addresses...")
    response = client.post("/api/v1/auth/addresses", json={
        "title": "Test Title",
        "address_text": "Test Address Text"
    })
    print(response.status_code, response.text)

if __name__ == "__main__":
    test_address_endpoints()
