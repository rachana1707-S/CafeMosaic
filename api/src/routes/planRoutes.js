import express from "express";
import {
  getPlansByUser,
  getSinglePlan, 
  createPlan,
  addPlaceToPlan,
  deletePlan,
  updatePlan,
} from "../controllers/planController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /plans/user/:userId - Get all plans for a user (Protected)
router.get("/user/:userId", authMiddleware, getPlansByUser);

//  GET /plans/:id - Get a single plan by ID (Protected)
router.get("/:id", authMiddleware, getSinglePlan);  // <-- ADD THIS

// POST /plans - Create a new plan (Protected)
router.post("/", authMiddleware, createPlan);

// POST /plans/:planId/places - Add a place to a plan (Protected)
router.post("/:planId/places", authMiddleware, addPlaceToPlan);

// PUT /plans/:id - Update a plan (Protected)
router.put("/:id", authMiddleware, updatePlan);

// DELETE /plans/:id - Delete a plan (Protected)
router.delete("/:id", authMiddleware, deletePlan);

export default router;
