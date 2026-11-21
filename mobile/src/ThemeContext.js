import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getColors, makeTypography } from './theme';

const ThemeContext = createContext(null);
const STORAGE_KEY = '@ftx_theme_mode';

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState('dark');
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(saved => {
        if (saved === 'dark' || saved === 'light' || saved === 'system') setMode(saved);
      })
      .catch(() => {})
      .finally(() => setThemeLoaded(true));
  }, []);

  const setThemeMode = async next => {
    if (next !== 'dark' && next !== 'light' && next !== 'system') return;
    setMode(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next);
    } catch {}
  };

  const effectiveScheme = mode === 'system' ? systemScheme || 'dark' : mode;

  const value = useMemo(() => {
    const colors = getColors(effectiveScheme);
    return {
      mode,
      setThemeMode,
      scheme: effectiveScheme,
      isDark: effectiveScheme !== 'light',
      themeLoaded,
      colors,
      typography: makeTypography(colors),
    };
  }, [mode, effectiveScheme, themeLoaded]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};