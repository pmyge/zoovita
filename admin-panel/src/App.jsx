import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Search,
  Check,
  Trash2,
  Lock,
  User,
  MessageSquare,
  AlertCircle,
  ShieldAlert,
  UserX,
  UserCheck,
  CheckCircle2,
  Power,
  Sliders,
  Plus,
  X,
  Edit,
  Home,
  Upload,
  Image as ImageIcon,
  Grid
} from 'lucide-react';
import './App.css';



// Initial Mock Suggestions
const INITIAL_SUGGESTIONS = [
  {
    id: 5001,
    userName: "Zafar Karimov",
    userPhone: "+998 99 555 44 33",
    text: "Ilovaga veterinarlar bilan to'g'ridan-to'g'ri video aloqa qilish imkoniyatini qo'shsangiz juda yaxshi bo'lar edi.",
    date: "Bugun 11:20",
    status: "new"
  },
  {
    id: 5002,
    userName: "Madina Abdurahmonova",
    userPhone: "+998 93 456 78 90",
    text: "Mahsulotlar bo'limida chorva mollari uchun ozuqa yetkazib berish xizmatini yo'lga qo'yish kerak.",
    date: "Bugun 08:45",
    status: "new"
  },
  {
    id: 5003,
    userName: "Ismoilov Farm",
    userPhone: "+998 90 123 45 67",
    text: "E'lon joylashtirish jarayonida bir nechta rasm yuklash imkoniyatini qo'shing.",
    date: "Kecha 16:30",
    status: "read"
  },
  {
    id: 5004,
    userName: "Ali Valiyev",
    userPhone: "+998 97 111 22 33",
    text: "Chorva mollari uchun dori-darmonlar toifasini kengaytirish kerak.",
    date: "2 May 2026",
    status: "read"
  },
  {
    id: 5005,
    userName: "Farhod Hasanov",
    userPhone: "+998 91 777 66 55",
    text: "Xaritada eng yaqin veterinariya dorixonalarini ko'rsatish funksiyasini kutyapmiz.",
    date: "30 Aprel 2026",
    status: "read"
  },
  {
    id: 5006,
    userName: "Umida Karimova",
    userPhone: "+998 94 333 22 11",
    text: "Ilova juda tez va qulay ishlayapti, rahmat ijodkorlarga!",
    date: "28 Aprel 2026",
    status: "new"
  }
];

function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Application Data States
  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS);

  // Home Screen Configuration Data States
  const [banners, setBanners] = useState([]);
  const [isAddingBanner, setIsAddingBanner] = useState(false);
  const [selectedBannerImage, setSelectedBannerImage] = useState(null);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('https://api.zoovita.uz/api/v1/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Kategoriyalarni yuklashda xato:", err);
    }
  };

  const fetchAds = async () => {
    try {
      const res = await fetch('https://api.zoovita.uz/api/v1/ads');
      if (res.ok) {
        const data = await res.json();
        const mappedAds = data.map(ad => {
          let catName = 'Noma\'lum';
          if (categories.length > 0) {
            const cat = categories.find(c => c.id === ad.category_id);
            if (cat) catName = cat.name;
          }
          return {
            id: ad.id,
            title: ad.title,
            location: ad.location,
            category: catName,
            price: ad.price ? `${ad.price} so'm` : "Kelishiladi",
            seller: ad.contact_name || (ad.seller ? ad.seller.name : "Noma'lum"),
            verified: true,
            date: ad.created_at ? new Date(ad.created_at).toLocaleDateString('uz-UZ') : "Noma'lum",
            status: "active",
            image: ad.images && ad.images.length > 0 ? ad.images[0] : "https://via.placeholder.com/400"
          };
        });
        setListings(mappedAds);
      }
    } catch (err) {
      console.error("Failed to fetch ads", err);
    }
  };

  useEffect(() => {
    if (categories.length > 0) {
      fetchAds();
    }
  }, [categories]);

  const animalCategories = categories.filter(c => c.section === 'animals');
  const productCategories = categories.filter(c => c.section === 'products');
  const serviceCategories = categories.filter(c => c.section === 'services');

  const [activeCategorySubTab, setActiveCategorySubTab] = useState('animals');
  const [animalPage, setAnimalPage] = useState(1);
  const [productPage, setProductPage] = useState(1);
  const [servicePage, setServicePage] = useState(1);
  const [listingsPage, setListingsPage] = useState(1);
  const [suggestionsPage, setSuggestionsPage] = useState(1);

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({
    name: '',
    imageFile: null,
    imagePreview: null,
    section: 'animals'
  });
  const [editingCategory, setEditingCategory] = useState(null);

  const getCategoryData = () => {
    switch (activeCategorySubTab) {
      case 'products':
        return {
          list: productCategories,
          page: productPage,
          setPage: setProductPage,
          label: 'Mahsulotlar'
        };
      case 'services':
        return {
          list: serviceCategories,
          page: servicePage,
          setPage: setServicePage,
          label: 'Xizmatlar'
        };
      default:
        return {
          list: animalCategories,
          page: animalPage,
          setPage: setAnimalPage,
          label: 'Hayvonlar'
        };
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newCategoryData.name);
    formData.append("section", newCategoryData.section);
    if (newCategoryData.imageFile) formData.append("file", newCategoryData.imageFile);

    const url = editingCategory 
      ? `https://api.zoovita.uz/api/v1/admin/categories/${editingCategory.id}`
      : 'https://api.zoovita.uz/api/v1/admin/categories';
    
    try {
      const res = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
        body: formData
      });
      if (res.ok) {
        fetchCategories();
        setIsAddingCategory(false);
        setEditingCategory(null);
        setNewCategoryData({ name: '', imageFile: null, imagePreview: null, section: 'animals' });
      }
    } catch (err) {
      console.error("Kategoriyani saqlashda xato:", err);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Rostdan ham ushbu kategoriyani o'chirmoqchimisiz?")) {
      try {
        const res = await fetch(`https://api.zoovita.uz/api/v1/admin/categories/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        });
        if (res.ok) fetchCategories();
      } catch (err) {
        console.error("O'chirishda xato:", err);
      }
    }
  };

  // Search & Filter States
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Settings State
  const [settings, setSettings] = useState({
    adminEmail: 'admin@zoovita.uz',
    panelName: 'Zoovita Dashboard',
    siteMode: 'production',
    systemAlert: "Tizim rejali profilaktika ishlari tufayli yakshanba kuni soat 02:00 dan 04:00 gacha vaqtincha ishlamasligi mumkin.",
    registrationsOpen: true
  });
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('https://api.zoovita.uz/api/v1/admin/users');
      const data = await res.json();
      if (res.ok) {
        const mappedUsers = data.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email || 'Kiritilmagan',
          phone: u.phone || 'Kiritilmagan',
          createdAt: u.created_at || 'Noma\'lum',
          status: u.is_active ? 'Faol' : 'Faol emas',
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
        }));
        setUsers(mappedUsers);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const fetchBanners = async () => {
    try {
      const res = await fetch('https://api.zoovita.uz/api/v1/admin/banners');
      const data = await res.json();
      if (res.ok) {
        setBanners(data);
      }
    } catch (err) {
      console.error('Failed to fetch banners', err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUsers();
      fetchBanners();
      const interval = setInterval(() => {
        fetchUsers();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  // Clear query on tab change
  useEffect(() => {
    setSearchQuery('');
    setCategoryFilter('All');
    setListingsPage(1);
    setSuggestionsPage(1);
  }, [activeTab]);

  // Reset page numbers when search query or category filter changes
  useEffect(() => {
    setListingsPage(1);
    setSuggestionsPage(1);
  }, [searchQuery, categoryFilter]);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Iltimos, barcha maydonlarni to\'ldiring!');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('https://api.zoovita.uz/api/v1/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('adminToken', data.access_token);
        setIsLoggedIn(true);
      } else {
        setError(data.detail || 'Xatolik yuz berdi');
      }
    } catch (err) {
      setError('Server bilan bog\'lanib bo\'lmadi. Backend ishlayotganini tekshiring.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBannerUpload = async (e) => {
    e.preventDefault();
    if (!selectedBannerImage) {
      alert("Iltimos rasm tanlang");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedBannerImage);

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`https://api.zoovita.uz/api/v1/admin/banners`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        fetchBanners();
        setIsAddingBanner(false);
        setSelectedBannerImage(null);
      } else {
        alert("Rasmni yuklashda xatolik yuz berdi");
      }
    } catch (err) {
      alert("Server bilan ulanishda xato");
    }
  };

  const handleDeleteBanner = async (id) => {
    if (window.confirm("Rostdan ham ushbu bannerni o'chirmoqchimisiz?")) {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`https://api.zoovita.uz/api/v1/admin/banners/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          fetchBanners();
        }
      } catch (e) {
        alert("Xatolik yuz berdi");
      }
    }
  };

  const handleToggleBannerStatus = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`https://api.zoovita.uz/api/v1/admin/banners/${id}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchBanners();
      } else {
        alert("Holatni o'zgartirishda xatolik yuz berdi");
      }
    } catch (e) {
      alert("Server bilan ulanishda xato");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setActiveTab('overview');
  };

  // Listings operations
  const approveListing = (id) => {
    setListings(prev => prev.map(item => item.id === id ? { ...item, status: 'active' } : item));
  };

  const deleteListing = async (id) => {
    if (window.confirm("Haqiqatan ham ushbu e'lonni o'chirmoqchisiz?")) {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`https://api.zoovita.uz/api/v1/admin/ads/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          fetchAds();
        } else {
          alert("Xatolik yuz berdi");
        }
      } catch (err) {
        console.error("Failed to delete ad", err);
        alert("Tarmoq xatosi");
      }
    }
  };

  // User operations & State Management
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [sentOtp, setSentOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [newUserData, setNewUserData] = useState({
    name: '', email: '', phone: '', password: '', status: 'Faol'
  });

  // Date helper
  const getCurrentDateTimeString = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  };

  const saveUserEdit = (updatedUser) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setEditingUser(null);
  };

  const toggleUserStatus = (id) => {
    setUsers(prev => prev.map(user => {
      if (user.id === id) {
        const newStatus = user.status === 'Faol' ? 'Faol emas' : 'Faol';
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUserData.name.trim() || !newUserData.email.trim() || !newUserData.phone.trim() || !newUserData.password.trim()) {
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`https://api.zoovita.uz/api/v1/admin/users/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: newUserData.email })
      });
      
      if (res.ok) {
        const data = await res.json();
        setSentOtp(data.otp);
        setOtpInput('');
        setOtpError('');
        setShowOtpScreen(true);
      } else {
        alert('Tasdiqlash kodini yuborishda xatolik yuz berdi');
      }
    } catch (err) {
      alert('Server bilan ulanishda xatolik');
    }
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    if (otpInput === sentOtp) {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`https://api.zoovita.uz/api/v1/admin/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newUserData)
        });
        
        if (res.ok) {
          fetchUsers(); // Refresh table
          setIsAddingUser(false);
          setShowOtpScreen(false);
          setNewUserData({ name: '', email: '', phone: '', status: 'Faol' });
        } else {
          const data = await res.json();
          alert(data.detail || 'Foydalanuvchi qo\'shishda xatolik');
        }
      } catch (err) {
        alert('Server bilan ulanishda xatolik');
      }
    } else {
      setOtpError('Kiritilgan kod noto\'g\'ri');
    }
  };

  // Suggestions operations
  const markSuggestionAsRead = (id) => {
    setSuggestions(prev => prev.map(item => item.id === id ? { ...item, status: 'read' } : item));
  };

  const deleteSuggestion = (id) => {
    if (window.confirm("Haqiqatan ham ushbu taklifni o'chirmoqchisiz?")) {
      setSuggestions(prev => {
        const updated = prev.filter(item => item.id !== id);
        const remainingFiltered = updated.filter(item => 
          item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.userPhone.includes(searchQuery) ||
          item.text.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const maxPage = Math.ceil(remainingFiltered.length / 5) || 1;
        setSuggestionsPage(p => Math.min(p, maxPage));
        return updated;
      });
    }
  };

  // Settings Save
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSettingsSuccess(true);
    setTimeout(() => {
      setSettingsSuccess(false);
    }, 3000);
  };

  // Computations for Stats
  const statActiveUsers = users.filter(u => u.status === 'Faol').length;
  const statTotalAds = listings.length;
  const statTotalSuggestions = suggestions.length;
  const statPendingAds = listings.filter(l => l.status === 'pending').length;

  // Filtered lists
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  );

  const filteredListings = listings.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.seller.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredSuggestions = suggestions.filter(item => 
    item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.userPhone.includes(searchQuery) ||
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tab Header titles helper
  const getTabTitle = () => {
    switch(activeTab) {
      case 'overview': return 'Dashboard';
      case 'users': return 'Foydalanuvchilar';
      case 'home-section': return 'Bosh sahifa';
      case 'categories': return 'Kategoriyalar';
      case 'listings': return 'E\'lonlar boshqaruvi';
      case 'suggestions': return 'Takliflar boshqaruvi';
      case 'settings': return 'Tizim sozlamalari';
      default: return 'Zoovita Admin';
    }
  };

  // LOGIN PAGE COMPONENT
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">
            <div className="logo-icon-wrapper">
              <ShieldAlert size={22} color="#FFFFFF" />
            </div>
            <div>
              <div className="logo-text">Zoovita</div>
              <div className="logo-subtitle">Admin panel</div>
            </div>
          </div>

          <h2 className="login-title">Tizimga kirish</h2>
          <p className="login-desc">Boshqaruv paneliga kirish uchun ma'lumotlarni kiriting</p>

          {error && (
            <div className="login-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="login-form-group">
              <label className="login-label">Foydalanuvchi nomi (Username)</label>
              <div className="login-input-wrapper">
                <User className="login-input-icon" size={18} />
                <input
                  type="text"
                  className="login-input"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="login-form-group">
              <label className="login-label">Parol (Password)</label>
              <div className="login-input-wrapper">
                <Lock className="login-input-icon" size={18} />
                <input
                  type="password"
                  className="login-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  <span>Yuklanmoqda...</span>
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Kirish</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // MAIN DASHBOARD SHELL
  return (
    <div className="dashboard-root">
      
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-text">
            Zoovita<span className="sidebar-logo-dot">.</span>
          </div>
          <div className="sidebar-logo-subtitle">Admin Panel</div>
        </div>

        <nav className="sidebar-menu">
          <button
            className={`sidebar-menu-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button
            className={`sidebar-menu-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} />
            <span>Foydalanuvchilar</span>
          </button>

          <button
            className={`sidebar-menu-btn ${activeTab === 'home-section' ? 'active' : ''}`}
            onClick={() => setActiveTab('home-section')}
          >
            <Home size={18} />
            <span>Bosh sahifa</span>
          </button>

          <button
            className={`sidebar-menu-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <Grid size={18} />
            <span>Kategoriyalar</span>
          </button>

          <button
            className={`sidebar-menu-btn ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            <FileText size={18} />
            <span>E'lonlar</span>
          </button>

          <button
            className={`sidebar-menu-btn ${activeTab === 'suggestions' ? 'active' : ''}`}
            onClick={() => setActiveTab('suggestions')}
          >
            <MessageSquare size={18} />
            <span>Takliflar</span>
          </button>

          <button
            className={`sidebar-menu-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} />
            <span>Tizim sozlamalari</span>
          </button>
        </nav>

        {/* Sidebar Footer (Admin Info) */}
        <div className="sidebar-footer">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
            className="admin-avatar"
            alt="Admin"
            style={{ borderRadius: '18px' }}
          />
          <div className="admin-meta">
            <div className="admin-name">Administrator</div>
            <div className="admin-role">Super Admin</div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="dashboard-main">
        
        {/* Header */}
        <header className="dashboard-header">
          <h1 className="header-title">{getTabTitle()}</h1>
          <div className="header-actions">
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Tizimdan chiqish</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="dashboard-content">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              {/* Welcome banner */}
              <div className="welcome-banner">
                <h2 className="welcome-title">Xush kelibsiz, Administrator!</h2>
                <p className="welcome-subtitle">
                  Zoovita platformasi boshqaruv tizimi yordamida e'lonlar, foydalanuvchi ma'lumotlari hamda mobil ilovadan kelgan takliflarni to'liq nazorat qilishingiz mumkin.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card" onClick={() => setActiveTab('users')} style={{ cursor: 'pointer' }}>
                  <div className="stat-info">
                    <span className="stat-value">{statActiveUsers}</span>
                    <span className="stat-label">Faol Foydalanuvchilar</span>
                  </div>
                  <div className="stat-icon-box" style={{ backgroundColor: '#E6F4EA', color: '#3C8E2D' }}>
                    <Users size={22} />
                  </div>
                </div>

                <div className="stat-card" onClick={() => setActiveTab('listings')} style={{ cursor: 'pointer' }}>
                  <div className="stat-info">
                    <span className="stat-value">{statTotalAds}</span>
                    <span className="stat-label">Jami E'lonlar</span>
                  </div>
                  <div className="stat-icon-box" style={{ backgroundColor: '#EAF4FF', color: '#1E6BFF' }}>
                    <FileText size={22} />
                  </div>
                </div>

                <div className="stat-card" onClick={() => setActiveTab('suggestions')} style={{ cursor: 'pointer' }}>
                  <div className="stat-info">
                    <span className="stat-value">{statTotalSuggestions}</span>
                    <span className="stat-label">Mijozlar takliflari</span>
                  </div>
                  <div className="stat-icon-box" style={{ backgroundColor: '#FFF2E0', color: '#F5A623' }}>
                    <MessageSquare size={22} />
                  </div>
                </div>

                <div className="stat-card" onClick={() => setActiveTab('listings')} style={{ cursor: 'pointer' }}>
                  <div className="stat-info">
                    <span className="stat-value">{statPendingAds}</span>
                    <span className="stat-label">Kutilayotgan E'lonlar</span>
                  </div>
                  <div className="stat-icon-box" style={{ backgroundColor: '#FFEBEB', color: '#FF5A5F' }}>
                    <AlertCircle size={22} />
                  </div>
                </div>
              </div>

              {/* Action Panels Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
                
                {/* Pending Approval List */}
                <div className="content-card">
                  <div className="content-card-header">
                    <h3 className="content-card-title">Tasdiqlash kutilayotgan e'lonlar</h3>
                    <button className="sidebar-menu-btn" onClick={() => setActiveTab('listings')} style={{ padding: '6px 12px', fontSize: '12px' }}>
                      Barchasi
                    </button>
                  </div>
                  <div className="table-container">
                    {listings.filter(l => l.status === 'pending').length === 0 ? (
                      <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <CheckCircle2 size={36} color="var(--primary)" style={{ marginBottom: '10px' }} />
                        <p>Tasdiqlash kutilayotgan e'lonlar mavjud emas.</p>
                      </div>
                    ) : (
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>E'lon</th>
                            <th>Narx</th>
                            <th>Muallif</th>
                            <th style={{ textAlign: 'right' }}>Amallar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {listings.filter(l => l.status === 'pending').map(item => (
                            <tr key={item.id}>
                              <td>
                                <div className="listing-item-info">
                                  <img src={item.image} className="listing-item-img" alt={item.title} />
                                  <div>
                                    <div className="listing-item-title">{item.title}</div>
                                    <div className="listing-item-cat">{item.category}</div>
                                  </div>
                                </div>
                              </td>
                              <td><span className="price-text">{item.price}</span></td>
                              <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{item.seller}</td>
                              <td>
                                <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                                  <button className="action-btn approve" title="Tasdiqlash" onClick={() => approveListing(item.id)}>
                                    <Check size={14} />
                                  </button>
                                  <button className="action-btn delete" title="Rad etish" onClick={() => deleteListing(item.id)}>
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* New Users List */}
                <div className="content-card">
                  <div className="content-card-header">
                    <h3 className="content-card-title">Yangi a'zolar</h3>
                    <button className="sidebar-menu-btn" onClick={() => setActiveTab('users')} style={{ padding: '6px 12px', fontSize: '12px' }}>
                      Barchasi
                    </button>
                  </div>
                  <div className="table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Foydalanuvchi</th>
                          <th>Sana</th>
                          <th>Holat</th>
                          <th style={{ textAlign: 'right' }}>Amallar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.slice(0, 4).map(user => (
                          <tr key={user.id}>
                            <td style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-muted)' }}>#{user.id}</td>
                            <td>
                              <div className="user-cell">
                                {user.avatar ? (
                                  <img src={user.avatar} className="user-cell-img" alt={user.name} />
                                ) : (
                                  <div className="user-cell-initial" style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 16 }}>
                                    {user.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <div className="user-cell-name">{user.name}</div>
                                  <div className="user-cell-email">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{user.createdAt}</td>
                            <td>
                              <span className={`status-badge ${user.status === 'Faol' ? 'active' : 'pending'}`}>
                                {user.status}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                                <button className="action-btn approve" title="Tahrirlash" onClick={() => setEditingUser({ ...user })}>
                                  <Edit size={14} />
                                </button>
                                <button
                                  className="action-btn"
                                  style={{ backgroundColor: '#F2F2F2', color: 'var(--text-muted)' }}
                                  title={user.status === 'Faol' ? "Bloklash" : "Faollashtirish"}
                                  onClick={() => toggleUserStatus(user.id)}
                                >
                                  {user.status === 'Faol' ? <UserX size={14} /> : <UserCheck size={14} />}
                                </button>
                                <button className="action-btn delete" title="O'chirish" onClick={() => setDeleteConfirmUser(user)}>
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </>
          )}

          {/* TAB 2: USERS */}
          {activeTab === 'users' && (
            <div className="content-card">
              <div className="content-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <h3 className="content-card-title">Ro'yxatdan o'tgan foydalanuvchilar ({filteredUsers.length})</h3>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button
                    className="login-btn"
                    style={{
                      height: '38px',
                      width: 'auto',
                      padding: '0 16px',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: 'none'
                    }}
                    onClick={() => {
                      setNewUserData({
                        name: '',
                        email: '',
                        phone: '',
                        status: 'Faol'
                      });
                      setIsAddingUser(true);
                    }}
                  >
                    <Plus size={16} />
                    <span>Foydalanuvchi qo'shish</span>
                  </button>
                  <div className="search-box">
                    <Search className="search-icon" size={16} />
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Ism, Email yoki Telefon qidirish..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="table-container">
                {filteredUsers.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Foydalanuvchilar topilmadi.
                  </div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Foydalanuvchi</th>
                        <th>Telefon raqami</th>
                        <th>Holati</th>
                        <th>Ro'yxatdan o'tgan sana</th>
                        <th>Amallar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr key={user.id}>
                          <td style={{ fontSize: '13.5px', fontWeight: 'bold', color: 'var(--text-muted)' }}>#{user.id}</td>
                          <td>
                            <div className="user-cell">
                              {user.avatar ? (
                                <img src={user.avatar} className="user-cell-img" alt={user.name} />
                              ) : (
                                <div className="user-cell-initial" style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 18 }}>
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <div className="user-cell-name">{user.name}</div>
                                <div className="user-cell-email">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ fontSize: '13.5px' }}>{user.phone}</td>
                          <td>
                            <span className={`status-badge ${user.status === 'Faol' ? 'active' : 'pending'}`}>
                              {user.status}
                            </span>
                          </td>
                          <td style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>{user.createdAt}</td>
                          <td>
                            <div className="action-buttons">
                              <button className="action-btn approve" title="Tahrirlash" onClick={() => setEditingUser({ ...user })}>
                                <Edit size={14} />
                              </button>
                                                   <button 
                                className={`action-btn ${user.status === 'Faol' ? 'delete' : 'approve'}`}
                                title={user.status === 'Faol' ? "Bloklash" : "Faollashtirish"}
                                onClick={async () => {
                                  if (window.confirm(`Foydalanuvchini ${user.status === 'Faol' ? 'bloklamoqchimisiz' : 'faollashtirmoqchimisiz'}?`)) {
                                    try {
                                      const token = localStorage.getItem('adminToken');
                                      const res = await fetch(`https://api.zoovita.uz/api/v1/admin/users/${user.id}/block`, {
                                        method: 'PUT',
                                        headers: { 'Authorization': `Bearer ${token}` }
                                      });
                                      if (res.ok) {
                                        fetchUsers();
                                      }
                                    } catch (err) {
                                      alert("Xatolik yuz berdi");
                                    }
                                  }
                                }}
                              >
                                {user.status === 'Faol' ? <UserX size={15} /> : <UserCheck size={15} />}
                              </button>
                              <button className="action-btn delete" title="O'chirish" onClick={() => setDeleteConfirmUser(user)}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* TAB: BOSH SAHIFA SECTION (HOME SECTION EDITOR) */}
          {activeTab === 'home-section' && (
            /* Banner Management */
            <div className="content-card">
              <div className="content-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="content-card-title">Mobil ilova promo bannerlari</h3>
                <button
                  className="login-btn"
                  style={{ height: '38px', width: 'auto', padding: '0 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: 'none' }}
                  onClick={() => setIsAddingBanner(true)}
                >
                  <Plus size={16} />
                  <span>Banner qo'shish</span>
                </button>
              </div>
              <div className="table-container">
                {banners.length === 0 ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Reklama bannerlari mavjud emas.
                  </div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Rasm</th>
                        <th>Yaratilgan sana</th>
                        <th>Holati</th>
                        <th>Amallar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {banners.map(banner => (
                        <tr key={banner.id}>
                          <td style={{ fontSize: '13.5px', fontWeight: 'bold', color: 'var(--text-muted)' }}>#{banner.id}</td>
                          <td>
                            <img src={banner.image} style={{ width: '80px', height: '40px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-color)' }} alt="Banner" />
                          </td>
                          <td style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>{banner.createdAt}</td>
                          <td>
                            <span className={`status-badge ${banner.status === 'Faol' ? 'active' : 'pending'}`}>
                              {banner.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="action-btn approve"
                                title="Holatni o'zgartirish"
                                onClick={() => handleToggleBannerStatus(banner.id)}
                              >
                                <Power size={14} />
                              </button>
                              <button
                                className="action-btn delete"
                                title="O'chirish"
                                onClick={() => handleDeleteBanner(banner.id)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* TAB: KATEGORIYALAR */}
          {activeTab === 'categories' && (() => {
            const { list, page, setPage, setList } = getCategoryData();
            const totalItems = list.length;
            const totalPages = Math.ceil(totalItems / 4) || 1;
            const startIndex = (page - 1) * 4;
            const paginatedList = list.slice(startIndex, startIndex + 4);

            return (
              <div className="content-card">
                <div className="content-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <h3 className="content-card-title">Kategoriyalar boshqaruvi</h3>
                  <button
                    className="login-btn"
                    style={{ height: '38px', width: 'auto', padding: '0 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: 'none' }}
                    onClick={() => {
                      setNewCategoryData({
                        name: '',
                        imageFile: null,
                        imagePreview: null,
                        section: activeCategorySubTab
                      });
                      setIsAddingCategory(true);
                    }}
                  >
                    <Plus size={16} />
                    <span>Toifa qo'shish</span>
                  </button>
                </div>

                {/* Sub-tabs Switcher */}
                <div className="category-subtabs">
                  <button
                    className={`category-subtab-btn ${activeCategorySubTab === 'animals' ? 'active' : ''}`}
                    onClick={() => setActiveCategorySubTab('animals')}
                  >
                    Hayvonlar bo'limi ({animalCategories.length})
                  </button>
                  <button
                    className={`category-subtab-btn ${activeCategorySubTab === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveCategorySubTab('products')}
                  >
                    Mahsulotlar bo'limi ({productCategories.length})
                  </button>
                  <button
                    className={`category-subtab-btn ${activeCategorySubTab === 'services' ? 'active' : ''}`}
                    onClick={() => setActiveCategorySubTab('services')}
                  >
                    Xizmatlar bo'limi ({serviceCategories.length})
                  </button>
                </div>

                <div className="table-container">
                  {paginatedList.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Kategoriyalar topilmadi.
                    </div>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Rasm</th>
                          <th>Toifa nomi</th>
                          <th>Yaratilgan sana</th>
                          <th>Amallar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedList.map(category => (
                          <tr key={category.id}>
                            <td style={{ fontSize: '13.5px', fontWeight: 'bold', color: 'var(--text-muted)' }}>#{category.id}</td>
                            <td>
                              <img
                                src={category.image || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=150'}
                                style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                                alt={category.name}
                              />
                            </td>
                            <td style={{ fontWeight: '700', color: 'var(--primary-dark)' }}>{category.name}</td>
                            <td style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>{category.createdAt}</td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="action-btn approve"
                                  title="Tahrirlash"
                                  onClick={() => setEditingCategory({ ...category, section: activeCategorySubTab })}
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  className="action-btn delete"
                                  title="O'chirish"
                                  onClick={() => {
                                    if (window.confirm(`Haqiqatan ham "${category.name}" toifasini o'chirmoqchisiz?`)) {
                                      setList(prev => prev.filter(c => c.id !== category.id));
                                      const newLength = list.length - 1;
                                      const maxPage = Math.ceil(newLength / 4) || 1;
                                      if (page > maxPage) {
                                        setPage(maxPage);
                                      }
                                    }
                                  }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Pagination Controls */}
                <div className="pagination-wrapper">
                  <div className="pagination-info">
                    Jami {totalItems} ta toifadan {totalItems > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + 4, totalItems)} ko'rsatilmoqda
                  </div>
                  {totalPages > 1 && (
                    <div className="pagination-controls">
                      <button
                        className="pagination-btn"
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(p - 1, 1))}
                      >
                        Oldingi
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                        <button
                          key={pageNum}
                          className={`pagination-btn ${page === pageNum ? 'active' : ''}`}
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      ))}
                      <button
                        className="pagination-btn"
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                      >
                        Keyingi
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* TAB 3: LISTINGS */}
          {activeTab === 'listings' && (() => {
            const itemsPerPage = 5;
            const totalItems = filteredListings.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
            const startIndex = (listingsPage - 1) * itemsPerPage;
            const paginatedList = filteredListings.slice(startIndex, startIndex + itemsPerPage);

            return (
              <div className="content-card">
                <div className="content-card-header" style={{ flexDirection: 'row', gap: '16px', flexWrap: 'wrap' }}>
                  <h3 className="content-card-title">Platformadagi barcha e'lonlar ({totalItems})</h3>
                  
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    
                    {/* Category Filter Chips */}
                    <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '4px 0' }}>
                      {['All', ...categories.map(c => c.name)].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            border: '1px solid var(--border-color)',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            backgroundColor: categoryFilter === cat ? 'var(--primary)' : '#FFFFFF',
                            color: categoryFilter === cat ? '#FFFFFF' : 'var(--text-main)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {cat === 'All' ? 'Barchasi' : cat}
                        </button>
                      ))}
                    </div>

                    <div className="search-box">
                      <Search className="search-icon" size={16} />
                      <input
                        type="text"
                        className="search-input"
                        placeholder="E'lon nomi, muallif, joylashuv..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="table-container">
                  {paginatedList.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      E'lonlar topilmadi.
                    </div>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>E'lon</th>
                          <th>Joylashuv</th>
                          <th>Narx</th>
                          <th>Sotuvchi</th>
                          <th>Sana</th>
                          <th>Amallar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedList.map(item => (
                          <tr key={item.id}>
                            <td style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                              #{item.id}
                            </td>
                            <td>
                              <div className="listing-item-info">
                                <img src={item.image} className="listing-item-img" alt={item.title} />
                                <div>
                                  <div className="listing-item-title">{item.title}</div>
                                  <div className="listing-item-cat">{item.category}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{item.location}</td>
                            <td><span className="price-text">{item.price}</span></td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ fontSize: '13px', fontWeight: '600' }}>{item.seller}</span>
                                {item.verified && <span style={{ color: 'var(--primary)', fontSize: '10px', fontWeight: 'bold' }}>[v]</span>}
                              </div>
                            </td>
                            <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{item.date}</td>
                            <td>
                              <div className="action-buttons">
                                <button className="action-btn delete" title="O'chirish" onClick={() => deleteListing(item.id)}>
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Pagination Controls */}
                <div className="pagination-wrapper">
                  <div className="pagination-info">
                    Jami {totalItems} ta e'londan {totalItems > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + itemsPerPage, totalItems)} ko'rsatilmoqda
                  </div>
                  {totalPages > 1 && (
                    <div className="pagination-controls">
                      <button
                        className="pagination-btn"
                        disabled={listingsPage === 1}
                        onClick={() => setListingsPage(p => Math.max(p - 1, 1))}
                      >
                        Oldingi
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                        <button
                          key={pageNum}
                          className={`pagination-btn ${listingsPage === pageNum ? 'active' : ''}`}
                          onClick={() => setListingsPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      ))}
                      <button
                        className="pagination-btn"
                        disabled={listingsPage === totalPages}
                        onClick={() => setListingsPage(p => Math.min(p + 1, totalPages))}
                      >
                        Keyingi
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* TAB 4: SUGGESTIONS */}
          {activeTab === 'suggestions' && (() => {
            const itemsPerPage = 5;
            const totalItems = filteredSuggestions.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
            const startIndex = (suggestionsPage - 1) * itemsPerPage;
            const paginatedList = filteredSuggestions.slice(startIndex, startIndex + itemsPerPage);

            return (
              <div className="content-card">
                <div className="content-card-header" style={{ flexDirection: 'row', gap: '16px', flexWrap: 'wrap' }}>
                  <h3 className="content-card-title">Mijozlar takliflari ({totalItems})</h3>
                  
                  <div className="search-box">
                    <Search className="search-icon" size={16} />
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Foydalanuvchi, telefon yoki taklif matni..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="table-container">
                  {paginatedList.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Takliflar topilmadi.
                    </div>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Foydalanuvchi</th>
                          <th>Telefon raqami</th>
                          <th style={{ width: '45%' }}>Taklif matni</th>
                          <th>Sana</th>
                          <th>Holati</th>
                          <th>Amallar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedList.map(item => (
                          <tr key={item.id}>
                            <td style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                              #{item.id}
                            </td>
                            <td style={{ fontSize: '14px', fontWeight: '600' }}>
                              {item.userName}
                            </td>
                            <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                              {item.userPhone}
                            </td>
                            <td style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.4' }}>
                              {item.text}
                            </td>
                            <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                              {item.date}
                            </td>
                            <td>
                              <span className={`status-badge ${item.status === 'read' ? 'active' : 'pending'}`}>
                                {item.status === 'read' ? "Ko'rib chiqilgan" : 'Yangi'}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                {item.status === 'new' && (
                                  <button
                                    className="action-btn approve"
                                    title="Ko'rib chiqilgan deb belgilash"
                                    onClick={() => markSuggestionAsRead(item.id)}
                                  >
                                    <Check size={14} />
                                  </button>
                                )}
                                <button
                                  className="action-btn delete"
                                  title="O'chirish"
                                  onClick={() => deleteSuggestion(item.id)}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Pagination Controls */}
                <div className="pagination-wrapper">
                  <div className="pagination-info">
                    Jami {totalItems} ta taklifdan {totalItems > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + itemsPerPage, totalItems)} ko'rsatilmoqda
                  </div>
                  {totalPages > 1 && (
                    <div className="pagination-controls">
                      <button
                        className="pagination-btn"
                        disabled={suggestionsPage === 1}
                        onClick={() => setSuggestionsPage(p => Math.max(p - 1, 1))}
                      >
                        Oldingi
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                        <button
                          key={pageNum}
                          className={`pagination-btn ${suggestionsPage === pageNum ? 'active' : ''}`}
                          onClick={() => setSuggestionsPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      ))}
                      <button
                        className="pagination-btn"
                        disabled={suggestionsPage === totalPages}
                        onClick={() => setSuggestionsPage(p => Math.min(p + 1, totalPages))}
                      >
                        Keyingi
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="content-card" style={{ maxWidth: '700px' }}>
              <div className="content-card-header">
                <h3 className="content-card-title">Tizim va Platforma Sozlamalari</h3>
              </div>
              
              <div style={{ padding: '24px' }}>
                {settingsSuccess && (
                  <div style={{
                    backgroundColor: '#E6F4EA',
                    border: '1px solid #C2E7CE',
                    color: 'var(--primary)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: '700',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <CheckCircle2 size={18} />
                    <span>Tizim sozlamalari muvaffaqiyatli saqlandi!</span>
                  </div>
                )}

                <form onSubmit={handleSaveSettings}>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--primary-dark)' }}>
                      Tizim Nomi
                    </label>
                    <input
                      type="text"
                      style={{
                        width: '100%',
                        height: '44px',
                        padding: '0 14px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'var(--bg-main)'
                      }}
                      value={settings.panelName}
                      onChange={(e) => setSettings({ ...settings, panelName: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--primary-dark)' }}>
                      Admin Elektron Pochtasi (Email)
                    </label>
                    <input
                      type="email"
                      style={{
                        width: '100%',
                        height: '44px',
                        padding: '0 14px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'var(--bg-main)'
                      }}
                      value={settings.adminEmail}
                      onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--primary-dark)' }}>
                      Platforma Holati
                    </label>
                    <select
                      style={{
                        width: '100%',
                        height: '44px',
                        padding: '0 14px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'var(--bg-main)',
                        cursor: 'pointer'
                      }}
                      value={settings.siteMode}
                      onChange={(e) => setSettings({ ...settings, siteMode: e.target.value })}
                    >
                      <option value="production">Faol (Production)</option>
                      <option value="maintenance">Texnik xizmat ko'rsatish (Maintenance)</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--primary-dark)' }}>
                      Tizimli E'lon / Xabar
                    </label>
                    <textarea
                      style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: '12px 14px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'var(--bg-main)',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                      value={settings.systemAlert}
                      onChange={(e) => setSettings({ ...settings, systemAlert: e.target.value })}
                    />
                  </div>

                  <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      id="regToggle"
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                      checked={settings.registrationsOpen}
                      onChange={(e) => setSettings({ ...settings, registrationsOpen: e.target.checked })}
                    />
                    <label htmlFor="regToggle" style={{ fontSize: '14px', fontWeight: '600', color: 'var(--primary-dark)', cursor: 'pointer' }}>
                      Yangi foydalanuvchilar ro'yxatdan o'tishi ochiq
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="login-btn"
                    style={{ height: '44px', width: 'auto', padding: '0 24px' }}
                  >
                    Saqlash
                  </button>

                </form>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Foydalanuvchini tahrirlash</h3>
              <button className="modal-close-btn" onClick={() => setEditingUser(null)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const token = localStorage.getItem('adminToken');
                const res = await fetch(`https://api.zoovita.uz/api/v1/admin/users/${editingUser.id}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    name: editingUser.name,
                    phone: editingUser.phone,
                    email: editingUser.email,
                    status: editingUser.status
                  })
                });
                if (res.ok) {
                  fetchUsers();
                  setEditingUser(null);
                } else {
                  alert('Yangilashda xatolik yuz berdi');
                }
              } catch (err) {
                alert('Server xatosi');
              }
            }}>
              <div className="modal-body">
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--primary-dark)' }}>
                    Foydalanuvchi ID
                  </label>
                  <input
                    type="text"
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#F2F2F2',
                      color: 'var(--text-muted)'
                    }}
                    value={editingUser.id}
                    disabled
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--primary-dark)' }}>
                    Foydalanuvchi ismi
                  </label>
                  <input
                    type="text"
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'var(--bg-main)'
                    }}
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--primary-dark)' }}>
                    Elektron pochta (Email)
                  </label>
                  <input
                    type="email"
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'var(--bg-main)'
                    }}
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    required
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--primary-dark)' }}>
                    Telefon raqami
                  </label>
                  <input
                    type="text"
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'var(--bg-main)'
                    }}
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    required
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--primary-dark)' }}>
                    Holati
                  </label>
                  <select
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'var(--bg-main)',
                      cursor: 'pointer'
                    }}
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                  >
                    <option value="Faol">Faol</option>
                    <option value="Faol emas">Faol emas</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="modal-btn-cancel" onClick={() => setEditingUser(null)}>
                  Bekor qilish
                </button>
                <button type="submit" className="login-btn" style={{ height: '44px', width: 'auto', padding: '0 24px' }}>
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddingUser && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: showOtpScreen ? '420px' : '500px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                {showOtpScreen ? "Elektron pochtani tasdiqlash" : "Yangi foydalanuvchi qo'shish"}
              </h3>
              <button
                className="modal-close-btn"
                onClick={() => {
                  setIsAddingUser(false);
                  setShowOtpScreen(false);
                }}
              >
                <X size={20} />
              </button>
            </div>

            {!showOtpScreen ? (
              <form onSubmit={handleAddUserSubmit}>
                <div className="modal-body">
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--primary-dark)' }}>
                      Foydalanuvchi ismi
                    </label>
                    <input
                      type="text"
                      style={{
                        width: '100%',
                        height: '40px',
                        padding: '0 12px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'var(--bg-main)'
                      }}
                      placeholder="Masalan: Sardor Olimov"
                      value={newUserData.name}
                      onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--primary-dark)' }}>
                      Elektron pochta (Email)
                    </label>
                    <input
                      type="email"
                      style={{
                        width: '100%',
                        height: '40px',
                        padding: '0 12px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'var(--bg-main)'
                      }}
                      placeholder="Masalan: sardor@mail.ru"
                      value={newUserData.email}
                      onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--primary-dark)' }}>
                      Telefon raqami
                    </label>
                    <input
                      type="text"
                      style={{
                        width: '100%',
                        height: '40px',
                        padding: '0 12px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'var(--bg-main)'
                      }}
                      placeholder="Masalan: +998 90 123 45 67"
                      value={newUserData.phone}
                      onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--primary-dark)' }}>
                      Parol
                    </label>
                    <input
                      type="password"
                      style={{
                        width: '100%',
                        height: '40px',
                        padding: '0 12px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'var(--bg-main)'
                      }}
                      placeholder="Parol kiriting"
                      value={newUserData.password}
                      onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--primary-dark)' }}>
                      Holati
                    </label>
                    <select
                      style={{
                        width: '100%',
                        height: '40px',
                        padding: '0 12px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'var(--bg-main)',
                        cursor: 'pointer'
                      }}
                      value={newUserData.status}
                      onChange={(e) => setNewUserData({ ...newUserData, status: e.target.value })}
                    >
                      <option value="Faol">Faol</option>
                      <option value="Faol emas">Faol emas</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="modal-btn-cancel" onClick={() => setIsAddingUser(false)}>
                    Bekor qilish
                  </button>
                  <button type="submit" className="login-btn" style={{ height: '44px', width: 'auto', padding: '0 24px' }}>
                    Qo'shish
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtpSubmit}>
                <div className="modal-body" style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
                    Tasdiqlash kodi <strong>{newUserData.email}</strong> elektron pochtasiga yuborildi. Foydalanuvchini qo'shish uchun kodni kiriting.
                  </p>


                  {otpError && (
                    <div className="login-error" style={{ justifyContent: 'center', textAlign: 'center' }}>
                      <AlertCircle size={16} />
                      <span>{otpError}</span>
                    </div>
                  )}

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--primary-dark)', marginBottom: '8px', textAlign: 'left' }}>
                      6 xonali tasdiqlash kodi
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      style={{
                        width: '100%',
                        padding: '0 16px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        outline: 'none',
                        backgroundColor: 'var(--bg-main)',
                        textAlign: 'center',
                        fontSize: '22px',
                        fontWeight: '800',
                        letterSpacing: '12px',
                        height: '52px'
                      }}
                      placeholder="••••••"
                      value={otpInput}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setOtpInput(val);
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="modal-btn-cancel"
                    onClick={() => {
                      setShowOtpScreen(false);
                      setOtpInput('');
                      setOtpError('');
                    }}
                  >
                    Orqaga
                  </button>
                  <button type="submit" className="login-btn" style={{ height: '44px', width: 'auto', padding: '0 24px' }}>
                    Tasdiqlash
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmUser && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '28px',
                backgroundColor: '#FFEBEB',
                color: 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertCircle size={32} />
              </div>
            </div>
            <h3 className="modal-title" style={{ marginBottom: '12px' }}>Foydalanuvchini o'chirish</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.5' }}>
              Haqiqatan ham <strong>{deleteConfirmUser.name}</strong> foydalanuvchisini tizimdan o'chirib tashlamoqchisiz? Bu amalni ortga qaytarib bo'lmaydi!
            </p>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'var(--bg-main)',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '24px',
              textAlign: 'left'
            }}>
              {deleteConfirmUser.avatar ? (
                <img src={deleteConfirmUser.avatar} style={{ width: '40px', height: '40px', borderRadius: '20px', objectFit: 'cover' }} alt="Avatar" />
              ) : (
                <div style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 18 }}>
                  {deleteConfirmUser.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--primary-dark)' }}>{deleteConfirmUser.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{deleteConfirmUser.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="modal-btn-cancel" style={{ flex: 1 }} onClick={() => setDeleteConfirmUser(null)}>
                Bekor qilish
              </button>
              <button
                className="login-btn"
                style={{ flex: 1, backgroundColor: 'var(--danger)', boxShadow: '0 4px 12px rgba(255, 90, 95, 0.2)' }}
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('adminToken');
                    const res = await fetch(`https://api.zoovita.uz/api/v1/admin/users/${deleteConfirmUser.id}`, {
                      method: 'DELETE',
                      headers: {
                        'Authorization': `Bearer ${token}`
                      }
                    });
                    if (res.ok) {
                      setUsers(prev => prev.filter(user => user.id !== deleteConfirmUser.id));
                      setDeleteConfirmUser(null);
                    } else {
                      alert('Foydalanuvchini o\'chirishda xatolik yuz berdi');
                    }
                  } catch (err) {
                    alert('Server bilan bog\'lanishda xatolik');
                  }
                }}
              >
                Ha, o'chirilsin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Banner Modal */}
      {isAddingBanner && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Yangi banner yuklash</h3>
              <button className="modal-close-btn" onClick={() => {
                setIsAddingBanner(false);
                setSelectedBannerImage(null);
              }}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Mobil ilova bosh sahifasida ko'rsatiladigan reklama bannerini (rasmini) tanlang.
              </p>
              
              {!selectedBannerImage ? (
                <div
                  onClick={() => document.getElementById('banner-file-input').click()}
                  style={{
                    border: '2px dashed #C3D0C0',
                    borderRadius: '12px',
                    padding: '40px 20px',
                    backgroundColor: 'var(--bg-main)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.backgroundColor = '#E6F4EA';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#C3D0C0';
                    e.currentTarget.style.backgroundColor = 'var(--bg-main)';
                  }}
                >
                  <Upload size={36} color="var(--primary)" />
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary-dark)' }}>
                    Rasm yuklash uchun bosing
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    PNG, JPG yoki JPEG formatda
                  </span>
                  <input
                    type="file"
                    id="banner-file-input"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                       const file = e.target.files[0];
                       if (file) {
                         setSelectedBannerImage(file);
                       }
                    }}
                  />
                </div>
              ) : (
                <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                  <img src={URL.createObjectURL(selectedBannerImage)} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} alt="Preview" />
                  <button
                    onClick={() => setSelectedBannerImage(null)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '28px',
                      height: '28px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      color: '#ffffff',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="modal-footer" style={{ marginTop: '16px' }}>
              <button
                type="button"
                className="modal-btn-cancel"
                onClick={() => {
                  setIsAddingBanner(false);
                  setSelectedBannerImage(null);
                }}
              >
                Bekor qilish
              </button>
              <button
                type="button"
                className="login-btn"
                style={{ height: '44px', width: 'auto', padding: '0 24px' }}
                disabled={!selectedBannerImage}
                onClick={handleBannerUpload}
              >
                Yuklash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddingCategory && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '460px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Yangi toifa qo'shish</h3>
              <button className="modal-close-btn" onClick={() => setIsAddingCategory(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCategorySubmit}>
              <div className="modal-body">
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--primary-dark)' }}>
                    Bo'lim
                  </label>
                  <select
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'var(--bg-main)',
                      cursor: 'pointer'
                    }}
                    value={newCategoryData.section}
                    onChange={(e) => setNewCategoryData({ ...newCategoryData, section: e.target.value })}
                  >
                    <option value="animals">Hayvonlar bo'limi</option>
                    <option value="products">Mahsulotlar bo'limi</option>
                    <option value="services">Xizmatlar bo'limi</option>
                  </select>
                </div>

                {/* Category Image upload field */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--primary-dark)' }}>
                    Rasm yuklash
                  </label>
                  {!newCategoryData.imagePreview ? (
                    <div
                      onClick={() => document.getElementById('category-add-file-input').click()}
                      style={{
                        border: '2px dashed #C3D0C0',
                        borderRadius: '12px',
                        padding: '24px 16px',
                        backgroundColor: 'var(--bg-main)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <Upload size={24} color="var(--primary)" />
                      <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary-dark)' }}>
                        Rasm yuklash
                      </span>
                      <input
                        type="file"
                        id="category-add-file-input"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewCategoryData({ ...newCategoryData, imageFile: file, imagePreview: reader.result });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', height: '120px' }}>
                      <img src={newCategoryData.imagePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                      <button
                        type="button"
                        onClick={() => setNewCategoryData({ ...newCategoryData, imageFile: null, imagePreview: null })}
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          width: '24px',
                          height: '24px',
                          borderRadius: '12px',
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          color: '#ffffff',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--primary-dark)' }}>
                    Toifa nomi
                  </label>
                  <input
                    type="text"
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'var(--bg-main)'
                    }}
                    placeholder="Masalan: Mushuklar, Baliqlar..."
                    value={newCategoryData.name}
                    onChange={(e) => setNewCategoryData({ ...newCategoryData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="modal-btn-cancel" onClick={() => setIsAddingCategory(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="login-btn" style={{ height: '44px', width: 'auto', padding: '0 24px' }}>
                  Qo'shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '460px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Toifani tahrirlash</h3>
              <button className="modal-close-btn" onClick={() => setEditingCategory(null)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!editingCategory.name.trim()) return;

              // Check if section changed
              if (editingCategory.section !== activeCategorySubTab) {
                // Remove from old list
                let oldSetter;
                let oldPageSetter;
                let oldList;
                if (activeCategorySubTab === 'products') {
                  oldList = productCategories;
                  oldSetter = setProductCategories;
                  oldPageSetter = setProductPage;
                } else if (activeCategorySubTab === 'services') {
                  oldList = serviceCategories;
                  oldSetter = setServiceCategories;
                  oldPageSetter = setServicePage;
                } else {
                  oldList = animalCategories;
                  oldSetter = setAnimalCategories;
                  oldPageSetter = setAnimalPage;
                }
                
                oldSetter(prev => prev.filter(c => c.id !== editingCategory.id));
                const oldLengthAfter = oldList.length - 1;
                const maxOldPage = Math.ceil(oldLengthAfter / 4) || 1;
                oldPageSetter(p => Math.min(p, maxOldPage));

                // Add to new list
                let targetList;
                let targetSetter;
                let targetPageSetter;
                if (editingCategory.section === 'products') {
                  targetList = productCategories;
                  targetSetter = setProductCategories;
                  targetPageSetter = setProductPage;
                } else if (editingCategory.section === 'services') {
                  targetList = serviceCategories;
                  targetSetter = setServiceCategories;
                  targetPageSetter = setServicePage;
                } else {
                  targetList = animalCategories;
                  targetSetter = setAnimalCategories;
                  targetPageSetter = setAnimalPage;
                }

                const nextId = targetList.length > 0 ? Math.max(...targetList.map(c => c.id)) + 1 : 1;
                const updatedCategory = {
                  id: nextId,
                  name: editingCategory.name.trim(),
                  image: editingCategory.image || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=200',
                  createdAt: editingCategory.createdAt || getCurrentDateTimeString()
                };
                targetSetter(prev => [...prev, updatedCategory]);
                setActiveCategorySubTab(editingCategory.section);
                targetPageSetter(1);
              } else {
                let targetSetter;
                if (activeCategorySubTab === 'products') {
                  targetSetter = setProductCategories;
                } else if (activeCategorySubTab === 'services') {
                  targetSetter = setServiceCategories;
                } else {
                  targetSetter = setAnimalCategories;
                }
                targetSetter(prev => prev.map(c => c.id === editingCategory.id ? {
                  ...c,
                  name: editingCategory.name.trim(),
                  image: editingCategory.image
                } : c));
              }

              setEditingCategory(null);
            }}>
              <div className="modal-body">
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--primary-dark)' }}>
                    Toifa ID
                  </label>
                  <input
                    type="text"
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#F2F2F2',
                      color: 'var(--text-muted)'
                    }}
                    value={editingCategory.id}
                    disabled
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--primary-dark)' }}>
                    Bo'lim
                  </label>
                  <select
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'var(--bg-main)',
                      cursor: 'pointer'
                    }}
                    value={editingCategory.section}
                    onChange={(e) => setEditingCategory({ ...editingCategory, section: e.target.value })}
                  >
                    <option value="animals">Hayvonlar bo'limi</option>
                    <option value="products">Mahsulotlar bo'limi</option>
                    <option value="services">Xizmatlar bo'limi</option>
                  </select>
                </div>

                {/* Edit Category Image upload field */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--primary-dark)' }}>
                    Rasm yuklash
                  </label>
                  {!editingCategory.image ? (
                    <div
                      onClick={() => document.getElementById('category-edit-file-input').click()}
                      style={{
                        border: '2px dashed #C3D0C0',
                        borderRadius: '12px',
                        padding: '24px 16px',
                        backgroundColor: 'var(--bg-main)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <Upload size={24} color="var(--primary)" />
                      <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary-dark)' }}>
                        Rasm yuklash
                      </span>
                      <input
                        type="file"
                        id="category-edit-file-input"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setEditingCategory({ ...editingCategory, image: reader.result });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', height: '120px' }}>
                      <img src={editingCategory.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                      <button
                        type="button"
                        onClick={() => setEditingCategory({ ...editingCategory, image: null })}
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          width: '24px',
                          height: '24px',
                          borderRadius: '12px',
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          color: '#ffffff',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--primary-dark)' }}>
                    Toifa nomi
                  </label>
                  <input
                    type="text"
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'var(--bg-main)'
                    }}
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="modal-btn-cancel" onClick={() => setEditingCategory(null)}>
                  Bekor qilish
                </button>
                <button type="submit" className="login-btn" style={{ height: '44px', width: 'auto', padding: '0 24px' }}>
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
