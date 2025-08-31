'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/theme-context';

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, effectiveColorMode } = useTheme();
  
  useEffect(() => {
    // Only run for Matrix theme
    if (theme.name !== 'matrix') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Set canvas to full window size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    
    const fontSize = 20;  // Larger for better legibility
    const columnSpacing = fontSize * 1.2;  // Add spacing between columns
    const columns = Math.floor(canvas.width / columnSpacing);
    const rainDrops: number[] = [];
    const columnSpeeds: number[] = [];  // Random speed for each column
    const columnChars: string[][] = [];  // Store character history for each column
    const airplanePositions: Map<string, number> = new Map();  // Track airplane positions
    
    // Initialize rain drops at random positions with random speeds
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = Math.floor(Math.random() * -100);
      columnSpeeds[x] = 0.3 + Math.random() * 1.2;  // Speed between 0.3 and 1.5
      columnChars[x] = [];  // Initialize character history
    }
    
    // Extended character set including Matrix characters, binary, and airplane symbol
    const matrixChars = [
      // Binary
      '0', '1',
      // Matrix katakana
      'ア', 'イ', 'ウ', 'エ', 'オ',
      'カ', 'キ', 'ク', 'ケ', 'コ',
      'サ', 'シ', 'ス', 'セ', 'ソ',
      'タ', 'チ', 'ツ', 'テ', 'ト',
      'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
      'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
      'マ', 'ミ', 'ム', 'メ', 'モ',
      'ヤ', 'ユ', 'ヨ',
      'ラ', 'リ', 'ル', 'レ', 'ロ',
      'ワ', 'ヲ', 'ン',
      // Latin characters
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
      'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      // Numbers
      '2', '3', '4', '5', '6', '7', '8', '9',
      // Special characters
      '@', '#', '$', '%', '&', '*', '+', '=', '?',
      // Airplane emoji (occasional appearance)
      '✈'
    ];
    
    // Define airplane character for special highlighting
    const airplaneChars = new Set(['✈']);
    
    const draw = () => {
      // Fade overlay - different for light/dark mode
      if (effectiveColorMode === 'dark') {
        context.fillStyle = 'rgba(0, 0, 0, 0.08)';  // Even faster fade for cleaner look
      } else {
        context.fillStyle = 'rgba(255, 255, 255, 0.08)';
      }
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      context.font = `bold ${fontSize}px monospace`;
      context.textAlign = 'center';
      
      for (let i = 0; i < rainDrops.length; i++) {
        const x = i * columnSpacing + columnSpacing/2;
        const y = rainDrops[i] * fontSize;
        const columnRow = Math.floor(rainDrops[i]);
        
        // Gradient effect for falling characters
        if (y > 0 && y < canvas.height) {
          // Decide on character for this position
          let text;
          const shouldBeAirplane = Math.random() < 0.005;  // 0.5% chance for airplane
          
          if (shouldBeAirplane) {
            const airplaneOptions = Array.from(airplaneChars);
            text = airplaneOptions[Math.floor(Math.random() * airplaneOptions.length)];
            // Store airplane position for persistence
            airplanePositions.set(`${i}-${columnRow}`, Date.now());
          } else {
            // Check if there was recently an airplane at this position
            const airplaneKey = `${i}-${columnRow}`;
            if (airplanePositions.has(airplaneKey)) {
              const timestamp = airplanePositions.get(airplaneKey)!;
              if (Date.now() - timestamp < 5000) {  // Keep airplane for 5 seconds
                const airplaneOptions = Array.from(airplaneChars);
                text = airplaneOptions[Math.floor(Math.random() * airplaneOptions.length)];
              } else {
                airplanePositions.delete(airplaneKey);
                text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
              }
            } else {
              text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            }
          }
          
          const isAirplane = airplaneChars.has(text);
          
          // Store character in history
          if (!columnChars[i]) columnChars[i] = [];
          columnChars[i][columnRow] = text;
          
          // Draw trail first (using stored history)
          for (let j = 1; j <= 6; j++) {  // Shorter trail
            const trailRow = columnRow - j;
            const trailY = y - (j * fontSize);
            if (trailY > 0 && columnChars[i] && columnChars[i][trailRow]) {
              const opacity = Math.max(0.7 - (j * 0.12), 0.1);
              const trailChar = columnChars[i][trailRow];
              const isTrailAirplane = airplaneChars.has(trailChar);
              
              if (isTrailAirplane) {
                // Airplane in trail - use special color with enhanced persistence
                const airplaneOpacity = Math.min(opacity * 1.5, 1);  // Boost opacity for airplanes
                const trailAirplaneColor = effectiveColorMode === 'dark' ? 
                  `rgba(255, 215, 0, ${airplaneOpacity})` :  // Gold
                  `rgba(255, 107, 0, ${airplaneOpacity})`;    // Orange
                context.fillStyle = trailAirplaneColor;
                context.font = `${fontSize + 1}px monospace`;  // Not bold for trail
              } else {
                // Regular trail color
                const trailColor = effectiveColorMode === 'dark' ? '0, 255, 0' : '0, 136, 0';
                context.fillStyle = `rgba(${trailColor}, ${opacity})`;
                context.font = `${fontSize}px monospace`;  // Not bold for trail
              }
              context.fillText(trailChar, x, trailY);
            }
          }
          
          // Draw leading character
          
          // Colors based on character type
          let leadingColor, shadowBlur;
          
          if (isAirplane) {
            // Special colors for airplane characters - bright and distinct
            leadingColor = effectiveColorMode === 'dark' ? '#FFD700' : '#FF4500';  // Gold / OrangeRed
            context.font = `bold ${fontSize + 3}px monospace`;  // Noticeably larger and bold
            
            // Draw airplane
            context.fillStyle = leadingColor;
            context.fillText(text, x, y);
          } else {
            // Regular Matrix colors - brighter for leader
            leadingColor = effectiveColorMode === 'dark' ? '#00FF00' : '#00AA00';  // Bright green
            context.font = `bold ${fontSize}px monospace`;  // Bold for leader
            context.fillStyle = leadingColor;
            
            // Draw leader character twice for extra brightness
            context.globalAlpha = 0.8;
            context.fillText(text, x, y);
            context.globalAlpha = 1.0;
            context.fillText(text, x, y);
          }
        }
        
        // Reset when reaching bottom or randomly for variation
        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        
        // Move drop down at column's speed
        rainDrops[i] += columnSpeeds[i];
      }
    };
    
    const interval = setInterval(draw, 35);
    
    // Handle window resize
    const handleResize = () => {
      setCanvasSize();
      // Recalculate columns
      const newColumns = Math.ceil(canvas.width / fontSize);
      const currentLength = rainDrops.length;
      
      if (newColumns > currentLength) {
        // Add new columns with speeds
        for (let i = currentLength; i < newColumns; i++) {
          rainDrops[i] = Math.floor(Math.random() * -100);
          columnSpeeds[i] = 0.3 + Math.random() * 1.2;
        }
      } else if (newColumns < currentLength) {
        // Remove extra columns
        rainDrops.length = newColumns;
        columnSpeeds.length = newColumns;
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme.name, effectiveColorMode]);
  
  // Only render for Matrix theme
  if (theme.name !== 'matrix') {
    return null;
  }
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: -1,  // Behind everything
        opacity: 1,  // Full opacity for maximum visibility
      }}
    />
  );
}