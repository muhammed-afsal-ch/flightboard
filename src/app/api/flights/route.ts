import { NextRequest, NextResponse } from 'next/server';
import { generateMockFlights, simulateFlightUpdates } from '@/lib/mock-data';
import { AggregatedFlightProvider } from '@/lib/flight-providers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const airport = searchParams.get('airport') || 'KSMF';
  const type = searchParams.get('type') as 'departure' | 'arrival' || 'departure';
  const count = parseInt(searchParams.get('count') || '20');
  const useMock = searchParams.get('mock') === 'true';
  
  let flights;
  let dataSource = 'mock';
  
  // Try to fetch real data first, fall back to mock if it fails or is requested
  if (!useMock) {
    try {
      const provider = new AggregatedFlightProvider();
      flights = await provider.fetchFlights(airport, type);
      
      // If no real data available, use mock
      if (!flights || flights.length === 0) {
        console.log('No real flight data available, using mock data');
        flights = generateMockFlights(airport, type, count);
        dataSource = 'mock';
      } else {
        dataSource = 'api';
        console.log(`Successfully fetched ${flights.length} flights from API`);
      }
    } catch (error) {
      console.error('Failed to fetch real flight data:', error);
      flights = generateMockFlights(airport, type, count);
      dataSource = 'mock';
    }
  } else {
    flights = generateMockFlights(airport, type, count);
    dataSource = 'mock';
  }
  
  // Simulate real-time updates for mock data
  if (dataSource === 'mock') {
    flights = simulateFlightUpdates(flights);
  }
  
  return NextResponse.json({
    airport,
    type,
    flights,
    dataSource,
    timestamp: new Date().toISOString()
  });
}