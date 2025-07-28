// ===== FILE: middleware/authMiddleware.js =====
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

// Main authentication middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "Unauthorized: No token provided",
      error: "MISSING_TOKEN"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { 
        id: true, 
        username: true, 
        email: true, 
        name: true,
        preferences: true,
        createdAt: true 
      }
    });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized: User not found",
        error: "USER_NOT_FOUND"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized: Token expired",
        error: "TOKEN_EXPIRED"
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        success: false,
        message: "Forbidden: Invalid token",
        error: "INVALID_TOKEN"
      });
    }
    
    return res.status(500).json({ 
      success: false,
      message: "Internal server error during authentication",
      error: "AUTH_ERROR"
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuthMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { 
        id: true, 
        username: true, 
        email: true, 
        name: true,
        preferences: true,
        createdAt: true 
      }
    });

    req.user = user || null;
    next();
  } catch (error) {
    // If token is invalid, just continue without user
    req.user = null;
    next();
  }
};

// Collections-specific authentication middleware
// Ensures user owns the collection they're trying to access
export const collectionOwnerMiddleware = async (req, res, next) => {
  try {
    const collectionId = parseInt(req.params.collectionId);
    
    if (!collectionId) {
      return res.status(400).json({
        success: false,
        message: "Invalid collection ID",
        error: "INVALID_COLLECTION_ID"
      });
    }

    // Check if collection exists and belongs to the authenticated user
    const collection = await prisma.userCollection.findFirst({
      where: {
        id: collectionId,
        userId: req.user.id
      },
      select: { id: true, name: true, isPublic: true }
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found or access denied",
        error: "COLLECTION_NOT_FOUND"
      });
    }

    // Attach collection info to request for use in controller
    req.collection = collection;
    next();
  } catch (error) {
    console.error('Collection owner middleware error:', error);
    return res.status(500).json({
      success: false,
      message: "Error verifying collection ownership",
      error: "COLLECTION_ACCESS_ERROR"
    });
  }
};

// Public collection access middleware (for viewing public collections)
export const publicCollectionAccessMiddleware = async (req, res, next) => {
  try {
    const collectionId = parseInt(req.params.collectionId);
    
    if (!collectionId) {
      return res.status(400).json({
        success: false,
        message: "Invalid collection ID",
        error: "INVALID_COLLECTION_ID"
      });
    }

    // Check if collection exists and is either public or belongs to user
    const whereClause = {
      id: collectionId,
      OR: [
        { isPublic: true },
        ...(req.user ? [{ userId: req.user.id }] : [])
      ]
    };

    const collection = await prisma.userCollection.findFirst({
      where: whereClause,
      select: { 
        id: true, 
        name: true, 
        isPublic: true, 
        userId: true,
        user: {
          select: {
            username: true,
            name: true
          }
        }
      }
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found or is private",
        error: "COLLECTION_NOT_ACCESSIBLE"
      });
    }

    req.collection = collection;
    req.isOwner = req.user && collection.userId === req.user.id;
    next();
  } catch (error) {
    console.error('Public collection access middleware error:', error);
    return res.status(500).json({
      success: false,
      message: "Error checking collection access",
      error: "COLLECTION_ACCESS_ERROR"
    });
  }
};

// Admin middleware (requires authentication + admin role)
export const adminMiddleware = async (req, res, next) => {
  // First check authentication
  await authMiddleware(req, res, async () => {
    try {
      // Check if user has admin privileges
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { preferences: true }
      });

      // Check if user is admin (you can modify this logic)
      const isAdmin = user?.preferences?.role === 'admin' || 
                     user?.preferences?.isAdmin === true ||
                     req.user.username === 'admin'; // Simple check

      if (!isAdmin) {
        return res.status(403).json({ 
          success: false,
          message: "Forbidden: Admin privileges required",
          error: "INSUFFICIENT_PRIVILEGES"
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ 
        success: false,
        message: "Error verifying admin privileges",
        error: "ADMIN_CHECK_ERROR"
      });
    }
  });
};

// Rate limiting middleware for public APIs
export const rateLimitMiddleware = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    const clientId = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old requests
    if (requests.has(clientId)) {
      const clientRequests = requests.get(clientId).filter(time => time > windowStart);
      requests.set(clientId, clientRequests);
    }

    const clientRequests = requests.get(clientId) || [];

    if (clientRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: "Too many requests, please try again later",
        error: "RATE_LIMIT_EXCEEDED",
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    clientRequests.push(now);
    requests.set(clientId, clientRequests);
    next();
  };
};

// Validate required fields middleware
export const validateRequiredFields = (fields) => {
  return (req, res, next) => {
    const missingFields = fields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        error: "VALIDATION_ERROR",
        missingFields
      });
    }
    
    next();
  };
};

// Validate collection data middleware
export const validateCollectionData = (req, res, next) => {
  const { name, description, color, isPublic } = req.body;

  // Validate name
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Collection name must be a non-empty string",
        error: "INVALID_NAME"
      });
    }
    if (name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: "Collection name must be 100 characters or less",
        error: "NAME_TOO_LONG"
      });
    }
  }

  // Validate description
  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      return res.status(400).json({
        success: false,
        message: "Description must be a string",
        error: "INVALID_DESCRIPTION"
      });
    }
    if (description.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Description must be 500 characters or less",
        error: "DESCRIPTION_TOO_LONG"
      });
    }
  }

  // Validate color
  if (color !== undefined) {
    const colorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!colorRegex.test(color)) {
      return res.status(400).json({
        success: false,
        message: "Color must be a valid hex color code (e.g., #FFD700)",
        error: "INVALID_COLOR"
      });
    }
  }

  // Validate isPublic
  if (isPublic !== undefined && typeof isPublic !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: "isPublic must be a boolean value",
      error: "INVALID_IS_PUBLIC"
    });
  }

  next();
};

// Validate coffee shop data middleware
export const validateCoffeeShopData = (req, res, next) => {
  const { 
    name, 
    address, 
    latitude, 
    longitude, 
    rating, 
    priceLevel,
    website,
    notes 
  } = req.body;

  // Validate required name
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Coffee shop name is required and must be a non-empty string",
      error: "INVALID_NAME"
    });
  }

  // Validate coordinates if provided
  if (latitude !== undefined) {
    const lat = parseFloat(latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      return res.status(400).json({
        success: false,
        message: "Latitude must be a number between -90 and 90",
        error: "INVALID_LATITUDE"
      });
    }
  }

  if (longitude !== undefined) {
    const lng = parseFloat(longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message: "Longitude must be a number between -180 and 180",
        error: "INVALID_LONGITUDE"
      });
    }
  }

  // Validate rating if provided
  if (rating !== undefined) {
    const ratingNum = parseFloat(rating);
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a number between 0 and 5",
        error: "INVALID_RATING"
      });
    }
  }

  // Validate price level if provided
  if (priceLevel !== undefined) {
    const priceLevelNum = parseInt(priceLevel);
    if (isNaN(priceLevelNum) || priceLevelNum < 1 || priceLevelNum > 4) {
      return res.status(400).json({
        success: false,
        message: "Price level must be a number between 1 and 4",
        error: "INVALID_PRICE_LEVEL"
      });
    }
  }

  // Validate website if provided
  if (website !== undefined && website !== null && website !== '') {
    try {
      new URL(website);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Website must be a valid URL",
        error: "INVALID_WEBSITE"
      });
    }
  }

  // Validate notes if provided
  if (notes !== undefined && notes !== null) {
    if (typeof notes !== 'string') {
      return res.status(400).json({
        success: false,
        message: "Notes must be a string",
        error: "INVALID_NOTES"
      });
    }
    if (notes.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Notes must be 1000 characters or less",
        error: "NOTES_TOO_LONG"
      });
    }
  }

  next();
};

export default authMiddleware;