const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID comes from auth middleware

    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, name, preferences } = req.body;

    // Check if username or email already exists (if changed)
    const existingUser = await prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: userId } },
          {
            OR: [
              { username: username },
              { email: email }
            ]
          }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.username === username ? 'Username already taken' : 'Email already in use' 
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        email,
        name,
        preferences: preferences || {}
      },
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

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete user profile
const deleteUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete user and all related data (cascade will handle most relations)
    await prisma.user.delete({
      where: { id: userId }
    });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

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
          select: { city: true }
        }
      }
    });

    const uniqueCities = new Set(
      citiesExplored
        .map(visit => visit.coffeeShop.city)
        .filter(city => city)
    );

    // Get favorite coffee shops (top rated by user with rating >= 4)
    const favoriteShops = await prisma.userReview.findMany({
      where: {
        userId,
        rating: { gte: 4 }
      },
      include: {
        coffeeShop: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true
          }
        }
      },
      orderBy: { rating: 'desc' },
      take: 6
    });

    const favoriteCoffeeShops = favoriteShops.map(review => ({
      id: review.coffeeShop.id,
      name: review.coffeeShop.name,
      address: review.coffeeShop.address,
      city: review.coffeeShop.city,
      state: review.coffeeShop.state,
      rating: review.rating
    }));

    const stats = {
      totalReviews,
      totalCollections,
      totalVisits,
      totalFavorites,
      avgRating: avgRatingResult._avg.rating || 0,
      joinDate: user?.createdAt || null,
      citiesExplored: uniqueCities.size,
      favoriteCoffeeShops
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user recent activity
const getUserActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    // Get recent reviews
    const recentReviews = await prisma.userReview.findMany({
      where: { userId },
      include: {
        coffeeShop: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    // Get recent visits
    const recentVisits = await prisma.coffeeShopVisit.findMany({
      where: { userId },
      include: {
        coffeeShop: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    // Get recent collections
    const recentCollections = await prisma.userCollection.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    // Get recent favorites
    const recentFavorites = await prisma.userFavorite.findMany({
      where: { userId },
      include: {
        coffeeShop: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    // Combine and format all activities
    const activities = [
      ...recentReviews.map(review => ({
        type: 'review',
        coffeeShopName: review.coffeeShop.name,
        rating: review.rating,
        createdAt: review.createdAt,
        id: review.id
      })),
      ...recentVisits.map(visit => ({
        type: 'visit',
        coffeeShopName: visit.coffeeShop.name,
        rating: visit.rating,
        createdAt: visit.createdAt,
        id: visit.id
      })),
      ...recentCollections.map(collection => ({
        type: 'collection',
        collectionName: collection.name,
        createdAt: collection.createdAt,
        id: collection.id
      })),
      ...recentFavorites.map(favorite => ({
        type: 'favorite',
        coffeeShopName: favorite.coffeeShop.name,
        createdAt: favorite.createdAt,
        id: favorite.id
      }))
    ];

    // Sort by creation date and limit results
    const sortedActivities = activities
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    res.json(sortedActivities);
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

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

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Export user data
const exportUserData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all user data
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        reviews: {
          include: {
            coffeeShop: {
              select: {
                name: true,
                address: true,
                city: true,
                state: true
              }
            }
          }
        },
        visits: {
          include: {
            coffeeShop: {
              select: {
                name: true,
                address: true,
                city: true,
                state: true
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
                    address: true,
                    city: true,
                    state: true
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
                address: true,
                city: true,
                state: true
              }
            }
          }
        },
        searchHistory: true
      }
    });

    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove sensitive data
    const { password, ...exportData } = userData;

    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="coffee-profile-export-${userId}.json"`);
    
    res.json({
      exportedAt: new Date(),
      userData: exportData
    });
  } catch (error) {
    console.error('Error exporting user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getUserStats,
  getUserActivity,
  changePassword,
  exportUserData
};