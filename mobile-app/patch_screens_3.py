import json
import re

new_keys = {
    'uz': {
        "details": "Tafsilotlar",
        "logout": "Tizimdan chiqish",
        "chat_tab_buying": "Sotib olaman",
        "chat_tab_selling": "Sotaman",
        "no_messages": "Xabarlar mavjud emas",
        "no_chats_buying": "Hozircha sizda sotuvchilar bilan hech qanday suhbat yo'q.",
        "no_chats_selling": "Hozircha sizda xaridorlar bilan hech qanday suhbat yo'q.",
        "profile_help_title": "Yordam markazi",
        "profile_help_sub": "Savollaringiz bormi? Biz yordam beramiz",
        "profile_contact_title": "Biz bilan bog'lanish",
        "profile_contact_sub": "Telefon, chat va email orqali",
        "profile_terms_title": "Foydalanish shartlari",
        "profile_terms_sub": "Qoidalar va shartlar",
        "profile_privacy_title": "Maxfiylik siyosati",
        "profile_privacy_sub": "Ma'lumotlaringiz xavfsizligi",
        "profile_language_title": "Tilni o'zgartirish",
        "profile_language_sub": "Ilova tilini tanlash"
    },
    'ru': {
        "details": "Детали",
        "logout": "Выйти",
        "chat_tab_buying": "Покупаю",
        "chat_tab_selling": "Продаю",
        "no_messages": "Нет сообщений",
        "no_chats_buying": "У вас пока нет переписок с продавцами.",
        "no_chats_selling": "У вас пока нет переписок с покупателями.",
        "profile_help_title": "Центр помощи",
        "profile_help_sub": "Есть вопросы? Мы поможем",
        "profile_contact_title": "Связаться с нами",
        "profile_contact_sub": "Через телефон, чат и email",
        "profile_terms_title": "Условия использования",
        "profile_terms_sub": "Правила и условия",
        "profile_privacy_title": "Политика конфиденциальности",
        "profile_privacy_sub": "Безопасность ваших данных",
        "profile_language_title": "Изменить язык",
        "profile_language_sub": "Выбрать язык приложения"
    },
    'en': {
        "details": "Details",
        "logout": "Log out",
        "chat_tab_buying": "Buying",
        "chat_tab_selling": "Selling",
        "no_messages": "No messages available",
        "no_chats_buying": "You currently have no conversations with sellers.",
        "no_chats_selling": "You currently have no conversations with buyers.",
        "profile_help_title": "Help Center",
        "profile_help_sub": "Have questions? We can help",
        "profile_contact_title": "Contact Us",
        "profile_contact_sub": "Via phone, chat and email",
        "profile_terms_title": "Terms of Use",
        "profile_terms_sub": "Terms and conditions",
        "profile_privacy_title": "Privacy Policy",
        "profile_privacy_sub": "Security of your data",
        "profile_language_title": "Change language",
        "profile_language_sub": "Select app language"
    }
}

for lang, data in new_keys.items():
    filepath = f"src/locales/{lang}.json"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = json.load(f)
    content.update(data)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=2)

print("JSON files updated!")

with open('App.js', 'r', encoding='utf-8') as f:
    code = f.read()

replacements = [
    (r"default: return 'Tafsilotlar';", r"default: return t('details') || 'Tafsilotlar';"),
    (r"<Text style=\{styles\.profileLogoutBtnText\}>Tizimdan chiqish</Text>", r"<Text style={styles.profileLogoutBtnText}>{t('logout')}</Text>"),
    (r"<Text style=\{\{ fontSize: 15, fontWeight: '700', color: chatTab === 'buying' \? '#3C8E2D' : '#6E8165' \}\}>Sotib olaman</Text>", r"<Text style={{ fontSize: 15, fontWeight: '700', color: chatTab === 'buying' ? '#3C8E2D' : '#6E8165' }}>{t('chat_tab_buying')}</Text>"),
    (r"<Text style=\{\{ fontSize: 15, fontWeight: '700', color: chatTab === 'selling' \? '#3C8E2D' : '#6E8165' \}\}>Sotaman</Text>", r"<Text style={{ fontSize: 15, fontWeight: '700', color: chatTab === 'selling' ? '#3C8E2D' : '#6E8165' }}>{t('chat_tab_selling')}</Text>"),
    (r"<Text style=\{styles\.emptyStateTitle\}>Xabarlar mavjud emas</Text>", r"<Text style={styles.emptyStateTitle}>{t('no_messages')}</Text>"),
    (r"<Text style=\{styles\.emptyStateSubtitle\}>Hozircha sizda \{chatTab === 'buying' \? 'sotuvchilar bilan' : 'xaridorlar bilan'\} hech qanday suhbat yo'q\.</Text>", r"<Text style={styles.emptyStateSubtitle}>{chatTab === 'buying' ? t('no_chats_buying') : t('no_chats_selling')}</Text>"),
]

for pattern, repl in replacements:
    code = re.sub(pattern, repl, code)

with open('App.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("App.js updated!")
