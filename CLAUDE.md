# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PewPew is a Progressive Web App built with:
- **Deno** as the runtime (using import maps for dependency management)
- **SolidJS** for reactive UI (JSX with fine-grained reactivity)
- **RxJS** for reactive stream processing
- **Ramda** for functional programming utilities
- **Tailwind CSS** for styling
- **LocalStorage** for client-side data persistence
- **Service Worker + Workbox** for PWA features (offline support, caching, background sync)
- **Cloudflare Pages** for deployment

## Development Environment Setup

### Nix Flake (Recommended)

This project includes a `flake.nix` for reproducible development environments.

**Enter the dev shell:**
```bash
nix develop
```

**Or use direnv** (automatic activation when entering directory):
```bash
# Install direnv if not already installed
# Then allow the .envrc file:
direnv allow
```

The Nix shell provides:
- Deno (latest)
- Tailwind CSS v4 (native binary)
- ESLint (native binary)
- Prettier (native binary)

### Manual Setup (Alternative)

If not using Nix:
1. Install [Deno](https://deno.land/) (v1.40+)
2. Install [Tailwind CSS](https://tailwindcss.com/) standalone CLI
3. Install [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) globally or locally

## Development Commands

### Start Development Server
```bash
deno task dev
```
Starts dev server on http://localhost:8000 with hot reload and Tailwind watch mode.

### Build for Production
```bash
deno task build
```
Creates optimized production build in `public/dist/`.

### Preview Production Build
```bash
deno task preview
```
Serves production build on http://localhost:8080.

### Code Quality
```bash
# Deno native tools
deno task lint        # Lint TypeScript files
deno task fmt         # Format code
deno task fmt:check   # Check formatting
deno task check       # Type check main.tsx

# Nix-provided tools (available in dev shell)
eslint src/           # ESLint
eslint --fix src/     # ESLint with auto-fix
prettier --write .    # Format with Prettier
prettier --check .    # Check Prettier formatting
```

## Architecture

### Dependency Management
- All runtime dependencies are managed via **import maps** in `deno.json`
- Uses CDN imports (esm.sh) for all packages
- No node_modules - pure Deno approach
- Development tools (Tailwind CSS, ESLint, Prettier) provided by Nix flake

### Build Process
1. **CSS Build**: Tailwind CLI processes `src/styles/index.css` → `public/styles/output.css`
2. **JS Build**: esbuild bundles `src/main.tsx` → `public/dist/main.js` with Deno plugin
3. **Service Worker**: Static file `public/sw.js` uses Workbox from CDN (no build step)

### SolidJS Patterns
- Use `createSignal` for reactive state
- Use `createStore` from "solid-js/store" for complex nested state
- Components use JSX with preserved mode (`jsx: "preserve"` in deno.json)
- Fine-grained reactivity - avoid unnecessary components, use primitives directly

### State Management
- **Local component state**: `createSignal`, `createStore`
- **Global state**: Create stores in `src/services/` and import where needed
- **Persistence**: Use localStorage with JSON serialization
- **Async state**: Combine RxJS observables with SolidJS signals

### RxJS Integration
```typescript
// Example pattern for RxJS + SolidJS
import { createSignal, onMount, onCleanup } from "solid-js";
import { fromEvent } from "rxjs";

const [value, setValue] = createSignal(0);

onMount(() => {
  const subscription = someObservable$.subscribe(setValue);
  onCleanup(() => subscription.unsubscribe());
});
```

### Ramda Usage
- Use Ramda for data transformations and functional operations
- Import as `import * as R from "ramda"`
- Prefer point-free style where it improves readability
- Common functions: `R.map`, `R.filter`, `R.pipe`, `R.compose`, `R.inc`, `R.dec`

### File Organization
```
src/
├── components/    # Reusable SolidJS components
├── services/      # Business logic, API calls, global stores
├── utils/         # Pure functions, helpers
├── styles/        # Tailwind source CSS
├── App.tsx        # Root component
└── main.tsx       # Entry point (renders App, registers SW)
```

### PWA Service Worker
- Service worker located at `public/sw.js`
- Uses Workbox 7.0.0 from CDN (imported via importScripts)
- Caching strategies:
  - **App shell**: Precached on install
  - **Static assets** (CSS/JS/images): CacheFirst
  - **API calls**: NetworkFirst with 5-min expiration
  - **Navigation**: StaleWhileRevalidate
  - **POST requests**: NetworkFirst with BackgroundSync
- Registered in `src/main.tsx`

### TypeScript Configuration
- Strict mode enabled in `deno.json` compilerOptions
- All strict flags are true (noImplicitAny, strictNullChecks, etc.)
- JSX import source is "solid-js"
- Library includes: "deno.window", "dom", "dom.iterable"

## Key Development Patterns

### Adding New Dependencies
1. Find package on esm.sh (e.g., `https://esm.sh/package-name@version`)
2. Add to `imports` in `deno.json`:
   ```json
   "package-name": "https://esm.sh/package-name@x.y.z"
   ```
3. Import normally: `import { foo } from "package-name"`

### Creating Components
```typescript
import { Component, createSignal } from "solid-js";

const MyComponent: Component<{ initialValue: number }> = (props) => {
  const [count, setCount] = createSignal(props.initialValue);

  return (
    <div class="p-4">
      <p>{count()}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
};

export default MyComponent;
```

### Working with LocalStorage
```typescript
// Save
localStorage.setItem("key", JSON.stringify(data));

// Load
const data = JSON.parse(localStorage.getItem("key") || "null");

// Pattern: Sync signal with localStorage
const [value, setValue] = createSignal(
  JSON.parse(localStorage.getItem("key") || "0")
);

createEffect(() => {
  localStorage.setItem("key", JSON.stringify(value()));
});
```

### RxJS + Ramda Example
```typescript
import { fromEvent } from "rxjs";
import { map, filter } from "rxjs/operators";
import * as R from "ramda";

const clicks$ = fromEvent(button, "click").pipe(
  map(() => R.inc(count())),
  filter(R.gt(R.__, 10)) // Only values > 10
);
```

## Cloudflare Pages Deployment

### Build Configuration
- **Build command**: `deno task build`
- **Build output directory**: `public`
- **Root directory**: `/`

### Environment Variables
Set in Cloudflare Pages dashboard if needed:
- `DENO_VERSION` (optional, Cloudflare auto-detects)

### Headers and Redirects
Create `public/_headers` and `public/_redirects` files if needed for custom Cloudflare Pages configuration.

## Important Notes

- **No node_modules**: This project uses Deno with import maps exclusively
- **Nix-native tools**: Tailwind CSS, ESLint, and Prettier are provided as native binaries via Nix flake
- **JSX Transform**: Uses SolidJS's JSX transform, not React
- **Service Worker**: Lives in public/ and is not bundled - edit directly
- **Hot Reload**: Development server watches files, Tailwind watches CSS
- **Type Checking**: Run `deno task check` to type check without building
