import React from 'react';
import './App.css';
import logoImage from './assets/logo.png';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="container nav-container">
        <div className="logo-section" onClick={() => window.location.href = '/'}>
          <img src={logoImage} alt="Zoovita Logo" className="logo-image" style={{ cursor: 'pointer' }} />
        </div>
        <div className="nav-links">
          <a href="/" className="nav-link">Bosh sahifa</a>
        </div>
      </div>
    </nav>
  );
}

function PrivacyPolicy() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="container" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'left', lineHeight: '1.6' }}>
        <h1 style={{ marginBottom: '20px', color: '#15330F' }}>Maxfiylik Siyosati (Privacy Policy)</h1>
        
        <p style={{ marginBottom: '15px' }}>
          <strong>Oxirgi yangilanish:</strong> 29-iyul, 2026-yil
        </p>

        <p style={{ marginBottom: '15px' }}>
          Ushbu Maxfiylik siyosati "Zoovita" mobil ilovasi (bundan buyon matnda "Ilova") va xizmatlaridan foydalanganingizda shaxsiy ma'lumotlaringiz qanday yig'ilishi, foydalanilishi va himoya qilinishini tushuntiradi.
        </p>

        <h2 style={{ marginTop: '30px', marginBottom: '15px', color: '#3C8E2D' }}>1. Qanday ma'lumotlarni yig'amiz?</h2>
        <p style={{ marginBottom: '15px' }}>Ilovadan to'liq foydalanishingiz uchun biz quyidagi shaxsiy ma'lumotlarni yig'ishimiz mumkin:</p>
        <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
          <li style={{ marginBottom: '5px' }}><strong>Shaxsiy ma'lumotlar:</strong> Ism, telefon raqami, elektron pochta manzili (agar taqdim etilsa).</li>
          <li style={{ marginBottom: '5px' }}><strong>Joylashuv ma'lumotlari:</strong> E'lonlarni sizga yaqinroq ko'rsatish va xaritada joylashuvni aniqlash uchun taxminiy yoki aniq joylashuv ma'lumotlari.</li>
          <li style={{ marginBottom: '5px' }}><strong>Media fayllar:</strong> E'lon berishda yuklagan rasm va videolaringiz.</li>
        </ul>

        <h2 style={{ marginTop: '30px', marginBottom: '15px', color: '#3C8E2D' }}>2. Ma'lumotlardan qanday foydalanamiz?</h2>
        <p style={{ marginBottom: '15px' }}>Biz yig'gan ma'lumotlarni quyidagi maqsadlarda ishlatamiz:</p>
        <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
          <li style={{ marginBottom: '5px' }}>Sizga xizmatlarimizni taqdim etish va ilova ishlashini ta'minlash (masalan, e'lonlaringizni boshqalarga ko'rsatish).</li>
          <li style={{ marginBottom: '5px' }}>Foydalanuvchilar o'rtasida aloqa o'rnatish (xaridor va sotuvchilar bir-birini topishi uchun).</li>
          <li style={{ marginBottom: '5px' }}>Xizmat sifatini oshirish va xatoliklarni bartaraf etish.</li>
        </ul>

        <h2 style={{ marginTop: '30px', marginBottom: '15px', color: '#3C8E2D' }}>3. Ma'lumotlarni himoya qilish</h2>
        <p style={{ marginBottom: '15px' }}>
          Sizning ma'lumotlaringiz xavfsizligi biz uchun muhim. Ma'lumotlaringiz zamonaviy shifrlash (encryption) usullari bilan himoyalanadi va ruxsatsiz shaxslarga berilmaydi.
        </p>

        <h2 style={{ marginTop: '30px', marginBottom: '15px', color: '#3C8E2D' }}>4. Ma'lumotlarni o'chirish huquqi</h2>
        <p style={{ marginBottom: '15px' }}>
          Siz istalgan vaqtda o'z shaxsiy hisobingizni (akkauntni) va barcha bog'liq ma'lumotlarni Ilova ichidagi profil sozlamalaridan yoki biz bilan bog'lanish orqali butunlay o'chirib tashlashni talab qilish huquqiga egasiz.
        </p>

        <h2 style={{ marginTop: '30px', marginBottom: '15px', color: '#3C8E2D' }}>5. Biz bilan bog'lanish</h2>
        <p style={{ marginBottom: '15px' }}>
          Maxfiylik siyosati yuzasidan savollar yoki takliflar bo'lsa, quyidagi manzil orqali biz bilan bog'lanishingiz mumkin:
        </p>
        <p style={{ marginBottom: '15px' }}>
          <strong>Email:</strong> support@zoovita.uz<br/>
        </p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
