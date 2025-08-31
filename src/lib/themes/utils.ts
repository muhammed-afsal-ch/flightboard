// Theme utility functions
import type { Theme } from './types';

// Apply theme colors to CSS variables
export function applyTheme(theme: Theme, mode: 'light' | 'dark') {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  const colors = theme.colors[mode];
  
  // Apply color variables
  Object.entries(colors).forEach(([key, value]) => {
    const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    root.style.setProperty(cssVarName, value);
  });
  
  // Apply typography variables
  Object.entries(theme.typography).forEach(([key, value]) => {
    if (typeof value === 'string') {
      const cssVarName = `--font-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVarName, value);
    } else if (typeof value === 'object') {
      Object.entries(value).forEach(([subKey, subValue]) => {
        const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}-${subKey}`;
        root.style.setProperty(cssVarName, subValue as string);
      });
    }
  });
  
  // Apply spacing variables
  root.style.setProperty('--spacing-base', theme.spacing.base);
  Object.entries(theme.spacing.scale).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value);
  });
  
  // Apply border radius variables
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    root.style.setProperty(`--radius-${key}`, value);
  });
  
  // Apply shadow variables
  Object.entries(theme.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value);
  });
  
  // Apply animation variables
  Object.entries(theme.animations.duration).forEach(([key, value]) => {
    root.style.setProperty(`--duration-${key}`, value);
  });
  Object.entries(theme.animations.easing).forEach(([key, value]) => {
    root.style.setProperty(`--easing-${key}`, value);
  });
  root.style.setProperty('--split-flap-duration', theme.animations.splitFlapDuration);
  
  // Set theme name for reference
  root.setAttribute('data-theme', theme.name);
  root.setAttribute('data-theme-mode', mode);
}

// Get color mode preference (system, light, or dark)
export function getSystemColorMode(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Storage keys
const THEME_STORAGE_KEY = 'flightboard-theme';
const COLOR_MODE_STORAGE_KEY = 'flightboard-color-mode';

// Save theme preference to localStorage
export function saveThemePreference(themeName: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_STORAGE_KEY, themeName);
}

// Get saved theme preference from localStorage
export function getSavedThemePreference(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(THEME_STORAGE_KEY);
}

// Save color mode preference to localStorage
export function saveColorModePreference(mode: 'system' | 'light' | 'dark') {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode);
}

// Get saved color mode preference from localStorage
export function getSavedColorModePreference(): 'system' | 'light' | 'dark' {
  if (typeof window === 'undefined') return 'system';
  const saved = localStorage.getItem(COLOR_MODE_STORAGE_KEY);
  if (saved === 'light' || saved === 'dark' || saved === 'system') {
    return saved;
  }
  return 'system';
}

// Get effective color mode (resolves 'system' to actual mode)
export function getEffectiveColorMode(preference: 'system' | 'light' | 'dark'): 'light' | 'dark' {
  if (preference === 'system') {
    return getSystemColorMode();
  }
  return preference;
}