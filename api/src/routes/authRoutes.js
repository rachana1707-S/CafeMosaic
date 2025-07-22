// ===== FILE: routes/authRoutes.js =====
import express from "express";
import { 
  register, 
  login, 
  logout, 
  getMe, 
  getCurrentUser,
  updateUserPreferences 
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateRequiredFields } from "../middleware/authMiddleware.js";
import { catchAsync } from "../middleware/errorHandler.js";

const router = express.Router();

// POST /auth/register - Register new user
router.post(
  "/register", 
  validateRequiredFields(['username', 'email', 'password']),
  catchAsync(register)
);

// POST /auth/login - Login user
router.post(
  "/login", 
  validateRequiredFields(['username', 'password']),
  catchAsync(login)
);

// POST /auth/logout - Logout user (Protected)
router.post("/logout", authMiddleware, logout);

// GET /auth/me - Get current user from token (Protected)
router.get("/me", authMiddleware, catchAsync(getMe));

// GET /auth/profile - Get current user profile (Protected)
router.get("/profile", authMiddleware, catchAsync(getCurrentUser));

// PUT /auth/preferences - Update user preferences (Protected)
router.put(
  "/preferences", 
  authMiddleware, 
  catchAsync(updateUserPreferences)
);

export default router;