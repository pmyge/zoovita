import json
import re

new_keys = {
    'uz': {
        "region_select": "Viloyatni tanlang",
        "sort_modal_title": "E'lonlarni saralash",
        "sort_newest_first": "Yangi birinchi",
        "sort_cheap_first": "Arzonroq birinchi",
        "sort_exp_first": "Qimmatroq birinchi",
        "faq_title": "Ko'p beriladigan savollar (FAQ)",
        "faq_q1": "Qanday qilib e'lon berish mumkin?",
        "faq_a1": "Bosh sahifa yoki Bozor sahifasidagi pastki tablar orasidan markaziy '+' tugmasini bosing, barcha ma'lumotlarni bosqichma-bosqich to'ldiring va e'lonni tasdiqlang.",
        "faq_q2": "E'lon berish mutlaqo bepulmi?",
        "faq_a2": "Ha! Oddiy foydalanuvchilar uchun e'lon joylashtirish mutlaqo bepul. Agar siz e'loningiz tezroq sotilishini xohlasangiz, VIP xizmatlarni ulashingiz mumkin.",
        "faq_q3": "Yetkazib berish xizmati qanday ishlaydi?",
        "faq_a3": "Bozor sahifasidan xarid qilingan mahsulotlar hamkor kurerlarimiz orqali manzilingizga yetkaziladi. Yetkazib berish vaqti shahar ichida 2-4 soat, viloyatlararo esa 1-2 kunni tashkil etadi.",
        "faq_q4": "To'lov xavfsizligi kafolatlanganmi?",
        "faq_a4": "Ha. Zoovita orqali Click, Payme yoki plastik kartalar bilan amalga oshiriladigan barcha tranzaksiyalar shifrlangan va to'liq xavfsiz hisoblanadi.",
        "faq_q5": "Sotuvchi bilan qanday bog'lanish mumkin?",
        "faq_a5": "E'lon tafsilotlari sahifasining pastki qismida joylagan 'Qo'ng'iroq qilish' yoki 'Telegram orqali yozish' tugmalarini bosish orqali to'g'ridan-to'g'ri sotuvchi bilan aloqaga chiqasiz.",
        "faq_q6": "Premium obuna nima beradi?",
        "faq_a6": "Premium obuna sizga barcha mahsulotlarni bepul yetkazib berish, do'konlarda maxsus chegirmalar, VIP e'lon ko'rinishi hamda shaxsiy veterinar yordamidan foydalanish huquqini taqdim etadi.",
        "faq_not_found_title": "Savollaringizga javob topilmadi?",
        "faq_not_found_desc": "Bizning qo'llab-quvvatlash jamoamizga murojaat qiling.",
        "faq_write_btn": "Yozish",
        "contact_title": "Murojaat yuborish",
        "contact_cat_label": "Murojaat toifasi",
        "contact_text_label": "Murojaat matni",
        "contact_placeholder": "Savolingiz yoki muammoni bu yerda batafsil yozing...",
        "contact_send_btn": "Xabarni yuborish",
        "contact_quick": "Tezkor bog'lanish",
        "contact_phone": "Telefon orqali",
        "contact_tg": "Telegram guruh",
        "contact_email": "Elektron pochta",
        "contact_success_title": "Murojaatingiz qabul qilindi!",
        "contact_success_desc": "Xabaringiz yuborildi. Bizning operatorlarimiz tez orada (+998 90 123 45 67 raqamingiz orqali) aloqaga chiqishadi.",
        "contact_success_btn": "Tushunarli",
        "contact_subject_tech": "Texnik muammo",
        "contact_subject_fin": "Moliyaviy masala",
        "contact_subject_vet": "Veterinar yordami",
        "contact_subject_sugg": "Takliflar",
        "contact_subject_other": "Boshqa",
        "privacy_title": "Maxfiylik siyosati",
        "privacy_updated": "Oxirgi yangilanish: 20-may, 2026-yil",
        "privacy_p1": "Sizning maxfiyligingiz va shaxsiy ma'lumotlaringiz xavfsizligini ta'minlash bizning ustuvor vazifamizdir. Ushbu hujjat siz haqingizdagi qanday ma'lumotlar to'planishini bayon qiladi.",
        "privacy_h1": "1. Qanday ma'lumotlarni to'playmiz?",
        "privacy_a1": "Biz siz tizimdan ro'yxatdan o'tganingizda kiritgan ismingiz, telefon raqamingiz va email manzilingizni saqlaymiz. Shuningdek, ilovada joylashtirgan e'lonlaringiz, rasmlar va kiritgan manzillaringiz ma'lumotlar bazasida saqlanadi.",
        "privacy_h2": "2. Ma'lumotlardan qanday foydalanamiz?",
        "privacy_a2": "To'plangan ma'lumotlar faqat platforma xizmatlarini taqdim etish, sotuvchi bilan bog'lanish va ilova ishlash sifatini yaxshilash maqsadida qo'llaniladi. Shaxsiy ma'lumotlaringiz uchinchi shaxslarga sotilmaydi yoki ijaraga berilmaydi.",
        "privacy_h3": "3. Ma'lumotlar xavfsizligi",
        "privacy_a3": "Ma'lumotlar shifrlangan serverlarda saqlanadi va ruxsatsiz kirishlardan himoyalangan. Tranzaksiyalar SSL protokollari bilan amalga oshiriladi.",
        "region_all_uzb": "Barchasi (O'zbekiston)",
        "terms_title": "Foydalanish qoidalari va shartlari",
        "terms_updated": "Oxirgi yangilanish: 20-may, 2026-yil",
        "terms_p1": "Zoovita mobil ilovasiga xush kelibsiz. Ushbu ilovadan foydalanish orqali siz quyidagi shartlar va qoidalarga to'liq rozilik bildirasiz.",
        "terms_h1": "1. Xizmatlardan foydalanish shartlari",
        "terms_a1": "Foydalanuvchi tizimda e'lon berish paytida faqat haqiqiy va to'g'ri ma'lumotlarni taqdim etishi shart. O'zbekiston Respublikasi qonunchiligida taqiqlangan hayvonlar yoki buyumlarni ilova orqali sotish taqiqlanadi.",
        "terms_h2": "2. Foydalanuvchining majburiyatlari",
        "terms_a2": "Siz o'z hisobingiz parolini maxfiy saqlashga, shuningdek hisobingiz orqali amalga oshiriladigan barcha harakatlar uchun to'liq javobgar bo'lishga rozilik bildirasiz.",
        "terms_h3": "3. Javobgarlikni cheklash",
        "terms_a3": "Zoovita faqat sotuvchilar va xaridorlarni bog'lovchi onlayn platforma hisoblanadi. Biz sotilayotgan hayvonlar salomatligi yoki mahsulotlar sifati uchun bevosita javobgarlikni o'z zimmamizga olmaymiz. Har bir tranzaksiyadan oldin tekshirish tavsiya etiladi.",
        "notifications": "Bildirishnomalar",
        
        # Regions
        "reg_Toshkent_shahri": "Toshkent shahri",
        "reg_Toshkent_viloyati": "Toshkent viloyati",
        "reg_Samarqand_viloyati": "Samarqand viloyati",
        "reg_Buxoro_viloyati": "Buxoro viloyati",
        "reg_Andijon_viloyati": "Andijon viloyati",
        "reg_Farg_ona_viloyati": "Farg'ona viloyati",
        "reg_Namangan_viloyati": "Namangan viloyati",
        "reg_Qashqadaryo_viloyati": "Qashqadaryo viloyati",
        "reg_Surxondaryo_viloyati": "Surxondaryo viloyati",
        "reg_Jizzax_viloyati": "Jizzax viloyati",
        "reg_Sirdaryo_viloyati": "Sirdaryo viloyati",
        "reg_Xorazm_viloyati": "Xorazm viloyati",
        "reg_Navoiy_viloyati": "Navoiy viloyati",
        "reg_Qoraqalpog_iston_Res_": "Qoraqalpog'iston Res."
    },
    'ru': {
        "region_select": "Выберите регион",
        "sort_modal_title": "Сортировка объявлений",
        "sort_newest_first": "Сначала новые",
        "sort_cheap_first": "Сначала дешевые",
        "sort_exp_first": "Сначала дорогие",
        "faq_title": "Часто задаваемые вопросы (FAQ)",
        "faq_q1": "Как подать объявление?",
        "faq_a1": "Нажмите центральную кнопку '+' на главной странице или на странице рынка, поэтапно заполните всю информацию и подтвердите объявление.",
        "faq_q2": "Подача объявления абсолютно бесплатна?",
        "faq_a2": "Да! Размещение объявления для обычных пользователей совершенно бесплатно. Если вы хотите, чтобы ваше объявление продалось быстрее, вы можете подключить VIP-услуги.",
        "faq_q3": "Как работает служба доставки?",
        "faq_a3": "Товары, купленные на странице рынка, доставляются по вашему адресу нашими курьерами-партнерами. Время доставки составляет 2-4 часа в пределах города и 1-2 дня между регионами.",
        "faq_q4": "Гарантирована ли безопасность платежей?",
        "faq_a4": "Да. Все транзакции, совершаемые через Zoovita с помощью Click, Payme или пластиковых карт, зашифрованы и полностью безопасны.",
        "faq_q5": "Как связаться с продавцом?",
        "faq_a5": "Вы можете напрямую связаться с продавцом, нажав кнопки 'Позвонить' или 'Написать в Telegram', расположенные внизу страницы с описанием объявления.",
        "faq_q6": "Что дает премиум подписка?",
        "faq_a6": "Премиум подписка дает вам право на бесплатную доставку всех продуктов, специальные скидки в магазинах, видимость VIP-объявлений и доступ к личной ветеринарной помощи.",
        "faq_not_found_title": "Не нашли ответ на свой вопрос?",
        "faq_not_found_desc": "Пожалуйста, свяжитесь с нашей службой поддержки.",
        "faq_write_btn": "Написать",
        "contact_title": "Отправить запрос",
        "contact_cat_label": "Категория запроса",
        "contact_text_label": "Текст запроса",
        "contact_placeholder": "Подробно опишите ваш вопрос или проблему здесь...",
        "contact_send_btn": "Отправить сообщение",
        "contact_quick": "Быстрая связь",
        "contact_phone": "По телефону",
        "contact_tg": "Telegram группа",
        "contact_email": "Электронная почта",
        "contact_success_title": "Ваш запрос принят!",
        "contact_success_desc": "Ваше сообщение отправлено. Наши операторы свяжутся с вами в ближайшее время (по вашему номеру +998 90 123 45 67).",
        "contact_success_btn": "Понятно",
        "contact_subject_tech": "Техническая проблема",
        "contact_subject_fin": "Финансовый вопрос",
        "contact_subject_vet": "Ветеринарная помощь",
        "contact_subject_sugg": "Предложения",
        "contact_subject_other": "Другое",
        "privacy_title": "Политика конфиденциальности",
        "privacy_updated": "Последнее обновление: 20 мая 2026 г.",
        "privacy_p1": "Обеспечение вашей конфиденциальности и безопасности вашей личной информации является нашим главным приоритетом. В этом документе описывается, какая информация о вас собирается.",
        "privacy_h1": "1. Какую информацию мы собираем?",
        "privacy_a1": "Мы сохраняем ваше имя, номер телефона и адрес электронной почты, которые вы ввели при регистрации в системе. Также в базе данных сохраняются размещенные вами в приложении объявления, фотографии и введенные адреса.",
        "privacy_h2": "2. Как мы используем информацию?",
        "privacy_a2": "Собранная информация используется только в целях предоставления услуг платформы, связи с продавцом и улучшения качества работы приложения. Ваша личная информация не будет продана или сдана в аренду третьим лицам.",
        "privacy_h3": "3. Безопасность данных",
        "privacy_a3": "Данные хранятся на зашифрованных серверах и защищены от несанкционированного доступа. Транзакции осуществляются по протоколам SSL.",
        "region_all_uzb": "Все (Узбекистан)",
        "terms_title": "Правила и условия использования",
        "terms_updated": "Последнее обновление: 20 мая 2026 г.",
        "terms_p1": "Добро пожаловать в мобильное приложение Zoovita. Используя это приложение, вы полностью соглашаетесь со следующими условиями.",
        "terms_h1": "1. Условия использования услуг",
        "terms_a1": "Пользователь должен предоставлять только правдивую и точную информацию при подаче объявления в системе. Продажа через приложение животных или предметов, запрещенных законодательством Республики Узбекистан, запрещена.",
        "terms_h2": "2. Обязанности пользователя",
        "terms_a2": "Вы соглашаетесь сохранять конфиденциальность пароля своей учетной записи и несете полную ответственность за все действия, совершаемые через вашу учетную запись.",
        "terms_h3": "3. Ограничение ответственности",
        "terms_a3": "Zoovita — это только онлайн-платформа, объединяющая продавцов и покупателей. Мы не несем прямой ответственности за здоровье продаваемых животных или качество продукции. Перед каждой сделкой рекомендуется проверка.",
        "notifications": "Уведомления",

        # Regions
        "reg_Toshkent_shahri": "г. Ташкент",
        "reg_Toshkent_viloyati": "Ташкентская область",
        "reg_Samarqand_viloyati": "Самаркандская область",
        "reg_Buxoro_viloyati": "Бухарская область",
        "reg_Andijon_viloyati": "Андижанская область",
        "reg_Farg_ona_viloyati": "Ферганская область",
        "reg_Namangan_viloyati": "Наманганская область",
        "reg_Qashqadaryo_viloyati": "Кашкадарьинская область",
        "reg_Surxondaryo_viloyati": "Сурхандарьинская область",
        "reg_Jizzax_viloyati": "Джизакская область",
        "reg_Sirdaryo_viloyati": "Сырдарьинская область",
        "reg_Xorazm_viloyati": "Хорезмская область",
        "reg_Navoiy_viloyati": "Навоийская область",
        "reg_Qoraqalpog_iston_Res_": "Республика Каракалпакстан"
    },
    'en': {
        "region_select": "Select region",
        "sort_modal_title": "Sort advertisements",
        "sort_newest_first": "Newest first",
        "sort_cheap_first": "Cheaper first",
        "sort_exp_first": "Expensive first",
        "faq_title": "Frequently Asked Questions (FAQ)",
        "faq_q1": "How to place an ad?",
        "faq_a1": "Press the central '+' button from the bottom tabs on the Home page or Market page, fill in all the information step by step and confirm the ad.",
        "faq_q2": "Is it completely free to post an ad?",
        "faq_a2": "Yes! Posting an ad for regular users is completely free. If you want your ad to sell faster, you can connect VIP services.",
        "faq_q3": "How does the delivery service work?",
        "faq_a3": "Products purchased from the market page are delivered to your address by our partner couriers. Delivery time is 2-4 hours within the city, and 1-2 days between regions.",
        "faq_q4": "Is payment security guaranteed?",
        "faq_a4": "Yes. All transactions made through Zoovita with Click, Payme or plastic cards are encrypted and fully secure.",
        "faq_q5": "How to contact the seller?",
        "faq_a5": "You can contact the seller directly by clicking the 'Call' or 'Write via Telegram' buttons located at the bottom of the ad details page.",
        "faq_q6": "What does a premium subscription provide?",
        "faq_a6": "Premium subscription entitles you to free delivery on all products, special in-store discounts, VIP ad visibility, and access to personal veterinary assistance.",
        "faq_not_found_title": "Didn't find an answer to your question?",
        "faq_not_found_desc": "Please contact our support team.",
        "faq_write_btn": "Write",
        "contact_title": "Submit a request",
        "contact_cat_label": "Request category",
        "contact_text_label": "Request text",
        "contact_placeholder": "Write your question or problem in detail here...",
        "contact_send_btn": "Send message",
        "contact_quick": "Quick contact",
        "contact_phone": "By phone",
        "contact_tg": "Telegram group",
        "contact_email": "Email",
        "contact_success_title": "Your request has been accepted!",
        "contact_success_desc": "Your message has been sent. Our operators will contact you shortly (via your number +998 90 123 45 67).",
        "contact_success_btn": "Got it",
        "contact_subject_tech": "Technical issue",
        "contact_subject_fin": "Financial issue",
        "contact_subject_vet": "Veterinary help",
        "contact_subject_sugg": "Suggestions",
        "contact_subject_other": "Other",
        "privacy_title": "Privacy Policy",
        "privacy_updated": "Last updated: May 20, 2026",
        "privacy_p1": "Ensuring your privacy and the security of your personal information is our top priority. This document describes what information about you is collected.",
        "privacy_h1": "1. What information do we collect?",
        "privacy_a1": "We store your name, phone number and email address that you entered when registering in the system. Also, the ads you placed in the application, pictures and addresses you entered are stored in the database.",
        "privacy_h2": "2. How do we use the information?",
        "privacy_a2": "Collected information is used only for the purpose of providing platform services, communicating with the seller and improving the performance of the application. Your personal information will not be sold or rented to third parties.",
        "privacy_h3": "3. Data security",
        "privacy_a3": "Data is stored on encrypted servers and protected against unauthorized access. Transactions are carried out with SSL protocols.",
        "region_all_uzb": "All (Uzbekistan)",
        "terms_title": "Terms and Conditions of Use",
        "terms_updated": "Last updated: May 20, 2026",
        "terms_p1": "Welcome to the Zoovita mobile application. By using this application, you fully agree to the following terms and conditions.",
        "terms_h1": "1. Terms of Use of Services",
        "terms_a1": "The user must provide only true and accurate information when placing an ad in the system. Selling animals or items prohibited by the laws of the Republic of Uzbekistan through the application is prohibited.",
        "terms_h2": "2. User obligations",
        "terms_a2": "You agree to keep your account password confidential and accept full responsibility for all activities that occur under your account.",
        "terms_h3": "3. Limitation of liability",
        "terms_a3": "Zoovita is only an online platform connecting sellers and buyers. We do not assume direct responsibility for the health of the animals sold or the quality of the products. Inspection before every transaction is recommended.",
        "notifications": "Notifications",
        
        # Regions
        "reg_Toshkent_shahri": "Tashkent city",
        "reg_Toshkent_viloyati": "Tashkent region",
        "reg_Samarqand_viloyati": "Samarkand region",
        "reg_Buxoro_viloyati": "Bukhara region",
        "reg_Andijon_viloyati": "Andijan region",
        "reg_Farg_ona_viloyati": "Fergana region",
        "reg_Namangan_viloyati": "Namangan region",
        "reg_Qashqadaryo_viloyati": "Kashkadarya region",
        "reg_Surxondaryo_viloyati": "Surkhandarya region",
        "reg_Jizzax_viloyati": "Jizzakh region",
        "reg_Sirdaryo_viloyati": "Syrdarya region",
        "reg_Xorazm_viloyati": "Khorezm region",
        "reg_Navoiy_viloyati": "Navoi region",
        "reg_Qoraqalpog_iston_Res_": "Republic of Karakalpakstan"
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
    # Dropdowns / Modals
    (r"<Text style=\{styles\.dropdownModalTitle\}>Viloyatni tanlang</Text>",
     r"<Text style={styles.dropdownModalTitle}>{t('region_select')}</Text>"),
     
    (r"<Text style=\{styles\.dropdownModalTitle\}>E'lonlarni saralash</Text>",
     r"<Text style={styles.dropdownModalTitle}>{t('sort_modal_title')}</Text>"),
     
    (r">Barchasi \(O'zbekiston\)<",
     r">{t('region_all_uzb')}<"),
     
    (r">Yangi birinchi<",
     r">{t('sort_newest_first')}<"),
     
    (r">Arzonroq birinchi<",
     r">{t('sort_cheap_first')}<"),
     
    (r">Qimmatroq birinchi<",
     r">{t('sort_exp_first')}<"),

    # Region map mapping
    (r"\{reg\}</Text>",
     r"{t('reg_' + reg.replace(' ', '_').replace(\"'\", '_').replace('.', '_')) || reg}</Text>"),

    # Help Center
    (r"<Text style=\{styles\.helpCenterIntro\}>Ko'p beriladigan savollar \(FAQ\)</Text>",
     r"<Text style={styles.helpCenterIntro}>{t('faq_title')}</Text>"),
     
    (r"\{ q: \"Qanday qilib e'lon berish mumkin\?\", a: \"Bosh sahifa yoki Bozor sahifasidagi pastki tablar orasidan markaziy '\+' tugmasini bosing, barcha ma'lumotlarni bosqichma-bosqich to'ldiring va e'lonni tasdiqlang\.\" \}",
     r"{ q: t('faq_q1'), a: t('faq_a1') }"),
     
    (r"\{ q: \"E'lon berish mutlaqo bepulmi\?\", a: \"Ha! Oddiy foydalanuvchilar uchun e'lon joylashtirish mutlaqo bepul\. Agar siz e'loningiz tezroq sotilishini xohlasangiz, VIP xizmatlarni ulashingiz mumkin\.\" \}",
     r"{ q: t('faq_q2'), a: t('faq_a2') }"),
     
    (r"\{ q: \"Yetkazib berish xizmati qanday ishlaydi\?\", a: \"Bozor sahifasidan xarid qilingan mahsulotlar hamkor kurerlarimiz orqali manzilingizga yetkaziladi\. Yetkazib berish vaqti shahar ichida 2-4 soat, viloyatlararo esa 1-2 kunni tantal etadi\.\" \}",
     r"{ q: t('faq_q3'), a: t('faq_a3') }"),
     
    (r"\{ q: \"To'lov xavfsizligi kafolatlanganmi\?\", a: \"Ha\. Zoovita orqali Click, Payme yoki plastik kartalar bilan amalga oshiriladigan barcha tranzaksiyalar shifrlangan va to'liq xavfsiz hisoblanadi\.\" \}",
     r"{ q: t('faq_q4'), a: t('faq_a4') }"),
     
    (r"\{ q: \"Sotuvchi bilan qanday bog'lanish mumkin\?\", a: \"E'lon tafsilotlari sahifasining pastki qismida joylagan 'Qo'ng'iroq qilish' yoki 'Telegram orqali yozish' tugmalarini bosish orqali to'g'ridan-to'g'ri sotuvchi bilan aloqaga chiqasiz\.\" \}",
     r"{ q: t('faq_q5'), a: t('faq_a5') }"),
     
    (r"\{ q: \"Premium obuna nima beradi\?\", a: \"Premium obuna sizga barcha mahsulotlarni bepul yetkazib berish, do'konlarda maxsus chegirmalar, VIP e'lon ko'rinishi hamda shaxsiy veterinar yordamidan foydalanish huquqini taqdim etadi\.\" \}",
     r"{ q: t('faq_q6'), a: t('faq_a6') }"),
     
    (r"<Text style=\{styles\.helpSupportTitle\}>Savollaringizga javob topilmadi\?</Text>",
     r"<Text style={styles.helpSupportTitle}>{t('faq_not_found_title')}</Text>"),
     
    (r"<Text style=\{styles\.helpSupportSubtitle\}>Bizning qo'llab-quvvatlash jamoamizga murojaat qiling\.</Text>",
     r"<Text style={styles.helpSupportSubtitle}>{t('faq_not_found_desc')}</Text>"),
     
    (r"<Text style=\{styles\.helpSupportBtnText\}>Yozish</Text>",
     r"<Text style={styles.helpSupportBtnText}>{t('faq_write_btn')}</Text>"),

    # Contact Us
    (r"<Text style=\{styles\.formCardTitle\}>Murojaat yuborish</Text>",
     r"<Text style={styles.formCardTitle}>{t('contact_title')}</Text>"),
     
    (r"<Text style=\{styles\.editProfileInputLabel\}>Murojaat toifasi</Text>",
     r"<Text style={styles.editProfileInputLabel}>{t('contact_cat_label')}</Text>"),
     
    (r"\['Texnik muammo', 'Moliyaviy masala', 'Veterinar yordami', 'Takliflar', 'Boshqa'\]\.map\(cat =>",
     r"[t('contact_subject_tech'), t('contact_subject_fin'), t('contact_subject_vet'), t('contact_subject_sugg'), t('contact_subject_other')].map(cat =>"),
     
    (r"<Text style=\{styles\.editProfileInputLabel\}>Murojaat matni</Text>",
     r"<Text style={styles.editProfileInputLabel}>{t('contact_text_label')}</Text>"),
     
    (r"placeholder=\"Savolingiz yoki muammoni bu yerda batafsil yozing\.\.\.\"",
     r"placeholder={t('contact_placeholder')}"),
     
    (r"<Text style=\{styles\.contactSubmitBtnText\}>Xabarni yuborish</Text>",
     r"<Text style={styles.contactSubmitBtnText}>{t('contact_send_btn')}</Text>"),
     
    (r"<Text style=\{styles\.profileSectionTitle\}>Tezkor bog'lanish</Text>",
     r"<Text style={styles.profileSectionTitle}>{t('contact_quick')}</Text>"),
     
    (r"title: 'Telefon orqali'",
     r"title: t('contact_phone')"),
     
    (r"title: 'Telegram guruh'",
     r"title: t('contact_tg')"),
     
    (r"title: 'Elektron pochta'",
     r"title: t('contact_email')"),
     
    (r"<Text style=\{styles\.contactSuccessTitle\}>Murojaatingiz qabul qilindi!</Text>",
     r"<Text style={styles.contactSuccessTitle}>{t('contact_success_title')}</Text>"),
     
    (r"<Text style=\{styles\.contactSuccessDesc\}>\s*Xabaringiz yuborildi\. Bizning operatorlarimiz tez orada \(\+998 90 123 45 67 raqamingiz orqali\) aloqaga chiqishadi\.\s*</Text>",
     r"<Text style={styles.contactSuccessDesc}>{t('contact_success_desc')}</Text>"),
     
    (r"<Text style=\{styles\.contactSuccessBtnText\}>Tushunarli</Text>",
     r"<Text style={styles.contactSuccessBtnText}>{t('contact_success_btn')}</Text>"),

    # Terms
    (r"<Text style=\{styles\.docTitle\}>Foydalanish qoidalari va shartlari</Text>",
     r"<Text style={styles.docTitle}>{t('terms_title')}</Text>"),
     
    (r"<Text style=\{styles\.docMeta\}>Oxirgi yangilanish: 20-may, 2026-yil</Text>",
     r"<Text style={styles.docMeta}>{t('terms_updated')}</Text>"),
     
    (r"<Text style=\{styles\.docParagraph\}>\s*Zoovita mobil ilovasiga xush kelibsiz\. Ushbu ilovadan foydalanish orqali siz quyidagi shartlar va qoidalarga to'liq rozilik bildirasiz\.\s*</Text>",
     r"<Text style={styles.docParagraph}>{t('terms_p1')}</Text>"),
     
    (r"<Text style=\{styles\.docSectionTitle\}>1\. Xizmatlardan foydalanish shartlari</Text>",
     r"<Text style={styles.docSectionTitle}>{t('terms_h1')}</Text>"),
     
    (r"<Text style=\{styles\.docParagraph\}>\s*Foydalanuvchi tizimda e'lon berish paytida faqat haqiqiy va to'g'ri ma'lumotlarni taqdim etishi shart\. O'zbekiston Respublikasi qonunchiligida taqiqlangan hayvonlar yoki buyumlarni ilova orqali sotish taqiqlanadi\.\s*</Text>",
     r"<Text style={styles.docParagraph}>{t('terms_a1')}</Text>"),
     
    (r"<Text style=\{styles\.docSectionTitle\}>2\. Foydalanuvchining majburiyatlari</Text>",
     r"<Text style={styles.docSectionTitle}>{t('terms_h2')}</Text>"),
     
    (r"<Text style=\{styles\.docParagraph\}>\s*Siz o'z hisobingiz parolini maxfiy saqlashga, shuningdek hisobingiz orqali amalga oshiriladigan barcha harakatlar uchun to'liq javobgar bo'lishga rozilik bildirasiz\.\s*</Text>",
     r"<Text style={styles.docParagraph}>{t('terms_a2')}</Text>"),
     
    (r"<Text style=\{styles\.docSectionTitle\}>3\. Javobgarlikni cheklash</Text>",
     r"<Text style={styles.docSectionTitle}>{t('terms_h3')}</Text>"),
     
    (r"<Text style=\{styles\.docParagraph\}>\s*Zoovita faqat sotuvchilar va xaridorlarni bog'lovchi onlayn platforma hisoblanadi\. Biz sotilayotgan hayvonlar salomatligi yoki mahsulotlar sifati uchun bevosita javobgarlikni o'z zimmamizga olmaymiz\. Har bir tranzaksiyadan oldin tekshirish tavsiya etiladi\.\s*</Text>",
     r"<Text style={styles.docParagraph}>{t('terms_a3')}</Text>"),

    # Privacy
    (r"<Text style=\{styles\.docTitle\}>Maxfiylik siyosati</Text>",
     r"<Text style={styles.docTitle}>{t('privacy_title')}</Text>"),
     
    (r"<Text style=\{styles\.docParagraph\}>\s*Sizning maxfiyligingiz va shaxsiy ma'lumotlaringiz xavfsizligini ta'minlash bizning ustuvor vazifamizdir\. Ushbu hujjat siz haqingizdagi qanday ma'lumotlar to'planishini bayon qiladi\.\s*</Text>",
     r"<Text style={styles.docParagraph}>{t('privacy_p1')}</Text>"),
     
    (r"<Text style=\{styles\.docSectionTitle\}>1\. Qanday ma'lumotlarni to'playmiz\?</Text>",
     r"<Text style={styles.docSectionTitle}>{t('privacy_h1')}</Text>"),
     
    (r"<Text style=\{styles\.docParagraph\}>\s*Biz siz tizimdan ro'yxatdan o'tganingizda kiritgan ismingiz, telefon raqamingiz va email manzilingizni saqlaymiz\. Shuningdek, ilovada joylashtirgan e'lonlaringiz, rasmlar va kiritgan manzillaringiz ma'lumotlar bazasida saqlanadi\.\s*</Text>",
     r"<Text style={styles.docParagraph}>{t('privacy_a1')}</Text>"),
     
    (r"<Text style=\{styles\.docSectionTitle\}>2\. Ma'lumotlardan qanday foydalanamiz\?</Text>",
     r"<Text style={styles.docSectionTitle}>{t('privacy_h2')}</Text>"),
     
    (r"<Text style=\{styles\.docParagraph\}>\s*To'plangan ma'lumotlar faqat platforma xizmatlarini taqdim etish, sotuvchi bilan bog'lanish va ilova ishlash sifatini yaxshilash maqsadida qo'llaniladi\. Shaxsiy ma'lumotlaringiz uchinchi shaxslarga sotilmaydi yoki ijaraga berilmaydi\.\s*</Text>",
     r"<Text style={styles.docParagraph}>{t('privacy_a2')}</Text>"),
     
    (r"<Text style=\{styles\.docSectionTitle\}>3\. Ma'lumotlar xavfsizligi</Text>",
     r"<Text style={styles.docSectionTitle}>{t('privacy_h3')}</Text>"),
     
    (r"<Text style=\{styles\.docParagraph\}>\s*Ma'lumotlar shifrlangan serverlarda saqlanadi va ruxsatsiz kirishlardan himoyalangan\. Tranzaksiyalar SSL protokollari bilan amalga oshiriladi\.\s*</Text>",
     r"<Text style={styles.docParagraph}>{t('privacy_a3')}</Text>"),
     
    # Bildirishnomalar text (in detail header)
    (r"<Text style=\{styles\.detailHeaderTitle\}>Bildirishnomalar</Text>",
     r"<Text style={styles.detailHeaderTitle}>{t('notifications')}</Text>"),
]

for pattern, repl in replacements:
    code = re.sub(pattern, repl, code)

with open('App.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("App.js updated!")
