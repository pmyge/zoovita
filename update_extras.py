import json
import re

# Read App.js to extract districts
with open('mobile-app/App.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

districts = []
in_districts = False
for line in app_js.split('\n'):
    if 'const UZBEKISTAN_DISTRICTS =' in line:
        in_districts = True
    elif in_districts and '};' in line:
        in_districts = False
    elif in_districts:
        # Match arrays
        matches = re.findall(r"'([^']+)'", line)
        if len(matches) > 1: # first is region, rest are districts
            for m in matches[1:]:
                districts.append(m)

def safe_key(name):
    return re.sub(r"[\s‘'.-]", "_", name)

# Prepare dictionary for districts translation
uz_districts = {}
ru_districts = {}
en_districts = {}

for d in districts:
    key = "dist_" + safe_key(d)
    uz_districts[key] = d
    # Basic transliteration for ru/en if simple, but we'll just keep them as is for now 
    # except changing tumani to район / district
    ru_d = d.replace(' tumani', ' район').replace(' shahri', ' город')
    en_d = d.replace(' tumani', ' district').replace(' shahri', ' city')
    ru_districts[key] = ru_d
    en_districts[key] = en_d

new_keys = {
    'uz': {
        "sort_newest_first": "Yangi birinchi",
        "sort_cheap_first": "Arzonroq birinchi",
        "sort_exp_first": "Qimmatroq birinchi",
        "add_cat_modal_title": "Kategoriyani tanlang",
        "select": "Tanlang",
        "add_manual_loc": "Qo'lda kiritish (Viloyat va tuman)",
        "add_region_modal_title": "Hududni tanlang",
        "select_district_prefix": "",
        "select_district_suffix": "tumanini tanlang",
        "district": "Tuman",
        "select_region_first": "Avval viloyatni tanlang",
        "add_field_gender": "Jinsi",
        "gender_male": "Erkak",
        "gender_female": "Urg'ochi",
        "add_field_age": "Yoshi",
        "add_ph_age": "Masalan: 3 yosh",
        "add_field_breed": "Zoti",
        "add_ph_breed": "Masalan: Golishten, Edilbay",
        "add_field_health": "Holati",
        "health_good": "Sog'lom",
        "health_sick": "Kasal",
        "health_healing": "Davolanmoqda",
        "add_field_milk": "Sutdorligi (l/kun)",
        "add_ph_milk": "Masalan: 20-25 l/kun",
        "add_field_weight": "Og'irligi (kg)",
        "add_ph_weight": "Masalan: 450-500 kg",
        "add_field_vaccine": "Emlangan (vaksinatsiya)",
        "vaccine_yes": "Ha",
        "vaccine_no": "Yo'q",
        "add_field_animal_info": "Hayvon ma'lumotlari",
        "add_field_service_info": "Xizmat ma'lumotlari",
        "add_field_service_type": "Xizmat turi",
        "add_ph_service": "Masalan: Uy sharoitida muolaja",
        "add_field_experience": "Tajriba (yil)",
        "add_ph_exp": "Masalan: 5 yil",
        "add_field_product_info": "Mahsulot ma'lumotlari",
        "add_field_product_type": "Navi / Turi",
        "add_ph_product_type": "Masalan: Premium yem",
        "add_field_volume": "Hajm / Og'irligi",
        "add_ph_volume": "Masalan: 20 kg, 1 litr",
        "add_field_contact_info": "Aloqa ma'lumotlari",
        **uz_districts
    },
    'ru': {
        "sort_newest_first": "Сначала новые",
        "sort_cheap_first": "Сначала дешевые",
        "sort_exp_first": "Сначала дорогие",
        "add_cat_modal_title": "Выберите категорию",
        "select": "Выбрать",
        "add_manual_loc": "Ручной ввод (Область и район)",
        "add_region_modal_title": "Выберите регион",
        "select_district_prefix": "Выберите район:",
        "select_district_suffix": "",
        "district": "Район",
        "select_region_first": "Сначала выберите регион",
        "add_field_gender": "Пол",
        "gender_male": "Самец",
        "gender_female": "Самка",
        "add_field_age": "Возраст",
        "add_ph_age": "Например: 3 года",
        "add_field_breed": "Порода",
        "add_ph_breed": "Например: Голштин, Эдильбай",
        "add_field_health": "Состояние",
        "health_good": "Здоровый",
        "health_sick": "Больной",
        "health_healing": "На лечении",
        "add_field_milk": "Удойность (л/день)",
        "add_ph_milk": "Например: 20-25 л/день",
        "add_field_weight": "Вес (кг)",
        "add_ph_weight": "Например: 450-500 кг",
        "add_field_vaccine": "Привит (вакцинация)",
        "vaccine_yes": "Да",
        "vaccine_no": "Нет",
        "add_field_animal_info": "Информация о животном",
        "add_field_service_info": "Информация об услуге",
        "add_field_service_type": "Вид услуги",
        "add_ph_service": "Например: Лечение на дому",
        "add_field_experience": "Опыт (лет)",
        "add_ph_exp": "Например: 5 лет",
        "add_field_product_info": "Информация о товаре",
        "add_field_product_type": "Сорт / Тип",
        "add_ph_product_type": "Например: Премиум корм",
        "add_field_volume": "Объем / Вес",
        "add_ph_volume": "Например: 20 кг, 1 литр",
        "add_field_contact_info": "Контактная информация",
        **ru_districts
    },
    'en': {
        "sort_newest_first": "Newest first",
        "sort_cheap_first": "Cheaper first",
        "sort_exp_first": "Expensive first",
        "add_cat_modal_title": "Select category",
        "select": "Select",
        "add_manual_loc": "Manual entry (Region and district)",
        "add_region_modal_title": "Select region",
        "select_district_prefix": "Select district for",
        "select_district_suffix": "",
        "district": "District",
        "select_region_first": "Select region first",
        "add_field_gender": "Gender",
        "gender_male": "Male",
        "gender_female": "Female",
        "add_field_age": "Age",
        "add_ph_age": "Example: 3 years",
        "add_field_breed": "Breed",
        "add_ph_breed": "Example: Holstein, Edilbay",
        "add_field_health": "Condition",
        "health_good": "Healthy",
        "health_sick": "Sick",
        "health_healing": "Healing",
        "add_field_milk": "Milk yield (l/day)",
        "add_ph_milk": "Example: 20-25 l/day",
        "add_field_weight": "Weight (kg)",
        "add_ph_weight": "Example: 450-500 kg",
        "add_field_vaccine": "Vaccinated",
        "vaccine_yes": "Yes",
        "vaccine_no": "No",
        "add_field_animal_info": "Animal information",
        "add_field_service_info": "Service information",
        "add_field_service_type": "Service type",
        "add_ph_service": "Example: Home treatment",
        "add_field_experience": "Experience (years)",
        "add_ph_exp": "Example: 5 years",
        "add_field_product_info": "Product information",
        "add_field_product_type": "Sort / Type",
        "add_ph_product_type": "Example: Premium feed",
        "add_field_volume": "Volume / Weight",
        "add_ph_volume": "Example: 20 kg, 1 liter",
        "add_field_contact_info": "Contact information",
        **en_districts
    }
}

for lang, data in new_keys.items():
    filepath = f"mobile-app/src/locales/{lang}.json"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = json.load(f)
    content.update(data)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=2)

print("JSON files updated!")
