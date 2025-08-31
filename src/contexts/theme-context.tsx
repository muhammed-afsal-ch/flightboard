'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Theme, 
  getTheme, 
  getAvailableThemes, 
  applyTheme,
  getSystemColorMode,
  getEffectiveColorMode,
  saveThemePreference,
  getSavedThemePreference,
  saveColorModePreference,
  getSavedColorModePreference,
  DEFAULT_THEME,
  DEFAULT_COLOR_MODE
} from '@/lib/themes';

interface ThemeContextType {
  theme: Theme;
  themes: Theme[];
  colorMode: 'system' | 'light' | 'dark';
  effectiveColorMode: 'light' | 'dark';
  setTheme: (themeName: string) => void;
  setColorMode: (mode: 'system' | 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  defaultColorMode?: 'system' | 'light' | 'dark';
}

export function ThemeProvider({ 
  children, 
  defaultTheme: defaultThemeProp,
  defaultColorMode: defaultColorModeProp 
}: ThemeProviderProps) {
  const availableThemes = getAvailableThemes();
  
  // Initialize with defaults or environment variables
  const initialThemeName = defaultThemeProp || 
    process.env.NEXT_PUBLIC_DEFAULT_THEME || 
    DEFAULT_THEME;
  const initialColorMode = defaultColorModeProp || 
    (process.env.NEXT_PUBLIC_DEFAULT_COLOR_MODE as 'system' | 'light' | 'dark') || 
    DEFAULT_COLOR_MODE;

  const [themeName, setThemeName] = useState(initialThemeName);
  const [colorMode, setColorModeState] = useState<'system' | 'light' | 'dark'>(initialColorMode);
  const [effectiveColorMode, setEffectiveColorMode] = useState<'light' | 'dark'>('light');
  const [theme, setThemeState] = useState<Theme>(() => 
    getTheme(initialThemeName) || availableThemes[0]
  );

  // Load saved preferences on mount
  useEffect(() => {
    const savedTheme = getSavedThemePreference();
    const savedColorMode = getSavedColorModePreference();
    
    if (savedTheme) {
      const foundTheme = getTheme(savedTheme);
      if (foundTheme && availableThemes.includes(foundTheme)) {
        setThemeName(savedTheme);
        setThemeState(foundTheme);
      }
    }
    
    if (savedColorMode) {
      setColorModeState(savedColorMode);
    }
  }, [availableThemes]);

  // Update effective color mode
  useEffect(() => {
    const updateEffectiveMode = () => {
      const effective = getEffectiveColorMode(colorMode);
      setEffectiveColorMode(effective);
    };

    updateEffectiveMode();

    // Listen for system theme changes
    if (colorMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => updateEffectiveMode();
      
      // Check if addEventListener is supported (it should be in modern browsers)
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handler);
        return () => mediaQuery.removeListener(handler);
      }
    }
  }, [colorMode]);

  // Apply theme when theme or color mode changes
  useEffect(() => {
    console.log('Applying theme:', theme.name, 'Mode:', effectiveColorMode);
    applyTheme(theme, effectiveColorMode);
  }, [theme, effectiveColorMode]);

  const setTheme = useCallback((newThemeName: string) => {
    console.log('Setting theme to:', newThemeName);
    const newTheme = getTheme(newThemeName);
    console.log('Found theme:', newTheme);
    if (newTheme && availableThemes.includes(newTheme)) {
      setThemeName(newThemeName);
      setThemeState(newTheme);
      saveThemePreference(newThemeName);
      console.log('Theme set successfully');
    } else {
      console.log('Theme not found or not available');
    }
  }, [availableThemes]);

  const setColorMode = useCallback((mode: 'system' | 'light' | 'dark') => {
    setColorModeState(mode);
    saveColorModePreference(mode);
  }, []);

  const value: ThemeContextType = {
    theme,
    themes: availableThemes,
    colorMode,
    effectiveColorMode,
    setTheme,
    setColorMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}