// Ocean Theme - Calming blue and aqua tones
import type { Theme } from './types';
import { defaultTypography, defaultSpacing, defaultBorderRadius, defaultShadows, defaultAnimations } from './defaults';

export const oceanTheme: Theme = {
  name: 'ocean',
  displayName: 'Ocean',
  description: 'Calming blue and aqua tones',
  typography: {
    ...defaultTypography,
    fontFamily: '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  spacing: {
    ...defaultSpacing,
    scale: {
      ...defaultSpacing.scale,
      md: '1.75rem',
    },
  },
  borderRadius: {
    ...defaultBorderRadius,
    md: '0.5rem',
    lg: '0.75rem',
  },
  shadows: {
    ...defaultShadows,
    flap: '0 3px 10px rgba(0, 100, 200, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  },
  animations: {
    ...defaultAnimations,
    splitFlapDuration: '450ms',
  },
  colors: {
    light: {
      primary: '195 100 50',  // Bright cyan
      primaryForeground: '0 0 100',
      secondary: '200 25 92',  // Light blue-gray
      secondaryForeground: '200 40 20',
      background: '195 40 98',  // Very light cyan tint
      foreground: '200 40 10',
      card: '195 30 99',
      cardForeground: '200 40 10',
      popover: '195 30 99',
      popoverForeground: '200 40 10',
      muted: '200 25 92',
      mutedForeground: '200 20 40',
      accent: '185 60 95',  // Light aqua accent
      accentForeground: '195 100 35',
      destructive: '350 84 60',
      destructiveForeground: '0 0 98',
      border: '200 30 85',
      input: '200 30 85',
      ring: '195 100 50',
      flightScheduled: '200 25 50',
      flightOnTime: '160 70 45',  // Sea green
      flightDelayed: '30 100 50',  // Coral
      flightCancelled: '350 70 50',
      flightBoarding: '180 70 45',  // Turquoise
      flightDeparted: '195 80 50',  // Cyan
      flightArriving: '170 100 40',  // Teal
      flightArrived: '160 70 45',  // Sea green
      flapBackground: '195 30 96',
      flapText: '200 40 10',
      flapBorder: '200 30 85',
      flapShadow: '195 50 70',
    },
    dark: {
      primary: '195 100 60',  // Bright cyan
      primaryForeground: '200 40 5',
      secondary: '200 30 15',  // Dark blue-gray
      secondaryForeground: '195 30 95',
      background: '200 50 8',  // Deep ocean blue
      foreground: '195 30 95',
      card: '200 40 12',
      cardForeground: '195 30 95',
      popover: '200 40 12',
      popoverForeground: '195 30 95',
      muted: '200 25 18',
      mutedForeground: '200 20 60',
      accent: '185 60 25',  // Dark aqua accent
      accentForeground: '195 100 70',
      destructive: '350 62 45',
      destructiveForeground: '0 0 98',
      border: '200 30 20',
      input: '200 30 20',
      ring: '195 100 60',
      flightScheduled: '200 25 45',
      flightOnTime: '160 70 50',  // Sea green
      flightDelayed: '30 100 60',  // Coral
      flightCancelled: '350 60 40',
      flightBoarding: '180 70 55',  // Turquoise
      flightDeparted: '195 80 60',  // Cyan
      flightArriving: '170 100 50',  // Teal
      flightArrived: '160 70 50',  // Sea green
      flapBackground: '200 40 10',
      flapText: '195 100 85',
      flapBorder: '200 30 18',
      flapShadow: '200 50 5',
    }
  }
};