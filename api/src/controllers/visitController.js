// ===== FILE: controllers/visitController.js =====
import prisma from "../config/db.js";

// Get user's coffee shop visits
export const getUserVisits = async (req, res) => {
  const userId = parseInt(req.params.userId);
  const { limit = 20 } = req.query;
  
  if (!Number.isInteger(userId)) {
    return res.status(400).json({ message: "Invalid user ID." });
  }

  try {
    const visits = await prisma.coffeeShopVisit.findMany({
      where: { userId },
      include: { 
        coffeeShop: {
          select: { 
            id: true, name: true, address: true, 
            imageUrl: true, city: true, state: true 
          }
        }
      },
      orderBy: { visitDate: "desc" },
      take: parseInt(limit)
    });
    res.json(visits);
  } catch (err) {
    console.error("Error fetching visits:", err);
    res.status(500).json({ message: "Failed to fetch visits." });
  }
};

// Log a coffee shop visit
export const logVisit = async (req, res) => {
  const { 
    coffeeShopId, 
    visitDate, 
    notes, 
    photoUrls, 
    rating 
  } = req.body;
  const userId = req.user?.id;

  if (!coffeeShopId) {
    return res.status(400).json({ message: "Coffee shop ID is required." });
  }

  try {
    const visit = await prisma.coffeeShopVisit.create({
      data: {
        userId,
        coffeeShopId: parseInt(coffeeShopId),
        visitDate: visitDate ? new Date(visitDate) : new Date(),
        notes: notes || null,
        photoUrls: photoUrls || null,
        rating: rating ? parseInt(rating) : null,
      },
      include: {
        coffeeShop: { select: { name: true, address: true } }
      }
    });

    res.status(201).json(visit);
  } catch (err) {
    console.error("Error logging visit:", err);
    res.status(500).json({ message: "Failed to log visit." });
  }
};

// Update a visit
export const updateVisit = async (req, res) => {
  const id = parseInt(req.params.id);
  const { visitDate, notes, photoUrls, rating } = req.body;
  const userId = req.user?.id;

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid visit ID." });
  }

  try {
    const visit = await prisma.coffeeShopVisit.findUnique({
      where: { id }
    });

    if (!visit || visit.userId !== userId) {
      return res.status(404).json({ message: "Visit not found or not authorized." });
    }

    const updated = await prisma.coffeeShopVisit.update({
      where: { id },
      data: {
        visitDate: visitDate ? new Date(visitDate) : undefined,
        notes: notes || undefined,
        photoUrls: photoUrls || undefined,
        rating: rating ? parseInt(rating) : undefined,
      },
      include: {
        coffeeShop: { select: { name: true } }
      }
    });

    res.json(updated);
  } catch (err) {
    console.error("Error updating visit:", err);
    res.status(500).json({ message: "Failed to update visit." });
  }
};

// Delete a visit
export const deleteVisit = async (req, res) => {
  const id = parseInt(req.params.id);
  const userId = req.user?.id;

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid visit ID." });
  }

  try {
    const visit = await prisma.coffeeShopVisit.findUnique({
      where: { id }
    });

    if (!visit || visit.userId !== userId) {
      return res.status(404).json({ message: "Visit not found or not authorized." });
    }

    await prisma.coffeeShopVisit.delete({ where: { id } });
    res.json({ message: "Visit deleted successfully." });
  } catch (err) {
    console.error("Error deleting visit:", err);
    res.status(500).json({ message: "Failed to delete visit." });
  }
};

// Get coffee shop visit statistics
export const getVisitStats = async (req, res) => {
  const coffeeShopId = parseInt(req.params.coffeeShopId);
  
  if (!Number.isInteger(coffeeShopId)) {
    return res.status(400).json({ message: "Invalid coffee shop ID." });
  }

  try {
    const stats = await prisma.coffeeShopVisit.aggregate({
      where: { coffeeShopId },
      _count: { id: true },
      _avg: { rating: true }
    });

    const recentVisits = await prisma.coffeeShopVisit.count({
      where: {
        coffeeShopId,
        visitDate: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });

    res.json({
      totalVisits: stats._count.id,
      averageRating: stats._avg.rating,
      recentVisits
    });
  } catch (err) {
    console.error("Error fetching visit stats:", err);
    res.status(500).json({ message: "Failed to fetch visit statistics." });
  }
};