# PewPew

A modern Progressive Web App built with SolidJS, RxJS, Ramda, and Deno.

## Tech Stack

- **Runtime**: Deno
- **UI Framework**: SolidJS
- **Reactive Programming**: RxJS
- **Functional Utilities**: Ramda
- **Styling**: Tailwind CSS
- **Storage**: LocalStorage
- **PWA**: Service Worker with Workbox, Background Sync
- **Deployment**: Cloudflare Pages

## Prerequisites

### Option 1: Nix (Recommended)
- [Nix](https://nixos.org/) with flakes enabled
- Optionally [direnv](https://direnv.net/) for automatic environment loading

### Option 2: Manual Installation
- [Deno](https://deno.land/) (v1.40+)
- [Node.js](https://nodejs.org/) v20+ (for npm packages like Tailwind, ESLint)

## Getting Started

### Using Nix

Enter the development shell:
```bash
nix develop
```

Or enable automatic activation with direnv:
```bash
direnv allow
```

Then install npm dependencies:
```bash
npm install
```

### Manual Setup

If not using Nix, install dependencies directly:
```bash
npm install
```

### Development

Start the development server with hot reload:

```bash
deno task dev
```

The app will be available at `http://localhost:8000`.

### Build for Production

```bash
deno task build
```

This will:
1. Build optimized CSS with Tailwind
2. Bundle JavaScript with esbuild
3. Output to `public/dist/`

### Preview Production Build

```bash
deno task preview
```

View the production build at `http://localhost:8080`.

### Code Quality

```bash
# Lint with Deno
deno task lint

# Format with Deno
deno task fmt

# Check formatting
deno task fmt:check

# ESLint (requires npm install)
npm run lint
npm run lint:fix

# Prettier (requires npm install)
npm run format
npm run format:check
```

## Project Structure

```
pewpew/
├── public/              # Static assets and build output
│   ├── dist/           # Built JavaScript (generated)
│   ├── icons/          # PWA icons
│   ├── styles/         # Built CSS (generated)
│   ├── index.html      # HTML entry point
│   ├── manifest.json   # PWA manifest
│   └── sw.js           # Service worker
├── src/
│   ├── components/     # SolidJS components
│   ├── services/       # Business logic and API calls
│   ├── utils/          # Utility functions
│   ├── styles/         # Source CSS (Tailwind)
│   ├── App.tsx         # Root component
│   └── main.tsx        # Application entry point
├── scripts/            # Build scripts
├── deno.json           # Deno configuration and import maps
├── tailwind.config.js  # Tailwind CSS configuration
└── build.ts            # Production build script
```

## Deployment

### Cloudflare Pages

1. Connect your repository to Cloudflare Pages
2. Configure build settings:
   - **Build command**: `deno task build`
   - **Build output directory**: `public`
   - **Environment variables**: Set Deno version if needed

The app will be deployed with:
- Service Worker for offline support
- Automatic HTTPS
- Global CDN distribution
- Background sync for failed requests

## PWA Features

- ✅ Installable on desktop and mobile
- ✅ Offline support with caching strategies
- ✅ Background sync for POST requests
- ✅ App manifest for native-like experience
- ✅ Service worker with Workbox

## License

MIT
