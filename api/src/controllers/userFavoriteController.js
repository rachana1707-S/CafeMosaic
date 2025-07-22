// ===== FILE: controllers/userFavoriteController.js =====
import prisma from "../config/db.js";

// Get user's favorite coffee shops
export const getUserFavorites = async (req, res) => {
  const userId = parseInt(req.params.userId);
  
  if (!Number.isInteger(userId)) {
    return res.status(400).json({ message: "Invalid user ID." });
  }

  try {
    const favorites = await prisma.userFavorite.findMany({
      where: { userId },
      include: { 
        coffeeShop: {
          include: {
            categories: { include: { category: true } },
            _count: { select: { reviews: true, visits: true } }
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(favorites);
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).json({ message: "Failed to fetch favorites." });
  }
};

// Add coffee shop to favorites
export const addToFavorites = async (req, res) => {
  const { coffeeShopId, notes } = req.body;
  const userId = req.user?.id;

  if (!coffeeShopId) {
    return res.status(400).json({ message: "Coffee shop ID is required." });
  }

  try {
    const favorite = await prisma.userFavorite.create({
      data: {
        userId,
        coffeeShopId: parseInt(coffeeShopId),
        notes: notes || null,
      },
      include: {
        coffeeShop: { select: { name: true, address: true } }
      }
    });

    res.status(201).json(favorite);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ message: "Coffee shop already in favorites." });
    }
    console.error("Error adding to favorites:", err);
    res.status(500).json({ message: "Failed to add to favorites." });
  }
};

// Remove from favorites
export const removeFromFavorites = async (req, res) => {
  const { coffeeShopId } = req.params;
  const userId = req.user?.id;

  if (!coffeeShopId) {
    return res.status(400).json({ message: "Coffee shop ID is required." });
  }

  try {
    await prisma.userFavorite.delete({
      where: {
        userId_coffeeShopId: {
          userId,
          coffeeShopId: parseInt(coffeeShopId)
        }
      }
    });

    res.json({ message: "Removed from favorites successfully." });
  } catch (err) {
    console.error("Error removing from favorites:", err);
    res.status(500).json({ message: "Failed to remove from favorites." });
  }
};

// Update favorite notes
export const updateFavoriteNotes = async (req, res) => {
  const id = parseInt(req.params.id);
  const { notes } = req.body;
  const userId = req.user?.id;

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid favorite ID." });
  }

  try {
    const favorite = await prisma.userFavorite.findUnique({
      where: { id }
    });

    if (!favorite || favorite.userId !== userId) {
      return res.status(404).json({ message: "Favorite not found or not authorized." });
    }

    const updated = await prisma.userFavorite.update({
      where: { id },
      data: { notes: notes || null },
      include: {
        coffeeShop: { select: { name: true } }
      }
    });

    res.json(updated);
  } catch (err) {
    console.error("Error updating favorite notes:", err);
    res.status(500).json({ message: "Failed to update favorite notes." });
  }
};