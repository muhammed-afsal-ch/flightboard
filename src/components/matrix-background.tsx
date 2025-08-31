'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/contexts/theme-context';

export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, effectiveColorMode } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || theme.name !== 'matrix') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Matrix rain configuration
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);
    
    // Characters to use
    const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'.split('');
    
    // Animation loop
    let animationId: number;
    
    const animate = () => {
      // Fade effect - more aggressive fade for trail effect
      ctx.fillStyle = effectiveColorMode === 'dark' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set text properties
      ctx.font = `bold ${fontSize}px monospace`;
      
      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        // Brighter green for better visibility
        ctx.fillStyle = effectiveColorMode === 'dark' ? '#00FF00' : '#00CC00';
        ctx.shadowBlur = 8;
        ctx.shadowColor = effectiveColorMode === 'dark' ? '#00FF00' : '#00CC00';
        ctx.fillText(text, x, y);
        ctx.shadowBlur = 0;
        
        // Reset drop when it reaches bottom
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        drops[i]++;
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [isClient, theme.name, effectiveColorMode]);

  if (!isClient || theme.name !== 'matrix') {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ 
        zIndex: 1,
        opacity: effectiveColorMode === 'dark' ? 0.3 : 0.2
      }}
    />
  );
}