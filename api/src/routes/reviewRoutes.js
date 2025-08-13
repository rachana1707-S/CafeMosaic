import express from 'express';
import {
  getAllReviews,
  getCoffeeShopReviews,
  getUserReviews,
  createReview,
  createReviewWithPlace,
  updateReview,
  deleteReview,
  getReview,
  markReviewHelpful
} from '../controllers/userReviewController.js';
import authMiddleware, { optionalAuthMiddleware } from '../middleware/authMiddleware.js';
import { catchAsync } from '../middleware/errorHandler.js';

const router = express.Router();

// Public routes (no authentication required)
// GET /api/reviews - Get all reviews (public, with optional auth for personalization)
router.get('/', optionalAuthMiddleware, catchAsync(getAllReviews));

// GET /api/reviews/coffee-shop/:coffeeShopId - Get reviews for specific coffee shop (public)
router.get('/coffee-shop/:coffeeShopId', optionalAuthMiddleware, catchAsync(getCoffeeShopReviews));

// GET /api/reviews/my-reviews - Get current user's reviews
router.get('/my-reviews', authMiddleware, catchAsync(getUserReviews));

// GET /api/reviews/:id - Get single review (public)
router.get('/:reviewId', catchAsync(getReview));

// Protected routes (authentication required)
// POST /api/reviews/create-with-place - Create review with coffee shop data (for new places)
router.post('/create-with-place', authMiddleware, catchAsync(createReviewWithPlace));

// POST /api/reviews - Create new review
router.post('/', authMiddleware, catchAsync(createReview));

// PUT /api/reviews/:id - Update review (only review owner)
router.put('/:reviewId', authMiddleware, catchAsync(updateReview));

// DELETE /api/reviews/:id - Delete review (only review owner)
router.delete('/:reviewId', authMiddleware, catchAsync(deleteReview));

// POST /api/reviews/:id/helpful - Mark review as helpful
router.post('/:reviewId/helpful', authMiddleware, catchAsync(markReviewHelpful));

export default router;