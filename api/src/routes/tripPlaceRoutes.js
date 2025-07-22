import express from "express";
import {
  updateTripPlace,
  deleteTripPlace,
} from "../controllers/tripPlaceController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Update a trip place
router.put("/:id", authMiddleware, updateTripPlace);

// Delete a trip place
router.delete("/:id", authMiddleware, deleteTripPlace);

export default router;
