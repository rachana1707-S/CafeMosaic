// ===== FILE: routes/coffeeShopRoutes.js =====
import express from "express";
import {
  getCoffeeShops,
  getSingleCoffeeShop,
  createCoffeeShop,
  updateCoffeeShop,
  deleteCoffeeShop,
} from "../controllers/coffeeShopController.js";
import authMiddleware, { adminMiddleware, optionalAuthMiddleware } from "../middleware/authMiddleware.js";
import { validateRequiredFields } from "../middleware/authMiddleware.js";
import { catchAsync } from "../middleware/errorHandler.js";

const router = express.Router();

// GET /coffee-shops - Get all coffee shops with filters (Public/Optional Auth)
router.get("/", optionalAuthMiddleware, catchAsync(getCoffeeShops));

// GET /coffee-shops/:id - Get single coffee shop (Public)
router.get("/:id", catchAsync(getSingleCoffeeShop));

// POST /coffee-shops - Create/update coffee shop from API data (Admin)
router.post(
  "/", 
  adminMiddleware,
  validateRequiredFields(['placeId', 'name', 'address', 'latitude', 'longitude']),
  catchAsync(createCoffeeShop)
);

// PUT /coffee-shops/:id - Update coffee shop details (Admin)
router.put("/:id", adminMiddleware, catchAsync(updateCoffeeShop));

// DELETE /coffee-shops/:id - Delete coffee shop (Admin)
router.delete("/:id", adminMiddleware, catchAsync(deleteCoffeeShop));

export default router;