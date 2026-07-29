import json

new_keys = {
    'uz': {
        "add_preview_title": "E'lon ko'rinishi (Preview)",
        "currency_uzs": "so'm",
        "just_now": "Hozirgina",
        "ad_details_title": "E'lon tafsilotlari",
        "detail_name": "Ism:",
        "detail_phone": "Telefon:",
        "detail_email": "Email:",
        "detail_telegram": "Telegram:",
        "not_entered": "Kiritilmagan",
        "detail_delivery": "Yetkazib berish:",
        "delivery_available": "Mavjud (Bor)",
        "delivery_unavailable": "Mavjud emas (Yo'q)",
        "detail_desc": "Tavsif:",
        "desc_empty": "Batafsil ma'lumot berilmagan."
    },
    'ru': {
        "add_preview_title": "Предпросмотр объявления",
        "currency_uzs": "сум",
        "just_now": "Только что",
        "ad_details_title": "Детали объявления",
        "detail_name": "Имя:",
        "detail_phone": "Телефон:",
        "detail_email": "Email:",
        "detail_telegram": "Telegram:",
        "not_entered": "Не указано",
        "detail_delivery": "Доставка:",
        "delivery_available": "Доступна (Есть)",
        "delivery_unavailable": "Недоступна (Нет)",
        "detail_desc": "Описание:",
        "desc_empty": "Подробная информация не предоставлена."
    },
    'en': {
        "add_preview_title": "Ad Preview",
        "currency_uzs": "UZS",
        "just_now": "Just now",
        "ad_details_title": "Ad Details",
        "detail_name": "Name:",
        "detail_phone": "Phone:",
        "detail_email": "Email:",
        "detail_telegram": "Telegram:",
        "not_entered": "Not entered",
        "detail_delivery": "Delivery:",
        "delivery_available": "Available",
        "delivery_unavailable": "Unavailable",
        "detail_desc": "Description:",
        "desc_empty": "Detailed information is not provided."
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

# Replace App.js strings in the preview section
code = code.replace("<Text style={styles.previewSectionTitle}>E'lon ko'rinishi (Preview)</Text>", "<Text style={styles.previewSectionTitle}>{t('add_preview_title')}</Text>")
code = code.replace("} so'm</Text>", "} {t('currency_uzs')}</Text>")
code = code.replace("<Text style={styles.previewMetaText}>Hozirgina</Text>", "<Text style={styles.previewMetaText}>{t('just_now')}</Text>")
code = code.replace("<Text style={styles.previewDetailsTitle}>E'lon tafsilotlari</Text>", "<Text style={styles.previewDetailsTitle}>{t('ad_details_title')}</Text>")

code = code.replace("<Text style={styles.detailLabel}>Ism:</Text>", "<Text style={styles.detailLabel}>{t('detail_name')}</Text>")
code = code.replace("<Text style={styles.detailLabel}>Telefon:</Text>", "<Text style={styles.detailLabel}>{t('detail_phone')}</Text>")
code = code.replace("<Text style={styles.detailLabel}>Email:</Text>", "<Text style={styles.detailLabel}>{t('detail_email')}</Text>")
code = code.replace("<Text style={styles.detailLabel}>Telegram:</Text>", "<Text style={styles.detailLabel}>{t('detail_telegram')}</Text>")
code = code.replace("{addContactTelegram || \"Kiritilmagan\"}", "{addContactTelegram || t('not_entered')}")

code = code.replace("<Text style={styles.detailLabel}>Yetkazib berish:</Text>", "<Text style={styles.detailLabel}>{t('detail_delivery')}</Text>")
code = code.replace("{addDelivery ? \"Mavjud (Bor)\" : \"Mavjud emas (Yo'q)\"}", "{addDelivery ? t('delivery_available') : t('delivery_unavailable')}")

code = code.replace("<Text style={[styles.detailLabel, { marginTop: 12, marginBottom: 4 }]}>Tavsif:</Text>", "<Text style={[styles.detailLabel, { marginTop: 12, marginBottom: 4 }]}>{t('detail_desc')}</Text>")
code = code.replace("{addDesc || \"Batafsil ma'lumot berilmagan.\"}", "{addDesc || t('desc_empty')}")

with open('mobile-app/App.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Preview UI patched!")
