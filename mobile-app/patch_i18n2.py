import json

files = ['uz.json', 'ru.json', 'en.json']

new_keys = {
    'uz': {
        "add_btn_continue": "Davom etish",
        "add_field_location": "Joylashuv",
        "add_location_unknown": "Joylashuv aniqlanmagan",
        "add_btn_gps": "Mening joylashuvimni aniqlash (GPS)",
        "add_field_phone": "Telefon raqami",
        "add_btn_back": "Orqaga qaytish",
        "add_btn_finish": "E'lonni yuborish"
    },
    'ru': {
        "add_btn_continue": "Продолжить",
        "add_field_location": "Местоположение",
        "add_location_unknown": "Местоположение не определено",
        "add_btn_gps": "Определить мое местоположение (GPS)",
        "add_field_phone": "Номер телефона",
        "add_btn_back": "Назад",
        "add_btn_finish": "Опубликовать объявление"
    },
    'en': {
        "add_btn_continue": "Continue",
        "add_field_location": "Location",
        "add_location_unknown": "Location unknown",
        "add_btn_gps": "Detect my location (GPS)",
        "add_field_phone": "Phone number",
        "add_btn_back": "Go back",
        "add_btn_finish": "Submit Ad"
    }
}

for lang, data in new_keys.items():
    filepath = f"src/locales/{lang}.json"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = json.load(f)
    content.update(data)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=2)

print("JSON files updated successfully again!")
