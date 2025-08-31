#!/usr/bin/env node

import blessed from 'blessed';
import { airports, generateMockFlights, simulateFlightUpdates } from '../lib/mock-data';
import { Flight, FlightStatus, Airport } from '../types/flight';
import fetch from 'node-fetch';
import { getTheme, getAvailableThemes, TUITheme } from '../lib/tui-themes';
import fs from 'fs';
import path from 'path';

interface TUIOptions {
  airport?: string;
  theme?: string;
  minimal?: boolean;
}

// Get version from package.json
function getVersion(): string {
  try {
    const packagePath = path.join(__dirname, '../../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    return packageJson.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

class FlightBoardTUI {
  private screen: blessed.Widgets.Screen;
  private versionBar: blessed.Widgets.BoxElement;
  private departureTable: blessed.Widgets.ListTableElement;
  private arrivalTable: blessed.Widgets.ListTableElement;
  private tabs: blessed.Widgets.BoxElement;
  private statusBar: blessed.Widgets.BoxElement;
  private currentTab: 'departures' | 'arrivals' = 'departures';
  private airport: string;
  private airportInfo: Airport | null = null;
  private departures: Flight[] = [];
  private arrivals: Flight[] = [];
  private updateInterval: NodeJS.Timeout | null = null;
  private theme: TUITheme;
  private themeName: string;
  private version: string;
  private minimal: boolean;

  constructor(options: TUIOptions = {}) {
    this.airport = options.airport || 'KSMF';
    this.themeName = options.theme || 'classic';
    this.theme = getTheme(this.themeName);
    this.version = getVersion();
    this.minimal = options.minimal || false;
    
    this.screen = blessed.screen({
      smartCSR: true,
      title: 'FlightBoard TUI'
    });

    // Version bar at the very top (hidden in minimal mode)
    this.versionBar = blessed.box({
      top: 0,
      left: 0,
      width: '100%',
      height: this.minimal ? 0 : 1,
      hidden: this.minimal,
      tags: true,
      style: {
        fg: this.theme.colors.versionFg,
        bg: this.theme.colors.headerBg
      }
    });

    this.tabs = blessed.box({
      top: this.minimal ? 0 : 1,
      left: 0,
      width: '100%',
      height: this.minimal ? 2 : 3,
      tags: true,
      style: {
        fg: this.theme.colors.headerFg,
        bg: this.theme.colors.headerBg,
        border: {
          fg: this.theme.colors.border
        }
      }
    });

    this.departureTable = blessed.listtable({
      top: this.minimal ? 3 : 5,
      left: 0,
      width: '100%',
      height: this.minimal ? '100%-6' : '100%-8',
      align: 'left',
      tags: true,
      keys: true,
      vi: true,
      mouse: true,
      style: {
        header: {
          fg: this.theme.colors.tableHeaderFg,
          bold: true,
          bg: this.theme.colors.tableHeaderBg
        },
        cell: {
          fg: this.theme.colors.tableCellFg,
          selected: {
            bg: this.theme.colors.tableSelectedBg
          }
        },
        border: {
          fg: this.theme.colors.border
        }
      },
      scrollbar: {
        ch: ' ',
        track: {
          bg: 'gray'
        },
        style: {
          inverse: true
        }
      }
    });

    this.arrivalTable = blessed.listtable({
      top: this.minimal ? 3 : 5,
      left: 0,
      width: '100%',
      height: this.minimal ? '100%-6' : '100%-8',
      align: 'left',
      tags: true,
      keys: true,
      vi: true,
      mouse: true,
      hidden: true,
      style: {
        header: {
          fg: this.theme.colors.tableHeaderFg,
          bold: true,
          bg: this.theme.colors.tableHeaderBg
        },
        cell: {
          fg: this.theme.colors.tableCellFg,
          selected: {
            bg: this.theme.colors.tableSelectedBg
          }
        },
        border: {
          fg: this.theme.colors.border
        }
      },
      scrollbar: {
        ch: ' ',
        track: {
          bg: 'gray'
        },
        style: {
          inverse: true
        }
      }
    });

    this.statusBar = blessed.box({
      bottom: 0,
      left: 0,
      width: '100%',
      height: 3,
      tags: true,
      style: {
        fg: this.theme.colors.statusBarFg,
        bg: this.theme.colors.statusBarBg,
        border: {
          fg: this.theme.colors.border
        }
      }
    });

    this.screen.append(this.versionBar);
    this.screen.append(this.tabs);
    this.screen.append(this.departureTable);
    this.screen.append(this.arrivalTable);
    this.screen.append(this.statusBar);

    this.setupEventHandlers();
    this.fetchAirportInfo();
    this.updateDisplay();
    this.startUpdates();
  }

  private async fetchAirportInfo(): Promise<void> {
    try {
      // @ts-ignore - node-fetch import issue
      const response = await fetch(`https://api.airframes.io/airports/icao/${this.airport}`);
      if (response.ok) {
        const data: any = await response.json();
        this.airportInfo = {
          code: data.icao || data.iata || this.airport,
          name: data.name || data.airport_name || 'Unknown Airport',
          city: data.city || data.municipality || 'Unknown City',
          country: data.country || data.country_name || 'Unknown Country',
          timezone: data.timezone || 'UTC'
        };
        this.updateDisplay();
      }
    } catch (error) {
      // Fallback to local data if available
      if (airports[this.airport]) {
        this.airportInfo = airports[this.airport];
      }
    }
  }

  private setupEventHandlers(): void {
    this.screen.key(['escape', 'q', 'C-c'], () => {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
      }
      return process.exit(0);
    });

    this.screen.key(['tab'], () => {
      this.switchTab();
    });

    this.screen.key(['d'], () => {
      this.currentTab = 'departures';
      this.updateDisplay();
    });

    this.screen.key(['a'], () => {
      this.currentTab = 'arrivals';
      this.updateDisplay();
    });

    this.screen.key(['r'], () => {
      this.refreshFlights();
    });
  }

  private switchTab(): void {
    this.currentTab = this.currentTab === 'departures' ? 'arrivals' : 'departures';
    this.updateDisplay();
  }

  private formatTime(date: Date | string): string {
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private formatLocalTime(date: Date, timezone: string): string {
    try {
      return date.toLocaleTimeString('en-US', { 
        timeZone: timezone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return this.formatTime(date) + ':00';
    }
  }

  private getStatusColor(status: FlightStatus): string {
    const colorMap: Record<FlightStatus, keyof TUITheme['colors']> = {
      scheduled: 'statusScheduled',
      boarding: 'statusBoarding',
      departed: 'statusDeparted',
      arriving: 'statusArriving',
      landed: 'statusLanded',
      delayed: 'statusDelayed',
      cancelled: 'statusCancelled'
    };
    const colorKey = colorMap[status];
    const color = colorKey ? this.theme.colors[colorKey] : this.theme.colors.tableCellFg;
    return `{${color}-fg}`;
  }

  private formatStatus(status: FlightStatus): string {
    return status.toUpperCase().padEnd(10);
  }

  private refreshFlights(): void {
    this.departures = generateMockFlights(this.airport, 'departure', 25);
    this.arrivals = generateMockFlights(this.airport, 'arrival', 25);
    this.updateDisplay();
  }

  private updateFlights(): void {
    this.departures = simulateFlightUpdates(this.departures);
    this.arrivals = simulateFlightUpdates(this.arrivals);
    this.updateDisplay();
  }

  private startUpdates(): void {
    this.refreshFlights();
    
    // Update flight statuses every 10 seconds
    this.updateInterval = setInterval(() => {
      this.updateFlights();
    }, 10000);

    // Refresh all flights every 2 minutes
    setInterval(() => {
      this.refreshFlights();
    }, 120000);
  }

  private updateDisplay(): void {
    // Update version bar (only if not minimal)
    if (!this.minimal) {
      this.versionBar.setContent(
        `{center}{${this.theme.colors.versionFg}-fg}FlightBoard v${this.version} / https://github.com/airframesio/flightboard{/center}`
      );
    }
    
    // Update tabs with airport info
    const depStyle = this.currentTab === 'departures' 
      ? `{${this.theme.colors.activeTabBg}-bg}{${this.theme.colors.activeTabFg}-fg}` 
      : `{${this.theme.colors.inactiveTabBg}-bg}{${this.theme.colors.inactiveTabFg}-fg}`;
    const arrStyle = this.currentTab === 'arrivals' 
      ? `{${this.theme.colors.activeTabBg}-bg}{${this.theme.colors.activeTabFg}-fg}` 
      : `{${this.theme.colors.inactiveTabBg}-bg}{${this.theme.colors.inactiveTabFg}-fg}`;
    
    const airportDisplay = this.airportInfo 
      ? `{bold}{${this.theme.colors.headerFg}-fg}${this.airport}{/} - ${this.airportInfo.name}`
      : `{bold}{${this.theme.colors.headerFg}-fg}${this.airport}{/}`;
    
    if (this.minimal) {
      // Minimal mode: just airport and tabs
      this.tabs.setContent(
        `{center}${airportDisplay}  ${depStyle} DEPARTURES {/} ${arrStyle} ARRIVALS {/}{/center}\n`
      );
    } else {
      // Full mode: with help text
      this.tabs.setContent(
        `{center}${airportDisplay}{/center}\n` +
        `{center}${depStyle} DEPARTURES {/} ${arrStyle} ARRIVALS {/}{/center}\n` +
        `{center}{${this.theme.colors.helpFg}-fg}Tab: switch | Q: quit | R: refresh | D/A: departures/arrivals{/center}`
      );
    }

    // Update status bar with more details
    const now = new Date();
    let statusContent = '';
    
    if (this.airportInfo) {
      const localTime = this.formatLocalTime(now, this.airportInfo.timezone);
      const utcTime = now.toLocaleTimeString('en-US', { 
        timeZone: 'UTC',
        hour12: false 
      });
      
      statusContent = 
        `{center}${this.airportInfo.city}, ${this.airportInfo.country} | ` +
        `Local: {${this.theme.colors.statusBarTimeFg}-fg}${localTime}{/} | ` +
        `UTC: {${this.theme.colors.statusBarUTCFg}-fg}${utcTime}{/} | ` +
        `{${this.theme.colors.helpFg}-fg}Updated: ${now.toLocaleTimeString()}{/center}`;
    } else {
      statusContent = 
        `{center}${this.airport} | ` +
        `{${this.theme.colors.statusBarTimeFg}-fg}${now.toLocaleDateString()} ${now.toLocaleTimeString()}{/} | ` +
        `{${this.theme.colors.helpFg}-fg}Fetching airport info...{/center}`;
    }
    
    this.statusBar.setContent(statusContent);

    // Show/hide tables based on current tab
    if (this.currentTab === 'departures') {
      this.departureTable.show();
      this.arrivalTable.hide();
      this.updateTable(this.departureTable, this.departures, 'departure');
    } else {
      this.departureTable.hide();
      this.arrivalTable.show();
      this.updateTable(this.arrivalTable, this.arrivals, 'arrival');
    }

    this.screen.render();
  }

  private updateTable(table: blessed.Widgets.ListTableElement, flights: Flight[], type: 'departure' | 'arrival'): void {
    const headers = [
      'Flight',
      'Airline',
      type === 'departure' ? 'Destination' : 'Origin',
      'Time',
      'Est/Act',
      'Gate',
      'Status'
    ];

    const data = [
      headers.map(h => `{${this.theme.colors.tableHeaderFg}-fg}{bold}${h}{/bold}{/}`),
      ...flights.map(flight => {
        const statusColor = this.getStatusColor(flight.status);
        const estimatedActual = flight.actualTime 
          ? `{${this.theme.colors.statusLanded}-fg}${this.formatTime(flight.actualTime)}{/}`
          : flight.estimatedTime 
          ? `{${this.theme.colors.statusArriving}-fg}${this.formatTime(flight.estimatedTime)}{/}`
          : '     ';

        return [
          flight.flightNumber.padEnd(8),
          flight.airline.substring(0, 20).padEnd(20),
          (type === 'departure' ? flight.destination : flight.origin).padEnd(15),
          this.formatTime(flight.scheduledTime),
          estimatedActual,
          `${flight.terminal ? 'T' + flight.terminal + '-' : ''}${flight.gate}`.padEnd(6),
          `${statusColor}${this.formatStatus(flight.status)}{/}`
        ];
      })
    ];

    table.setData(data);
  }

  public run(): void {
    this.screen.render();
  }
}

// Main execution
const args = process.argv.slice(2);
const airportArg = args.find(arg => arg.startsWith('--airport='));
const themeArg = args.find(arg => arg.startsWith('--theme='));
const minimalArg = args.includes('--minimal');
const helpArg = args.includes('--help') || args.includes('-h');

if (helpArg) {
  console.log(`
FlightBoard TUI v${getVersion()}
`);
  console.log('Usage: flightboard-tui [options]\n');
  console.log('Options:');
  console.log('  --airport=<ICAO>  Set airport code (default: KSMF)');
  console.log('  --theme=<name>    Set color theme (default: classic)');
  console.log('  --minimal         Hide version bar and keyboard shortcuts');
  console.log('  --help, -h        Show this help message\n');
  console.log('Available themes:');
  getAvailableThemes().forEach(theme => {
    const themeObj = getTheme(theme);
    console.log(`  ${theme.padEnd(15)} ${themeObj.description}`);
  });
  console.log('\nKeyboard shortcuts:');
  console.log('  Tab           Switch between departures/arrivals');
  console.log('  D/A           Jump to Departures/Arrivals');
  console.log('  R             Refresh flight data');
  console.log('  Q/Esc         Quit\n');
  process.exit(0);
}

const airport = airportArg ? airportArg.split('=')[1] : 'KSMF';
const theme = themeArg ? themeArg.split('=')[1] : 'classic';

const tui = new FlightBoardTUI({ airport, theme, minimal: minimalArg });
tui.run();