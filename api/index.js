import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Import Coffee Shop Finder routes
import authRoutes from './src/routes/authRoutes.js';
import pingRoutes from './src/routes/pingRoutes.js';
import searchRoutes from './src/routes/searchRoutes.js';
import coffeeShopRoutes from './src/routes/coffeeShopRoutes.js';
import collectionRoutes from './src/routes/collectionRoutes.js';
import reviewRoutes from './src/routes/reviewRoutes.js';
import favoriteRoutes from './src/routes/favoriteRoutes.js';
import visitRoutes from './src/routes/visitRoutes.js';
import categoryRoutes from './src/routes/categoryRoutes.js';

// Import middleware
import globalErrorHandler, { 
  notFoundHandler, 
  requestLogger, 
  responseTimeLogger,
  corsErrorHandler,
  handleUncaughtException,
  handleUnhandledRejection
} from './src/middleware/errorHandler.js';

dotenv.config();

// Handle uncaught exceptions and unhandled rejections
handleUncaughtException();
handleUnhandledRejection();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allowed frontend origins for Coffee Shop Finder
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174', // In case you use a different port
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  'https://coffee-shop-finder.vercel.app', // Update with your actual domain
  'https://your-coffee-app.netlify.app',   // Update with your actual domain
].filter(Boolean); // Remove undefined values

// ✅ CORS options with enhanced logging
const corsOptions = {
  origin: function (origin, callback) {
    console.log('🔍 CORS origin request:', origin);
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      console.log('✅ No origin - allowing request');
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      console.log('✅ Origin allowed:', origin);
      return callback(null, true);
    }
    
    console.warn(`❌ Blocked by CORS: ${origin}`);
    console.warn('📋 Allowed origins:', allowedOrigins);
    return callback(new Error(`CORS policy does not allow origin: ${origin}`));
  },
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With', 
    'Content-Type', 
    'Accept', 
    'Authorization',
    'Cache-Control'
  ],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// ✅ Security and logging middleware
app.use(corsErrorHandler); // Custom CORS handler
app.use(requestLogger); // Log all requests
app.use(responseTimeLogger); // Log response times

// ✅ Core middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests
app.use(express.json({ limit: '10mb' })); // Increase limit for image uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ✅ API Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '☕ Coffee Shop Finder API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      search: '/api/search',
      coffeeShops: '/api/coffee-shops',
      collections: '/api/collections',
      reviews: '/api/reviews',
      favorites: '/api/favorites',
      visits: '/api/visits',
      categories: '/api/categories',
      health: '/api/ping'
    }
  });
});

// ✅ API routes for Coffee Shop Finder
app.use('/api', pingRoutes); // Health checks
app.use('/api/auth', authRoutes); // Authentication
app.use('/api/search', searchRoutes); // Coffee shop search
app.use('/api/coffee-shops', coffeeShopRoutes); // Coffee shop CRUD
app.use('/api/collections', collectionRoutes); // User collections
app.use('/api/reviews', reviewRoutes); // Reviews and ratings
app.use('/api/favorites', favoriteRoutes); // User favorites
app.use('/api/visits', visitRoutes); // Visit tracking
app.use('/api/categories', categoryRoutes); // Coffee shop categories

// ✅ 404 handler for undefined routes
app.all('*', notFoundHandler);

// ✅ Global error handling middleware (must be last)
app.use(globalErrorHandler);

// ✅ Start server with enhanced logging
const server = app.listen(PORT, () => {
  console.log('🚀 Coffee Shop Finder API Server Started');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️ Database: ${process.env.DATABASE_URL ? '✅ Connected' : '❌ Not configured'}`);
  console.log(`🔑 Geoapify API: ${process.env.GEOAPIFY_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`🍪 JWT Secret: ${process.env.JWT_SECRET ? '✅ Configured' : '❌ Missing'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔗 Available Endpoints:');
  console.log('  • GET  / - API Info');
  console.log('  • GET  /api/ping - Health Check');
  console.log('  • POST /api/auth/register - Register User');
  console.log('  • POST /api/auth/login - Login User');
  console.log('  • GET  /api/search - Search Coffee Shops');
  console.log('  • GET  /api/coffee-shops - Get Coffee Shops');
  console.log('  • GET  /api/collections - Get Collections');
  console.log('  • GET  /api/reviews - Get Reviews');
  console.log('  • GET  /api/favorites - Get Favorites');
  console.log('  • GET  /api/categories - Get Categories');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

// ✅ Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed. Process terminated.');
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed. Process terminated.');
  });
});

export default app;