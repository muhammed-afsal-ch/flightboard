# FlightBoard

[![CI](https://github.com/airframes/flightboard/actions/workflows/ci.yml/badge.svg)](https://github.com/airframes/flightboard/actions/workflows/ci.yml)
[![Docker Publish](https://github.com/airframes/flightboard/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/airframes/flightboard/actions/workflows/docker-publish.yml)
[![Docker Image Version](https://img.shields.io/docker/v/airframes/flightboard?sort=semver&label=docker)](https://github.com/airframes/flightboard/pkgs/container/flightboard)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.0.0-blue)
![Next.js](https://img.shields.io/badge/next.js-15.5.2-black)
![License](https://img.shields.io/badge/license-MIT-green)

A dual-interface flight information display system featuring both a modern web UI and a terminal-based TUI, similar to airport departure/arrival boards.

## 🚀 Recent Updates

- **Enhanced CI/CD Pipeline**: Workflows now feature concurrency control and dependency chains for reliable releases
- **Multi-Architecture Docker Support**: Images built for x86-64, Apple Silicon, and all ARM devices (Raspberry Pi, Orange Pi)
- **Production Ready**: All TypeScript compilation errors resolved for successful Docker builds
- **Automatic Route Enrichment**: Flights missing airport details are automatically enriched from adsb.im/adsb.lol
- **Workflow Orchestration**: Docker publishing requires CI tests to pass first, ensuring quality releases
- **Concurrency Control**: Duplicate workflow runs are automatically cancelled to save resources
- **Complete Docker Support**: Multi-stage builds with Next.js standalone output for minimal image size
- **Multi-Provider Route Checking**: Routes command intelligently queries all providers until success
- **SBOM & Provenance**: Docker images include software bill of materials and build attestations
- **Automatic GitHub Releases**: Version tags trigger full CI/CD pipeline and create releases

## Features

- **Web Interface**: Modern Next.js 15 application with photorealistic split-flap display animations
- **Multiple Themes**: 7 unique themes including Airport Classic, Modern, Minimalist, Retro Terminal, High Contrast, Matrix (with animated digital rain), and Super Thin
- **Theme Persistence**: User preferences saved in browser localStorage with light/dark/system mode support
- **Terminal UI**: Blessed-based TUI for command-line flight monitoring
- **Real-time Updates**: Auto-refreshing flight data with dynamic status changes
- **Multiple Data Providers**: Support for 8+ flight data APIs with intelligent fallback
- **Automatic Route Enrichment**: Missing flight details are automatically fetched from route providers
- **Airport Information**: Detailed airport data including location, timezone, and local time
- **Enhanced Display**: ICAO codes shown with city names, "????" for en-route flights, proper sorting by time and status
- **Global CLI Tools**: Three installable command-line utilities for different use cases
- **Production Docker Support**: Multi-stage builds with Next.js standalone output
- **Complete CI/CD Pipeline**: Automated testing, Docker builds, and GHCR publishing
- **Smart Provider Selection**: Configurable priority system with automatic fallback
- **TypeScript Throughout**: Full type safety in both web and CLI applications

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

#### Pull from GitHub Container Registry

```bash
# Pull the latest stable version (auto-selects architecture)
docker pull ghcr.io/airframes/flightboard:latest

# Or pull a specific version
docker pull ghcr.io/airframes/flightboard:v1.0.0

# Run the container
docker run -p 3000:3000 --env-file .env.local ghcr.io/airframes/flightboard:latest
```

**Supported Architectures:**
- `linux/amd64` - Standard x86-64 (Intel/AMD processors)
- `linux/arm64` - 64-bit ARM (Apple Silicon M1/M2/M3, AWS Graviton, newer Raspberry Pi)
- `linux/arm/v7` - 32-bit ARM v7 (Raspberry Pi 2/3/4, Orange Pi, most 32-bit ARM boards)
- `linux/arm/v6` - 32-bit ARM v6 (Raspberry Pi 1/Zero/Zero W, older ARM devices)

Docker will automatically pull the correct image for your architecture.

#### Build Locally

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

## Themes

FlightBoard includes 7 beautifully crafted themes, each with light and dark mode support:

1. **Airport Classic** - Traditional split-flap board aesthetic with mechanical animations
2. **Modern** - Clean, contemporary design with smooth animations
3. **Minimalist** - Focus on content with subtle design elements
4. **Retro Terminal** - Green phosphor CRT terminal style
5. **High Contrast** - Maximum readability with stark contrasts
6. **Matrix** - Cyberpunk theme with animated digital rain background featuring golden airplane symbols
7. **Super Thin** - Ultra-compact terminal style with minimal spacing

### Theme Configuration

Set available themes via environment variable:

```bash
# In .env.local
AVAILABLE_THEMES=airport,modern,minimalist,retro,highcontrast,matrix,superthin

# Or use a subset
AVAILABLE_THEMES=airport,modern,matrix
```

Themes remember user preferences in browser localStorage including:
- Selected theme
- Light/dark/system color mode
- Automatic theme application on page load

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

**Web Interface Features:**
- Theme selector dropdown with live preview
- Light/dark/system mode toggle
- Responsive split-flap displays
- Real-time clock showing local, airport, and UTC time
- Tabbed interface for departures and arrivals
- Flight status badges with appropriate colors
- Automatic sorting by time and status (active flights first)

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
   - Sign up: [Get your API key here](https://apilayer.com?fpr=kevin31&fp_sid=flightbo) *
   - Free tier: 100 requests/month
   - `AVIATIONSTACK_API_KEY=your_key`
   - \* *Affiliate link - helps support FlightBoard development*

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
- **Concurrency Control**: Cancels outdated workflow runs automatically
- **Workflow Dependencies**: Docker publish requires CI tests to pass first
- **Multi-Architecture Builds**: Creates images for x86-64, ARM64, ARMv7, and ARMv6
- **Automatic Docker Publishing**: Tags trigger multi-platform image builds
- **GitHub Container Registry**: Images published to ghcr.io/airframes/flightboard
- **Release Automation**: Version tags create GitHub releases with changelogs
- **Build Attestations**: Generates SBOM and provenance for supply chain security

### GitHub Actions Workflows

The project includes two main workflows:

1. **CI Pipeline** (`ci.yml`)
   - Runs on all pull requests
   - Pushes to `main` and `develop` branches
   - Tests on Node.js 18.x and 20.x
   - Validates Docker builds
   - Concurrency control cancels outdated runs
   - Can be called by other workflows

2. **Docker Publish** (`docker-publish.yml`)
   - Triggers on version tags (e.g., `v1.0.0`)
   - **Requires CI workflow to pass first**
   - Concurrency control prevents duplicate runs
   - Builds multi-architecture images:
     - `linux/amd64` (x86-64)
     - `linux/arm64` (Apple Silicon, AWS Graviton)
     - `linux/arm/v7` (Raspberry Pi 2/3/4, Orange Pi)
     - `linux/arm/v6` (Raspberry Pi Zero/1)
   - Publishes to GitHub Container Registry with automatic architecture detection
   - Creates GitHub releases automatically
   - Generates SBOM and provenance attestations

### Creating a Release

To create a new release:

```bash
# Tag the version
git tag v1.0.0
git push origin v1.0.0
```

This will automatically:
1. Run the full CI test suite
2. Build multi-architecture Docker images (only if CI passes)
3. Publish images to GitHub Container Registry
4. Create a GitHub release with changelog
5. Tag images with semantic version numbers and `latest`

**Note**: The Docker publish workflow will only proceed if all CI tests pass successfully.

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
- **Tailwind CSS**: Utility-first styling with CSS variables for theming
- **shadcn/ui**: High-quality UI components
- **React Context API**: Theme state management
- **Canvas API**: Matrix rain animation
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

## Troubleshooting

### Docker Build Issues
If you encounter TypeScript compilation errors during Docker builds:
1. Ensure all TypeScript types are properly defined
2. Check that `next.config.ts` only contains valid Next.js configuration options
3. Verify that all imported modules exist and are properly typed

### Provider Connection Issues
- Check API keys are correctly set in `.env.local`
- Verify network connectivity to provider endpoints
- Review provider-specific rate limits
- Use `flightboard-lookup` to test individual providers

### Port Conflicts
If the default port 3000 is in use:
- Change the port in Docker: `docker run -p 3001:3000 ...`
- For development: `PORT=3001 npm run dev`

## Support the Project

FlightBoard is open source and free to use. If you find it useful, consider:
- Using our affiliate links when signing up for API services (marked with \*)
- Contributing code or documentation
- Reporting bugs and suggesting features
- Sharing the project with others

Affiliate commissions help us maintain and improve FlightBoard. Thank you for your support!

## Acknowledgments

- Airport data provided by [Airframes.io](https://airframes.io)
- Community ADS-B data from adsb.im and adsb.lol
- Flight data from various commercial and open-source providers
- UI inspiration from classic airport split-flap displays