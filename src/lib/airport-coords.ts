// Airport coordinates for bounding box calculations
export interface AirportCoordinates {
  latitude: number;
  longitude: number;
}

// Cache of airport coordinates
const airportCoordsCache: Record<string, AirportCoordinates> = {
  // Major US airports (fallback data)
  KSMF: { latitude: 38.6954, longitude: -121.5908 },
  KLAX: { latitude: 33.9425, longitude: -118.4081 },
  KJFK: { latitude: 40.6413, longitude: -73.7781 },
  KORD: { latitude: 41.9742, longitude: -87.9073 },
  KDFW: { latitude: 32.8998, longitude: -97.0403 },
  KSFO: { latitude: 37.6213, longitude: -122.3790 },
  KDEN: { latitude: 39.8561, longitude: -104.6737 },
  KATL: { latitude: 33.6407, longitude: -84.4277 },
  KPHX: { latitude: 33.4343, longitude: -112.0080 },
  KSEA: { latitude: 47.4502, longitude: -122.3088 },
  KLAS: { latitude: 36.0840, longitude: -115.1537 },
  KMIA: { latitude: 25.7959, longitude: -80.2870 },
  KBOS: { latitude: 42.3656, longitude: -71.0096 },
  KEWR: { latitude: 40.6895, longitude: -74.1745 },
  KIAD: { latitude: 38.9531, longitude: -77.4565 },
  KMSP: { latitude: 44.8848, longitude: -93.2223 },
  KDTW: { latitude: 42.2162, longitude: -83.3554 },
  KPHL: { latitude: 39.8729, longitude: -75.2437 },
  KCLT: { latitude: 35.2144, longitude: -80.9473 },
  KMCO: { latitude: 28.4312, longitude: -81.3081 }
};

// Fetch coordinates from Airframes.io API
export async function fetchAirportCoordinates(icao: string): Promise<AirportCoordinates | null> {
  // Check cache first
  if (airportCoordsCache[icao]) {
    return airportCoordsCache[icao];
  }

  try {
    const response = await fetch(`https://api.airframes.io/airports/icao/${icao}`);
    if (response.ok) {
      const data: any = await response.json();
      const coords: AirportCoordinates = {
        latitude: data.latitude || data.lat,
        longitude: data.longitude || data.lon || data.lng
      };
      
      // Cache the result
      airportCoordsCache[icao] = coords;
      return coords;
    }
  } catch (error) {
    console.error(`Failed to fetch coordinates for ${icao}:`, error);
  }

  // Return null if not found
  return null;
}

// Calculate bounding box around an airport
export function calculateBoundingBox(
  coords: AirportCoordinates,
  radiusKm: number = 50
): { lat1: number; lat2: number; lon1: number; lon2: number } {
  // Approximate degrees per km
  const kmPerDegreeLat = 111.32;
  const kmPerDegreeLon = 111.32 * Math.cos(coords.latitude * Math.PI / 180);
  
  const latDelta = radiusKm / kmPerDegreeLat;
  const lonDelta = radiusKm / kmPerDegreeLon;
  
  return {
    lat1: coords.latitude - latDelta,
    lat2: coords.latitude + latDelta,
    lon1: coords.longitude - lonDelta,
    lon2: coords.longitude + lonDelta
  };
}