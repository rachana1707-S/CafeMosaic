import prisma from "../config/db.js";

// Update a specific place in a trip
export const updateTripPlace = async (req, res) => {
  const id = parseInt(req.params.id);
  const {
    name,
    address,
    latitude,
    longitude,
    category,
    website,
    phone,
    notes,
    order,
    imageUrl,
    hours,
    city,
    state,
    country,
  } = req.body;

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid place ID." });
  }

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Place name is required." });
  }

  if (latitude == null || isNaN(parseFloat(latitude))) {
    return res.status(400).json({ message: "Valid latitude is required." });
  }

  if (longitude == null || isNaN(parseFloat(longitude))) {
    return res.status(400).json({ message: "Valid longitude is required." });
  }

  try {
    const updated = await prisma.tripPlace.update({
      where: { id },
      data: {
        name,
        address: address || "",
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        category: category || "Other",
        website: website || "",
        phone: phone || "",
        notes: notes || "",
        order: order ? parseInt(order) : 0,
        imageUrl: imageUrl || "",
        hours: hours || "",
        city: city || "",
        state: state || "",
        country: country || "",
      },
    });

    res.json(updated);
  } catch (err) {
    console.error("Error updating trip place:", err);
    res.status(500).json({ message: "Failed to update trip place." });
  }
};

// Delete a specific place from a trip
export const deleteTripPlace = async (req, res) => {
  const id = parseInt(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid place ID." });
  }

  try {
    await prisma.tripPlace.delete({
      where: { id },
    });

    res.json({ message: "Trip place deleted successfully." });
  } catch (err) {
    console.error("Error deleting trip place:", err);
    res.status(500).json({ message: "Failed to delete trip place." });
  }
};
