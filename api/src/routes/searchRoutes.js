import express from 'express';
import { 
  searchNearbyCoffeeShops, 
  getSearchHistory, 
  getPopularLocations 
} from '../controllers/searchController.js';
import { optionalAuthMiddleware } from '../middleware/authMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { catchAsync } from '../middleware/errorHandler.js';

const router = express.Router();

// GET /search - Search nearby coffee shops (Optional Auth)
router.get('/', optionalAuthMiddleware, catchAsync(searchNearbyCoffeeShops));

// GET /search/history - Get user's search history (Protected)
router.get('/history', authMiddleware, catchAsync(getSearchHistory));

// GET /search/popular - Get popular search locations (Public)
router.get('/popular', catchAsync(getPopularLocations));

export default router;