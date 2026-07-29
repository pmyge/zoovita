import re

with open('mobile-app/App.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace the specific case in Privacy policy section which is around line 5500
code = code.replace("<Text style={styles.docTitle}>{t('privacy_title')}</Text>\n                        <Text style={styles.docMeta}>{t('terms_updated')}</Text>",
                    "<Text style={styles.docTitle}>{t('privacy_title')}</Text>\n                        <Text style={styles.docMeta}>{t('privacy_updated')}</Text>")

with open('mobile-app/App.js', 'w', encoding='utf-8') as f:
    f.write(code)
print("Fixed!")
