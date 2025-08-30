# FlightBoard

![CI](https://github.com/airframes/flightboard/workflows/CI/badge.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.0.0-blue)
![Next.js](https://img.shields.io/badge/next.js-15.5.2-black)
![License](https://img.shields.io/badge/license-MIT-green)

A dual-interface flight information display system featuring both a modern web UI and a terminal-based TUI, similar to airport departure/arrival boards.

## 🚀 Recent Updates

- **Automatic Route Enrichment**: Flights missing airport details are automatically enriched with route data
- **Docker Support**: Complete containerization with Dockerfile and docker-compose
- **CI/CD Pipeline**: GitHub Actions workflow for linting, testing, and Docker builds
- **Multi-Provider Routes**: Routes command now checks all providers by default, stops on first success
- **adsb.lol Routes Support**: Routes command now supports both adsb.im and adsb.lol providers
- **adsb.lol Provider**: Added new free provider for real-time ADS-B data with geographic search
- **Verbose Request Logging**: Routes command now shows full request details with `-v` flag
- **Flight Route Lookup**: New `routes` command in `flightboard-lookup` for querying adsb.im
- **Global CLI Tools**: All commands now installable globally via `npm link`
- **TypeScript CLI**: Commands run directly from TypeScript source with tsx

## Features

- **Web Interface**: Modern Next.js application with photorealistic split-flap display animations
- **Terminal UI**: Blessed-based TUI for command-line flight monitoring
- **Real-time Updates**: Auto-refreshing flight data with status changes
- **Multiple Data Providers**: Support for 8+ flight data APIs
- **Automatic Route Enrichment**: Missing flight details are automatically fetched from route providers
- **Airport Information**: Detailed airport data including location and timezone
- **Global CLI Tools**: Installable command-line utilities for flight lookups
- **Docker Support**: Complete containerization for easy deployment
- **CI/CD Pipeline**: Automated testing and validation with GitHub Actions
- **Multi-Provider Routes**: Intelligent route lookup across multiple data sources

## Requirements

- Node.js 18.0.0 or higher
- npm or yarn package manager
- Docker and Docker Compose (optional, for containerized deployment)

## Installation

### From Source

```bash
# Clone the repository
git clone https://github.com/airframes/flightboard.git
cd flightboard

# Install dependencies
npm install

# Install CLI tools globally (optional)
npm link
```

### Using Docker

```bash
# Using Docker Compose (recommended)
docker-compose up

# Or build and run manually
docker build -t flightboard:latest .
docker run -p 3000:3000 --env-file .env.local flightboard:latest
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

# Fetch flight route information via adsb.im or adsb.lol
flightboard-lookup routes --flight UAL123                                      # Check all providers (default)
flightboard-lookup routes --flight AAL456 --provider adsbim                   # Use only adsb.im
flightboard-lookup routes --flight DAL789 --provider adsblol                  # Use only adsb.lol
flightboard-lookup routes --flight SWA1234 --lat 37.7749 --lng -122.4194      # With position data
flightboard-lookup routes --flight NKS246 --verbose                           # Show full details from all providers

# Routes command options:
#   --flight <callsign>  Flight callsign (required)
#   --lat <latitude>     Current latitude (optional, default: 0)
#   --lng <longitude>    Current longitude (optional, default: 0)
#   --provider <provider> Provider to use: adsbim, adsblol, or all (default: all)
#   --verbose, -v        Show full response data including request details

# Make raw API request
flightboard-lookup raw --url "https://api.example.com/endpoint" --method GET

# Help
flightboard-lookup --help
```

**Available Commands:**
- `flights`: Test flight data providers for an airport
- `airport`: Get detailed airport information
- `list`: Show all configured providers and their status
- `routes`: Query adsb.im or adsb.lol for flight route information (requires active flight callsign)
- `raw`: Make custom API requests for testing

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
   - Flight schedule and route lookup by callsign and position
   - No API key required
   - Endpoint: `POST /api/0/routeset`
   - Parameters: `callsign` (required), `lat`, `lng` (optional, defaults to 0)
   - Returns route information for active flights
   - Use `flightboard-lookup routes` command for testing

7. **adsb.lol** (Free)
   - Real-time ADS-B data with geographic search
   - No API key required
   - Endpoints:
     - `/v2/lat/{lat}/lon/{lon}/dist/{radius}` - Search aircraft by location
     - `/api/0/routeset` - Look up flight routes (similar to adsb.im)
     - `/api/0/airport/{icao}` - Airport information
   - Max radius: 250 nautical miles for geographic search
   - Use `flightboard-lookup routes --provider adsblol` for route testing

8. **OpenSky Network** (Free)
   - No configuration needed
   - Rate limits apply

### Provider Priority Configuration

Set the order in which providers are tried:

```bash
# In .env.local
FLIGHT_PROVIDER_PRIORITY=airframes,flightaware,aviationstack,flightradar24,airnav,adsbim,adsblol,opensky

# Default if not specified:
# airframes,flightaware,aviationstack,flightradar24,airnav,adsbim,adsblol,opensky
```

The app will automatically try providers in the specified order until it finds available data. If all providers fail, it falls back to simulated mock data.

### Provider Notes

- **Disabled Providers**: If a provider doesn't appear in `FLIGHT_PROVIDER_PRIORITY`, it's disabled
- **API Keys**: Only required for commercial providers
- **Free Providers**: adsb.im, adsb.lol, and OpenSky work without configuration
- **Mock Data**: Automatically used when no providers return data

## Airport Information

Both web and TUI interfaces display detailed airport information:
- Airport name and ICAO/IATA codes
- City and country
- Current local time and UTC time
- Timezone information

Data sourced from Airframes.io airport API when available.

## Docker Support

FlightBoard includes complete Docker support for easy deployment and development.

### Quick Start with Docker

```bash
# Build the Docker image
npm run docker:build

# Run the container
npm run docker:run

# Or use docker-compose
npm run docker:compose
```

### Docker Compose

The included `docker-compose.yml` file makes it easy to run FlightBoard with all environment variables:

```bash
# Start with docker-compose (uses .env file)
docker-compose up

# Build and start
docker-compose up --build

# Run in background
docker-compose up -d
```

### Manual Docker Commands

```bash
# Build the image
docker build -t flightboard:latest .

# Run with environment file
docker run -p 3000:3000 --env-file .env.local flightboard:latest

# Run with individual environment variables
docker run -p 3000:3000 \
  -e AIRFRAMES_API_KEY=your_key \
  -e AVIATIONSTACK_API_KEY=your_key \
  flightboard:latest
```

## Building for Production

```bash
# Build everything
npm run build

# Build only CLI tools
npm run build:cli

# Start production server
npm start
```

## CI/CD Pipeline

FlightBoard includes a comprehensive GitHub Actions workflow for continuous integration:

### Workflow Features

- **Multi-version Testing**: Tests against Node.js 18.x and 20.x
- **Code Quality**: Runs ESLint and TypeScript type checking
- **Automated Testing**: Executes test suite on every PR and push
- **Docker Validation**: Builds Docker image to ensure containerization works
- **Pull Request Checks**: Automatically runs on all pull requests

### GitHub Actions Workflow

The CI pipeline runs automatically on:
- All pull requests
- Pushes to `main` and `develop` branches

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
├── .github/           # GitHub Actions workflows
│   └── workflows/
│       └── ci.yml     # CI/CD pipeline
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

# Test route lookups
npm run flightboard-lookup -- routes --flight UAL123

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