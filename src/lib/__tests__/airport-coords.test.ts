import { fetchAirportCoordinates, calculateBoundingBox, AirportCoordinates } from '../airport-coords'

// Mock fetch globally
global.fetch = jest.fn()

describe('airport-coords', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('fetchAirportCoordinates', () => {
    it('should return cached coordinates if available', async () => {
      const result = await fetchAirportCoordinates('KSMF')
      expect(result).toEqual({
        latitude: 38.6954,
        longitude: -121.5908,
      })
      expect(fetch).not.toHaveBeenCalled()
    })

    it('should fetch coordinates from API if not cached', async () => {
      const mockResponse = {
        latitude: 51.4700,
        longitude: -0.4543,
      }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await fetchAirportCoordinates('EGLL')
      expect(result).toEqual(mockResponse)
      expect(fetch).toHaveBeenCalledWith('https://api.airframes.io/airports/icao/EGLL')
    })

    it('should handle alternative coordinate field names', async () => {
      const mockResponse = {
        lat: 48.8566,
        lon: 2.3522,
      }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await fetchAirportCoordinates('LFPG')
      expect(result).toEqual({
        latitude: 48.8566,
        longitude: 2.3522,
      })
    })

    it('should return null if API request fails', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      })

      const result = await fetchAirportCoordinates('INVALID')
      expect(result).toBeNull()
    })

    it('should return null and log error if fetch throws', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      const result = await fetchAirportCoordinates('ERROR')
      expect(result).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to fetch coordinates for ERROR:',
        expect.any(Error)
      )

      consoleErrorSpy.mockRestore()
    })

    it('should cache fetched coordinates for subsequent calls', async () => {
      const mockResponse = {
        latitude: 35.6762,
        longitude: 139.6503,
      }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      // First call - should fetch from API
      const result1 = await fetchAirportCoordinates('RJTT')
      expect(result1).toEqual(mockResponse)
      expect(fetch).toHaveBeenCalledTimes(1)

      // Second call - should use cache
      const result2 = await fetchAirportCoordinates('RJTT')
      expect(result2).toEqual(mockResponse)
      expect(fetch).toHaveBeenCalledTimes(1) // Still only called once
    })
  })

  describe('calculateBoundingBox', () => {
    it('should calculate bounding box with default radius', () => {
      const coords: AirportCoordinates = {
        latitude: 40.0,
        longitude: -74.0,
      }

      const bbox = calculateBoundingBox(coords)
      
      // Check that the bounding box is roughly correct
      expect(bbox.lat1).toBeCloseTo(39.55, 1)
      expect(bbox.lat2).toBeCloseTo(40.45, 1)
      expect(bbox.lon1).toBeLessThan(coords.longitude)
      expect(bbox.lon2).toBeGreaterThan(coords.longitude)
    })

    it('should calculate bounding box with custom radius', () => {
      const coords: AirportCoordinates = {
        latitude: 0,
        longitude: 0,
      }

      const bbox = calculateBoundingBox(coords, 100)
      
      // At the equator, calculations are simpler
      const expectedDelta = 100 / 111.32
      expect(bbox.lat1).toBeCloseTo(-expectedDelta, 2)
      expect(bbox.lat2).toBeCloseTo(expectedDelta, 2)
      expect(bbox.lon1).toBeCloseTo(-expectedDelta, 2)
      expect(bbox.lon2).toBeCloseTo(expectedDelta, 2)
    })

    it('should handle high latitude coordinates correctly', () => {
      const coords: AirportCoordinates = {
        latitude: 70.0,
        longitude: 25.0,
      }

      const bbox = calculateBoundingBox(coords, 50)
      
      // At high latitudes, longitude delta should be larger due to convergence
      const latDelta = Math.abs(bbox.lat2 - bbox.lat1)
      const lonDelta = Math.abs(bbox.lon2 - bbox.lon1)
      
      expect(lonDelta).toBeGreaterThan(latDelta)
    })

    it('should handle negative coordinates', () => {
      const coords: AirportCoordinates = {
        latitude: -33.9425,
        longitude: 151.1775,
      }

      const bbox = calculateBoundingBox(coords, 25)
      
      expect(bbox.lat1).toBeLessThan(coords.latitude)
      expect(bbox.lat2).toBeGreaterThan(coords.latitude)
      expect(bbox.lon1).toBeLessThan(coords.longitude)
      expect(bbox.lon2).toBeGreaterThan(coords.longitude)
    })
  })
})