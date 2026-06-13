import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  Dimensions,
  Alert,
  Modal,
  ActivityIndicator,
  Linking,
  RefreshControl,
  AppState,
  Share,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, Ionicons, FontAwesome5, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ExpoLinking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPER_HEIGHT = Math.round((SCREEN_WIDTH - 32) * 0.48);
const CAT_CARD_WIDTH = Math.floor((SCREEN_WIDTH - 32 - 30) / 5);

const renderServiceIcon = (iconName, iconColor) => {
  if (iconName === 'paw') {
    return <FontAwesome5 name="paw" size={16} color={iconColor} />;
  }
  return <Feather name={iconName} size={18} color={iconColor} />;
};

// SWIPER_DATA removed in favor of dynamic banners

// Data for Categories
const CATEGORIES = [
  {
    id: 1,
    name: 'Hayvonlar sotiladi',
    icon: 'cow',
    iconType: 'material-community',
    bgColor: '#E6F4EA',
    iconColor: '#3C8E2D',
  },
  {
    id: 2,
    name: 'Oziq-ovqat va mahsulotlar',
    icon: 'shopping-bag',
    iconType: 'feather',
    bgColor: '#FEF3D6',
    iconColor: '#F5A623',
  },
  {
    id: 3,
    name: 'Veterinariya xizmatlari',
    icon: 'stethoscope',
    iconType: 'font-awesome',
    bgColor: '#E3F2FD',
    iconColor: '#1E88E5',
  },
  {
    id: 5,
    name: 'Barchasi kategoriyalar',
    icon: 'grid',
    iconType: 'feather',
    bgColor: '#E8F5E9',
    iconColor: '#4CAF50',
  },
];

// CAT_SECTIONS removed in favor of dynamic categories






const GALLERY_STOCK_PHOTOS = [
  { id: 1, name: 'Sigir', uri: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=400' },
  { id: 2, name: 'Qo\'y', uri: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=400' },
  { id: 3, name: 'Ot', uri: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=400' },
  { id: 4, name: 'Echki', uri: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=400' },
  { id: 5, name: 'Tovuq', uri: 'https://images.unsplash.com/photo-1548550022-c1419435e167?auto=format&fit=crop&w=400' },
  { id: 6, name: 'It', uri: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=400' },
  { id: 7, name: 'Ozuqa/Hashak', uri: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=400' },
  { id: 8, name: 'Dori/Vitamin', uri: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&w=400' },
];

const UZBEKISTAN_REGIONS = [
  'Toshkent shahri',
  'Toshkent viloyati',
  'Samarqand viloyati',
  'Buxoro viloyati',
  'Andijon viloyati',
  'Farg\'ona viloyati',
  'Namangan viloyati',
  'Qashqadaryo viloyati',
  'Surxondaryo viloyati',
  'Jizzax viloyati',
  'Sirdaryo viloyati',
  'Xorazm viloyati',
  'Navoiy viloyati',
  'Qoraqalpog\'iston Res.',
];

const UZBEKISTAN_DISTRICTS = {
  'Toshkent shahri': ['Yunusobod tumani', 'Mirzo Ulug‘bek tumani', 'Chilonzor tumani', 'Mirobod tumani', 'Yakkasaroy tumani', 'Uchtepa tumani', 'Olmazor tumani', 'Sergeli tumani', 'Yashnobod tumani', 'Bektemir tumani'],
  'Toshkent viloyati': ['Qibray tumani', 'Zangiota tumani', 'Chinoz tumani', 'Bo‘stonliq tumani', 'Yangiyo‘l tumani', 'Parkent tumani', 'O‘rtachirchiq tumani', 'Yuqorichirchiq tumani', 'Quyi Chirchiq tumani', 'Piskent tumani'],
  'Samarqand viloyati': ['Samarqand tumani', 'Pastdarg‘om tumani', 'Oqdaryo tumani', 'Bulung‘ur tumani', 'Jomboy tumani', 'Ishtixon tumani', 'Payariq tumani', 'Urgut tumani', 'Narpay tumani', 'Kattaqo‘rg‘on tumani'],
  'Buxoro viloyati': ['Buxoro tumani', 'G‘ijduvon tumani', 'Kogon tumani', 'Qorako‘l tumani', 'Olot tumani', 'Peshku tumani', 'Vobkent tumani', 'Shofirkon tumani', 'Romitan tumani', 'Jondor tumani'],
  'Andijon viloyati': ['Andijon tumani', 'Asaka tumani', 'Shahrixon tumani', 'Oltinko‘l tumani', 'Jalaquduq tumani', 'Xodjaobod tumani', 'Paxtaobod tumani', 'Buloqboshi tumani', 'Izboskan tumani', 'Marhamat tumani'],
  'Farg\'ona viloyati': ['Farg‘ona tumani', 'Marg‘ilon tumani', 'Qo‘qon tumani', 'Oltiariq tumani', 'Rishton tumani', 'Quva tumani', 'Toshloq tumani', 'Yozyovon tumani', 'Bog‘dod tumani', 'Beshariq tumani'],
  'Namangan viloyati': ['Namangan tumani', 'Chust tumani', 'Kosonsoy tumani', 'Uychi tumani', 'Uchqo‘rg‘on tumani', 'Yangiqo‘rg‘on tumani', 'Pop tumani', 'Chortoq tumani', 'Norin tumani', 'Mingbuloq tumani'],
  'Qashqadaryo viloyati': ['Qarshi tumani', 'Shahrisabz tumani', 'Kitob tumani', 'Chiroqchi tumani', 'Yakkabog‘ tumani', 'G‘uzor tumani', 'Dehqonobod tumani', 'Qamashi tumani', 'Kasbi tumani', 'Nishon tumani'],
  'Surxondaryo viloyati': ['Termiz tumani', 'Sherobod tumani', 'Denov tumani', 'Jarqo‘rg‘on tumani', 'Boysun tumani', 'Muzrabot tumani', 'Sariosiyo tumani', 'Sho‘rchi tumani', 'Qumqo‘rg‘on tumani', 'Angor tumani'],
  'Jizzax viloyati': ['Jizzax tumani', 'Sharof Rashidov tumani', 'Zomin tumani', 'G‘allaorol tumani', 'Forish tumani', 'Do‘stlik tumani', 'Paxtakor tumani', 'Baxmal tumani', 'Mirzacho‘l tumani', 'Arnasoy tumani'],
  'Sirdaryo viloyati': ['Guliston tumani', 'Sirdaryo tumani', 'Sayxunobod tumani', 'Boyovut tumani', 'Oqoltin tumani', 'Sardoba tumani', 'Mirzaobod tumani', 'Xavas tumani'],
  'Xorazm viloyati': ['Urganch tumani', 'Xiva tumani', 'Gurlan tumani', 'Shovot tumani', 'Qo‘shko‘pir tumani', 'Bog‘ot tumani', 'Xonqa tumani', 'Yangiariq tumani', 'Yangibozor tumani', 'Hazorasp tumani'],
  'Navoiy viloyati': ['Navoiy tumani', 'Karmana tumani', 'Qiziltepa tumani', 'Xatirchi tumani', 'Nurota tumani', 'Uchquduq tumani', 'Konimex tumani', 'Tomdi tumani'],
  'Qoraqalpog\'iston Res.': ['Nukus tumani', 'Qo‘ng‘irot tumani', 'To‘rtko‘l tumani', 'Beruniy tumani', 'Ellikqala tumani', 'Amudaryo tumani', 'Chimboy tumani', 'Xo‘jeyli tumani', 'Kegeyli tumani', 'Taxtako‘pir tumani'],
};

// Popular products data

// Product Details Metadata


// Quick services data
const QUICK_SERVICES = [
  { id: 1, name: 'Veterinarga navbat olish', icon: 'calendar', color: '#3F51B5' },
  { id: 3, name: 'Sertifikat va hujjatlar', icon: 'shield', color: '#4CAF50' },
  { id: 4, name: 'Yetkazib berish', icon: 'truck', color: '#FF9800' },
  { id: 5, name: 'Yordam va ko\'llab-quvvatlash', icon: 'help-circle', color: '#00BCD4' },
];

const DASHBOARD_TABS = [
  { key: 'home', icon: 'home', label: 'Bosh sahifa' },
  { key: 'categories', icon: 'grid', label: 'Kategoriyalar' },
  { key: 'bozor', icon: 'shopping-bag', label: 'Bozor' },
  { key: 'profile', icon: 'user', label: 'Profil' },
];

const PROFILE_STATS = [
  { id: 'orders', label: 'Buyurtmalarim', value: '12' },
  { id: 'favorites', label: 'Sevimlilarim', value: '8' },
];

const PROFILE_SERVICES = [
  { id: 'chats', title: 'Xabarlar', subtitle: 'Xaridor va sotuvchilar bilan suhbat', icon: 'message-square', bgColor: '#FEF3D6', iconColor: '#F5A623' },
  { id: 'pets', title: 'Mening uy hayvonlarim', subtitle: '2 ta uy hayvoni', icon: 'paw', bgColor: '#E6F4EA', iconColor: '#3C8E2D' },
  { id: 'addresses', title: 'Mening manzillarim', subtitle: '3 ta manzil saqlangan', icon: 'home', bgColor: '#E3F2FD', iconColor: '#1E88E5' },
];

const PROFILE_SUPPORT = [
  { id: 'help', title: 'Yordam markazi', subtitle: 'Savollaringiz bormi? Biz yordam beramiz', icon: 'headphones', bgColor: '#E6F4EA', iconColor: '#3C8E2D' },
  { id: 'contact', title: 'Biz bilan bog‘lanish', subtitle: 'Telefon, chat va email orqali', icon: 'message-circle', bgColor: '#E3F2FD', iconColor: '#1E88E5' },
  { id: 'terms', title: 'Foydalanish shartlari', subtitle: 'Qoidalar va shartlar', icon: 'file-text', bgColor: '#FEF3D6', iconColor: '#F5A623' },
  { id: 'privacy', title: 'Maxfiylik siyosati', subtitle: 'Ma’lumotlaringiz xavfsizligi', icon: 'shield', bgColor: '#F5F7F5', iconColor: '#7C8A79' },
];

const DashboardHeader = ({ onNotificationPress, unreadCount = 0 }) => (
  <SafeAreaView style={styles.dashboardHeaderArea}>
    <View style={styles.dashboardHeaderRow}>
      <View style={{ width: 44 }} />

      <View style={styles.headerBrand}>
        <Image source={require('./assets/dashboard_logo.png')} style={styles.dashboardLogo} resizeMode="contain" />
      </View>

      <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.75} onPress={onNotificationPress}>
        <Feather name="bell" size={22} color="#15330F" />
        {unreadCount > 0 && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

const DashboardTabBar = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { key: 'home', icon: 'home', label: 'Bosh sahifa' },
    { key: 'categories', icon: 'grid', label: 'Kategoriya' },
    { key: 'add', icon: 'plus', label: '' },
    { key: 'bozor', icon: 'shopping-bag', label: 'Bozor' },
    { key: 'profile', icon: 'user', label: 'Profil' },
  ];

  return (
    <View style={styles.bottomTabBar}>
      {tabs.map((item) => {
        if (item.key === 'add') {
          return (
            <TouchableOpacity
              key={item.key}
              style={styles.tabAddButton}
              activeOpacity={0.85}
              onPress={() => onSelectTab('add')}
            >
              <Feather name="plus" size={24} color="#ffffff" />
            </TouchableOpacity>
          );
        }

        const isActive = activeTab === item.key;

        return (
          <TouchableOpacity
            key={item.key}
            style={[styles.tabItem, isActive && styles.tabItemActive]}
            activeOpacity={0.75}
            onPress={() => onSelectTab(item.key)}
          >
            <View style={styles.tabIconLabelRow}>
              <View style={[styles.tabIconWrapper, isActive && styles.tabIconWrapperActive]}>
                <Feather name={item.icon} size={20} color={isActive ? '#FFFFFF' : '#7C8A79'} />
              </View>
              {isActive && item.label ? (
                <Text style={[styles.tabLabel, styles.tabLabelActive]}>{item.label}</Text>
              ) : null}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default function App() {
  const [screen, setScreen] = useState('welcome'); // 'welcome', 'login', 'register', 'dashboard'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pendingTelegramSession, setPendingTelegramSession] = useState(null);
  const [selectedPhoneCode, setSelectedPhoneCode] = useState('+998');
  const [showPhoneCodeModal, setShowPhoneCodeModal] = useState(false);
  const phoneCodes = [
    { code: '+998', name: "O'zbekiston", flag: "🇺🇿", maxLen: 9 },
    { code: '+7', name: "Qozog'iston / Rossiya", flag: "🇰🇿", maxLen: 10 },
    { code: '+992', name: "Tojikiston", flag: "🇹🇯", maxLen: 9 },
    { code: '+996', name: "Qirg'iziston", flag: "🇰🇬", maxLen: 9 },
    { code: '+993', name: "Turkmaniston", flag: "🇹🇲", maxLen: 8 },
    { code: '+93', name: "Afg'oniston", flag: "🇦🇫", maxLen: 9 },
  ];
  const currentPhoneConfig = phoneCodes.find(p => p.code === selectedPhoneCode) || phoneCodes[0];
  
  // Login States
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);

  // Register States
  const [regPhone, setRegPhone] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regSecureText, setRegSecureText] = useState(true);
  const [regConfirmSecureText, setRegConfirmSecureText] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isRegPhoneFocused, setIsRegPhoneFocused] = useState(false);

  // Swiper state
  const [activeSlide, setActiveSlide] = useState(0);
  const swiperRef = useRef(null);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ads, setAds] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  // Chat states
  const [showChatModal, setShowChatModal] = useState(false);
  const chatScrollRef = useRef(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatsList, setChatsList] = useState([]);
  const [chatInputText, setChatInputText] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [chatOtherUserName, setChatOtherUserName] = useState("");

  const openChat = async (ad) => {
    if (!isLoggedIn) {
      Alert.alert("Diqqat", "Xabar yozish uchun avval tizimga kiring.");
      setScreen('login');
      return;
    }
    if (userProfileId && ad.user_id === userProfileId) {
      Alert.alert("Xatolik", "O'zingizning e'loningizga xabar yoza olmaysiz");
      return;
    }
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await fetch('https://api.zoovita.uz/api/v1/chats', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `ad_id=${ad.id}`
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentChatId(data.chat_id);
        setChatOtherUserName(ad.seller ? ad.seller.name : ad.contact_name);
        setChatMessages([]);
        setShowChatModal(true);
        fetchChatMessages(data.chat_id);
        return true;
      } else {
        const errData = await res.json();
        const errStr = Array.isArray(errData.detail) ? errData.detail[0].msg : (errData.detail || "Chat yaratib bo'lmadi");
        Alert.alert("Xatolik", errStr);
        return false;
      }
    } catch(err) {
      Alert.alert("Xatolik", "Tarmoq xatosi");
      return false;
    }
  };

  const fetchChatMessages = async (chatId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await fetch(`https://api.zoovita.uz/api/v1/chats/${chatId}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setChatMessages(await res.json());
      }
    } catch(err) {}
  };

  const fetchChatsList = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await fetch(`https://api.zoovita.uz/api/v1/chats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setChatsList(await res.json());
      }
    } catch(err) {}
  };

  const fetchNotifications = async () => {
    if(!isLoggedIn) return;
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await fetch('https://api.zoovita.uz/api/v1/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotificationsList(data);
        setUnreadNotificationsCount(data.filter(n => !n.is_read).length);
      }
    } catch(err) {}
  };

  const sendChatMessage = async () => {
    if(!chatInputText.trim() || !currentChatId) return;
    setIsSendingMessage(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await fetch(`https://api.zoovita.uz/api/v1/chats/${currentChatId}/messages`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `text=${encodeURIComponent(chatInputText)}`
      });
      if (res.ok) {
        const newMsg = await res.json();
        setChatMessages(prev => [...prev, newMsg]);
        setChatInputText('');
      }
    } catch(err) {}
    setIsSendingMessage(false);
  };

  const fetchDashboardData = async () => {
    try {
      const apiUrl = 'https://api.zoovita.uz';
      const [bannersRes, categoriesRes, adsRes] = await Promise.all([
        fetch(`${apiUrl}/api/v1/auth/banners`),
        fetch(`${apiUrl}/api/v1/auth/categories`),
        fetch(`${apiUrl}/api/v1/ads`)
      ]);
      if (bannersRes.ok) setBanners(await bannersRes.json());
      if (categoriesRes.ok) setCategories(await categoriesRes.json());
      if (adsRes.ok) setAds(await adsRes.json());
    } catch (err) {
      console.log("Ma'lumotlarni yuklashda xatolik:", err);
    }
  };

  const fetchUserProfile = async (token) => {
    try {
      const apiUrl = 'https://api.zoovita.uz';
      const res = await fetch(`${apiUrl}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserProfileName(data.name || 'Mehmon foydalanuvchi');
        setUserProfilePhone(data.phone || 'Kiritilmagan');
        setUserProfileEmail(data.email || 'Kiritilmagan');
        setUserProfileId(data.id || null);
        if (data.avatar) setUserProfileAvatar(data.avatar);
      } else {
        await AsyncStorage.removeItem('userToken');
        setIsLoggedIn(false);
        setScreen('welcome');
        setDashboardTab('home');
      }
    } catch (e) {
      console.log('Error fetching profile', e);
    }
  };

  // Check initial token on mount
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setIsLoggedIn(true);
        fetchUserProfile(token);
      }
    };
    checkToken();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
    }
  }, [isLoggedIn]);

  // Handle deep links
  useEffect(() => {
    const handleDeepLink = async (event) => {
      if (event.url) {
        const parsed = ExpoLinking.parse(event.url);
        const { path, queryParams } = parsed;
        
        if (path && path.includes('reset-password') && queryParams && queryParams.token) {
          setNewPasswordToken(queryParams.token);
          setShowNewPasswordModal(true);
        } else if (queryParams && queryParams.token) {
          const token = queryParams.token;
          await AsyncStorage.setItem('userToken', token);
          setIsLoggedIn(true);
          fetchUserProfile(token);
          setScreen('dashboard');
        }
      }
    };
    
    const subscription = ExpoLinking.addEventListener('url', handleDeepLink);
    ExpoLinking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });
    return () => subscription.remove();
  }, []);

  // Poll Telegram Session when app returns to foreground
  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === 'active' && pendingTelegramSession) {
        try {
          const apiUrl = 'https://api.zoovita.uz';
          const res = await fetch(`${apiUrl}/api/v1/auth/check-telegram-auth/${pendingTelegramSession}`);
          if (res.ok) {
            const data = await res.json();
            if (data.access_token) {
              await AsyncStorage.setItem('userToken', data.access_token);
              setIsLoggedIn(true);
              setScreen('dashboard');
              setDashboardTab('profile'); // Switch to profile tab
              fetchUserProfile(data.access_token);
              setPendingTelegramSession(null);
            }
          } else if (res.status === 404) {
            setPendingTelegramSession(null);
          }
        } catch (e) {
          console.log('Error polling telegram auth:', e);
        }
      }
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [pendingTelegramSession]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchDashboardData().finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(async () => {
      fetchDashboardData();
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        fetchUserProfile(token);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Favorites state
  const [favorites, setFavorites] = useState({});

  // Dashboard active tab and filter state
  const [dashboardTab, setDashboardTab] = useState('home'); // 'home', 'categories', 'favorites', 'profile', 'add'
  const [catFilter, setCatFilter] = useState('all'); // 'all', 'animals', 'products', 'services'
  const [showListings, setShowListings] = useState(false);
  const [selectedListingsCategory, setSelectedListingsCategory] = useState('all');
  const [listingsSearchQuery, setListingsSearchQuery] = useState('');
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [subcatSearchQuery, setSubcatSearchQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // E'lon berish States
  const [addStep, setAddStep] = useState(1);
  const [addPhotos, setAddPhotos] = useState([]);
  const [addCategory, setAddCategory] = useState('qoramol');
  const [addTitle, setAddTitle] = useState('');
  const [addDesc, setAddDesc] = useState('');
  const [addPrice, setAddPrice] = useState('');
  const [addLocation, setAddLocation] = useState('Toshkent shahri, Yunusobod tumani');
  const [addContactName, setAddContactName] = useState('');
  const [addContactPhone, setAddContactPhone] = useState('');
  const [addContactEmail, setAddContactEmail] = useState('');
  const [addContactTelegram, setAddContactTelegram] = useState('');
  const [addDelivery, setAddDelivery] = useState(true); // true = 'Bormi', false = 'Yo'qmi'
  const [addCoordinates, setAddCoordinates] = useState({ latitude: 41.311081, longitude: 69.240562 }); // Default Tashkent coordinates
  const [isLocating, setIsLocating] = useState(false);
  const [selectedViloyat, setSelectedViloyat] = useState('');
  const [showTumanModal, setShowTumanModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Listing Detail Screen
  const [selectedListing, setSelectedListing] = useState(null);
  const [detailActiveImageIndex, setDetailActiveImageIndex] = useState(0);

  // Product Detail Screen
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Seller Profile Screen
  const [selectedSeller, setSelectedSeller] = useState(null);

  // AI Chat Screen
  const [showAiChat, setShowAiChat] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([
    { id: 1, from: 'ai', text: "Salom! Men Zoovita AI assistantiman.\nHayvonlaringiz haqida savol bering, men yordam beraman." },
  ]);

  // Notifications and Filter States
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(3);
  const [notificationsList, setNotificationsList] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDelivery, setFilterDelivery] = useState(null); // null = barchasi, true = yetkazib berish bor, false = yo'q
  const [filterVerified, setFilterVerified] = useState(false); // true = faqat tasdiqlangan sotuvchilar
  const [filterGender, setFilterGender] = useState('all'); // 'all', 'male', 'female'
  
  // Sorting and dropdown states
  const [bozorSortOption, setBozorSortOption] = useState('newest'); // 'newest', 'price_asc', 'price_desc'
  const [bozorRegionFilter, setBozorRegionFilter] = useState('all'); // 'all' or region name
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);

  // Profile editing and detail screen states
  const [userProfileName, setUserProfileName] = useState('Mehmon foydalanuvchi');
  const [userProfileAvatar, setUserProfileAvatar] = useState('https://cdn-icons-png.flaticon.com/512/847/847969.png');
  const [userProfileEmail, setUserProfileEmail] = useState('Kiritilmagan');
  const [userProfilePhone, setUserProfilePhone] = useState('Kiritilmagan');
  const [userProfileId, setUserProfileId] = useState(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editNameInput, setEditNameInput] = useState('');

  // Password reset states
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [newPasswordToken, setNewPasswordToken] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleForgotPasswordSubmit = async () => {
    if (!resetPasswordEmail || !resetPasswordEmail.includes('@')) {
      Alert.alert("Xatolik", "To'g'ri email manzilini kiriting!");
      return;
    }
    
    if (!phoneNumber) {
      Alert.alert("Eslatma", "Iltimos, avval login oynasida telefon raqamingizni kiriting!");
      setShowForgotPasswordModal(false);
      return;
    }
    
    const fullPhoneNumber = `${selectedPhoneCode}${phoneNumber}`;

    try {
      const apiUrl = 'https://api.zoovita.uz';
      const response = await fetch(`${apiUrl}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetPasswordEmail, phone: fullPhoneNumber })
      });
      if (response.ok) {
        Alert.alert("Muvaffaqiyatli", "Emailingizga parolni tiklash havolasi yuborildi. Iltimos, xatingizni tekshiring.");
        setShowForgotPasswordModal(false);
      } else {
        const err = await response.json();
        Alert.alert("Xatolik", err.detail || "Xatolik yuz berdi");
      }
    } catch (e) {
      Alert.alert("Xatolik", "Tarmoq xatosi");
    }
  };

  const handleNewPasswordSubmit = async () => {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert("Xatolik", "Parol kamida 6 ta belgidan iborat bo'lishi kerak!");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert("Xatolik", "Parollar mos kelmadi!");
      return;
    }
    try {
      const apiUrl = 'https://api.zoovita.uz';
      const response = await fetch(`${apiUrl}/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: newPasswordToken, new_password: newPassword })
      });
      if (response.ok) {
        Alert.alert("Muvaffaqiyatli", "Parolingiz muvaffaqiyatli o'zgartirildi!");
        setShowNewPasswordModal(false);
        setNewPassword('');
        setConfirmNewPassword('');
        setNewPasswordToken(null);
      } else {
        const err = await response.json();
        Alert.alert("Xatolik", err.detail || "Xatolik yuz berdi yoki token eskirgan.");
      }
    } catch (e) {
      Alert.alert("Xatolik", "Tarmoq xatosi");
    }
  };

  // Google Sign-In States
  const [googleUserInfo, setGoogleUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '655058612465-t2ehh11g3jeb45m4ljj9qtmio2bfefl8.apps.googleusercontent.com',
    iosClientId: '655058612465-r0u5aqdtl7u19ck4t78dp4v9bch3dfk5.apps.googleusercontent.com',
    webClientId: '655058612465-a3h07gj4e628bc22ho4gmqdnndrnveag.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        getUserInfo(authentication.accessToken);
      }
    }
  }, [response]);

  const getUserInfo = async (token) => {
    try {
      const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();
      setGoogleUserInfo(user);
      
      if (user) {
        setUserProfileName(user.name);
        setUserProfileEmail(user.email);
        setUserProfileAvatar(user.picture);
      }
      
      navigateTo('dashboard');
    } catch (error) {
      console.log('Google login error:', error);
      Alert.alert('Xatolik', 'Google orqali kirishda xatolik yuz berdi');
    }
  };
  const [editAvatarInput, setEditAvatarInput] = useState('');
  const [profileSubScreen, setProfileSubScreen] = useState(null); // null, 'my_pets', 'my_addresses', 'my_payments', 'my_premium', 'help_center', 'contact_us', 'terms', 'privacy', 'my_orders', 'my_favorites'

  // Additional states for Profile Sub-screens
  const [petsList, setPetsList] = useState([
    { id: 'pet1', name: 'Bella', type: 'It', breed: 'Labrador', age: '2 yosh', vaccinated: true, image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=200&q=80' },
    { id: 'pet2', name: 'Momiq', type: 'Mushuk', breed: 'Siyom', age: '1 yosh', vaccinated: true, image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=200&q=80' }
  ]);
  const [addressesList, setAddressesList] = useState([
    { id: 'addr1', name: 'Uy', region: 'Toshkent sh.', district: 'Chilonzor tumani', details: '9-kvartal, 12-uy, 45-xonadon' },
    { id: 'addr2', name: 'Ish joyi', region: 'Toshkent sh.', district: 'Yunusobod tumani', details: 'Amir Temur ko\'chasi, 107B-uy' }
  ]);
  const [cardsList, setCardsList] = useState([
    { id: 'card1', type: 'Uzcard', number: '8600 12** **** 4567', expiry: '12/28', holder: 'MADINA ABDURAHMONOVA', gradient: ['#155D11', '#3C8E2D'] },
    { id: 'card2', type: 'Humo', number: '9860 35** **** 8899', expiry: '09/27', holder: 'MADINA ABDURAHMONOVA', gradient: ['#1E88E5', '#1565C0'] }
  ]);
  const [ordersList, setOrdersList] = useState([
    {
      id: 'ZV-84920',
      date: '28-May, 2026',
      status: 'Yetkazib berildi',
      statusColor: '#3C8E2D',
      items: [
        { name: 'Premium Beda ozuqa (25 kg)', qty: 2, price: '120 000' },
        { name: 'Sigirlar uchun vaksina komplekti', qty: 1, price: '350 000' }
      ],
      deliveryCost: '0',
      totalPrice: '590 000',
      paymentMethod: 'Uzcard (**** 4567)'
    },
    {
      id: 'ZV-81203',
      date: '29-May, 2026',
      status: 'Yetkazib berilmoqda',
      statusColor: '#F5A623',
      items: [
        { name: 'Avtomatlashgan suv idishi (ko\'k)', qty: 1, price: '180 000' }
      ],
      deliveryCost: '0',
      totalPrice: '180 000',
      paymentMethod: 'Humo (**** 8899)'
    },
    {
      id: 'ZV-79112',
      date: '15-May, 2026',
      status: 'Bekor qilingan',
      statusColor: '#FF5A5F',
      items: [
        { name: 'Veterinar ko\'rigi (Uydagi xizmat)', qty: 1, price: '250 000' }
      ],
      deliveryCost: '0',
      totalPrice: '250 000',
      paymentMethod: 'Click'
    }
  ]);
  
  // Toggles and inputs for Sub-screen Add Forms
  const [faqExpandedIndex, setFaqExpandedIndex] = useState(null);
  const [contactSubject, setContactSubject] = useState('Texnik muammo');
  const [contactMessage, setContactMessage] = useState('');
  const [showContactSuccess, setShowContactSuccess] = useState(false);

  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [newPetType, setNewPetType] = useState('It');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetAge, setNewPetAge] = useState('');
  const [newPetVaccinated, setNewPetVaccinated] = useState(true);
  const [newPetImage, setNewPetImage] = useState('https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=200&q=80');

  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrRegion, setNewAddrRegion] = useState('Toshkent sh.');
  const [newAddrDistrict, setNewAddrDistrict] = useState('');
  const [newAddrDetails, setNewAddrDetails] = useState('');

  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [newCardType, setNewCardType] = useState('Uzcard');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardHolder, setNewCardHolder] = useState('MADINA ABDURAHMONOVA');
  const [ordersTab, setOrdersTab] = useState('active'); // 'active', 'history'

  // Category-specific extra spec fields for Step 2
  const [addSpecGender, setAddSpecGender] = useState('');        // Jinsi
  const [addSpecAge, setAddSpecAge] = useState('');              // Yoshi
  const [addSpecBreed, setAddSpecBreed] = useState('');          // Zoti / Navi / Turi
  const [addSpecHealth, setAddSpecHealth] = useState('');        // Holati
  const [addSpecMilk, setAddSpecMilk] = useState('');           // Sutdorligi (qoramol)
  const [addSpecWeight, setAddSpecWeight] = useState('');        // Vazni / Og'irligi
  const [addSpecVaccine, setAddSpecVaccine] = useState('');     // Emlangan
  const [addSpecService, setAddSpecService] = useState('');     // Xizmat turi (services)
  const [addSpecExp, setAddSpecExp] = useState('');             // Tajriba (services)
  const [addSpecVolume, setAddSpecVolume] = useState('');       // Hajm (products)

  // Animations for Welcome Logo
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.4)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Animations for Screen Transition
  const contentFadeAnim = useRef(new Animated.Value(1)).current;
  const contentSlideAnim = useRef(new Animated.Value(0)).current;

  // Keyboard opening animation values
  const keyboardShowVal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Keyboard listeners
    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        Animated.timing(keyboardShowVal, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        Animated.timing(keyboardShowVal, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );

    // Logo entrance animation
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.back(2)),
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start(() => {
      // Breathing pulse loop
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // Auto-scroll Swiper every 3 seconds (3000ms)
  useEffect(() => {
    if (screen !== 'dashboard' || banners.length === 0) return;

    const timer = setInterval(() => {
      const nextSlide = (activeSlide + 1) % banners.length;
      if (swiperRef.current) {
        swiperRef.current.scrollTo({
          x: nextSlide * (SCREEN_WIDTH - 32),
          animated: true,
        });
        setActiveSlide(nextSlide);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [screen, activeSlide, banners]);

  const navigateTo = (targetScreen) => {
    Animated.parallel([
      Animated.timing(contentFadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(contentSlideAnim, {
        toValue: 20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setScreen(targetScreen);
      // Wait for next tick to ensure view is mounted before animating
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(contentFadeAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(contentSlideAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start();
      }, 50);
    });
  };

  const handleRegister = async () => {
    if (!regName || !regPassword) {
      Alert.alert("Xatolik", "Barcha majburiy maydonlarni to'ldiring!");
      return;
    }

    try {
      const apiUrl = 'https://api.zoovita.uz';
      const response = await fetch(`${apiUrl}/api/v1/auth/initiate-telegram-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: regName,
          password: regPassword,
          email: regEmail
        })
      });

      const data = await response.json();
      if (response.ok) {
        setPendingTelegramSession(data.session_id);
        Linking.openURL(data.bot_url);
      } else {
        Alert.alert("Xatolik", data.detail || "Xatolik yuz berdi");
      }
    } catch (error) {
      Alert.alert("Xatolik", "Tarmoq xatosi");
    }
  };

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert("Xatolik", "Iltimos, telefon raqam va parolni kiriting.");
      return;
    }

    const fullPhoneNumber = `${selectedPhoneCode}${phoneNumber}`;

    try {
      const apiUrl = 'https://api.zoovita.uz';
      const response = await fetch(`${apiUrl}/api/v1/auth/login-phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: fullPhoneNumber,
          password: password,
        })
      });

      const data = await response.json();
      
      if (response.ok && data.access_token) {
        await AsyncStorage.setItem('userToken', data.access_token);
        setIsLoggedIn(true);
        fetchUserProfile(data.access_token);
        setScreen('dashboard');
        setDashboardTab('home');
      } else {
        Alert.alert("Xatolik", data.detail || "Tizimga kirishda xatolik yuz berdi");
      }
    } catch (error) {
      Alert.alert("Xatolik", "Tarmoq xatosi");
    }
  };

  const handlePhoneChange = (text) => {
    const cleanedText = text.replace(/[^0-9]/g, '');
    if (cleanedText.length <= currentPhoneConfig.maxLen) {
      setPhoneNumber(cleanedText);
    }
  };

  const handleRegPhoneChange = (text) => {
    const cleanedText = text.replace(/[^0-9]/g, '');
    if (cleanedText.length <= currentPhoneConfig.maxLen) {
      setRegPhone(cleanedText);
    }
  };

  const toggleFavorite = (id) => {
    if (!isLoggedIn) {
      navigateTo('login');
      return;
    }
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleListingClick = (listing) => {
    if (!isLoggedIn) {
      navigateTo('login');
      return;
    }
    setSelectedSeller(null);
    setSelectedProduct(null);
    setSelectedListing(listing);
    setDetailActiveImageIndex(0);
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Ruxsat berilmadi", "Galereyadan foydalanish uchun ruxsat berishingiz lozim.");
      return;
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 10 - addPhotos.length,
        quality: 0.8,
      });

      if (!result.canceled) {
        const selectedUris = result.assets.map(asset => asset.uri);
        setAddPhotos(prev => [...prev, ...selectedUris].slice(0, 10));
      }
    } catch (err) {
      console.log('Error selecting photos:', err);
      Alert.alert("Xatolik", "Rasmlarni tanlashda xatolik yuz berdi.");
    }
  };

  const pickProfileAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Ruxsat berilmadi", "Galereyadan foydalanish uchun ruxsat berishingiz lozim.");
      return;
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setUserProfileAvatar(result.assets[0].uri);
      }
    } catch (err) {
      console.log('Error picking avatar:', err);
      Alert.alert("Xatolik", "Rasm tanlashda xatolik yuz berdi.");
    }
  };

  const requestDeviceLocation = async () => {
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          "Ruxsat rad etildi", 
          "Joylashuvni aniqlash uchun qurilma sozlamalaridan ruxsat berishingiz kerak.",
          [
            { text: "Bekor qilish", style: "cancel" },
            { text: "Sozlamalarga o'tish", onPress: () => Linking.openSettings() }
          ]
        );
        setIsLocating(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setAddCoordinates(coords);

      const addresses = await Location.reverseGeocodeAsync(coords);
      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        const readableAddress = `${address.region || ''}, ${address.city || address.subregion || ''}, ${address.district || address.street || ''}`.trim().replace(/^, |, $/, '');
        setAddLocation(readableAddress || `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
      } else {
        setAddLocation(`${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
      }
    } catch (err) {
      console.log('Error getting location:', err);
      Alert.alert("Xatolik", "Joylashuvni aniqlashda xatolik yuz berdi.");
    } finally {
      setIsLocating(false);
    }
  };

  const getFormattedCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId);
    if (!cat) return 'Tanlang';
    const sectionLabels = {
      'animals': 'Hayvonlar',
      'products': 'Mahsulotlar',
      'services': 'Xizmatlar'
    };
    return `${sectionLabels[cat.section] || ''} / ${cat.name}`;
  };

  const renderCategoryItemIcon = (cat) => {
    const iconSize = 16;
    const color = cat.iconColor || '#7C8A79';
    if (cat.iconType === 'feather') {
      return <Feather name={cat.icon} size={iconSize} color={color} />;
    } else if (cat.iconType === 'material-community') {
      return <MaterialCommunityIcons name={cat.icon} size={iconSize} color={color} />;
    } else if (cat.iconType === 'font-awesome-5') {
      return <FontAwesome5 name={cat.icon} size={iconSize} color={color} />;
    } else if (cat.iconType === 'ionicons') {
      return <Ionicons name={cat.icon} size={iconSize} color={color} />;
    } else if (cat.iconType === 'antdesign') {
      return <AntDesign name={cat.icon} size={iconSize} color={color} />;
    }
    return <Feather name="grid" size={iconSize} color={color} />;
  };

  const handleTitleChange = (text) => {
    setAddTitle(text);
    const lowerText = text.toLowerCase();
    
    // Auto-detect subcategory keywords
    if (lowerText.includes('sigir') || lowerText.includes('sigr') || lowerText.includes('buqa') || lowerText.includes('buzoq') || lowerText.includes('qoramol') || lowerText.includes('tana')) {
      setAddCategory('qoramol');
    } else if (lowerText.includes('qo\'y') || lowerText.includes('qoy') || lowerText.includes('qo\'chqor') || lowerText.includes('qochqor') || lowerText.includes('taka')) {
      setAddCategory('qoy');
    } else if (lowerText.includes('ot ') || lowerText.includes('toy ') || lowerText.includes('arab ot') || lowerText.includes('biy')) {
      setAddCategory('otlar');
    } else if (lowerText.includes('echki') || lowerText.includes('uloq')) {
      setAddCategory('echkilar');
    } else if (lowerText.includes('tovuq') || lowerText.includes('xo\'roz') || lowerText.includes('xoroz') || lowerText.includes('jo\'ja') || lowerText.includes('joja') || lowerText.includes('parranda')) {
      setAddCategory('parrandalar');
    } else if (lowerText.includes('it ') || lowerText.includes('kuchuk') || lowerText.includes('mushuk') || lowerText.includes('pesik') || lowerText.includes('koshka')) {
      setAddCategory('it va mushuklar');
    } else if (lowerText.includes('hashak') || lowerText.includes('o\'t') || lowerText.includes('silos') || lowerText.includes('yem') || lowerText.includes('arpa') || lowerText.includes('bug\'doy') || lowerText.includes('somon') || lowerText.includes('oziq')) {
      setAddCategory('oziq-ovqatlar');
    } else if (lowerText.includes('vitamin') || lowerText.includes('qo\'shimcha') || lowerText.includes('qoshimcha') || lowerText.includes('dori')) {
      setAddCategory('vitaminlar');
    } else if (lowerText.includes('veterinar') || lowerText.includes('shifokor') || lowerText.includes('doktor') || lowerText.includes('davolash')) {
      setAddCategory('veterinariya');
    } else if (lowerText.includes('groom') || lowerText.includes('cho\'miltirish') || lowerText.includes('parvarish')) {
      setAddCategory('grooming');
    } else if (lowerText.includes('transport') || lowerText.includes('tashish') || lowerText.includes('yetkazib')) {
      setAddCategory('transport');
    } else if (lowerText.includes('urug\'lantirish') || lowerText.includes('uruglantirish')) {
      setAddCategory('uruglantirish');
    }
  };

  const handleAddSubmit = async () => {
    if (addStep === 1) {
      if (!addTitle.trim()) {
        Alert.alert("Xatolik", "Iltimos, e'lon nomini kiriting.");
        return;
      }
      if (!addDesc.trim()) {
        Alert.alert("Xatolik", "Iltimos, e'lon tavsifini kiriting.");
        return;
      }
      if (addDesc.trim().length < 40) {
        Alert.alert("Xatolik", `Tavsif juda qisqa. Kamida 40 ta belgi bo'lishi kerak (hozir ${addDesc.trim().length} ta).`);
        return;
      }
      if (addDesc.trim().length > 100) {
        Alert.alert("Xatolik", `Tavsif juda uzun. Maksimal 100 ta belgi bo'lishi mumkin (hozir ${addDesc.trim().length} ta).`);
        return;
      }
      if (!addPrice.trim()) {
        Alert.alert("Xatolik", "Iltimos, e'lon narxini kiriting.");
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
      if (!addContactEmail.trim()) {
return;
      }
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(addContactEmail.trim())) {
        Alert.alert("Xatolik", "Iltimos, to'g'ri email manzilini kiriting.");
        return;
      }
      setAddStep(3);
    } else if (addStep === 3) {
      const formattedPrice = addPrice.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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
          setAddSpecBreed('');
          setAddSpecHealth('');
          setAddSpecMilk('');
          setAddSpecWeight('');
          setAddSpecVaccine('');
          setAddSpecService('');
          setAddSpecExp('');
          setAddSpecVolume('');
          
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
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-8deg'],
  });

  const pulseScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });

  // Calculate Logo animations based on keyboard state
  const logoScale = keyboardShowVal.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.45],
  });

  const logoTranslateY = keyboardShowVal.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -70],
  });

  const logoOpacity = keyboardShowVal.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  // Swiper scroll handler
  const handleSwiperScroll = (event) => {
    const slideWidth = event.nativeEvent.layoutMeasurement.width;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / slideWidth);
    setActiveSlide(index);
  };

  // Check if +998 should be shown
  const showLoginPrefix = isPhoneFocused || phoneNumber.length > 0;
  const showRegPrefix = isRegPhoneFocused || regPhone.length > 0;

  // Custom Category Icon Renderer
  const renderCategoryIcon = (category) => {
    if (category.iconType === 'material-community') {
      return <MaterialCommunityIcons name={category.icon} size={28} color={category.iconColor} />;
    } else if (category.iconType === 'font-awesome') {
      return <FontAwesome5 name={category.icon} size={24} color={category.iconColor} />;
    } else {
      return <Feather name={category.icon} size={26} color={category.iconColor} />;
    }
  };  if (screen === 'dashboard') {
    const dynamicSections = [
      {
        id: 'animals',
        title: 'Hayvonlar',
        icon: 'paw',
        iconType: 'ionicons',
        iconBg: '#E6F4EA',
        iconColor: '#3C8E2D',
        items: categories.filter(c => c.section === 'animals').map(c => ({...c, count: `${ads.filter(a => a.category_id === c.id).length} e'lon`}))
      },
      {
        id: 'products',
        title: 'Oziq-ovqat va mahsulotlar',
        icon: 'shopping-bag',
        iconType: 'feather',
        iconBg: '#FEF3D6',
        iconColor: '#F5A623',
        items: categories.filter(c => c.section === 'products').map(c => ({...c, count: `${ads.filter(a => a.category_id === c.id).length} e'lon`}))
      },
      {
        id: 'services',
        title: 'Veterinariya xizmatlari',
        icon: 'stethoscope',
        iconType: 'font-awesome',
        iconBg: '#E3F2FD',
        iconColor: '#1E88E5',
        items: categories.filter(c => c.section === 'services').map(c => ({...c, count: `${ads.filter(a => a.category_id === c.id).length} e'lon`}))
      }
    ];

    // Filter sections based on catFilter state
    const filteredSections = dynamicSections.filter(section => {
      if (catFilter === 'all') return true;
      return section.id === catFilter;
    });

    return (
      <View style={styles.dashboardContainer}>
        <StatusBar style="dark" />

        {dashboardTab === 'home' && (
          <>
            <DashboardHeader
              onNotificationPress={() => {
                if (!isLoggedIn) {
                  navigateTo('login');
                } else {
                  setShowNotifications(true);
                }
              }}
              unreadCount={unreadNotificationsCount}
            />

            <ScrollView 
              showsVerticalScrollIndicator={false} 
              contentContainerStyle={styles.dashboardScroll}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3C8E2D']} />}
            >
              {/* Search bar */}
              <View style={styles.searchSection}>
                <View style={styles.searchBar}>
                  <Feather name="search" size={20} color="#A3B1A0" style={styles.searchIcon} />
                  <TextInput 
                    style={styles.searchInput} 
                    placeholder="Hayvon, mahsulot, xizmat qidirish..." 
                    placeholderTextColor="#A3B1A0"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
                <TouchableOpacity 
                  style={styles.filterButton} 
                  activeOpacity={0.7}
                  onPress={() => {
                    setFilterCategory('all');
                    setShowFilterModal(true);
                  }}
                >
                  <Feather name="sliders" size={20} color="#15330F" />
                </TouchableOpacity>
              </View>

              {/* Banner Swiper */}
              {banners.length > 0 && (
                <View style={styles.swiperContainer}>
                  <ScrollView
                    ref={swiperRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleSwiperScroll}
                    scrollEventThrottle={16}
                    style={styles.swiperScrollView}
                  >
                    {banners.map((slide) => (
                      <View key={slide.id} style={styles.slideWrapper}>
                        <Image 
                          source={{ uri: slide.image }} 
                          style={styles.slideImage} 
                          resizeMode="cover"
                        />
                      </View>
                    ))}
                  </ScrollView>
                  
                  {/* Swiper Indicators */}
                  <View style={styles.swiperDots}>
                    {banners.map((_, index) => (
                      <View 
                        key={index} 
                        style={[
                          styles.swiperDot, 
                          activeSlide === index && styles.swiperDotActive
                        ]} 
                      />
                    ))}
                  </View>
                </View>
              )}

              {/* Categories Horizontal Grid */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
                {CATEGORIES.map((category) => (
                  <TouchableOpacity 
                    key={category.id} 
                    style={styles.categoryItem} 
                    activeOpacity={0.8}
                    onPress={() => {
                      if (category.id === 1) {
                        setCatFilter('animals');
                        setDashboardTab('categories');
                      } else if (category.id === 2) {
                        setCatFilter('products');
                        setDashboardTab('categories');
                      } else if (category.id === 3) {
                        setCatFilter('services');
                        setDashboardTab('categories');
                      } else if (category.id === 4) {
                        setShowAiChat(true);
                      } else {
                        setCatFilter('all');
                        setDashboardTab('categories');
                      }
                    }}
                  >
                    <View style={[styles.categoryIconWrapper, { backgroundColor: category.bgColor }]}>
                      {renderCategoryIcon(category)}
                    </View>
                    <Text style={styles.categoryName} numberOfLines={2}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Recommended Listings */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Tavsiya etilgan e'lonlar</Text>
                <TouchableOpacity 
                  activeOpacity={0.7} 
                  style={styles.seeAllBtn}
                  onPress={() => {
                    setCatFilter('animals');
                    setDashboardTab('categories');
                  }}
                >
                  <Text style={styles.seeAllText}>Barchasini ko'rish</Text>
                  <Feather name="chevron-right" size={16} color="#3C8E2D" />
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsScrollContainer}>
                {ads
                  .filter(ad => {
                    const cat = categories.find(c => c.id === ad.category_id);
                    return cat && cat.section === 'animals';
                  })
                  .slice(0, 10)
                  .map((listing) => (
                  <TouchableOpacity key={listing.id} style={styles.animalCard} activeOpacity={0.9}
                    onPress={() => handleListingClick(listing)}>
                    <Image source={{ uri: (listing.images && listing.images.length > 0 ? listing.images[0] : 'https://via.placeholder.com/400') }} style={styles.animalCardImage} />
                    <TouchableOpacity 
                      style={styles.favoriteBtn} 
                      activeOpacity={0.8}
                      onPress={() => toggleFavorite(listing.id)}
                    >
                      <Ionicons 
                        name={favorites[listing.id] ? "heart" : "heart-outline"} 
                        size={18} 
                        color={favorites[listing.id] ? "#EA4335" : "#7C8A79"} 
                      />
                    </TouchableOpacity>

                    <View style={styles.cardDetails}>
                      <Text style={styles.cardTitle} numberOfLines={1}>{listing.title}</Text>
                      <Text style={styles.cardLocation} numberOfLines={1}>{listing.location ? listing.location.split(',')[0].trim() : ''}</Text>
                      <Text style={styles.cardPrice}>{listing.price}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Popular Products */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Mashhur mahsulotlar</Text>
                <TouchableOpacity 
                  activeOpacity={0.7} 
                  style={styles.seeAllBtn}
                  onPress={() => {
                    setCatFilter('products');
                    setDashboardTab('categories');
                  }}
                >
                  <Text style={styles.seeAllText}>Barchasini ko'rish</Text>
                  <Feather name="chevron-right" size={16} color="#3C8E2D" />
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsScrollContainer}>
                {ads
                  .filter(ad => {
                    const cat = categories.find(c => c.id === ad.category_id);
                    return cat && cat.section === 'products';
                  })
                  .slice(0, 10)
                  .map((product) => (
                  <TouchableOpacity 
                    key={product.id} 
                    style={styles.productCard} 
                    activeOpacity={0.9}
                    onPress={() => handleListingClick(product)}
                  >
                    <View style={styles.productImageWrapper}>
                      <Image source={{ uri: (product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/400') }} style={styles.productCardImage} />
                      
                    </View>
                    
                    <View style={styles.productDetails}>
                      <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
                      <View style={styles.priceCartRow}>
                        <View>
                          <Text style={styles.productPrice}>{product.price}</Text>
                          
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Vet Services */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Veterinariya xizmatlari</Text>
                <TouchableOpacity 
                  activeOpacity={0.7} 
                  style={styles.seeAllBtn}
                  onPress={() => {
                    setCatFilter('services');
                    setDashboardTab('categories');
                  }}
                >
                  <Text style={styles.seeAllText}>Barchasini ko'rish</Text>
                  <Feather name="chevron-right" size={16} color="#3C8E2D" />
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsScrollContainer}>
                {ads
                  .filter(ad => {
                    const cat = categories.find(c => c.id === ad.category_id);
                    return cat && cat.section === 'services';
                  })
                  .slice(0, 10)
                  .map((service) => (
                  <TouchableOpacity 
                    key={service.id} 
                    style={styles.productCard} 
                    activeOpacity={0.9}
                    onPress={() => handleListingClick(service)}
                  >
                    <View style={styles.productImageWrapper}>
                      <Image source={{ uri: (service.images && service.images.length > 0 ? service.images[0] : 'https://via.placeholder.com/400') }} style={styles.productCardImage} />
                    </View>
                    
                    <View style={styles.productDetails}>
                      <Text style={styles.productTitle} numberOfLines={2}>{service.title}</Text>
                      <View style={styles.priceCartRow}>
                        <View>
                          <Text style={styles.productPrice}>{service.price}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Info Banner */}
              <View style={styles.bannerWrapper}>
                <View style={styles.bannerContainer}>
                  <View style={styles.bannerLeft}>
                    <View style={styles.shieldWrapper}>
                      <Ionicons name="shield-checkmark" size={24} color="#2F7A29" />
                    </View>
                    <View style={styles.bannerTextWrapper}>
                      <Text style={styles.bannerTitle}>Ishonchli va xavfsiz savdo</Text>
                      <Text style={styles.bannerSubtitle}>
                        Barcha e'lonlar tekshiriladi, xavfsiz to'lov va tez yetkazib berish.
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.bannerRight}>
                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png' }} style={styles.bannerDeliveryImage} />
                    <TouchableOpacity 
                      style={styles.bannerBtn} 
                      activeOpacity={0.8}
                      onPress={() => {
                        setDashboardTab('bozor');
                        setShowListings(false);
                        setShowSubcategories(false);
                        setSelectedSection(null);
                        setSubcatSearchQuery('');
                      }}
                    >
                      <Text style={styles.bannerBtnText}>Ko'proq bilish</Text>
                      <Feather name="arrow-right" size={14} color="#ffffff" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>              
            </ScrollView>
          </>
        )}

        {((dashboardTab === 'categories' && showListings) || dashboardTab === 'bozor') && (() => {
            const filteredListings = ads.filter((item) => {
              if (selectedListingsCategory !== 'all') {
                const catName = selectedListingsCategory;
                if (catName === 'qoramol' && !item.title.toLowerCase().includes('sigir')) return false;
                if (catName === 'qoy' && !item.title.toLowerCase().includes('qo\'y')) return false;
                if (catName === 'otlar' && !item.title.toLowerCase().includes('ot')) return false;
                if (catName === 'echkilar' && !item.title.toLowerCase().includes('echki')) return false;
              }
              
              if (listingsSearchQuery.trim() !== '') {
                const q = listingsSearchQuery.toLowerCase();
                const matchesSearch = item.title.toLowerCase().includes(q) || 
                       item.location.toLowerCase().includes(q) ||
                       item.description.toLowerCase().includes(q) ||
                       item.contact_name.toLowerCase().includes(q);
                if (!matchesSearch) return false;
              }

              // Region/Location filter
              if (bozorRegionFilter !== 'all') {
                if (!item.location.toLowerCase().includes(bozorRegionFilter.toLowerCase())) return false;
              }
              if (filterRegion !== 'all') {
                if (!item.location.toLowerCase().includes(filterRegion.toLowerCase())) return false;
              }

              // Category filter from filter modal
              if (filterCategory !== 'all') {
                const lowerTitle = item.title.toLowerCase();
                if (filterCategory === 'animals') {
                  const isAnimal = lowerTitle.includes('sigir') || lowerTitle.includes('qo\'y') || lowerTitle.includes('ot') || lowerTitle.includes('echki');
                  if (!isAnimal) return false;
                } else if (filterCategory === 'products') {
                  const isProduct = lowerTitle.includes('yem') || lowerTitle.includes('vitamin') || lowerTitle.includes('yoqa') || lowerTitle.includes('kalsiy');
                  if (!isProduct) return false;
                } else if (filterCategory === 'services') {
                  const isService = lowerTitle.includes('veterinar') || lowerTitle.includes('grooming') || lowerTitle.includes('klinika');
                  if (!isService) return false;
                }
              }

              // Price range filter
              const numericPrice = parseInt(item.price.replace(/[^0-9]/g, ''), 10) || 0;
              if (filterMinPrice.trim() !== '') {
                const minPrice = parseInt(filterMinPrice.replace(/[^0-9]/g, ''), 10) || 0;
                if (numericPrice < minPrice) return false;
              }
              if (filterMaxPrice.trim() !== '') {
                const maxPrice = parseInt(filterMaxPrice.replace(/[^0-9]/g, ''), 10) || 0;
                if (numericPrice > maxPrice) return false;
              }

              // Extra advanced filters
              if (filterDelivery !== null) {
                const isService = item.title.toLowerCase().includes('veterinar') || item.title.toLowerCase().includes('grooming') || item.title.toLowerCase().includes('klinika');
                const itemHasDelivery = item.delivery !== false && !isService;
                if (itemHasDelivery !== filterDelivery) return false;
              }
              if (filterVerified) {
                if (item.verified !== true) return false;
              }
              if (filterGender !== 'all') {
                if (item.gender !== filterGender) return false;
              }

              return true;
            });

            const sortedListings = [...filteredListings].sort((a, b) => {
              const aIsTop = a.tag === 'Top' ? 1 : 0;
              const bIsTop = b.tag === 'Top' ? 1 : 0;
              if (bIsTop !== aIsTop) {
                return bIsTop - aIsTop;
              }

              if (bozorSortOption === 'price_asc') {
                const priceA = parseInt(a.price.replace(/[^0-9]/g, ''), 10) || 0;
                const priceB = parseInt(b.price.replace(/[^0-9]/g, ''), 10) || 0;
                return priceA - priceB;
              } else if (bozorSortOption === 'price_desc') {
                const priceA = parseInt(a.price.replace(/[^0-9]/g, ''), 10) || 0;
                const priceB = parseInt(b.price.replace(/[^0-9]/g, ''), 10) || 0;
                return priceB - priceA;
              } else {
                // newest (larger ID is newer)
                return b.id - a.id;
              }
            });

            return (
              <View style={styles.listingsScreenContainer}>
                {/* Header */}
                <SafeAreaView style={styles.listingsHeaderArea}>
                  <View style={styles.listingsHeader}>
                    <TouchableOpacity 
                      style={styles.listingsHeaderBtn} 
                      activeOpacity={0.7}
                      onPress={() => {
                        if (dashboardTab === 'bozor') {
                          setDashboardTab('home');
                        } else {
                          setShowListings(false);
                        }
                      }}
                    >
                      <Feather name="arrow-left" size={22} color="#15330F" />
                    </TouchableOpacity>
                    
                    <Text style={styles.listingsHeaderTitle}>E'lonlar</Text>
                    
                    <TouchableOpacity 
                      style={styles.listingsHeaderBtn} 
                      activeOpacity={0.7}
                      onPress={() => setShowNotifications(true)}
                    >
                      <Feather name="bell" size={22} color="#15330F" />
                      {unreadNotificationsCount > 0 && (
                        <View style={styles.listingsNotificationBadge}>
                          <Text style={styles.listingsNotificationText}>{unreadNotificationsCount}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </SafeAreaView>

                {/* Search Bar & Filter */}
                <View style={styles.listingsSearchSection}>
                  <View style={styles.listingsSearchBar}>
                    <Feather name="search" size={20} color="#7C8A79" style={styles.listingsSearchIcon} />
                    <TextInput
                      style={styles.listingsSearchInput}
                      placeholder="Hayvon, mahsulot yoki xizmat qidirish..."
                      placeholderTextColor="#A3B1A0"
                      value={listingsSearchQuery}
                      onChangeText={setListingsSearchQuery}
                    />
                  </View>
                  <TouchableOpacity 
                    style={styles.listingsFilterButton} 
                    activeOpacity={0.75}
                    onPress={() => {
                      setFilterCategory('all');
                      setShowFilterModal(true);
                    }}
                  >
                    <Ionicons name="options-outline" size={20} color="#15330F" style={{ marginRight: 6 }} />
                    <Text style={styles.listingsFilterButtonText}>Filter</Text>
                  </TouchableOpacity>
                </View>

                {/* Category Pills Row */}
                <View style={{ marginBottom: 12 }}>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={styles.listingsCatContainer}
                  >
                    <TouchableOpacity
                      style={[styles.listingsCatPill, selectedListingsCategory === 'all' && styles.listingsCatPillActive]}
                      activeOpacity={0.8}
                      onPress={() => setSelectedListingsCategory('all')}
                    >
                      <Feather name="grid" size={15} color={selectedListingsCategory === 'all' ? '#3C8E2D' : '#2C3A27'} style={{ marginRight: 6 }} />
                      <Text style={[styles.listingsCatPillText, selectedListingsCategory === 'all' && styles.listingsCatPillTextActive]}>
                        Barchasi
                      </Text>
                    </TouchableOpacity>

                    {categories.map((cat) => {
                      const isActive = selectedListingsCategory === cat.id;
                      return (
                        <TouchableOpacity
                          key={cat.id}
                          style={[styles.listingsCatPill, isActive && styles.listingsCatPillActive]}
                          activeOpacity={0.8}
                          onPress={() => setSelectedListingsCategory(cat.id)}
                        >
                          <Text style={[styles.listingsCatPillText, isActive && styles.listingsCatPillTextActive]}>
                            {cat.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                    
                    <TouchableOpacity style={styles.listingsCatPillMore} activeOpacity={0.8}>
                      <Feather name="more-horizontal" size={16} color="#2C3A27" />
                    </TouchableOpacity>
                  </ScrollView>
                </View>

                {/* Sorting and Location Dropdowns */}
                <View style={styles.listingsSortingRow}>
                  <TouchableOpacity 
                    style={styles.listingsDropdownButton} 
                    activeOpacity={0.7}
                    onPress={() => setShowSortDropdown(true)}
                  >
                    <MaterialCommunityIcons name="swap-vertical" size={16} color="#7C8A79" style={{ marginRight: 6 }} />
                    <Text style={styles.listingsDropdownText} numberOfLines={1}>
                      <Text style={{ color: '#7C8A79', fontWeight: '500' }}>Tartiblash: </Text>
                      {bozorSortOption === 'newest' ? 'Yangi avval' : 
                       bozorSortOption === 'price_asc' ? 'Arzonroq' : 'Qimmatroq'}
                    </Text>
                    <Feather name="chevron-down" size={14} color="#7C8A79" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.listingsDropdownButton} 
                    activeOpacity={0.7}
                    onPress={() => setShowRegionDropdown(true)}
                  >
                    <Feather name="map-pin" size={14} color="#7C8A79" style={{ marginRight: 6 }} />
                    <Text style={styles.listingsDropdownText} numberOfLines={1}>
                      <Text style={{ color: '#7C8A79', fontWeight: '500' }}>Joylashuv: </Text>
                      {bozorRegionFilter === 'all' ? 'Barchasi' : bozorRegionFilter.split(' ')[0]}
                    </Text>
                    <Feather name="chevron-down" size={14} color="#7C8A79" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>

                {/* Animal Listings ScrollView */}
                <ScrollView 
                  showsVerticalScrollIndicator={false} 
                  contentContainerStyle={styles.listingsScrollContent}
                >
                  {sortedListings.map((item) => {
                    const isFav = !!favorites[item.id];
                    return (
                      <TouchableOpacity key={item.id} style={styles.listingsItemCard} activeOpacity={0.9}
                        onPress={() => handleListingClick(item)}>
                        {/* Image wrapper with overlays */}
                        <View style={styles.listingsItemImageWrapper}>
                          <Image source={{ uri: (item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/400') }} style={styles.listingsItemImage} />
                          
                          {/* Tag */}
                          {item.tag ? (
                            <View style={[styles.listingsItemTag, item.tag === 'Top' ? styles.tagTop : styles.tagYangi]}>
                              <Text style={styles.listingsItemTagText}>{item.tag}</Text>
                            </View>
                          ) : null}
                          
                          {/* Photo Count */}
                          <View style={styles.listingsItemPhotosBadge}>
                            <Feather name="camera" size={10} color="#FFFFFF" style={{ marginRight: 3 }} />
                            <Text style={styles.listingsItemPhotosText}>{item.photos}</Text>
                          </View>

                          {/* Heart Button overlay */}
                          <TouchableOpacity 
                            style={styles.listingsItemHeartBtn} 
                            activeOpacity={0.7}
                            onPress={() => toggleFavorite(item.id)}
                          >
                            <Ionicons 
                              name={isFav ? "heart" : "heart-outline"} 
                              size={18} 
                              color={isFav ? "#EA4335" : "#7C8A79"} 
                            />
                          </TouchableOpacity>
                        </View>
                        
                        {/* Details section below image */}
                        <View style={styles.listingsItemDetails}>
                          {/* Title */}
                          <Text style={styles.listingsItemTitle} numberOfLines={1}>{item.title}</Text>
                          
                          {/* Gender Icon + Details */}
                          <View style={styles.listingsItemDetailsRow}>
                            {item.gender === 'female' ? (
                              <Ionicons name="female" size={11} color="#E91E63" style={{ marginRight: 4 }} />
                            ) : item.gender === 'male' ? (
                              <Ionicons name="male" size={11} color="#1E88E5" style={{ marginRight: 4 }} />
                            ) : null}
                            <Text style={styles.listingsItemDetailsText} numberOfLines={1}>{item.description}</Text>
                          </View>
                          
                          {/* Price */}
                          <Text style={styles.listingsItemPrice}>{item.price}</Text>
                          
                          {/* Seller metadata */}
                          <View style={[styles.listingsItemSellerRow, {justifyContent: 'space-between', alignItems: 'center'}]}>
                            <Text style={[styles.listingsItemLocation, {marginBottom: 0}]} numberOfLines={1}>{item.location ? item.location.split(',')[0].trim() : ''}</Text>
                            <Text style={styles.listingsItemDate}>{(item.created_at ? new Date(item.created_at).toLocaleTimeString('uz-UZ', {hour: '2-digit', minute:'2-digit'}) : '')}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            );
          })()}

        {dashboardTab === 'categories' && !showListings && (
          showSubcategories ? (() => {
            const items = selectedSection ? selectedSection.items : [];
            const filteredItems = items.filter(item => 
              item.name.toLowerCase().includes(subcatSearchQuery.toLowerCase())
            );

            return (
              <View style={styles.subcatScreenContainer}>
                {/* Header */}
                <SafeAreaView style={styles.subcatHeaderArea}>
                  <View style={styles.subcatHeader}>
                    <TouchableOpacity 
                      style={styles.subcatHeaderBtn} 
                      activeOpacity={0.7}
                      onPress={() => {
                        setShowSubcategories(false);
                        setSelectedSection(null);
                        setSubcatSearchQuery('');
                      }}
                    >
                      <Feather name="arrow-left" size={22} color="#15330F" />
                    </TouchableOpacity>
                    
                    <Text style={styles.subcatHeaderTitle}>
                      {selectedSection ? `${selectedSection.title} bo'limi` : "Kategoriyalar"}
                    </Text>
                    
                    <View style={{ width: 40 }} />
                  </View>
                </SafeAreaView>

                {/* Search inside Subcategories */}
                <View style={styles.subcatSearchSection}>
                  <View style={styles.subcatSearchBar}>
                    <Feather name="search" size={20} color="#7C8A79" style={styles.subcatSearchIcon} />
                    <TextInput
                      style={styles.subcatSearchInput}
                      placeholder={`${selectedSection ? selectedSection.title : 'Kategoriya'}lardan qidirish...`}
                      placeholderTextColor="#A3B1A0"
                      value={subcatSearchQuery}
                      onChangeText={setSubcatSearchQuery}
                    />
                    {subcatSearchQuery !== '' && (
                      <TouchableOpacity onPress={() => setSubcatSearchQuery('')}>
                        <Feather name="x" size={18} color="#7C8A79" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* Subcategories ScrollView Grid */}
                <ScrollView 
                  showsVerticalScrollIndicator={false} 
                  contentContainerStyle={styles.subcatScrollContent}
                >
                  {filteredItems.length === 0 ? (
                    <View style={styles.subcatEmptyContainer}>
                      <Ionicons name="search-outline" size={48} color="#C5D4C2" style={{ marginBottom: 12 }} />
                      <Text style={styles.subcatEmptyText}>Hech narsa topilmadi</Text>
                    </View>
                  ) : (
                    <View style={styles.subcatGrid}>
                      {filteredItems.map((item) => (
                        <TouchableOpacity 
                          key={item.id} 
                          style={styles.subcatGridCard} 
                          activeOpacity={0.8}
                          onPress={() => {
                            const matchedCat = categories.find(c => 
                              c.name.toLowerCase() === item.name.toLowerCase()
                            );
                            if (matchedCat) {
                              setSelectedListingsCategory(matchedCat.id);
                              setListingsSearchQuery('');
                            } else {
                              setSelectedListingsCategory('all');
                              const searchTerm = item.name.endsWith('lar') ? item.name.slice(0, -3) : item.name;
                              setListingsSearchQuery(searchTerm);
                            }
                            setShowListings(true);
                          }}
                        >
                          <View style={styles.subcatCardImageWrapper}>
                            <Image source={{ uri: item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `https://api.zoovita.uz${item.image_url}`) : 'https://via.placeholder.com/400' }} style={styles.subcatCardImage} />
                          </View>
                          <View style={styles.subcatCardInfo}>
                            <Text style={styles.subcatCardName} numberOfLines={1}>
                              {item.name}
                            </Text>
                            <Text style={styles.subcatCardCount}>
                              {item.count}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </ScrollView>
              </View>
            );
          })() : (
            <View style={styles.catScreenContainer}>
              {/* Header */}
              <SafeAreaView style={styles.catHeaderArea}>
                <View style={styles.catHeader}>
                  <TouchableOpacity 
                    style={styles.catHeaderBtn} 
                    activeOpacity={0.7}
                    onPress={() => setDashboardTab('home')}
                  >
                    <Feather name="arrow-left" size={20} color="#15330F" />
                  </TouchableOpacity>
                  
                  <Text style={styles.catHeaderTitle}>Kategoriyalar</Text>
                  
                  <TouchableOpacity style={styles.catHeaderBtn} activeOpacity={0.7}>
                    <Feather name="search" size={20} color="#15330F" />
                  </TouchableOpacity>
                </View>
              </SafeAreaView>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.catScrollContent}>
                {/* Green Info Alert Box */}
                <View style={styles.catInfoBox}>
                  <View style={styles.catInfoIconWrapper}>
                    <Ionicons name="leaf" size={18} color="#3C8E2D" />
                  </View>
                  <Text style={styles.catInfoText}>
                    <Text style={{ fontWeight: 'bold' }}>Zoovita</Text>’da barcha hayvonlar, mahsulotlar va xizmatlar kategoriyalar bo‘yicha jamlangan.
                  </Text>
                </View>

                {/* Filter Pills */}
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  contentContainerStyle={styles.catFilterContainer}
                >
                  <TouchableOpacity 
                    style={[styles.catFilterPill, catFilter === 'all' && styles.catFilterPillActive]}
                    activeOpacity={0.8}
                    onPress={() => setCatFilter('all')}
                  >
                    <Text style={[styles.catFilterPillText, catFilter === 'all' && styles.catFilterPillTextActive]}>
                      Barcha kategoriyalar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.catFilterPill, catFilter === 'animals' && styles.catFilterPillActive]}
                    activeOpacity={0.8}
                    onPress={() => setCatFilter('animals')}
                  >
                    <Text style={[styles.catFilterPillText, catFilter === 'animals' && styles.catFilterPillTextActive]}>
                      Hayvonlar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.catFilterPill, catFilter === 'products' && styles.catFilterPillActive]}
                    activeOpacity={0.8}
                    onPress={() => setCatFilter('products')}
                  >
                    <Text style={[styles.catFilterPillText, catFilter === 'products' && styles.catFilterPillTextActive]}>
                      Mahsulotlar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.catFilterPill, catFilter === 'services' && styles.catFilterPillActive]}
                    activeOpacity={0.8}
                    onPress={() => setCatFilter('services')}
                  >
                    <Text style={[styles.catFilterPillText, catFilter === 'services' && styles.catFilterPillTextActive]}>
                      Xizmatlar
                    </Text>
                  </TouchableOpacity>
                </ScrollView>

                {/* Sections List */}
                {filteredSections.map((section) => (
                  <View key={section.id} style={styles.catSectionWrapper}>
                    {/* Section Header */}
                    <View style={styles.catSectionHeader}>
                      <View style={styles.catSectionHeaderLeft}>
                        <View style={[styles.catSectionIconBg, { backgroundColor: section.iconBg }]}>
                          {section.iconType === 'ionicons' ? (
                            <Ionicons name={section.icon} size={16} color={section.iconColor} />
                          ) : section.iconType === 'feather' ? (
                            <Feather name={section.icon} size={16} color={section.iconColor} />
                          ) : (
                            <MaterialCommunityIcons name={section.icon} size={18} color={section.iconColor} />
                          )}
                        </View>
                        <Text style={styles.catSectionTitle}>{section.title}</Text>
                      </View>
                      
                      <TouchableOpacity 
                        style={styles.catSeeAllBtn} 
                        activeOpacity={0.7}
                        onPress={() => {
                          setSelectedSection(section);
                          setShowSubcategories(true);
                        }}
                      >
                        <Text style={styles.catSeeAllText}>Barchasini ko'rish</Text>
                        <Feather name="chevron-right" size={14} color="#3C8E2D" />
                      </TouchableOpacity>
                    </View>

                    {/* Grid of 5 columns */}
                    <View style={styles.catGrid}>
                      {section.items.map((item) => (
                        <TouchableOpacity 
                          key={item.id} 
                          style={styles.catGridCard} 
                          activeOpacity={0.8}
                          onPress={() => {
                            const matchedCat = categories.find(c => 
                              c.name.toLowerCase() === item.name.toLowerCase()
                            );
                            if (matchedCat) {
                              setSelectedListingsCategory(matchedCat.id);
                              setListingsSearchQuery('');
                            } else {
                              setSelectedListingsCategory('all');
                              const searchTerm = item.name.endsWith('lar') ? item.name.slice(0, -3) : item.name;
                              setListingsSearchQuery(searchTerm);
                            }
                            setShowListings(true);
                          }}
                        >
                          <View style={styles.catCardImageWrapper}>
                            <Image source={{ uri: item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `https://api.zoovita.uz${item.image_url}`) : 'https://via.placeholder.com/400' }} style={styles.catCardImage} />
                          </View>
                          <Text style={styles.catCardName} numberOfLines={2}>
                            {item.name}
                          </Text>
                          <Text style={styles.catCardCount} numberOfLines={1}>
                            {item.count}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )
        )}

        {dashboardTab === 'profile' && (
          <View style={styles.profileContainer}>
            <SafeAreaView style={styles.profileHeaderArea}>
              <View style={styles.profileHeaderRow}>
                <Text style={styles.profileHeaderTitle}>Mening profilim</Text>
              </View>
            </SafeAreaView>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.profileScroll}>
               <View style={styles.profileSummaryCard}>
                <View style={styles.profileAvatarContainer}>
                  <TouchableOpacity 
                    style={styles.profileAvatarWrapper}
                    activeOpacity={0.8}
                    onPress={pickProfileAvatar}
                  >
                    <Image
                      source={{ uri: userProfileAvatar }}
                      style={styles.profileAvatar}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.profileAvatarCameraBadge}
                    activeOpacity={0.8}
                    onPress={pickProfileAvatar}
                  >
                    <Feather name="camera" size={12} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                <View style={styles.profileInfo}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.profileName}>{userProfileName}</Text>
                    <TouchableOpacity 
                      style={{ padding: 4, backgroundColor: '#E6F4EA', borderRadius: 6 }}
                      activeOpacity={0.7}
                      onPress={() => {
                        setEditNameInput(userProfileName);
                        setEditAvatarInput(userProfileAvatar);
                        setShowEditProfileModal(true);
                      }}
                    >
                      <Feather name="edit-2" size={13} color="#3C8E2D" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.profileContact}>{userProfilePhone}</Text>
                  <Text style={styles.profileContact}>{userProfileEmail}</Text>
                  <View style={styles.profileBadgesRow}>
                    <View style={[styles.profileBadge, { marginRight: 8 }]}> 
                      <Text style={styles.profileBadgeText}>Bronza daraja</Text>
                    </View>
                    <View style={[styles.profileBadge, styles.profileBadgePillAlt]}>
                      <Text style={[styles.profileBadgeText, styles.profileBadgeTextAlt]}>320 ball</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.profileStatsRow}>
                <TouchableOpacity 
                  style={styles.profileStatCard}
                  activeOpacity={0.8}
                  onPress={() => setProfileSubScreen('my_listings')}
                >
                  <Text style={styles.profileStatNumber}>
                    {ads.filter(item => item.isUserOwnListing).length}
                  </Text>
                  <Text style={styles.profileStatLabel}>E'lonlarim</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.profileStatCard, styles.profileStatCardLast]}
                  activeOpacity={0.8}
                  onPress={() => setProfileSubScreen('my_favorites')}
                >
                  <Text style={styles.profileStatNumber}>
                    {Object.keys(favorites).filter(k => favorites[k]).length}
                  </Text>
                  <Text style={styles.profileStatLabel}>Sevimlilarim</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.profileSectionTitle}>Mening xizmatlarim</Text>
              <View style={styles.profileSectionCard}>
                {PROFILE_SERVICES.map((item, index) => (
                  <View key={item.id}>
                    <TouchableOpacity 
                      style={styles.profileServiceRow} 
                      activeOpacity={0.8}
                      onPress={() => {
                        if (item.id === 'chats') {
                          fetchChatsList();
                          setProfileSubScreen('my_chats');
                        }
                        else if (item.id === 'pets') setProfileSubScreen('my_pets');
                        else if (item.id === 'addresses') setProfileSubScreen('my_addresses');
                        else if (item.id === 'payments') setProfileSubScreen('my_payments');
                        else if (item.id === 'premium') setProfileSubScreen('my_premium');
                      }}
                    >
                      <View style={[styles.profileServiceIconWrapper, { backgroundColor: item.bgColor }]}> 
                        {renderServiceIcon(item.icon, item.iconColor)}
                      </View>
                      <View style={styles.profileServiceTexts}>
                        <Text style={styles.profileServiceTitle}>{item.title}</Text>
                        <Text style={styles.profileServiceSubtitle}>{item.subtitle}</Text>
                      </View>
                      <Feather name="chevron-right" size={18} color="#7C8A79" />
                    </TouchableOpacity>
                    {index < PROFILE_SERVICES.length - 1 && (
                      <View style={styles.profileServiceDivider} />
                    )}
                  </View>
                ))}
              </View>

              <Text style={styles.profileSectionTitle}>Qo‘llab-quvvatlash</Text>
              <View style={styles.profileSectionCard}>
                {PROFILE_SUPPORT.map((item, index) => (
                  <View key={item.id}>
                    <TouchableOpacity 
                      style={styles.profileServiceRow} 
                      activeOpacity={0.8}
                      onPress={() => {
                        if (item.id === 'help') setProfileSubScreen('help_center');
                        else if (item.id === 'contact') setProfileSubScreen('contact_us');
                        else if (item.id === 'terms') setProfileSubScreen('terms');
                        else if (item.id === 'privacy') setProfileSubScreen('privacy');
                      }}
                    >
                      <View style={[styles.profileServiceIconWrapper, { backgroundColor: item.bgColor }]}> 
                        {renderServiceIcon(item.icon, item.iconColor)}
                      </View>
                      <View style={styles.profileServiceTexts}>
                        <Text style={styles.profileServiceTitle}>{item.title}</Text>
                        <Text style={styles.profileServiceSubtitle}>{item.subtitle}</Text>
                      </View>
                      <Feather name="chevron-right" size={18} color="#7C8A79" />
                    </TouchableOpacity>
                    {index < PROFILE_SUPPORT.length - 1 && (
                      <View style={styles.profileServiceDivider} />
                    )}
                  </View>
                ))}
              </View>

              {/* Tizimdan Chiqish Button */}
              <TouchableOpacity 
                style={styles.profileLogoutBtn} 
                activeOpacity={0.85}
                onPress={async () => {
                  setIsLoggedIn(false);
                  setUserProfileName('Mehmon foydalanuvchi');
                  setUserProfileEmail('Kiritilmagan');
                  setUserProfilePhone('Kiritilmagan');
                  setUserProfileAvatar('https://cdn-icons-png.flaticon.com/512/847/847969.png');
                  try {
                    await AsyncStorage.removeItem('userToken');
                  } catch (e) {}
                  setScreen('welcome');
                  setDashboardTab('home');
                }}
              >
                <Feather name="log-out" size={18} color="#FF5A5F" />
                <Text style={styles.profileLogoutBtnText}>Tizimdan chiqish</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {dashboardTab === 'add' && (
          <KeyboardAvoidingView 
            style={styles.addContainer} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {/* Header - No back button as requested */}
            <SafeAreaView style={styles.addHeaderArea}>
              <View style={styles.addHeaderCentered}>
                <Text style={styles.addHeaderTitle}>E'lon berish</Text>
              </View>
            </SafeAreaView>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.addScrollContent}>
              {/* Dynamic Steps Row */}
              <View style={styles.addStepsRow}>
                {/* Step 1 */}
                <View style={styles.addStepItem}>
                  <View style={[styles.addStepCircle, addStep >= 1 && styles.addStepCircleActive]}>
                    <Text style={addStep >= 1 ? styles.addStepCircleTextActive : styles.addStepCircleText}>1</Text>
                  </View>
                  <Text style={[styles.addStepLabel, addStep >= 1 && styles.addStepLabelActive]}>Ma'lumotlar</Text>
                </View>
                
                {/* Line 1 */}
                <View style={[styles.addStepLine, addStep >= 2 && styles.addStepLineActive]} />

                {/* Step 2 */}
                <View style={styles.addStepItem}>
                  <View style={[styles.addStepCircle, addStep >= 2 && styles.addStepCircleActive]}>
                    <Text style={addStep >= 2 ? styles.addStepCircleTextActive : styles.addStepCircleText}>2</Text>
                  </View>
                  <Text style={[styles.addStepLabel, addStep >= 2 && styles.addStepLabelActive]}>Qo'shimcha</Text>
                </View>

                {/* Line 2 */}
                <View style={[styles.addStepLine, addStep >= 3 && styles.addStepLineActive]} />

                {/* Step 3 */}
                <View style={styles.addStepItem}>
                  <View style={[styles.addStepCircle, addStep >= 3 && styles.addStepCircleActive]}>
                    <Text style={addStep >= 3 ? styles.addStepCircleTextActive : styles.addStepCircleText}>3</Text>
                  </View>
                  <Text style={[styles.addStepLabel, addStep >= 3 && styles.addStepLabelActive]}>Tekshirish</Text>
                </View>
              </View>

              {/* STEP 1: MA'LUMOTLAR */}
              {addStep === 1 && (
                <View>
                  {/* Photo Upload Area */}
                  <TouchableOpacity 
                    style={styles.addPhotoUploadCard}
                    activeOpacity={0.8}
                    onPress={pickImages}
                  >
                    <View style={styles.addPhotoIconWrapper}>
                      <Feather name="camera" size={32} color="#3C8E2D" />
                    </View>
                    <Text style={styles.addPhotoUploadTitle}>Rasmlar qo'shish ({addPhotos.length}/10)</Text>
                  </TouchableOpacity>
                  <Text style={styles.addPhotoNote}>Aniq va sifatli rasmlar qo'shish tavsiya etiladi.</Text>

                  {/* Photo Thumbnails */}
                  {addPhotos.length > 0 && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.addThumbnailsScroll} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
                      {addPhotos.map((photoUri, index) => (
                        <View key={index} style={styles.addThumbnailWrapper}>
                          <Image 
                            source={{ uri: photoUri }} 
                            style={styles.addThumbnailImage} 
                          />
                          <TouchableOpacity 
                            style={styles.addThumbnailRemoveBtn}
                            activeOpacity={0.7}
                            onPress={() => {
                              setAddPhotos(prev => prev.filter((_, idx) => idx !== index));
                            }}
                          >
                            <Feather name="x" size={10} color="#FFFFFF" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  )}

                  {/* Form */}
                  <View style={styles.addForm}>
                    {/* Name Field (FIRST) */}
                    <Text style={styles.addFieldLabel}>Nomi</Text>
                    <TextInput 
                      style={styles.addInputField}
                      placeholder="Masalan: Sigir (Golishten) yoki Hashak"
                      placeholderTextColor="#A3B1A0"
                      value={addTitle}
                      onChangeText={handleTitleChange}
                    />

                    {/* Category Selector (SECOND) */}
                    <Text style={styles.addFieldLabel}>Kategoriya</Text>
                    <TouchableOpacity 
                      style={styles.addDropdownTrigger} 
                      activeOpacity={0.8}
                      onPress={() => setShowCategoryModal(true)}
                    >
                      <Text style={styles.addDropdownValue}>
                        {getFormattedCategoryName(addCategory)}
                      </Text>
                      <Feather name="chevron-down" size={18} color="#7C8A79" />
                    </TouchableOpacity>

                    {/* Description Field */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={styles.addFieldLabel}>Tavsif</Text>
                      <Text style={[styles.addFieldLabel, { fontSize: 11, color: addDesc.length < 40 ? '#FF5A5F' : '#3C8E2D' }]}>
                        {addDesc.length}/100 ta belgi (min 40 ta)
                      </Text>
                    </View>
                    <TextInput 
                      style={[styles.addInputField, styles.addInputFieldMultiline]}
                      placeholder="Tafsilotlar haqida batafsil yozing (kamida 40 ta, ko'pi bilan 100 ta belgi)..."
                      placeholderTextColor="#A3B1A0"
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      value={addDesc}
                      onChangeText={setAddDesc}
                      maxLength={100}
                    />

                    {/* Price Field */}
                    <Text style={styles.addFieldLabel}>Narxi</Text>
                    <View style={styles.addPriceInputWrapper}>
                      <TextInput 
                        style={styles.addPriceInputField}
                        placeholder="Narxni kiriting"
                        placeholderTextColor="#A3B1A0"
                        keyboardType="numeric"
                        value={addPrice}
                        onChangeText={setAddPrice}
                      />
                      <Text style={styles.addPriceSuffix}>so'm</Text>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity 
                      style={styles.addSubmitBtn}
                      activeOpacity={0.85}
                      onPress={handleAddSubmit}
                    >
                      <Text style={styles.addSubmitBtnText}>Davom etish</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* STEP 2: QO'SHIMCHA */}
              {addStep === 2 && (
                <View style={styles.addForm}>
                  {/* Joylashuv */}
                  <Text style={styles.addFieldLabel}>Joylashuv</Text>
                  
                  {/* Interactive Map Visual Mockup */}
                  <View style={styles.mapContainer}>
                    <ImageBackground 
                      source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80' }} 
                      style={styles.mapBackground}
                    >
                      <View style={styles.mapPinWrapper}>
                        <Feather name="map-pin" size={26} color="#3C8E2D" />
                        <View style={styles.mapPulseCircle} />
                      </View>
                    </ImageBackground>
                    <View style={styles.mapOverlayLabel}>
                      <Text style={styles.mapOverlayText}>
                        {addCoordinates 
                          ? `GPS: ${addCoordinates.latitude.toFixed(5)}, ${addCoordinates.longitude.toFixed(5)}` 
                          : 'Joylashuv aniqlanmagan'}
                      </Text>
                    </View>
                  </View>

                  {/* GPS Detection Button */}
                  <TouchableOpacity 
                    style={styles.gpsBtn}
                    activeOpacity={0.8}
                    onPress={requestDeviceLocation}
                    disabled={isLocating}
                  >
                    {isLocating ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Feather name="navigation" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                        <Text style={styles.gpsBtnText}>Mening joylashuvimni aniqlash (GPS)</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  {/* Manual Dropdown Trigger */}
                  <Text style={[styles.addFieldLabel, { marginTop: 8 }]}>Qo'lda kiritish (Viloyat va tuman)</Text>
                  <TouchableOpacity 
                    style={styles.addDropdownTrigger} 
                    activeOpacity={0.8}
                    onPress={() => setShowLocationModal(true)}
                  >
                    <Text style={styles.addDropdownValue}>{addLocation}</Text>
                    <Feather name="chevron-down" size={18} color="#7C8A79" />
                  </TouchableOpacity>

                  {/* Category-Specific Extra Specs */}
                  {(() => {
                    const selectedCatObj = categories.find(c => c.id === addCategory);
                    const isAnimal = selectedCatObj && selectedCatObj.section === 'animals';
                    const isProduct = selectedCatObj && selectedCatObj.section === 'products';
                    const isService = selectedCatObj && selectedCatObj.section === 'services';

                    if (isAnimal) return (
                      <View>
                        <Text style={[styles.addFieldLabel, { marginTop: 8, fontSize: 14, borderBottomWidth: 1, borderBottomColor: '#F0F3EF', paddingBottom: 6, marginBottom: 10 }]}>Hayvon ma'lumotlari</Text>
                        {/* Jinsi */}
                        <Text style={styles.addFieldLabel}>Jinsi</Text>
                        <View style={styles.chipsRow}>
                          {['Erkak','Urg\'ochi'].map(g => (
                            <TouchableOpacity key={g} style={[styles.chipButton, addSpecGender === g && styles.chipButtonActive]} onPress={() => setAddSpecGender(g)} activeOpacity={0.8}>
                              <Text style={[styles.chipText, addSpecGender === g && styles.chipTextActive]}>{g}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                        {/* Yoshi */}
                        <Text style={styles.addFieldLabel}>Yoshi</Text>
                        <TextInput style={styles.addInputField} placeholder="Masalan: 3 yosh" placeholderTextColor="#A3B1A0" value={addSpecAge} onChangeText={setAddSpecAge} />
                        {/* Zoti */}
                        <Text style={styles.addFieldLabel}>Zoti</Text>
                        <TextInput style={styles.addInputField} placeholder="Masalan: Golishten, Edilbay" placeholderTextColor="#A3B1A0" value={addSpecBreed} onChangeText={setAddSpecBreed} />
                        {/* Holati */}
                        <Text style={styles.addFieldLabel}>Holati</Text>
                        <View style={styles.chipsRow}>
                          {["Sog'lom",'Kasal','Davolanmoqda'].map(h => (
                            <TouchableOpacity key={h} style={[styles.chipButton, addSpecHealth === h && styles.chipButtonActive]} onPress={() => setAddSpecHealth(h)} activeOpacity={0.8}>
                              <Text style={[styles.chipText, addSpecHealth === h && styles.chipTextActive]}>{h}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                        {/* Sutdorligi - only for qoramol/echki */}
                        {(addCategory === 'qoramol' || addCategory === 'echkilar') && (
                          <>
                            <Text style={styles.addFieldLabel}>Sutdorligi (l/kun)</Text>
                            <TextInput style={styles.addInputField} placeholder="Masalan: 20-25 l/kun" placeholderTextColor="#A3B1A0" value={addSpecMilk} onChangeText={setAddSpecMilk} keyboardType="default" />
                          </>
                        )}
                        {/* Og'irligi */}
                        <Text style={styles.addFieldLabel}>Og'irligi (kg)</Text>
                        <TextInput style={styles.addInputField} placeholder="Masalan: 450-500 kg" placeholderTextColor="#A3B1A0" value={addSpecWeight} onChangeText={setAddSpecWeight} />
                        {/* Emlangan */}
                        <Text style={styles.addFieldLabel}>Emlangan (vaksinatsiya)</Text>
                        <View style={styles.chipsRow}>
                          {['Ha', "Yo'q"].map(v => (
                            <TouchableOpacity key={v} style={[styles.chipButton, addSpecVaccine === v && styles.chipButtonActive]} onPress={() => setAddSpecVaccine(v)} activeOpacity={0.8}>
                              <Text style={[styles.chipText, addSpecVaccine === v && styles.chipTextActive]}>{v}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    );

                    if (isService) return (
                      <View>
                        <Text style={[styles.addFieldLabel, { marginTop: 8, fontSize: 14, borderBottomWidth: 1, borderBottomColor: '#F0F3EF', paddingBottom: 6, marginBottom: 10 }]}>Xizmat ma'lumotlari</Text>
                        <Text style={styles.addFieldLabel}>Xizmat turi</Text>
                        <TextInput style={styles.addInputField} placeholder="Masalan: Uy sharoitida muolaja" placeholderTextColor="#A3B1A0" value={addSpecService} onChangeText={setAddSpecService} />
                        <Text style={styles.addFieldLabel}>Tajriba (yil)</Text>
                        <TextInput style={styles.addInputField} placeholder="Masalan: 5 yil" placeholderTextColor="#A3B1A0" value={addSpecExp} onChangeText={setAddSpecExp} />
                      </View>
                    );

                    if (isProduct) return (
                      <View>
                        <Text style={[styles.addFieldLabel, { marginTop: 8, fontSize: 14, borderBottomWidth: 1, borderBottomColor: '#F0F3EF', paddingBottom: 6, marginBottom: 10 }]}>Mahsulot ma'lumotlari</Text>
                        <Text style={styles.addFieldLabel}>Navi / Turi</Text>
                        <TextInput style={styles.addInputField} placeholder="Masalan: Premium yem" placeholderTextColor="#A3B1A0" value={addSpecBreed} onChangeText={setAddSpecBreed} />
                        <Text style={styles.addFieldLabel}>Hajm / Og'irligi</Text>
                        <TextInput style={styles.addInputField} placeholder="Masalan: 20 kg, 1 litr" placeholderTextColor="#A3B1A0" value={addSpecVolume} onChangeText={setAddSpecVolume} />
                      </View>
                    );

                    return null;
                  })()}

                  {/* Aloqa turi */}
                  <Text style={[styles.addFieldLabel, { marginTop: 16, fontSize: 14, borderBottomWidth: 1, borderBottomColor: '#F0F3EF', paddingBottom: 6, marginBottom: 10 }]}>Aloqa ma'lumotlari</Text>
                  
                  {/* Ismi */}
                  <Text style={styles.addFieldLabel}>Ismingiz *</Text>
                  <TextInput 
                    style={styles.addInputField}
                    placeholder="Masalan: Asror"
                    placeholderTextColor="#A3B1A0"
                    value={addContactName}
                    onChangeText={setAddContactName}
                  />

                  {/* Telefon raqami */}
                  <Text style={styles.addFieldLabel}>Telefon raqami *</Text>
                  <View style={styles.addPriceInputWrapper}>
                    <Text style={styles.addPriceSuffix}>+998 </Text>
                    <TextInput 
                      style={styles.addPriceInputField}
                      placeholder="90 123 45 67"
                      placeholderTextColor="#A3B1A0"
                      keyboardType="phone-pad"
                      value={addContactPhone}
                      onChangeText={setAddContactPhone}
                    />
                  </View>

                  {/* Email */}
                  <Text style={styles.addFieldLabel}>Email manzil *</Text>
                  <TextInput 
                    style={styles.addInputField}
                    placeholder="example@mail.com"
                    placeholderTextColor="#A3B1A0"
                    keyboardType="email-address"
                    value={addContactEmail}
                    onChangeText={setAddContactEmail}
                    autoCapitalize="none"
                  />

                  {/* Telegram */}
                  <Text style={styles.addFieldLabel}>Telegram username (majburiy emas)</Text>
                  <TextInput 
                    style={styles.addInputField}
                    placeholder="Masalan: @zoovita_admin"
                    placeholderTextColor="#A3B1A0"
                    value={addContactTelegram}
                    onChangeText={setAddContactTelegram}
                    autoCapitalize="none"
                  />

                  {/* Dostavka xizmati - faqat hayvon va mahsulot kategoriyalari uchun */}
                  {!['veterinariya','grooming','transport','uruglantirish','boshqa_xizmat'].includes(addCategory) && (
                    <>
                      <Text style={[styles.addFieldLabel, { marginTop: 16 }]}>Yetkazib berish (Dostavka) xizmati</Text>
                      <View style={styles.chipsRow}>
                        <TouchableOpacity 
                          style={[styles.chipButton, addDelivery === true && styles.chipButtonActive]}
                          onPress={() => setAddDelivery(true)}
                          activeOpacity={0.8}
                        >
                          <Text style={[styles.chipText, addDelivery === true && styles.chipTextActive]}>Bor</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.chipButton, addDelivery === false && styles.chipButtonActive]}
                          onPress={() => setAddDelivery(false)}
                          activeOpacity={0.8}
                        >
                          <Text style={[styles.chipText, addDelivery === false && styles.chipTextActive]}>Yo'q</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}

                  {/* Buttons Row */}
                  <View style={styles.actionButtonsRow}>
                    <TouchableOpacity 
                      style={styles.backStepBtn}
                      activeOpacity={0.8}
                      onPress={() => setAddStep(1)}
                    >
                      <Text style={styles.backStepBtnText}>Orqaga</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.submitStepBtn}
                      activeOpacity={0.8}
                      onPress={handleAddSubmit}
                    >
                      <Text style={styles.submitStepBtnText}>Davom etish</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* STEP 3: TEKSHIRISH (PREVIEW) */}
              {addStep === 3 && (
                <View>
                  <Text style={styles.previewSectionTitle}>E'lon ko'rinishi (Preview)</Text>
                  
                  {/* Premium-looking Listing Card Preview */}
                  <View style={styles.previewCard}>
                    <View style={styles.previewImageContainer}>
                      <Image 
                        source={{ uri: addPhotos.length > 0 ? addPhotos[0] : 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=400' }} 
                        style={styles.previewImage} 
                      />
                    </View>
                    <View style={styles.previewDetails}>
                      <Text style={styles.previewCategoryText}>{getFormattedCategoryName(addCategory)}</Text>
                      <Text style={styles.previewTitleText}>{addTitle}</Text>
                      <Text style={styles.previewPriceText}>{addPrice.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, " ")} so'm</Text>
                      
                      <View style={styles.previewMetaRow}>
                        <View style={styles.previewMetaItem}>
                          <Feather name="map-pin" size={12} color="#7C8A79" />
                          <Text style={styles.previewMetaText}>{addLocation}</Text>
                        </View>
                        <View style={styles.previewMetaItem}>
                          <Feather name="calendar" size={12} color="#7C8A79" />
                          <Text style={styles.previewMetaText}>Hozirgina</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Summarized info */}
                  <View style={[styles.addForm, { marginTop: 16 }]}>
                    <Text style={styles.previewDetailsTitle}>E'lon tafsilotlari</Text>
                    
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Ism:</Text>
                      <Text style={styles.detailValue}>{addContactName}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Telefon:</Text>
                      <Text style={styles.detailValue}>+998 {addContactPhone}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Email:</Text>
                      <Text style={styles.detailValue}>{addContactEmail}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Telegram:</Text>
                      <Text style={styles.detailValue}>{addContactTelegram || "Kiritilmagan"}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Yetkazib berish:</Text>
                      <Text style={[styles.detailValue, { color: addDelivery ? '#3C8E2D' : '#FF5A5F' }]}>
                        {addDelivery ? "Mavjud (Bor)" : "Mavjud emas (Yo'q)"}
                      </Text>
                    </View>

                    <Text style={[styles.detailLabel, { marginTop: 12, marginBottom: 4 }]}>Tavsif:</Text>
                    <View style={styles.descPreviewBox}>
                      <Text style={styles.descPreviewText}>{addDesc || "Batafsil ma'lumot berilmagan."}</Text>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtonsRow}>
                      <TouchableOpacity 
                        style={styles.backStepBtn}
                        activeOpacity={0.8}
                        onPress={() => setAddStep(2)}
                      >
                        <Text style={styles.backStepBtnText}>Orqaga</Text>
                      </TouchableOpacity>

                      <TouchableOpacity 
                        style={styles.submitStepBtn}
                        activeOpacity={0.8}
                        onPress={handleAddSubmit}
                      >
                        <Text style={styles.submitStepBtnText}>E'lonni joylashtirish</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Bottom Category Selector Modal */}
            <Modal
              visible={showCategoryModal}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowCategoryModal(false)}
            >
              <View style={styles.addModalOverlay}>
                <View style={styles.addModalContent}>
                  <View style={styles.addModalHeader}>
                    <Text style={styles.addModalTitle}>Kategoriyani tanlang</Text>
                    <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                      <Feather name="x" size={22} color="#15330F" />
                    </TouchableOpacity>
                  </View>
                  <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
                    {/* Animals Group */}
                    <Text style={styles.modalSectionHeader}>Hayvonlar</Text>
                    {categories.filter(c => c.section === 'animals').map((cat) => (
                      <TouchableOpacity
                        key={cat.id}
                        style={styles.addModalItem}
                        onPress={() => {
                          setAddCategory(cat.id);
                          setShowCategoryModal(false);
                        }}
                      >
                        <View style={styles.addModalItemLeft}>
                          <View style={[styles.addModalItemIconWrapper, { backgroundColor: cat.color || '#F0F3EF' }]}>
                            {renderCategoryItemIcon(cat)}
                          </View>
                          <Text style={[
                            styles.addModalItemText,
                            addCategory === cat.id && styles.addModalItemTextActive
                          ]}>
                            {cat.name}
                          </Text>
                        </View>
                        {addCategory === cat.id && (
                          <Feather name="check" size={18} color="#3C8E2D" />
                        )}
                      </TouchableOpacity>
                    ))}

                    {/* Products Group */}
                    <Text style={styles.modalSectionHeader}>Mahsulotlar</Text>
                    {categories.filter(c => c.section === 'products').map((cat) => (
                      <TouchableOpacity
                        key={cat.id}
                        style={styles.addModalItem}
                        onPress={() => {
                          setAddCategory(cat.id);
                          setShowCategoryModal(false);
                        }}
                      >
                        <View style={styles.addModalItemLeft}>
                          <View style={[styles.addModalItemIconWrapper, { backgroundColor: cat.color || '#F0F3EF' }]}>
                            {renderCategoryItemIcon(cat)}
                          </View>
                          <Text style={[
                            styles.addModalItemText,
                            addCategory === cat.id && styles.addModalItemTextActive
                          ]}>
                            {cat.name}
                          </Text>
                        </View>
                        {addCategory === cat.id && (
                          <Feather name="check" size={18} color="#3C8E2D" />
                        )}
                      </TouchableOpacity>
                    ))}

                    {/* Services Group */}
                    <Text style={styles.modalSectionHeader}>Xizmatlar</Text>
                    {categories.filter(c => c.section === 'services').map((cat) => (
                      <TouchableOpacity
                        key={cat.id}
                        style={styles.addModalItem}
                        onPress={() => {
                          setAddCategory(cat.id);
                          setShowCategoryModal(false);
                        }}
                      >
                        <View style={styles.addModalItemLeft}>
                          <View style={[styles.addModalItemIconWrapper, { backgroundColor: cat.color || '#F0F3EF' }]}>
                            {renderCategoryItemIcon(cat)}
                          </View>
                          <Text style={[
                            styles.addModalItemText,
                            addCategory === cat.id && styles.addModalItemTextActive
                          ]}>
                            {cat.name}
                          </Text>
                        </View>
                        {addCategory === cat.id && (
                          <Feather name="check" size={18} color="#3C8E2D" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </Modal>

            {/* Bottom Location Selector Modal */}
            <Modal
              visible={showLocationModal}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowLocationModal(false)}
            >
              <View style={styles.addModalOverlay}>
                <View style={styles.addModalContent}>
                  <View style={styles.addModalHeader}>
                    <Text style={styles.addModalTitle}>Hududni tanlang</Text>
                    <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                      <Feather name="x" size={22} color="#15330F" />
                    </TouchableOpacity>
                  </View>
                  <ScrollView style={{ maxHeight: 350 }} showsVerticalScrollIndicator={false}>
                    {UZBEKISTAN_REGIONS.map((region) => (
                      <TouchableOpacity
                        key={region}
                        style={styles.addModalItem}
                        onPress={() => {
                          setSelectedViloyat(region);
                          setShowLocationModal(false);
                          setShowTumanModal(true);
                        }}
                      >
                        <Text style={[
                          styles.addModalItemText,
                          selectedViloyat === region && styles.addModalItemTextActive
                        ]}>
                          {region}
                        </Text>
                        {selectedViloyat === region && (
                          <Feather name="check" size={18} color="#3C8E2D" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </Modal>

            {/* Bottom District Selector Modal */}
            <Modal
              visible={showTumanModal}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowTumanModal(false)}
            >
              <View style={styles.addModalOverlay}>
                <View style={styles.addModalContent}>
                  <View style={styles.addModalHeader}>
                    <Text style={styles.addModalTitle}>{selectedViloyat || 'Tuman'} tumanini tanlang</Text>
                    <TouchableOpacity onPress={() => setShowTumanModal(false)}>
                      <Feather name="x" size={22} color="#15330F" />
                    </TouchableOpacity>
                  </View>
                  <ScrollView style={{ maxHeight: 350 }} showsVerticalScrollIndicator={false}>
                    {selectedViloyat && UZBEKISTAN_DISTRICTS[selectedViloyat] ? (
                      UZBEKISTAN_DISTRICTS[selectedViloyat].map((tuman) => {
                        const fullLoc = `${selectedViloyat}, ${tuman}`;
                        return (
                          <TouchableOpacity
                            key={tuman}
                            style={styles.addModalItem}
                            onPress={() => {
                              setAddLocation(fullLoc);
                              setShowTumanModal(false);
                            }}
                          >
                            <Text style={[
                              styles.addModalItemText,
                              addLocation === fullLoc && styles.addModalItemTextActive
                            ]}>
                              {tuman}
                            </Text>
                            {addLocation === fullLoc && (
                              <Feather name="check" size={18} color="#3C8E2D" />
                            )}
                          </TouchableOpacity>
                        );
                      })
                    ) : (
                      <Text style={{ textAlign: 'center', padding: 20, color: '#7C8A79' }}>Avval viloyatni tanlang</Text>
                    )}
                  </ScrollView>
                </View>
              </View>
            </Modal>


          </KeyboardAvoidingView>
        )}

        <DashboardTabBar 
          activeTab={dashboardTab} 
          onSelectTab={(tab) => {
            if (!isLoggedIn && (tab === 'add' || tab === 'profile' || tab === 'favorites')) {
              navigateTo('login');
              return;
            }
            setDashboardTab(tab);
            setShowListings(false);
            setShowSubcategories(false);
            setSelectedSection(null);
            setSubcatSearchQuery('');
          }} 
        />

        {/* ========== LISTING DETAIL OVERLAY SCREEN ========== */}
        {selectedListing && (() => {
          const listing = selectedListing;
          const isFav = !!favorites[listing.id];

          // Generate gallery images (main + variants from gallery stock)
          const galleryImages = (listing.images && listing.images.length > 0) 
            ? listing.images 
            : ['https://via.placeholder.com/400'];

          // Specs
          const specs = [
            { icon: 'calendar', label: 'Yoshi', value: '3 yosh' },
            { icon: 'droplet', label: 'Sutdorligi', value: '20-25 l/kun' },
            { icon: 'check-circle', label: 'Emlangan', value: 'Ha' },
          ];

          return (
            <View style={styles.detailOverlay}>
              <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={styles.detailHeader}>
                  <TouchableOpacity
                    style={styles.detailHeaderBtn}
                    activeOpacity={0.8}
                    onPress={() => setSelectedListing(null)}
                  >
                    <Feather name="arrow-left" size={22} color="#15330F" />
                  </TouchableOpacity>
                  <Text style={styles.detailHeaderTitle}>E'lon tafsiloti</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      style={styles.detailHeaderBtn}
                      activeOpacity={0.8}
                      onPress={() => toggleFavorite(listing.id)}
                    >
                      <Ionicons
                        name={isFav ? 'heart' : 'heart-outline'}
                        size={22}
                        color={isFav ? '#EA4335' : '#15330F'}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.detailHeaderBtn} 
                      activeOpacity={0.8}
                      onPress={async () => {
                        try {
                          await Share.share({
                            message: `Zoovita ilovasida ushbu e'lonni ko'ring: ${listing.title} - ${listing.price}\nBatafsil: https://zoovita.uz/ad/${listing.id}`
                          });
                        } catch (error) {
                          Alert.alert("Xatolik", "Ulashishda xatolik yuz berdi");
                        }
                      }}
                    >
                      <Feather name="share-2" size={20} color="#15330F" />
                    </TouchableOpacity>
                  </View>
                </View>

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                  {/* Main Gallery Image */}
                  <View style={styles.detailGalleryWrapper}>
                    <Image
                      source={{ uri: galleryImages[detailActiveImageIndex] }}
                      style={styles.detailMainImage}
                      resizeMode="cover"
                    />
                    {/* Tag badge */}
                    {listing.tag ? (
                      <View style={[styles.detailTagBadge,
                        listing.tag === 'Top' ? styles.detailTagTop : styles.detailTagYangi
                      ]}>
                        <Text style={styles.detailTagText}>{listing.tag}</Text>
                      </View>
                    ) : null}
                    {/* Photo counter */}
                    <View style={styles.detailPhotoBadge}>
                      <Feather name="camera" size={12} color="#FFFFFF" />
                      <Text style={styles.detailPhotoBadgeText}> {detailActiveImageIndex + 1}/{galleryImages.length}</Text>
                    </View>
                  </View>

                  {/* Thumbnail Strip */}
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.detailThumbnailsContainer}
                  >
                    {galleryImages.map((img, idx) => {
                      const isActive = idx === detailActiveImageIndex;
                      const isExtra = idx >= 5;
                      if (isExtra && idx > 5) return null;
                      return (
                        <TouchableOpacity
                          key={idx}
                          activeOpacity={0.85}
                          onPress={() => setDetailActiveImageIndex(idx)}
                          style={[styles.detailThumb, isActive && styles.detailThumbActive]}
                        >
                          {isExtra && galleryImages.length > 6 ? (
                            <View style={styles.detailThumbMore}>
                              <Text style={styles.detailThumbMoreText}>+{galleryImages.length - 5}</Text>
                            </View>
                          ) : (
                            <Image source={{ uri: img }} style={styles.detailThumbImage} />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>

                  <View style={styles.detailBody}>
                    {/* Title */}
                    <Text style={styles.detailTitle}>{listing.title}</Text>

                    {/* Location row */}
                    <View style={styles.detailLocationRow}>
                      <Feather name="map-pin" size={14} color="#7C8A79" />
                      <Text style={styles.detailLocationText}>{listing.location}</Text>
                    </View>

                    {/* Quick Attribute Chips */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.detailChipsRow}>
                      <View style={[styles.detailChip, { backgroundColor: '#FFF0F0' }]}>
                        <Ionicons name={listing.gender === 'female' ? 'female' : 'male'} size={12} color="#E91E63" />
                        <Text style={[styles.detailChipText, { color: '#E91E63' }]}>{listing.gender === 'female' ? 'Sutdor' : 'Erkak'}</Text>
                      </View>
                      <View style={[styles.detailChip, { backgroundColor: '#F0FAF0' }]}>
                        <Feather name="calendar" size={12} color="#3C8E2D" />
                        <Text style={[styles.detailChipText, { color: '#3C8E2D' }]}>3 yosh</Text>
                      </View>
                      <View style={[styles.detailChip, { backgroundColor: '#E8F7FF' }]}>
                        <Feather name="droplet" size={12} color="#1E88E5" />
                        <Text style={[styles.detailChipText, { color: '#1E88E5' }]}>Sut: 20-25 l/kun</Text>
                      </View>
                      <View style={[styles.detailChip, { backgroundColor: '#F5F5F5' }]}>
                        <Feather name="anchor" size={12} color="#7C8A79" />
                        <Text style={[styles.detailChipText, { color: '#7C8A79' }]}>450-500 kg</Text>
                      </View>
                    </ScrollView>

                    {/* Price Block */}
                    <View style={styles.detailPriceBlock}>
                      <View style={styles.detailPriceRow}>
                        <Text style={styles.detailPrice}>{listing.price}</Text>
                        <View style={styles.detailPriceChip}>
                          <Text style={styles.detailPriceChipText}>Kelishiladi</Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <Feather name="info" size={12} color="#A3B1A0" />
                        <Text style={styles.detailPriceUpdated}> Narx oxirgi marta {(listing.created_at ? new Date(listing.created_at).toLocaleTimeString('uz-UZ', {hour: '2-digit', minute:'2-digit'}) : '')} da yangilangan</Text>
                      </View>
                    </View>

                    {/* Seller Card */}
                    {!(listing.user_id === userProfileId || listing.isUserOwnListing) && (
                      <View style={styles.detailSellerCard}>
                        <View style={styles.detailSellerTop}>
                          <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                              <Text style={styles.detailSellerName}>{listing.seller ? listing.seller.name : listing.contact_name}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                              <View style={styles.detailSellerOnlineDot} />
                              <Text style={styles.detailSellerStatus}>Faol</Text>
                            </View>
                          </View>
                          <TouchableOpacity 
                            style={styles.detailProfileBtn} 
                            activeOpacity={0.85}
                            onPress={() => setSelectedSeller({
                              id: listing.user_id,
                              name: listing.seller ? listing.seller.name : listing.contact_name,
                              phone: listing.seller ? listing.seller.phone : listing.contact_phone,
                              avatar: 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
                            })}
                          >
                            <Text style={styles.detailProfileBtnText}>Profilga o'tish</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    {/* Description */}
                    <View style={styles.detailSection}>
                      <View style={styles.detailSectionHeader}>
                        <Feather name="file-text" size={18} color="#3C8E2D" />
                        <Text style={styles.detailSectionTitle}>Tavsif</Text>
                      </View>
                      <Text style={styles.detailDescText}>
                        {listing.description ? listing.description : "Batafsil ma'lumot berilmagan."}
                      </Text>
                    </View>

                    {/* Specifications Grid */}
                    <View style={styles.detailSection}>
                      <View style={styles.detailSpecsGrid}>
                        {specs.map((spec, i) => (
                          <View key={i} style={styles.detailSpecItem}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                              <Feather name={spec.icon} size={14} color="#7C8A79" />
                              <Text style={styles.detailSpecLabel}>{spec.label}</Text>
                            </View>
                            <Text style={styles.detailSpecValue}>{spec.value}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    {/* Location */}
                    <View style={[styles.detailSection, { marginBottom: 8 }]}>
                      <View style={styles.detailSectionHeader}>
                        <Feather name="map-pin" size={18} color="#3C8E2D" />
                        <Text style={styles.detailSectionTitle}>Joylashuv</Text>
                        <TouchableOpacity style={styles.detailMapBtn} activeOpacity={0.8}>
                          <Feather name="navigation" size={13} color="#3C8E2D" />
                          <Text style={styles.detailMapBtnText}>Xaritada ko'rish</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.detailLocationFullText}>{listing.location}</Text>
                    </View>

                    {/* O'xshash e'lonlar */}
                    {(() => {
                      const similar = ads.filter(l => l.id !== listing.id).slice(0, 5);
                      if (similar.length === 0) return null;
                      return (
                        <View style={styles.detailSimilarSection}>
                          <Text style={styles.detailSimilarTitle}>O'xshash e'lonlar</Text>
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.detailSimilarScroll}
                          >
                            {similar.map((item) => {
                              const simFav = !!favorites[item.id];
                              return (
                                <TouchableOpacity
                                  key={item.id}
                                  style={styles.detailSimilarCard}
                                  activeOpacity={0.9}
                                  onPress={() => handleListingClick(item)}
                                >
                                  {/* Image */}
                                  <View style={styles.detailSimilarImgWrapper}>
                                    <Image source={{ uri: (item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/400') }} style={styles.detailSimilarImg} />
                                    {item.tag ? (
                                      <View style={[styles.detailSimilarTag,
                                        item.tag === 'Top' ? { backgroundColor: '#FF8C00' } : { backgroundColor: '#3C8E2D' }
                                      ]}>
                                        <Text style={styles.detailSimilarTagText}>{item.tag}</Text>
                                      </View>
                                    ) : null}
                                    <TouchableOpacity
                                      style={styles.detailSimilarHeart}
                                      activeOpacity={0.8}
                                      onPress={() => toggleFavorite(item.id)}
                                    >
                                      <Ionicons
                                        name={simFav ? 'heart' : 'heart-outline'}
                                        size={16}
                                        color={simFav ? '#EA4335' : '#7C8A79'}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  {/* Info */}
                                  <View style={styles.detailSimilarInfo}>
                                    <Text style={styles.detailSimilarItemTitle} numberOfLines={1}>{item.title}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 }}>
                                      <Feather name="map-pin" size={10} color="#A3B1A0" />
                                      <Text style={styles.detailSimilarLocation} numberOfLines={1}>{item.location}</Text>
                                    </View>
                                    <Text style={styles.detailSimilarPrice}>{item.price}</Text>
                                  </View>
                                </TouchableOpacity>
                              );
                            })}
                          </ScrollView>
                        </View>
                      );
                    })()}
                  </View>
                </ScrollView>

                {/* Sticky Bottom Action Bar */}
                {!(listing.user_id === userProfileId || listing.isUserOwnListing) && (
                  <View style={styles.detailBottomBar}>
                    <TouchableOpacity 
                      style={styles.detailChatBtn} 
                      activeOpacity={0.85}
                      onPress={async () => {
                        await openChat(listing);
                      }}
                    >
                      <Feather name="message-square" size={18} color="#3C8E2D" />
                      <Text style={styles.detailChatBtnText}>Xabar yozish</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.detailCallBtn} 
                      activeOpacity={0.85}
                      onPress={() => {
                        if (listing.contact_phone) {
                          Linking.openURL(`tel:${listing.contact_phone}`);
                        } else {
                          Alert.alert("Xatolik", "Telefon raqami kiritilmagan");
                        }
                      }}
                    >
                      <Feather name="phone" size={18} color="#FFFFFF" />
                      <Text style={styles.detailCallBtnText}>Qo'ng'iroq qilish</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </SafeAreaView>
            </View>
          );
        })()}

        {/* ========== SELLER PROFILE OVERLAY SCREEN ========== */}
        {selectedSeller && (() => {
          const seller = selectedSeller;
          const sellerAds = ads.filter(ad => ad.user_id === seller.id);

          return (
            <View style={styles.detailOverlay}>
              <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F3F0' }}>
                <View style={styles.detailHeader}>
                  <TouchableOpacity
                    style={styles.detailHeaderBtn}
                    activeOpacity={0.8}
                    onPress={() => setSelectedSeller(null)}
                  >
                    <Feather name="arrow-left" size={22} color="#15330F" />
                  </TouchableOpacity>
                  <Text style={styles.detailHeaderTitle}>Sotuvchi profili</Text>
                  <View style={{ width: 40 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                  <View style={[styles.profileSummaryCard, { margin: 16, marginTop: 8, overflow: 'hidden', padding: 0 }]}>
                    <View style={{ height: 80, backgroundColor: '#3C8E2D', width: '100%', position: 'absolute', top: 0 }} />
                    <View style={{ alignItems: 'center', paddingTop: 30, paddingBottom: 24, paddingHorizontal: 16 }}>
                      <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFF', padding: 4, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }}>
                        <Image source={{ uri: seller.avatar || 'https://cdn-icons-png.flaticon.com/512/847/847969.png' }} style={{ width: '100%', height: '100%', borderRadius: 50 }} />
                      </View>
                      <Text style={{ fontSize: 22, fontWeight: '700', color: '#15330F', marginTop: 12 }}>{seller.name}</Text>
                      <Text style={{ fontSize: 15, color: '#7C8A79', marginTop: 4 }}>{seller.phone || 'Telefon kiritilmagan'}</Text>
                      
                      <View style={{ flexDirection: 'row', marginTop: 24, width: '100%', justifyContent: 'space-around', backgroundColor: '#F9FAF9', paddingVertical: 12, borderRadius: 12 }}>
                        <View style={{ alignItems: 'center' }}>
                          <Text style={{ fontSize: 18, fontWeight: '700', color: '#15330F' }}>{sellerAds.length}</Text>
                          <Text style={{ fontSize: 12, color: '#7C8A79', marginTop: 2 }}>Jami E'lonlar</Text>
                        </View>
                        <View style={{ width: 1, backgroundColor: '#E2E8E0', height: '100%' }} />
                        <View style={{ alignItems: 'center' }}>
                          <Text style={{ fontSize: 18, fontWeight: '700', color: '#15330F' }}>2026</Text>
                          <Text style={{ fontSize: 12, color: '#7C8A79', marginTop: 2 }}>A'zo bo'lgan</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
                    <Text style={styles.profileSectionTitle}>Sotuvchining barcha e'lonlari ({sellerAds.length})</Text>
                    
                    {sellerAds.length === 0 ? (
                      <View style={styles.emptyStateContainer}>
                        <Feather name="box" size={48} color="#A3B1A0" style={{ marginBottom: 12 }} />
                        <Text style={styles.emptyStateTitle}>E'lonlar topilmadi</Text>
                      </View>
                    ) : (
                      <View style={styles.favGrid}>
                        {sellerAds.map((item) => (
                          <TouchableOpacity 
                            key={item.id} 
                            style={styles.favCard}
                            activeOpacity={0.8}
                            onPress={() => handleListingClick(item)}
                          >
                            <View style={styles.favCardImageWrapper}>
                              <Image source={{ uri: (item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/400') }} style={styles.favCardImage} />
                            </View>
                            <View style={styles.favCardContent}>
                              <Text style={styles.favCardTitle} numberOfLines={1}>{item.title}</Text>
                              <Text style={styles.favCardPrice} numberOfLines={1}>{item.price}</Text>
                              <View style={styles.favCardMetaRow}>
                                <Feather name="map-pin" size={11} color="#7C8A79" />
                                <Text style={styles.favCardMetaText} numberOfLines={1}>{item.location}</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </ScrollView>
              </SafeAreaView>
            </View>
          );
        })()}

        {/* ========== PRODUCT DETAIL OVERLAY SCREEN ========== */}
        {selectedProduct && (() => {
          const product = selectedProduct;
          const details = {
            description: product.description || "Batafsil ma'lumot berilmagan.",
            specs: [
              { icon: "map-pin", label: "Manzil", value: product.location || "Ko'rsatilmagan" },
              { icon: "phone", label: "Aloqa u-n", value: product.contact_phone || "Ko'rsatilmagan" },
              { icon: "truck", label: "Yetkazib berish", value: product.has_delivery ? "Mavjud (Bor)" : "Yo'q" },
            ]
          };

          return (
            <View style={styles.detailOverlay}>
              <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={styles.detailHeader}>
                  <TouchableOpacity
                    style={styles.detailHeaderBtn}
                    activeOpacity={0.8}
                    onPress={() => setSelectedProduct(null)}
                  >
                    <Feather name="arrow-left" size={22} color="#15330F" />
                  </TouchableOpacity>
                  <Text style={styles.detailHeaderTitle}>Mahsulot tafsiloti</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity style={styles.detailHeaderBtn} activeOpacity={0.8}>
                      <Feather name="share-2" size={20} color="#15330F" />
                    </TouchableOpacity>
                  </View>
                </View>

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                  {/* Main Product Image */}
                  <View style={styles.detailGalleryWrapper}>
                    <Image
                      source={{ uri: (product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/400') }}
                      style={styles.detailMainImage}
                      resizeMode="cover"
                    />
                    {/* Discount badge */}
                    {product.discount ? (
                      <View style={[styles.detailTagBadge, { backgroundColor: '#EA4335' }]}>
                        <Text style={styles.detailTagText}>{product.discount} CHEGIRMA</Text>
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.detailBody}>
                    {/* Title */}
                    <Text style={styles.detailTitle}>{product.title}</Text>

                    {/* Price Block */}
                    <View style={styles.detailPriceBlock}>
                      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
                        <Text style={styles.detailPrice}>{product.price}</Text>
                        {product.oldPrice ? (
                          <Text style={[styles.detailPriceUpdated, { fontSize: 16, textDecorationLine: 'line-through', color: '#7C8A79' }]}>
                            {product.oldPrice}
                          </Text>
                        ) : null}
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                        <Feather name="shield" size={14} color="#3C8E2D" style={{ marginRight: 4 }} />
                        <Text style={[styles.detailPriceUpdated, { color: '#3C8E2D', fontWeight: '600' }]}>
                          Zoovita Kafolatlangan mahsulot
                        </Text>
                      </View>
                    </View>

                    {/* Description */}
                    <View style={styles.detailSection}>
                      <View style={styles.detailSectionHeader}>
                        <Feather name="file-text" size={18} color="#3C8E2D" />
                        <Text style={styles.detailSectionTitle}>Batafsil ma'lumot</Text>
                      </View>
                      <Text style={styles.detailDescText}>
                        {details.description}
                      </Text>
                    </View>

                    {/* Specifications Grid */}
                    <View style={styles.detailSection}>
                      <View style={styles.detailSpecsGrid}>
                        {details.specs.map((spec, i) => (
                          <View key={i} style={styles.detailSpecItem}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                              <Feather name={spec.icon} size={14} color="#7C8A79" />
                              <Text style={styles.detailSpecLabel}>{spec.label}</Text>
                            </View>
                            <Text style={styles.detailSpecValue}>{spec.value}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    {/* Similar Products */}
                    <View style={styles.detailSimilarSection}>
                      <Text style={styles.detailSimilarTitle}>O'xshash mahsulotlar</Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.detailSimilarScroll}
                      >
                        {ads.filter(p => p.id !== product.id).map((item) => (
                          <TouchableOpacity
                            key={item.id}
                            style={styles.detailSimilarCard}
                            activeOpacity={0.9}
                            onPress={() => setSelectedProduct(item)}
                          >
                            <View style={styles.detailSimilarImgWrapper}>
                              <Image source={{ uri: (item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/400') }} style={styles.detailSimilarImg} />
                              <View style={[styles.detailSimilarTag, { backgroundColor: '#EA4335' }]}>
                                <Text style={styles.detailSimilarTagText}>{item.discount}</Text>
                              </View>
                            </View>
                            <View style={styles.detailSimilarInfo}>
                              <Text style={styles.detailSimilarItemTitle} numberOfLines={1}>{item.title}</Text>
                              <Text style={styles.detailSimilarPrice}>{item.price}</Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                </ScrollView>

                {/* Sticky Bottom Action Bar */}
                {!(product.user_id === userProfileId || product.isUserOwnListing) && (
                  <View style={styles.detailBottomBar}>
                    <TouchableOpacity 
                      style={styles.detailChatBtn} 
                      activeOpacity={0.85}
                      onPress={async () => {
                        await openChat(product);
                      }}
                    >
                      <Feather name="message-square" size={18} color="#3C8E2D" />
                      <Text style={styles.detailChatBtnText}>Xabar yozish</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.detailCallBtn, { backgroundColor: '#3C8E2D' }]} activeOpacity={0.85}>
                      <Feather name="phone" size={18} color="#FFFFFF" />
                      <Text style={styles.detailCallBtnText}>Qo'ng'iroq qilish</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </SafeAreaView>
            </View>
          );
        })()}

        {/* ========== AI CHAT OVERLAY SCREEN ========== */}
        {showAiChat && (() => {
          const handleSend = () => {
            if (!aiInput.trim()) return;
            const userMsg = { id: Date.now(), from: 'user', text: aiInput.trim() };
            const updated = [...aiMessages, userMsg];
            setAiMessages(updated);
            setAiInput('');

            // Simulate typing and AI response
            setTimeout(() => {
              let replyText = "Tushunmadim, iltimos hayvonlar parvarishi yoki veterinariya bo'yicha batafsilroq so'rang.";
              const txt = userMsg.text.toLowerCase();
              if (txt.includes('sigir') || txt.includes('sut')) {
                replyText = "Buning bir nechta sabablari bo'lishi mumkin:\n• Oziqlanish yetarli emas\n• Suv yetarli emas\n• Stress yoki harorat ta'siri\n• Vitamin va mineral yetishmovchiligi\n• Mastit (yallig'lanish)\n\nYuqoridagilarni tekshirib ko'ring. Agar davom etsa, veterinar chaqirish tavsiya etiladi.";
              } else if (txt.includes('salom') || txt.includes('assalomu alaykum')) {
                replyText = "Salom! Men Zoovita AI assistantiman.\nHayvonlaringiz haqida savol bering, men yordam beraman.";
              } else if (txt.includes('emlash') || txt.includes('privivka') || txt.includes('vaksina')) {
                replyText = "Hayvonlarni emlash jadvali juda muhim. Qoramollar uchun oqsim (yashur), quturish va kuydirgi (sibirskaya yazva)ga qarshi emlashlarni o'z vaqtida qilish lozim. Tuman veterinariya bo'limiga murojaat qiling.";
              } else if (txt.includes('yem') || txt.includes('oziqlantirish') || txt.includes('ovqat')) {
                replyText = "To'g'ri oziqlantirish sut va go'sht mahsuldorligini oshiradi. Ratsionda to'yimli yemlar, ko'k o'tlar, makka silos va yetarli miqdorda tuz/minerallar bo'lishi kerak.";
              }

              setAiMessages(prev => [...prev, { id: Date.now() + 1, from: 'ai', text: replyText }]);
            }, 600);
          };

          return (
            <View style={styles.aiChatOverlay}>
              <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              >
                <SafeAreaView style={{ flex: 1 }}>
                  {/* Header */}
                  <View style={styles.aiChatHeader}>
                    <TouchableOpacity
                      style={styles.detailHeaderBtn}
                      activeOpacity={0.8}
                      onPress={() => setShowAiChat(false)}
                    >
                      <Feather name="arrow-left" size={22} color="#15330F" />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, marginLeft: 8 }}>
                      <Feather name="cpu" size={22} color="#3C8E2D" />
                      <Text style={styles.aiChatHeaderTitle}>AI Maslahat</Text>
                    </View>
                  </View>

                  {/* Subheader / Status Bar */}
                  <View style={styles.aiChatSubHeader}>
                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#E6F4EA', justifyContent: 'center', alignItems: 'center' }}>
                      <Feather name="cpu" size={22} color="#3C8E2D" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.aiChatBotName}>Zoovita AI</Text>
                      <Text style={styles.aiChatBotStatus}>Sizning aqlli yordamchingiz</Text>
                    </View>
                  </View>

                  {/* Chat Messages */}
                  <ScrollView 
                    style={{ flex: 1, padding: 16 }}
                    contentContainerStyle={{ paddingBottom: 24 }}
                    showsVerticalScrollIndicator={false}
                  >
                    {aiMessages.map((msg) => {
                      const isUser = msg.from === 'user';
                      return (
                        <View key={msg.id} style={[styles.aiMessageRow, isUser ? styles.aiMessageRowUser : styles.aiMessageRowBot]}>
                          <View style={[styles.aiMessageBubble, isUser ? styles.aiMessageBubbleUser : styles.aiMessageBubbleBot]}>
                            <Text style={[styles.aiMessageText, isUser ? styles.aiMessageTextUser : styles.aiMessageTextBot]}>
                              {msg.text}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>

                  {/* Keyboard Input Bar */}
                  <View style={styles.aiChatInputContainer}>
                    <TextInput
                      style={styles.aiChatInput}
                      placeholder="Savolingizni yozing..."
                      placeholderTextColor="#A3B1A0"
                      value={aiInput}
                      onChangeText={setAiInput}
                    />
                    <TouchableOpacity
                      style={styles.aiChatSendBtn}
                      activeOpacity={0.8}
                      onPress={handleSend}
                    >
                      <Feather name="send" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </SafeAreaView>
              </KeyboardAvoidingView>
            </View>
          );
        })()}

        {/* ========== NOTIFICATION OVERLAY SCREEN ========== */}
        {showNotifications && (() => {
          const handleMarkAllRead = async () => {
            const token = await AsyncStorage.getItem('userToken');
            fetch('https://api.zoovita.uz/api/v1/notifications/read-all', {
              method: 'PUT',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const updated = notificationsList.map(n => ({ ...n, is_read: true }));
            setNotificationsList(updated);
            setUnreadNotificationsCount(0);
          };

          const handleToggleRead = async (id) => {
            const n = notificationsList.find(x => x.id === id);
            if (!n || n.is_read) return; // Only allow marking as read
            
            const token = await AsyncStorage.getItem('userToken');
            fetch(`https://api.zoovita.uz/api/v1/notifications/${id}/read`, {
              method: 'PUT',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const updated = notificationsList.map(item => {
              if (item.id === id) {
                return { ...item, is_read: true };
              }
              return item;
            });
            setNotificationsList(updated);
            setUnreadNotificationsCount(prev => Math.max(0, prev - 1));
          };

          return (
            <View style={styles.detailOverlay}>
              <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={styles.detailHeader}>
                  <TouchableOpacity
                    style={styles.detailHeaderBtn}
                    activeOpacity={0.8}
                    onPress={() => setShowNotifications(false)}
                  >
                    <Feather name="arrow-left" size={22} color="#15330F" />
                  </TouchableOpacity>
                  <Text style={styles.detailHeaderTitle}>Bildirishnomalar</Text>
                  <TouchableOpacity 
                    style={[styles.detailHeaderBtn, { width: 'auto', paddingHorizontal: 10 }]} 
                    activeOpacity={0.8}
                    onPress={handleMarkAllRead}
                  >
                    <Feather name="check-square" size={18} color="#3C8E2D" />
                  </TouchableOpacity>
                </View>

                {/* Notifications List */}
                <ScrollView 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ padding: 16 }}
                >
                  {notificationsList.length === 0 ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 }}>
                      <Feather name="bell-off" size={48} color="#A3B1A0" />
                      <Text style={{ fontSize: 16, color: '#7C8A79', marginTop: 12 }}>Bildirishnomalar mavjud emas</Text>
                    </View>
                  ) : (
                    notificationsList.map((item) => (
                      <TouchableOpacity 
                        key={item.id} 
                        style={[styles.notificationCard, !item.is_read && styles.notificationCardUnread]}
                        activeOpacity={0.85}
                        onPress={() => handleToggleRead(item.id)}
                      >
                        <View style={styles.notificationCardLeft}>
                          <View style={[styles.notificationIconBox, item.is_read ? { backgroundColor: '#F0F3F0' } : { backgroundColor: '#E6F4EA' }]}>
                            <Feather name="bell" size={18} color={item.is_read ? "#7C8A79" : "#3C8E2D"} />
                          </View>
                          {!item.is_read && <View style={styles.notificationDot} />}
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={[styles.notificationTitle, !item.is_read && { fontWeight: '700' }]}>{item.title}</Text>
                          <Text style={styles.notificationBody}>{item.message}</Text>
                          <Text style={styles.notificationTime}>{item.time}</Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </SafeAreaView>
            </View>
          );
        })()}

        {/* ========== FILTER MODAL ========== */}
        <Modal
          visible={showFilterModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowFilterModal(false)}
        >
          <View style={styles.filterModalOverlay}>
            <View style={styles.filterModalContent}>
              {/* Header */}
              <View style={styles.filterModalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Feather name="sliders" size={20} color="#3C8E2D" />
                  <Text style={styles.filterModalTitle}>E'lonlar filtri</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => setShowFilterModal(false)}
                  style={{ padding: 4 }}
                >
                  <Feather name="x" size={22} color="#15330F" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Category Grid Cards */}
                <Text style={styles.filterSectionTitle}>Kategoriya</Text>
                <View style={styles.filterCategoryGrid}>
                  {[
                    { id: 'all', name: 'Barchasi', icon: 'grid', color: '#E8F5E9', iconColor: '#3C8E2D' },
                    { id: 'animals', name: 'Hayvonlar', icon: 'cow', iconType: 'material-community', color: '#E6F4EA', iconColor: '#3C8E2D' },
                    { id: 'products', name: 'Mahsulotlar', icon: 'shopping-bag', color: '#FEF3D6', iconColor: '#F5A623' },
                    { id: 'services', name: 'Xizmatlar', icon: 'stethoscope', iconType: 'font-awesome', color: '#E3F2FD', iconColor: '#1E88E5' },
                  ].map(cat => {
                    const isActive = filterCategory === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[styles.filterCatCard, isActive && styles.filterCatCardActive]}
                        activeOpacity={0.8}
                        onPress={() => setFilterCategory(cat.id)}
                      >
                        <View style={[styles.filterCatIconWrapper, { backgroundColor: cat.color }]}>
                          {cat.iconType === 'material-community' ? (
                            <MaterialCommunityIcons name={cat.icon} size={20} color={cat.iconColor} />
                          ) : cat.iconType === 'font-awesome' ? (
                            <FontAwesome5 name={cat.icon} size={18} color={cat.iconColor} />
                          ) : (
                            <Feather name={cat.icon} size={20} color={cat.iconColor} />
                          )}
                        </View>
                        <Text style={[styles.filterCatCardText, isActive && styles.filterCatCardTextActive]}>
                          {cat.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Price Range */}
                <Text style={styles.filterSectionTitle}>Narx oralig'i (so'm)</Text>
                <View style={styles.filterPriceInputsRow}>
                  <View style={styles.filterInputWrapper}>
                    <Text style={styles.filterInputLabel}>Dan</Text>
                    <TextInput
                      style={styles.filterPriceInput}
                      placeholder="Masalan: 500k"
                      placeholderTextColor="#A3B1A0"
                      keyboardType="numeric"
                      value={filterMinPrice}
                      onChangeText={setFilterMinPrice}
                    />
                  </View>
                  <View style={styles.filterInputWrapper}>
                    <Text style={styles.filterInputLabel}>Gacham</Text>
                    <TextInput
                      style={styles.filterPriceInput}
                      placeholder="Masalan: 10M"
                      placeholderTextColor="#A3B1A0"
                      keyboardType="numeric"
                      value={filterMaxPrice}
                      onChangeText={setFilterMaxPrice}
                    />
                  </View>
                </View>

                {/* Price Shortcuts */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterShortcutsRow}>
                  {[
                    { label: '500k gacha', val: '500000' },
                    { label: '2M gacha', val: '2000000' },
                    { label: '5M gacha', val: '5000000' },
                    { label: '10M gacha', val: '10000000' },
                    { label: '20M gacha', val: '20000000' },
                  ].map((shortcut, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.filterShortcutChip}
                      onPress={() => {
                        setFilterMaxPrice(shortcut.val);
                      }}
                    >
                      <Text style={styles.filterShortcutText}>{shortcut.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Gender selection */}
                {['all', 'animals'].includes(filterCategory) && (
                  <>
                    <Text style={styles.filterSectionTitle}>Jinsi (Hayvonlar uchun)</Text>
                    <View style={styles.filterChipsRow}>
                      {[
                        { id: 'all', name: 'Barchasi' },
                        { id: 'male', name: 'Erkak' },
                        { id: 'female', name: 'Urg\'ochi' },
                      ].map(g => (
                        <TouchableOpacity
                          key={g.id}
                          style={[styles.filterChip, filterGender === g.id && styles.filterChipActive]}
                          onPress={() => setFilterGender(g.id)}
                        >
                          <Text style={[styles.filterChipText, filterGender === g.id && styles.filterChipTextActive]}>
                            {g.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                )}

                {/* Region Selector */}
                <Text style={styles.filterSectionTitle}>Viloyat bo'yicha</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 10 }}>
                  <TouchableOpacity
                    style={[styles.filterChip, filterRegion === 'all' && styles.filterChipActive]}
                    onPress={() => setFilterRegion('all')}
                  >
                    <Text style={[styles.filterChipText, filterRegion === 'all' && styles.filterChipTextActive]}>
                      Barchasi
                    </Text>
                  </TouchableOpacity>
                  {UZBEKISTAN_REGIONS.map(reg => (
                    <TouchableOpacity
                      key={reg}
                      style={[styles.filterChip, filterRegion === reg && styles.filterChipActive]}
                      onPress={() => setFilterRegion(reg)}
                    >
                      <Text style={[styles.filterChipText, filterRegion === reg && styles.filterChipTextActive]}>
                        {reg.replace(' viloyati', '').replace(' shahri', '')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Additional Toggles */}
                <Text style={styles.filterSectionTitle}>Qo'shimcha imkoniyatlar</Text>
                
                {/* Delivery Option */}
                <View style={styles.filterToggleRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.filterToggleTitle}>Yetkazib berish (Dostavka)</Text>
                    <Text style={styles.filterToggleDesc}>Faqat dostavka xizmati bor e'lonlar</Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    {[
                      { id: null, label: 'Barchasi' },
                      { id: true, label: 'Bor' },
                    ].map((dOption, i) => (
                      <TouchableOpacity
                        key={i}
                        style={[styles.filterToggleChip, filterDelivery === dOption.id && styles.filterToggleChipActive]}
                        onPress={() => setFilterDelivery(dOption.id)}
                      >
                        <Text style={[styles.filterToggleChipText, filterDelivery === dOption.id && styles.filterToggleChipTextActive]}>
                          {dOption.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Verified Sellers Option */}
                <View style={[styles.filterToggleRow, { marginTop: 12 }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.filterToggleTitle}>Tasdiqlangan sotuvchilar</Text>
                    <Text style={styles.filterToggleDesc}>Faqat tekshirilgan sotuvchilar</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.filterToggleChip, filterVerified === true && styles.filterToggleChipActive]}
                    onPress={() => setFilterVerified(!filterVerified)}
                  >
                    <Text style={[styles.filterToggleChipText, filterVerified === true && styles.filterToggleChipTextActive]}>
                      {filterVerified ? 'Tasdiqlangan' : 'Barchasi'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>

              {/* Action Buttons */}
              <View style={styles.filterModalActions}>
                <TouchableOpacity 
                  style={styles.filterResetBtn}
                  onPress={() => {
                    setFilterCategory('all');
                    setFilterRegion('all');
                    setFilterMinPrice('');
                    setFilterMaxPrice('');
                    setFilterDelivery(null);
                    setFilterVerified(false);
                    setFilterGender('all');
                  }}
                >
                  <Text style={styles.filterResetBtnText}>Tozalash</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.filterApplyBtn}
                  onPress={() => {
                    setShowFilterModal(false);
                    if (dashboardTab !== 'bozor') {
                      setDashboardTab('bozor');
                      setShowListings(false);
                      setShowSubcategories(false);
                      setSelectedSection(null);
                      setSubcatSearchQuery('');
                    }
                    if (filterRegion !== 'all') {
                      setBozorRegionFilter(filterRegion);
                    } else {
                      setBozorRegionFilter('all');
                    }
                  }}
                >
                  <Text style={styles.filterApplyBtnText}>Qo'llash</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ========== SORT SELECTION MODAL ========== */}
        <Modal
          visible={showSortDropdown}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowSortDropdown(false)}
        >
          <TouchableOpacity 
            style={styles.dropdownModalOverlay} 
            activeOpacity={1} 
            onPress={() => setShowSortDropdown(false)}
          >
            <View style={styles.dropdownModalContent}>
              <Text style={styles.dropdownModalTitle}>E'lonlarni saralash</Text>
              {[
                { id: 'newest', name: 'Yangi birinchi' },
                { id: 'price_asc', name: 'Arzonroq birinchi' },
                { id: 'price_desc', name: 'Qimmatroq birinchi' },
              ].map(opt => (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.dropdownItem, bozorSortOption === opt.id && styles.dropdownItemActive]}
                  onPress={() => {
                    setBozorSortOption(opt.id);
                    setShowSortDropdown(false);
                  }}
                >
                  <Text style={[styles.dropdownItemText, bozorSortOption === opt.id && styles.dropdownItemTextActive]}>
                    {opt.name}
                  </Text>
                  {bozorSortOption === opt.id && <Feather name="check" size={18} color="#3C8E2D" />}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* ========== REGION SELECTION MODAL ========== */}
        <Modal
          visible={showRegionDropdown}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowRegionDropdown(false)}
        >
          <TouchableOpacity 
            style={styles.dropdownModalOverlay} 
            activeOpacity={1} 
            onPress={() => setShowRegionDropdown(false)}
          >
            <View style={[styles.dropdownModalContent, { maxHeight: '60%' }]}>
              <Text style={styles.dropdownModalTitle}>Viloyatni tanlang</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                  style={[styles.dropdownItem, bozorRegionFilter === 'all' && styles.dropdownItemActive]}
                  onPress={() => {
                    setBozorRegionFilter('all');
                    setFilterRegion('all');
                    setShowRegionDropdown(false);
                  }}
                >
                  <Text style={[styles.dropdownItemText, bozorRegionFilter === 'all' && styles.dropdownItemTextActive]}>
                    Barchasi (O'zbekiston)
                  </Text>
                  {bozorRegionFilter === 'all' && <Feather name="check" size={18} color="#3C8E2D" />}
                </TouchableOpacity>
                {UZBEKISTAN_REGIONS.map(reg => (
                  <TouchableOpacity
                    key={reg}
                    style={[styles.dropdownItem, bozorRegionFilter === reg && styles.dropdownItemActive]}
                    onPress={() => {
                      setBozorRegionFilter(reg);
                      setFilterRegion(reg);
                      setShowRegionDropdown(false);
                    }}
                  >
                    <Text style={[styles.dropdownItemText, bozorRegionFilter === reg && styles.dropdownItemTextActive]}>
                      {reg}
                    </Text>
                    {bozorRegionFilter === reg && <Feather name="check" size={18} color="#3C8E2D" />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* ========== EDIT PROFILE MODAL ========== */}
        <Modal
          visible={showEditProfileModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowEditProfileModal(false)}
        >
          <View style={styles.addModalOverlay}>
            <View style={styles.addModalContent}>
              <View style={styles.addModalHeader}>
                <Text style={styles.addModalTitle}>Profilni tahrirlash</Text>
                <TouchableOpacity onPress={() => setShowEditProfileModal(false)} style={{ padding: 4 }}>
                  <Feather name="x" size={22} color="#15330F" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
                {/* Name Input */}
                <Text style={styles.editProfileInputLabel}>To'liq ismingiz</Text>
                <TextInput
                  style={styles.editProfileTextInput}
                  placeholder="Ism va familiyangizni kiriting..."
                  placeholderTextColor="#A3B1A0"
                  value={editNameInput}
                  onChangeText={setEditNameInput}
                />

                {/* Phone Input (Read-only) */}
                <Text style={styles.editProfileInputLabel}>Telefon raqam (O'zgartirilmaydi)</Text>
                <View style={[styles.editProfileTextInput, styles.editProfileTextInputDisabled]}>
                  <Text style={styles.editProfileTextDisabled}>{userProfilePhone}</Text>
                  <Feather name="lock" size={14} color="#A3B1A0" style={{ marginLeft: 'auto' }} />
                </View>

                {/* Email Input (Read-only) */}
                <Text style={styles.editProfileInputLabel}>Email (O'zgartirilmaydi)</Text>
                <View style={[styles.editProfileTextInput, styles.editProfileTextInputDisabled]}>
                  <Text style={styles.editProfileTextDisabled}>{userProfileEmail}</Text>
                  <Feather name="lock" size={14} color="#A3B1A0" style={{ marginLeft: 'auto' }} />
                </View>

                <TouchableOpacity
                  style={{ marginTop: 16, marginBottom: 8, flexDirection: 'row', alignItems: 'center' }}
                  onPress={() => {
                    setShowEditProfileModal(false);
                    setResetPasswordEmail(userProfileEmail !== 'Kiritilmagan' ? userProfileEmail : '');
                    setTimeout(() => {
                      setShowForgotPasswordModal(true);
                    }, 500);
                  }}
                  activeOpacity={0.7}
                >
                  <Feather name="shield" size={16} color="#3C8E2D" style={{ marginRight: 8 }} />
                  <Text style={{ color: '#3C8E2D', fontSize: 14, fontFamily: 'Outfit_500Medium' }}>
                    Parolni o'zgartirish
                  </Text>
                </TouchableOpacity>

                {/* Actions */}
                <View style={styles.editProfileActionsRow}>
                  <TouchableOpacity 
                    style={styles.editProfileCancelBtn}
                    onPress={() => setShowEditProfileModal(false)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.editProfileCancelBtnText}>Bekor qilish</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.editProfileSaveBtn}
                    onPress={() => {
                      if (editNameInput.trim()) {
                        setUserProfileName(editNameInput.trim());
                      }
                      setShowEditProfileModal(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.editProfileSaveBtnText}>Saqlash</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* ========== PROFILE DETAIL OVERLAYS ========== */}
        {profileSubScreen && (() => {
          const renderSubScreenContent = () => {
            switch(profileSubScreen) {
              case 'my_chats': {
                return (
                  <View style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
                      {chatsList.length === 0 ? (
                        <View style={styles.emptyStateContainer}>
                          <Feather name="message-square" size={54} color="#A3B1A0" style={{ marginBottom: 12 }} />
                          <Text style={styles.emptyStateTitle}>Xabarlar mavjud emas</Text>
                          <Text style={styles.emptyStateSubtitle}>Hozircha sizda hech qanday suhbat yo'q.</Text>
                        </View>
                      ) : (
                        chatsList.map((chat) => (
                          <TouchableOpacity 
                            key={chat.id} 
                            style={styles.notificationCard}
                            activeOpacity={0.85}
                            onPress={() => {
                              setCurrentChatId(chat.id);
                              setChatOtherUserName(chat.other_user_name);
                              fetchChatMessages(chat.id);
                              setShowChatModal(true);
                            }}
                          >
                            <View style={styles.notificationCardLeft}>
                              <View style={[styles.notificationIconBox, { backgroundColor: '#E6F4EA' }]}>
                                <Feather name="message-circle" size={18} color="#3C8E2D" />
                              </View>
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                              <Text style={[styles.notificationTitle, { fontWeight: '700' }]}>{chat.other_user_name}</Text>
                              <Text style={styles.notificationBody}>E'lon: {chat.ad_title}</Text>
                            </View>
                          </TouchableOpacity>
                        ))
                      )}
                    </ScrollView>
                  </View>
                );
              }
              case 'my_listings': {
                const ownList = ads.filter(item => item.isUserOwnListing);

                return (
                  <View style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
                      {ownList.length === 0 ? (
                        <View style={styles.emptyStateContainer}>
                          <Feather name="folder" size={54} color="#A3B1A0" style={{ marginBottom: 12 }} />
                          <Text style={styles.emptyStateTitle}>E'lonlaringiz mavjud emas</Text>
                          <Text style={styles.emptyStateSubtitle}>Sotmoqchi bo'lgan hayvoningiz yoki mahsulotingizni e'lon berish orqali qo'shishingiz mumkin.</Text>
                          <TouchableOpacity 
                            style={styles.emptyStateBtn} 
                            onPress={() => {
                              setProfileSubScreen(null);
                              setDashboardTab('add');
                              setAddStep(1);
                            }}
                          >
                            <Text style={styles.emptyStateBtnText}>E'lon berish</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={styles.favGrid}>
                          {ownList.map((item) => (
                            <TouchableOpacity 
                              key={item.id} 
                              style={styles.favCard}
                              activeOpacity={0.8}
                              onPress={() => {
                                setProfileSubScreen(null);
                                handleListingClick(item);
                              }}
                            >
                              <View style={styles.favCardImageWrapper}>
                                <Image source={{ uri: (item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/400') }} style={styles.favCardImage} />
                              </View>
                              <View style={styles.favCardContent}>
                                <Text style={styles.favCardTitle} numberOfLines={1}>{item.title}</Text>
                                <Text style={styles.favCardPrice} numberOfLines={1}>{item.price.replace(/\B(?=(\d{3})+(?!\d))/g, " ")} so'm</Text>
                                <View style={styles.favCardMetaRow}>
                                  <Feather name="map-pin" size={11} color="#7C8A79" />
                                  <Text style={styles.favCardMetaText} numberOfLines={1}>{item.location}</Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </ScrollView>
                  </View>
                );
              }

              case 'my_favorites': {
                const favList = ads.filter(item => favorites[item.id]);

                return (
                  <View style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
                      {favList.length === 0 ? (
                        <View style={styles.emptyStateContainer}>
                          <Feather name="heart" size={54} color="#FF5A5F" style={{ marginBottom: 12 }} />
                          <Text style={styles.emptyStateTitle}>Sevimlilar ro'yxati bo'sh</Text>
                          <Text style={styles.emptyStateSubtitle}>Sizga yoqqan e'lonlarni saqlab qo'yish uchun yurakcha belgisini bosing.</Text>
                          <TouchableOpacity 
                            style={styles.emptyStateBtn} 
                            onPress={() => {
                              setProfileSubScreen(null);
                              setDashboardTab('bozor');
                            }}
                          >
                            <Text style={styles.emptyStateBtnText}>Bozorga borish</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={styles.favGrid}>
                          {favList.map((item) => (
                            <TouchableOpacity 
                              key={item.id} 
                              style={styles.favCard}
                              activeOpacity={0.8}
                              onPress={() => {
                                setProfileSubScreen(null);
                                handleListingClick(item);
                              }}
                            >
                              <View style={styles.favCardImageWrapper}>
                                <Image source={{ uri: (item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/400') }} style={styles.favCardImage} />
                                <TouchableOpacity 
                                  style={styles.favCardHeartBtn}
                                  onPress={() => {
                                    toggleFavorite(item.id);
                                  }}
                                >
                                  <Ionicons name="heart" size={18} color="#FF5A5F" />
                                </TouchableOpacity>
                              </View>
                              <View style={styles.favCardContent}>
                                <Text style={styles.favCardTitle} numberOfLines={1}>{item.title}</Text>
                                <Text style={styles.favCardPrice} numberOfLines={1}>{item.price.replace(/\B(?=(\d{3})+(?!\d))/g, " ")} so'm</Text>
                                <View style={styles.favCardMetaRow}>
                                  <Feather name="map-pin" size={11} color="#7C8A79" />
                                  <Text style={styles.favCardMetaText} numberOfLines={1}>{item.location}</Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </ScrollView>
                  </View>
                );
              }

              case 'my_pets': {
                const handleAddPet = () => {
                  if (!newPetName.trim() || !newPetBreed.trim() || !newPetAge.trim()) return;
                  const newPet = {
                    id: 'pet_' + Date.now(),
                    name: newPetName.trim(),
                    type: newPetType,
                    breed: newPetBreed.trim(),
                    age: newPetAge.trim(),
                    vaccinated: newPetVaccinated,
                    image: newPetImage
                  };
                  setPetsList([newPet, ...petsList]);
                  // Reset form
                  setNewPetName('');
                  setNewPetBreed('');
                  setNewPetAge('');
                  setNewPetVaccinated(true);
                  setShowAddPetForm(false);
                };

                return (
                  <View style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
                      {showAddPetForm ? (
                        <View style={styles.subScreenFormCard}>
                          <Text style={styles.formCardTitle}>Yangi uy hayvoni</Text>
                          
                          <Text style={styles.editProfileInputLabel}>Ismi</Text>
                          <TextInput 
                            style={styles.editProfileTextInput}
                            placeholder="Masalan: Bella"
                            placeholderTextColor="#A3B1A0"
                            value={newPetName}
                            onChangeText={setNewPetName}
                          />

                          <Text style={styles.editProfileInputLabel}>Turi</Text>
                          <View style={styles.formCategoryChips}>
                            {['It', 'Mushuk', 'Qoramol', 'Qo\'y', 'Tovuq', 'Boshqa'].map(type => (
                              <TouchableOpacity 
                                key={type} 
                                style={[styles.formChip, newPetType === type && styles.formChipActive]}
                                onPress={() => {
                                  setNewPetType(type);
                                  // Update default template images
                                  if (type === 'It') setNewPetImage('https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=200&q=80');
                                  else if (type === 'Mushuk') setNewPetImage('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=200&q=80');
                                  else if (type === 'Qoramol') setNewPetImage('https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=200&q=80');
                                  else if (type === 'Qo\'y') setNewPetImage('https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=200&q=80');
                                  else setNewPetImage('https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=200&q=80');
                                }}
                              >
                                <Text style={[styles.formChipText, newPetType === type && styles.formChipTextActive]}>{type}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>

                          <Text style={styles.editProfileInputLabel}>Zoti / Turi</Text>
                          <TextInput 
                            style={styles.editProfileTextInput}
                            placeholder="Masalan: Lablador"
                            placeholderTextColor="#A3B1A0"
                            value={newPetBreed}
                            onChangeText={setNewPetBreed}
                          />

                          <Text style={styles.editProfileInputLabel}>Yoshi</Text>
                          <TextInput 
                            style={styles.editProfileTextInput}
                            placeholder="Masalan: 2 yosh"
                            placeholderTextColor="#A3B1A0"
                            value={newPetAge}
                            onChangeText={setNewPetAge}
                          />

                          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 14 }}>
                            <Text style={{ fontSize: 15, fontWeight: '600', color: '#15330F' }}>Emlangan (Vaksina qilingan)</Text>
                            <TouchableOpacity 
                              style={{ marginLeft: 'auto', padding: 6 }}
                              onPress={() => setNewPetVaccinated(!newPetVaccinated)}
                            >
                              <Ionicons 
                                name={newPetVaccinated ? "checkbox" : "square-outline"} 
                                size={22} 
                                color={newPetVaccinated ? "#3C8E2D" : "#7C8A79"} 
                              />
                            </TouchableOpacity>
                          </View>

                          <View style={styles.formBtnRow}>
                            <TouchableOpacity 
                              style={styles.formCancelBtn}
                              onPress={() => setShowAddPetForm(false)}
                            >
                              <Text style={styles.formCancelBtnText}>Bekor qilish</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                              style={styles.formSaveBtn}
                              onPress={handleAddPet}
                            >
                              <Text style={styles.formSaveBtnText}>Qo'shish</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        <View>
                          <TouchableOpacity 
                            style={styles.subScreenAddBtn} 
                            activeOpacity={0.8}
                            onPress={() => setShowAddPetForm(true)}
                          >
                            <Feather name="plus" size={18} color="#FFFFFF" />
                            <Text style={styles.subScreenAddBtnText}>Yangi uy hayvoni qo'shish</Text>
                          </TouchableOpacity>

                          {petsList.map((pet) => (
                            <View key={pet.id} style={styles.petCard}>
                              <Image source={{ uri: pet.image }} style={styles.petCardImage} />
                              <View style={styles.petCardInfo}>
                                <Text style={styles.petCardName}>{pet.name}</Text>
                                <Text style={styles.petCardBreed}>{pet.type} • {pet.breed}</Text>
                                <Text style={styles.petCardAge}>{pet.age}</Text>
                                <View style={{ flexDirection: 'row', marginTop: 6 }}>
                                  <View style={[styles.petVaccineBadge, pet.vaccinated ? styles.petVaccineBadgeOk : styles.petVaccineBadgeNo]}>
                                    <Feather name={pet.vaccinated ? "check" : "x"} size={10} color={pet.vaccinated ? "#3C8E2D" : "#FF5A5F"} />
                                    <Text style={[styles.petVaccineText, pet.vaccinated ? { color: '#3C8E2D' } : { color: '#FF5A5F' }]}>
                                      {pet.vaccinated ? "Emlangan" : "Emlanmagan"}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          ))}
                        </View>
                      )}
                    </ScrollView>
                  </View>
                );
              }

              case 'my_addresses': {
                const handleAddAddress = () => {
                  if (!newAddrName.trim() || !newAddrDistrict.trim() || !newAddrDetails.trim()) return;
                  const newAddr = {
                    id: 'addr_' + Date.now(),
                    name: newAddrName.trim(),
                    region: newAddrRegion,
                    district: newAddrDistrict.trim(),
                    details: newAddrDetails.trim()
                  };
                  setAddressesList([...addressesList, newAddr]);
                  setNewAddrName('');
                  setNewAddrDistrict('');
                  setNewAddrDetails('');
                  setShowAddAddressForm(false);
                };

                return (
                  <View style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
                      {showAddAddressForm ? (
                        <View style={styles.subScreenFormCard}>
                          <Text style={styles.formCardTitle}>Yangi manzil</Text>

                          <Text style={styles.editProfileInputLabel}>Manzil nomi (Masalan: Uy, Ishxonam)</Text>
                          <TextInput 
                            style={styles.editProfileTextInput}
                            placeholder="Manzilga nom bering..."
                            placeholderTextColor="#A3B1A0"
                            value={newAddrName}
                            onChangeText={setNewAddrName}
                          />

                          <Text style={styles.editProfileInputLabel}>Viloyat</Text>
                          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 6 }} contentContainerStyle={{ gap: 8 }}>
                            {UZBEKISTAN_REGIONS.map(reg => (
                              <TouchableOpacity 
                                key={reg}
                                style={[styles.formChip, newAddrRegion === reg && styles.formChipActive]}
                                onPress={() => setNewAddrRegion(reg)}
                              >
                                <Text style={[styles.formChipText, newAddrRegion === reg && styles.formChipTextActive]}>{reg}</Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>

                          <Text style={styles.editProfileInputLabel}>Tuman / Shahar</Text>
                          <TextInput 
                            style={styles.editProfileTextInput}
                            placeholder="Tumanni yozing..."
                            placeholderTextColor="#A3B1A0"
                            value={newAddrDistrict}
                            onChangeText={setNewAddrDistrict}
                          />

                          <Text style={styles.editProfileInputLabel}>Ko'cha, uy, xonadon tafsilotlari</Text>
                          <TextInput 
                            style={[styles.editProfileTextInput, { height: 60, textAlignVertical: 'top' }]}
                            placeholder="Ko'cha nomi, uy va xonadon raqami..."
                            placeholderTextColor="#A3B1A0"
                            multiline={true}
                            numberOfLines={2}
                            value={newAddrDetails}
                            onChangeText={setNewAddrDetails}
                          />

                          <View style={styles.formBtnRow}>
                            <TouchableOpacity 
                              style={styles.formCancelBtn}
                              onPress={() => setShowAddAddressForm(false)}
                            >
                              <Text style={styles.formCancelBtnText}>Bekor qilish</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                              style={styles.formSaveBtn}
                              onPress={handleAddAddress}
                            >
                              <Text style={styles.formSaveBtnText}>Qo'shish</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        <View>
                          <TouchableOpacity 
                            style={styles.subScreenAddBtn} 
                            activeOpacity={0.8}
                            onPress={() => setShowAddAddressForm(true)}
                          >
                            <Feather name="plus" size={18} color="#FFFFFF" />
                            <Text style={styles.subScreenAddBtnText}>Yangi manzil qo'shish</Text>
                          </TouchableOpacity>

                          {addressesList.map((addr) => (
                            <View key={addr.id} style={styles.addressCard}>
                              <View style={styles.addressCardIconWrapper}>
                                <Feather name={addr.name.toLowerCase().includes('uy') ? 'home' : 'briefcase'} size={18} color="#3C8E2D" />
                              </View>
                              <View style={styles.addressCardInfo}>
                                <Text style={styles.addressCardName}>{addr.name}</Text>
                                <Text style={styles.addressCardFull}>{addr.region}, {addr.district}</Text>
                                <Text style={styles.addressCardDetails}>{addr.details}</Text>
                              </View>
                            </View>
                          ))}
                        </View>
                      )}
                    </ScrollView>
                  </View>
                );
              }

              case 'my_payments': {
                const handleAddCard = () => {
                  if (!newCardNumber.trim() || !newCardExpiry.trim() || !newCardHolder.trim()) return;
                  const cleanNum = newCardNumber.replace(/\s+/g, '');
                  const formattedNum = `${cleanNum.slice(0, 4)} ${cleanNum.slice(4, 6)}** **** ${cleanNum.slice(-4)}`;
                  const newCard = {
                    id: 'card_' + Date.now(),
                    type: newCardType,
                    number: formattedNum,
                    expiry: newCardExpiry,
                    holder: newCardHolder.toUpperCase(),
                    gradient: newCardType === 'Uzcard' ? ['#155D11', '#3C8E2D'] : ['#1E88E5', '#1565C0']
                  };
                  setCardsList([...cardsList, newCard]);
                  setNewCardNumber('');
                  setNewCardExpiry('');
                  setShowAddCardForm(false);
                };

                return (
                  <View style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
                      {showAddCardForm ? (
                        <View style={styles.subScreenFormCard}>
                          <Text style={styles.formCardTitle}>Yangi to'lov kartasi</Text>

                          <Text style={styles.editProfileInputLabel}>Karta turi</Text>
                          <View style={styles.formCategoryChips}>
                            {['Uzcard', 'Humo'].map(type => (
                              <TouchableOpacity 
                                key={type} 
                                style={[styles.formChip, newCardType === type && styles.formChipActive]}
                                onPress={() => setNewCardType(type)}
                              >
                                <Text style={[styles.formChipText, newCardType === type && styles.formChipTextActive]}>{type}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>

                          <Text style={styles.editProfileInputLabel}>Karta raqami</Text>
                          <TextInput 
                            style={styles.editProfileTextInput}
                            placeholder="8600 1234 5678 9012"
                            placeholderTextColor="#A3B1A0"
                            keyboardType="numeric"
                            maxLength={16}
                            value={newCardNumber}
                            onChangeText={setNewCardNumber}
                          />

                          <Text style={styles.editProfileInputLabel}>Amal qilish muddati (MM/YY)</Text>
                          <TextInput 
                            style={styles.editProfileTextInput}
                            placeholder="12/28"
                            placeholderTextColor="#A3B1A0"
                            maxLength={5}
                            value={newCardExpiry}
                            onChangeText={setNewCardExpiry}
                          />

                          <Text style={styles.editProfileInputLabel}>Karta egasi ismi</Text>
                          <TextInput 
                            style={styles.editProfileTextInput}
                            placeholder="MADINA ABDURAHMONOVA"
                            placeholderTextColor="#A3B1A0"
                            value={newCardHolder}
                            onChangeText={setNewCardHolder}
                          />

                          <View style={styles.formBtnRow}>
                            <TouchableOpacity 
                              style={styles.formCancelBtn}
                              onPress={() => setShowAddCardForm(false)}
                            >
                              <Text style={styles.formCancelBtnText}>Bekor qilish</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                              style={styles.formSaveBtn}
                              onPress={handleAddCard}
                            >
                              <Text style={styles.formSaveBtnText}>Karta ulasash</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        <View>
                          <TouchableOpacity 
                            style={styles.subScreenAddBtn} 
                            activeOpacity={0.8}
                            onPress={() => setShowAddCardForm(true)}
                          >
                            <Feather name="plus" size={18} color="#FFFFFF" />
                            <Text style={styles.subScreenAddBtnText}>Yangi karta qo'shish</Text>
                          </TouchableOpacity>

                          {cardsList.map((card) => (
                            <View 
                              key={card.id} 
                              style={[styles.paymentCardWrapper, { backgroundColor: card.gradient[0] }]}
                            >
                              <View style={styles.paymentCardHeader}>
                                <Text style={styles.paymentCardType}>{card.type}</Text>
                                <Feather name="wifi" size={18} color="#FFFFFF" style={{ opacity: 0.6 }} />
                              </View>
                              <Text style={styles.paymentCardNumber}>{card.number}</Text>
                              <View style={styles.paymentCardFooter}>
                                <View>
                                  <Text style={styles.paymentCardLabel}>KARTA EGASI</Text>
                                  <Text style={styles.paymentCardHolder}>{card.holder}</Text>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                  <Text style={styles.paymentCardLabel}>MUDDATI</Text>
                                  <Text style={styles.paymentCardExpiry}>{card.expiry}</Text>
                                </View>
                              </View>
                            </View>
                          ))}
                        </View>
                      )}
                    </ScrollView>
                  </View>
                );
              }

              case 'my_premium': {
                return (
                  <View style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
                      {/* Premium Header Card */}
                      <View style={styles.premiumOverlayHeaderCard}>
                        <View style={styles.premiumOverlayHeaderRow}>
                          <View style={styles.premiumOverlayIconBg}>
                            <FontAwesome5 name="crown" size={24} color="#D4AF37" />
                          </View>
                          <View style={{ marginLeft: 12 }}>
                            <Text style={styles.premiumOverlayStatus}>Zoovita Premium</Text>
                            <Text style={styles.premiumOverlayActiveText}>Obuna statusi: FAOL</Text>
                          </View>
                        </View>
                        <Text style={styles.premiumOverlayExpiry}>Karta: **** 4567 • Kelgusi to'lov: 31-Dekabr, 2026 (79 000 so'm/yil)</Text>
                      </View>

                      {/* Savings Section */}
                      <Text style={styles.profileSectionTitle}>Tejamkorlik kalkulyatori</Text>
                      <View style={styles.premiumSavingsCard}>
                        <View style={styles.premiumSavingsRow}>
                          <Text style={styles.premiumSavingsLabel}>Yetkazib berishdan tejaldi:</Text>
                          <Text style={styles.premiumSavingsValue}>85 000 so'm</Text>
                        </View>
                        <View style={styles.premiumSavingsRow}>
                          <Text style={styles.premiumSavingsLabel}>Eksklyuziv chegirmalardan tejaldi:</Text>
                          <Text style={styles.premiumSavingsValue}>120 000 so'm</Text>
                        </View>
                        <View style={styles.premiumSavingsDivider} />
                        <View style={styles.premiumSavingsTotalRow}>
                          <Text style={styles.premiumSavingsTotalLabel}>Jami tejamkorlik:</Text>
                          <Text style={styles.premiumSavingsTotalValue}>205 000 so'm</Text>
                        </View>
                      </View>

                      {/* Benefits list */}
                      <Text style={styles.profileSectionTitle}>A'zolik afzalliklari</Text>
                      <View style={styles.premiumBenefitsCard}>
                        {[
                          { title: 'Bepul yetkazib berish', desc: 'Barcha do\'kon va mahsulotlar uchun buyurtmalar mutlaqo bepul yetkaziladi.', icon: 'truck' },
                          { title: 'VIP e\'lonlar tizimi', desc: 'Siz joylashtirgan e\'lonlar qidiruv natijalarida eng yuqori o\'rinlarda ko\'rsatiladi.', icon: 'trending-up' },
                          { title: 'Veterinar bilan 24/7 aloqa', desc: 'Siz uchun maxsus veterinar ajratiladi va istalgan vaqtda chat orqali maslahat olishingiz mumkin.', icon: 'heart' },
                          { title: 'Cheksiz e\'lonlar', desc: 'Hech qanday cheklovlarsiz istalgancha hayvon va mahsulot sotuvga qo\'yish imkoniyati.', icon: 'infinity' },
                        ].map((benefit, i) => (
                          <View key={i} style={styles.premiumBenefitRow}>
                            <View style={styles.premiumBenefitIconBg}>
                              <Feather name={benefit.icon} size={16} color="#3C8E2D" />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                              <Text style={styles.premiumBenefitTitle}>{benefit.title}</Text>
                              <Text style={styles.premiumBenefitDesc}>{benefit.desc}</Text>
                            </View>
                          </View>
                        ))}
                      </View>

                      {/* Action */}
                      <TouchableOpacity 
                        style={styles.premiumCancelObunaBtn}
                        activeOpacity={0.8}
                        onPress={() => {
                          alert("Obunani boshqarish uchun shaxsiy profilingiz orqali Google Play / App Store hisobingizga o'ting.");
                        }}
                      >
                        <Text style={styles.premiumCancelObunaBtnText}>Obunani bekor qilish</Text>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                );
              }

              case 'help_center': {
                const faqs = [
                  { q: "Qanday qilib e'lon berish mumkin?", a: "Bosh sahifa yoki Bozor sahifasidagi pastki tablar orasidan markaziy '+' tugmasini bosing, barcha ma'lumotlarni bosqichma-bosqich to'ldiring va e'lonni tasdiqlang." },
                  { q: "E'lon berish mutlaqo bepulmi?", a: "Ha! Oddiy foydalanuvchilar uchun e'lon joylashtirish mutlaqo bepul. Agar siz e'loningiz tezroq sotilishini xohlasangiz, VIP xizmatlarni ulashingiz mumkin." },
                  { q: "Yetkazib berish xizmati qanday ishlaydi?", a: "Bozor sahifasidan xarid qilingan mahsulotlar hamkor kurerlarimiz orqali manzilingizga yetkaziladi. Yetkazib berish vaqti shahar ichida 2-4 soat, viloyatlararo esa 1-2 kunni tantal etadi." },
                  { q: "To'lov xavfsizligi kafolatlanganmi?", a: "Ha. Zoovita orqali Click, Payme yoki plastik kartalar bilan amalga oshiriladigan barcha tranzaksiyalar shifrlangan va to'liq xavfsiz hisoblanadi." },
                  { q: "Sotuvchi bilan qanday bog'lanish mumkin?", a: "E'lon tafsilotlari sahifasining pastki qismida joylagan 'Qo'ng'iroq qilish' yoki 'Telegram orqali yozish' tugmalarini bosish orqali to'g'ridan-to'g'ri sotuvchi bilan aloqaga chiqasiz." },
                  { q: "Premium obuna nima beradi?", a: "Premium obuna sizga barcha mahsulotlarni bepul yetkazib berish, do'konlarda maxsus chegirmalar, VIP e'lon ko'rinishi hamda shaxsiy veterinar yordamidan foydalanish huquqini taqdim etadi." }
                ];

                return (
                  <View style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
                      <Text style={styles.helpCenterIntro}>Ko'p beriladigan savollar (FAQ)</Text>
                      
                      {faqs.map((faq, i) => {
                        const isExpanded = faqExpandedIndex === i;
                        return (
                          <View key={i} style={styles.faqCard}>
                            <TouchableOpacity 
                              style={styles.faqHeader}
                              activeOpacity={0.8}
                              onPress={() => setFaqExpandedIndex(isExpanded ? null : i)}
                            >
                              <Text style={styles.faqQuestion}>{faq.q}</Text>
                              <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color="#7C8A79" />
                            </TouchableOpacity>
                            {isExpanded && (
                              <View style={styles.faqAnswerContainer}>
                                <Text style={styles.faqAnswerText}>{faq.a}</Text>
                              </View>
                            )}
                          </View>
                        );
                      })}

                      {/* Redirect to Contact Support */}
                      <View style={styles.helpSupportBox}>
                        <Feather name="message-square" size={24} color="#3C8E2D" />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={styles.helpSupportTitle}>Savollaringizga javob topilmadi?</Text>
                          <Text style={styles.helpSupportSubtitle}>Bizning qo'llab-quvvatlash jamoamizga murojaat qiling.</Text>
                        </View>
                        <TouchableOpacity 
                          style={styles.helpSupportBtn}
                          onPress={() => setProfileSubScreen('contact_us')}
                        >
                          <Text style={styles.helpSupportBtnText}>Yozish</Text>
                        </TouchableOpacity>
                      </View>
                    </ScrollView>
                  </View>
                );
              }

              case 'contact_us': {
                const handleSendMessage = () => {
                  if (!contactMessage.trim()) return;
                  setShowContactSuccess(true);
                  setContactMessage('');
                };

                return (
                  <View style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
                      {showContactSuccess ? (
                        <View style={styles.contactSuccessCard}>
                          <View style={styles.contactSuccessIconBg}>
                            <Feather name="check" size={32} color="#FFFFFF" />
                          </View>
                          <Text style={styles.contactSuccessTitle}>Murojaatingiz qabul qilindi!</Text>
                          <Text style={styles.contactSuccessDesc}>
                            Xabaringiz yuborildi. Bizning operatorlarimiz tez orada (+998 90 123 45 67 raqamingiz orqali) aloqaga chiqishadi.
                          </Text>
                          <TouchableOpacity 
                            style={styles.contactSuccessBtn}
                            onPress={() => setShowContactSuccess(false)}
                          >
                            <Text style={styles.contactSuccessBtnText}>Tushunarli</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={styles.subScreenFormCard}>
                          <Text style={styles.formCardTitle}>Murojaat yuborish</Text>
                          
                          <Text style={styles.editProfileInputLabel}>Murojaat toifasi</Text>
                          <View style={styles.formCategoryChips}>
                            {['Texnik muammo', 'Moliyaviy masala', 'Veterinar yordami', 'Takliflar', 'Boshqa'].map(cat => (
                              <TouchableOpacity 
                                key={cat} 
                                style={[styles.formChip, contactSubject === cat && styles.formChipActive]}
                                onPress={() => setContactSubject(cat)}
                              >
                                <Text style={[styles.formChipText, contactSubject === cat && styles.formChipTextActive]}>{cat}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>

                          <Text style={styles.editProfileInputLabel}>Murojaat matni</Text>
                          <TextInput 
                            style={[styles.editProfileTextInput, { height: 120, textAlignVertical: 'top' }]}
                            placeholder="Savolingiz yoki muammoni bu yerda batafsil yozing..."
                            placeholderTextColor="#A3B1A0"
                            multiline={true}
                            numberOfLines={5}
                            value={contactMessage}
                            onChangeText={setContactMessage}
                          />

                          <TouchableOpacity 
                            style={styles.contactSubmitBtn}
                            onPress={handleSendMessage}
                          >
                            <Text style={styles.contactSubmitBtnText}>Xabarni yuborish</Text>
                          </TouchableOpacity>
                        </View>
                      )}

                      {/* Direct Channels */}
                      <Text style={styles.profileSectionTitle}>Tezkor bog'lanish</Text>
                      <View style={styles.contactChannelsCard}>
                        {[
                          { title: 'Telefon orqali', value: '+998 71 200 01 23', icon: 'phone', color: '#1E88E5' },
                          { title: 'Telegram guruh', value: '@zoovita_support', icon: 'navigation', color: '#29B6F6' },
                          { title: 'Elektron pochta', value: 'support@zoovita.uz', icon: 'mail', color: '#F5A623' }
                        ].map((chan, idx) => (
                          <View key={idx} style={styles.contactChannelRow}>
                            <View style={[styles.contactChannelIconBg, { backgroundColor: chan.color + '15' }]}>
                              <Feather name={chan.icon} size={16} color={chan.color} />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                              <Text style={styles.contactChannelTitle}>{chan.title}</Text>
                              <Text style={styles.contactChannelValue}>{chan.value}</Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    </ScrollView>
                  </View>
                );
              }

              case 'terms': {
                return (
                  <View style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
                      <View style={styles.docCard}>
                        <Text style={styles.docTitle}>Foydalanish qoidalari va shartlari</Text>
                        <Text style={styles.docMeta}>Oxirgi yangilanish: 20-may, 2026-yil</Text>
                        <Text style={styles.docParagraph}>
                          Zoovita mobil ilovasiga xush kelibsiz. Ushbu ilovadan foydalanish orqali siz quyidagi shartlar va qoidalarga to'liq rozilik bildirasiz.
                        </Text>
                        <Text style={styles.docSectionTitle}>1. Xizmatlardan foydalanish shartlari</Text>
                        <Text style={styles.docParagraph}>
                          Foydalanuvchi tizimda e'lon berish paytida faqat haqiqiy va to'g'ri ma'lumotlarni taqdim etishi shart. O'zbekiston Respublikasi qonunchiligida taqiqlangan hayvonlar yoki buyumlarni ilova orqali sotish taqiqlanadi.
                        </Text>
                        <Text style={styles.docSectionTitle}>2. Foydalanuvchining majburiyatlari</Text>
                        <Text style={styles.docParagraph}>
                          Siz o'z hisobingiz parolini maxfiy saqlashga, shuningdek hisobingiz orqali amalga oshiriladigan barcha harakatlar uchun to'liq javobgar bo'lishga rozilik bildirasiz.
                        </Text>
                        <Text style={styles.docSectionTitle}>3. Javobgarlikni cheklash</Text>
                        <Text style={styles.docParagraph}>
                          Zoovita faqat sotuvchilar va xaridorlarni bog'lovchi onlayn platforma hisoblanadi. Biz sotilayotgan hayvonlar salomatligi yoki mahsulotlar sifati uchun bevosita javobgarlikni o'z zimmamizga olmaymiz. Har bir tranzaksiyadan oldin tekshirish tavsiya etiladi.
                        </Text>
                      </View>
                    </ScrollView>
                  </View>
                );
              }

              case 'privacy': {
                return (
                  <View style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
                      <View style={styles.docCard}>
                        <Text style={styles.docTitle}>Maxfiylik siyosati</Text>
                        <Text style={styles.docMeta}>Oxirgi yangilanish: 20-may, 2026-yil</Text>
                        <Text style={styles.docParagraph}>
                          Sizning maxfiyligingiz va shaxsiy ma'lumotlaringiz xavfsizligini ta'minlash bizning ustuvor vazifamizdir. Ushbu hujjat siz haqingizdagi qanday ma'lumotlar to'planishini bayon qiladi.
                        </Text>
                        <Text style={styles.docSectionTitle}>1. Qanday ma'lumotlarni to'playmiz?</Text>
                        <Text style={styles.docParagraph}>
                          Biz siz tizimdan ro'yxatdan o'tganingizda kiritgan ismingiz, telefon raqamingiz va email manzilingizni saqlaymiz. Shuningdek, ilovada joylashtirgan e'lonlaringiz, rasmlar va kiritgan manzillaringiz ma'lumotlar bazasida saqlanadi.
                        </Text>
                        <Text style={styles.docSectionTitle}>2. Ma'lumotlardan qanday foydalanamiz?</Text>
                        <Text style={styles.docParagraph}>
                          To'plangan ma'lumotlar faqat platforma xizmatlarini taqdim etish, sotuvchi bilan bog'lanish va ilova ishlash sifatini yaxshilash maqsadida qo'llaniladi. Shaxsiy ma'lumotlaringiz uchinchi shaxslarga sotilmaydi yoki ijaraga berilmaydi.
                        </Text>
                        <Text style={styles.docSectionTitle}>3. Ma'lumotlar xavfsizligi</Text>
                        <Text style={styles.docParagraph}>
                          Ma'lumotlar shifrlangan serverlarda saqlanadi va ruxsatsiz kirishlardan himoyalangan. Tranzaksiyalar SSL protokollari bilan amalga oshiriladi.
                        </Text>
                      </View>
                    </ScrollView>
                  </View>
                );
              }

              default:
                return null;
            }
          };

          const getSubScreenTitle = () => {
            switch(profileSubScreen) {
              case 'my_orders': return 'Buyurtmalarim';
              case 'my_favorites': return 'Sevimlilarim';
              case 'my_pets': return 'Mening uy hayvonlarim';
              case 'my_addresses': return 'Mening manzillarim';
              case 'my_payments': return 'To\'lov usullarim';
              case 'my_premium': return 'Zoovita Premium';
              case 'help_center': return 'Yordam markazi';
              case 'contact_us': return 'Bog\'lanish';
              case 'terms': return 'Foydalanish shartlari';
              case 'privacy': return 'Maxfiylik siyosati';
              default: return 'Tafsilotlar';
            }
          };

          return (
            <View style={styles.detailOverlay}>
              <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={styles.detailHeader}>
                  <TouchableOpacity
                    style={styles.detailHeaderBtn}
                    activeOpacity={0.8}
                    onPress={() => {
                      setProfileSubScreen(null);
                      // Clear form states
                      setShowAddPetForm(false);
                      setShowAddAddressForm(false);
                      setShowAddCardForm(false);
                      setShowContactSuccess(false);
                    }}
                  >
                    <Feather name="arrow-left" size={22} color="#15330F" />
                  </TouchableOpacity>
                  <Text style={styles.detailHeaderTitle}>{getSubScreenTitle()}</Text>
                  <View style={{ width: 38 }} />
                </View>

                {renderSubScreenContent()}
              </SafeAreaView>
            </View>
          );
        })()}
        {/* Forgot Password Modal */}
        <Modal visible={showForgotPasswordModal} transparent animationType="fade">
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'padding'} style={{flex:1}}>
            <TouchableOpacity style={styles.addModalOverlay} activeOpacity={1} onPress={() => setShowForgotPasswordModal(false)}>
              <View style={styles.addModalContent}>
                <View style={styles.addModalHeader}>
                  <Text style={styles.addModalTitle}>Parolni tiklash</Text>
                  <TouchableOpacity onPress={() => setShowForgotPasswordModal(false)}>
                    <Feather name="x" size={24} color="#15330F" />
                  </TouchableOpacity>
                </View>
                <Text style={{color: '#7C8A79', marginBottom: 16, fontSize: 14}}>
                  Parolni tiklash uchun email manzilingizni kiriting. Sizga tiklash havolasi yuboriladi.
                </Text>
                <TextInput
                  style={[styles.textInput, {marginBottom: 20}]}
                  placeholder="Emailingizni kiriting"
                  placeholderTextColor="#A3B1A0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={resetPasswordEmail}
                  onChangeText={setResetPasswordEmail}
                />
                <TouchableOpacity style={styles.btnPrimary} onPress={handleForgotPasswordSubmit}>
                  <Text style={styles.btnPrimaryText}>Tasdiqlash</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Modal>

        {/* New Password Modal */}
        <Modal visible={showNewPasswordModal} transparent animationType="fade">
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'padding'} style={{flex:1}}>
            <TouchableOpacity style={styles.addModalOverlay} activeOpacity={1}>
              <View style={styles.addModalContent}>
                <View style={styles.addModalHeader}>
                  <Text style={styles.addModalTitle}>Yangi parol o'rnatish</Text>
                  <TouchableOpacity onPress={() => {
                    setShowNewPasswordModal(false);
                    setNewPasswordToken(null);
                  }}>
                    <Feather name="x" size={24} color="#15330F" />
                  </TouchableOpacity>
                </View>
                <Text style={{color: '#7C8A79', marginBottom: 16, fontSize: 14}}>
                  Yangi parolingizni kiriting (kamida 6 ta belgi).
                </Text>
                <TextInput
                  style={[styles.textInput, {marginBottom: 12}]}
                  placeholder="Yangi parol"
                  placeholderTextColor="#A3B1A0"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TextInput
                  style={[styles.textInput, {marginBottom: 20}]}
                  placeholder="Yangi parolni tasdiqlang"
                  placeholderTextColor="#A3B1A0"
                  secureTextEntry
                  value={confirmNewPassword}
                  onChangeText={setConfirmNewPassword}
                />
                <TouchableOpacity style={styles.btnPrimary} onPress={handleNewPasswordSubmit}>
                  <Text style={styles.btnPrimaryText}>Parolni yangilash</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    );
  }

  // --- SIGN IN/UP SCREENS ---
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardContainer}
    >
      <ImageBackground
        source={require('./assets/background.png')}
        style={styles.container}
        resizeMode="cover"
        imageStyle={{ top: screen === 'welcome' ? -230 : -280 }}
      >
        <StatusBar style="dark" />

        <SafeAreaView style={styles.topContainer}>
          <View style={[styles.topSection, screen !== 'welcome' && styles.topSectionLogin]}>
            <Animated.View
              style={{
                opacity: screen === 'welcome' ? fadeAnim : logoOpacity,
                transform: [
                  { scale: screen === 'welcome' ? scaleAnim : logoScale },
                  { rotate: screen === 'welcome' ? rotate : '0deg' },
                  { scale: screen === 'welcome' ? pulseScale : 1 },
                  { translateY: screen === 'welcome' ? 0 : logoTranslateY },
                ],
                width: '100%',
                alignItems: 'center',
              }}
            >
              <Image
                source={require('./assets/logo.png')}
                style={[styles.logo, screen !== 'welcome' && styles.logoLogin]}
                resizeMode="contain"
              />
            </Animated.View>
          </View>
        </SafeAreaView>

        <Animated.View
          style={[
            screen === 'welcome' ? styles.bottomCardWelcome : styles.bottomCardLogin,
            {
              opacity: contentFadeAnim,
              transform: [{ translateY: contentSlideAnim }],
            },
          ]}
        >
          {screen === 'welcome' && (
            // --- WELCOME SCREEN CONTENT ---
            <View style={styles.welcomeContent}>
              <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={() => navigateTo('dashboard')}>
                <Text style={styles.buttonText}>Boshlash</Text>
                <Text style={styles.buttonArrow}>›</Text>
              </TouchableOpacity>
            </View>
          )}

          {screen === 'login' && (
            // --- LOGIN SCREEN CONTENT ---
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.leafHeader}>
                <Ionicons name="leaf" size={24} color="#3C8E2D" />
                <Text style={styles.loginTitle}>Xush kelibsiz!</Text>
                <Text style={styles.loginSubtitle}>
                  Hisobingizga kiring va imkoniyatlardan foydalaning.
                </Text>
              </View>

              {/* Phone Input */}
              <View style={[styles.inputContainer, isPhoneFocused && styles.inputFocused]}>
                <Feather name="user" size={20} color={isPhoneFocused ? '#3C8E2D' : '#7C8A79'} style={styles.inputIcon} />
                {showLoginPrefix && (
                  <TouchableOpacity onPress={() => setShowPhoneCodeModal(true)} style={{flexDirection: 'row', alignItems: 'center', marginRight: 4}}>
                    <Text style={styles.phonePrefix}>{selectedPhoneCode}</Text>
                    <Feather name="chevron-down" size={14} color="#15330F" style={{marginRight: 8, marginTop: 2}} />
                  </TouchableOpacity>
                )}
                <TextInput
                  style={styles.textInput}
                  placeholder={showLoginPrefix ? "" : "Telefon raqam"}
                  placeholderTextColor="#A3B1A0"
                  keyboardType="phone-pad"
                  maxLength={currentPhoneConfig.maxLen}
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  onFocus={() => setIsPhoneFocused(true)}
                  onBlur={() => setIsPhoneFocused(false)}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Feather name="lock" size={20} color="#7C8A79" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Parol"
                  placeholderTextColor="#A3B1A0"
                  secureTextEntry={secureText}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                  <Feather
                    name={secureText ? 'eye-off' : 'eye'}
                    size={20}
                    color="#7C8A79"
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>

              {/* Remember Me & Forgot Password */}
              <View style={styles.utilityRow}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  activeOpacity={0.8}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <Ionicons
                    name={rememberMe ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={rememberMe ? '#3C8E2D' : '#7C8A79'}
                  />
                  <Text style={styles.checkboxLabel}>Meni eslab qolish</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => setShowForgotPasswordModal(true)}>
                  <Text style={styles.forgotPassword}>Parolni unutdingiz?</Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={handleLogin}>
                <Text style={styles.buttonText}>Kirish</Text>
              </TouchableOpacity>

              {/* Social Login Buttons Removed */}

              {/* Sign Up Redirect */}
              <View style={styles.signupRow}>
                <Text style={styles.signupText}>Hisobingiz yo‘qmi? </Text>
                <TouchableOpacity activeOpacity={0.7} onPress={() => navigateTo('register')}>
                  <Text style={styles.signupLink}>Ro‘yxatdan o‘tish</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}

          {screen === 'register' && (
            // --- REGISTER SCREEN CONTENT ---
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.leafHeader}>
                <Ionicons name="leaf" size={24} color="#3C8E2D" />
                <Text style={styles.loginTitle}>Ro‘yxatdan o‘tish</Text>
                <Text style={styles.loginSubtitle}>
                  Zoovita hamjamiyatiga qo‘shiling!
                </Text>
              </View>


              {/* Full Name Input */}
              <View style={styles.inputContainer}>
                <Feather name="user" size={20} color="#7C8A79" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Ism va familiya"
                  placeholderTextColor="#A3B1A0"
                  value={regName}
                  onChangeText={setRegName}
                />
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Feather name="mail" size={20} color="#7C8A79" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Email (ixtiyoriy)"
                  placeholderTextColor="#A3B1A0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={regEmail}
                  onChangeText={setRegEmail}
                />
              </View>

              {/* Create Password Input */}
              <View style={styles.inputContainer}>
                <Feather name="lock" size={20} color="#7C8A79" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Parol yarating"
                  placeholderTextColor="#A3B1A0"
                  secureTextEntry={regSecureText}
                  value={regPassword}
                  onChangeText={setRegPassword}
                />
                <TouchableOpacity onPress={() => setRegSecureText(!regSecureText)}>
                  <Feather
                    name={regSecureText ? 'eye-off' : 'eye'}
                    size={20}
                    color="#7C8A79"
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>



              {/* Terms and Conditions Checkbox */}
              <View style={styles.utilityRow}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  activeOpacity={0.8}
                  onPress={() => setAgreeTerms(!agreeTerms)}
                >
                  <Ionicons
                    name={agreeTerms ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={agreeTerms ? '#3C8E2D' : '#7C8A79'}
                  />
                  <Text style={styles.checkboxLabel}>
                    <Text style={styles.checkboxGreenLink}>Shartlar</Text> va <Text style={styles.checkboxGreenLink}>maxfiylik siyosatiga</Text> roziman
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Register Button */}
              <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={handleRegister}>
                <Text style={styles.buttonText}>Ro‘yxatdan o‘tish</Text>
              </TouchableOpacity>

              {/* Social Login Buttons Removed */}

              {/* Redirect to Login */}
              <View style={styles.signupRow}>
                <Text style={styles.signupText}>Hisobingiz bormi? </Text>
                <TouchableOpacity activeOpacity={0.7} onPress={() => navigateTo('login')}>
                  <Text style={styles.signupLink}>Tizimga kirish</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </Animated.View>
      </ImageBackground>
        {/* Phone Code Modal */}
        <Modal visible={showPhoneCodeModal} transparent animationType="fade">
          <TouchableOpacity style={styles.addModalOverlay} activeOpacity={1} onPress={() => setShowPhoneCodeModal(false)}>
            <View style={styles.addModalContent}>
              <View style={styles.addModalHeader}>
                <Text style={styles.addModalTitle}>Davlat kodini tanlang</Text>
                <TouchableOpacity onPress={() => setShowPhoneCodeModal(false)}>
                  <Feather name="x" size={24} color="#15330F" />
                </TouchableOpacity>
              </View>
              {phoneCodes.map((item) => (
                <TouchableOpacity 
                  key={item.code} 
                  style={[styles.addModalItem, { paddingVertical: 12 }]}
                  onPress={() => {
                    setSelectedPhoneCode(item.code);
                    setPhoneNumber('');
                    setRegPhone('');
                    setShowPhoneCodeModal(false);
                  }}
                >
                  <Text style={{fontSize: 20, marginRight: 12}}>{item.flag}</Text>
                  <Text style={[styles.addModalItemText, { flex: 1 }]}>{item.name}</Text>
                  <Text style={styles.addModalItemText}>{item.code}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
        {/* Forgot Password Modal */}
        <Modal visible={showForgotPasswordModal} transparent animationType="fade">
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'padding'} style={{flex:1}}>
            <TouchableOpacity style={styles.addModalOverlay} activeOpacity={1} onPress={() => setShowForgotPasswordModal(false)}>
              <View style={styles.addModalContent}>
                <View style={styles.addModalHeader}>
                  <Text style={styles.addModalTitle}>Parolni tiklash</Text>
                  <TouchableOpacity onPress={() => setShowForgotPasswordModal(false)}>
                    <Feather name="x" size={24} color="#15330F" />
                  </TouchableOpacity>
                </View>
                <Text style={{color: '#7C8A79', marginBottom: 16, fontSize: 14}}>
                  Parolni tiklash uchun email manzilingizni kiriting. Sizga tiklash havolasi yuboriladi.
                </Text>
                <View style={styles.inputContainer}>
                  <Feather name="mail" size={20} color="#7C8A79" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Emailingizni kiriting"
                    placeholderTextColor="#A3B1A0"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={resetPasswordEmail}
                    onChangeText={setResetPasswordEmail}
                  />
                </View>
                <TouchableOpacity style={styles.btnPrimary} onPress={handleForgotPasswordSubmit}>
                  <Text style={styles.btnPrimaryText}>Tasdiqlash</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Modal>

        {/* New Password Modal */}
        <Modal visible={showNewPasswordModal} transparent animationType="fade">
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'padding'} style={{flex:1}}>
            <TouchableOpacity style={styles.addModalOverlay} activeOpacity={1}>
              <View style={styles.addModalContent}>
                <View style={styles.addModalHeader}>
                  <Text style={styles.addModalTitle}>Yangi parol o'rnatish</Text>
                  <TouchableOpacity onPress={() => {
                    setShowNewPasswordModal(false);
                    setNewPasswordToken(null);
                  }}>
                    <Feather name="x" size={24} color="#15330F" />
                  </TouchableOpacity>
                </View>
                <Text style={{color: '#7C8A79', marginBottom: 16, fontSize: 14}}>
                  Yangi parolingizni kiriting (kamida 6 ta belgi).
                </Text>
                <View style={styles.inputContainer}>
                  <Feather name="lock" size={20} color="#7C8A79" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Yangi parol"
                    placeholderTextColor="#A3B1A0"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Feather name="lock" size={20} color="#7C8A79" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Yangi parolni tasdiqlang"
                    placeholderTextColor="#A3B1A0"
                    secureTextEntry
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                  />
                </View>
                <TouchableOpacity style={styles.btnPrimary} onPress={handleNewPasswordSubmit}>
                  <Text style={styles.btnPrimaryText}>Parolni yangilash</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Modal>

        {/* Chat Modal */}
        <Modal visible={showChatModal} animationType="slide" onRequestClose={() => setShowChatModal(false)}>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <View style={styles.chatHeader}>
              <TouchableOpacity onPress={() => setShowChatModal(false)} style={styles.chatBackBtn}>
                <Feather name="chevron-left" size={24} color="#15330F" />
              </TouchableOpacity>
              <Text style={styles.chatHeaderTitle} numberOfLines={1}>{chatOtherUserName || 'Xabar yozish'}</Text>
              <View style={{ width: 24 }} />
            </View>
            
            <ScrollView 
              style={styles.chatMessagesContainer} 
              contentContainerStyle={{ padding: 16 }}
              ref={chatScrollRef}
              onContentSizeChange={() => chatScrollRef.current && chatScrollRef.current.scrollToEnd({animated: true})}
            >
              {chatMessages.length === 0 ? (
                <View style={styles.chatEmptyState}>
                  <Feather name="message-circle" size={48} color="#DCE3DA" />
                  <Text style={styles.chatEmptyText}>Xabar yozishni boshlang</Text>
                </View>
              ) : (
                chatMessages.map(msg => (
                  <View key={msg.id} style={[styles.chatMsgBubble, msg.is_me ? styles.chatMsgMe : styles.chatMsgOther]}>
                    <Text style={[styles.chatMsgText, msg.is_me ? styles.chatMsgTextMe : styles.chatMsgTextOther]}>
                      {msg.text}
                    </Text>
                    <Text style={[styles.chatMsgTime, msg.is_me ? styles.chatMsgTimeMe : styles.chatMsgTimeOther]}>
                      {(() => {
                        const d = new Date(msg.created_at);
                        const h = d.getHours().toString().padStart(2, '0');
                        const m = d.getMinutes().toString().padStart(2, '0');
                        return `${h}:${m}`;
                      })()}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>
            
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <View style={styles.chatInputContainer}>
                <TextInput
                  style={styles.chatInput}
                  placeholder="Xabar yozish..."
                  placeholderTextColor="#A3B1A0"
                  value={chatInputText}
                  onChangeText={setChatInputText}
                  multiline
                />
                <TouchableOpacity 
                  style={[styles.chatSendBtn, !chatInputText.trim() && {opacity: 0.5}]} 
                  disabled={!chatInputText.trim() || isSendingMessage}
                  onPress={sendChatMessage}
                >
                  <Feather name="send" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topContainer: {
    flex: 1,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: -80,
  },
  topSectionLogin: {
    marginTop: -20,
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  logo: {
    width: '100%',
    height: 380,
  },
  logoLogin: {
    height: 260, // Keep it same size as welcome screen logo
  },
  bottomCardWelcome: {
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 50,
    backgroundColor: 'transparent',
  },
  bottomCardLogin: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 15,
    maxHeight: '75%',
  },
  welcomeContent: {
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 40,
  },
  leafHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#15330F',
    marginTop: 8,
  },
  loginSubtitle: {
    fontSize: 14,
    color: '#7C8A79',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F9F5',
    borderWidth: 1,
    borderColor: '#E6ECE5',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
  },
  inputFocused: {
    borderColor: '#3C8E2D',
    backgroundColor: '#ffffff',
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#15330F',
  },
  phonePrefix: {
    fontSize: 15,
    color: '#15330F',
    fontWeight: '600',
    marginRight: 2,
  },
  eyeIcon: {
    padding: 4,
  },
  utilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#7C8A79',
    marginLeft: 8,
  },
  checkboxGreenLink: {
    color: '#3C8E2D',
    fontWeight: '600',
  },
  forgotPassword: {
    fontSize: 14,
    color: '#3C8E2D',
    fontWeight: '600',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2F7A29',
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: '#2F7A29',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
    width: '100%',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonArrow: {
    color: '#ffffff',
    fontSize: 24,
    marginLeft: 12,
    fontWeight: '500',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E6ECE5',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#A3B1A0',
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E6ECE5',
    paddingVertical: 16,
    borderRadius: 30,
    marginBottom: 12,
  },
  socialLogo: {
    width: 22,
    height: 22,
    marginRight: 10,
    resizeMode: 'contain',
  },
  socialButtonText: {
    fontSize: 15,
    color: '#2C3A27',
    fontWeight: '600',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signupText: {
    fontSize: 14,
    color: '#7C8A79',
  },
  signupLink: {
    fontSize: 14,
    color: '#3C8E2D',
    fontWeight: '700',
  },

  // --- DASHBOARD STYLES ---
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  dashboardHeaderArea: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    paddingBottom: 10,
  },
  dashboardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerBrand: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerGreeting: {
    fontSize: 16,
    fontWeight: '800',
    color: '#15330F',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#7C8A79',
    lineHeight: 18,
  },
  headerActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF7EE',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerActionText: {
    fontSize: 12,
    color: '#3C8E2D',
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F5F7F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#3C8E2D',
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  dashboardLogo: {
    height: 40,
    width: 160,
  },
  dashboardScroll: {
    paddingBottom: 90,
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7F5',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#15330F',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#F5F7F5',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swiperContainer: {
    height: SWIPER_HEIGHT,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
  },
  swiperScrollView: {
    flex: 1,
  },
  slideWrapper: {
    width: SCREEN_WIDTH - 32,
    height: SWIPER_HEIGHT,
    backgroundColor: '#FDFDFE',
    borderRadius: 24,
    overflow: 'hidden',
  },
  slideImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FDFDFE',
  },
  slideOverlay: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  slideBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3C8E2D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  slideBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '750',
  },
  swiperDots: {
    position: 'absolute',
    bottom: 12,
    right: 20,
    flexDirection: 'row',
    gap: 6,
  },
  swiperDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  swiperDotActive: {
    width: 14,
    backgroundColor: '#FFFFFF',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 12,
  },
  categoryItem: {
    alignItems: 'center',
    width: 80,
  },
  categoryIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryName: {
    fontSize: 11,
    color: '#2C3A27',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#15330F',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 12,
    color: '#3C8E2D',
    fontWeight: '700',
  },
  cardsScrollContainer: {
    paddingHorizontal: 16,
    gap: 14,
  },
  animalCard: {
    width: 165,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F3EF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
    position: 'relative',
    marginBottom: 8,
  },
  animalCardImage: {
    width: '100%',
    height: 110,
    resizeMode: 'cover',
  },
  tagWrapper: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#3C8E2D',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardDetails: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15330F',
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 11,
    color: '#7C8A79',
    marginBottom: 6,
  },
  cardPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#3C8E2D',
  },
  productCard: {
    width: 155,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F3EF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 8,
  },
  productImageWrapper: {
    position: 'relative',
    backgroundColor: '#F7FAF6',
    alignItems: 'center',
    justifyContent: 'center',
    height: 110,
  },
  productCardImage: {
    width: '75%',
    height: '75%',
    resizeMode: 'contain',
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#EA4335',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '850',
  },
  productDetails: {
    padding: 10,
  },
  productTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15330F',
    height: 32,
    marginBottom: 6,
  },
  priceCartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  productPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#3C8E2D',
  },
  productOldPrice: {
    fontSize: 10,
    color: '#A3B1A0',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  addToCartBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#E6F4EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerWrapper: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 10,
  },
  bannerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E9F5E7',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#D8ECDC',
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
  },
  shieldWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTextWrapper: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#15330F',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 11,
    color: '#5C6C58',
    lineHeight: 14,
  },
  bannerRight: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  bannerDeliveryImage: {
    width: 50,
    height: 36,
    resizeMode: 'contain',
  },
  bannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2F7A29',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  bannerBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  servicesTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#15330F',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 14,
  },
  servicesContainer: {
    paddingHorizontal: 16,
    gap: 14,
  },
  serviceItem: {
    alignItems: 'center',
    width: 90,
  },
  serviceIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#F5F7F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 10,
    color: '#2C3A27',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 12,
  },
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: Platform.OS === 'ios' ? 68 : 60,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderTopWidth: 1,
    borderTopColor: '#F2F6F2',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: Platform.OS === 'ios' ? 14 : 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
  },
  tabIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  tabIconWrapperActive: {
    backgroundColor: '#3C8E2D',
    shadowColor: '#3C8E2D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 56,
    paddingTop: 4,
    paddingBottom: 2,
    paddingHorizontal: 6,
  },
  tabIconLabelRow: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '700',
    color: '#7C8A79',
    textAlign: 'center',
    lineHeight: 14,
  },
  tabLabelActive: {
    color: '#3C8E2D',
    fontWeight: '800',
  },
  tabAddButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3C8E2D',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    marginHorizontal: 10,
    shadowColor: '#3C8E2D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  profileSectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#15330F',
    marginTop: 24,
    marginBottom: 12,
  },
  profileContainer: {
    flex: 1,
    backgroundColor: '#FAFBF9',
  },
  profileHeaderArea: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    paddingBottom: 10,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  profileHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#15330F',
  },
  profileHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileHeaderIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EDE7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  profileScroll: {
    paddingBottom: 220,
    paddingHorizontal: 16,
  },
  profileSummaryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginTop: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F0F4EF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  profileAvatarContainer: {
    position: 'relative',
    width: 88,
    height: 88,
    marginRight: 16,
  },
  profileAvatarWrapper: {
    width: 88,
    height: 88,
    borderRadius: 44,
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: '#3C8E2D',
    backgroundColor: '#FAFCFA',
  },
  profileAvatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#15330F',
    marginBottom: 4,
  },
  profileContact: {
    fontSize: 12.5,
    color: '#7C8A79',
    marginBottom: 2,
  },
  profileBadgesRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  profileBadge: {
    backgroundColor: '#EFF7EE',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  profileBadgePillAlt: {
    backgroundColor: '#F5F2FF',
  },
  profileBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3C8E2D',
  },
  profileBadgeTextAlt: {
    color: '#6E3CBC',
  },
  profileStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  profileStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8ECE7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  profileStatCardLast: {
    marginRight: 0,
  },
  profileStatNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#15330F',
    marginBottom: 4,
  },
  profileStatLabel: {
    fontSize: 12,
    color: '#7C8A79',
    fontWeight: '500',
  },
  profileSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 6,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E8ECE7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  profileServiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  profileServiceDivider: {
    height: 1,
    backgroundColor: '#F1F4F0',
    marginHorizontal: 16,
  },
  profileServiceTexts: {
    flex: 1,
    marginLeft: 14,
  },
  profileServiceTitle: {
    fontSize: 14.5,
    color: '#15330F',
    fontWeight: '700',
    marginBottom: 2,
  },
  profileServiceSubtitle: {
    fontSize: 12,
    color: '#7C8A79',
  },
  profileServiceIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBanner: {
    backgroundColor: '#E9F5E7',
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D8ECDC',
  },
  profileBannerContent: {
    marginBottom: 14,
  },
  profileBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#15330F',
    marginBottom: 2,
  },
  profileBannerSubtitle: {
    fontSize: 11,
    lineHeight: 15,
    color: '#4E5B4B',
  },
  profileBannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C6B13',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: '#1C6B13',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  profileBannerButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  profileStickyBanner: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: Platform.OS === 'ios' ? 95 : 85,
    backgroundColor: '#F1FAF0',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#D8ECDC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 8,
  },
  premiumShieldContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  premiumShieldInner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ scale: 0.8 }],
  },
  premiumShieldPaw: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 13,
  },
  premiumTextContainer: {
    flex: 1,
    marginHorizontal: 12,
    justifyContent: 'center',
  },
  catScreenContainer: {
    flex: 1,
    backgroundColor: '#FAFBF9',
  },
  catHeaderArea: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3EF',
  },
  catHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  catHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F3EF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  catHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#15330F',
  },
  catScrollContent: {
    paddingBottom: 90,
  },
  catInfoBox: {
    flexDirection: 'row',
    backgroundColor: '#EDF5EC',
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  catInfoIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D0E7D2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  catInfoText: {
    flex: 1,
    fontSize: 12,
    color: '#2C3E29',
    lineHeight: 16,
  },
  catFilterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
  },
  catFilterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F7F5',
    borderWidth: 1,
    borderColor: '#EAEFEA',
    marginRight: 8,
  },
  catFilterPillActive: {
    backgroundColor: '#3C8E2D',
    borderColor: '#3C8E2D',
  },
  catFilterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7C8A79',
  },
  catFilterPillTextActive: {
    color: '#FFFFFF',
  },
  catSectionWrapper: {
    marginBottom: 20,
  },
  catSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  catSectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catSectionIconBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  catSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#15330F',
  },
  catSeeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catSeeAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3C8E2D',
    marginRight: 2,
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  catGridCard: {
    width: CAT_CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F2EF',
    borderRadius: 12,
    padding: 6,
    alignItems: 'center',
    marginBottom: 8,
    marginRight: 6,
  },
  catCardImageWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#F9FBFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  catCardImage: {
    width: '100%',
    height: '100%',
  },
  catCardName: {
    fontSize: 9,
    fontWeight: '700',
    color: '#15330F',
    textAlign: 'center',
    height: 24,
    lineHeight: 12,
  },
  catCardCount: {
    fontSize: 8,
    color: '#7C8A79',
    textAlign: 'center',
    marginTop: 2,
  },
  // --- FAVORITES SCREEN ---
  favScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  favGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  favCard: {
    width: (SCREEN_WIDTH - 40) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  favCardImageWrapper: {
    width: '100%',
    height: 150,
    position: 'relative',
  },
  favCardImage: {
    width: '100%',
    height: '100%',
  },
  favCardTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#3C8E2D',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  favCardTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  favCardHeart: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favCardDetails: {
    padding: 10,
  },
  favCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15330F',
    marginBottom: 4,
  },
  favCardLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  favCardLocation: {
    fontSize: 10,
    color: '#7C8A79',
    flex: 1,
  },
  favCardPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#3C8E2D',
  },
  favEmptyIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F7EF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  favEmptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#15330F',
    textAlign: 'center',
    marginBottom: 10,
  },
  favEmptySubtitle: {
    fontSize: 14,
    color: '#7C8A79',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  favGoHomeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3C8E2D',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 28,
    shadowColor: '#3C8E2D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  favGoHomeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  
  // --- LISTINGS SCREEN STYLES ---
  listingsScreenContainer: {
    flex: 1,
    backgroundColor: '#FAFBF9',
  },
  listingsHeaderArea: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    paddingBottom: 10,
  },
  listingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  listingsHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EDE7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  listingsHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#15330F',
  },
  listingsNotificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#3C8E2D',
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  listingsNotificationText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  listingsSearchSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 16,
    gap: 12,
  },
  listingsSearchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8ECE7',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  listingsSearchIcon: {
    marginRight: 8,
  },
  listingsSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#15330F',
  },
  listingsFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8ECE7',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  listingsFilterButtonText: {
    fontSize: 14,
    color: '#15330F',
    fontWeight: '700',
  },
  listingsCatContainer: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    gap: 10,
  },
  listingsCatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8ECE7',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  listingsCatPillActive: {
    backgroundColor: '#EFF7EE',
    borderColor: '#3C8E2D',
  },
  listingsCatPillText: {
    fontSize: 13,
    color: '#2C3A27',
    fontWeight: '600',
  },
  listingsCatPillTextActive: {
    color: '#3C8E2D',
  },
  listingsCatPillMore: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8ECE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listingsSortingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  listingsDropdownButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8ECE7',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  listingsDropdownText: {
    flex: 1,
    fontSize: 12,
    color: '#15330F',
    fontWeight: '700',
  },
  listingsScrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 12,
  },
  listingsItemCard: {
    flexDirection: 'column',
    width: (SCREEN_WIDTH - 32 - 12) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F3EF',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  listingsItemImageWrapper: {
    width: '100%',
    height: 110,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#FAFBF9',
  },
  listingsItemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  listingsItemTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagYangi: {
    backgroundColor: '#3C8E2D',
  },
  tagSotiladi: {
    backgroundColor: '#1E88E5',
  },
  tagTop: {
    backgroundColor: '#3C8E2D',
  },
  listingsItemTagText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  listingsItemPhotosBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  listingsItemPhotosText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  listingsItemDetails: {
    paddingTop: 8,
    flex: 1,
    justifyContent: 'space-between',
  },
  listingsItemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listingsItemTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#15330F',
    marginTop: 2,
  },
  listingsItemHeartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  listingsItemLocation: {
    fontSize: 10,
    color: '#7C8A79',
    marginTop: 2,
  },
  listingsItemDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  listingsItemDetailsText: {
    fontSize: 10,
    color: '#7C8A79',
  },
  listingsItemPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#3C8E2D',
    marginTop: 4,
  },
  listingsItemSellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F5F7F5',
    paddingTop: 6,
  },
  listingsItemSellerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listingsItemSellerAvatar: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 4,
  },
  listingsItemSellerName: {
    fontSize: 10,
    color: '#2C3A27',
    fontWeight: '700',
    maxWidth: 55,
  },
  listingsItemDate: {
    fontSize: 9,
    color: '#7C8A79',
  },

  // --- SUBCATEGORIES SCREEN STYLES ---
  subcatScreenContainer: {
    flex: 1,
    backgroundColor: '#FAFBF9',
  },
  subcatHeaderArea: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    paddingBottom: 10,
  },
  subcatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  subcatHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EDE7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  subcatHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#15330F',
  },
  subcatSearchSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  subcatSearchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8ECE7',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  subcatSearchIcon: {
    marginRight: 8,
  },
  subcatSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#15330F',
  },
  subcatScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  subcatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  subcatGridCard: {
    flexDirection: 'column',
    width: (SCREEN_WIDTH - 32 - 12) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F0F3EF',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  subcatCardImageWrapper: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FAFBF9',
    marginBottom: 8,
  },
  subcatCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  subcatCardInfo: {
    paddingHorizontal: 2,
  },
  subcatCardName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#15330F',
  },
  subcatCardCount: {
    fontSize: 11,
    color: '#7C8A79',
    marginTop: 2,
  },
  subcatEmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  subcatEmptyText: {
    fontSize: 14,
    color: '#7C8A79',
    fontWeight: '600',
  },

  // --- E'LON BERISH (POST AD) SCREEN STYLES ---
  addContainer: {
    flex: 1,
    backgroundColor: '#FAFBF9',
  },
  addHeaderArea: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    paddingBottom: 10,
  },
  addHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  addHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EDE7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  addHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#15330F',
  },
  addScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
  },
  addStepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  addStepItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  addStepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#C5D4C2',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addStepCircleActive: {
    backgroundColor: '#3C8E2D',
    borderColor: '#3C8E2D',
  },
  addStepCircleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C8A79',
  },
  addStepCircleTextActive: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addStepLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7C8A79',
  },
  addStepLabelActive: {
    color: '#3C8E2D',
    fontWeight: '800',
  },
  addStepLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#E8EDE7',
    marginHorizontal: 8,
  },
  addPhotoUploadCard: {
    width: '100%',
    height: 130,
    borderRadius: 16,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: '#C5D4C2',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  addPhotoIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF7EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  addPhotoUploadTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15330F',
  },
  addPhotoNote: {
    fontSize: 11,
    color: '#7C8A79',
    marginBottom: 16,
    paddingLeft: 4,
  },
  addThumbnailsScroll: {
    marginBottom: 16,
    paddingLeft: 4,
  },
  addThumbnailWrapper: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    marginRight: 8,
  },
  addThumbnailImage: {
    width: '100%',
    height: '100%',
  },
  addThumbnailRemoveBtn: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F3EF',
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 3,
  },
  addFieldLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#15330F',
    marginBottom: 6,
    marginTop: 12,
  },
  addDropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFBF9',
    borderWidth: 1,
    borderColor: '#E8ECE7',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  addDropdownValue: {
    fontSize: 14,
    color: '#15330F',
    fontWeight: '600',
  },
  addInputField: {
    backgroundColor: '#FAFBF9',
    borderWidth: 1,
    borderColor: '#E8ECE7',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    color: '#15330F',
  },
  addInputFieldMultiline: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
  },
  addPriceInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFBF9',
    borderWidth: 1,
    borderColor: '#E8ECE7',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  addPriceInputField: {
    flex: 1,
    fontSize: 14,
    color: '#15330F',
    paddingRight: 8,
  },
  addPriceSuffix: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7C8A79',
  },
  addSubmitBtn: {
    backgroundColor: '#3C8E2D',
    borderRadius: 28,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#3C8E2D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  addSubmitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  addModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  addModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  addModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7F5',
    paddingBottom: 12,
  },
  addModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#15330F',
  },
  addModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#FAFBF9',
  },
  addModalItemText: {
    fontSize: 14,
    color: '#15330F',
    fontWeight: '600',
  },
  addModalItemTextActive: {
    color: '#3C8E2D',
    fontWeight: '800',
  },
  addHeaderCentered: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  addStepLineActive: {
    backgroundColor: '#3C8E2D',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    marginBottom: 12,
  },
  chipButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FAFBF9',
    borderWidth: 1,
    borderColor: '#E8ECE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipButtonActive: {
    backgroundColor: '#3C8E2D',
    borderColor: '#3C8E2D',
  },
  chipButtonActiveTop: {
    backgroundColor: '#3C8E2D',
    borderColor: '#3C8E2D',
  },
  chipButtonActiveYangi: {
    backgroundColor: '#1E6BFF',
    borderColor: '#1E6BFF',
  },
  chipButtonActiveOddiy: {
    backgroundColor: '#7C8A79',
    borderColor: '#7C8A79',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C8A79',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  backStepBtn: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#3C8E2D',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  backStepBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#3C8E2D',
  },
  submitStepBtn: {
    flex: 2,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3C8E2D',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3C8E2D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  submitStepBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  previewSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#15330F',
    marginBottom: 12,
    paddingLeft: 4,
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F3EF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 3,
  },
  previewImageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
    backgroundColor: '#FAFBF9',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  previewTagBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  previewTagTop: {
    backgroundColor: '#3C8E2D',
  },
  previewTagYangi: {
    backgroundColor: '#1E6BFF',
  },
  previewTagText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  previewDetails: {
    padding: 16,
  },
  previewCategoryText: {
    fontSize: 11,
    color: '#7C8A79',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  previewTitleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#15330F',
    marginBottom: 8,
  },
  previewPriceText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#3C8E2D',
    marginBottom: 12,
  },
  previewMetaRow: {
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#FAFBF9',
    paddingTop: 12,
  },
  previewMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  previewMetaText: {
    fontSize: 12,
    color: '#7C8A79',
    fontWeight: '600',
  },
  previewDetailsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#15330F',
    borderBottomWidth: 1,
    borderBottomColor: '#FAFBF9',
    paddingBottom: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FAFBF9',
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C8A79',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#15330F',
  },
  descPreviewBox: {
    backgroundColor: '#FAFBF9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8ECE7',
    padding: 12,
    minHeight: 80,
    marginTop: 4,
  },
  descPreviewText: {
    fontSize: 13,
    color: '#15330F',
    lineHeight: 18,
  },
  modalSectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#7C8A79',
    backgroundColor: '#FAFBF9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 12,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  galleryGridItem: {
    width: (SCREEN_WIDTH - 40 - 20) / 3,
    height: 90,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#FAFBF9',
    borderWidth: 1,
    borderColor: '#F0F3EF',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gallerySelectionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(60, 142, 45, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gallerySelectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#3C8E2D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gallerySelectedBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#3C8E2D',
  },
  galleryItemLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 2,
    alignItems: 'center',
  },
  galleryItemLabelText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  galleryConfirmBtn: {
    backgroundColor: '#3C8E2D',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#3C8E2D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  galleryConfirmBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  addModalItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addModalItemIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8ECE7',
    position: 'relative',
  },
  mapBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPinWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPulseCircle: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(60, 142, 45, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(60, 142, 45, 0.4)',
    zIndex: -1,
  },
  mapOverlayLabel: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(21, 51, 15, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  mapOverlayText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  gpsBtn: {
    backgroundColor: '#3C8E2D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  gpsBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  // ========== DETAIL SCREEN STYLES ==========
  detailOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 999,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3EF',
    backgroundColor: '#FFFFFF',
  },
  detailHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F7F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#15330F',
  },
  detailGalleryWrapper: {
    position: 'relative',
    width: '100%',
    height: 270,
  },
  detailMainImage: {
    width: '100%',
    height: 270,
  },
  detailTagBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  detailTagTop: {
    backgroundColor: '#FF8C00',
  },
  detailTagYangi: {
    backgroundColor: '#3C8E2D',
  },
  detailTagText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  detailPhotoBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  detailPhotoBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  detailThumbnailsContainer: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  detailThumb: {
    width: 68,
    height: 62,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  detailThumbActive: {
    borderColor: '#3C8E2D',
  },
  detailThumbImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailThumbMore: {
    width: '100%',
    height: '100%',
    backgroundColor: '#15330F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailThumbMoreText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  detailBody: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#15330F',
    marginBottom: 6,
    lineHeight: 28,
  },
  detailLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 12,
  },
  detailLocationText: {
    fontSize: 13,
    color: '#7C8A79',
    fontWeight: '600',
  },
  detailChipsRow: {
    gap: 8,
    paddingBottom: 4,
    marginBottom: 16,
  },
  detailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  detailChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  detailPriceBlock: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3EF',
  },
  detailPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailPrice: {
    fontSize: 24,
    fontWeight: '900',
    color: '#3C8E2D',
  },
  detailPriceChip: {
    backgroundColor: '#EFF7EE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  detailPriceChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3C8E2D',
  },
  detailPriceUpdated: {
    fontSize: 11,
    color: '#A3B1A0',
    fontWeight: '500',
  },
  detailSellerCard: {
    backgroundColor: '#FAFBF9',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8ECE7',
    marginBottom: 16,
    overflow: 'hidden',
  },
  detailSellerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3EF',
  },
  detailSellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E8ECE7',
  },
  detailSellerName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#15330F',
  },
  detailSellerOnlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3C8E2D',
  },
  detailSellerStatus: {
    fontSize: 11,
    color: '#7C8A79',
    fontWeight: '500',
  },
  detailProfileBtn: {
    backgroundColor: '#EFF7EE',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D4EAD0',
  },
  detailProfileBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3C8E2D',
  },
  detailSellerActions: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  detailSellerAction: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
  },
  detailSellerActionText: {
    fontSize: 11,
    color: '#15330F',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  detailSellerActionDivider: {
    width: 1,
    backgroundColor: '#E8ECE7',
    marginVertical: 4,
  },
  detailSection: {
    backgroundColor: '#FAFBF9',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8ECE7',
    padding: 14,
    marginBottom: 12,
  },
  detailSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#15330F',
    flex: 1,
  },
  detailDescText: {
    fontSize: 13,
    color: '#4A5A44',
    lineHeight: 20,
  },
  detailSpecsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailSpecItem: {
    width: '46%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E8ECE7',
  },
  detailSpecLabel: {
    fontSize: 11,
    color: '#7C8A79',
    fontWeight: '600',
  },
  detailSpecValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#15330F',
    paddingLeft: 20,
  },
  detailMapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF7EE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  detailMapBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3C8E2D',
  },
  detailLocationFullText: {
    fontSize: 13,
    color: '#4A5A44',
    fontWeight: '600',
    lineHeight: 20,
  },
  detailBottomBar: {
    flexDirection: 'row',
    padding: 14,
    paddingBottom: Platform.OS === 'ios' ? 24 : 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F3EF',
    gap: 10,
  },
  detailChatBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#3C8E2D',
    backgroundColor: '#FFFFFF',
  },
  detailChatBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#3C8E2D',
  },
  detailCallBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#3C8E2D',
    shadowColor: '#3C8E2D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  detailCallBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // ===== SIMILAR LISTINGS =====
  detailSimilarSection: {
    marginTop: 8,
    marginBottom: 8,
  },
  detailSimilarTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#15330F',
    marginBottom: 12,
    paddingHorizontal: 0,
  },
  detailSimilarScroll: {
    gap: 12,
    paddingBottom: 4,
  },
  detailSimilarCard: {
    width: 168,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8ECE7',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  detailSimilarImgWrapper: {
    width: '100%',
    height: 120,
    position: 'relative',
  },
  detailSimilarImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailSimilarTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  detailSimilarTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  detailSimilarHeart: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailSimilarInfo: {
    padding: 10,
  },
  detailSimilarItemTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#15330F',
    marginBottom: 2,
  },
  detailSimilarLocation: {
    fontSize: 10,
    color: '#A3B1A0',
    fontWeight: '500',
    flex: 1,
  },
  detailSimilarPrice: {
    fontSize: 13,
    fontWeight: '900',
    color: '#3C8E2D',
    marginTop: 5,
  },

  // ===== AI CHAT OVERLAY STYLE =====
  aiChatOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 9999,
  },
  aiChatHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F0',
  },
  aiChatHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#15330F',
  },
  aiChatSubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F7FAF6',
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECE7',
  },
  aiChatBotName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#15330F',
  },
  aiChatBotStatus: {
    fontSize: 12,
    color: '#7C8A79',
    marginTop: 1,
  },
  aiMessageRow: {
    flexDirection: 'row',
    marginVertical: 6,
    width: '100%',
  },
  aiMessageRowUser: {
    justifyContent: 'flex-end',
  },
  aiMessageRowBot: {
    justifyContent: 'flex-start',
  },
  aiMessageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  aiMessageBubbleUser: {
    backgroundColor: '#2E7D32',
    borderBottomRightRadius: 4,
  },
  aiMessageBubbleBot: {
    backgroundColor: '#F0F3F0',
    borderBottomLeftRadius: 4,
  },
  aiMessageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  aiMessageTextUser: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  aiMessageTextBot: {
    color: '#15330F',
  },
  aiChatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8ECE7',
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  aiChatInput: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#D0DCD0',
    paddingHorizontal: 16,
    color: '#15330F',
    backgroundColor: '#FAFCFA',
    fontSize: 14,
  },
  aiChatSendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ===== NOTIFICATION CENTER STYLE =====
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8ECE7',
  },
  notificationCardUnread: {
    backgroundColor: '#F3FAF2',
    borderColor: '#D2ECD0',
  },
  notificationCardLeft: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EA4335',
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#15330F',
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 12,
    color: '#556052',
    lineHeight: 16,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 10,
    color: '#909F8C',
    fontWeight: '500',
  },

  // ===== FILTER MODAL STYLE =====
  filterModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  filterModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '90%',
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F0',
    paddingBottom: 12,
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: '850',
    color: '#15330F',
  },
  filterSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#15330F',
    marginTop: 18,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3FAF2',
    borderWidth: 1,
    borderColor: '#E2ECE0',
  },
  filterChipActive: {
    backgroundColor: '#E6F4EA',
    borderColor: '#3C8E2D',
  },
  filterChipText: {
    fontSize: 12,
    color: '#556052',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#3C8E2D',
    fontWeight: '700',
  },
  filterCategoryGrid: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  filterCatCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FAFCFA',
    borderWidth: 1,
    borderColor: '#E8ECE7',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  filterCatCardActive: {
    borderColor: '#3C8E2D',
    backgroundColor: '#F3FAF2',
  },
  filterCatIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterCatCardText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#556052',
  },
  filterCatCardTextActive: {
    color: '#15330F',
  },
  filterPriceInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterInputWrapper: {
    flex: 1,
  },
  filterInputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7C8A79',
    marginBottom: 4,
  },
  filterPriceInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#D0DCD0',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#15330F',
    backgroundColor: '#FAFCFA',
  },
  filterShortcutsRow: {
    paddingVertical: 10,
    gap: 8,
  },
  filterShortcutChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0F3F0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E6E2',
  },
  filterShortcutText: {
    fontSize: 11,
    color: '#7C8A79',
    fontWeight: '700',
  },
  filterToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFCFA',
    borderWidth: 1,
    borderColor: '#E8ECE7',
    borderRadius: 12,
    padding: 12,
  },
  filterToggleTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#15330F',
  },
  filterToggleDesc: {
    fontSize: 11,
    color: '#7C8A79',
    marginTop: 2,
  },
  filterToggleChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F0F3F0',
    borderWidth: 1,
    borderColor: '#E2E6E2',
  },
  filterToggleChipActive: {
    backgroundColor: '#E6F4EA',
    borderColor: '#3C8E2D',
  },
  filterToggleChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C8A79',
  },
  filterToggleChipTextActive: {
    color: '#3C8E2D',
  },
  filterModalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F3F0',
    paddingTop: 16,
  },
  filterResetBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C0CDC0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterResetBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7C8A79',
  },
  filterApplyBtn: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#3C8E2D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterApplyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ===== DROPDOWN MODAL STYLE =====
  dropdownModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  dropdownModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#15330F',
    marginBottom: 14,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F0',
  },
  dropdownItemActive: {
    backgroundColor: '#FAFCFA',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#556052',
    fontWeight: '500',
  },
  dropdownItemTextActive: {
    color: '#3C8E2D',
    fontWeight: '700',
  },

  // --- PROFILE UPGRADES & SUB-SCREEN STYLES ---
  profileLogoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEB',
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 40,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FFD1D2',
  },
  profileLogoutBtnText: {
    fontSize: 16,
    color: '#FF5A5F',
    fontWeight: '600',
  },
  profileAvatarCameraBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#3C8E2D',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  ordersTabRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3EF',
  },
  ordersTabBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  ordersTabBtnActive: {
    borderBottomColor: '#3C8E2D',
  },
  ordersTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C8A79',
  },
  ordersTabTextActive: {
    color: '#3C8E2D',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8EDE7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderIdText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#15330F',
  },
  orderDateText: {
    fontSize: 12,
    color: '#7C8A79',
    marginTop: 2,
  },
  orderStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  orderStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDivider: {
    height: 1,
    backgroundColor: '#F0F3EF',
    marginVertical: 12,
  },
  orderItemsList: {
    gap: 8,
  },
  orderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderItemName: {
    fontSize: 14,
    color: '#15330F',
    flex: 1,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#15330F',
    marginLeft: 12,
  },
  orderCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotalLabel: {
    fontSize: 14,
    color: '#7C8A79',
  },
  orderTotalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3C8E2D',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#15330F',
    marginTop: 16,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#7C8A79',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  emptyStateBtn: {
    backgroundColor: '#3C8E2D',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 24,
  },
  emptyStateBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyStateText: {
    fontSize: 15,
    color: '#7C8A79',
    marginTop: 12,
  },
  favGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  favCard: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EDE7',
    overflow: 'hidden',
  },
  favCardImageWrapper: {
    height: 120,
    position: 'relative',
  },
  favCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favCardHeartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  favCardContent: {
    padding: 10,
  },
  favCardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#15330F',
  },
  favCardPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3C8E2D',
    marginTop: 4,
  },
  favCardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  favCardMetaText: {
    fontSize: 11,
    color: '#7C8A79',
    flex: 1,
  },
  subScreenAddBtn: {
    backgroundColor: '#3C8E2D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 16,
    gap: 8,
  },
  subScreenAddBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  petCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8EDE7',
    alignItems: 'center',
  },
  petCardImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    resizeMode: 'cover',
  },
  petCardInfo: {
    flex: 1,
    marginLeft: 14,
  },
  petCardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#15330F',
  },
  petCardBreed: {
    fontSize: 13,
    color: '#556052',
    marginTop: 2,
  },
  petCardAge: {
    fontSize: 12,
    color: '#7C8A79',
    marginTop: 2,
  },
  petVaccineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  petVaccineBadgeOk: {
    backgroundColor: '#E6F4EA',
  },
  petVaccineBadgeNo: {
    backgroundColor: '#FFEBEB',
  },
  petVaccineText: {
    fontSize: 11,
    fontWeight: '600',
  },
  subScreenFormCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8EDE7',
    marginBottom: 20,
  },
  formCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#15330F',
    marginBottom: 14,
  },
  formCategoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 6,
  },
  formChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F0F3EF',
    borderWidth: 1,
    borderColor: '#E8EDE7',
  },
  formChipActive: {
    backgroundColor: '#E6F4EA',
    borderColor: '#3C8E2D',
  },
  formChipText: {
    fontSize: 13,
    color: '#556052',
  },
  formChipTextActive: {
    color: '#3C8E2D',
    fontWeight: '600',
  },
  formBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  formCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#7C8A79',
  },
  formCancelBtnText: {
    color: '#7C8A79',
    fontSize: 14,
    fontWeight: '600',
  },
  formSaveBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#3C8E2D',
    borderRadius: 10,
  },
  formSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8EDE7',
  },
  addressCardIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E6F4EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressCardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  addressCardName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#15330F',
  },
  addressCardFull: {
    fontSize: 13,
    color: '#556052',
    marginTop: 2,
  },
  addressCardDetails: {
    fontSize: 13,
    color: '#7C8A79',
    marginTop: 2,
  },
  paymentCardWrapper: {
    borderRadius: 16,
    padding: 18,
    height: 160,
    marginBottom: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  paymentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentCardType: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  paymentCardNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 2,
    marginVertical: 14,
  },
  paymentCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  paymentCardLabel: {
    color: '#FFFFFF',
    fontSize: 8,
    opacity: 0.6,
    marginBottom: 2,
  },
  paymentCardHolder: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  paymentCardExpiry: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  premiumOverlayHeaderCard: {
    backgroundColor: '#15330F',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  premiumOverlayHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumOverlayIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FAFCFA15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumOverlayStatus: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '800',
  },
  premiumOverlayActiveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  premiumOverlayExpiry: {
    color: '#FAFCFA95',
    fontSize: 11,
    marginTop: 12,
  },
  premiumSavingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8EDE7',
    marginBottom: 16,
  },
  premiumSavingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  premiumSavingsLabel: {
    fontSize: 13,
    color: '#556052',
  },
  premiumSavingsValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#15330F',
  },
  premiumSavingsDivider: {
    height: 1,
    backgroundColor: '#F0F3EF',
    marginVertical: 10,
  },
  premiumSavingsTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  premiumSavingsTotalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#15330F',
  },
  premiumSavingsTotalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3C8E2D',
  },
  premiumBenefitsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EDE7',
    padding: 14,
    gap: 16,
  },
  premiumBenefitRow: {
    flexDirection: 'row',
  },
  premiumBenefitIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E6F4EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumBenefitTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#15330F',
  },
  premiumBenefitDesc: {
    fontSize: 12,
    color: '#7C8A79',
    marginTop: 2,
    lineHeight: 16,
  },
  premiumCancelObunaBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    marginTop: 20,
    marginBottom: 30,
  },
  premiumCancelObunaBtnText: {
    color: '#FF5A5F',
    fontSize: 14,
    fontWeight: '600',
  },
  helpCenterIntro: {
    fontSize: 15,
    fontWeight: '700',
    color: '#15330F',
    marginBottom: 12,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EDE7',
    marginBottom: 10,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    gap: 10,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#15330F',
    flex: 1,
  },
  faqAnswerContainer: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F3EF',
    paddingTop: 10,
  },
  faqAnswerText: {
    fontSize: 13,
    color: '#556052',
    lineHeight: 18,
  },
  helpSupportBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4EA',
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    marginBottom: 20,
  },
  helpSupportTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#15330F',
  },
  helpSupportSubtitle: {
    fontSize: 11,
    color: '#556052',
    marginTop: 2,
  },
  helpSupportBtn: {
    backgroundColor: '#3C8E2D',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginLeft: 8,
  },
  helpSupportBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  contactSuccessCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8EDE7',
    marginBottom: 16,
  },
  contactSuccessIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3C8E2D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactSuccessTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#15330F',
    marginBottom: 8,
  },
  contactSuccessDesc: {
    fontSize: 13,
    color: '#556052',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  contactSuccessBtn: {
    backgroundColor: '#3C8E2D',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  contactSuccessBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  contactSubmitBtn: {
    backgroundColor: '#3C8E2D',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  contactSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  contactChannelsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EDE7',
    padding: 14,
    gap: 12,
  },
  contactChannelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactChannelIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactChannelTitle: {
    fontSize: 12,
    color: '#7C8A79',
  },
  contactChannelValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#15330F',
    marginTop: 1,
  },
  docCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8EDE7',
  },
  docTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#15330F',
    marginBottom: 4,
  },
  docMeta: {
    fontSize: 12,
    color: '#7C8A79',
    marginBottom: 16,
  },
  docParagraph: {
    fontSize: 14,
    color: '#556052',
    lineHeight: 20,
    marginBottom: 12,
  },
  docSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#15330F',
    marginTop: 12,
    marginBottom: 8,
  },
  editProfileSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#15330F',
    marginBottom: 10,
  },
  editProfileInputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#556052',
    marginTop: 14,
    marginBottom: 6,
  },
  editProfileTextInput: {
    borderWidth: 1,
    borderColor: '#E8EDE7',
    backgroundColor: '#FAFCFA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#15330F',
    flexDirection: 'row',
    alignItems: 'center',
  },
  editProfileTextInputDisabled: {
    backgroundColor: '#F0F3EF',
    borderColor: '#E8EDE7',
  },
  editProfileTextDisabled: {
    color: '#7C8A79',
    fontSize: 14,
  },
  editProfileActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  editProfileCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#7C8A79',
  },
  editProfileCancelBtnText: {
    color: '#7C8A79',
    fontSize: 14,
    fontWeight: '600',
  },
  editProfileSaveBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#3C8E2D',
    borderRadius: 10,
  },
  editProfileSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  presetAvatarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  presetAvatarWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  presetAvatarWrapperActive: {
    borderColor: '#3C8E2D',
  },
  presetAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 23,
    resizeMode: 'cover',
  },
  presetAvatarCheckBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#3C8E2D',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  // Google sign in styles
  googleModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  googleModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 360,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  googleLogoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  googleBigLogo: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  googleModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202124',
    textAlign: 'center',
    marginBottom: 6,
  },
  googleModalSubtitle: {
    fontSize: 13,
    color: '#5F6368',
    textAlign: 'center',
    lineHeight: 18,
  },
  googleAccountsList: {
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  googleAccountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DADCE0',
  },
  googleAvatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleAvatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  googleAccountDetails: {
    marginLeft: 12,
    flex: 1,
  },
  googleAccountName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3C4043',
  },
  googleAccountEmail: {
    fontSize: 12,
    color: '#5F6368',
    marginTop: 1,
  },
  googleModalFooter: {
    alignItems: 'center',
  },
  googleFooterText: {
    fontSize: 11,
    color: '#5F6368',
    textAlign: 'center',
    lineHeight: 15,
    marginBottom: 16,
  },
  googleCancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  googleCancelBtnText: {
    color: '#1A73E8',
    fontWeight: '600',
    fontSize: 14,
  },
  googleConsentContainer: {
    marginBottom: 20,
  },
  googleConsentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 12,
  },
  googleConsentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  googleCheckIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E6F4EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  googleCheckText: {
    color: '#137333',
    fontWeight: '800',
    fontSize: 11,
  },
  googleConsentText: {
    fontSize: 13,
    color: '#3C4043',
  },
  googleConsentNotice: {
    fontSize: 12,
    color: '#5F6368',
    lineHeight: 16,
    marginTop: 16,
  },
  googleConsentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  googleConsentCancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  googleConsentCancelText: {
    color: '#5F6368',
    fontWeight: '600',
    fontSize: 14,
  },
  googleConsentAllowBtn: {
    backgroundColor: '#1A73E8',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  googleConsentAllowText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  googleLoadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  googleLoadingText: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: '600',
    color: '#202124',
    textAlign: 'center',
  },
  googleLoadingSubText: {
    marginTop: 6,
    fontSize: 12,
    color: '#5F6368',
    textAlign: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4EF',
  },
  chatBackBtn: {
    padding: 4,
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#15330F',
    flex: 1,
    textAlign: 'center',
  },
  chatMessagesContainer: {
    flex: 1,
    backgroundColor: '#F7F9F6',
  },
  chatEmptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  chatEmptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#A3B1A0',
    fontWeight: '500',
  },
  chatMsgBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  chatMsgMe: {
    alignSelf: 'flex-end',
    backgroundColor: '#3C8E2D',
    borderBottomRightRadius: 4,
  },
  chatMsgOther: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6EBE5',
    borderBottomLeftRadius: 4,
  },
  chatMsgText: {
    fontSize: 15,
    lineHeight: 22,
  },
  chatMsgTextMe: {
    color: '#FFFFFF',
  },
  chatMsgTextOther: {
    color: '#15330F',
  },
  chatMsgTime: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  chatMsgTimeMe: {
    color: '#E6F4EA',
  },
  chatMsgTimeOther: {
    color: '#A3B1A0',
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F4EF',
  },
  chatInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#F7F9F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15,
    color: '#15330F',
  },
  chatSendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3C8E2D',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    marginBottom: 0,
  },
});
