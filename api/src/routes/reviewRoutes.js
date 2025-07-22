// ===== FILE: routes/reviewRoutes.js =====
import express from "express";
import {
  getReviewsByCoffeeShop,
  getReviewsByUser,
  createOrUpdateReview,
  deleteReview,
} from "../controllers/userReviewController.js";
import authMiddleware, { optionalAuthMiddleware } from "../middleware/authMiddleware.js";
import { validateRequiredFields } from "../middleware/authMiddleware.js";
import { catchAsync } from "../middleware/errorHandler.js";

const router = express.Router();

// GET /reviews/coffee-shop/:coffeeShopId - Get all reviews for a coffee shop (Public)
router.get("/coffee-shop/:coffeeShopId", catchAsync(getReviewsByCoffeeShop));

// GET /reviews/user/:userId - Get all reviews by a user (Public)
router.get("/user/:userId", catchAsync(getReviewsByUser));

// POST /reviews - Create or update a review (Protected)
router.post(
  "/", 
  authMiddleware,
  validateRequiredFields(['coffeeShopId', 'rating']),
  catchAsync(createOrUpdateReview)
);

// DELETE /reviews/:id - Delete a review (Protected)
router.delete("/:id", authMiddleware, catchAsync(deleteReview));

export default router;