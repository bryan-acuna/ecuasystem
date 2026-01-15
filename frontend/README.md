# Ecuasystems Frontend

Modern React TypeScript e-commerce frontend built with Vite.

## Tech Stack

- **React 19** with TypeScript
- **Redux Toolkit** with RTK Query for state management
- **React Router v7** for routing
- **React Bootstrap** for UI components
- **Vite** for fast development and optimized builds
- **React Toastify** for notifications

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
VITE_NODE_ENV=development
```

### Development

```bash
# Start dev server (runs on port 3000)
npm run dev
```

### Building for Production

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build:prod

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── assets/          # Static assets (styles, images)
├── components/      # Reusable components
├── config/          # Configuration files
├── screens/         # Page components
├── services/        # API services (RTK Query)
├── slices/          # Redux slices
├── store/           # Redux store configuration
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Features

- **Type-safe** with TypeScript
- **Error boundaries** for graceful error handling
- **Code splitting** for optimized bundle sizes
- **SEO optimized** with proper meta tags
- **Responsive design** with Bootstrap
- **State management** with Redux Toolkit
- **API caching** with RTK Query
- **Toast notifications** for user feedback

## Production Optimizations

- ✅ Bundle splitting (React, Redux, UI vendors)
- ✅ Error boundary for crash recovery
- ✅ TypeScript strict mode
- ✅ SEO meta tags
- ✅ Environment variable configuration
- ✅ Production build scripts

## Deployment

### Vercel/Netlify
1. Build command: `npm run build:prod`
2. Output directory: `dist`
3. Set environment variables in hosting platform

### Manual Deployment
```bash
npm run build:prod
# Deploy the 'dist' folder
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:prod` - Build with production optimizations
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Lint code
- `npm run lint:fix` - Lint and auto-fix issues
- `npm run preview` - Preview production build locally

## License

MIT
