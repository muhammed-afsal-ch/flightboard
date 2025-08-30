import { Flight, Airport } from '@/types/flight';

export const airports: Record<string, Airport> = {
  KSMF: {
    code: 'KSMF',
    name: 'Sacramento International Airport',
    city: 'Sacramento',
    country: 'USA',
    timezone: 'America/Los_Angeles'
  },
  KLAX: {
    code: 'KLAX',
    name: 'Los Angeles International Airport',
    city: 'Los Angeles',
    country: 'USA',
    timezone: 'America/Los_Angeles'
  },
  KJFK: {
    code: 'KJFK',
    name: 'John F. Kennedy International Airport',
    city: 'New York',
    country: 'USA',
    timezone: 'America/New_York'
  },
  KORD: {
    code: 'KORD',
    name: "O'Hare International Airport",
    city: 'Chicago',
    country: 'USA',
    timezone: 'America/Chicago'
  },
  KDFW: {
    code: 'KDFW',
    name: 'Dallas/Fort Worth International Airport',
    city: 'Dallas',
    country: 'USA',
    timezone: 'America/Chicago'
  },
  KSFO: {
    code: 'KSFO',
    name: 'San Francisco International Airport',
    city: 'San Francisco',
    country: 'USA',
    timezone: 'America/Los_Angeles'
  },
  KDEN: {
    code: 'KDEN',
    name: 'Denver International Airport',
    city: 'Denver',
    country: 'USA',
    timezone: 'America/Denver'
  },
  KATL: {
    code: 'KATL',
    name: 'Hartsfield-Jackson Atlanta International Airport',
    city: 'Atlanta',
    country: 'USA',
    timezone: 'America/New_York'
  },
  KPHX: {
    code: 'KPHX',
    name: 'Phoenix Sky Harbor International Airport',
    city: 'Phoenix',
    country: 'USA',
    timezone: 'America/Phoenix'
  },
  KSEA: {
    code: 'KSEA',
    name: 'Seattle-Tacoma International Airport',
    city: 'Seattle',
    country: 'USA',
    timezone: 'America/Los_Angeles'
  }
};

const airlines = [
  { name: 'United Airlines', code: 'UA' },
  { name: 'American Airlines', code: 'AA' },
  { name: 'Delta Air Lines', code: 'DL' },
  { name: 'Southwest Airlines', code: 'WN' },
  { name: 'Alaska Airlines', code: 'AS' },
  { name: 'JetBlue Airways', code: 'B6' },
  { name: 'Spirit Airlines', code: 'NK' },
  { name: 'Frontier Airlines', code: 'F9' }
];

const aircraftTypes = [
  'Boeing 737-800',
  'Boeing 737 MAX 9',
  'Boeing 757-200',
  'Boeing 777-300ER',
  'Airbus A320',
  'Airbus A321neo',
  'Airbus A350-900',
  'Embraer E175'
];

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateFlightNumber(airlineCode: string): string {
  return `${airlineCode}${Math.floor(Math.random() * 9000) + 1000}`;
}

function generateTime(baseTime: Date, offsetMinutes: number): Date {
  const time = new Date(baseTime);
  time.setMinutes(time.getMinutes() + offsetMinutes);
  return time;
}

export function generateMockFlights(airportCode: string, type: 'departure' | 'arrival', count: number = 20): Flight[] {
  const flights: Flight[] = [];
  const now = new Date();
  const airportCodes = Object.keys(airports).filter(code => code !== airportCode);
  
  for (let i = 0; i < count; i++) {
    const airline = randomElement(airlines);
    const otherAirport = randomElement(airportCodes);
    const scheduledOffset = (i - 5) * 30; // Flights from 2.5 hours ago to future
    const scheduledTime = generateTime(now, scheduledOffset);
    
    // Determine status based on time
    let status: Flight['status'] = 'scheduled';
    let estimatedTime: Date | undefined;
    let actualTime: Date | undefined;
    
    const timeDiff = scheduledTime.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    if (minutesDiff < -30) {
      status = type === 'departure' ? 'departed' : 'landed';
      actualTime = generateTime(scheduledTime, Math.floor(Math.random() * 20) - 10);
    } else if (minutesDiff < 0) {
      status = type === 'departure' ? 'boarding' : 'arriving';
      estimatedTime = generateTime(scheduledTime, Math.floor(Math.random() * 15));
    } else if (minutesDiff < 60) {
      // Some upcoming flights might be delayed
      if (Math.random() < 0.2) {
        status = 'delayed';
        estimatedTime = generateTime(scheduledTime, Math.floor(Math.random() * 60) + 15);
      }
      // Small chance of cancellation
      if (Math.random() < 0.05) {
        status = 'cancelled';
      }
    }
    
    const flight: Flight = {
      id: `${airline.code}-${i}-${Date.now()}`,
      flightNumber: generateFlightNumber(airline.code),
      airline: airline.name,
      destination: type === 'departure' ? airports[otherAirport].city : airports[airportCode].city,
      destinationCode: type === 'departure' ? otherAirport : airportCode,
      origin: type === 'arrival' ? airports[otherAirport].city : airports[airportCode].city,
      originCode: type === 'arrival' ? otherAirport : airportCode,
      scheduledTime,
      estimatedTime,
      actualTime,
      gate: `${randomElement(['A', 'B', 'C', 'D'])}${Math.floor(Math.random() * 30) + 1}`,
      terminal: Math.random() > 0.5 ? randomElement(['1', '2', '3']) : undefined,
      status,
      aircraft: randomElement(aircraftTypes),
      duration: `${Math.floor(Math.random() * 4) + 1}h ${Math.floor(Math.random() * 60)}m`
    };
    
    flights.push(flight);
  }
  
  // Sort by scheduled time
  return flights.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
}

// Simulate real-time updates
export function simulateFlightUpdates(flights: Flight[]): Flight[] {
  return flights.map(flight => {
    const now = new Date();
    const timeDiff = flight.scheduledTime.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    // Update status based on current time
    if (flight.status !== 'cancelled') {
      if (minutesDiff < -30 && flight.status !== 'departed' && flight.status !== 'landed') {
        return {
          ...flight,
          status: flight.destinationCode === flight.originCode ? 'landed' : 'departed',
          actualTime: flight.estimatedTime || flight.scheduledTime
        };
      } else if (minutesDiff < 0 && minutesDiff > -30 && flight.status === 'scheduled') {
        return {
          ...flight,
          status: flight.destinationCode === flight.originCode ? 'arriving' : 'boarding'
        };
      }
    }
    
    return flight;
  });
}