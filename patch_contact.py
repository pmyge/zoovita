import json
import re

new_keys = {
    'uz': {
        "add_field_contact_name": "Ismingiz *",
        "add_ph_contact_name": "Masalan: Asror",
        "add_field_contact_phone": "Telefon raqami *",
        "add_field_contact_email": "Email manzil *",
        "add_field_contact_telegram": "Telegram username (majburiy emas)",
        "add_ph_contact_telegram": "Masalan: @zoovita_admin",
        "add_field_delivery": "Yetkazib berish (Dostavka) xizmati",
        "delivery_yes": "Bor",
        "delivery_no": "Yo'q"
    },
    'ru': {
        "add_field_contact_name": "Ваше имя *",
        "add_ph_contact_name": "Например: Асрор",
        "add_field_contact_phone": "Номер телефона *",
        "add_field_contact_email": "Email адрес *",
        "add_field_contact_telegram": "Telegram username (необязательно)",
        "add_ph_contact_telegram": "Например: @zoovita_admin",
        "add_field_delivery": "Услуга доставки",
        "delivery_yes": "Есть",
        "delivery_no": "Нет"
    },
    'en': {
        "add_field_contact_name": "Your name *",
        "add_ph_contact_name": "Example: Asror",
        "add_field_contact_phone": "Phone number *",
        "add_field_contact_email": "Email address *",
        "add_field_contact_telegram": "Telegram username (optional)",
        "add_ph_contact_telegram": "Example: @zoovita_admin",
        "add_field_delivery": "Delivery service",
        "delivery_yes": "Available",
        "delivery_no": "No"
    }
}

for lang, data in new_keys.items():
    filepath = f"mobile-app/src/locales/{lang}.json"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = json.load(f)
    content.update(data)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=2)

with open('mobile-app/App.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace App.js strings
code = code.replace("<Text style={styles.addFieldLabel}>Ismingiz *</Text>", "<Text style={styles.addFieldLabel}>{t('add_field_contact_name')}</Text>")
code = code.replace("placeholder=\"Masalan: Asror\"", "placeholder={t('add_ph_contact_name')}")

code = code.replace("<Text style={styles.addFieldLabel}>Telefon raqami *</Text>", "<Text style={styles.addFieldLabel}>{t('add_field_contact_phone')}</Text>")

code = code.replace("<Text style={styles.addFieldLabel}>Email manzil *</Text>", "<Text style={styles.addFieldLabel}>{t('add_field_contact_email')}</Text>")

code = code.replace("<Text style={styles.addFieldLabel}>Telegram username (majburiy emas)</Text>", "<Text style={styles.addFieldLabel}>{t('add_field_contact_telegram')}</Text>")
code = code.replace("placeholder=\"Masalan: @zoovita_admin\"", "placeholder={t('add_ph_contact_telegram')}")

code = code.replace("<Text style={[styles.addFieldLabel, { marginTop: 16 }]}>Yetkazib berish (Dostavka) xizmati</Text>", "<Text style={[styles.addFieldLabel, { marginTop: 16 }]}>{t('add_field_delivery')}</Text>")
code = code.replace("<Text style={[styles.chipText, addDelivery === true && styles.chipTextActive]}>Bor</Text>", "<Text style={[styles.chipText, addDelivery === true && styles.chipTextActive]}>{t('delivery_yes')}</Text>")
code = code.replace("<Text style={[styles.chipText, addDelivery === false && styles.chipTextActive]}>Yo'q</Text>", "<Text style={[styles.chipText, addDelivery === false && styles.chipTextActive]}>{t('delivery_no')}</Text>")

with open('mobile-app/App.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Contact UI patched!")
