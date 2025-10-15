# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is an electric bike management console built with Ant Design Pro (v6.0.0), UmiJS v4, React 18, and TypeScript. The application manages electric bikes, stores, articles, banners, and symbols through an admin interface.

## Development Commands

### Install Dependencies
```bash
npm install
# or
yarn
```

### Development Server
```bash
# Start development server (default)
npm start

# Start with dev environment (no mock data)
npm run start:dev

# Start without mock data
npm run start:no-mock

# Start with test environment
npm run start:test

# Start with pre-production environment
npm run start:pre
```

### Build & Deploy
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Build with bundle analysis
npm run analyze

# Build Docker image
docker build -t zhiweicoding/elebike_console:v1.0.0 .
```

### Code Quality
```bash
# Run all linting (ESLint + Prettier + TypeScript)
npm run lint

# Auto-fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run prettier

# TypeScript type checking only
npm run tsc
```

### Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm test:coverage

# Update test snapshots
npm run test:update
```

## Architecture

### Technology Stack
- **Framework**: UmiJS v4 with @umijs/max
- **UI Library**: Ant Design v5 + Ant Design Pro Components v2
- **State Management**: UmiJS built-in model plugin
- **Request Library**: axios via UmiJS request plugin
- **Authentication**: Token-based (Bearer) stored in localStorage
- **Styling**: Less with Ant Design theming

### Project Structure
```
src/
├── pages/          # Page components (route-based)
│   ├── User/       # Login page
│   ├── Home/       # Dashboard
│   ├── Article/    # Article management
│   ├── Banner/     # Mobile banner management
│   ├── BannerPC/   # PC banner management
│   ├── Good/       # Electric bike product management
│   ├── Store/      # Store location management
│   └── Symbol/     # Symbol/icon management
├── components/     # Shared components
├── services/       # API service definitions
├── models/         # Global state models
├── utils/          # Utility functions (crypto, etc.)
├── access.ts       # Permission/access control logic
├── app.tsx         # App runtime configuration
└── requestErrorConfig.ts  # Request/response interceptors
```

### Configuration
- `config/config.ts` - Main UmiJS configuration
- `config/routes.ts` - Route definitions
- `config/proxy.ts` - Development proxy settings (proxies `/proxy/v1/` to `http://localhost:8082/`)
- `config/defaultSettings.ts` - Ant Design Pro layout settings

### Key Architecture Patterns

#### Authentication Flow
1. Token is generated using MD5 hash: `md5(username + password + timestamp)`
2. Token stored in localStorage with "Bearer " prefix
3. Request interceptor (`requestErrorConfig.ts`) adds Authorization header to all requests except whitelist (`/proxy/v1/page/login/in`)
4. Response interceptor handles token expiration (msgCode: 1002 or HTTP 401)
5. Unauthorized users redirected to `/user/login`

#### Access Control
- Defined in `src/access.ts`
- `canAdmin` access level checks `currentUser.adminRole === 1`
- Routes with `access: 'canAdmin'` require admin role
- Access determined during initial state fetch in `app.tsx`

#### Initial State & User Info
- `getInitialState()` in `app.tsx` runs on app mount
- Fetches current user info from `/proxy/v1/page/login/current`
- Token validation happens here - redirects to login if missing/invalid
- Initial state includes: `currentUser`, `settings`, `fetchUserInfo` function

#### Request/Response Flow
1. Request interceptor checks token presence and adds to headers
2. Backend returns standard format: `{msgCode, msgBody, ...}`
3. Response interceptor handles auth errors (msgCode: 1002)
4. Error handler in `requestErrorConfig.ts` manages all error display

#### Route Configuration
- Routes defined in `config/routes.ts`
- Layout enabled by default (Pro Layout with sidebar)
- `/user/*` routes have `layout: false` (full-screen login)
- Default redirect: `/` → `/home`
- 404 page at `./pages/404.tsx`

### Environment Variables
The project uses `REACT_APP_ENV` to switch between environments:
- `dev` - Development (default, proxies to localhost:8082)
- `test` - Test environment
- `pre` - Pre-production

Environment is set via scripts in package.json (e.g., `cross-env REACT_APP_ENV=test`)

## Development Guidelines

### Creating New Pages
1. Add page component in `src/pages/YourPage/index.tsx`
2. Add route in `config/routes.ts`:
   ```ts
   {
     name: 'list.yourpage',
     icon: 'IconName',
     path: '/yourpage',
     access: 'canAdmin',  // if admin-only
     component: './YourPage',
   }
   ```
3. Add i18n labels in `src/locales/zh-CN/menu.ts` if needed

### Adding API Services
1. Define service methods in `src/services/ant-design-pro/`
2. Use `request` from `@umijs/max`:
   ```ts
   import { request } from '@umijs/max';
   
   export async function yourApi(params: any) {
     return request('/proxy/v1/your/endpoint', {
       method: 'POST',
       data: params,
     });
   }
   ```
3. Request interceptor automatically adds Authorization header

### Modifying Authentication Logic
- Token generation: `src/utils/crypto.ts`
- Request/response interceptors: `src/requestErrorConfig.ts`
- Initial state & user fetch: `src/app.tsx`
- Access control: `src/access.ts`

### Working with Ant Design Pro Layout
- Layout configuration in `config/defaultSettings.ts`
- Runtime layout customization in `src/app.tsx` (`layout` export)
- Header actions (language selector, user menu) in `src/components/RightContent/`

## Common Issues

### Token Expiration
- App automatically redirects to login on 401 or msgCode 1002
- Token is MD5-based, stored in localStorage
- Clear token with `removeToken()` from `src/utils/crypto.ts`

### Proxy Not Working
- Proxy only works in development mode
- Check `REACT_APP_ENV` is set to `dev`
- Verify backend is running on `localhost:8082`
- Update `config/proxy.ts` if backend URL changes

### Build Issues
- Run `npm run tsc` to check TypeScript errors
- Run `npm run lint:fix` to auto-fix ESLint issues
- Clear `.umi` cache folders if encountering strange issues
