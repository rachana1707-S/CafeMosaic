import prisma from '../config/db.js';

// Simple validation helper functions
const validateCreateReview = (data) => {
  const errors = [];
  
  if (!data.coffeeShopId || !Number.isInteger(Number(data.coffeeShopId))) {
    errors.push({ field: 'coffeeShopId', message: 'Valid coffee shop ID is required' });
  }
  
  if (!data.rating || data.rating < 1 || data.rating > 5) {
    errors.push({ field: 'rating', message: 'Rating must be between 1 and 5' });
  }
  
  if (!data.comment || data.comment.trim().length === 0) {
    errors.push({ field: 'comment', message: 'Comment is required' });
  } else if (data.comment.length > 1000) {
    errors.push({ field: 'comment', message: 'Comment must be less than 1000 characters' });
  }
  
  if (data.title && data.title.length > 100) {
    errors.push({ field: 'title', message: 'Title must be less than 100 characters' });
  }
  
  return { isValid: errors.length === 0, errors };
};

const validateUpdateReview = (data) => {
  const errors = [];
  
  if (data.rating && (data.rating < 1 || data.rating > 5)) {
    errors.push({ field: 'rating', message: 'Rating must be between 1 and 5' });
  }
  
  if (data.comment && data.comment.length > 1000) {
    errors.push({ field: 'comment', message: 'Comment must be less than 1000 characters' });
  }
  
  if (data.title && data.title.length > 100) {
    errors.push({ field: 'title', message: 'Title must be less than 100 characters' });
  }
  
  return { isValid: errors.length === 0, errors };
};

// Get all reviews (public endpoint)
const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20, sortBy = 'newest', minRating, category } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where = {};
    if (minRating) {
      where.rating = { gte: parseInt(minRating) };
    }

    // Build orderBy clause
    let orderBy = {};
    switch (sortBy) {
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'highest_rating':
        orderBy = { rating: 'desc' };
        break;
      case 'lowest_rating':
        orderBy = { rating: 'asc' };
        break;
      case 'most_helpful':
        orderBy = { helpfulCount: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const reviews = await prisma.userReview.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            _count: {
              select: { reviews: true }
            }
          }
        },
        coffeeShop: {
          select: {
            id: true,
            name: true,
            address: true,
            imageUrl: true,
            rating: true,
            city: true,
            state: true,
            categories: {
              include: {
                category: true
              }
            }
          }
        }
      },
      orderBy,
      skip,
      take: parseInt(limit)
    });

    // Transform the data to match frontend expectations
    const transformedReviews = reviews.map(review => ({
      id: review.id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      visitDate: review.visitDate,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      isRecommended: review.isRecommended,
      helpfulCount: 0, // You can implement this later
      photos: [], // You can implement photo uploads later
      user: {
        id: review.user.id,
        username: review.user.username,
        reviewCount: review.user._count.reviews
      },
      coffeeShop: {
        id: review.coffeeShop.id,
        name: review.coffeeShop.name,
        address: review.coffeeShop.address,
        imageUrl: review.coffeeShop.imageUrl,
        rating: review.coffeeShop.rating,
        category: review.coffeeShop.categories[0]?.category?.name || 'catering.restaurant'
      }
    }));

    // Get total count for pagination
    const totalReviews = await prisma.userReview.count({ where });

    res.json({
      reviews: transformedReviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalReviews / parseInt(limit)),
        totalReviews,
        hasNext: skip + transformedReviews.length < totalReviews,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Error fetching all reviews:', error);
    res.status(500).json({ 
      message: 'Failed to fetch reviews',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get reviews for a specific coffee shop
const getCoffeeShopReviews = async (req, res) => {
  try {
    const { coffeeShopId } = req.params;
    const { page = 1, limit = 10, sortBy = 'newest' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build orderBy clause
    let orderBy = {};
    switch (sortBy) {
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'highest_rating':
        orderBy = { rating: 'desc' };
        break;
      case 'lowest_rating':
        orderBy = { rating: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const reviews = await prisma.userReview.findMany({
      where: {
        coffeeShopId: parseInt(coffeeShopId)
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            _count: {
              select: { reviews: true }
            }
          }
        }
      },
      orderBy,
      skip,
      take: parseInt(limit)
    });

    // Transform the data
    const transformedReviews = reviews.map(review => ({
      id: review.id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      visitDate: review.visitDate,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      isRecommended: review.isRecommended,
      user: {
        id: review.user.id,
        username: review.user.username,
        reviewCount: review.user._count.reviews
      }
    }));

    // Get total count
    const totalReviews = await prisma.userReview.count({
      where: { coffeeShopId: parseInt(coffeeShopId) }
    });

    res.json({
      reviews: transformedReviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalReviews / parseInt(limit)),
        totalReviews,
        hasNext: skip + transformedReviews.length < totalReviews,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Error fetching coffee shop reviews:', error);
    res.status(500).json({ 
      message: 'Failed to fetch coffee shop reviews',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get user's reviews
const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, sortBy = 'newest' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build orderBy clause
    let orderBy = {};
    switch (sortBy) {
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'highest_rating':
        orderBy = { rating: 'desc' };
        break;
      case 'lowest_rating':
        orderBy = { rating: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const reviews = await prisma.userReview.findMany({
      where: {
        userId: userId
      },
      include: {
        coffeeShop: {
          select: {
            id: true,
            name: true,
            address: true,
            imageUrl: true,
            rating: true,
            city: true,
            state: true,
            categories: {
              include: {
                category: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            name: true
          }
        }
      },
      orderBy,
      skip,
      take: parseInt(limit)
    });

    // Transform the data
    const transformedReviews = reviews.map(review => ({
      id: review.id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      visitDate: review.visitDate,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      isRecommended: review.isRecommended,
      coffeeShopId: review.coffeeShopId,
      coffeeShop: {
        id: review.coffeeShop.id,
        name: review.coffeeShop.name,
        address: review.coffeeShop.address,
        imageUrl: review.coffeeShop.imageUrl,
        rating: review.coffeeShop.rating,
        city: review.coffeeShop.city,
        state: review.coffeeShop.state,
        category: review.coffeeShop.categories[0]?.category?.name || 'catering.restaurant'
      },
      user: {
        id: review.user.id,
        username: review.user.username
      }
    }));

    // Get total count
    const totalReviews = await prisma.userReview.count({
      where: { userId: userId }
    });

    res.json({
      reviews: transformedReviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalReviews / parseInt(limit)),
        totalReviews,
        hasNext: skip + transformedReviews.length < totalReviews,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ 
      message: 'Failed to fetch your reviews',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Create a review with coffee shop data (for places not in database yet)
const createReviewWithPlace = async (req, res) => {
  try {
    const userId = req.user.id;
    const { coffeeShopData, rating, title, comment, visitDate, isRecommended = true } = req.body;
    
    // Validate review input
    const validation = validateCreateReview({
      coffeeShopId: 1, // Dummy for validation
      rating,
      title,
      comment,
      visitDate,
      isRecommended
    });
    
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: 'Invalid review data',
        errors: validation.errors
      });
    }

    // Validate coffee shop data
    if (!coffeeShopData || !coffeeShopData.name || !coffeeShopData.address) {
      return res.status(400).json({ 
        message: 'Coffee shop name and address are required' 
      });
    }

    let coffeeShop;

    // Check if coffee shop already exists by placeId
    const existingShop = await prisma.coffeeShop.findUnique({
      where: { placeId: coffeeShopData.placeId }
    });

    if (existingShop) {
      coffeeShop = existingShop;
      console.log("Using existing coffee shop:", coffeeShop.id);
    } else {
      // Create the coffee shop (allowed for review submission)
      coffeeShop = await prisma.coffeeShop.create({
        data: {
          placeId: coffeeShopData.placeId,
          name: coffeeShopData.name,
          address: coffeeShopData.address,
          latitude: parseFloat(coffeeShopData.latitude) || 42.3601,
          longitude: parseFloat(coffeeShopData.longitude) || -71.0589,
          phone: coffeeShopData.phone,
          website: coffeeShopData.website,
          imageUrl: coffeeShopData.imageUrl,
          rating: parseFloat(coffeeShopData.rating) || null,
          priceLevel: parseInt(coffeeShopData.priceLevel) || null,
          city: coffeeShopData.city,
          state: coffeeShopData.state,
          country: coffeeShopData.country || 'US',
          source: 'User_Review'
        }
      });
      console.log("Created new coffee shop:", coffeeShop.id);
    }

    // Check if user already reviewed this coffee shop
    const existingReview = await prisma.userReview.findUnique({
      where: {
        userId_coffeeShopId: {
          userId: userId,
          coffeeShopId: coffeeShop.id
        }
      }
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this place. You can update your existing review instead.' 
      });
    }

    // Create the review
    const review = await prisma.userReview.create({
      data: {
        userId,
        coffeeShopId: coffeeShop.id,
        rating: parseInt(rating),
        title: title || null,
        comment: comment.trim(),
        visitDate: visitDate ? new Date(visitDate) : null,
        isRecommended: isRecommended
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true
          }
        },
        coffeeShop: {
          select: {
            id: true,
            name: true,
            address: true,
            imageUrl: true,
            rating: true
          }
        }
      }
    });

    // Update coffee shop average rating
    await updateCoffeeShopRating(coffeeShop.id);

    // Transform response
    const transformedReview = {
      id: review.id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      visitDate: review.visitDate,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      isRecommended: review.isRecommended,
      user: review.user,
      coffeeShop: review.coffeeShop
    };

    res.status(201).json({
      message: 'Review and coffee shop created successfully',
      review: transformedReview,
      coffeeShop: coffeeShop
    });

  } catch (error) {
    console.error('Error creating review with place:', error);
    res.status(500).json({ 
      message: 'Failed to create review',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Create a new review (original function)
const createReview = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Validate input
    const validation = validateCreateReview(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: 'Invalid input data',
        errors: validation.errors
      });
    }

    const { coffeeShopId, rating, title, comment, visitDate, isRecommended = true } = req.body;

    // Check if coffee shop exists
    const coffeeShop = await prisma.coffeeShop.findUnique({
      where: { id: parseInt(coffeeShopId) }
    });

    if (!coffeeShop) {
      return res.status(404).json({ message: 'Coffee shop not found' });
    }

    // Check if user already reviewed this coffee shop
    const existingReview = await prisma.userReview.findUnique({
      where: {
        userId_coffeeShopId: {
          userId: userId,
          coffeeShopId: parseInt(coffeeShopId)
        }
      }
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this coffee shop. You can update your existing review instead.' 
      });
    }

    // Create the review
    const review = await prisma.userReview.create({
      data: {
        userId,
        coffeeShopId: parseInt(coffeeShopId),
        rating: parseInt(rating),
        title: title || null,
        comment: comment.trim(),
        visitDate: visitDate ? new Date(visitDate) : null,
        isRecommended: isRecommended
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true
          }
        },
        coffeeShop: {
          select: {
            id: true,
            name: true,
            address: true,
            imageUrl: true,
            rating: true
          }
        }
      }
    });

    // Update coffee shop average rating
    await updateCoffeeShopRating(parseInt(coffeeShopId));

    // Transform response
    const transformedReview = {
      id: review.id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      visitDate: review.visitDate,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      isRecommended: review.isRecommended,
      user: review.user,
      coffeeShop: review.coffeeShop
    };

    res.status(201).json({
      message: 'Review created successfully',
      review: transformedReview
    });

  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ 
      message: 'Failed to create review',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;
    
    // Validate input
    const validation = validateUpdateReview(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: 'Invalid input data',
        errors: validation.errors
      });
    }

    const { rating, title, comment, visitDate, isRecommended } = req.body;

    // Check if review exists and belongs to user
    const existingReview = await prisma.userReview.findFirst({
      where: {
        id: parseInt(reviewId),
        userId: userId
      }
    });

    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found or you do not have permission to update it' });
    }

    // Prepare update data
    const updateData = {};
    if (rating !== undefined) updateData.rating = parseInt(rating);
    if (title !== undefined) updateData.title = title;
    if (comment !== undefined) updateData.comment = comment.trim();
    if (visitDate !== undefined) updateData.visitDate = visitDate ? new Date(visitDate) : null;
    if (isRecommended !== undefined) updateData.isRecommended = isRecommended;
    updateData.updatedAt = new Date();

    // Update the review
    const updatedReview = await prisma.userReview.update({
      where: { id: parseInt(reviewId) },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true
          }
        },
        coffeeShop: {
          select: {
            id: true,
            name: true,
            address: true,
            imageUrl: true,
            rating: true
          }
        }
      }
    });

    // Update coffee shop average rating
    await updateCoffeeShopRating(existingReview.coffeeShopId);

    // Transform response
    const transformedReview = {
      id: updatedReview.id,
      rating: updatedReview.rating,
      title: updatedReview.title,
      comment: updatedReview.comment,
      visitDate: updatedReview.visitDate,
      createdAt: updatedReview.createdAt,
      updatedAt: updatedReview.updatedAt,
      isRecommended: updatedReview.isRecommended,
      user: updatedReview.user,
      coffeeShop: updatedReview.coffeeShop
    };

    res.json({
      message: 'Review updated successfully',
      review: transformedReview
    });

  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ 
      message: 'Failed to update review',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    // Check if review exists and belongs to user
    const existingReview = await prisma.userReview.findFirst({
      where: {
        id: parseInt(reviewId),
        userId: userId
      }
    });

    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found or you do not have permission to delete it' });
    }

    const coffeeShopId = existingReview.coffeeShopId;

    // Delete the review
    await prisma.userReview.delete({
      where: { id: parseInt(reviewId) }
    });

    // Update coffee shop average rating
    await updateCoffeeShopRating(coffeeShopId);

    res.json({ message: 'Review deleted successfully' });

  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ 
      message: 'Failed to delete review',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get a single review
const getReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await prisma.userReview.findUnique({
      where: { id: parseInt(reviewId) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            _count: {
              select: { reviews: true }
            }
          }
        },
        coffeeShop: {
          select: {
            id: true,
            name: true,
            address: true,
            imageUrl: true,
            rating: true,
            city: true,
            state: true,
            categories: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Transform response
    const transformedReview = {
      id: review.id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      visitDate: review.visitDate,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      isRecommended: review.isRecommended,
      user: {
        id: review.user.id,
        username: review.user.username,
        reviewCount: review.user._count.reviews
      },
      coffeeShop: {
        id: review.coffeeShop.id,
        name: review.coffeeShop.name,
        address: review.coffeeShop.address,
        imageUrl: review.coffeeShop.imageUrl,
        rating: review.coffeeShop.rating,
        city: review.coffeeShop.city,
        state: review.coffeeShop.state,
        category: review.coffeeShop.categories[0]?.category?.name || 'catering.restaurant'
      }
    };

    res.json(transformedReview);

  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ 
      message: 'Failed to fetch review',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Mark review as helpful (future feature)
const markReviewHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    // For now, just return success - implement helpful tracking later
    res.json({ 
      message: 'Review marked as helpful',
      helpfulCount: Math.floor(Math.random() * 10) + 1 // Mock data for now
    });

  } catch (error) {
    console.error('Error marking review as helpful:', error);
    res.status(500).json({ 
      message: 'Failed to mark review as helpful',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Helper function to update coffee shop average rating
async function updateCoffeeShopRating(coffeeShopId) {
  try {
    const reviews = await prisma.userReview.findMany({
      where: { coffeeShopId: coffeeShopId },
      select: { rating: true }
    });

    if (reviews.length > 0) {
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      
      await prisma.coffeeShop.update({
        where: { id: coffeeShopId },
        data: { rating: parseFloat(averageRating.toFixed(1)) }
      });
    } else {
      // If no reviews, set rating to null
      await prisma.coffeeShop.update({
        where: { id: coffeeShopId },
        data: { rating: null }
      });
    }
  } catch (error) {
    console.error('Error updating coffee shop rating:', error);
    // Don't throw error - this is a background task
  }
}

// Export all functions
export {
  getAllReviews,
  getCoffeeShopReviews,
  getUserReviews,
  createReview,
  createReviewWithPlace,
  updateReview,
  deleteReview,
  getReview,
  markReviewHelpful
};