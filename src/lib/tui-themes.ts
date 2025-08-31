export interface TUITheme {
  name: string;
  description: string;
  colors: {
    // Main UI colors
    background: string;
    foreground: string;
    border: string;
    
    // Header colors
    headerBg: string;
    headerFg: string;
    versionFg: string;
    
    // Tab colors
    activeTabBg: string;
    activeTabFg: string;
    inactiveTabBg: string;
    inactiveTabFg: string;
    
    // Table colors
    tableHeaderBg: string;
    tableHeaderFg: string;
    tableCellFg: string;
    tableSelectedBg: string;
    
    // Status colors
    statusScheduled: string;
    statusBoarding: string;
    statusDeparted: string;
    statusArriving: string;
    statusLanded: string;
    statusDelayed: string;
    statusCancelled: string;
    
    // Status bar colors
    statusBarBg: string;
    statusBarFg: string;
    statusBarTimeFg: string;
    statusBarUTCFg: string;
    
    // Help text
    helpFg: string;
  };
}

export const tuiThemes: Record<string, TUITheme> = {
  classic: {
    name: 'Classic',
    description: 'Traditional terminal colors',
    colors: {
      background: 'black',
      foreground: 'white',
      border: 'gray',
      headerBg: 'black',
      headerFg: 'yellow',
      versionFg: '#666666',
      activeTabBg: 'yellow',
      activeTabFg: 'black',
      inactiveTabBg: 'black',
      inactiveTabFg: 'yellow',
      tableHeaderBg: 'black',
      tableHeaderFg: 'yellow',
      tableCellFg: 'white',
      tableSelectedBg: 'blue',
      statusScheduled: 'white',
      statusBoarding: 'green',
      statusDeparted: 'blue',
      statusArriving: 'yellow',
      statusLanded: 'green',
      statusDelayed: 'red',
      statusCancelled: 'red',
      statusBarBg: 'black',
      statusBarFg: 'white',
      statusBarTimeFg: 'yellow',
      statusBarUTCFg: 'cyan',
      helpFg: 'gray'
    }
  },
  
  modern: {
    name: 'Modern',
    description: 'Clean contemporary design',
    colors: {
      background: '#1a1a1a',
      foreground: '#f0f0f0',
      border: '#404040',
      headerBg: '#1a1a1a',
      headerFg: '#60a5fa',
      versionFg: '#6b7280',
      activeTabBg: '#3b82f6',
      activeTabFg: '#ffffff',
      inactiveTabBg: '#1f2937',
      inactiveTabFg: '#9ca3af',
      tableHeaderBg: '#1f2937',
      tableHeaderFg: '#60a5fa',
      tableCellFg: '#e5e7eb',
      tableSelectedBg: '#2563eb',
      statusScheduled: '#9ca3af',
      statusBoarding: '#10b981',
      statusDeparted: '#3b82f6',
      statusArriving: '#f59e0b',
      statusLanded: '#10b981',
      statusDelayed: '#ef4444',
      statusCancelled: '#dc2626',
      statusBarBg: '#1f2937',
      statusBarFg: '#d1d5db',
      statusBarTimeFg: '#60a5fa',
      statusBarUTCFg: '#06b6d4',
      helpFg: '#6b7280'
    }
  },
  
  retro: {
    name: 'Retro Terminal',
    description: 'Classic green phosphor CRT',
    colors: {
      background: 'black',
      foreground: '#00ff00',
      border: '#008800',
      headerBg: 'black',
      headerFg: '#00ff00',
      versionFg: '#006600',
      activeTabBg: '#00ff00',
      activeTabFg: 'black',
      inactiveTabBg: 'black',
      inactiveTabFg: '#00aa00',
      tableHeaderBg: 'black',
      tableHeaderFg: '#00ff00',
      tableCellFg: '#00dd00',
      tableSelectedBg: '#004400',
      statusScheduled: '#00aa00',
      statusBoarding: '#00ff00',
      statusDeparted: '#00ffff',
      statusArriving: '#ffff00',
      statusLanded: '#00ff00',
      statusDelayed: '#ff8800',
      statusCancelled: '#ff0000',
      statusBarBg: 'black',
      statusBarFg: '#00cc00',
      statusBarTimeFg: '#00ff00',
      statusBarUTCFg: '#00ffff',
      helpFg: '#008800'
    }
  },
  
  matrix: {
    name: 'Matrix',
    description: 'Cyberpunk green with gold accents',
    colors: {
      background: '#0a0a0a',
      foreground: '#00ff41',
      border: '#003300',
      headerBg: '#0a0a0a',
      headerFg: '#ffd700',
      versionFg: '#004400',
      activeTabBg: '#ffd700',
      activeTabFg: '#000000',
      inactiveTabBg: '#001100',
      inactiveTabFg: '#00aa00',
      tableHeaderBg: '#001100',
      tableHeaderFg: '#ffd700',
      tableCellFg: '#00ff41',
      tableSelectedBg: '#003300',
      statusScheduled: '#00aa00',
      statusBoarding: '#ffd700',
      statusDeparted: '#00ffff',
      statusArriving: '#ffaa00',
      statusLanded: '#00ff00',
      statusDelayed: '#ff4444',
      statusCancelled: '#ff0000',
      statusBarBg: '#001100',
      statusBarFg: '#00ff41',
      statusBarTimeFg: '#ffd700',
      statusBarUTCFg: '#00ffff',
      helpFg: '#006600'
    }
  },
  
  highcontrast: {
    name: 'High Contrast',
    description: 'Maximum readability',
    colors: {
      background: 'black',
      foreground: 'white',
      border: 'white',
      headerBg: 'white',
      headerFg: 'black',
      versionFg: '#888888',
      activeTabBg: 'white',
      activeTabFg: 'black',
      inactiveTabBg: 'black',
      inactiveTabFg: 'white',
      tableHeaderBg: 'white',
      tableHeaderFg: 'black',
      tableCellFg: 'white',
      tableSelectedBg: 'white',
      statusScheduled: 'white',
      statusBoarding: 'green',
      statusDeparted: 'cyan',
      statusArriving: 'yellow',
      statusLanded: 'green',
      statusDelayed: 'red',
      statusCancelled: 'magenta',
      statusBarBg: 'black',
      statusBarFg: 'white',
      statusBarTimeFg: 'yellow',
      statusBarUTCFg: 'cyan',
      helpFg: 'white'
    }
  },
  
  ocean: {
    name: 'Ocean',
    description: 'Deep sea blues and teals',
    colors: {
      background: '#001122',
      foreground: '#b0e0e6',
      border: '#004466',
      headerBg: '#002244',
      headerFg: '#00ccff',
      versionFg: '#005577',
      activeTabBg: '#00aacc',
      activeTabFg: '#001122',
      inactiveTabBg: '#002244',
      inactiveTabFg: '#6699cc',
      tableHeaderBg: '#002244',
      tableHeaderFg: '#00ccff',
      tableCellFg: '#aaccee',
      tableSelectedBg: '#004466',
      statusScheduled: '#8899aa',
      statusBoarding: '#00ff88',
      statusDeparted: '#00aaff',
      statusArriving: '#ffcc00',
      statusLanded: '#00ff88',
      statusDelayed: '#ff6644',
      statusCancelled: '#ff3333',
      statusBarBg: '#002244',
      statusBarFg: '#99bbdd',
      statusBarTimeFg: '#00ccff',
      statusBarUTCFg: '#00ffcc',
      helpFg: '#6688aa'
    }
  },
  
  sunset: {
    name: 'Sunset',
    description: 'Warm oranges and purples',
    colors: {
      background: '#1a0011',
      foreground: '#ffccaa',
      border: '#663344',
      headerBg: '#330022',
      headerFg: '#ff9966',
      versionFg: '#884455',
      activeTabBg: '#ff6633',
      activeTabFg: '#220011',
      inactiveTabBg: '#330022',
      inactiveTabFg: '#cc8866',
      tableHeaderBg: '#330022',
      tableHeaderFg: '#ff9966',
      tableCellFg: '#ffddcc',
      tableSelectedBg: '#663344',
      statusScheduled: '#cc9988',
      statusBoarding: '#66ff99',
      statusDeparted: '#9966ff',
      statusArriving: '#ffcc33',
      statusLanded: '#66ff99',
      statusDelayed: '#ff6666',
      statusCancelled: '#ff3366',
      statusBarBg: '#330022',
      statusBarFg: '#ddaaaa',
      statusBarTimeFg: '#ff9966',
      statusBarUTCFg: '#cc99ff',
      helpFg: '#996666'
    }
  }
};

export function getTheme(themeName: string): TUITheme {
  return tuiThemes[themeName] || tuiThemes.classic;
}

export function getAvailableThemes(): string[] {
  return Object.keys(tuiThemes);
}