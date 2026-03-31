import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import ru from '../locales/ru.json';
import kz from '../locales/kz.json';

const LanguageContext = createContext();

const translations = { ru, kz };

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(localStorage.getItem('locale') || 'ru');

  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);

  const t = useMemo(() => {
    return (key) => {
      const keys = key.split('.');
      let value = translations[locale];
      for (const k of keys) {
        if (!value || value[k] === undefined) return key;
        value = value[k];
      }
      return value;
    };
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    setLocale,
    t
  }), [locale, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
