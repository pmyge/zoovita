import re

with open('mobile-app/App.js', 'r', encoding='utf-8') as f:
    code = f.read()

replacements = [
    # Profile Stats
    (r"(<Text style=\{styles\.profileStatLabel\}>)\{item\.label\}(</Text>)",
     r"\1{t(`profile_my_${item.id}`) || item.label}\2"),
    
    # Profile Header
    (r"<Text style=\{styles\.profileHeaderTitle\}>Mening profilim</Text>",
     r"<Text style={styles.profileHeaderTitle}>{t('profile_my_profile')}</Text>"),
     
    # Edit Profile Header
    (r"<Text style=\{styles\.modalHeaderTitle\}>Profilni tahrirlash</Text>",
     r"<Text style={styles.modalHeaderTitle}>{t('edit_profile_title')}</Text>"),
     
    # Edit Profile Labels
    (r"<Text style=\{styles\.addFieldLabel\}>Ismingiz</Text>",
     r"<Text style={styles.addFieldLabel}>{t('edit_profile_name')}</Text>"),
    (r"<Text style=\{styles\.submitStepBtnText\}>Saqlash</Text>",
     r"<Text style={styles.submitStepBtnText}>{t('edit_profile_save')}</Text>"),
     
    # Messages Header
    (r"<Text style=\{styles\.chatHeaderTitle\}>Xabarlar</Text>",
     r"<Text style={styles.chatHeaderTitle}>{t('messages_title')}</Text>"),
     
    # Messages Empty State
    (r"<Text style=\{styles\.emptyStateTitle\}>Hozircha xabarlar yo'q</Text>",
     r"<Text style={styles.emptyStateTitle}>{t('messages_empty')}</Text>"),
    (r"<Text style=\{styles\.emptyStateSubtitle\}>Xaridor yoki sotuvchilar bilan yozishmalaringiz shu yerda ko'rinadi</Text>",
     r"<Text style={styles.emptyStateSubtitle}>{t('messages_empty_sub')}</Text>"),
     
    # Filter Title
    (r"<Text style=\{styles\.modalHeaderTitle\}>Filtr</Text>",
     r"<Text style={styles.modalHeaderTitle}>{t('filter_title')}</Text>"),
     
    # Filter Apply
    (r"<Text style=\{styles\.filterApplyBtnText\}>Qo'llash</Text>",
     r"<Text style={styles.filterApplyBtnText}>{t('filter_apply')}</Text>"),
     
    # Notifications Header
    (r"<Text style=\{styles\.chatHeaderTitle\}>Bildirishnomalar</Text>",
     r"<Text style={styles.chatHeaderTitle}>{t('notifications_title')}</Text>"),
     
    # Help Center Header
    (r"<Text style=\{styles\.subScreenHeaderTitle\}>Yordam markazi</Text>",
     r"<Text style={styles.subScreenHeaderTitle}>{t('help_center_title')}</Text>"),
     
    # Home Search Placeholder
    (r'placeholder="Hayvon, mahsulot yoki xizmat qidirish\.\.\."',
     r'placeholder={t("home_search_placeholder")}'),
]

for pattern, repl in replacements:
    code = re.sub(pattern, repl, code)

with open('mobile-app/App.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied screen replacements!")
