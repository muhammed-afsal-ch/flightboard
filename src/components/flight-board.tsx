'use client';

import { useState, useEffect } from 'react';
import { Flight } from '@/types/flight';
import { FlapDisplay } from './flap-display';
import { AirportInfo } from './airport-info';
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
    const variants: Record<Flight['status'], { variant: any; text: string; className: string }> = {
      scheduled: { variant: 'secondary', text: 'SCHEDULED', className: 'bg-gray-600' },
      boarding: { variant: 'default', text: 'BOARDING', className: 'bg-green-600 animate-pulse' },
      departed: { variant: 'default', text: 'DEPARTED', className: 'bg-blue-600' },
      arriving: { variant: 'default', text: 'ARRIVING', className: 'bg-yellow-600 animate-pulse' },
      landed: { variant: 'default', text: 'LANDED', className: 'bg-green-600' },
      delayed: { variant: 'destructive', text: 'DELAYED', className: 'bg-red-600' },
      cancelled: { variant: 'destructive', text: 'CANCELLED', className: 'bg-red-800' },
    };
    
    const config = variants[status];
    return (
      <Badge className={`${config.className} text-white font-mono`}>
        {config.text}
      </Badge>
    );
  };

  const FlightTable = ({ flights, type }: { flights: Flight[]; type: 'departure' | 'arrival' }) => (
    <div className="bg-black/90 rounded-lg border border-gray-800 overflow-hidden">
      <div className="px-4 py-2 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
        <span className="text-xs text-gray-500 font-mono">
          {flights.length} flights
        </span>
        <span className="text-xs font-mono">
          {dataSource[type === 'departure' ? 'departures' : 'arrivals'] === 'api' ? (
            <span className="text-green-500">✓ Live Data</span>
          ) : (
            <span className="text-yellow-500">⚡ Simulated</span>
          )}
        </span>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-gray-800 hover:bg-transparent">
            <TableHead className="text-yellow-500 font-mono">Flight</TableHead>
            <TableHead className="text-yellow-500 font-mono">Airline</TableHead>
            <TableHead className="text-yellow-500 font-mono">
              {type === 'departure' ? 'Destination' : 'Origin'}
            </TableHead>
            <TableHead className="text-yellow-500 font-mono">Time</TableHead>
            <TableHead className="text-yellow-500 font-mono">Gate</TableHead>
            <TableHead className="text-yellow-500 font-mono">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flights.map((flight) => (
            <TableRow key={flight.id} className="border-gray-800 hover:bg-gray-900/50">
              <TableCell className="font-mono">
                <FlapDisplay value={flight.flightNumber.padEnd(7, ' ')} size="small" />
              </TableCell>
              <TableCell className="text-gray-300">{flight.airline}</TableCell>
              <TableCell className="text-gray-300">
                <div>
                  <div className="font-semibold">
                    {type === 'departure' ? flight.destination : flight.origin}
                  </div>
                  <div className="text-xs text-gray-500">
                    {type === 'departure' ? flight.destinationCode : flight.originCode}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-mono">
                    <FlapDisplay value={formatTime(flight.scheduledTime)} size="small" />
                  </div>
                  {flight.estimatedTime && (
                    <div className="text-xs text-yellow-500">
                      Est: {formatTime(flight.estimatedTime)}
                    </div>
                  )}
                  {flight.actualTime && (
                    <div className="text-xs text-green-500">
                      Act: {formatTime(flight.actualTime)}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-mono text-gray-300">
                {flight.terminal && `T${flight.terminal}-`}{flight.gate}
              </TableCell>
              <TableCell>{getStatusBadge(flight.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="text-yellow-500 text-2xl font-mono animate-pulse">Loading flights...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <AirportInfo airportCode={airport} currentTime={currentTime} />

        <Tabs defaultValue="departures" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900">
            <TabsTrigger 
              value="departures" 
              className="text-yellow-500 data-[state=active]:bg-gray-800 data-[state=active]:text-yellow-400 font-mono"
            >
              DEPARTURES
            </TabsTrigger>
            <TabsTrigger 
              value="arrivals"
              className="text-yellow-500 data-[state=active]:bg-gray-800 data-[state=active]:text-yellow-400 font-mono"
            >
              ARRIVALS
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="departures" className="mt-6">
            <FlightTable flights={departures} type="departure" />
          </TabsContent>
          
          <TabsContent value="arrivals" className="mt-6">
            <FlightTable flights={arrivals} type="arrival" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}