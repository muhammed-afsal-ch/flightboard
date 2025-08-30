# FlightBoard

A dual-interface flight information display system featuring both a modern web UI and a terminal-based TUI, similar to airport departure/arrival boards.

## Features

- **Web Interface**: Modern Next.js application with photorealistic split-flap display animations
- **Terminal UI**: Blessed-based TUI for command-line flight monitoring
- **Real-time Updates**: Auto-refreshing flight data with status changes
- **Multiple Data Providers**: Support for 7+ flight data APIs
- **Airport Information**: Detailed airport data including location and timezone
- **Global CLI Tools**: Installable command-line utilities for flight lookups

## Installation

### From Source

```bash
npm install
npm link  # Optional: Install CLI tools globally
```

### Global Installation (when published)

```bash
npm install -g flightboard
```

## Usage

### Command Line Tools

After installation, three global commands are available:

#### `flightboard-web` - Web Interface

Start the web server:

```bash
flightboard-web
# or during development
npm run flightboard-web
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### `flightboard-tui` - Terminal UI

Run the TUI application:

```bash
flightboard-tui
# or during development
npm run flightboard-tui
```

With a specific airport:

```bash
flightboard-tui --airport=KLAX
```

**TUI Controls:**
- `Tab` or `D`/`A`: Switch between Departures and Arrivals
- `R`: Refresh flight data
- `Q` or `Esc`: Quit
- Arrow keys: Navigate through flights

#### `flightboard-lookup` - Flight Data Lookup Tool

Query flight data from various providers:

```bash
# List configured providers
flightboard-lookup list

# Test all providers for an airport
flightboard-lookup flights --airport=KSMF --provider=all

# Test specific provider
flightboard-lookup flights --airport=KLAX --provider=aviationstack

# Get airport information
flightboard-lookup airport --code=KSFO

# Make raw API request
flightboard-lookup raw --url "https://api.example.com/endpoint" --method GET

# Help
flightboard-lookup --help
```

## API Configuration

Create a `.env.local` file to configure flight data providers:

```bash
cp env.example .env.local
```

### Supported Providers

1. **Airframes.io** (PRIORITY - Our service!)
   - Contact: api@airframes.io for access
   - `AIRFRAMES_API_KEY=your_key`
   - Note: Airport-specific endpoints coming soon

2. **FlightAware AeroAPI**
   - Sign up: [flightaware.com/commercial/aeroapi](https://flightaware.com/commercial/aeroapi/)
   - `FLIGHTAWARE_API_KEY=your_key`
   - Requires paid subscription

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

6. **adsb.im** (Free)
   - Flight schedule lookup by callsign and position
   - No API key required
   - Uses POST to `/api/0/routeset` with callsign, lat, lng

7. **OpenSky Network** (Free)
   - No configuration needed
   - Rate limits apply

### Provider Priority Configuration

Set the order in which providers are tried:

```bash
# In .env.local
FLIGHT_PROVIDER_PRIORITY=airframes,flightaware,aviationstack,flightradar24,airnav,adsbim,opensky

# Default if not specified:
# airframes,flightaware,aviationstack,flightradar24,airnav,adsbim,opensky
```

The app will automatically try providers in the specified order until it finds available data. If all providers fail, it falls back to simulated mock data.

### Provider Notes

- **Disabled Providers**: If a provider doesn't appear in `FLIGHT_PROVIDER_PRIORITY`, it's disabled
- **API Keys**: Only required for commercial providers
- **Free Providers**: adsb.im and OpenSky work without configuration
- **Mock Data**: Automatically used when no providers return data

## Airport Information

Both web and TUI interfaces display detailed airport information:
- Airport name and ICAO/IATA codes
- City and country
- Current local time and UTC time
- Timezone information

Data sourced from Airframes.io airport API when available.

## Building for Production

```bash
# Build everything
npm run build

# Build only CLI tools
npm run build:cli

# Start production server
npm start
```

## Project Structure

```
flightboard/
├── src/
│   ├── app/           # Next.js app router pages
│   ├── cli/           # CLI tools (TUI, lookup, web)
│   ├── components/    # React components
│   ├── lib/           # Shared libraries and providers
│   └── types/         # TypeScript type definitions
├── bin/               # CLI wrapper scripts
├── dist/              # Compiled CLI tools
└── public/            # Static assets
```

## Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: High-quality UI components
- **Blessed**: Terminal UI library
- **Commander**: CLI argument parsing
- **Chalk**: Terminal string styling
- **Node-fetch**: HTTP client for Node.js

## Mock Data

When using mock data, the system generates realistic flight information including:
- Major US airports
- Real airline codes and names
- Dynamic status updates (boarding, departed, delayed, etc.)
- Gate and terminal assignments
- Estimated and actual times
- Aircraft types

## Development

```bash
# Install dependencies
npm install

# Run web dev server
npm run dev

# Run TUI
npm run flightboard-tui

# Test flight lookups
npm run flightboard-lookup -- list

# Link for global development
npm link
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Acknowledgments

- Airport data provided by [Airframes.io](https://airframes.io)
- Community ADS-B data from various open sources
- UI inspiration from classic airport split-flap displays