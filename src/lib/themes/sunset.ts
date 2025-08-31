// Sunset Theme - Warm orange and purple tones
import type { Theme } from './types';
import { defaultTypography, defaultSpacing, defaultBorderRadius, defaultShadows, defaultAnimations } from './defaults';

export const sunsetTheme: Theme = {
  name: 'sunset',
  displayName: 'Sunset',
  description: 'Warm orange and purple tones',
  typography: {
    ...defaultTypography,
    fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: {
      ...defaultTypography.fontWeight,
      normal: '400',
      medium: '500',
      semibold: '600',
    },
  },
  spacing: defaultSpacing,
  borderRadius: {
    ...defaultBorderRadius,
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  shadows: {
    ...defaultShadows,
    flap: '0 4px 10px rgba(255, 94, 77, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  },
  animations: {
    ...defaultAnimations,
    duration: {
      ...defaultAnimations.duration,
      normal: '350ms',
    },
    splitFlapDuration: '475ms',
  },
  colors: {
    light: {
      primary: '15 100 60',  // Vibrant orange-red
      primaryForeground: '0 0 100',
      secondary: '280 25 92',  // Light lavender
      secondaryForeground: '280 40 20',
      background: '20 40 98',  // Warm cream
      foreground: '280 30 10',
      card: '20 30 99',
      cardForeground: '280 30 10',
      popover: '20 30 99',
      popoverForeground: '280 30 10',
      muted: '280 20 92',
      mutedForeground: '280 20 45',
      accent: '320 60 94',  // Light pink accent
      accentForeground: '15 100 50',
      destructive: '0 75 60',
      destructiveForeground: '0 0 98',
      border: '20 30 88',
      input: '20 30 88',
      ring: '15 100 60',
      flightScheduled: '280 25 50',  // Lavender
      flightOnTime: '140 50 45',  // Sage
      flightDelayed: '30 100 55',  // Golden orange
      flightCancelled: '0 80 50',  // Red
      flightBoarding: '300 60 55',  // Magenta
      flightDeparted: '15 85 55',  // Orange-red
      flightArriving: '40 100 50',  // Yellow-orange
      flightArrived: '140 50 45',  // Sage
      flapBackground: '20 35 95',
      flapText: '280 40 10',
      flapBorder: '20 30 88',
      flapShadow: '15 60 75',
    },
    dark: {
      primary: '15 100 65',  // Vibrant orange-red
      primaryForeground: '280 40 8',
      secondary: '280 30 16',  // Dark purple
      secondaryForeground: '20 30 95',
      background: '280 35 7',  // Deep purple-black
      foreground: '20 30 95',
      card: '280 30 10',
      cardForeground: '20 30 95',
      popover: '280 30 10',
      popoverForeground: '20 30 95',
      muted: '280 25 18',
      mutedForeground: '280 20 60',
      accent: '320 60 25',  // Dark pink accent
      accentForeground: '320 70 80',
      destructive: '0 62 45',
      destructiveForeground: '0 0 98',
      border: '280 25 18',
      input: '280 25 18',
      ring: '15 100 65',
      flightScheduled: '280 25 45',  // Lavender
      flightOnTime: '140 50 50',  // Sage
      flightDelayed: '30 100 60',  // Golden orange
      flightCancelled: '0 70 40',  // Red
      flightBoarding: '300 60 60',  // Magenta
      flightDeparted: '15 85 65',  // Orange-red
      flightArriving: '40 100 60',  // Yellow-orange
      flightArrived: '140 50 50',  // Sage
      flapBackground: '280 30 10',
      flapText: '15 85 85',
      flapBorder: '280 25 16',
      flapShadow: '280 35 4',
    }
  }
};