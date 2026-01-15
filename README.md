# Ecuasystems E-commerce Platform

Full-stack MERN e-commerce application with TypeScript frontend and Express backend.

## Features

- Product catalog with search and filtering
- Shopping cart functionality
- User authentication & authorization
- Admin panel for product management
- Order management system
- Secure payment processing integration ready

## Tech Stack

### Frontend
- React 18 with TypeScript
- Redux Toolkit & RTK Query
- React Router v6
- React Bootstrap
- Vite

### Backend
- Express.js
- Prisma ORM
- MongoDB
- JWT Authentication
- bcryptjs for password hashing

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB database (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
\`\`\`bash
git clone https://github.com/bryan-acuna/ecuasystem.git
cd ecuasystems
\`\`\`

2. Install dependencies
\`\`\`bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install
\`\`\`

3. Setup environment variables
\`\`\`bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your configuration
\`\`\`

Required environment variables:
- \`NODE_ENV\` - development/production
- \`PORT\` - Backend server port (default: 8000)
- \`DATABASE_URL\` - MongoDB connection string
- \`JWT_SECRET\` - Secret for JWT tokens (min 32 chars in production)
- \`FRONTEND_URL\` - Frontend URL for CORS

4. Setup Prisma
\`\`\`bash
# Generate Prisma Client
npx prisma generate

# Run migrations (if any)
npx prisma db push
\`\`\`

5. Seed database (optional)
\`\`\`bash
npm run seed
\`\`\`

### Running the Application

#### Development Mode
\`\`\`bash
# Run both frontend and backend concurrently
npm run dev

# Or run separately:
npm run server  # Backend only
npm run client  # Frontend only
\`\`\`

#### Production Mode
\`\`\`bash
# Build frontend
cd frontend && npm run build

# Start backend
npm start
\`\`\`

## Available Scripts

- \`npm run dev\` - Run both frontend and backend in development mode
- \`npm run server\` - Run backend with nodemon
- \`npm run client\` - Run frontend dev server
- \`npm start\` - Start production backend server

## API Endpoints

### Products
- \`GET /api/products\` - Get all products
- \`GET /api/products/:id\` - Get single product

### Users
- \`POST /api/users/auth\` - Login user
- \`POST /api/users\` - Register user
- \`POST /api/users/logout\` - Logout user
- \`GET /api/users/profile\` - Get user profile (protected)
- \`PUT /api/users/profile\` - Update user profile (protected)

### Admin Routes
- \`GET /api/users\` - Get all users (admin)
- \`DELETE /api/users/:id\` - Delete user (admin)
- \`GET /api/users/:id\` - Get user by ID (admin)
- \`PUT /api/users/:id\` - Update user (admin)

## Security Features

- Helmet.js for security headers
- Rate limiting on API endpoints
- CORS configuration
- HTTP-only cookies for JWT
- bcrypt password hashing
- Input sanitization
- Environment variable validation

## Deployment

### Backend Deployment (Render/Railway/etc)
1. Set environment variables in hosting platform
2. Ensure \`NODE_ENV=production\`
3. Set strong \`JWT_SECRET\` (32+ characters)
4. Configure \`FRONTEND_URL\` for CORS
5. Deploy with \`npm start\`

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: \`cd frontend && npm run build\`
2. Set environment variables if needed
3. Deploy the \`frontend/dist\` directory

## License

MIT

## Author

Bryan Acuna
