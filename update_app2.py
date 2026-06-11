import re
import sys

with open("mobile-app/App.js", "r", encoding="utf-8") as f:
    content = f.read()

submit_logic = """const handleNextStep = async () => {
    if (addStep === 1) {
      if (!addTitle.trim() || !addDesc.trim() || !addPrice.trim()) {
        Alert.alert("Xatolik", "Iltimos, nom, ta'rif va narxni kiriting.");
        return;
      }
      setAddStep(2);
    } else if (addStep === 2) {
      if (!addContactName.trim()) {
        Alert.alert("Xatolik", "Iltimos, ismingizni kiriting.");
        return;
      }
      if (!addContactPhone.trim()) {
        Alert.alert("Xatolik", "Iltimos, telefon raqamingizni kiriting.");
        return;
      }
      setAddStep(3);
    } else if (addStep === 3) {
      const formattedPrice = addPrice.replace(/\\D/g, '').replace(/\\B(?=(\\d{3})+(?!\\d))/g, " ");
      const finalPrice = formattedPrice ? `${formattedPrice} so'm` : "Kelishilgan narx";

      try {
        const token = await AsyncStorage.getItem('userToken');
        const formData = new FormData();
        formData.append('title', addTitle);
        formData.append('description', addDesc);
        formData.append('price', finalPrice);
        formData.append('location', addLocation);
        formData.append('contact_name', addContactName);
        formData.append('contact_phone', addContactPhone);
        
        let foundCatId = addCategory;
        if(typeof addCategory !== "number") {
           // It might be a string like 'qoramol'. If we can't map it, default to 1.
           // In production, user will select a real category from the list.
           foundCatId = 1;
        }
        formData.append('category_id', foundCatId);
        
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
          setAddContactName('');
          setAddContactPhone('');
          setAddContactEmail('');
          setAddContactTelegram('');
          setAddDelivery(true);
          setAddCoordinates({ latitude: 41.311081, longitude: 69.240562 });
          
          setDashboardTab('bozor');
          fetchDashboardData();
        } else {
          const err = await res.json();
          Alert.alert("Xatolik", err.detail || "E'lonni saqlashda xatolik yuz berdi");
        }
      } catch (e) {
        console.log('Error submitting ad:', e);
        Alert.alert("Xatolik", "Tarmoq xatosi. Iltimos qaytadan urinib ko'ring.");
      }
    }
  };"""

content = re.sub(r'const handleNextStep = \(\) => \{.*?\};', submit_logic, content, flags=re.DOTALL)

with open("mobile-app/App.js", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated App.js with handleNextStep API call")
