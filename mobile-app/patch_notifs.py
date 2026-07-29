import json
import re

new_keys = {
    'uz': {
        "cat_1": "Hayvonlar sotiladi",
        "cat_2": "Oziq-ovqat va mahsulotlar",
        "cat_3": "Veterinariya xizmatlari",
        "cat_5": "Barchasi kategoriyalar",
        "ads_filter_title": "E'lonlar filtri",
        "ads_title": "E'lonlar",
        "notif_empty_2": "Bildirishnomalar mavjud emas",
        "notif_login_title": "Tizimga kirdingiz",
        "notif_ad_title": "E'loningiz qabul qilindi",
        "notif_msg_title": "Yangi xabar",
        "notif_msg_sent": "sizga xabar yubordi",
        "notif_ad_added": "nomli e'loningiz tizimga qo'shildi va tez orada ommaga ko'rinadi.",
        "notif_login_success": "Hisobingizga muvaffaqiyatli kirildi.",
        "notif_login_google": "Google orqali hisobingizga kirildi.",
        "notif_login_apple": "Apple orqali hisobingizga kirildi.",
        "notif_login_tg": "Telegram orqali hisobingizga kirildi."
    },
    'ru': {
        "cat_1": "Животные на продажу",
        "cat_2": "Продукты и товары",
        "cat_3": "Ветеринарные услуги",
        "cat_5": "Все категории",
        "ads_filter_title": "Фильтр объявлений",
        "ads_title": "Объявления",
        "notif_empty_2": "Нет уведомлений",
        "notif_login_title": "Вы вошли в систему",
        "notif_ad_title": "Ваше объявление принято",
        "notif_msg_title": "Новое сообщение",
        "notif_msg_sent": "отправил вам сообщение",
        "notif_ad_added": "объявление добавлено и скоро будет опубликовано.",
        "notif_login_success": "Вы успешно вошли в свой аккаунт.",
        "notif_login_google": "Вы вошли через Google.",
        "notif_login_apple": "Вы вошли через Apple.",
        "notif_login_tg": "Вы вошли через Telegram."
    },
    'en': {
        "cat_1": "Animals for sale",
        "cat_2": "Food and products",
        "cat_3": "Veterinary services",
        "cat_5": "All categories",
        "ads_filter_title": "Ads filter",
        "ads_title": "Advertisements",
        "notif_empty_2": "No notifications available",
        "notif_login_title": "You have logged in",
        "notif_ad_title": "Your ad was accepted",
        "notif_msg_title": "New message",
        "notif_msg_sent": "sent you a message",
        "notif_ad_added": "ad was added and will be public soon.",
        "notif_login_success": "You have successfully logged into your account.",
        "notif_login_google": "You logged in via Google.",
        "notif_login_apple": "You logged in via Apple.",
        "notif_login_tg": "You logged in via Telegram."
    }
}

for lang, data in new_keys.items():
    filepath = f"src/locales/{lang}.json"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = json.load(f)
    content.update(data)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=2)

print("JSON files updated with notification keys!")
