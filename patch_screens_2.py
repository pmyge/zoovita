import re

with open('mobile-app/App.js', 'r', encoding='utf-8') as f:
    code = f.read()

replacements = [
    # Bozor Screen
    (r"<Text style=\{styles\.bozorHeaderTitle\}>Bozor</Text>",
     r"<Text style={styles.bozorHeaderTitle}>{t('bozor_title')}</Text>"),
     
    (r"<Text style=\{styles\.emptyStateTitle\}>Hech narsa topilmadi</Text>",
     r"<Text style={styles.emptyStateTitle}>{t('bozor_empty')}</Text>"),
     
    (r"<Text style=\{styles\.emptyStateSubtitle\}>Qidiruv shartlarini o'zgartirib ko'ring</Text>",
     r"<Text style={styles.emptyStateSubtitle}>{t('bozor_empty_sub')}</Text>"),
     
    # Filter screen additions
    (r"<Text style=\{styles\.filterLabel\}>Kategoriyani tanlang</Text>",
     r"<Text style={styles.filterLabel}>{t('filter_category')}</Text>"),
     
    (r"<Text style=\{styles\.filterLabel\}>Narx \(so'm\)</Text>",
     r"<Text style={styles.filterLabel}>{t('filter_price')}</Text>"),
     
    (r'placeholder="Dan"',
     r'placeholder={t("filter_price_from")}'),
     
    (r'placeholder="Gacha"',
     r'placeholder={t("filter_price_to")}'),
     
    (r"<Text style=\{styles\.filterResetBtnText\}>Tozalash</Text>",
     r"<Text style={styles.filterResetBtnText}>{t('filter_reset')}</Text>"),
     
    # Subscreens headers
    (r"<Text style=\{styles\.subScreenHeaderTitle\}>Biz bilan bog'lanish</Text>",
     r"<Text style={styles.subScreenHeaderTitle}>{t('contact_title')}</Text>"),
     
    (r"<Text style=\{styles\.subScreenHeaderTitle\}>Foydalanish shartlari</Text>",
     r"<Text style={styles.subScreenHeaderTitle}>{t('terms_title')}</Text>"),
     
    (r"<Text style=\{styles\.subScreenHeaderTitle\}>Maxfiylik siyosati</Text>",
     r"<Text style={styles.subScreenHeaderTitle}>{t('privacy_title')}</Text>"),
]

for pattern, repl in replacements:
    code = re.sub(pattern, repl, code)

with open('mobile-app/App.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied secondary screen replacements!")
