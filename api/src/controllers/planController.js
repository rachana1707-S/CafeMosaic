import prisma from "../config/db.js";

// Get all plans for a specific user
export const getPlansByUser = async (req, res) => {
  const userId = parseInt(req.params.userId);
  if (!Number.isInteger(userId)) {
    return res.status(400).json({ message: "Invalid user ID." });
  }

  try {
    const plans = await prisma.trip.findMany({
      where: { userId },
      include: { places: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(plans);
  } catch (err) {
    console.error("Error fetching plans:", err);
    res.status(500).json({ message: "Failed to fetch plans." });
  }
};

//get a single plan
export const getSinglePlan = async (req, res) => {
  const id = parseInt(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid plan ID." });
  }

  try {
    const plan = await prisma.trip.findUnique({
      where: { id },
      include: { places: true },
    });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    res.json(plan);
  } catch (err) {
    console.error("Error fetching plan:", err);
    res.status(500).json({ message: "Failed to fetch plan." });
  }
};


// Create a new plan
export const createPlan = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user?.id;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Plan name is required." });
  }

  try {
    const newPlan = await prisma.trip.create({
      data: {
        name,
        description: description || "",
        user: { connect: { id: userId } },
      },
    });
    res.status(201).json(newPlan);
  } catch (err) {
    console.error("Error creating plan:", err);
    res.status(500).json({ message: "Failed to create plan." });
  }
};

// Add a place to an existing plan
export const addPlaceToPlan = async (req, res) => {
  const planId = parseInt(req.params.planId);
  const {
    placeId,
    name,
    address,
    latitude,
    longitude,
    category,
    notes,
    order,
    hours,
    city,
    state,
    country,
    website,
    phone,
    imageUrl,
  } = req.body;

  if (!Number.isInteger(planId)) {
    return res.status(400).json({ message: "Invalid plan ID." });
  }

  if (!placeId || !name || latitude == null || longitude == null) {
    return res.status(400).json({ message: "Required place fields missing." });
  }

  try {
    const newPlace = await prisma.tripPlace.create({
      data: {
        tripId: planId,
        placeId,
        name,
        address: address || "",
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        category: category || "Other",
        notes: notes || "",
        order: order ? parseInt(order) : 0,
        hours: hours || "",
        city: city || "",
        state: state || "",
        country: country || "",
        website: website || "",
        phone: phone || "",
        imageUrl: imageUrl || ""
      },
    });
    res.status(201).json(newPlace);
  } catch (err) {
    console.error("Error adding place:", err);
    res.status(500).json({ message: "Failed to add place to plan." });
  }
};

// Update a plan (e.g., rename or update description)
export const updatePlan = async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description } = req.body;

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid plan ID." });
  }

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Plan name is required." });
  }

  try {
    const updatedPlan = await prisma.trip.update({
      where: { id },
      data: { name, description: description || "" },
    });
    res.json(updatedPlan);
  } catch (err) {
    console.error("Error updating plan:", err);
    res.status(500).json({ message: "Failed to update plan." });
  }
};

// Delete a plan
export const deletePlan = async (req, res) => {
  const id = parseInt(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid plan ID." });
  }

  try {
    await prisma.tripPlace.deleteMany({ where: { tripId: id } });
    await prisma.trip.delete({ where: { id } });

    res.json({ message: "Plan deleted successfully." });
  } catch (err) {
    console.error("Error deleting plan:", err);
    res.status(500).json({ message: "Failed to delete plan." });
  }
};
