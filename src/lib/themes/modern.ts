// Modern Theme - Clean and minimalist design
import type { Theme } from './types';
import { defaultTypography, defaultSpacing, defaultBorderRadius, defaultShadows, defaultAnimations } from './defaults';

export const modernTheme: Theme = {
  name: 'modern',
  displayName: 'Modern',
  description: 'Clean and minimalist design',
  typography: {
    ...defaultTypography,
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontFamilyDisplay: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  },
  spacing: defaultSpacing,
  borderRadius: defaultBorderRadius,
  shadows: defaultShadows,
  animations: defaultAnimations,
  colors: {
    light: {
      primary: '262 83 58',  // Vibrant purple
      primaryForeground: '0 0 100',
      secondary: '262 30 92',
      secondaryForeground: '262 60 20',
      background: '260 25 98',  // Very light purple tint
      foreground: '260 40 13',
      card: '0 0 100',
      cardForeground: '260 40 13',
      popover: '0 0 100',
      popoverForeground: '260 40 13',
      muted: '260 25 94',
      mutedForeground: '260 20 45',
      accent: '262 60 95',  // Light purple accent
      accentForeground: '262 83 58',
      destructive: '351 84 52',
      destructiveForeground: '0 0 100',
      border: '260 30 88',
      input: '260 30 88',
      ring: '262 83 58',
      flightScheduled: '260 20 55',
      flightOnTime: '150 60 45',  // Teal
      flightDelayed: '25 95 53',  // Orange
      flightCancelled: '351 70 50',
      flightBoarding: '150 60 45',  // Teal
      flightDeparted: '262 60 55',  // Purple
      flightArriving: '45 93 47',  // Lime
      flightArrived: '150 60 45',  // Teal
      flapBackground: '260 25 96',
      flapText: '260 40 13',
      flapBorder: '260 30 88',
      flapShadow: '260 20 80',
    },
    dark: {
      primary: '262 83 65',  // Vibrant purple
      primaryForeground: '260 40 8',
      secondary: '260 30 18',
      secondaryForeground: '260 25 95',
      background: '260 40 8',  // Deep purple-black
      foreground: '260 25 95',
      card: '260 35 12',
      cardForeground: '260 25 95',
      popover: '260 35 12',
      popoverForeground: '260 25 95',
      muted: '260 25 20',
      mutedForeground: '260 20 60',
      accent: '262 60 25',  // Dark purple accent
      accentForeground: '262 83 75',
      destructive: '351 62 45',
      destructiveForeground: '260 25 95',
      border: '260 30 18',
      input: '260 30 18',
      ring: '262 83 65',
      flightScheduled: '260 20 50',
      flightOnTime: '150 60 50',  // Teal
      flightDelayed: '25 95 58',  // Orange
      flightCancelled: '351 60 40',
      flightBoarding: '150 60 50',  // Teal
      flightDeparted: '262 70 65',  // Purple
      flightArriving: '45 93 58',  // Lime
      flightArrived: '150 60 50',  // Teal
      flapBackground: '260 35 10',
      flapText: '260 25 92',
      flapBorder: '260 30 20',
      flapShadow: '260 40 5',
    }
  }
};