import re
import sys

with open("mobile-app/App.js", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Remove POPULAR_PRODUCTS, LISTINGS_SCREEN_DATA, PRODUCT_DETAILS, LISTINGS_CATEGORIES, ALL_ADD_CATEGORIES
content = re.sub(r'const POPULAR_PRODUCTS = \[.*?\];\n', '', content, flags=re.DOTALL)
content = re.sub(r'const PRODUCT_DETAILS = \{.*?\};\n', '', content, flags=re.DOTALL)
content = re.sub(r'const LISTINGS_SCREEN_DATA = \[.*?\];\n', '', content, flags=re.DOTALL)
content = re.sub(r'const LISTINGS_CATEGORIES = \[.*?\];\n', '', content, flags=re.DOTALL)
content = re.sub(r'const ALL_ADD_CATEGORIES = \[.*?\];\n', '', content, flags=re.DOTALL)

# 2. Replace LISTINGS_SCREEN_DATA with ads
content = content.replace('LISTINGS_SCREEN_DATA', 'ads')

# 3. Replace POPULAR_PRODUCTS with ads
content = content.replace('POPULAR_PRODUCTS', 'ads')

# 4. Map the ad data properly in UI
# Replace item.image -> item.images?.[0] || 'https://via.placeholder.com/400'
content = content.replace('item.image', "(item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/400')")
content = content.replace('product.image', "(product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/400')")

# Replace item.seller -> item.contact_name
content = content.replace('item.seller', 'item.contact_name')
content = content.replace('product.seller', 'product.contact_name')

# Replace item.details -> item.description
content = content.replace('item.details', 'item.description')
content = content.replace('product.details', 'product.description')

# Replace item.date -> item.created_at ? new Date(item.created_at).toLocaleDateString() : ''
content = content.replace('item.date', "(item.created_at ? new Date(item.created_at).toLocaleDateString('uz-UZ') : '')")

# Fix discount code (remove it since ads don't have discount)
content = re.sub(r'<View style=\{styles\.discountBadge\}>.*?<\/View>', '', content, flags=re.DOTALL)

# Fix oldPrice code (remove it since ads don't have oldPrice)
content = re.sub(r'<Text style=\{styles\.productOldPrice\}>\{product\.oldPrice\}<\/Text>', '', content)

# 5. Replace ALL_ADD_CATEGORIES with categories
# Find the render function logic for Categories Modal:
# <View style={styles.catGrid}> {categories.filter(c => c.section === 'animals').map...
content = content.replace('ALL_ADD_CATEGORIES', 'categories')

# For the Add Category button rendering, it uses `cat.icon`, `cat.iconType`, `cat.color`, `cat.iconColor`
# Since dynamic categories have `image_url` instead, let's fix it.
category_button_regex = r'<View style=\s*\{\[styles\.catIconWrapper, \{ backgroundColor: cat\.color \}\]\}\s*>\s*<.*?name=\{cat\.icon\}(.|\n)*?<\/View>'
replacement = """<View style={[styles.catIconWrapper, { backgroundColor: '#F0F0F0', overflow: 'hidden' }]}>
                                {cat.image_url ? (
                                  <Image source={{ uri: cat.image_url }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                                ) : (
                                  <Feather name="grid" size={24} color="#3C8E2D" />
                                )}
                              </View>"""
content = re.sub(category_button_regex, replacement, content)

# 6. Add ad submission logic inside `handleAdSubmit`
# Look for handleAdSubmit = () => {
submit_logic = """const handleAdSubmit = async () => {
    if (!addTitle || !addPrice || !addLocation || !addContactName || !addContactPhone) {
      Alert.alert("Xatolik", "Iltimos, barcha majburiy maydonlarni to'ldiring.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      const formData = new FormData();
      formData.append('title', addTitle);
      formData.append('description', addDesc);
      formData.append('price', addPrice);
      formData.append('location', addLocation);
      formData.append('contact_name', addContactName);
      formData.append('contact_phone', addContactPhone);
      formData.append('category_id', addCategory || 1);
      formData.append('has_delivery', addDelivery ? 'true' : 'false');
      formData.append('latitude', addCoordinates.latitude);
      formData.append('longitude', addCoordinates.longitude);
      if (addContactEmail) formData.append('contact_email', addContactEmail);
      if (addContactTelegram) formData.append('contact_telegram', addContactTelegram);

      addPhotos.forEach((photoUri, index) => {
        formData.append('images', {
          uri: photoUri,
          type: 'image/jpeg',
          name: `ad_photo_${index}.jpg`,
        });
      });

      const apiUrl = 'https://api.zoovita.uz';
      const res = await fetch(`${apiUrl}/api/v1/ads`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (res.ok) {
        Alert.alert("Muvaffaqiyatli", "E'loningiz qabul qilindi!");
        
        // Reset form
        setAddStep(1);
        setAddPhotos([]);
        setAddTitle('');
        setAddDesc('');
        setAddPrice('');
        setDashboardTab('bozor');
        
        // Refresh ads
        fetchDashboardData();
      } else {
        const err = await res.json();
        Alert.alert("Xatolik", err.detail || "E'lonni saqlashda xatolik yuz berdi");
      }
    } catch (e) {
      console.log('Error submitting ad:', e);
      Alert.alert("Xatolik", "Tarmoq xatosi. Iltimos qaytadan urinib ko'ring.");
    }
  };"""
content = re.sub(r'const handleAdSubmit = \(\) => \{.*?\};', submit_logic, content, flags=re.DOTALL)

with open("mobile-app/App.js", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated App.js")
