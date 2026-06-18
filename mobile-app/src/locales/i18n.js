import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uz from './uz.json';
import ru from './ru.json';
import en from './en.json';

const translations = { uz, ru, en };
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('uz'); // default to uzbek
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load saved language on startup
    const loadLanguage = async () => {
      try {
        const savedLang = await AsyncStorage.getItem('app_language');
        if (savedLang && translations[savedLang]) {
          setLanguage(savedLang);
        }
      } catch (error) {
        console.log('Failed to load language', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadLanguage();
  }, []);

  const changeLanguage = async (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
      try {
        await AsyncStorage.setItem('app_language', lang);
      } catch (error) {
        console.log('Failed to save language', error);
      }
    }
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, isLoaded }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
