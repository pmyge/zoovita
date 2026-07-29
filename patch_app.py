import re

with open('mobile-app/App.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Translate categories array
cat_pattern = r"\{CATEGORIES\.map\(\(category\) => \("
cat_repl = r"{CATEGORIES.map((category) => (\n                  <TouchableOpacity"

code = re.sub(
    r"<Text style=\{styles\.categoryText\} numberOfLines=\{2\}>\{category\.name\}</Text>",
    r"<Text style={styles.categoryText} numberOfLines={2}>{t('cat_' + category.id) || category.name}</Text>",
    code
)

# 2. Ads filter
code = re.sub(
    r"<Text style=\{styles\.filterModalTitle\}>E'lonlar filtri</Text>",
    r"<Text style={styles.filterModalTitle}>{t('ads_filter_title')}</Text>",
    code
)

# 3. E'lonlar
code = re.sub(
    r"<Text style=\{styles\.listingsHeaderTitle\}>E'lonlar</Text>",
    r"<Text style={styles.listingsHeaderTitle}>{t('ads_title')}</Text>",
    code
)

# 4. Bildirishnomalar mavjud emas
code = re.sub(
    r"Bildirishnomalar mavjud emas",
    r"{t('notif_empty_2')}",
    code
)

# 5. Inject translation helper for notifications right after `const { t } = useLanguage();` inside App()
helper_fn = """
  // Helper for translating backend notifications
  const transTitle = (title) => {
    if (title === 'Tizimga kirdingiz') return t('notif_login_title');
    if (title === "E'loningiz qabul qilindi") return t('notif_ad_title');
    if (title === "Yangi xabar") return t('notif_msg_title');
    return title;
  };

  const transMsg = (msg) => {
    if (msg.includes('sizga xabar yubordi:')) {
      const parts = msg.split(' sizga xabar yubordi: ');
      if (parts.length === 2) return `${parts[0]} ${t('notif_msg_sent')}: ${parts[1]}`;
    }
    if (msg.includes(\"nomli e'loningiz tizimga qo'shildi\")) {
      const parts = msg.split(\"' nomli e'loningiz tizimga qo'shildi va tez orada ommaga ko'rinadi.\");
      if (parts.length === 2) return `'${parts[0].replace(\"'\", \"\")}' ${t('notif_ad_added')}`;
    }
    if (msg === 'Hisobingizga muvaffaqiyatli kirildi.') return t('notif_login_success');
    if (msg === 'Google orqali hisobingizga kirildi.') return t('notif_login_google');
    if (msg === 'Apple orqali hisobingizga kirildi.') return t('notif_login_apple');
    if (msg === 'Telegram orqali hisobingizga kirildi.') return t('notif_login_tg');
    return msg;
  };
"""

code = code.replace(
    "const { t, language, changeLanguage, isLoaded } = useLanguage();",
    "const { t, language, changeLanguage, isLoaded } = useLanguage();\n" + helper_fn
)

# Replace {item.title} and {item.message} in notifications map
code = re.sub(
    r"<Text style=\{\[styles\.notificationTitle, !item\.is_read && \{ fontWeight: '700' \}\]\}>\{item\.title\}</Text>\s*<Text style=\{styles\.notificationBody\}>\{item\.message\}</Text>",
    r"<Text style={[styles.notificationTitle, !item.is_read && { fontWeight: '700' }]}>{transTitle(item.title)}</Text>\n                          <Text style={styles.notificationBody}>{transMsg(item.message)}</Text>",
    code
)

with open('mobile-app/App.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied dynamic notification translation and extra fixes!")
