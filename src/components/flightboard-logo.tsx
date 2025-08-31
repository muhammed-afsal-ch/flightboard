'use client';

import React from 'react';
import { useTheme } from '@/contexts/theme-context';

interface FlightBoardLogoProps {
  className?: string;
}

export function FlightBoardLogo({ className = '' }: FlightBoardLogoProps) {
  const { theme, effectiveColorMode } = useTheme();
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Airplane icon */}
        <path
          d="M16 4L8 14H14L12 24L20 14H14L16 4Z"
          fill={`hsl(${theme.colors[effectiveColorMode].primary})`}
          opacity="0.8"
        />
        <path
          d="M4 18H8L10 20H22L24 18H28"
          stroke={`hsl(${theme.colors[effectiveColorMode].primary})`}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle
          cx="16"
          cy="18"
          r="2"
          fill={`hsl(${theme.colors[effectiveColorMode].primary})`}
        />
      </svg>
      <div className="flex flex-col">
        <span 
          className="text-sm font-bold tracking-wider"
          style={{ color: `hsl(${theme.colors[effectiveColorMode].primary})` }}
        >
          FLIGHTBOARD
        </span>
        <span 
          className="text-xs opacity-60"
          style={{ color: `hsl(${theme.colors[effectiveColorMode].mutedForeground})` }}
        >
          LIVE TRACKER
        </span>
      </div>
    </div>
  );
}