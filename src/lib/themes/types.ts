// Theme type definitions for FlightBoard
export interface Theme {
  name: string;
  displayName: string;
  description: string;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
  animations: ThemeAnimations;
}

export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryForeground: string;
  
  // Secondary colors
  secondary: string;
  secondaryForeground: string;
  
  // UI colors
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  
  // Status colors
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  
  // Border and input
  border: string;
  input: string;
  ring: string;
  
  // Flight status colors
  flightScheduled: string;
  flightOnTime: string;
  flightDelayed: string;
  flightCancelled: string;
  flightBoarding: string;
  flightDeparted: string;
  flightArriving: string;
  flightArrived: string;
  
  // Split-flap display colors
  flapBackground: string;
  flapText: string;
  flapBorder: string;
  flapShadow: string;
}

export interface ThemeTypography {
  // Font families
  fontFamily: string;
  fontFamilyMono: string;
  fontFamilyDisplay: string;
  
  // Font sizes
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  
  // Font weights
  fontWeight: {
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  
  // Line heights
  lineHeight: {
    none?: string;
    tight: string;
    snug?: string;
    normal: string;
    relaxed: string;
    loose?: string;
  };
  
  // Letter spacing
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
  };
}

export interface ThemeSpacing {
  base: string;
  scale: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
}

export interface ThemeBorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl'?: string;
  '3xl'?: string;
  full: string;
}

export interface ThemeShadows {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl'?: string;
  inner: string;
  flap: string;
}

export interface ThemeAnimations {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    linear: string;
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    bounce: string;
  };
  splitFlapDuration: string;
}