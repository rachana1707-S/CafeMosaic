// ===== FILE: routes/categoryRoutes.js =====
import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { adminMiddleware } from "../middleware/authMiddleware.js";
import { validateRequiredFields } from "../middleware/authMiddleware.js";
import { catchAsync } from "../middleware/errorHandler.js";

const router = express.Router();

// GET /categories - Get all coffee shop categories (Public)
router.get("/", catchAsync(getCategories));

// POST /categories - Create new category (Admin only)
router.post(
  "/", 
  adminMiddleware,
  validateRequiredFields(['name']),
  catchAsync(createCategory)
);

// PUT /categories/:id - Update category (Admin only)
router.put("/:id", adminMiddleware, catchAsync(updateCategory));

// DELETE /categories/:id - Delete category (Admin only)
router.delete("/:id", adminMiddleware, catchAsync(deleteCategory));

export default router;