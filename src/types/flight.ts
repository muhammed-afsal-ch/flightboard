export type FlightStatus = 'scheduled' | 'boarding' | 'departed' | 'arriving' | 'landed' | 'delayed' | 'cancelled';

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  airlineLogo?: string;
  destination: string;
  destinationCode: string;
  origin: string;
  originCode: string;
  scheduledTime: Date;
  estimatedTime?: Date;
  actualTime?: Date;
  gate: string;
  terminal?: string;
  status: FlightStatus;
  aircraft?: string;
  duration?: string;
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
}

export type FlightType = 'departure' | 'arrival';