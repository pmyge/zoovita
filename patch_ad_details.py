import json
import re

new_keys = {
    'uz': {
        "success": "Muvaffaqiyatli",
        "ad_posted_success": "E'loningiz qabul qilindi!",
        "go_to_profile": "Profilga o'tish",
        "detail_desc_title": "Tavsif",
        "view_on_map": "Xaritada ko'rish",
        "similar_ads": "O'xshash e'lonlar",
        "write_message": "Xabar yozish",
        "error": "Xatolik",
        "phone_not_entered": "Telefon raqami kiritilmagan",
        "call_button": "Qo'ng'iroq qilish",
        "share_error": "Ulashishda xatolik yuz berdi",
        "share_message": "Zoovita ilovasida ushbu e'lonni ko'ring:",
        "share_details": "Batafsil:",
        "ad_details_page_title": "E'lon tafsiloti",
        "milk_short": "Sut:",
        "negotiable": "Kelishiladi",
        "ad_posted_time": "E'lon joylangan vaqt:",
        "active": "Faol"
    },
    'ru': {
        "success": "Успешно",
        "ad_posted_success": "Ваше объявление принято!",
        "go_to_profile": "Перейти в профиль",
        "detail_desc_title": "Описание",
        "view_on_map": "Посмотреть на карте",
        "similar_ads": "Похожие объявления",
        "write_message": "Написать сообщение",
        "error": "Ошибка",
        "phone_not_entered": "Номер телефона не указан",
        "call_button": "Позвонить",
        "share_error": "Ошибка при отправке",
        "share_message": "Посмотрите это объявление в приложении Zoovita:",
        "share_details": "Подробнее:",
        "ad_details_page_title": "Детали объявления",
        "milk_short": "Молоко:",
        "negotiable": "Договорная",
        "ad_posted_time": "Время публикации:",
        "active": "В сети"
    },
    'en': {
        "success": "Success",
        "ad_posted_success": "Your ad has been accepted!",
        "go_to_profile": "Go to profile",
        "detail_desc_title": "Description",
        "view_on_map": "View on map",
        "similar_ads": "Similar ads",
        "write_message": "Write message",
        "error": "Error",
        "phone_not_entered": "Phone number not entered",
        "call_button": "Call",
        "share_error": "Error while sharing",
        "share_message": "Check out this ad on Zoovita app:",
        "share_details": "Details:",
        "ad_details_page_title": "Ad Details",
        "milk_short": "Milk:",
        "negotiable": "Negotiable",
        "ad_posted_time": "Time posted:",
        "active": "Active"
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

# Success Alert
code = code.replace("Alert.alert(\"Muvaffaqiyatli\", \"E'loningiz qabul qilindi!\");", "Alert.alert(t('success'), t('ad_posted_success'));")

# Specs (Yoshi, Zoti, etc are already translated or we'll translate their labels)
code = code.replace("{ icon: 'calendar', label: 'Yoshi', value: listing.age }", "{ icon: 'calendar', label: t('add_field_age') || 'Yoshi', value: listing.age }")
code = code.replace("{ icon: 'info', label: 'Zoti', value: listing.breed }", "{ icon: 'info', label: t('add_field_breed') || 'Zoti', value: listing.breed }")
code = code.replace("{ icon: 'activity', label: 'Holati', value: listing.health }", "{ icon: 'activity', label: t('add_field_health') || 'Holati', value: listing.health }")
code = code.replace("{ icon: 'droplet', label: 'Sutdorligi', value: listing.milk_yield }", "{ icon: 'droplet', label: t('add_field_milk') || 'Sutdorligi', value: listing.milk_yield }")
code = code.replace("{ icon: 'anchor', label: 'Vazni', value: listing.weight }", "{ icon: 'anchor', label: t('add_field_weight') || 'Vazni', value: listing.weight }")
code = code.replace("{ icon: 'check-circle', label: 'Emlangan', value: listing.vaccinated }", "{ icon: 'check-circle', label: t('add_field_vaccine') || 'Emlangan', value: listing.vaccinated }")
code = code.replace("{ icon: 'tool', label: 'Xizmat turi', value: listing.service_type }", "{ icon: 'tool', label: t('add_field_service_type') || 'Xizmat turi', value: listing.service_type }")
code = code.replace("{ icon: 'briefcase', label: 'Tajriba', value: listing.experience }", "{ icon: 'briefcase', label: t('add_field_experience') || 'Tajriba', value: listing.experience }")
code = code.replace("{ icon: 'box', label: 'Hajmi', value: listing.volume }", "{ icon: 'box', label: t('add_field_volume') || 'Hajmi', value: listing.volume }")

# Ad details page texts
code = code.replace("<Text style={styles.detailHeaderTitle}>E'lon tafsiloti</Text>", "<Text style={styles.detailHeaderTitle}>{t('ad_details_page_title')}</Text>")

# Share texts
code = code.replace("message: `Zoovita ilovasida ushbu e'lonni ko'ring: ${listing.title} - ${listing.price}\\nBatafsil: https://zoovita.uz/ad/${listing.id}`", "message: `${t('share_message')} ${listing.title} - ${listing.price}\\n${t('share_details')} https://zoovita.uz/ad/${listing.id}`")
code = code.replace("Alert.alert(\"Xatolik\", \"Ulashishda xatolik yuz berdi\");", "Alert.alert(t('error'), t('share_error'));")

# Quick Attribute Chips
code = code.replace("{listing.gender === 'female' ? 'Urg\\'ochi' : 'Erkak'}", "{listing.gender === 'female' ? t('gender_female') : t('gender_male')}")
code = code.replace("Sut: {listing.milk_yield}", "{t('milk_short')} {listing.milk_yield}")

# Price block
code = code.replace("<Text style={styles.detailPriceChipText}>Kelishiladi</Text>", "<Text style={styles.detailPriceChipText}>{t('negotiable')}</Text>")
code = code.replace("E'lon joylangan vaqt: ", "{t('ad_posted_time')} ")
code = code.replace("<Text style={styles.detailSellerStatus}>Faol</Text>", "<Text style={styles.detailSellerStatus}>{t('active')}</Text>")
code = code.replace("<Text style={styles.detailProfileBtnText}>Profilga o'tish</Text>", "<Text style={styles.detailProfileBtnText}>{t('go_to_profile')}</Text>")

# Description
code = code.replace("<Text style={styles.detailSectionTitle}>Tavsif</Text>", "<Text style={styles.detailSectionTitle}>{t('detail_desc_title')}</Text>")
code = code.replace("listing.description ? listing.description : \"Batafsil ma'lumot berilmagan.\"", "listing.description ? listing.description : t('desc_empty')")

# Location & Map
code = code.replace("<Text style={styles.detailSectionTitle}>Joylashuv</Text>", "<Text style={styles.detailSectionTitle}>{t('location')}</Text>")
code = code.replace("<Text style={styles.detailMapBtnText}>Xaritada ko'rish</Text>", "<Text style={styles.detailMapBtnText}>{t('view_on_map')}</Text>")

# Similar Ads
code = code.replace("<Text style={styles.detailSimilarTitle}>O'xshash e'lonlar</Text>", "<Text style={styles.detailSimilarTitle}>{t('similar_ads')}</Text>")

# Action buttons
code = code.replace("<Text style={styles.detailChatBtnText}>Xabar yozish</Text>", "<Text style={styles.detailChatBtnText}>{t('write_message')}</Text>")
code = code.replace("<Text style={styles.detailCallBtnText}>Qo'ng'iroq qilish</Text>", "<Text style={styles.detailCallBtnText}>{t('call_button')}</Text>")
code = code.replace("Alert.alert(\"Xatolik\", \"Telefon raqami kiritilmagan\");", "Alert.alert(t('error'), t('phone_not_entered'));")

with open('mobile-app/App.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Ad Details UI patched!")
