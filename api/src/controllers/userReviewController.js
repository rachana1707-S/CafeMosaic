import prisma from "../config/db.js";

// Fetch all trip suggestions
export const getSuggestions = async (req, res) => {
  try {
    const suggestions = await prisma.tripSuggestion.findMany({
      include: {
        user: { select: { username: true } },
        places: true,
      },
    });
    res.json(suggestions);
  } catch (error) {
    console.error("Error fetching trip suggestions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch a single trip suggestion by ID
export const getSingleSuggestion = async (req, res) => {
  const suggestionId = parseInt(req.params.suggestionId);
  if (!Number.isInteger(suggestionId)) {
    return res.status(400).json({ message: "Invalid suggestion ID." });
  }

  try {
    const suggestion = await prisma.tripSuggestion.findUnique({
      where: { id: suggestionId },
      include: {
        user: { select: { username: true } },
        places: true, 
      },
    });

    if (!suggestion) {
      return res.status(404).json({ message: "Suggestion not found" });
    }

    res.json(suggestion);
  } catch (error) {
    console.error("Error fetching trip suggestion:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a new trip suggestion
export const addSuggestion = async (req, res) => {
  const { destination, description, image, website, category } = req.body;

  if (!destination || typeof destination !== "string") {
    return res.status(400).json({ message: "Destination is required." });
  }

  try {
    const newSuggestion = await prisma.tripSuggestion.create({
      data: {
        userId: req.user.id,
        destination,
        description: description || "",
        image: image || "",
        website: website || "",
        category: category || "General",
      },
    });

    res.status(201).json(newSuggestion);
  } catch (error) {
    console.error("Error adding suggestion:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a place to a suggestion
export const addPlaceToSuggestion = async (req, res) => {
  const suggestionId = parseInt(req.params.suggestionId);
  const {
    name,
    address,
    latitude,
    longitude,
    category,
  } = req.body;

  if (!name || !suggestionId) {
    return res.status(400).json({ message: "Name and suggestionId are required." });
  }

  try {
    const place = await prisma.suggestionPlace.create({
      data: {
        suggestionId,
        name,
        address: address || "",
        latitude: latitude != null ? parseFloat(latitude) : null,
        longitude: longitude != null ? parseFloat(longitude) : null,
        category: category || "General",
      },
    });

    res.status(201).json(place);
  } catch (error) {
    console.error("Error adding place to suggestion:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a place in a suggestion
export const updatePlaceInSuggestion = async (req, res) => {
  const placeId = parseInt(req.params.placeId);
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: "Place name is required." });

  try {
    const updatedPlace = await prisma.suggestionPlace.update({
      where: { id: placeId },
      data: { name },
    });

    res.json(updatedPlace);
  } catch (error) {
    console.error("Error updating place:", error);
    res.status(500).json({ message: "Failed to update place" });
  }
};

// Delete a place from a suggestion
export const deletePlaceFromSuggestion = async (req, res) => {
  const placeId = parseInt(req.params.placeId);

  try {
    await prisma.suggestionPlace.delete({ where: { id: placeId } });
    res.json({ message: "Place deleted successfully" });
  } catch (error) {
    console.error("Error deleting place:", error);
    res.status(500).json({ message: "Failed to delete place" });
  }
};

// Delete a suggestion
export const deleteSuggestion = async (req, res) => {
  const suggestionId = parseInt(req.params.suggestionId);

  try {
    const suggestion = await prisma.tripSuggestion.findUnique({
      where: { id: suggestionId },
    });

    if (!suggestion) {
      return res.status(404).json({ message: "Suggestion not found" });
    }

    if (suggestion.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this suggestion" });
    }

    await prisma.tripSuggestion.delete({ where: { id: suggestionId } });
    res.json({ message: "Suggestion deleted successfully" });
  } catch (error) {
    console.error("Error deleting suggestion:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update suggestion metadata (not its places)
export const updateSuggestion = async (req, res) => {
  const suggestionId = parseInt(req.params.suggestionId);
  const { destination, description, image, website, category } = req.body;

  try {
    const suggestion = await prisma.tripSuggestion.findUnique({
      where: { id: suggestionId },
    });

    if (!suggestion) {
      return res.status(404).json({ message: "Suggestion not found" });
    }

    if (suggestion.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this suggestion" });
    }

    const updated = await prisma.tripSuggestion.update({
      where: { id: suggestionId },
      data: {
        destination,
        description: description || "",
        image: image || "",
        website: website || "",
        category: category || "General",
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating suggestion:", error);
    res.status(500).json({ message: "Server error" });
  }
};
