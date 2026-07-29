import re

with open('mobile-app/App.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Sort modal texts
code = code.replace("{ id: 'newest', name: 'Yangi birinchi' },", "{ id: 'newest', name: t('sort_newest_first') || 'Yangi birinchi' },")
code = code.replace("{ id: 'price_asc', name: 'Arzonroq birinchi' },", "{ id: 'price_asc', name: t('sort_cheap_first') || 'Arzonroq birinchi' },")
code = code.replace("{ id: 'price_desc', name: 'Qimmatroq birinchi' },", "{ id: 'price_desc', name: t('sort_exp_first') || 'Qimmatroq birinchi' },")

# 2. Add Category Modal & "Tanlang"
code = code.replace("if (!cat) return 'Tanlang';", "if (!cat) return t('select') || 'Tanlang';")
code = code.replace("<Text style={styles.addModalTitle}>Kategoriyani tanlang</Text>", "<Text style={styles.addModalTitle}>{t('add_cat_modal_title')}</Text>")

# 3. Add Location Helper Function near the top of Add Screen component, or just replace inline.
# Since it's used in a few places, replacing inline is safer and avoids syntax issues:
loc_render_code = """{addLocation.includes(',') 
                      ? (t('reg_' + addLocation.split(',')[0].trim().replace(/[\\s\\‘\\'.-]/g, '_')) || addLocation.split(',')[0].trim()) + ', ' + 
                        (t('dist_' + addLocation.split(',')[1].trim().replace(/[\\s\\‘\\'.-]/g, '_')) || addLocation.split(',')[1].trim())
                      : (t('reg_' + addLocation.replace(/[\\s\\‘\\'.-]/g, '_')) || addLocation)}"""
code = code.replace("<Text style={styles.addDropdownValue}>{addLocation}</Text>", f"<Text style={{styles.addDropdownValue}}>{loc_render_code}</Text>")

# The preview card location in add modal
code = code.replace("<Text style={styles.previewMetaText}>{addLocation}</Text>", f"<Text style={{styles.previewMetaText}}>{loc_render_code}</Text>")

# Location Modals
code = code.replace("<Text style={[styles.addFieldLabel, { marginTop: 8 }]}>Qo'lda kiritish (Viloyat va tuman)</Text>", "<Text style={[styles.addFieldLabel, { marginTop: 8 }]}>{t('add_manual_loc')}</Text>")
code = code.replace("<Text style={styles.addModalTitle}>Hududni tanlang</Text>", "<Text style={styles.addModalTitle}>{t('add_region_modal_title')}</Text>")
code = code.replace("<Text style={{ textAlign: 'center', padding: 20, color: '#7C8A79' }}>Avval viloyatni tanlang</Text>", "<Text style={{ textAlign: 'center', padding: 20, color: '#7C8A79' }}>{t('select_region_first')}</Text>")

code = code.replace("<Text style={styles.addModalTitle}>{selectedViloyat || 'Tuman'} tumanini tanlang</Text>",
                    "<Text style={styles.addModalTitle}>{t('select_district_prefix')} {selectedViloyat ? (t('reg_' + selectedViloyat.replace(/[\\s\\‘\\'.-]/g, '_')) || selectedViloyat) : t('district')} {t('select_district_suffix')}</Text>")

code = code.replace("{tuman}", "{t('dist_' + tuman.replace(/[\\s\\‘\\'.-]/g, '_')) || tuman}")

# 4. Extra Form Fields
code = code.replace("<Text style={[styles.addFieldLabel, { marginTop: 8, fontSize: 14, borderBottomWidth: 1, borderBottomColor: '#F0F3EF', paddingBottom: 6, marginBottom: 10 }]}>Hayvon ma'lumotlari</Text>",
                    "<Text style={[styles.addFieldLabel, { marginTop: 8, fontSize: 14, borderBottomWidth: 1, borderBottomColor: '#F0F3EF', paddingBottom: 6, marginBottom: 10 }]}>{t('add_field_animal_info')}</Text>")
code = code.replace("<Text style={styles.addFieldLabel}>Jinsi</Text>", "<Text style={styles.addFieldLabel}>{t('add_field_gender')}</Text>")
code = code.replace("['Erkak','Urg\\'ochi']", "[t('gender_male'), t('gender_female')]")

code = code.replace("<Text style={styles.addFieldLabel}>Yoshi</Text>", "<Text style={styles.addFieldLabel}>{t('add_field_age')}</Text>")
code = code.replace("placeholder=\"Masalan: 3 yosh\"", "placeholder={t('add_ph_age')}")

code = code.replace("<Text style={styles.addFieldLabel}>Zoti</Text>", "<Text style={styles.addFieldLabel}>{t('add_field_breed')}</Text>")
code = code.replace("placeholder=\"Masalan: Golishten, Edilbay\"", "placeholder={t('add_ph_breed')}")

code = code.replace("<Text style={styles.addFieldLabel}>Holati</Text>", "<Text style={styles.addFieldLabel}>{t('add_field_health')}</Text>")
code = code.replace("[\"Sog'lom\",'Kasal','Davolanmoqda']", "[t('health_good'), t('health_sick'), t('health_healing')]")

code = code.replace("<Text style={styles.addFieldLabel}>Sutdorligi (l/kun)</Text>", "<Text style={styles.addFieldLabel}>{t('add_field_milk')}</Text>")
code = code.replace("placeholder=\"Masalan: 20-25 l/kun\"", "placeholder={t('add_ph_milk')}")

code = code.replace("<Text style={styles.addFieldLabel}>Og'irligi (kg)</Text>", "<Text style={styles.addFieldLabel}>{t('add_field_weight')}</Text>")
code = code.replace("placeholder=\"Masalan: 450-500 kg\"", "placeholder={t('add_ph_weight')}")

code = code.replace("<Text style={styles.addFieldLabel}>Emlangan (vaksinatsiya)</Text>", "<Text style={styles.addFieldLabel}>{t('add_field_vaccine')}</Text>")
code = code.replace("['Ha', \"Yo'q\"]", "[t('vaccine_yes'), t('vaccine_no')]")

code = code.replace("<Text style={[styles.addFieldLabel, { marginTop: 8, fontSize: 14, borderBottomWidth: 1, borderBottomColor: '#F0F3EF', paddingBottom: 6, marginBottom: 10 }]}>Xizmat ma'lumotlari</Text>",
                    "<Text style={[styles.addFieldLabel, { marginTop: 8, fontSize: 14, borderBottomWidth: 1, borderBottomColor: '#F0F3EF', paddingBottom: 6, marginBottom: 10 }]}>{t('add_field_service_info')}</Text>")
code = code.replace("<Text style={styles.addFieldLabel}>Xizmat turi</Text>", "<Text style={styles.addFieldLabel}>{t('add_field_service_type')}</Text>")
code = code.replace("placeholder=\"Masalan: Uy sharoitida muolaja\"", "placeholder={t('add_ph_service')}")

code = code.replace("<Text style={styles.addFieldLabel}>Tajriba (yil)</Text>", "<Text style={styles.addFieldLabel}>{t('add_field_experience')}</Text>")
code = code.replace("placeholder=\"Masalan: 5 yil\"", "placeholder={t('add_ph_exp')}")

code = code.replace("<Text style={[styles.addFieldLabel, { marginTop: 8, fontSize: 14, borderBottomWidth: 1, borderBottomColor: '#F0F3EF', paddingBottom: 6, marginBottom: 10 }]}>Mahsulot ma'lumotlari</Text>",
                    "<Text style={[styles.addFieldLabel, { marginTop: 8, fontSize: 14, borderBottomWidth: 1, borderBottomColor: '#F0F3EF', paddingBottom: 6, marginBottom: 10 }]}>{t('add_field_product_info')}</Text>")
code = code.replace("<Text style={styles.addFieldLabel}>Navi / Turi</Text>", "<Text style={styles.addFieldLabel}>{t('add_field_product_type')}</Text>")
code = code.replace("placeholder=\"Masalan: Premium yem\"", "placeholder={t('add_ph_product_type')}")

code = code.replace("<Text style={styles.addFieldLabel}>Hajm / Og'irligi</Text>", "<Text style={styles.addFieldLabel}>{t('add_field_volume')}</Text>")
code = code.replace("placeholder=\"Masalan: 20 kg, 1 litr\"", "placeholder={t('add_ph_volume')}")

code = code.replace("<Text style={[styles.addFieldLabel, { marginTop: 16, fontSize: 14, borderBottomWidth: 1, borderBottomColor: '#F0F3EF', paddingBottom: 6, marginBottom: 10 }]}>Aloqa ma'lumotlari</Text>",
                    "<Text style={[styles.addFieldLabel, { marginTop: 16, fontSize: 14, borderBottomWidth: 1, borderBottomColor: '#F0F3EF', paddingBottom: 6, marginBottom: 10 }]}>{t('add_field_contact_info')}</Text>")

with open('mobile-app/App.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("App.js patched successfully!")
