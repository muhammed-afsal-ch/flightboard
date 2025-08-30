#!/usr/bin/env node

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables from .env.local BEFORE importing providers
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('Loaded .env.local');
} else {
  console.log('No .env.local file found');
}

// Now import other modules after env vars are loaded
import { Command } from 'commander';
import fetch from 'node-fetch';
import chalk from 'chalk';
import { 
  AirframesProvider, 
  FlightAwareProvider, 
  FlightRadar24Provider,
  AirNavProvider,
  AdsbImProvider,
  AdsbLolProvider,
  AggregatedFlightProvider,
  getConfiguredProviders
} from '../lib/flight-providers';
import { 
  AviationStackProvider,
  OpenSkyProvider
} from '../lib/aviation-api';
import { fetchAirportCoordinates } from '../lib/airport-coords';

const program = new Command();

// Helper to print JSON beautifully
function printJson(data: any, title?: string) {
  if (title) {
    console.log(chalk.cyan.bold(`\n${title}:`));
  }
  console.log(JSON.stringify(data, null, 2));
}

// Helper to print success/error
function printResult(success: boolean, message: string) {
  if (success) {
    console.log(chalk.green('✓'), message);
  } else {
    console.log(chalk.red('✗'), message);
  }
}

program
  .name('flightboard-lookup')
  .description('FlightBoard - Flight data lookup utility')
  .version('1.0.0');

// Test flights for an airport
program
  .command('flights')
  .description('Fetch flights for an airport using specified provider')
  .requiredOption('--airport <code>', 'Airport ICAO code (e.g., KSMF)')
  .option('--provider <name>', 'Provider name (airframes, flightaware, aviationstack, etc.)', 'all')
  .option('--type <type>', 'Flight type (departure/arrival)', 'departure')
  .action(async (options) => {
    console.log(chalk.yellow.bold(`Testing flight data for ${options.airport}...`));
    
    const providers: Record<string, any> = {
      airframes: process.env.AIRFRAMES_API_KEY ? new AirframesProvider(process.env.AIRFRAMES_API_KEY) : null,
      flightaware: process.env.FLIGHTAWARE_API_KEY ? new FlightAwareProvider(process.env.FLIGHTAWARE_API_KEY) : null,
      flightradar24: process.env.FLIGHTRADAR24_API_KEY ? new FlightRadar24Provider(process.env.FLIGHTRADAR24_API_KEY) : null,
      airnav: process.env.AIRNAV_API_KEY ? new AirNavProvider(process.env.AIRNAV_API_KEY) : null,
      adsbim: new AdsbImProvider(),
      adsblol: new AdsbLolProvider(),
      aviationstack: process.env.AVIATIONSTACK_API_KEY ? new AviationStackProvider() : null,
      opensky: new OpenSkyProvider()
    };

    const testProvider = async (name: string, provider: any) => {
      if (!provider) {
        console.log(chalk.yellow(`⚠ ${name}: No API key configured`));
        return;
      }

      console.log(chalk.cyan(`\nTesting ${name}...`));
      try {
        const startTime = Date.now();
        const flights = await provider.fetchFlights(options.airport, options.type);
        const elapsed = Date.now() - startTime;
        
        printResult(flights && flights.length > 0, 
          `${name}: Found ${flights?.length || 0} flights (${elapsed}ms)`);
        
        if (flights && flights.length > 0) {
          console.log(chalk.gray(`  Sample flight: ${flights[0].flightNumber} - ${flights[0].airline}`));
          console.log(chalk.gray(`  ${flights[0].origin} → ${flights[0].destination}`));
        }
      } catch (error: any) {
        printResult(false, `${name}: ${error.message}`);
      }
    };

    if (options.provider === 'all') {
      for (const [name, provider] of Object.entries(providers)) {
        await testProvider(name, provider);
      }
    } else {
      const provider = providers[options.provider];
      if (!provider) {
        console.error(chalk.red(`Unknown provider: ${options.provider}`));
        console.log(chalk.gray(`Available: ${Object.keys(providers).join(', ')}`));
        process.exit(1);
      }
      await testProvider(options.provider, provider);
    }
  });

// Test airport info
program
  .command('airport')
  .description('Fetch airport information')
  .requiredOption('--code <code>', 'Airport ICAO code (e.g., KLAX)')
  .action(async (options) => {
    console.log(chalk.yellow.bold(`Fetching airport info for ${options.code}...`));
    
    // Try Airframes.io API
    console.log(chalk.cyan('\nTrying Airframes.io API...'));
    try {
      const response = await fetch(`https://api.airframes.io/airports/icao/${options.code}`);
      printResult(response.ok, `Response status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        printJson(data, 'Airport Data');
      }
    } catch (error) {
      console.error(chalk.red('Error:'), error);
    }

    // Also fetch coordinates
    console.log(chalk.cyan('\nFetching coordinates...'));
    const coords = await fetchAirportCoordinates(options.code);
    if (coords) {
      printResult(true, `Coordinates: ${coords.latitude}, ${coords.longitude}`);
    } else {
      printResult(false, 'No coordinates found');
    }
  });

// List configured providers
program
  .command('list')
  .description('List all configured providers')
  .action(() => {
    console.log(chalk.yellow.bold('Configured Providers:'));
    
    const checkProvider = (name: string, apiKey?: string) => {
      if (apiKey) {
        console.log(chalk.green('✓'), chalk.white(name), chalk.gray(`(Key: ${apiKey.substring(0, 8)}...)`));
      } else {
        console.log(chalk.gray('○'), chalk.gray(name), chalk.gray('(Not configured)'));
      }
    };

    checkProvider('Airframes.io', process.env.AIRFRAMES_API_KEY);
    checkProvider('FlightAware', process.env.FLIGHTAWARE_API_KEY);
    checkProvider('AviationStack', process.env.AVIATIONSTACK_API_KEY);
    checkProvider('FlightRadar24', process.env.FLIGHTRADAR24_API_KEY);
    checkProvider('AirNav RadarBox', process.env.AIRNAV_API_KEY);
    checkProvider('Aviation Edge', process.env.AVIATION_EDGE_API_KEY);
    console.log(chalk.green('✓'), chalk.white('adsb.im'), chalk.gray('(No key required)'));
    console.log(chalk.green('✓'), chalk.white('adsb.lol'), chalk.gray('(No key required)'));
    console.log(chalk.green('✓'), chalk.white('OpenSky Network'), chalk.gray('(No key required)'));
    
    console.log(chalk.cyan('\nPriority order:'), process.env.FLIGHT_PROVIDER_PRIORITY || 'default');
  });

// Flight routes lookup via adsb.im or adsb.lol
program
  .command('routes')
  .description('Fetch flight route information from adsb.im or adsb.lol')
  .requiredOption('--flight <callsign>', 'Flight callsign (e.g., UAL123, AAL456)')
  .option('--lat <latitude>', 'Current latitude (default: 0)', '0')
  .option('--lng <longitude>', 'Current longitude (default: 0)', '0')
  .option('--provider <provider>', 'Provider to use (adsbim, adsblol, or all)', 'all')
  .option('-v, --verbose', 'Show full response data')
  .action(async (options) => {
    const providerOption = options.provider.toLowerCase();
    
    // Define route providers
    const routeProviders = ['adsbim', 'adsblol'];
    const providersToCheck = providerOption === 'all' ? routeProviders : [providerOption];
    
    if (!['all', ...routeProviders].includes(providerOption)) {
      console.error(chalk.red(`Invalid provider: ${providerOption}`));
      console.log(chalk.gray(`Available: ${routeProviders.join(', ')}, all`));
      process.exit(1);
    }
    
    console.log(chalk.yellow.bold(`Fetching route for flight ${options.flight}...`));
    
    // Try each provider
    for (const provider of providersToCheck) {
      console.log(chalk.cyan(`\nTrying ${provider}...`));
      
      let url: string;
      let requestBody: any;
      
      if (provider === 'adsblol') {
        url = 'https://api.adsb.lol/api/0/routeset';
        // adsb.lol expects a PlaneList object with an array of plane instances
        requestBody = {
          planes: [{
            callsign: options.flight.toUpperCase(),
            lat: parseFloat(options.lat),
            lng: parseFloat(options.lng)
          }]
        };
      } else {
        url = 'https://adsb.im/api/0/routeset';
        requestBody = {
          callsign: options.flight.toUpperCase(),
          lat: parseFloat(options.lat),
          lng: parseFloat(options.lng)
        };
      }
      
      // Show full request details if verbose
      if (options.verbose) {
        console.log(chalk.cyan('Full Request:'));
        console.log(chalk.white('  URL:'), url);
        console.log(chalk.white('  Method:'), 'POST');
        console.log(chalk.white('  Headers:'));
        console.log(chalk.gray('    Content-Type: application/json'));
        console.log(chalk.gray('    Accept: application/json'));
        console.log(chalk.gray('    User-Agent: FlightBoard/1.0'));
        console.log(chalk.white('  Body:'));
        console.log(chalk.gray(JSON.stringify(requestBody, null, 2).split('\n').map(line => '    ' + line).join('\n')));
      }
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'FlightBoard/1.0'
          },
          body: JSON.stringify(requestBody)
        });

        printResult(response.ok, `${provider}: Response status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          let foundData = false;
          
          // Handle adsb.lol response (returns array with different format)
          if (provider === 'adsblol' && Array.isArray(data)) {
            if (data.length > 0) {
              foundData = true;
              const routeData = data[0]; // Get first result
              if (routeData && typeof routeData === 'object') {
                // Display flight information
                console.log(chalk.cyan('\nFlight Information:'));
                console.log(chalk.white('  Callsign:'), routeData.callsign || options.flight);
                console.log(chalk.white('  Airline Code:'), routeData.airline_code || 'Unknown');
                console.log(chalk.white('  Flight Number:'), routeData.number || 'Unknown');
                
                // Display route information
                if (routeData.airport_codes || routeData._airport_codes_iata) {
                  console.log(chalk.cyan('\nRoute Information:'));
                  console.log(chalk.white('  Route (ICAO):'), routeData.airport_codes || 'Unknown');
                  console.log(chalk.white('  Route (IATA):'), routeData._airport_codes_iata || 'Unknown');
                }
                
                // Display airport details
                if (routeData._airports && Array.isArray(routeData._airports) && routeData._airports.length >= 2) {
                  const origin = routeData._airports[0];
                  const destination = routeData._airports[1];
                  
                  console.log(chalk.cyan('\nOrigin Airport:'));
                  console.log(chalk.white('  Name:'), origin.name || 'Unknown');
                  console.log(chalk.white('  Location:'), origin.location || 'Unknown');
                  console.log(chalk.white('  ICAO/IATA:'), `${origin.icao}/${origin.iata}` || 'Unknown');
                  console.log(chalk.white('  Coordinates:'), `${origin.lat}, ${origin.lon}` || 'Unknown');
                  
                  console.log(chalk.cyan('\nDestination Airport:'));
                  console.log(chalk.white('  Name:'), destination.name || 'Unknown');
                  console.log(chalk.white('  Location:'), destination.location || 'Unknown');
                  console.log(chalk.white('  ICAO/IATA:'), `${destination.icao}/${destination.iata}` || 'Unknown');
                  console.log(chalk.white('  Coordinates:'), `${destination.lat}, ${destination.lon}` || 'Unknown');
                }
                
                // Show full response if verbose
                if (options.verbose && providerOption !== 'all') {
                  printJson(data, 'Full Response');
                }
              }
            } else {
              console.log(chalk.yellow(`${provider}: No route information found`));
            }
          }
          // Handle adsb.im response (returns object)
          else if (provider === 'adsbim' && data && typeof data === 'object') {
            // Check if we have any route data
            if (data.route || data.aircraft || data.flight) {
              foundData = true;
              
              // Check if we got route data
              if (data.route) {
                console.log(chalk.cyan('\nRoute Information:'));
                console.log(chalk.white('  Origin:'), data.route.origin || 'Unknown');
                console.log(chalk.white('  Destination:'), data.route.destination || 'Unknown');
                
                if (data.route.waypoints && Array.isArray(data.route.waypoints)) {
                  console.log(chalk.white('  Waypoints:'), data.route.waypoints.length);
                }
              }
              
              // Check if we got aircraft info
              if (data.aircraft) {
                console.log(chalk.cyan('\nAircraft Information:'));
                console.log(chalk.white('  Type:'), data.aircraft.type || 'Unknown');
                console.log(chalk.white('  Registration:'), data.aircraft.registration || 'Unknown');
              }
              
              // Check if we got flight info
              if (data.flight) {
                console.log(chalk.cyan('\nFlight Information:'));
                console.log(chalk.white('  Airline:'), data.flight.airline || 'Unknown');
                console.log(chalk.white('  Flight Number:'), data.flight.number || options.flight);
                console.log(chalk.white('  Status:'), data.flight.status || 'Unknown');
              }
              
              // Show full response if verbose
              if (options.verbose && providerOption !== 'all') {
                printJson(data, 'Full Response');
              }
            } else if (Array.isArray(data) && data.length === 0) {
              console.log(chalk.yellow(`${provider}: No route information found`));
            } else {
              console.log(chalk.yellow(`${provider}: No route information found`));
              if (options.verbose) {
                printJson(data, 'Response Data');
              }
            }
          }
          
          // If we found data and checking all providers, we can stop here unless verbose
          if (foundData && providerOption === 'all' && !options.verbose) {
            console.log(chalk.green(`\n✓ Found route information from ${provider}`));
            break;
          }
        } else {
          const text = await response.text();
          if (options.verbose) {
            console.log(chalk.red(`${provider} error response:`), text);
          } else {
            console.log(chalk.red(`${provider}: Failed to fetch route information`));
          }
        }
      } catch (error: any) {
        console.error(chalk.red(`${provider} error:`), error.message);
      }
    }
  });

// Raw API test
program
  .command('raw')
  .description('Make a raw API request')
  .requiredOption('--url <url>', 'API URL')
  .option('--method <method>', 'HTTP method', 'GET')
  .option('--body <json>', 'Request body (JSON string)')
  .option('--header <header>', 'Add header (format: "Key: Value")', (value, previous: string[]) => {
    return previous ? [...previous, value] : [value];
  }, [])
  .action(async (options) => {
    console.log(chalk.yellow.bold('Making raw API request...'));
    console.log(chalk.gray(`URL: ${options.url}`));
    console.log(chalk.gray(`Method: ${options.method}`));
    
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': 'FlightBoard/1.0'
    };
    
    // Parse custom headers
    if (options.header && options.header.length > 0) {
      options.header.forEach((h: string) => {
        const [key, ...valueParts] = h.split(':');
        if (key && valueParts.length > 0) {
          headers[key.trim()] = valueParts.join(':').trim();
        }
      });
    }
    
    console.log(chalk.gray('Headers:'), headers);
    
    try {
      const fetchOptions: any = {
        method: options.method,
        headers
      };
      
      if (options.body) {
        fetchOptions.body = options.body;
        headers['Content-Type'] = 'application/json';
      }
      
      const response = await fetch(options.url, fetchOptions);
      printResult(response.ok, `Response: ${response.status} ${response.statusText}`);
      
      console.log(chalk.gray('Response Headers:'));
      response.headers.forEach((value, key) => {
        console.log(chalk.gray(`  ${key}: ${value}`));
      });
      
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('json')) {
        const data = await response.json();
        printJson(data, 'Response Body');
      } else {
        const text = await response.text();
        console.log(chalk.cyan('\nResponse Body:'));
        console.log(text.substring(0, 1000));
        if (text.length > 1000) {
          console.log(chalk.gray(`... (${text.length - 1000} more characters)`));
        }
      }
    } catch (error) {
      console.error(chalk.red('Error:'), error);
    }
  });

program.parse(process.argv);