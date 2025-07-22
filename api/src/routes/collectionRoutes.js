// ===== FILE: routes/collectionRoutes.js =====
import express from "express";
import {
  getCollectionsByUser,
  getSingleCollection,
  createCollection,
  addCoffeeShopToCollection,
  updateCollection,
  deleteCollection,
  removeCoffeeShopFromCollection,
} from "../controllers/userCollectionController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateRequiredFields } from "../middleware/authMiddleware.js";
import { catchAsync } from "../middleware/errorHandler.js";

const router = express.Router();

// GET /collections/user/:userId - Get all collections for a user (Protected)
router.get("/user/:userId", authMiddleware, catchAsync(getCollectionsByUser));

// GET /collections/:id - Get a single collection by ID (Protected)
router.get("/:id", authMiddleware, catchAsync(getSingleCollection));

// POST /collections - Create a new collection (Protected)
router.post(
  "/", 
  authMiddleware,
  validateRequiredFields(['name']),
  catchAsync(createCollection)
);

// POST /collections/:collectionId/coffee-shops - Add coffee shop to collection (Protected)
router.post(
  "/:collectionId/coffee-shops", 
  authMiddleware,
  validateRequiredFields(['coffeeShopId']),
  catchAsync(addCoffeeShopToCollection)
);

// PUT /collections/:id - Update a collection (Protected)
router.put(
  "/:id", 
  authMiddleware,
  validateRequiredFields(['name']),
  catchAsync(updateCollection)
);

// DELETE /collections/:id - Delete a collection (Protected)
router.delete("/:id", authMiddleware, catchAsync(deleteCollection));

// DELETE /collections/coffee-shops/:id - Remove coffee shop from collection (Protected)
router.delete("/coffee-shops/:id", authMiddleware, catchAsync(removeCoffeeShopFromCollection));

export default router;