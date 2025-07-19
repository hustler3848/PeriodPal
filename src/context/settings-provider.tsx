
'use client';

import { localizations } from '@/lib/localization';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const SETTINGS_STORAGE_KEY = 'periodpal-settings-v1';

interface Settings {
  region: string;
  language: string;
}

interface SettingsContextType extends Settings {
  setRegion: (region: string) => void;
  setLanguage: (language: string) => void;
  isInitialized: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [region, setRegionState] = useState<string>('usa');
  const [language, setLanguageState] = useState<string>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        const { region: savedRegion, language: savedLanguage } = JSON.parse(savedSettings);
        if (savedRegion && localizations[savedRegion]) {
          setRegionState(savedRegion);
        }
        if (savedLanguage && localizations[savedRegion]?.languages.some(l => l.value === savedLanguage)) {
          setLanguageState(savedLanguage);
        }
      }
    } catch (error) {
      console.error('Error reading settings from localStorage', error);
    } finally {
        setIsInitialized(true);
    }
  }, []);

  const saveSettings = (settings: Settings) => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to localStorage', error);
    }
  };

  const setRegion = (newRegion: string) => {
    if (localizations[newRegion]) {
      setRegionState(newRegion);
      // When region changes, update language to the default for that region
      const defaultLanguage = localizations[newRegion].languages[0].value;
      setLanguageState(defaultLanguage);
      saveSettings({ region: newRegion, language: defaultLanguage });
    }
  };

  const setLanguage = (newLanguage: string) => {
    if (localizations[region].languages.some(l => l.value === newLanguage)) {
      setLanguageState(newLanguage);
      saveSettings({ region, language: newLanguage });
    }
  };

  return (
    <SettingsContext.Provider value={{ region, setRegion, language, setLanguage, isInitialized }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
