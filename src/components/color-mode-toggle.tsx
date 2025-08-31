'use client';

import React from 'react';
import { useTheme } from '@/contexts/theme-context';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ColorModeToggle() {
  const { colorMode, effectiveColorMode, setColorMode } = useTheme();

  const icon = colorMode === 'system' 
    ? <Monitor className="h-4 w-4" />
    : effectiveColorMode === 'light'
    ? <Sun className="h-4 w-4" />
    : <Moon className="h-4 w-4" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9" style={{ backgroundColor: 'hsl(var(--muted))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}>
          {icon}
          <span className="sr-only">Toggle color mode</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
        <DropdownMenuItem 
          onClick={() => setColorMode('light')}
          className="hover:bg-accent focus:bg-accent"
          style={{ color: 'hsl(var(--foreground))' }}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setColorMode('dark')}
          className="hover:bg-accent focus:bg-accent"
          style={{ color: 'hsl(var(--foreground))' }}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setColorMode('system')}
          className="hover:bg-accent focus:bg-accent"
          style={{ color: 'hsl(var(--foreground))' }}
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Compact version with just icons for mobile or tight spaces
export function ColorModeToggleCompact() {
  const { colorMode, effectiveColorMode, setColorMode } = useTheme();

  const cycleMode = () => {
    const modes: Array<'system' | 'light' | 'dark'> = ['system', 'light', 'dark'];
    const currentIndex = modes.indexOf(colorMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setColorMode(modes[nextIndex]);
  };

  const icon = colorMode === 'system' 
    ? <Monitor className="h-4 w-4" />
    : effectiveColorMode === 'light'
    ? <Sun className="h-4 w-4" />
    : <Moon className="h-4 w-4" />;

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-9 w-9"
      style={{ backgroundColor: 'hsl(var(--muted))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
      onClick={cycleMode}
    >
      {icon}
      <span className="sr-only">Toggle color mode</span>
    </Button>
  );
}