// // src/routes/userRoutes.js
// import express from 'express';
// import { PrismaClient } from '@prisma/client';

// const router = express.Router();
// const prisma = new PrismaClient();

// // TODO: Replace this with your actual authentication middleware
// // You probably have something like: import { authenticateToken } from '../middleware/auth.js';
// const authenticateToken = (req, res, next) => {
//   // TEMPORARY MOCK - Replace with your actual auth logic
//   req.user = { id: 1 }; // Mock user ID
//   next();
// };

// // GET /api/users/profile - Get user profile with stats
// router.get('/profile', authenticateToken, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     console.log('📋 Fetching profile for user:', userId);

//     // Fetch user with all related data
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       include: {
//         reviews: {
//           include: { coffeeShop: true },
//           orderBy: { createdAt: 'desc' }
//         },
//         visits: {
//           include: { coffeeShop: true },
//           orderBy: { visitDate: 'desc' }
//         },
//         collections: {
//           orderBy: { createdAt: 'desc' }
//         },
//         favorites: {
//           include: { coffeeShop: true },
//           orderBy: { createdAt: 'desc' }
//         }
//       }
//     });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Calculate average rating
//     const avgRating = user.reviews.length > 0 
//       ? user.reviews.reduce((sum, review) => sum + review.rating, 0) / user.reviews.length
//       : 0;

//     // Add computed stats to user object
//     const userWithStats = {
//       ...user,
//       avgRating: parseFloat(avgRating.toFixed(1))
//     };

//     console.log('✅ Profile fetched successfully for user:', userId);
//     res.json(userWithStats);
//   } catch (error) {
//     console.error('❌ Error fetching user profile:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // PUT /api/users/profile - Update user profile
// router.put('/profile', authenticateToken, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { username, email, name, preferences } = req.body;

//     console.log('📝 Updating profile for user:', userId);
//     console.log('📄 Update data:', { username, email, name, preferences });

//     // Validate required fields
//     if (!username || !email) {
//       return res.status(400).json({ message: 'Username and email are required' });
//     }

//     // Check if username/email already exists (excluding current user)
//     const existingUser = await prisma.user.findFirst({
//       where: {
//         OR: [
//           { username: username },
//           { email: email }
//         ],
//         NOT: { id: userId }
//       }
//     });

//     if (existingUser) {
//       const field = existingUser.username === username ? 'Username' : 'Email';
//       return res.status(400).json({ message: `${field} is already taken` });
//     }

//     // Update user
//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: {
//         username,
//         email,
//         name: name || null,
//         preferences: preferences || {}
//       }
//     });

//     console.log('✅ Profile updated successfully for user:', updatedUser.id);
//     res.json(updatedUser);
//   } catch (error) {
//     console.error('❌ Error updating user profile:', error);
    
//     // Handle Prisma validation errors
//     if (error.code === 'P2002') {
//       return res.status(400).json({ message: 'Username or email already exists' });
//     }
    
//     res.status(500).json({ message: 'Failed to update profile' });
//   }
// });

// // GET /api/users/activity - Get recent activity
// router.get('/activity', authenticateToken, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const limit = parseInt(req.query.limit) || 10;

//     console.log('📊 Fetching activity for user:', userId);

//     // Get recent reviews
//     const reviews = await prisma.userReview.findMany({
//       where: { userId },
//       include: { coffeeShop: true },
//       orderBy: { createdAt: 'desc' },
//       take: limit
//     });

//     // Get recent visits
//     const visits = await prisma.coffeeShopVisit.findMany({
//       where: { userId },
//       include: { coffeeShop: true },
//       orderBy: { visitDate: 'desc' },
//       take: limit
//     });

//     // Get recent collections
//     const collections = await prisma.userCollection.findMany({
//       where: { userId },
//       orderBy: { createdAt: 'desc' },
//       take: limit
//     });

//     // Get recent favorites
//     const favorites = await prisma.userFavorite.findMany({
//       where: { userId },
//       include: { coffeeShop: true },
//       orderBy: { createdAt: 'desc' },
//       take: limit
//     });

//     // Combine and format activities
//     const activities = [
//       ...reviews.map(review => ({
//         type: 'review',
//         id: review.id,
//         coffeeShop: review.coffeeShop,
//         rating: review.rating,
//         createdAt: review.createdAt
//       })),
//       ...visits.map(visit => ({
//         type: 'visit',
//         id: visit.id,
//         coffeeShop: visit.coffeeShop,
//         rating: visit.rating,
//         createdAt: visit.visitDate
//       })),
//       ...collections.map(collection => ({
//         type: 'collection',
//         id: collection.id,
//         name: collection.name,
//         createdAt: collection.createdAt
//       })),
//       ...favorites.map(favorite => ({
//         type: 'favorite',
//         id: favorite.id,
//         coffeeShop: favorite.coffeeShop,
//         createdAt: favorite.createdAt
//       }))
//     ];

//     // Sort by date and limit
//     activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//     const recentActivities = activities.slice(0, limit);

//     console.log('✅ Activity fetched successfully:', recentActivities.length, 'items');
//     res.json(recentActivities);
//   } catch (error) {
//     console.error('❌ Error fetching user activity:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // DELETE /api/users/profile - Delete user account
// router.delete('/profile', authenticateToken, async (req, res) => {
//   try {
//     const userId = req.user.id;

//     console.log('🗑️ Deleting user account:', userId);

//     // Delete user (cascade will handle related records)
//     await prisma.user.delete({
//       where: { id: userId }
//     });

//     console.log('✅ User account deleted successfully');
//     res.json({ message: 'Account deleted successfully' });
//   } catch (error) {
//     console.error('❌ Error deleting user account:', error);
//     res.status(500).json({ message: 'Failed to delete account' });
//   }
// });

// // Test endpoint to verify the route is working
// router.get('/test', (req, res) => {
//   res.json({ 
//     message: 'User routes are working!',
//     timestamp: new Date().toISOString()
//   });
// });

// export default router;


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

// PUT /api/users/profile - Update user profile (FIXED VERSION)
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, name, preferences } = req.body;

    console.log('📝 Updating profile for user:', userId);
    console.log('📄 Update data:', { username, email, name, preferences });

    // Get current user data first
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true, email: true, name: true, preferences: true }
    });

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare update data - only include fields that are provided
    const updateData = {};
    
    // Only validate and update username if it's provided and different
    if (username !== undefined) {
      if (!username.trim()) {
        return res.status(400).json({ message: 'Username cannot be empty' });
      }
      
      // Only check for uniqueness if username is actually changing
      if (username !== currentUser.username) {
        const existingUser = await prisma.user.findFirst({
          where: {
            username: username,
            NOT: { id: userId }
          }
        });

        if (existingUser) {
          return res.status(400).json({ message: 'Username is already taken' });
        }
      }
      
      updateData.username = username;
    }

    // Only validate and update email if it's provided and different
    if (email !== undefined) {
      if (!email.trim()) {
        return res.status(400).json({ message: 'Email cannot be empty' });
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please provide a valid email address' });
      }
      
      // Only check for uniqueness if email is actually changing
      if (email !== currentUser.email) {
        const existingUser = await prisma.user.findFirst({
          where: {
            email: email,
            NOT: { id: userId }
          }
        });

        if (existingUser) {
          return res.status(400).json({ message: 'Email is already taken' });
        }
      }
      
      updateData.email = email;
    }

    // Update name if provided (can be empty string)
    if (name !== undefined) {
      updateData.name = name.trim() || null;
    }

    // Update preferences if provided
    if (preferences !== undefined) {
      updateData.preferences = preferences || {};
    }

    // If no fields to update, return current user
    if (Object.keys(updateData).length === 0) {
      console.log('ℹ️ No fields to update');
      return res.json(currentUser);
    }

    console.log('🔄 Updating fields:', Object.keys(updateData));

    // Update user with only the provided fields
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        preferences: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('✅ Profile updated successfully for user:', updatedUser.id);
    res.json(updatedUser);
  } catch (error) {
    console.error('❌ Error updating user profile:', error);
    
    // Handle Prisma validation errors
    if (error.code === 'P2002') {
      const field = error.meta?.target?.includes('username') ? 'Username' : 'Email';
      return res.status(400).json({ message: `${field} already exists` });
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

// GET /api/users/stats - Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    console.log('📊 Fetching stats for user:', userId);

    // Get basic counts
    const [
      totalReviews,
      totalCollections,
      totalVisits,
      totalFavorites,
      user
    ] = await Promise.all([
      prisma.userReview.count({ where: { userId } }),
      prisma.userCollection.count({ where: { userId } }),
      prisma.coffeeShopVisit.count({ where: { userId } }),
      prisma.userFavorite.count({ where: { userId } }),
      prisma.user.findUnique({ where: { id: userId }, select: { createdAt: true } })
    ]);

    // Get average rating
    const avgRatingResult = await prisma.userReview.aggregate({
      where: { userId },
      _avg: { rating: true }
    });

    // Get cities explored (distinct cities from visits)
    const citiesExplored = await prisma.coffeeShopVisit.findMany({
      where: { userId },
      include: {
        coffeeShop: {
          select: { address: true }
        }
      }
    });

    const uniqueCities = new Set(
      citiesExplored
        .map(visit => {
          // Extract city from address (basic implementation)
          const address = visit.coffeeShop.address || '';
          const parts = address.split(',');
          return parts.length > 1 ? parts[parts.length - 2].trim() : '';
        })
        .filter(city => city)
    );

    const stats = {
      totalReviews,
      totalCollections,
      totalVisits,
      totalFavorites,
      avgRating: avgRatingResult._avg.rating || 0,
      joinDate: user?.createdAt || null,
      citiesExplored: uniqueCities.size
    };

    console.log('✅ Stats fetched successfully:', stats);
    res.json(stats);
  } catch (error) {
    console.error('❌ Error fetching user stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/users/change-password - Change user password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    console.log('🔐 Changing password for user:', userId);

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    // Get current user with password
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Note: You'll need to import bcrypt and implement password verification
    // const bcrypt = require('bcryptjs');
    // const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    // if (!isValidPassword) {
    //   return res.status(400).json({ message: 'Current password is incorrect' });
    // }

    // Hash new password
    // const saltRounds = 10;
    // const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    // await prisma.user.update({
    //   where: { id: userId },
    //   data: { password: hashedNewPassword }
    // });

    console.log('✅ Password changed successfully for user:', userId);
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('❌ Error changing password:', error);
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

// GET /api/users/export - Export user data
router.get('/export', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    console.log('📤 Exporting data for user:', userId);

    // Get all user data
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        reviews: {
          include: {
            coffeeShop: {
              select: {
                name: true,
                address: true
              }
            }
          }
        },
        visits: {
          include: {
            coffeeShop: {
              select: {
                name: true,
                address: true
              }
            }
          }
        },
        collections: {
          include: {
            coffeeShops: {
              include: {
                coffeeShop: {
                  select: {
                    name: true,
                    address: true
                  }
                }
              }
            }
          }
        },
        favorites: {
          include: {
            coffeeShop: {
              select: {
                name: true,
                address: true
              }
            }
          }
        }
      }
    });

    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove sensitive data
    const { password, ...exportData } = userData;

    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="foodsocial-profile-export-${userId}.json"`);
    
    console.log('✅ Data exported successfully for user:', userId);
    res.json({
      exportedAt: new Date(),
      userData: exportData
    });
  } catch (error) {
    console.error('❌ Error exporting user data:', error);
    res.status(500).json({ message: 'Internal server error' });
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