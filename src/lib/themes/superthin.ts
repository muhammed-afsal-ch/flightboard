// Super Thin Theme - Minimal terminal style with reduced whitespace
import type { Theme } from './types';
import { defaultBorderRadius, defaultShadows, defaultAnimations } from './defaults';

export const superThinTheme: Theme = {
  name: 'superthin',
  displayName: 'Super Thin',
  description: 'Ultra-compact terminal interface',
  typography: {
    fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace',
    fontFamilyMono: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace',
    fontFamilyDisplay: '"SF Mono", "Monaco", "Inconsolata", monospace',
    fontSize: {
      xs: '0.625rem',   // 10px
      sm: '0.6875rem',  // 11px
      base: '0.75rem',  // 12px
      lg: '0.8125rem',  // 13px
      xl: '0.875rem',   // 14px
      '2xl': '1rem',    // 16px
      '3xl': '1.125rem', // 18px
      '4xl': '1.25rem',  // 20px
      '5xl': '1.5rem',   // 24px
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '500',  // Reduced from 600
      bold: '600',       // Reduced from 700
    },
    lineHeight: {
      tight: '1.1',      // Tighter than default
      normal: '1.3',     // Tighter than default
      relaxed: '1.4',    // Tighter than default
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
    },
  },
  spacing: {
    base: '0.25rem',  // Much smaller base (4px instead of 8px)
    scale: {
      xs: '0.125rem',  // 2px
      sm: '0.25rem',   // 4px
      md: '0.375rem',  // 6px
      lg: '0.5rem',    // 8px
      xl: '0.625rem',  // 10px
      '2xl': '0.75rem', // 12px
      '3xl': '1rem',    // 16px
    },
  },
  borderRadius: {
    none: '0',
    sm: '0.0625rem',  // 1px
    md: '0.125rem',   // 2px
    lg: '0.1875rem',  // 3px
    xl: '0.25rem',    // 4px
    full: '9999px',
  },
  shadows: {
    none: 'none',
    sm: 'none',  // No shadows for terminal feel
    md: 'none',
    lg: 'none',
    xl: 'none',
    inner: 'none',
    flap: 'none',
  },
  animations: {
    ...defaultAnimations,
    splitFlapDuration: '100ms',  // Faster animations
  },
  colors: {
    light: {
      primary: '180 60 40',  // Cyan
      primaryForeground: '0 0 100',
      secondary: '0 0 95',
      secondaryForeground: '0 0 20',
      background: '0 0 100',  // Pure white
      foreground: '0 0 0',    // Pure black
      card: '0 0 100',
      cardForeground: '0 0 0',
      popover: '0 0 100',
      popoverForeground: '0 0 0',
      muted: '0 0 97',
      mutedForeground: '0 0 40',
      accent: '0 0 95',
      accentForeground: '0 0 0',
      destructive: '0 100 50',
      destructiveForeground: '0 0 100',
      border: '0 0 85',  // Simple gray borders
      input: '0 0 85',
      ring: '180 60 40',
      flightScheduled: '0 0 50',
      flightOnTime: '120 60 35',
      flightDelayed: '45 100 50',
      flightCancelled: '0 100 50',
      flightBoarding: '180 60 40',
      flightDeparted: '210 60 40',
      flightArriving: '90 60 40',
      flightArrived: '120 60 35',
      flapBackground: '0 0 98',
      flapText: '0 0 0',
      flapBorder: '0 0 80',
      flapShadow: '0 0 70',
    },
    dark: {
      primary: '180 100 50',  // Bright cyan
      primaryForeground: '0 0 0',
      secondary: '0 0 15',
      secondaryForeground: '180 100 50',
      background: '0 0 0',  // Pure black
      foreground: '0 0 90',  // Light gray
      card: '0 0 5',  // Near black
      cardForeground: '0 0 90',
      popover: '0 0 5',
      popoverForeground: '0 0 90',
      muted: '0 0 10',
      mutedForeground: '0 0 60',
      accent: '0 0 20',
      accentForeground: '180 100 50',
      destructive: '0 100 45',
      destructiveForeground: '0 0 0',
      border: '0 0 20',  // Simple dark gray borders
      input: '0 0 20',
      ring: '180 100 50',
      flightScheduled: '0 0 50',
      flightOnTime: '120 100 45',
      flightDelayed: '45 100 50',
      flightCancelled: '0 100 45',
      flightBoarding: '180 100 50',
      flightDeparted: '210 100 50',
      flightArriving: '90 100 50',
      flightArrived: '120 100 45',
      flapBackground: '0 0 2',
      flapText: '180 100 60',
      flapBorder: '0 0 25',
      flapShadow: '0 0 0',
    }
  }
};