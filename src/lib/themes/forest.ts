// Forest Theme - Natural green and earth tones
import type { Theme } from './types';
import { defaultTypography, defaultSpacing, defaultBorderRadius, defaultShadows, defaultAnimations } from './defaults';

export const forestTheme: Theme = {
  name: 'forest',
  displayName: 'Forest',
  description: 'Natural green and earth tones',
  typography: {
    ...defaultTypography,
    fontFamily: '"Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: {
      ...defaultTypography.fontSize,
      base: '1.05rem',
    },
  },
  spacing: defaultSpacing,
  borderRadius: {
    ...defaultBorderRadius,
    md: '0.4rem',
    lg: '0.6rem',
  },
  shadows: {
    ...defaultShadows,
    flap: '0 3px 8px rgba(34, 139, 34, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
  },
  animations: {
    ...defaultAnimations,
    splitFlapDuration: '425ms',
  },
  colors: {
    light: {
      primary: '120 60 40',  // Deep forest green
      primaryForeground: '0 0 100',
      secondary: '80 20 90',  // Light sage
      secondaryForeground: '120 40 15',
      background: '75 20 97',  // Very light green-beige
      foreground: '120 30 10',
      card: '75 15 99',
      cardForeground: '120 30 10',
      popover: '75 15 99',
      popoverForeground: '120 30 10',
      muted: '80 20 90',
      mutedForeground: '100 15 40',
      accent: '90 50 92',  // Light mint accent
      accentForeground: '120 60 25',
      destructive: '5 75 55',  // Earthy red
      destructiveForeground: '0 0 98',
      border: '90 20 85',
      input: '90 20 85',
      ring: '120 60 40',
      flightScheduled: '100 20 45',  // Olive
      flightOnTime: '120 70 35',  // Forest green
      flightDelayed: '35 80 50',  // Amber
      flightCancelled: '5 70 45',  // Rust
      flightBoarding: '90 60 45',  // Mint
      flightDeparted: '140 55 40',  // Emerald
      flightArriving: '65 85 45',  // Lime green
      flightArrived: '120 70 35',  // Forest green
      flapBackground: '80 15 94',
      flapText: '120 40 15',
      flapBorder: '90 20 85',
      flapShadow: '100 20 75',
    },
    dark: {
      primary: '120 60 55',  // Forest green
      primaryForeground: '75 20 95',
      secondary: '100 20 15',  // Dark olive
      secondaryForeground: '75 20 95',
      background: '110 25 6',  // Deep forest
      foreground: '75 20 95',
      card: '110 20 9',
      cardForeground: '75 20 95',
      popover: '110 20 9',
      popoverForeground: '75 20 95',
      muted: '100 20 16',
      mutedForeground: '90 15 60',
      accent: '90 50 25',  // Dark mint accent
      accentForeground: '90 60 80',
      destructive: '5 62 40',  // Dark rust
      destructiveForeground: '0 0 98',
      border: '100 20 16',
      input: '100 20 16',
      ring: '120 60 55',
      flightScheduled: '100 20 40',  // Olive
      flightOnTime: '120 70 45',  // Forest green
      flightDelayed: '35 80 55',  // Amber
      flightCancelled: '5 60 35',  // Rust
      flightBoarding: '90 60 50',  // Mint
      flightDeparted: '140 55 50',  // Emerald
      flightArriving: '65 85 55',  // Lime green
      flightArrived: '120 70 45',  // Forest green
      flapBackground: '110 20 8',
      flapText: '90 60 85',
      flapBorder: '100 20 14',
      flapShadow: '110 25 3',
    }
  }
};