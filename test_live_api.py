import requests
import time

API_URL = "https://api.zoovita.uz/api/v1/auth"
PHONE = f"+99890{int(time.time())}"[-13:] # some unique phone

print("Registering...")
res = requests.post(f"{API_URL}/register-phone", json={
    "name": "Bot Test",
    "phone": PHONE,
    "password": "Password123!"
})

if res.status_code != 201:
    print("Registration failed:", res.status_code, res.text)
    exit(1)

token = res.json()["access_token"]
print("Registered! Token:", token)

print("Adding address...")
res = requests.post(f"{API_URL}/addresses", json={
    "title": "Home",
    "address_text": "Tashkent, Uzbekistan"
}, headers={
    "Authorization": f"Bearer {token}"
})

print("Add address status:", res.status_code)
print("Add address response:", res.text)

print("Getting addresses...")
res = requests.get(f"{API_URL}/addresses", headers={
    "Authorization": f"Bearer {token}"
})

print("Get addresses status:", res.status_code)
print("Get addresses response:", res.text)
