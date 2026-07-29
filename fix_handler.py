import re

with open('mobile-app/App.js', 'r', encoding='utf-8') as f:
    code = f.read()

handler_pattern = r"(else if \(item\.id === 'language'\) setShowLanguageModal\(true\);)"
handler_repl = r"else if (item.id === 'language') {\n                          import('react-native').then(({ Alert }) => {\n                            Alert.alert(\n                              t('profile_language_title') || 'Tilni tanlang',\n                              t('profile_language_sub') || '',\n                              [\n                                { text: t('lang_uz'), onPress: () => changeLanguage('uz') },\n                                { text: t('lang_ru'), onPress: () => changeLanguage('ru') },\n                                { text: t('lang_en'), onPress: () => changeLanguage('en') },\n                                { text: t('btn_cancel') || 'Bekor qilish', style: 'cancel' }\n                              ]\n                            );\n                          });\n                        }"

code = re.sub(handler_pattern, handler_repl, code)

with open('mobile-app/App.js', 'w', encoding='utf-8') as f:
    f.write(code)
print("Fixed Language click handler to use Alert")
