// src/routes/userRoutes.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// TODO: Replace this with your actual authentication middleware
// You probably have something like: import { authenticateToken } from '../middleware/auth.js';
const authenticateToken = (req, res, next) => {
  // TEMPORARY MOCK - Replace with your actual auth logic
  req.user = { id: 1 }; // Mock user ID
  next();
};

// GET /api/users/profile - Get user profile with stats
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('📋 Fetching profile for user:', userId);

    // Fetch user with all related data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        reviews: {
          include: { coffeeShop: true },
          orderBy: { createdAt: 'desc' }
        },
        visits: {
          include: { coffeeShop: true },
          orderBy: { visitDate: 'desc' }
        },
        collections: {
          orderBy: { createdAt: 'desc' }
        },
        favorites: {
          include: { coffeeShop: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate average rating
    const avgRating = user.reviews.length > 0 
      ? user.reviews.reduce((sum, review) => sum + review.rating, 0) / user.reviews.length
      : 0;

    // Add computed stats to user object
    const userWithStats = {
      ...user,
      avgRating: parseFloat(avgRating.toFixed(1))
    };

    console.log('✅ Profile fetched successfully for user:', userId);
    res.json(userWithStats);
  } catch (error) {
    console.error('❌ Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/users/profile - Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, name, preferences } = req.body;

    console.log('📝 Updating profile for user:', userId);
    console.log('📄 Update data:', { username, email, name, preferences });

    // Validate required fields
    if (!username || !email) {
      return res.status(400).json({ message: 'Username and email are required' });
    }

    // Check if username/email already exists (excluding current user)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: email }
        ],
        NOT: { id: userId }
      }
    });

    if (existingUser) {
      const field = existingUser.username === username ? 'Username' : 'Email';
      return res.status(400).json({ message: `${field} is already taken` });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        email,
        name: name || null,
        preferences: preferences || {}
      }
    });

    console.log('✅ Profile updated successfully for user:', updatedUser.id);
    res.json(updatedUser);
  } catch (error) {
    console.error('❌ Error updating user profile:', error);
    
    // Handle Prisma validation errors
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// GET /api/users/activity - Get recent activity
router.get('/activity', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    console.log('📊 Fetching activity for user:', userId);

    // Get recent reviews
    const reviews = await prisma.userReview.findMany({
      where: { userId },
      include: { coffeeShop: true },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    // Get recent visits
    const visits = await prisma.coffeeShopVisit.findMany({
      where: { userId },
      include: { coffeeShop: true },
      orderBy: { visitDate: 'desc' },
      take: limit
    });

    // Get recent collections
    const collections = await prisma.userCollection.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    // Get recent favorites
    const favorites = await prisma.userFavorite.findMany({
      where: { userId },
      include: { coffeeShop: true },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    // Combine and format activities
    const activities = [
      ...reviews.map(review => ({
        type: 'review',
        id: review.id,
        coffeeShop: review.coffeeShop,
        rating: review.rating,
        createdAt: review.createdAt
      })),
      ...visits.map(visit => ({
        type: 'visit',
        id: visit.id,
        coffeeShop: visit.coffeeShop,
        rating: visit.rating,
        createdAt: visit.visitDate
      })),
      ...collections.map(collection => ({
        type: 'collection',
        id: collection.id,
        name: collection.name,
        createdAt: collection.createdAt
      })),
      ...favorites.map(favorite => ({
        type: 'favorite',
        id: favorite.id,
        coffeeShop: favorite.coffeeShop,
        createdAt: favorite.createdAt
      }))
    ];

    // Sort by date and limit
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const recentActivities = activities.slice(0, limit);

    console.log('✅ Activity fetched successfully:', recentActivities.length, 'items');
    res.json(recentActivities);
  } catch (error) {
    console.error('❌ Error fetching user activity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/users/profile - Delete user account
router.delete('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    console.log('🗑️ Deleting user account:', userId);

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id: userId }
    });

    console.log('✅ User account deleted successfully');
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting user account:', error);
    res.status(500).json({ message: 'Failed to delete account' });
  }
});

// Test endpoint to verify the route is working
router.get('/test', (req, res) => {
  res.json({ 
    message: 'User routes are working!',
    timestamp: new Date().toISOString()
  });
});

export default router;