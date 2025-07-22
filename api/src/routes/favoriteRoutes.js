// ===== FILE: routes/favoriteRoutes.js =====
import express from "express";
import {
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  updateFavoriteNotes,
} from "../controllers/userFavoriteController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateRequiredFields } from "../middleware/authMiddleware.js";
import { catchAsync } from "../middleware/errorHandler.js";

const router = express.Router();

// GET /favorites/user/:userId - Get user's favorite coffee shops (Protected)
router.get("/user/:userId", authMiddleware, catchAsync(getUserFavorites));

// POST /favorites - Add coffee shop to favorites (Protected)
router.post(
  "/", 
  authMiddleware,
  validateRequiredFields(['coffeeShopId']),
  catchAsync(addToFavorites)
);

// DELETE /favorites/:coffeeShopId - Remove from favorites (Protected)
router.delete("/:coffeeShopId", authMiddleware, catchAsync(removeFromFavorites));

// PUT /favorites/:id/notes - Update favorite notes (Protected)
router.put("/:id/notes", authMiddleware, catchAsync(updateFavoriteNotes));

export default router;