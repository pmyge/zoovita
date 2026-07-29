import re

with open('mobile-app/App.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Add language option to PROFILE_SUPPORT
profile_support_pattern = r"(const PROFILE_SUPPORT = \[\s+.*?)(];)"
replacement = r"\1  { id: 'language', title: 'Tilni o\'zgartirish', subtitle: 'Ilova tilini tanlash', icon: 'globe', bgColor: '#E8F5E9', iconColor: '#4CAF50' },\n\2"
code = re.sub(profile_support_pattern, replacement, code, flags=re.DOTALL)

# Translate the mapped elements in PROFILE_SERVICES
services_pattern = r"(<Text style=\{styles\.profileServiceTitle\}>)\{item\.title\}(</Text>\s*<Text style=\{styles\.profileServiceSubtitle\}>)\{item\.subtitle\}(</Text>)"
services_repl = r"\1{t(`profile_${item.id}_title`) || item.title}\2{t(`profile_${item.id}_sub`) || item.subtitle}\3"
code = re.sub(services_pattern, services_repl, code)

# Add handler for language click
handler_pattern = r"(else if \(item\.id === 'privacy'\) setProfileSubScreen\('privacy'\);)"
handler_repl = r"\1\n                        else if (item.id === 'language') setShowLanguageModal(true);"
code = re.sub(handler_pattern, handler_repl, code)

with open('mobile-app/App.js', 'w', encoding='utf-8') as f:
    f.write(code)
print("Updated Profile arrays and mappings")
