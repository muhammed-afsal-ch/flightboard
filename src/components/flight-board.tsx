'use client';

import { useState, useEffect } from 'react';
import { Flight } from '@/types/flight';
import { FlapDisplay } from './flap-display';
import { CompactHeader } from './compact-header';
import { useTheme } from '@/contexts/theme-context';
import { MatrixRain } from './matrix-rain';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface FlightBoardProps {
  airport: string;
}

export function FlightBoard({ airport }: FlightBoardProps) {
  const { theme, effectiveColorMode } = useTheme();
  const [departures, setDepartures] = useState<Flight[]>([]);
  const [arrivals, setArrivals] = useState<Flight[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<{ departures: string; arrivals: string }>({
    departures: 'unknown',
    arrivals: 'unknown'
  });

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const [depResponse, arrResponse] = await Promise.all([
          fetch(`/api/flights?airport=${airport}&type=departure`),
          fetch(`/api/flights?airport=${airport}&type=arrival`)
        ]);
        
        const depData = await depResponse.json();
        const arrData = await arrResponse.json();
        
        setDepartures(depData.flights);
        setArrivals(arrData.flights);
        setDataSource({
          departures: depData.dataSource || 'unknown',
          arrivals: arrData.dataSource || 'unknown'
        });
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch flights:', error);
        setLoading(false);
      }
    };

    fetchFlights();
    const interval = setInterval(fetchFlights, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [airport]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getStatusBadge = (status: Flight['status']) => {
    const variants: Record<Flight['status'], { text: string; style: React.CSSProperties }> = {
      scheduled: { text: 'SCHEDULED', style: { backgroundColor: 'hsl(var(--flight-scheduled))', color: 'hsl(var(--card))' } },
      boarding: { text: 'BOARDING', style: { backgroundColor: 'hsl(var(--flight-boarding))', color: 'hsl(var(--card))', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' } },
      departed: { text: 'DEPARTED', style: { backgroundColor: 'hsl(var(--flight-departed))', color: 'hsl(var(--card))' } },
      arriving: { text: 'ARRIVING', style: { backgroundColor: 'hsl(var(--flight-arriving))', color: 'hsl(var(--card))', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' } },
      landed: { text: 'LANDED', style: { backgroundColor: 'hsl(var(--flight-arrived))', color: 'hsl(var(--card))' } },
      delayed: { text: 'DELAYED', style: { backgroundColor: 'hsl(var(--flight-delayed))', color: 'hsl(var(--card))' } },
      cancelled: { text: 'CANCELLED', style: { backgroundColor: 'hsl(var(--flight-cancelled))', color: 'hsl(var(--card))' } },
    };
    
    const config = variants[status];
    return (
      <Badge className="font-mono" style={config.style}>
        {config.text}
      </Badge>
    );
  };

  const getStatusText = (status: Flight['status']) => {
    const statusTexts: Record<Flight['status'], string> = {
      scheduled: 'SCHEDULED',
      boarding: 'BOARDING',
      departed: 'DEPARTED',
      arriving: 'ARRIVING',
      landed: 'LANDED',
      delayed: 'DELAYED',
      cancelled: 'CANCELLED',
    };
    return statusTexts[status] || 'UNKNOWN';
  };

  const getStatusFlapClass = (status: Flight['status']) => {
    // Return classes for flap display based on status
    const classMap: Record<Flight['status'], string> = {
      scheduled: '',
      boarding: 'flap-boarding',
      departed: 'flap-departed',
      arriving: 'flap-arriving',
      landed: 'flap-landed',
      delayed: 'flap-delayed',
      cancelled: 'flap-cancelled',
    };
    return classMap[status] || '';
  };

  const FlightTable = ({ flights, type }: { flights: Flight[]; type: 'departure' | 'arrival' }) => {
    const tablePadding = theme.name === 'superthin' ? 'px-2 py-1' : 'px-4 py-2';
    const borderRadius = theme.name === 'superthin' ? 'rounded' : 'rounded-lg';
    
    // Sort flights by time and status
    const sortedFlights = [...flights].sort((a, b) => {
      // First sort by scheduled time
      const timeA = new Date(a.scheduledTime).getTime();
      const timeB = new Date(b.scheduledTime).getTime();
      
      if (timeA !== timeB) {
        return timeA - timeB;
      }
      
      // Then sort by status priority
      const statusPriority: Record<Flight['status'], number> = type === 'departure' ? {
        boarding: 1,      // Show boarding first for departures
        scheduled: 2,
        delayed: 3,
        cancelled: 4,
        departed: 5,      // Show departed last for departures
        arriving: 6,
        landed: 7,
      } : {
        arriving: 1,      // Show arriving first for arrivals
        scheduled: 2,
        delayed: 3,
        cancelled: 4,
        landed: 5,        // Show landed last for arrivals
        boarding: 6,
        departed: 7,
      };
      
      return (statusPriority[a.status] || 99) - (statusPriority[b.status] || 99);
    });
    
    return (
    <div className={`${borderRadius} border overflow-hidden`} style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
      <div className={`${tablePadding} flex justify-between items-center`} style={{ backgroundColor: 'hsl(var(--muted))', borderBottom: '1px solid hsl(var(--border))' }}>
        <span className="text-xs font-mono" style={{ color: 'hsl(var(--muted-foreground))' }}>
          {flights.length} flights
        </span>
        <span className="text-xs font-mono">
          {dataSource[type === 'departure' ? 'departures' : 'arrivals'] === 'api' ? (
            <span style={{ color: 'hsl(var(--flight-arrived))' }}>✓ Live Data</span>
          ) : (
            <span style={{ color: 'hsl(var(--flight-boarding))' }}>⚡ Simulated</span>
          )}
        </span>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent" style={{ borderColor: 'hsl(var(--border))' }}>
            <TableHead className="font-mono" style={{ color: 'hsl(var(--primary))' }}>Flight</TableHead>
            <TableHead className="font-mono" style={{ color: 'hsl(var(--primary))' }}>Airline</TableHead>
            <TableHead className="font-mono" style={{ color: 'hsl(var(--primary))' }}>
              {type === 'departure' ? 'Destination' : 'Origin'}
            </TableHead>
            <TableHead className="font-mono" style={{ color: 'hsl(var(--primary))' }}>Time</TableHead>
            <TableHead className="font-mono" style={{ color: 'hsl(var(--primary))' }}>Gate</TableHead>
            <TableHead className="font-mono text-right" style={{ color: 'hsl(var(--primary))' }}>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedFlights.map((flight) => (
            <TableRow key={flight.id} className="hover:opacity-80" style={{ borderColor: 'hsl(var(--border))' }}>
              <TableCell className="font-mono align-middle">
                <FlapDisplay value={flight.flightNumber.padEnd(7, ' ')} size="small" />
              </TableCell>
              <TableCell style={{ color: 'hsl(var(--foreground))' }}>
                {theme.name === 'airport' ? (
                  <FlapDisplay value={flight.airline.padEnd(20, ' ').substring(0, 20)} size="small" />
                ) : (
                  flight.airline
                )}
              </TableCell>
              <TableCell style={{ color: 'hsl(var(--foreground))' }}>
                {theme.name === 'airport' ? (
                  <div className="space-y-1">
                    <FlapDisplay 
                      value={(() => {
                        const code = type === 'departure' ? flight.destinationCode : flight.originCode;
                        const city = type === 'departure' ? flight.destination : flight.origin;
                        const displayCode = code === 'ENR' ? '????' : code;
                        const displayCity = city === 'En Route' ? '' : city;
                        return displayCity ? `${displayCode} ${displayCity}`.padEnd(25, ' ').substring(0, 25) : displayCode.padEnd(25, ' ');
                      })()} 
                      size="small" 
                    />
                  </div>
                ) : (
                  <div>
                    <div className="font-semibold">
                      {(() => {
                        const code = type === 'departure' ? flight.destinationCode : flight.originCode;
                        const city = type === 'departure' ? flight.destination : flight.origin;
                        const displayCode = code === 'ENR' ? '????' : code;
                        const displayCity = city === 'En Route' ? '' : city;
                        return displayCity ? `${displayCode} ${displayCity}` : displayCode;
                      })()}
                    </div>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-mono">
                    <FlapDisplay value={formatTime(flight.scheduledTime)} size="small" />
                  </div>
                  {flight.estimatedTime && (
                    <div className="text-xs" style={{ color: 'hsl(var(--flight-arriving))' }}>
                      {theme.name === 'airport' ? (
                        <FlapDisplay value={`EST ${formatTime(flight.estimatedTime)}`} size="small" />
                      ) : (
                        `Est: ${formatTime(flight.estimatedTime)}`
                      )}
                    </div>
                  )}
                  {flight.actualTime && (
                    <div className="text-xs" style={{ color: 'hsl(var(--flight-arrived))' }}>
                      {theme.name === 'airport' ? (
                        <FlapDisplay value={`ACT ${formatTime(flight.actualTime)}`} size="small" />
                      ) : (
                        `Act: ${formatTime(flight.actualTime)}`
                      )}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-mono" style={{ color: 'hsl(var(--foreground))' }}>
                {theme.name === 'airport' ? (
                  <FlapDisplay 
                    value={(flight.gate === 'N/A' ? '     ' : (flight.terminal ? `T${flight.terminal}-${flight.gate || ''}` : flight.gate || '     ')).padEnd(5, ' ')} 
                    size="small" 
                  />
                ) : (
                  <>{flight.gate !== 'N/A' && <>{flight.terminal && `T${flight.terminal}-`}{flight.gate}</>}</>
                )}
              </TableCell>
              <TableCell className="text-right">
                {theme.name === 'airport' ? (
                  <div className="flex justify-end">
                    <FlapDisplay 
                      value={getStatusText(flight.status).padEnd(10, ' ')} 
                      size="small"
                      className={getStatusFlapClass(flight.status)}
                    />
                  </div>
                ) : (
                  getStatusBadge(flight.status)
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: 'hsl(var(--background))' }}>
        <div className="text-2xl font-mono animate-pulse" style={{ color: 'hsl(var(--primary))' }}>Loading flights...</div>
      </div>
    );
  }
  
  // Apply theme-specific padding
  const containerPadding = theme.name === 'superthin' ? 'p-2' : 'p-8';
  const containerSpacing = theme.name === 'superthin' ? 'space-y-2' : 'space-y-6';

  return (
    <>
      <MatrixRain />
      <div className={`min-h-screen ${containerPadding} relative`} style={{ 
        backgroundColor: theme.name === 'matrix' 
          ? (effectiveColorMode === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.90)')
          : 'hsl(var(--background))',
        zIndex: 1
      }}>
        <div className={`max-w-7xl mx-auto ${containerSpacing}`}>
          <CompactHeader airportCode={airport} currentTime={currentTime} />

        <Tabs defaultValue="departures" className="w-full">
          <TabsList className="grid w-full grid-cols-2" style={{ backgroundColor: 'hsl(var(--muted))' }}>
            <TabsTrigger 
              value="departures" 
              className="font-mono"
              style={{ color: 'hsl(var(--primary))' }}
            >
              DEPARTURES
            </TabsTrigger>
            <TabsTrigger 
              value="arrivals"
              className="font-mono"
              style={{ color: 'hsl(var(--primary))' }}
            >
              ARRIVALS
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="departures" className={theme.name === 'superthin' ? 'mt-2' : 'mt-6'}>
            <FlightTable flights={departures} type="departure" />
          </TabsContent>
          
          <TabsContent value="arrivals" className={theme.name === 'superthin' ? 'mt-2' : 'mt-6'}>
            <FlightTable flights={arrivals} type="arrival" />
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </>
  );
}