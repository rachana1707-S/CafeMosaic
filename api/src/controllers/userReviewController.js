// ===== FILE: controllers/userReviewController.js =====
import prisma from "../config/db.js";

// Get all reviews for a specific coffee shop
export const getReviewsByCoffeeShop = async (req, res) => {
  const coffeeShopId = parseInt(req.params.coffeeShopId);
  
  if (!Number.isInteger(coffeeShopId)) {
    return res.status(400).json({ message: "Invalid coffee shop ID." });
  }

  try {
    const reviews = await prisma.userReview.findMany({
      where: { coffeeShopId },
      include: { 
        user: { select: { username: true } },
        coffeeShop: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: "Failed to fetch reviews." });
  }
};

// Get all reviews by a specific user
export const getReviewsByUser = async (req, res) => {
  const userId = parseInt(req.params.userId);
  
  if (!Number.isInteger(userId)) {
    return res.status(400).json({ message: "Invalid user ID." });
  }

  try {
    const reviews = await prisma.userReview.findMany({
      where: { userId },
      include: { 
        coffeeShop: { select: { name: true, address: true, imageUrl: true } }
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(reviews);
  } catch (err) {
    console.error("Error fetching user reviews:", err);
    res.status(500).json({ message: "Failed to fetch user reviews." });
  }
};

// Create or update a review
export const createOrUpdateReview = async (req, res) => {
  const { coffeeShopId, rating, title, comment, visitDate, isRecommended = true } = req.body;
  const userId = req.user?.id;

  if (!coffeeShopId || !rating) {
    return res.status(400).json({ message: "Coffee shop ID and rating are required." });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }

  try {
    const reviewData = {
      rating: parseInt(rating),
      title: title || null,
      comment: comment || null,
      visitDate: visitDate ? new Date(visitDate) : null,
      isRecommended: Boolean(isRecommended),
    };

    const review = await prisma.userReview.upsert({
      where: {
        userId_coffeeShopId: {
          userId,
          coffeeShopId: parseInt(coffeeShopId)
        }
      },
      update: reviewData,
      create: {
        userId,
        coffeeShopId: parseInt(coffeeShopId),
        ...reviewData
      },
      include: {
        user: { select: { username: true } },
        coffeeShop: { select: { name: true } }
      }
    });

    res.status(200).json(review);
  } catch (err) {
    console.error("Error creating/updating review:", err);
    res.status(500).json({ message: "Failed to create/update review." });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  const id = parseInt(req.params.id);
  const userId = req.user?.id;

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid review ID." });
  }

  try {
    const review = await prisma.userReview.findUnique({
      where: { id }
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    if (review.userId !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this review." });
    }

    await prisma.userReview.delete({ where: { id } });
    res.json({ message: "Review deleted successfully." });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ message: "Failed to delete review." });
  }
};