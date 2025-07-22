// ===== FILE: controllers/categoryController.js =====
import prisma from "../config/db.js";

// Get all coffee shop categories
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.coffeeShopCategory.findMany({
      include: {
        _count: { select: { coffeeShops: true } }
      },
      orderBy: { name: 'asc' }
    });
    res.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: "Failed to fetch categories." });
  }
};

// Create a new category (admin only)
export const createCategory = async (req, res) => {
  const { name, description, color, icon } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Category name is required." });
  }

  try {
    const category = await prisma.coffeeShopCategory.create({
      data: {
        name,
        description: description || null,
        color: color || null,
        icon: icon || null,
      },
    });
    res.status(201).json(category);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ message: "Category name already exists." });
    }
    console.error("Error creating category:", err);
    res.status(500).json({ message: "Failed to create category." });
  }
};

// Update a category (admin only)
export const updateCategory = async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description, color, icon } = req.body;

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid category ID." });
  }

  try {
    const category = await prisma.coffeeShopCategory.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description || undefined,
        color: color || undefined,
        icon: icon || undefined,
      },
    });
    res.json(category);
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ message: "Failed to update category." });
  }
};

// Delete a category (admin only)
export const deleteCategory = async (req, res) => {
  const id = parseInt(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid category ID." });
  }

  try {
    await prisma.coffeeShopCategory.delete({ where: { id } });
    res.json({ message: "Category deleted successfully." });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ message: "Failed to delete category." });
  }
};