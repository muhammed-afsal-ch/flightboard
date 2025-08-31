'use client';

import { Airport } from '@/types/flight';
import { FlapDisplay } from './flap-display';
import { HeaderThemeControls } from './theme-controls';
import { FlightBoardLogo } from './flightboard-logo';
import { useTheme } from '@/contexts/theme-context';
import { useState, useEffect } from 'react';

interface CompactHeaderProps {
  airportCode: string;
  currentTime: Date;
}

export function CompactHeader({ airportCode, currentTime }: CompactHeaderProps) {
  const [airportInfo, setAirportInfo] = useState<Airport | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { theme, effectiveColorMode } = useTheme();

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
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch {
      return date.toLocaleString('en-US', { 
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    }
  };

  const formatDate = (date: Date, timezone: string) => {
    try {
      return date.toLocaleString('en-US', { 
        timeZone: timezone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return date.toLocaleString('en-US', { 
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const headerMargin = theme.name === 'superthin' ? 'mb-2' : 'mb-6';
  const headerBottomMargin = theme.name === 'superthin' ? 'mb-1' : 'mb-4';
  const headerGap = theme.name === 'superthin' ? 'gap-2' : 'gap-6';

  return (
    <div className={`w-full ${headerMargin}`}>
      <div className={`flex items-center justify-between ${headerBottomMargin}`}>
        <FlightBoardLogo />
        
        <div className={`flex items-center ${headerGap}`}>
          {/* Time Display - Browser Local */}
          <div className="font-mono">
            <span className="text-xs block" style={{ color: `hsl(${theme.colors[effectiveColorMode].mutedForeground})` }}>LOCAL</span>
            <span className={theme.name === 'superthin' ? 'text-sm' : 'text-xl'} style={{ color: `hsl(${theme.colors[effectiveColorMode].foreground})` }}>
              {currentTime.toLocaleString('en-US', { 
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
              })}
            </span>
          </div>

          {/* Airport Info */}
          <div className={`flex items-center ${theme.name === 'superthin' ? 'gap-2' : 'gap-4'}`}>
            <div className={`${theme.name === 'superthin' ? 'text-lg' : 'text-3xl'} font-bold font-mono`} style={{ color: `hsl(${theme.colors[effectiveColorMode].primary})` }}>
              <FlapDisplay value={airportCode.padEnd(4, ' ')} size={theme.name === 'superthin' ? 'small' : 'medium'} />
            </div>
            {airportInfo && !loading && (
              <div>
                <div className={`${theme.name === 'superthin' ? 'text-sm' : 'text-lg'} font-semibold`} style={{ color: `hsl(${theme.colors[effectiveColorMode].foreground})` }}>
                  {airportInfo.name}
                </div>
                <div className={theme.name === 'superthin' ? 'text-xs' : 'text-sm'} style={{ color: `hsl(${theme.colors[effectiveColorMode].mutedForeground})` }}>
                  {airportInfo.city}, {airportInfo.country}
                </div>
              </div>
            )}
          </div>

          {/* Time Display - Airport and UTC */}
          <div className={`flex ${theme.name === 'superthin' ? 'gap-2' : 'gap-4'} font-mono`}>
            <div>
              <span className="text-xs block" style={{ color: `hsl(${theme.colors[effectiveColorMode].mutedForeground})` }}>AIRPORT</span>
              <span className={theme.name === 'superthin' ? 'text-sm' : 'text-xl'} style={{ color: `hsl(${theme.colors[effectiveColorMode].primary})` }}>
                {airportInfo ? formatLocalTime(currentTime, airportInfo.timezone) : '--:--:--'}
              </span>
            </div>
            <div>
              <span className="text-xs block" style={{ color: `hsl(${theme.colors[effectiveColorMode].mutedForeground})` }}>UTC</span>
              <span className={theme.name === 'superthin' ? 'text-sm' : 'text-xl'} style={{ color: `hsl(${theme.colors[effectiveColorMode].foreground})` }}>
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
        </div>

        <HeaderThemeControls />
      </div>

      {/* Weather/METAR - optional compact display */}
      {weather && (
        <div className="p-2 rounded border text-xs font-mono" style={{ 
          backgroundColor: `hsl(${theme.colors[effectiveColorMode].muted})`, 
          borderColor: `hsl(${theme.colors[effectiveColorMode].border})`,
          color: `hsl(${theme.colors[effectiveColorMode].mutedForeground})`
        }}>
          METAR: {typeof weather === 'string' ? weather : JSON.stringify(weather)}
        </div>
      )}
    </div>
  );
}