import { Flight, Airport, FlightStatus } from '@/types/flight';
import { FlightDataProvider } from './aviation-api';

// ============================================================================
// AIRFRAMES.IO PROVIDER (Priority - Our own service!)
// ============================================================================
export class AirframesProvider implements FlightDataProvider {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = process.env.AIRFRAMES_API_URL || 'https://api.airframes.io/v1';
  }

  async fetchFlights(airport: string, type: 'departure' | 'arrival'): Promise<Flight[]> {
    try {
      // Note: The /flights/active endpoint currently returns flights without airport information
      // Airport fields (departingAirport, destinationAirport) are null in the response
      // Returning empty array until airport-specific data is available in the API
      console.log(`Airframes.io: /flights/active endpoint doesn't include airport data yet for ${airport}`);
      
      // Uncomment when airport data becomes available:
      /*
      const response = await fetch(
        `https://api.airframes.io/flights/active`,
        {
          headers: {
            'X-API-Key': this.apiKey,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Airframes API error: ${response.statusText}`);
      }

      const data: any = await response.json();
      const allFlights = Array.isArray(data) ? data : (data.flights || []);
      
      // Filter flights by airport
      const filteredFlights = allFlights.filter(flight => {
        if (type === 'departure') {
          return flight.departingAirport?.icao === airport || 
                 flight.departingAirport?.iata === airport;
        } else {
          return flight.destinationAirport?.icao === airport || 
                 flight.destinationAirport?.iata === airport;
        }
      });
      
      return this.transformAirframesData(filteredFlights, type);
      */
      
      return [];
    } catch (error) {
      console.error('Airframes API error:', error);
      return [];
    }
  }

  private transformAirframesData(data: any[], type: 'departure' | 'arrival'): Flight[] {
    return data.map(flight => ({
      id: `${flight.id || flight.flight}-${Date.now()}`,
      flightNumber: flight.flightIata || flight.flight || flight.flightIcao || 'N/A',
      airline: flight.airline?.name || 'Unknown',
      destination: type === 'departure' ? 
        (flight.destinationAirport?.name || flight.destinationAirport?.icao || 'Unknown') : 
        (flight.departingAirport?.name || flight.departingAirport?.icao || 'Unknown'),
      destinationCode: type === 'departure' ? 
        (flight.destinationAirport?.icao || flight.destinationAirport?.iata || 'UNK') :
        (flight.departingAirport?.icao || flight.departingAirport?.iata || 'UNK'),
      origin: type === 'arrival' ? 
        (flight.departingAirport?.name || flight.departingAirport?.icao || 'Unknown') :
        (flight.destinationAirport?.name || flight.destinationAirport?.icao || 'Unknown'),
      originCode: type === 'arrival' ? 
        (flight.departingAirport?.icao || flight.departingAirport?.iata || 'UNK') :
        (flight.destinationAirport?.icao || flight.destinationAirport?.iata || 'UNK'),
      scheduledTime: new Date(type === 'departure' ? 
        (flight.departureTimeScheduled || Date.now()) : 
        (flight.arrivalTimeScheduled || Date.now())),
      estimatedTime: undefined,
      actualTime: type === 'departure' ? 
        (flight.departureTimeActual ? new Date(flight.departureTimeActual) : undefined) :
        (flight.arrivalTimeActual ? new Date(flight.arrivalTimeActual) : undefined),
      gate: type === 'departure' ? 
        (flight.departureGateActual || flight.departureGateScheduled || 'N/A') :
        (flight.arrivalGateActual || flight.arrivalGateScheduled || 'N/A'),
      terminal: undefined,
      status: this.mapAirframesStatus(flight.status),
      aircraft: flight.airframe?.icaoType || flight.airframe?.description,
      duration: undefined
    }));
  }

  private mapAirframesStatus(status: string): FlightStatus {
    const statusMap: Record<string, FlightStatus> = {
      'scheduled': 'scheduled',
      'boarding': 'boarding',
      'departed': 'departed',
      'in-flight': 'departed',
      'airborne': 'departed',
      'enroute': 'departed',
      'approaching': 'arriving',
      'arrived': 'landed',
      'landed': 'landed',
      'delayed': 'delayed',
      'cancelled': 'cancelled',
      'canceled': 'cancelled'
    };
    
    return statusMap[status?.toLowerCase()] || 'scheduled';
  }

  async fetchAirportInfo(code: string): Promise<Airport | null> {
    try {
      const response = await fetch(
        `https://api.airframes.io/airports/icao/${code}`,
        {
          headers: {
            'X-API-Key': this.apiKey,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        return null;
      }

      const data: any = await response.json();
      return {
        code: data.icao || data.iata || code,
        name: data.name,
        city: data.city,
        country: data.country,
        timezone: data.timezone
      };
    } catch (error) {
      console.error('Airframes airport info error:', error);
      return null;
    }
  }
}

// ============================================================================
// FLIGHTAWARE PROVIDER
// ============================================================================
export class FlightAwareProvider implements FlightDataProvider {
  private apiKey: string;
  private baseUrl = 'https://aeroapi.flightaware.com/aeroapi';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fetchFlights(airport: string, type: 'departure' | 'arrival'): Promise<Flight[]> {
    try {
      const endpoint = type === 'departure' 
        ? `/airports/${airport}/flights/scheduled_departures`
        : `/airports/${airport}/flights/scheduled_arrivals`;
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'x-apikey': this.apiKey,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`FlightAware API error: ${response.statusText}`);
      }

      const data: any = await response.json();
      return this.transformFlightAwareData(data.scheduled || data.flights || [], type);
    } catch (error) {
      console.error('FlightAware API error:', error);
      return [];
    }
  }

  private transformFlightAwareData(data: any[], type: 'departure' | 'arrival'): Flight[] {
    return data.map(flight => ({
      id: `${flight.fa_flight_id || flight.ident}-${Date.now()}`,
      flightNumber: flight.ident || 'N/A',
      airline: flight.operator || 'Unknown',
      destination: type === 'departure' ? flight.destination.name : flight.origin.name,
      destinationCode: type === 'departure' ? flight.destination.code : flight.origin.code,
      origin: type === 'arrival' ? flight.origin.name : flight.destination.name,
      originCode: type === 'arrival' ? flight.origin.code : flight.destination.code,
      scheduledTime: new Date(flight.scheduled_off || flight.scheduled_on),
      estimatedTime: flight.estimated_off || flight.estimated_on 
        ? new Date(flight.estimated_off || flight.estimated_on) 
        : undefined,
      actualTime: flight.actual_off || flight.actual_on
        ? new Date(flight.actual_off || flight.actual_on)
        : undefined,
      gate: flight.gate_destination || flight.gate_origin || 'N/A',
      terminal: flight.terminal_destination || flight.terminal_origin,
      status: this.mapFlightAwareStatus(flight.status),
      aircraft: flight.aircraft_type,
      duration: undefined
    }));
  }

  private mapFlightAwareStatus(status: string): FlightStatus {
    const statusMap: Record<string, FlightStatus> = {
      'Scheduled': 'scheduled',
      'Boarding': 'boarding',
      'Departed': 'departed',
      'En Route': 'departed',
      'Approaching': 'arriving',
      'Arrived': 'landed',
      'Cancelled': 'cancelled',
      'Delayed': 'delayed'
    };
    
    return statusMap[status] || 'scheduled';
  }

  async fetchAirportInfo(code: string): Promise<Airport | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/airports/${code}`,
        {
          headers: {
            'x-apikey': this.apiKey,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        return null;
      }

      const data: any = await response.json();
      return {
        code: data.code || code,
        name: data.name,
        city: data.city,
        country: data.country,
        timezone: data.timezone
      };
    } catch (error) {
      console.error('FlightAware airport info error:', error);
      return null;
    }
  }
}

// ============================================================================
// FLIGHTRADAR24 PROVIDER
// ============================================================================
export class FlightRadar24Provider implements FlightDataProvider {
  private apiKey: string;
  private baseUrl = 'https://api.flightradar24.com/common/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fetchFlights(airport: string, type: 'departure' | 'arrival'): Promise<Flight[]> {
    try {
      // FlightRadar24 uses different endpoint structure
      const endpoint = type === 'departure' ? 'airport-departures' : 'airport-arrivals';
      const response = await fetch(
        `${this.baseUrl}/${endpoint}/${airport}.json?token=${this.apiKey}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`FlightRadar24 API error: ${response.statusText}`);
      }

      const data: any = await response.json();
      return this.transformFlightRadar24Data(data.flights || data.data || [], type);
    } catch (error) {
      console.error('FlightRadar24 API error:', error);
      return [];
    }
  }

  private transformFlightRadar24Data(data: any[], type: 'departure' | 'arrival'): Flight[] {
    return data.map(flight => ({
      id: `${flight.flight_id || flight.reg}-${Date.now()}`,
      flightNumber: flight.flight || 'N/A',
      airline: flight.airline || 'Unknown',
      destination: type === 'departure' ? flight.dest_name : flight.orig_name,
      destinationCode: type === 'departure' ? flight.dest : flight.orig,
      origin: type === 'arrival' ? flight.orig_name : flight.dest_name,
      originCode: type === 'arrival' ? flight.orig : flight.dest,
      scheduledTime: new Date((flight.scheduled_time || flight.sched_time) * 1000),
      estimatedTime: flight.estimated_time 
        ? new Date(flight.estimated_time * 1000) 
        : undefined,
      actualTime: flight.actual_time
        ? new Date(flight.actual_time * 1000)
        : undefined,
      gate: flight.gate || 'N/A',
      terminal: flight.terminal,
      status: this.mapFlightRadar24Status(flight.status),
      aircraft: flight.aircraft || flight.aircraft_type,
      duration: undefined
    }));
  }

  private mapFlightRadar24Status(status: string): FlightStatus {
    const statusMap: Record<string, FlightStatus> = {
      'scheduled': 'scheduled',
      'boarding': 'boarding',
      'departed': 'departed',
      'airborne': 'departed',
      'landing': 'arriving',
      'landed': 'landed',
      'arrived': 'landed',
      'cancelled': 'cancelled',
      'delayed': 'delayed'
    };
    
    return statusMap[status?.toLowerCase()] || 'scheduled';
  }

  async fetchAirportInfo(code: string): Promise<Airport | null> {
    // FlightRadar24 doesn't provide detailed airport info via their API
    return null;
  }
}

// ============================================================================
// AIRNAV RADARBOX PROVIDER
// ============================================================================
export class AirNavProvider implements FlightDataProvider {
  private apiKey: string;
  private baseUrl = 'https://api.radarbox.com/v2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fetchFlights(airport: string, type: 'departure' | 'arrival'): Promise<Flight[]> {
    try {
      const endpoint = type === 'departure' ? 'departures' : 'arrivals';
      const response = await fetch(
        `${this.baseUrl}/airports/${airport}/${endpoint}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`AirNav RadarBox API error: ${response.statusText}`);
      }

      const data: any = await response.json();
      return this.transformAirNavData(data.flights || data.data || [], type);
    } catch (error) {
      console.error('AirNav RadarBox API error:', error);
      return [];
    }
  }

  private transformAirNavData(data: any[], type: 'departure' | 'arrival'): Flight[] {
    return data.map(flight => ({
      id: `${flight.flight_id || flight.callsign}-${Date.now()}`,
      flightNumber: flight.callsign || flight.flight_number || 'N/A',
      airline: flight.airline || 'Unknown',
      destination: type === 'departure' ? flight.destination_airport : flight.origin_airport,
      destinationCode: type === 'departure' ? flight.destination : flight.origin,
      origin: type === 'arrival' ? flight.origin_airport : flight.destination_airport,
      originCode: type === 'arrival' ? flight.origin : flight.destination,
      scheduledTime: new Date(flight.scheduled_departure || flight.scheduled_arrival),
      estimatedTime: flight.estimated_departure || flight.estimated_arrival
        ? new Date(flight.estimated_departure || flight.estimated_arrival)
        : undefined,
      actualTime: flight.actual_departure || flight.actual_arrival
        ? new Date(flight.actual_departure || flight.actual_arrival)
        : undefined,
      gate: flight.gate || 'N/A',
      terminal: flight.terminal,
      status: this.mapAirNavStatus(flight.status),
      aircraft: flight.aircraft_type,
      duration: flight.flight_time
    }));
  }

  private mapAirNavStatus(status: string): FlightStatus {
    const statusMap: Record<string, FlightStatus> = {
      'scheduled': 'scheduled',
      'boarding': 'boarding',
      'departed': 'departed',
      'en-route': 'departed',
      'approaching': 'arriving',
      'landed': 'landed',
      'cancelled': 'cancelled',
      'delayed': 'delayed'
    };
    
    return statusMap[status?.toLowerCase()] || 'scheduled';
  }

  async fetchAirportInfo(code: string): Promise<Airport | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/airports/${code}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        return null;
      }

      const data: any = await response.json();
      return {
        code: data.icao || data.iata || code,
        name: data.name,
        city: data.city,
        country: data.country,
        timezone: data.timezone
      };
    } catch (error) {
      console.error('AirNav airport info error:', error);
      return null;
    }
  }
}


// ============================================================================
// ADSB.IM PROVIDER (No API key required)
// ============================================================================
export class AdsbImProvider implements FlightDataProvider {
  private baseUrl = 'https://adsb.im/api/0';

  async fetchFlights(airport: string, type: 'departure' | 'arrival'): Promise<Flight[]> {
    try {
      // Get airport coordinates if available, otherwise use 0,0
      const coords = await this.getAirportCoordinates(airport);
      const lat = coords?.latitude || 0;
      const lng = coords?.longitude || 0;

      // For testing/demo purposes, use some common flight callsigns
      // In production, you would get real-time callsigns from an ADS-B feed
      const sampleCallsigns = [
        'UAL123', 'AAL456', 'DAL789', 'SWA321', 'ASA654',
        'JBU987', 'NKS246', 'FFT135', 'SKW579', 'FDX842'
      ];
      
      const flights: Flight[] = [];
      const uniqueCallsigns = new Set<string>();
      
      for (const callsign of sampleCallsigns) {
        if (!uniqueCallsigns.has(callsign)) {
          uniqueCallsigns.add(callsign);
          
          try {
            const scheduleResponse = await fetch(`${this.baseUrl}/routeset`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                callsign: callsign,
                lat: lat,  // Use 0 if coordinates not found
                lng: lng   // Use 0 if coordinates not found
              })
            });

            if (scheduleResponse.ok) {
              const scheduleData = await scheduleResponse.json();
              const flight = this.transformAdsbImData(scheduleData, callsign, type, airport);
              if (flight) {
                flights.push(flight);
              }
            }
          } catch (error) {
            console.error(`adsb.im: Error fetching schedule for ${callsign}:`, error);
          }
          
          // Limit to prevent too many requests
          if (flights.length >= 10) break;
        }
      }
      
      return flights;
    } catch (error) {
      console.error('adsb.im API error:', error);
      return [];
    }
  }

  private transformAdsbImData(data: any, callsign: string, type: 'departure' | 'arrival', airport: string): Flight | null {
    if (!data || !data.route) return null;
    
    const route = data.route;
    const isCorrectType = (type === 'departure' && route.origin === airport) || 
                         (type === 'arrival' && route.destination === airport);
    
    if (!isCorrectType) return null;
    
    return {
      id: `${callsign}-${Date.now()}`,
      flightNumber: callsign,
      airline: data.airline || this.extractAirlineFromCallsign(callsign),
      destination: route.destination || 'Unknown',
      destinationCode: route.destination || 'UNK',
      origin: route.origin || 'Unknown',
      originCode: route.origin || 'UNK',
      scheduledTime: data.scheduled ? new Date(data.scheduled) : new Date(),
      estimatedTime: data.estimated ? new Date(data.estimated) : undefined,
      actualTime: data.actual ? new Date(data.actual) : undefined,
      gate: data.gate || 'N/A',
      terminal: data.terminal,
      status: this.mapAdsbImStatus(data.status),
      aircraft: data.aircraft || data.type,
      duration: data.duration
    };
  }

  private mapAdsbImStatus(status?: string): FlightStatus {
    if (!status) return 'scheduled';
    
    const statusMap: Record<string, FlightStatus> = {
      'scheduled': 'scheduled',
      'boarding': 'boarding',
      'departed': 'departed',
      'in-flight': 'departed',
      'airborne': 'departed',
      'landed': 'landed',
      'arrived': 'landed',
      'cancelled': 'cancelled',
      'delayed': 'delayed'
    };
    
    return statusMap[status.toLowerCase()] || 'scheduled';
  }

  private extractAirlineFromCallsign(callsign: string): string {
    const airlineMap: Record<string, string> = {
      'UAL': 'United Airlines',
      'AAL': 'American Airlines',
      'DAL': 'Delta Air Lines',
      'SWA': 'Southwest Airlines',
      'ASA': 'Alaska Airlines',
      'JBU': 'JetBlue Airways',
      'NKS': 'Spirit Airlines',
      'FFT': 'Frontier Airlines'
    };
    
    const prefix = callsign.substring(0, 3);
    return airlineMap[prefix] || 'Unknown Airline';
  }

  private async getAirportCoordinates(airport: string): Promise<{ latitude: number, longitude: number } | null> {
    try {
      const { fetchAirportCoordinates } = await import('./airport-coords');
      return await fetchAirportCoordinates(airport);
    } catch (error) {
      console.error('Error fetching airport coordinates:', error);
      return null;
    }
  }

  async fetchAirportInfo(code: string): Promise<Airport | null> {
    // adsb.im doesn't provide airport info
    return null;
  }
}

// ============================================================================
// PROVIDER FACTORY WITH PRIORITY SYSTEM
// ============================================================================
export function getConfiguredProviders(): FlightDataProvider[] {
  const providers: FlightDataProvider[] = [];
  
  // Priority order from environment variable
  const priorityOrder = process.env.FLIGHT_PROVIDER_PRIORITY?.split(',').map(p => p.trim()) || [
    'airframes',
    'flightaware',
    'aviationstack',
    'flightradar24',
    'airnav',
    'adsbim',
    'opensky'
  ];

  const providerMap: Record<string, () => FlightDataProvider | null> = {
    'airframes': () => {
      const apiKey = process.env.AIRFRAMES_API_KEY;
      return apiKey ? new AirframesProvider(apiKey) : null;
    },
    'flightaware': () => {
      const apiKey = process.env.FLIGHTAWARE_API_KEY;
      return apiKey ? new FlightAwareProvider(apiKey) : null;
    },
    'flightradar24': () => {
      const apiKey = process.env.FLIGHTRADAR24_API_KEY;
      return apiKey ? new FlightRadar24Provider(apiKey) : null;
    },
    'airnav': () => {
      const apiKey = process.env.AIRNAV_API_KEY;
      return apiKey ? new AirNavProvider(apiKey) : null;
    },
    'adsbim': () => {
      // No API key required for adsb.im
      return new AdsbImProvider();
    },
    'aviationstack': () => {
      // Import from existing file
      const { AviationStackProvider } = require('./aviation-api');
      const apiKey = process.env.AVIATIONSTACK_API_KEY;
      return apiKey ? new AviationStackProvider() : null;
    },
    'opensky': () => {
      // Import from existing file
      const { OpenSkyProvider } = require('./aviation-api');
      return new OpenSkyProvider();
    }
  };

  // Add providers in priority order
  for (const providerName of priorityOrder) {
    const createProvider = providerMap[providerName.toLowerCase()];
    if (createProvider) {
      const provider = createProvider();
      if (provider) {
        providers.push(provider);
        console.log(`Configured provider: ${providerName}`);
      }
    }
  }

  return providers;
}

// ============================================================================
// AGGREGATED PROVIDER (Tries multiple providers in order)
// ============================================================================
export class AggregatedFlightProvider implements FlightDataProvider {
  private providers: FlightDataProvider[];

  constructor() {
    this.providers = getConfiguredProviders();
    if (this.providers.length === 0) {
      console.warn('No flight data providers configured, using default OpenSky');
      const { OpenSkyProvider } = require('./aviation-api');
      this.providers = [new OpenSkyProvider()];
    }
  }

  async fetchFlights(airport: string, type: 'departure' | 'arrival'): Promise<Flight[]> {
    for (const provider of this.providers) {
      try {
        const flights = await provider.fetchFlights(airport, type);
        if (flights && flights.length > 0) {
          return flights;
        }
      } catch (error) {
        console.error(`Provider failed, trying next:`, error);
      }
    }
    
    return [];
  }

  async fetchAirportInfo(code: string): Promise<Airport | null> {
    for (const provider of this.providers) {
      try {
        const info = await provider.fetchAirportInfo(code);
        if (info) {
          return info;
        }
      } catch (error) {
        console.error(`Provider failed for airport info, trying next:`, error);
      }
    }
    
    return null;
  }
}