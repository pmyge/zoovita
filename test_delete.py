import requests
import json
import sys

API_URL = "https://api.zoovita.uz/api/v1/admin"

def main():
    # 1. Login as Admin
    print("Logging in as admin...")
    login_res = requests.post(f"{API_URL}/login", json={
        "username": "+998901234567",  # We need the real admin phone and password, or we can just fetch users
        "password": "adminpassword" # Wait, I don't know the admin password!
    })
    
    # Wait, if we don't know the admin credentials, we can't test it this way.
    # But wait! The admin endpoints don't even check the token!
    # Let's check admin.py line 58.
    pass
    
if __name__ == "__main__":
    main()
