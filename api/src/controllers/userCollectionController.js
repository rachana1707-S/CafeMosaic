// ===== FILE: controllers/userCollectionController.js =====
import prisma from "../config/db.js";

// Get all collections for a specific user
export const getCollectionsByUser = async (req, res) => {
  const userId = parseInt(req.params.userId);
  if (!Number.isInteger(userId)) {
    return res.status(400).json({ message: "Invalid user ID." });
  }

  try {
    const collections = await prisma.userCollection.findMany({
      where: { userId },
      include: { 
        coffeeShops: { 
          include: { coffeeShop: true },
          orderBy: { order: 'asc' }
        },
        _count: { select: { coffeeShops: true } }
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(collections);
  } catch (err) {
    console.error("Error fetching collections:", err);
    res.status(500).json({ message: "Failed to fetch collections." });
  }
};

// Get a single collection
export const getSingleCollection = async (req, res) => {
  const id = parseInt(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid collection ID." });
  }

  try {
    const collection = await prisma.userCollection.findUnique({
      where: { id },
      include: { 
        coffeeShops: { 
          include: { coffeeShop: true },
          orderBy: { order: 'asc' }
        },
        user: { select: { username: true } }
      },
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found." });
    }

    res.json(collection);
  } catch (err) {
    console.error("Error fetching collection:", err);
    res.status(500).json({ message: "Failed to fetch collection." });
  }
};

// Create a new collection
export const createCollection = async (req, res) => {
  const { name, description, isPublic = false, color } = req.body;
  const userId = req.user?.id;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Collection name is required." });
  }

  try {
    const newCollection = await prisma.userCollection.create({
      data: {
        name,
        description: description || "",
        isPublic: Boolean(isPublic),
        color: color || null,
        user: { connect: { id: userId } },
      },
    });
    res.status(201).json(newCollection);
  } catch (err) {
    console.error("Error creating collection:", err);
    res.status(500).json({ message: "Failed to create collection." });
  }
};

// Add a coffee shop to a collection
export const addCoffeeShopToCollection = async (req, res) => {
  const collectionId = parseInt(req.params.collectionId);
  const { coffeeShopId, notes, order = 0 } = req.body;

  if (!Number.isInteger(collectionId)) {
    return res.status(400).json({ message: "Invalid collection ID." });
  }

  if (!coffeeShopId) {
    return res.status(400).json({ message: "Coffee shop ID is required." });
  }

  try {
    // Check if coffee shop is already in collection
    const existing = await prisma.collectionCoffeeShop.findUnique({
      where: {
        collectionId_coffeeShopId: {
          collectionId,
          coffeeShopId: parseInt(coffeeShopId)
        }
      }
    });

    if (existing) {
      return res.status(400).json({ message: "Coffee shop already in collection." });
    }

    const newEntry = await prisma.collectionCoffeeShop.create({
      data: {
        collectionId,
        coffeeShopId: parseInt(coffeeShopId),
        notes: notes || null,
        order: parseInt(order) || 0,
      },
    });
    res.status(201).json(newEntry);
  } catch (err) {
    console.error("Error adding coffee shop to collection:", err);
    res.status(500).json({ message: "Failed to add coffee shop to collection." });
  }
};

// Update a collection
export const updateCollection = async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description, isPublic, color } = req.body;

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid collection ID." });
  }

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Collection name is required." });
  }

  try {
    const updatedCollection = await prisma.userCollection.update({
      where: { id },
      data: { 
        name, 
        description: description || "", 
        isPublic: isPublic !== undefined ? Boolean(isPublic) : undefined,
        color: color || undefined
      },
    });
    res.json(updatedCollection);
  } catch (err) {
    console.error("Error updating collection:", err);
    res.status(500).json({ message: "Failed to update collection." });
  }
};

// Delete a collection
export const deleteCollection = async (req, res) => {
  const id = parseInt(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid collection ID." });
  }

  try {
    await prisma.userCollection.delete({ where: { id } });
    res.json({ message: "Collection deleted successfully." });
  } catch (err) {
    console.error("Error deleting collection:", err);
    res.status(500).json({ message: "Failed to delete collection." });
  }
};

// Remove coffee shop from collection
export const removeCoffeeShopFromCollection = async (req, res) => {
  const id = parseInt(req.params.id); // CollectionCoffeeShop ID

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid ID." });
  }

  try {
    await prisma.collectionCoffeeShop.delete({ where: { id } });
    res.json({ message: "Coffee shop removed from collection successfully." });
  } catch (err) {
    console.error("Error removing coffee shop from collection:", err);
    res.status(500).json({ message: "Failed to remove coffee shop from collection." });
  }
};