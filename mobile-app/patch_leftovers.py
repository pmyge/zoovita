import json
import re

new_keys = {
    'uz': {
        "sort_by": "Tartiblash",
        "sort_newest": "Yangi avval",
        "sort_cheap": "Arzonroq",
        "sort_exp": "Qimmatroq",
        "location": "Joylashuv",
        "all": "Barchasi",
        "zoovita_info": "'da barcha hayvonlar, mahsulotlar va xizmatlar kategoriyalar bo'yicha jamlangan.",
        "cat_all": "Barcha kategoriyalar",
        "animals": "Hayvonlar",
        "products": "Mahsulotlar",
        "services": "Xizmatlar",
        "profile_my_ads": "E'lonlarim",
        "profile_my_favorites": "Sevimlilarim",
        "profile_my_services": "Mening xizmatlarim",
        "profile_support": "Qo'llab-quvvatlash"
    },
    'ru': {
        "sort_by": "Сортировка",
        "sort_newest": "Сначала новые",
        "sort_cheap": "Дешевле",
        "sort_exp": "Дороже",
        "location": "Локация",
        "all": "Все",
        "zoovita_info": " собирает всех животных, продукты и услуги по категориям.",
        "cat_all": "Все категории",
        "animals": "Животные",
        "products": "Продукты и товары",
        "services": "Услуги",
        "profile_my_ads": "Мои объявления",
        "profile_my_favorites": "Мои избранные",
        "profile_my_services": "Мои сервисы",
        "profile_support": "Поддержка"
    },
    'en': {
        "sort_by": "Sort by",
        "sort_newest": "Newest",
        "sort_cheap": "Cheaper",
        "sort_exp": "Expensive",
        "location": "Location",
        "all": "All",
        "zoovita_info": " gathers all animals, products, and services by category.",
        "cat_all": "All categories",
        "animals": "Animals",
        "products": "Products",
        "services": "Services",
        "profile_my_ads": "My ads",
        "profile_my_favorites": "My favorites",
        "profile_my_services": "My services",
        "profile_support": "Support"
    }
}

for lang, data in new_keys.items():
    filepath = f"src/locales/{lang}.json"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = json.load(f)
    content.update(data)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=2)

print("JSON files updated with leftover keys!")

with open('App.js', 'r', encoding='utf-8') as f:
    code = f.read()

replacements = [
    # Home category bugfix
    (r"<Text style=\{styles\.categoryName\} numberOfLines=\{2\}>\s*\{category\.name\}\s*</Text>",
     r"<Text style={styles.categoryName} numberOfLines={2}>{t('cat_' + category.id) || category.name}</Text>"),
    
    # Barchasi pill
    (r"Barchasi\s*</Text>",
     r"{t('all')}</Text>"),
     
    # Tartiblash
    (r"<Text style=\{\{ color: '#7C8A79', fontWeight: '500' \}\}>Tartiblash: </Text>",
     r"<Text style={{ color: '#7C8A79', fontWeight: '500' }}>{t('sort_by') + ': '}</Text>"),
     
    (r"bozorSortOption === 'newest' \? 'Yangi avval' : \s*bozorSortOption === 'price_asc' \? 'Arzonroq' : 'Qimmatroq'",
     r"bozorSortOption === 'newest' ? t('sort_newest') : bozorSortOption === 'price_asc' ? t('sort_cheap') : t('sort_exp')"),

    # Joylashuv
    (r"<Text style=\{\{ color: '#7C8A79', fontWeight: '500' \}\}>Joylashuv: </Text>",
     r"<Text style={{ color: '#7C8A79', fontWeight: '500' }}>{t('location') + ': '}</Text>"),
     
    (r"bozorRegionFilter === 'all' \? 'Barchasi' : bozorRegionFilter\.split\(' '\)\[0\]",
     r"bozorRegionFilter === 'all' ? t('all') : bozorRegionFilter.split(' ')[0]"),

    # Zoovita Info
    (r"’da barcha hayvonlar, mahsulotlar va xizmatlar kategoriyalar bo‘yicha jamlangan\.",
     r"{t('zoovita_info')}"),
     
    # Subcategory tabs
    (r"Barcha kategoriyalar\s*</Text>",
     r"{t('cat_all')}</Text>"),
     
    (r"Hayvonlar\s*</Text>",
     r"{t('animals')}</Text>"),
     
    (r"Mahsulotlar\s*</Text>",
     r"{t('products')}</Text>"),
     
    (r"Xizmatlar\s*</Text>",
     r"{t('services')}</Text>"),

    # Profile Stats
    (r"<Text style=\{styles\.profileStatLabel\}>E'lonlarim</Text>",
     r"<Text style={styles.profileStatLabel}>{t('profile_my_ads')}</Text>"),
     
    (r"<Text style=\{styles\.profileStatLabel\}>Sevimlilarim</Text>",
     r"<Text style={styles.profileStatLabel}>{t('profile_my_favorites')}</Text>"),
     
    # Profile Sections
    (r"<Text style=\{styles\.profileSectionTitle\}>Mening xizmatlarim</Text>",
     r"<Text style={styles.profileSectionTitle}>{t('profile_my_services')}</Text>"),
     
    (r"<Text style=\{styles\.profileSectionTitle\}>Qo‘llab-quvvatlash</Text>",
     r"<Text style={styles.profileSectionTitle}>{t('profile_support')}</Text>")
]

for pattern, repl in replacements:
    code = re.sub(pattern, repl, code)

with open('App.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied leftover JS translations!")
