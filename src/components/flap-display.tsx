'use client';

import { useEffect, useState } from 'react';
import styles from './flap-display.module.css';

interface FlapDisplayProps {
  value: string;
  size?: 'small' | 'medium' | 'large';
}

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -.:/';

export function FlapDisplay({ value, size = 'medium' }: FlapDisplayProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsFlipping(true);
      
      // Simulate flapping animation
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
    }
  }, [value, displayValue]);

  const sizeClasses = {
    small: 'text-xl h-8',
    medium: 'text-3xl h-12',
    large: 'text-5xl h-16'
  };

  return (
    <div className={`${styles.flapDisplay} ${sizeClasses[size]} ${isFlipping ? styles.flipping : ''}`}>
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