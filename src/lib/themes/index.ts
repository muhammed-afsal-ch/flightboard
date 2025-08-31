// Theme system exports
export type { Theme, ThemeColors, ThemeTypography, ThemeSpacing, ThemeBorderRadius, ThemeShadows, ThemeAnimations } from './types';
export { defaultTypography, defaultSpacing, defaultBorderRadius, defaultShadows, defaultAnimations } from './defaults';
export { airportTheme } from './airport';
export { modernTheme } from './modern';
export { oceanTheme } from './ocean';
export { forestTheme } from './forest';
export { sunsetTheme } from './sunset';
export { matrixTheme } from './matrix';
export { superThinTheme } from './superthin';
export * from './utils';

import { airportTheme } from './airport';
import { modernTheme } from './modern';
import { oceanTheme } from './ocean';
import { forestTheme } from './forest';
import { sunsetTheme } from './sunset';
import { matrixTheme } from './matrix';
import { superThinTheme } from './superthin';
import type { Theme } from './types';

// All available themes
export const themes: Theme[] = [
  airportTheme,
  modernTheme,
  oceanTheme,
  forestTheme,
  sunsetTheme,
  matrixTheme,
  superThinTheme,
];

// Get theme by name
export function getTheme(name: string): Theme | undefined {
  return themes.find(theme => theme.name === name);
}

// Get available themes from environment or use all themes
export function getAvailableThemes(): Theme[] {
  if (typeof window === 'undefined') {
    const availableThemes = process.env.NEXT_PUBLIC_AVAILABLE_THEMES;
    if (availableThemes) {
      const themeNames = availableThemes.split(',').map(name => name.trim());
      return themes.filter(theme => themeNames.includes(theme.name));
    }
  } else {
    const availableThemes = process.env.NEXT_PUBLIC_AVAILABLE_THEMES;
    if (availableThemes) {
      const themeNames = availableThemes.split(',').map(name => name.trim());
      return themes.filter(theme => themeNames.includes(theme.name));
    }
  }
  
  // Default to all themes if not configured
  return themes;
}

// Default theme
export const DEFAULT_THEME = 'airport';
export const DEFAULT_COLOR_MODE = 'system' as const;