'use client';

import { useState, useEffect } from 'react';
import { Airport } from '@/types/flight';
import { FlapDisplay } from './flap-display';

interface AirportInfoProps {
  airportCode: string;
  currentTime: Date;
}

export function AirportInfo({ airportCode, currentTime }: AirportInfoProps) {
  const [airportInfo, setAirportInfo] = useState<Airport | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAirportInfo = async () => {
      try {
        const response = await fetch(`https://api.airframes.io/airports/icao/${airportCode}`);
        if (response.ok) {
          const data = await response.json();
          setAirportInfo({
            code: data.icao || data.iata || airportCode,
            name: data.name || data.airport_name || 'Unknown Airport',
            city: data.city || data.municipality || 'Unknown City',
            country: data.country || data.country_name || 'Unknown Country',
            timezone: data.timezone || 'UTC'
          });
          
          // Also store weather data if available
          if (data.weather || data.metar) {
            setWeather(data.weather || data.metar);
          }
        }
      } catch (error) {
        console.error('Failed to fetch airport info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAirportInfo();
  }, [airportCode]);

  const formatLocalTime = (date: Date, timezone: string) => {
    try {
      return date.toLocaleString('en-US', { 
        timeZone: timezone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch {
      return date.toLocaleString('en-US', { 
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    }
  };

  return (
    <div className="text-center space-y-4 mb-8">
      <div className="space-y-2">
        <h1 className="text-5xl font-bold font-mono tracking-wider" style={{ color: 'hsl(var(--primary))' }}>
          <FlapDisplay value={airportCode.padEnd(4, ' ')} size="large" />
        </h1>
        
        {airportInfo && !loading && (
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold" style={{ color: 'hsl(var(--primary))' }}>
              {airportInfo.name}
            </h2>
            <p className="text-lg" style={{ color: 'hsl(var(--muted-foreground))' }}>
              {airportInfo.city}, {airportInfo.country}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-8 font-mono" style={{ color: 'hsl(var(--muted-foreground))' }}>
        <div>
          <span className="text-xs block" style={{ color: 'hsl(var(--muted-foreground))' }}>LOCAL TIME</span>
          <span className="text-xl" style={{ color: 'hsl(var(--primary))' }}>
            {airportInfo ? formatLocalTime(currentTime, airportInfo.timezone) : '--:--:--'}
          </span>
        </div>
        <div>
          <span className="text-xs block" style={{ color: 'hsl(var(--muted-foreground))' }}>UTC TIME</span>
          <span className="text-xl" style={{ color: 'hsl(var(--foreground))' }}>
            {currentTime.toLocaleString('en-US', { 
              timeZone: 'UTC',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            })}
          </span>
        </div>
      </div>

      {weather && (
        <div className="mt-4 p-3 rounded-lg border max-w-2xl mx-auto" style={{ backgroundColor: 'hsl(var(--muted))', borderColor: 'hsl(var(--border))' }}>
          <span className="text-xs block mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>WEATHER / METAR</span>
          <p className="text-sm font-mono" style={{ color: 'hsl(var(--foreground))' }}>
            {typeof weather === 'string' ? weather : JSON.stringify(weather)}
          </p>
        </div>
      )}
    </div>
  );
}