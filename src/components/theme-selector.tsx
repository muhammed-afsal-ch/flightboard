'use client';

import React from 'react';
import { useTheme } from '@/contexts/theme-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export function ThemeSelector() {
  const { theme, themes, setTheme } = useTheme();

  return (
    <Select value={theme.name} onValueChange={setTheme}>
      <SelectTrigger className="w-[140px]" style={{ backgroundColor: 'hsl(var(--muted))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}>
        <SelectValue placeholder="Select theme">
          {theme.displayName}
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
        {themes.map((t) => (
          <SelectItem 
            key={t.name} 
            value={t.name}
            className="hover:bg-accent focus:bg-accent"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            <div className="flex flex-col">
              <span className="font-medium">{t.displayName}</span>
              <span className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>{t.description}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}