// Matrix Theme - Nerdy cyberpunk style with animated background
import type { Theme } from './types';
import { defaultSpacing, defaultBorderRadius, defaultShadows, defaultAnimations } from './defaults';

export const matrixTheme: Theme = {
  name: 'matrix',
  displayName: 'Matrix',
  description: 'Cyberpunk terminal with animated digital rain',
  typography: {
    fontFamily: '"Fira Code", "Courier New", monospace',
    fontFamilyDisplay: '"Fira Code", "Courier New", monospace',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
  },
  spacing: defaultSpacing,
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.375rem',
    xl: '0.5rem',
    '2xl': '0.75rem',
    '3xl': '1rem',
    full: '9999px',
  },
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 255, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 255, 0, 0.1), 0 2px 4px -1px rgba(0, 255, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 255, 0, 0.1), 0 4px 6px -2px rgba(0, 255, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 255, 0, 0.1), 0 10px 10px -5px rgba(0, 255, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 255, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 255, 0, 0.06)',
    flap: '0 0 20px rgba(0, 255, 0, 0.5), inset 0 0 10px rgba(0, 255, 0, 0.2)',
  },
  animations: {
    ...defaultAnimations,
    splitFlapDuration: '200ms',
  },
  colors: {
    light: {
      // Light mode for Matrix theme (rarely used but available)
      primary: '120 100 35',  // Bright green
      primaryForeground: '0 0 0',
      secondary: '120 20 85',
      secondaryForeground: '120 100 20',
      background: '120 10 95',  // Very light green tint
      foreground: '120 100 15',
      card: '120 5 98',
      cardForeground: '120 100 15',
      popover: '120 5 98',
      popoverForeground: '120 100 15',
      muted: '120 10 90',
      mutedForeground: '120 50 30',
      accent: '120 60 88',
      accentForeground: '120 100 25',
      destructive: '0 100 50',
      destructiveForeground: '0 0 100',
      border: '120 20 80',
      input: '120 20 80',
      ring: '120 100 35',
      flightScheduled: '120 30 40',
      flightOnTime: '120 100 35',
      flightDelayed: '60 100 40',
      flightCancelled: '0 100 40',
      flightBoarding: '120 80 40',
      flightDeparted: '120 100 35',
      flightArriving: '90 100 40',
      flightArrived: '120 100 35',
      flapBackground: '120 10 92',
      flapText: '120 100 20',
      flapBorder: '120 30 75',
      flapShadow: '120 50 60',
    },
    dark: {
      // Primary dark mode for Matrix theme
      primary: '120 100 50',  // Matrix green
      primaryForeground: '0 0 0',
      secondary: '120 50 10',  // Dark green
      secondaryForeground: '120 100 60',
      background: '0 0 0',  // Pure black
      backgroundAlpha: '1',  // Fully opaque
      foreground: '120 100 60',  // Bright green text
      card: '120 50 5',  // Very dark green
      cardForeground: '120 100 60',
      popover: '120 50 5',
      popoverForeground: '120 100 60',
      muted: '120 30 8',
      mutedForeground: '120 60 40',  // Dimmer green
      accent: '120 100 15',
      accentForeground: '120 100 70',
      destructive: '0 100 45',
      destructiveForeground: '0 0 0',
      border: '120 50 15',
      input: '120 50 15',
      ring: '120 100 50',
      flightScheduled: '120 40 35',
      flightOnTime: '120 100 50',
      flightDelayed: '60 100 50',  // Yellow-green
      flightCancelled: '0 100 45',  // Red
      flightBoarding: '120 80 55',
      flightDeparted: '120 100 50',
      flightArriving: '90 100 50',  // Lime
      flightArrived: '120 100 50',
      flapBackground: '120 50 3',
      flapText: '120 100 70',
      flapBorder: '120 50 20',
      flapShadow: '120 100 10',
    }
  }
};