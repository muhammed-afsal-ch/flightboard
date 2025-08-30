import { Flight, Airport } from '@/types/flight';
import { enrichFlightsWithRoutes } from './flight-providers';

// Aviation Edge API (requires API key)
// You can get a free API key from https://aviation-edge.com/
const AVIATION_EDGE_API_KEY = process.env.AVIATION_EDGE_API_KEY || '';

// OpenSky Network API (free, no key required)
const OPENSKY_API_URL = 'https://opensky-network.org/api';

// AviationStack API (free tier available)
const AVIATIONSTACK_API_KEY = process.env.AVIATIONSTACK_API_KEY || '';
const AVIATIONSTACK_API_URL = 'http://api.aviationstack.com/v1';

export interface FlightDataProvider {
  fetchFlights(airport: string, type: 'departure' | 'arrival'): Promise<Flight[]>;
  fetchAirportInfo(code: string): Promise<Airport | null>;
}

// OpenSky Network Provider (Free, no API key required)
export class OpenSkyProvider implements FlightDataProvider {
  async fetchFlights(airport: string, type: 'departure' | 'arrival'): Promise<Flight[]> {
    try {
      const now = Math.floor(Date.now() / 1000);
      const begin = now - 3600; // Last hour
      const end = now;
      
      const endpoint = type === 'departure' 
        ? `${OPENSKY_API_URL}/flights/departure`
        : `${OPENSKY_API_URL}/flights/arrival`;
      
      const response = await fetch(
        `${endpoint}?airport=${airport}&begin=${begin}&end=${end}`
      );
      
      if (!response.ok) {
        throw new Error(`OpenSky API error: ${response.statusText}`);
      }
      
      const data: any = await response.json();
      const flights = this.transformOpenSkyData(data, type);
      
      // Enrich flights with route data
      console.log(`OpenSky: Enriching ${flights.length} flights with route data...`);
      const enrichedFlights = await enrichFlightsWithRoutes(flights);
      return enrichedFlights;
    } catch (error) {
      console.error('OpenSky API error:', error);
      return [];
    }
  }
  
  private transformOpenSkyData(data: any[], type: 'departure' | 'arrival'): Flight[] {
    return data.map((flight, index) => ({
      id: `${flight.icao24}-${index}`,
      flightNumber: flight.callsign?.trim() || 'N/A',
      airline: this.extractAirline(flight.callsign),
      destination: type === 'departure' ? (flight.estArrivalAirport || 'Unknown') : flight.estDepartureAirport,
      destinationCode: type === 'departure' ? (flight.estArrivalAirport || 'UNK') : flight.estDepartureAirport,
      origin: type === 'arrival' ? (flight.estDepartureAirport || 'Unknown') : flight.estArrivalAirport,
      originCode: type === 'arrival' ? (flight.estDepartureAirport || 'UNK') : flight.estArrivalAirport,
      scheduledTime: new Date((type === 'departure' ? flight.firstSeen : flight.lastSeen) * 1000),
      estimatedTime: undefined,
      actualTime: flight.lastSeen ? new Date(flight.lastSeen * 1000) : undefined,
      gate: 'N/A',
      terminal: undefined,
      status: 'scheduled' as const,
      aircraft: undefined,
      duration: undefined
    }));
  }
  
  private extractAirline(callsign?: string): string {
    if (!callsign) return 'Unknown';
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
  
  async fetchAirportInfo(code: string): Promise<Airport | null> {
    // OpenSky doesn't provide airport info, return null
    return null;
  }
}

// AviationStack Provider (Free tier with API key)
export class AviationStackProvider implements FlightDataProvider {
  async fetchFlights(airport: string, type: 'departure' | 'arrival'): Promise<Flight[]> {
    const apiKey = process.env.AVIATIONSTACK_API_KEY || AVIATIONSTACK_API_KEY;
    if (!apiKey) {
      console.warn('AviationStack API key not configured');
      return [];
    }
    
    try {
      const endpoint = type === 'departure' ? 'flights' : 'flights';
      const filter = type === 'departure' ? 'dep_iata' : 'arr_iata';
      
      const response = await fetch(
        `${AVIATIONSTACK_API_URL}/${endpoint}?access_key=${apiKey}&${filter}=${airport}&limit=100`
      );
      
      if (!response.ok) {
        throw new Error(`AviationStack API error: ${response.statusText}`);
      }
      
      const data: any = await response.json();
      return this.transformAviationStackData(data.data || [], type);
    } catch (error) {
      console.error('AviationStack API error:', error);
      return [];
    }
  }
  
  private transformAviationStackData(data: any[], type: 'departure' | 'arrival'): Flight[] {
    return data.map(flight => ({
      id: `${flight.flight.icao || flight.flight.iata}-${Date.now()}`,
      flightNumber: flight.flight.iata || flight.flight.icao || 'N/A',
      airline: flight.airline?.name || 'Unknown',
      destination: type === 'departure' ? flight.arrival.airport : flight.departure.airport,
      destinationCode: type === 'departure' ? flight.arrival.iata : flight.departure.iata,
      origin: type === 'arrival' ? flight.departure.airport : flight.arrival.airport,
      originCode: type === 'arrival' ? flight.departure.iata : flight.arrival.iata,
      scheduledTime: new Date(type === 'departure' ? flight.departure.scheduled : flight.arrival.scheduled),
      estimatedTime: flight[type === 'departure' ? 'departure' : 'arrival'].estimated 
        ? new Date(flight[type === 'departure' ? 'departure' : 'arrival'].estimated)
        : undefined,
      actualTime: flight[type === 'departure' ? 'departure' : 'arrival'].actual
        ? new Date(flight[type === 'departure' ? 'departure' : 'arrival'].actual)
        : undefined,
      gate: flight[type === 'departure' ? 'departure' : 'arrival'].gate || 'N/A',
      terminal: flight[type === 'departure' ? 'departure' : 'arrival'].terminal,
      status: this.mapFlightStatus(flight.flight_status),
      aircraft: flight.aircraft?.model,
      duration: undefined
    }));
  }
  
  private mapFlightStatus(status: string): Flight['status'] {
    const statusMap: Record<string, Flight['status']> = {
      'scheduled': 'scheduled',
      'active': 'departed',
      'landed': 'landed',
      'cancelled': 'cancelled',
      'incident': 'delayed',
      'diverted': 'delayed'
    };
    
    return statusMap[status] || 'scheduled';
  }
  
  async fetchAirportInfo(code: string): Promise<Airport | null> {
    if (!AVIATIONSTACK_API_KEY) {
      return null;
    }
    
    try {
      const response = await fetch(
        `${AVIATIONSTACK_API_URL}/airports?access_key=${AVIATIONSTACK_API_KEY}&iata_code=${code}`
      );
      
      if (!response.ok) {
        throw new Error(`AviationStack API error: ${response.statusText}`);
      }
      
      const data: any = await response.json();
      if (data.data && data.data.length > 0) {
        const airport = data.data[0];
        return {
          code: airport.iata_code,
          name: airport.airport_name,
          city: airport.city,
          country: airport.country_name,
          timezone: airport.timezone
        };
      }
      
      return null;
    } catch (error) {
      console.error('AviationStack API error:', error);
      return null;
    }
  }
}

// Factory to get the appropriate provider
export function getFlightDataProvider(): FlightDataProvider {
  if (AVIATIONSTACK_API_KEY) {
    return new AviationStackProvider();
  }
  
  // Default to OpenSky (free, no key required)
  return new OpenSkyProvider();
}