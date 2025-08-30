#!/usr/bin/env node

import blessed from 'blessed';
import { airports, generateMockFlights, simulateFlightUpdates } from '../lib/mock-data';
import { Flight, FlightStatus, Airport } from '../types/flight';
import fetch from 'node-fetch';

interface TUIOptions {
  airport?: string;
}

class FlightBoardTUI {
  private screen: blessed.Widgets.Screen;
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

  constructor(options: TUIOptions = {}) {
    this.airport = options.airport || 'KSMF';
    this.screen = blessed.screen({
      smartCSR: true,
      title: 'FlightBoard TUI'
    });

    this.tabs = blessed.box({
      top: 0,
      left: 0,
      width: '100%',
      height: 3,
      tags: true,
      style: {
        fg: 'yellow',
        bg: 'black',
        border: {
          fg: 'gray'
        }
      }
    });

    this.departureTable = blessed.listtable({
      top: 3,
      left: 0,
      width: '100%',
      height: '100%-6',
      align: 'left',
      tags: true,
      keys: true,
      vi: true,
      mouse: true,
      style: {
        header: {
          fg: 'yellow',
          bold: true,
          bg: 'black'
        },
        cell: {
          fg: 'white',
          selected: {
            bg: 'blue'
          }
        },
        border: {
          fg: 'gray'
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
      top: 3,
      left: 0,
      width: '100%',
      height: '100%-6',
      align: 'left',
      tags: true,
      keys: true,
      vi: true,
      mouse: true,
      hidden: true,
      style: {
        header: {
          fg: 'yellow',
          bold: true,
          bg: 'black'
        },
        cell: {
          fg: 'white',
          selected: {
            bg: 'blue'
          }
        },
        border: {
          fg: 'gray'
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
        fg: 'white',
        bg: 'black',
        border: {
          fg: 'gray'
        }
      }
    });

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
    const colors: Record<FlightStatus, string> = {
      scheduled: 'white',
      boarding: '{green-fg}',
      departed: '{blue-fg}',
      arriving: '{yellow-fg}',
      landed: '{green-fg}',
      delayed: '{red-fg}',
      cancelled: '{red-fg}'
    };
    return colors[status] || 'white';
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
    // Update tabs with airport info
    const depStyle = this.currentTab === 'departures' ? '{yellow-bg}{black-fg}' : '{black-bg}{yellow-fg}';
    const arrStyle = this.currentTab === 'arrivals' ? '{yellow-bg}{black-fg}' : '{black-bg}{yellow-fg}';
    
    const airportDisplay = this.airportInfo 
      ? `{bold}{yellow-fg}${this.airport}{/} - ${this.airportInfo.name}`
      : `{bold}{yellow-fg}${this.airport}{/}`;
    
    this.tabs.setContent(
      `{center}${airportDisplay}{/center}\n` +
      `{center}${depStyle} DEPARTURES {/} ${arrStyle} ARRIVALS {/}{/center}\n` +
      `{center}{gray-fg}Tab: switch | Q: quit | R: refresh | D/A: departures/arrivals{/center}`
    );

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
        `Local: {yellow-fg}${localTime}{/} | ` +
        `UTC: {cyan-fg}${utcTime}{/} | ` +
        `{gray-fg}Updated: ${now.toLocaleTimeString()}{/center}`;
    } else {
      statusContent = 
        `{center}${this.airport} | ` +
        `{yellow-fg}${now.toLocaleDateString()} ${now.toLocaleTimeString()}{/} | ` +
        `{gray-fg}Fetching airport info...{/center}`;
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
      headers.map(h => `{yellow-fg}{bold}${h}{/bold}{/}`),
      ...flights.map(flight => {
        const statusColor = this.getStatusColor(flight.status);
        const estimatedActual = flight.actualTime 
          ? `{green-fg}${this.formatTime(flight.actualTime)}{/}`
          : flight.estimatedTime 
          ? `{yellow-fg}${this.formatTime(flight.estimatedTime)}{/}`
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
const airport = airportArg ? airportArg.split('=')[1] : 'KSMF';

const tui = new FlightBoardTUI({ airport });
tui.run();