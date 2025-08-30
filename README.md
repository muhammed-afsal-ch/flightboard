# FlightBoard

A dual-interface flight information display system featuring both a modern web UI and a terminal-based TUI, similar to airport departure/arrival boards.

## Features

- **Web Interface**: Modern Next.js application with photorealistic split-flap display animations
- **Terminal UI**: Blessed-based TUI for command-line flight monitoring
- **Real-time Updates**: Auto-refreshing flight data with status changes
- **Multiple Data Sources**: Support for real flight APIs or mock data
- **Airport Support**: Works with any US airport code (ICAO format)

## Installation

```bash
npm install
```

## Usage

### Web Interface

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Terminal UI

Run the TUI application:

```bash
npm run tui
```

Or with a specific airport:

```bash
npm run tui -- --airport=KLAX
```

**TUI Controls:**
- `Tab` or `D`/`A`: Switch between Departures and Arrivals
- `R`: Refresh flight data
- `Q` or `Esc`: Quit
- Arrow keys: Navigate through flights

## API Configuration

The app works out of the box with mock data. To use real flight data, configure one or more of these providers:

### Supported Providers (in priority order)

1. **Airframes.io** (PRIORITY - Our service!)
   - Contact: api@airframes.io for access
   - `AIRFRAMES_API_KEY=your_key`

2. **FlightAware AeroAPI**
   - Sign up: [flightaware.com/commercial/aeroapi](https://flightaware.com/commercial/aeroapi/)
   - `FLIGHTAWARE_API_KEY=your_key`

3. **AviationStack**
   - Sign up: [aviationstack.com](https://aviationstack.com/signup/free)
   - Free tier: 100 requests/month
   - `AVIATIONSTACK_API_KEY=your_key`

4. **FlightRadar24**
   - Commercial service: [flightradar24.com](https://www.flightradar24.com/commercial-services/data-feeds)
   - `FLIGHTRADAR24_API_KEY=your_key`

5. **AirNav RadarBox**
   - Sign up: [radarbox.com/api](https://www.radarbox.com/api)
   - `AIRNAV_API_KEY=your_key`

6. **airplanes.live** (Free)
   - Community-driven ADS-B data
   - No API key required
   - Note: Globe API protected by Cloudflare (works in browser only)
   - Schedules API works for specific ICAO hex codes

7. **OpenSky Network** (Free)
   - No configuration needed
   - Rate limits apply

### Configuring Provider Priority

Set the order in which providers are tried:

```bash
# In .env.local
FLIGHT_PROVIDER_PRIORITY=airframes,flightaware,aviationstack,airplaneslive

# Copy the example file to get started
cp .env.local.example .env.local
```

The app will automatically try providers in the specified order until it finds available data. If all providers fail, it falls back to simulated mock data.

## Provider Testing CLI

Test and debug flight data providers:

```bash
# Test airplanes.live schedules
npm run provider -- schedules --icao=A8C7DF,A51B58

# Test all providers for an airport
npm run provider -- flights --airport=KLAX --provider=all

# Get airport information
npm run provider -- airport --code=KSFO

# List configured providers
npm run provider -- list

# Help
npm run provider -- --help
```

## Building for Production

```bash
npm run build
npm start
```

## Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: High-quality UI components
- **Blessed**: Terminal UI library
- **React**: UI library for web interface

## Mock Data

When using mock data, the system generates realistic flight information including:
- Major US airports
- Real airline codes and names
- Dynamic status updates (boarding, departed, delayed, etc.)
- Gate and terminal assignments
- Estimated and actual times

## License

MIT
