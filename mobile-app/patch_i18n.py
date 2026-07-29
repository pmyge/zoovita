import json

files = ['uz.json', 'ru.json', 'en.json']

new_keys = {
    'uz': {
        "add_ad_title": "E'lon berish",
        "add_step_details": "Ma'lumotlar",
        "add_step_extra": "Qo'shimcha",
        "add_step_verify": "Tekshirish",
        "add_photo_upload_title": "Rasmlar qo'shish",
        "add_photo_note": "Aniq va sifatli rasmlar qo'shish tavsiya etiladi.",
        "add_field_name": "Nomi",
        "add_field_name_placeholder": "Masalan: Sigir (Golishten) yoki Hashak",
        "add_field_category": "Kategoriya",
        "add_field_desc": "Tavsif",
        "add_field_desc_placeholder": "Tafsilotlar haqida batafsil yozing (kamida 40 ta, ko'pi bilan 100 ta belgi)...",
        "add_field_price": "Narxi",
        "add_field_price_placeholder": "Narxni kiriting",
        "add_field_currency": "so'm"
    },
    'ru': {
        "add_ad_title": "Подать объявление",
        "add_step_details": "Данные",
        "add_step_extra": "Дополнительно",
        "add_step_verify": "Проверка",
        "add_photo_upload_title": "Добавить фото",
        "add_photo_note": "Рекомендуется добавлять четкие и качественные фотографии.",
        "add_field_name": "Название",
        "add_field_name_placeholder": "Например: Корова (Голштин) или Сено",
        "add_field_category": "Категория",
        "add_field_desc": "Описание",
        "add_field_desc_placeholder": "Напишите подробно о деталях (минимум 40, максимум 100 символов)...",
        "add_field_price": "Цена",
        "add_field_price_placeholder": "Введите цену",
        "add_field_currency": "сум"
    },
    'en': {
        "add_ad_title": "Post Ad",
        "add_step_details": "Details",
        "add_step_extra": "Extra",
        "add_step_verify": "Verify",
        "add_photo_upload_title": "Add photos",
        "add_photo_note": "Clear and high quality photos are recommended.",
        "add_field_name": "Title",
        "add_field_name_placeholder": "Example: Cow (Holstein) or Hay",
        "add_field_category": "Category",
        "add_field_desc": "Description",
        "add_field_desc_placeholder": "Write details thoroughly (min 40, max 100 chars)...",
        "add_field_price": "Price",
        "add_field_price_placeholder": "Enter price",
        "add_field_currency": "sum"
    }
}

for lang, data in new_keys.items():
    filepath = f"src/locales/{lang}.json"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = json.load(f)
    content.update(data)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=2)

print("JSON files updated successfully!")
