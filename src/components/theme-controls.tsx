'use client';

import React from 'react';
import { ThemeSelector } from './theme-selector';
import { ColorModeToggle, ColorModeToggleCompact } from './color-mode-toggle';

interface ThemeControlsProps {
  compact?: boolean;
  className?: string;
}

export function ThemeControls({ compact = false, className = '' }: ThemeControlsProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <ThemeSelector />
      {compact ? <ColorModeToggleCompact /> : <ColorModeToggle />}
    </div>
  );
}

// Header-specific theme controls with responsive design
export function HeaderThemeControls() {
  return (
    <>
      {/* Full controls on larger screens */}
      <div className="hidden md:flex items-center gap-4">
        <ThemeSelector />
        <ColorModeToggle />
      </div>
      
      {/* Compact controls on mobile */}
      <div className="flex md:hidden items-center gap-2">
        <ColorModeToggleCompact />
      </div>
    </>
  );
}