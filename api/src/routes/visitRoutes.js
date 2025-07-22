// ===== FILE: routes/visitRoutes.js =====
import express from "express";
import {
  getUserVisits,
  logVisit,
  updateVisit,
  deleteVisit,
  getVisitStats,
} from "../controllers/visitController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateRequiredFields } from "../middleware/authMiddleware.js";
import { catchAsync } from "../middleware/errorHandler.js";

const router = express.Router();

// GET /visits/user/:userId - Get user's coffee shop visits (Protected)
router.get("/user/:userId", authMiddleware, catchAsync(getUserVisits));

// GET /visits/stats/:coffeeShopId - Get visit statistics for coffee shop (Public)
router.get("/stats/:coffeeShopId", catchAsync(getVisitStats));

// POST /visits - Log a coffee shop visit (Protected)
router.post(
  "/", 
  authMiddleware,
  validateRequiredFields(['coffeeShopId']),
  catchAsync(logVisit)
);

// PUT /visits/:id - Update a visit (Protected)
router.put("/:id", authMiddleware, catchAsync(updateVisit));

// DELETE /visits/:id - Delete a visit (Protected)
router.delete("/:id", authMiddleware, catchAsync(deleteVisit));

export default router;  