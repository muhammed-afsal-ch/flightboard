import { airports } from '../mock-data'

describe('mock-data', () => {
  describe('airports', () => {
    it('should contain major US airports', () => {
      expect(airports.KSMF).toBeDefined()
      expect(airports.KLAX).toBeDefined()
      expect(airports.KJFK).toBeDefined()
      expect(airports.KORD).toBeDefined()
    })

    it('should have correct structure for each airport', () => {
      const airport = airports.KSMF
      expect(airport).toHaveProperty('code', 'KSMF')
      expect(airport).toHaveProperty('name', 'Sacramento International Airport')
      expect(airport).toHaveProperty('city', 'Sacramento')
      expect(airport).toHaveProperty('country', 'USA')
      expect(airport).toHaveProperty('timezone', 'America/Los_Angeles')
    })

    it('should use correct timezone for West Coast airports', () => {
      expect(airports.KSMF.timezone).toBe('America/Los_Angeles')
      expect(airports.KLAX.timezone).toBe('America/Los_Angeles')
      expect(airports.KSFO.timezone).toBe('America/Los_Angeles')
    })

    it('should use correct timezone for East Coast airports', () => {
      expect(airports.KJFK.timezone).toBe('America/New_York')
    })

    it('should use correct timezone for Central Time airports', () => {
      expect(airports.KORD.timezone).toBe('America/Chicago')
      expect(airports.KDFW.timezone).toBe('America/Chicago')
    })

    it('should properly escape special characters in airport names', () => {
      expect(airports.KORD.name).toBe("O'Hare International Airport")
    })

    it('should have consistent country codes', () => {
      const usAirports = Object.values(airports).filter(
        airport => airport.country === 'USA'
      )
      expect(usAirports.length).toBeGreaterThan(0)
      usAirports.forEach(airport => {
        expect(airport.code).toMatch(/^K[A-Z]{3}$/)
      })
    })
  })
})