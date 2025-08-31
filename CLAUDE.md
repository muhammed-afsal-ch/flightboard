# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FlightBoard is a dual-interface flight information display system with:
- **Web Interface**: Next.js 15 app with real-time flight displays and multiple themes
- **CLI Tools**: Three command-line utilities (TUI, web server, flight lookup)
- **Multi-Provider Support**: Aggregates data from 8+ flight APIs with intelligent fallback

## CRITICAL: Validation Checklist

**IMPORTANT**: Run these commands after EVERY code change to ensure nothing breaks:

```bash
# 1. Linting (warnings are OK, errors are not)
npm run lint

# 2. TypeScript Type Checking (must pass)
npm run typecheck

# 3. Unit & Integration Tests (must pass)
npm test

# 4. Build Next.js & CLI (must complete successfully)
npm run build

# 5. Docker Build (must complete successfully)
docker build -t flightboard:test .

# 6. E2E Tests (run if UI changes were made)
npm run test:e2e
```

**Quick validation command** (run all checks):
```bash
npm run lint && npm run typecheck && npm test && npm run build && docker build -t flightboard:test .
```

If any of these fail, fix the issues before committing or proceeding.

## Essential Commands

### Development
```bash
# Run web app in development mode (port 3000)
npm run dev

# Run CLI tools directly
npm run flightboard-tui      # Terminal UI
npm run flightboard-lookup    # Flight/route lookup tool
npm run flightboard-web       # Alias for web dev server

# Build everything (web + CLI)
npm run build
npm run build:cli             # Build CLI tools only
```

### Testing
```bash
# Run all unit/integration tests
npm test

# Run specific test suites
npm run test:unit             # Unit tests only
npm run test:integration      # Integration tests only
npm run test:e2e              # Playwright E2E tests
npm run test:coverage         # With coverage report
npm run test:watch            # Watch mode for TDD

# Run a single test file
npx jest path/to/test.spec.ts
npx playwright test tests/e2e/flightboard.spec.ts
```

### Code Quality
```bash
npm run lint                  # ESLint check (warnings allowed)
npm run lint:fix              # Auto-fix linting issues
npm run typecheck             # TypeScript type checking
```

### Docker
```bash
npm run docker:build          # Build Docker image
npm run docker:compose        # Run with docker-compose
docker pull ghcr.io/airframesio/flightboard:latest  # From registry
```

## Architecture & Key Components

### Project Structure
- **`src/app/`**: Next.js 15 app router pages and API routes
- **`src/components/`**: React components (UI primitives in `ui/`, features at root)
- **`src/lib/`**: Core business logic and utilities
- **`src/cli/`**: Command-line tools (tui.ts, lookup.ts, web.ts)
- **`src/contexts/`**: React contexts (theme management)
- **`src/types/`**: TypeScript type definitions

### Flight Data Architecture

The system uses a **provider aggregation pattern** with automatic fallback:

1. **`AggregatedFlightProvider`** (`src/lib/flight-providers.ts`): 
   - Orchestrates multiple API providers in priority order
   - Automatically falls back to next provider on failure
   - Configurable via `FLIGHT_PROVIDER_PRIORITY` env var

2. **Individual Providers**:
   - Each implements `FlightProvider` interface
   - Located in `src/lib/flight-providers.ts`
   - Examples: `AirframesProvider`, `FlightAwareProvider`, `AdsbLolProvider`
   - **FlightAware**: Uses AeroAPI v4 with `/airports/{code}/flights/departures` endpoints
   - **FlightRadar24**: Supports commercial API with flexible endpoint structure

3. **Route Enrichment**:
   - `enrichFlightWithRoute()` automatically fetches missing airport details
   - Uses separate route providers (adsb.im, adsb.lol)

### API Endpoints

**`/api/flights`** - Main flight data endpoint
- Query params: `airport`, `type` (departure/arrival), `count`, `mock`
- Attempts real API data first, falls back to mock if unavailable
- Returns enriched flight data with airport details

### Theme System

Located in `src/lib/themes/`:
- Multiple themes (Airport, Modern, Matrix, Forest, etc.)
- Each theme exports a `FlightBoardTheme` object
- Theme persistence via localStorage
- Context provider in `src/contexts/theme-context.tsx`

### CLI Tools Architecture

**TUI (`src/cli/tui.ts`)**:
- Uses `blessed` library for terminal UI
- Real-time updates via setInterval
- Configurable refresh rate and airport

**Lookup Tool (`src/cli/lookup.ts`)**:
- Commander.js based CLI
- Supports flight number and route lookups
- Can query specific providers or all

### Testing Strategy

- **Unit Tests**: `src/**/__tests__/` - Component and utility tests
- **Integration Tests**: `tests/integration/` - API endpoint testing
- **E2E Tests**: `tests/e2e/` - Playwright browser automation
- **Mocks**: API providers are mocked in integration tests
- **Coverage**: Configured in `jest.config.js` with thresholds

### Environment Configuration

Create `.env.local` from `env.example`:
- `FLIGHT_PROVIDER_PRIORITY`: Comma-separated provider order
- Individual API keys for each provider (optional)
- Providers work without keys but may have limitations

### CI/CD Pipeline

GitHub Actions workflows (`.github/workflows/`):
- **ci.yml**: Runs on PRs - lint, typecheck, tests, build
- **docker-publish.yml**: Builds multi-arch Docker images on release
- Tests run on Node 18.x and 20.x
- Playwright E2E tests included in CI

### Important Implementation Details

1. **Mock Data Fallback**: When no API providers return data, the system automatically uses mock data from `src/lib/mock-data.ts`

2. **Airport Coordinates**: Cached in `src/lib/airport-coords.ts` with fallback to Airframes.io API

3. **Status Mapping**: Each provider's status codes are normalized to standard values (scheduled, boarding, departed, etc.)

4. **Error Handling**: Providers fail gracefully - errors are logged but don't crash the app

5. **Real-time Updates**: Web UI polls `/api/flights` every 30 seconds, TUI configurable via `--refresh` flag

6. **TypeScript Strict Mode**: Enabled - use proper types, avoid `any` where possible

7. **ESLint Configuration**: Uses ESLint v9 flat config (`eslint.config.mjs`), warnings don't fail CI

8. **Playwright Configuration**: E2E tests run against dev server, multiple browser targets configured

## Code Quality Standards

### Before Making ANY Changes
1. **Always validate**: Run the validation checklist after every significant change
2. **Never skip tests**: All tests must pass before considering work complete
3. **Build verification**: Both npm and Docker builds must succeed
4. **Lint warnings**: While warnings are acceptable, aim to minimize them
5. **Type safety**: TypeScript compilation must pass without errors

### Common Issues to Avoid
- Breaking the build by not testing TypeScript compilation
- Introducing linting errors (warnings are OK, errors are not)
- Forgetting to test Docker build after dependency changes
- Not running tests after modifying business logic
- Skipping E2E tests after UI changes

### Remember
**Quality over speed**: It's better to take time validating than to break the build.
Always run the full validation checklist before declaring any task complete.