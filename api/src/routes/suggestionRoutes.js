import express from "express";
import {
  getSuggestions,
  addSuggestion,
  getSingleSuggestion,
  deleteSuggestion,
  updateSuggestion,
  addPlaceToSuggestion,
  updatePlaceInSuggestion,
  deletePlaceFromSuggestion,
} from "../controllers/suggestionController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all suggestions (Public)
router.get("/suggestions", getSuggestions);

// GET single suggestion by ID (Public)
router.get("/suggestions/:suggestionId", getSingleSuggestion);

// POST new suggestion (Protected)
router.post("/suggestions", authMiddleware, addSuggestion);

// PUT update a suggestion (Protected)
router.put("/suggestions/:suggestionId", authMiddleware, updateSuggestion);

// DELETE a suggestion (Protected)
router.delete("/suggestions/:suggestionId", authMiddleware, deleteSuggestion);

// POST add a place to a suggestion (Protected)
router.post("/suggestions/:suggestionId/places", authMiddleware, addPlaceToSuggestion);

// PUT update a specific place (Protected)
router.put("/suggestions/place/:placeId", authMiddleware, updatePlaceInSuggestion);

// DELETE a specific place (Protected)
router.delete("/suggestions/place/:placeId", authMiddleware, deletePlaceFromSuggestion);

export default router;
