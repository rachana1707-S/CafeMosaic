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

// Admin middleware (requires authentication + admin role)
export const adminMiddleware = async (req, res, next) => {
  // First check authentication
  await authMiddleware(req, res, async () => {
    try {
      // Check if user has admin privileges
      // You can modify this logic based on how you handle admin roles
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

export default authMiddleware;