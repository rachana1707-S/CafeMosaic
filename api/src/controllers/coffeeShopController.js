// ===== FILE: controllers/coffeeShopController.js =====
import prisma from "../config/db.js";

// Get all coffee shops with optional filters
export const getCoffeeShops = async (req, res) => {
  const { city, category, rating, limit = 50 } = req.query;

  try {
    const where = {};
    
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (category) where.categories = { some: { category: { name: category } } };
    if (rating) where.rating = { gte: parseFloat(rating) };

    const coffeeShops = await prisma.coffeeShop.findMany({
      where,
      include: {
        categories: { include: { category: true } },
        reviews: { 
          take: 3,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { username: true } } }
        },
        _count: { select: { favorites: true, reviews: true, visits: true } }
      },
      take: parseInt(limit),
      orderBy: { rating: 'desc' }
    });

    res.json(coffeeShops);
  } catch (err) {
    console.error("Error fetching coffee shops:", err);
    res.status(500).json({ message: "Failed to fetch coffee shops." });
  }
};

// Get a single coffee shop by ID
export const getSingleCoffeeShop = async (req, res) => {
  const id = parseInt(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid coffee shop ID." });
  }

  try {
    const coffeeShop = await prisma.coffeeShop.findUnique({
      where: { id },
      include: {
        categories: { include: { category: true } },
        reviews: { 
          include: { user: { select: { username: true } } },
          orderBy: { createdAt: 'desc' }
        },
        visits: {
          include: { user: { select: { username: true } } },
          orderBy: { visitDate: 'desc' },
          take: 10
        },
        _count: { select: { favorites: true, reviews: true, visits: true } }
      }
    });

    if (!coffeeShop) {
      return res.status(404).json({ message: "Coffee shop not found." });
    }

    res.json(coffeeShop);
  } catch (err) {
    console.error("Error fetching coffee shop:", err);
    res.status(500).json({ message: "Failed to fetch coffee shop." });
  }
};

// Create or update a coffee shop (from API data)
export const createCoffeeShop = async (req, res) => {
  const {
    placeId,
    name,
    address,
    latitude,
    longitude,
    phone,
    website,
    imageUrl,
    rating,
    priceLevel,
    openingHours,
    amenities,
    description,
    city,
    state,
    country,
    categories = []
  } = req.body;

  if (!placeId || !name || !address || latitude == null || longitude == null) {
    return res.status(400).json({ message: "Required fields missing." });
  }

  try {
    // Check if coffee shop already exists
    const existing = await prisma.coffeeShop.findUnique({
      where: { placeId }
    });

    let coffeeShop;

    if (existing) {
      // Update existing coffee shop
      coffeeShop = await prisma.coffeeShop.update({
        where: { placeId },
        data: {
          name,
          address,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          phone: phone || null,
          website: website || null,
          imageUrl: imageUrl || null,
          rating: rating ? parseFloat(rating) : null,
          priceLevel: priceLevel ? parseInt(priceLevel) : null,
          openingHours: openingHours || null,
          amenities: amenities || null,
          description: description || null,
          city: city || null,
          state: state || null,
          country: country || null,
        }
      });
    } else {
      // Create new coffee shop
      coffeeShop = await prisma.coffeeShop.create({
        data: {
          placeId,
          name,
          address,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          phone: phone || null,
          website: website || null,
          imageUrl: imageUrl || null,
          rating: rating ? parseFloat(rating) : null,
          priceLevel: priceLevel ? parseInt(priceLevel) : null,
          openingHours: openingHours || null,
          amenities: amenities || null,
          description: description || null,
          city: city || null,
          state: state || null,
          country: country || null,
        }
      });
    }

    // Handle categories if provided
    if (categories.length > 0) {
      // Remove existing category mappings
      await prisma.coffeeShopCategoryMapping.deleteMany({
        where: { coffeeShopId: coffeeShop.id }
      });

      // Add new category mappings
      for (const categoryName of categories) {
        const category = await prisma.coffeeShopCategory.findUnique({
          where: { name: categoryName }
        });

        if (category) {
          await prisma.coffeeShopCategoryMapping.create({
            data: {
              coffeeShopId: coffeeShop.id,
              categoryId: category.id
            }
          });
        }
      }
    }

    res.status(existing ? 200 : 201).json(coffeeShop);
  } catch (err) {
    console.error("Error creating/updating coffee shop:", err);
    res.status(500).json({ message: "Failed to create/update coffee shop." });
  }
};

// Update coffee shop details
export const updateCoffeeShop = async (req, res) => {
  const id = parseInt(req.params.id);
  const {
    name,
    address,
    phone,
    website,
    imageUrl,
    description,
    amenities,
    openingHours
  } = req.body;

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid coffee shop ID." });
  }

  try {
    const updatedCoffeeShop = await prisma.coffeeShop.update({
      where: { id },
      data: {
        name: name || undefined,
        address: address || undefined,
        phone: phone || undefined,
        website: website || undefined,
        imageUrl: imageUrl || undefined,
        description: description || undefined,
        amenities: amenities || undefined,
        openingHours: openingHours || undefined,
      },
    });

    res.json(updatedCoffeeShop);
  } catch (err) {
    console.error("Error updating coffee shop:", err);
    res.status(500).json({ message: "Failed to update coffee shop." });
  }
};

// Delete a coffee shop
export const deleteCoffeeShop = async (req, res) => {
  const id = parseInt(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid coffee shop ID." });
  }

  try {
    await prisma.coffeeShop.delete({ where: { id } });
    res.json({ message: "Coffee shop deleted successfully." });
  } catch (err) {
    console.error("Error deleting coffee shop:", err);
    res.status(500).json({ message: "Failed to delete coffee shop." });
  }
};