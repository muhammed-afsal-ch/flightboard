/**
 * @jest-environment node
 */
import { GET } from '@/app/api/flights/route'

// Polyfill for NextRequest in test environment
class MockNextRequest {
  nextUrl: URL
  
  constructor(url: string | URL) {
    this.nextUrl = new URL(url)
  }
}

// Mock the flight providers module
jest.mock('@/lib/flight-providers', () => ({
  AggregatedFlightProvider: jest.fn().mockImplementation(() => ({
    fetchFlights: jest.fn(),
  })),
}))

// Mock the mock-data module
jest.mock('@/lib/mock-data', () => ({
  generateMockFlights: jest.fn().mockImplementation((airport, type, count) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `flight-${i}`,
      flight: `AA${100 + i}`,
      airline: 'American Airlines',
      origin: type === 'departure' ? airport : 'KLAX',
      destination: type === 'arrival' ? airport : 'KJFK',
      scheduledTime: new Date(Date.now() + i * 3600000).toISOString(),
      estimatedTime: new Date(Date.now() + i * 3600000 + 300000).toISOString(),
      status: 'scheduled',
      gate: `A${i + 1}`,
      terminal: '1',
    }))
  }),
  simulateFlightUpdates: jest.fn().mockImplementation((flights) => flights),
  airports: {},
}))

describe('Flights API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/flights', () => {
    it('should return mock flights when mock=true', async () => {
      const url = new URL('http://localhost:3000/api/flights?mock=true&airport=KSMF&type=departure&count=5')
      const request = new MockNextRequest(url) as any
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(data).toHaveProperty('airport', 'KSMF')
      expect(data).toHaveProperty('type', 'departure')
      expect(data).toHaveProperty('dataSource', 'mock')
      expect(data).toHaveProperty('flights')
      expect(data.flights).toHaveLength(5)
      expect(data).toHaveProperty('timestamp')
    })

    it('should use default parameters when not provided', async () => {
      const url = new URL('http://localhost:3000/api/flights')
      const request = new MockNextRequest(url) as any
      
      const { generateMockFlights } = require('@/lib/mock-data')
      generateMockFlights.mockReturnValue([])
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(data.airport).toBe('KSMF')
      expect(data.type).toBe('departure')
      expect(generateMockFlights).toHaveBeenCalledWith('KSMF', 'departure', 20)
    })

    it('should handle arrival type correctly', async () => {
      const url = new URL('http://localhost:3000/api/flights?type=arrival&airport=KLAX')
      const request = new MockNextRequest(url) as any
      
      const { generateMockFlights } = require('@/lib/mock-data')
      generateMockFlights.mockReturnValue([])
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(data.type).toBe('arrival')
      expect(data.airport).toBe('KLAX')
    })

    it('should attempt to fetch real data when mock=false', async () => {
      const url = new URL('http://localhost:3000/api/flights?mock=false&airport=KSMF')
      const request = new MockNextRequest(url) as any
      
      const { AggregatedFlightProvider } = require('@/lib/flight-providers')
      // Reset the mock implementation for this test
      AggregatedFlightProvider.mockImplementation(() => ({
        fetchFlights: jest.fn().mockResolvedValue([
          {
            id: 'real-1',
            flight: 'UA123',
            airline: 'United Airlines',
            origin: 'KSMF',
            destination: 'KDEN',
            status: 'scheduled',
          },
        ])
      }))
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(data.dataSource).toBe('api')
      expect(data.flights).toHaveLength(1)
      expect(data.flights[0].flight).toBe('UA123')
    })

    it('should fallback to mock data when API fails', async () => {
      const url = new URL('http://localhost:3000/api/flights?airport=KSMF')
      const request = new MockNextRequest(url) as any
      
      const { AggregatedFlightProvider } = require('@/lib/flight-providers')
      AggregatedFlightProvider.mockImplementation(() => ({
        fetchFlights: jest.fn().mockRejectedValue(new Error('API Error'))
      }))
      
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(data.dataSource).toBe('mock')
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to fetch real flight data:',
        expect.any(Error)
      )
      
      consoleErrorSpy.mockRestore()
    })

    it('should fallback to mock when API returns empty array', async () => {
      const url = new URL('http://localhost:3000/api/flights?airport=KSMF')
      const request = new MockNextRequest(url) as any
      
      const { AggregatedFlightProvider } = require('@/lib/flight-providers')
      AggregatedFlightProvider.mockImplementation(() => ({
        fetchFlights: jest.fn().mockResolvedValue([])
      }))
      
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()
      
      const response = await GET(request)
      const data = await response.json()
      
      expect(data.dataSource).toBe('mock')
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'No real flight data available, using mock data'
      )
      
      consoleLogSpy.mockRestore()
    })

    it('should simulate flight updates for mock data', async () => {
      const url = new URL('http://localhost:3000/api/flights?mock=true')
      const request = new MockNextRequest(url) as any
      
      const { simulateFlightUpdates } = require('@/lib/mock-data')
      const mockFlights = [{ id: '1', status: 'scheduled' }]
      simulateFlightUpdates.mockReturnValue([{ id: '1', status: 'boarding' }])
      
      await GET(request)
      
      expect(simulateFlightUpdates).toHaveBeenCalled()
    })

    it('should include timestamp in response', async () => {
      const url = new URL('http://localhost:3000/api/flights')
      const request = new MockNextRequest(url) as any
      
      const beforeTime = new Date().toISOString()
      const response = await GET(request)
      const data = await response.json()
      const afterTime = new Date().toISOString()
      
      expect(data.timestamp).toBeDefined()
      expect(new Date(data.timestamp).getTime()).toBeGreaterThanOrEqual(new Date(beforeTime).getTime())
      expect(new Date(data.timestamp).getTime()).toBeLessThanOrEqual(new Date(afterTime).getTime())
    })

    it('should parse count parameter correctly', async () => {
      const url = new URL('http://localhost:3000/api/flights?mock=true&count=15')
      const request = new MockNextRequest(url) as any
      
      const { generateMockFlights } = require('@/lib/mock-data')
      
      await GET(request)
      
      expect(generateMockFlights).toHaveBeenCalledWith('KSMF', 'departure', 15)
    })
  })
})