

// routes/collectionRoutes.js
import express from 'express';
import { body } from 'express-validator';
import authMiddleware, { 
  collectionOwnerMiddleware, 
  validateCollectionData, 
  validateCoffeeShopData,
  rateLimitMiddleware 
} from '../middleware/authMiddleware.js';
import collectionsController from '../controllers/collectionsController.js';

const router = express.Router();

// Validation rules using express-validator
const createCollectionValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Collection name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Color must be a valid hex color code'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean value')
];

const updateCollectionValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Collection name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Color must be a valid hex color code'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean value')
];

const addPlaceValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Place name is required'),
  body('placeId')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Place ID cannot be empty if provided'),
  body('id')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('ID cannot be empty if provided'),
  body('address')
    .optional()
    .trim(),
  body('phone')
    .optional()
    .trim(),
  body('website')
    .optional()
    .trim()
    .custom((value) => {
      if (value && value !== '') {
        try {
          new URL(value);
          return true;
        } catch {
          throw new Error('Website must be a valid URL');
        }
      }
      return true;
    }),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),
  body('priceLevel')
    .optional()
    .isInt({ min: 1, max: 4 })
    .withMessage('Price level must be between 1 and 4'),
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be valid'),
  body('description')
    .optional()
    .trim(),
  body('category')
    .optional()
    .trim(),
  body('cuisine')
    .optional()
    .trim(),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
  body('isVisited')
    .optional()
    .isBoolean()
    .withMessage('isVisited must be a boolean value')
];

const batchAddPlaceValidation = [
  body('collectionIds')
    .isArray()
    .withMessage('Collection IDs must be an array'),
  body('collectionIds.*')
    .isString()
    .withMessage('Each collection ID must be a string'),
  body('place')
    .isObject()
    .withMessage('Place data is required'),
  body('place.name')
    .notEmpty()
    .withMessage('Place name is required'),
  body('place.address')
    .optional()
    .isString(),
  body('place.placeId')
    .optional()
    .isString(),
  body('place.id')
    .optional()
    .isString()
];

const updatePlaceValidation = [
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
  body('isVisited')
    .optional()
    .isBoolean()
    .withMessage('isVisited must be a boolean value'),
  body('personalRating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Personal rating must be between 0 and 5'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

// ==================== PUBLIC ROUTES ====================
// Public routes (with rate limiting) - NO AUTHENTICATION REQUIRED
router.get('/public', 
  rateLimitMiddleware(50, 15 * 60 * 1000), // 50 requests per 15 minutes
  collectionsController.getPublicCollections
);

// ==================== PROTECTED ROUTES ====================
// All routes below require authentication
router.use(authMiddleware);

// Collection CRUD routes
router.get('/', collectionsController.getUserCollections);

router.post('/', 
  createCollectionValidation,
  validateCollectionData,
  collectionsController.createCollection
);

router.get('/:collectionId', 
  collectionsController.getCollectionById
);

router.put('/:collectionId', 
  updateCollectionValidation,
  validateCollectionData,
  collectionsController.updateCollection
);

router.delete('/:collectionId', 
  collectionsController.deleteCollection
);

// ==================== PLACE ROUTES ====================
// Add place to specific collection
router.post('/:collectionId/places', 
  addPlaceValidation,
  validateCoffeeShopData,
  collectionsController.addPlaceToCollection
);

// Batch add place to multiple collections
router.post('/batch/add-place', 
  batchAddPlaceValidation,
  collectionsController.batchAddPlaceToCollections
);

// Update place in collection
router.put('/:collectionId/places/:placeId', 
  updatePlaceValidation,
  collectionsController.updatePlaceInCollection
);

// Remove place from collection
router.delete('/:collectionId/places/:placeId', 
  collectionsController.removePlaceFromCollection
);

export default router;