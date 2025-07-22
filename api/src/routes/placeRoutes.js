import express from 'express';
import { findNearbyPlaces } from '../controllers/placeController.js';

const router = express.Router();

// Endpoint: GET /api/places
router.get('/', findNearbyPlaces); 

export default router;
