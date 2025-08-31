'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/theme-context';
import styles from './flap-display.module.css';

interface FlapDisplayProps {
  value: string;
  size?: 'small' | 'medium' | 'large';
}

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -.:/';

export function FlapDisplay({ value, size = 'medium' }: FlapDisplayProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);
  const { theme, effectiveColorMode } = useTheme();

  useEffect(() => {
    if (value !== displayValue) {
      setIsFlipping(true);
      
      // Simulate flapping animation for Airport Classic theme
      if (theme.name === 'airport') {
        const flipDuration = 300;
        let iterations = 0;
        const maxIterations = 5;
        
        const interval = setInterval(() => {
          iterations++;
          if (iterations >= maxIterations) {
            clearInterval(interval);
            setDisplayValue(value);
            setTimeout(() => setIsFlipping(false), 100);
          } else {
            // Show random characters during flip
            const randomChar = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
            setDisplayValue(prev => {
              const chars = value.split('');
              return chars.map((char, i) => {
                if (prev[i] !== char) {
                  return Math.random() > 0.5 ? randomChar : char;
                }
                return char;
              }).join('');
            });
          }
        }, flipDuration / maxIterations);
        
        return () => clearInterval(interval);
      } else {
        // For other themes, just update immediately
        setDisplayValue(value);
        setTimeout(() => setIsFlipping(false), 100);
      }
    }
  }, [value, displayValue, theme.name]);

  const sizeClasses = theme.name === 'superthin' 
    ? {
        small: 'text-sm h-5',
        medium: 'text-base h-6',
        large: 'text-lg h-7'
      }
    : {
        small: 'text-xl h-8',
        medium: 'text-3xl h-12',
        large: 'text-5xl h-16'
      };

  // For Airport Classic theme, use split-flap display
  if (theme.name === 'airport') {
    return (
      <div 
        className={`${styles.flapDisplay} ${sizeClasses[size]} ${isFlipping ? styles.flipping : ''}`}
        style={{
          '--flap-bg': effectiveColorMode === 'dark' 
            ? 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)' 
            : 'linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 100%)',
          '--flap-border': effectiveColorMode === 'dark' ? '#333' : '#ccc',
          '--flap-text': `hsl(${theme.colors[effectiveColorMode].primary})`,
          '--flap-shadow': effectiveColorMode === 'dark' 
            ? 'inset 0 2px 4px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3)'
            : 'inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1)',
          '--flap-split': effectiveColorMode === 'dark' 
            ? 'rgba(0, 0, 0, 0.8)' 
            : 'rgba(0, 0, 0, 0.2)',
          '--flap-split-highlight': effectiveColorMode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(255, 255, 255, 0.5)',
        } as React.CSSProperties}
      >
        {displayValue.split('').map((char, index) => (
          <div key={index} className={styles.flapChar}>
            <div className={styles.flapCharInner}>
              {char}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // For Ocean theme, use wave-like animation
  if (theme.name === 'ocean') {
    return (
      <div 
        className={`inline-flex gap-0.5 font-mono font-bold ${sizeClasses[size]}`}
        style={{ color: `hsl(${theme.colors[effectiveColorMode].primary})` }}
      >
        {displayValue.split('').map((char, index) => (
          <span 
            key={index} 
            className="inline-block transition-all duration-200"
            style={{
              animation: isFlipping ? `wave 0.5s ${index * 0.05}s ease-in-out` : 'none',
            }}
          >
            {char}
          </span>
        ))}
      </div>
    );
  }

  // For Forest theme, use organic fade transition
  if (theme.name === 'forest') {
    return (
      <div 
        className={`inline-flex gap-0.5 font-mono font-bold ${sizeClasses[size]}`}
        style={{ 
          color: `hsl(${theme.colors[effectiveColorMode].primary})`,
          textShadow: effectiveColorMode === 'dark' 
            ? '0 2px 4px rgba(0, 0, 0, 0.3)' 
            : '0 1px 2px rgba(0, 0, 0, 0.1)'
        }}
      >
        {displayValue.split('').map((char, index) => (
          <span 
            key={index} 
            className="inline-block transition-all duration-300"
            style={{
              opacity: isFlipping ? 0.3 : 1,
              transform: isFlipping ? 'scale(0.9)' : 'scale(1)',
              transition: `all 0.3s ${index * 0.02}s ease-out`,
            }}
          >
            {char}
          </span>
        ))}
      </div>
    );
  }

  // For Modern theme, use clean slide transition
  if (theme.name === 'modern') {
    return (
      <div 
        className={`inline-flex gap-0.5 font-mono font-bold ${sizeClasses[size]}`}
        style={{ 
          color: `hsl(${theme.colors[effectiveColorMode].primary})`,
          letterSpacing: '0.05em'
        }}
      >
        {displayValue.split('').map((char, index) => (
          <span 
            key={index} 
            className="inline-block transition-all duration-200"
            style={{
              transform: isFlipping ? 'translateY(-2px)' : 'translateY(0)',
              opacity: isFlipping ? 0.7 : 1,
              transition: `all 0.2s ${index * 0.01}s cubic-bezier(0.4, 0, 0.2, 1)`,
            }}
          >
            {char}
          </span>
        ))}
      </div>
    );
  }

  // For Matrix theme, use terminal-style display
  if (theme.name === 'matrix') {
    return (
      <div 
        className={`inline-flex gap-0 font-mono font-bold ${sizeClasses[size]}`}
        style={{ 
          color: `hsl(${theme.colors[effectiveColorMode].primary})`,
          textShadow: effectiveColorMode === 'dark'
            ? `0 0 5px hsl(${theme.colors[effectiveColorMode].primary}), 0 0 10px hsla(${theme.colors[effectiveColorMode].primary}, 0.5)`
            : 'none',
          letterSpacing: '0.1em',
          fontFamily: '"Fira Code", "Courier New", monospace',
        }}
      >
        {displayValue.split('').map((char, index) => (
          <span 
            key={index} 
            className="inline-block"
            style={{
              opacity: isFlipping ? Math.random() : 1,
              transition: `opacity 0.05s`,
            }}
          >
            {char}
          </span>
        ))}
      </div>
    );
  }

  // For Super Thin theme, use ultra-compact display
  if (theme.name === 'superthin') {
    return (
      <div 
        className={`inline-flex gap-0 font-mono ${sizeClasses[size]}`}
        style={{ 
          color: `hsl(${theme.colors[effectiveColorMode].primary})`,
          letterSpacing: '-0.05em',  // Tighter spacing
          fontWeight: '500',
        }}
      >
        {displayValue}
      </div>
    );
  }

  // For Sunset theme, use warm glow effect
  if (theme.name === 'sunset') {
    return (
      <div 
        className={`inline-flex gap-0.5 font-mono font-bold ${sizeClasses[size]}`}
        style={{ 
          color: `hsl(${theme.colors[effectiveColorMode].primary})`,
          textShadow: effectiveColorMode === 'dark'
            ? `0 0 10px hsla(${theme.colors[effectiveColorMode].primary}, 0.5), 0 0 20px hsla(${theme.colors[effectiveColorMode].primary}, 0.3)`
            : `0 0 5px hsla(${theme.colors[effectiveColorMode].primary}, 0.3)`,
        }}
      >
        {displayValue.split('').map((char, index) => (
          <span 
            key={index} 
            className="inline-block transition-all duration-300"
            style={{
              transform: isFlipping ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0)',
              opacity: isFlipping ? 0.8 : 1,
              transition: `all 0.3s ${index * 0.02}s ease-in-out`,
            }}
          >
            {char}
          </span>
        ))}
      </div>
    );
  }

  // Default fallback display
  return (
    <div 
      className={`inline-flex gap-0.5 font-mono font-bold ${sizeClasses[size]}`}
      style={{ color: `hsl(${theme.colors[effectiveColorMode].primary})` }}
    >
      {displayValue}
    </div>
  );
}