import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

/**
 * Calculates the bounding box for a given center point and radius.
 */
const calculateBoundingBox = (lon, lat, distanceKm) => {
  const earthRadiusKm = 6371;
  const deltaLat = (distanceKm / earthRadiusKm) * (180 / Math.PI);
  const deltaLon =
    (distanceKm / (earthRadiusKm * Math.cos((Math.PI * lat) / 180))) *
    (180 / Math.PI);

  return {
    lon1: lon - deltaLon,
    lat1: lat - deltaLat,
    lon2: lon + deltaLon,
    lat2: lat + deltaLat,
  };
};

/**
 * Fetches nearby places based on city name, distance, and category.
 */
export const findNearbyPlaces = async (req, res) => {
  const { city, distance, category, limit } = req.query;
  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!city || !distance || !category) {
    return res.status(400).json({ error: "Missing required parameters." });
  }

  try {
    // 1. Get city coordinates
    const geoResponse = await axios.get(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
        city
      )}&apiKey=${apiKey}`
    );

    if (!geoResponse.data.features.length) {
      return res.status(404).json({ error: "City not found." });
    }

    const [lon, lat] = geoResponse.data.features[0].geometry.coordinates;

    // 2. Calculate bounding box
    const { lon1, lat1, lon2, lat2 } = calculateBoundingBox(
      lon,
      lat,
      Number(distance)
    );

    // 3. Fetch places within bounding box
    const placesResponse = await axios.get(
      `https://api.geoapify.com/v2/places?categories=${category}&filter=rect%3A${lon1}%2C${lat1}%2C${lon2}%2C${lat2}&limit=${limit || 50}&apiKey=${apiKey}`
    );

    return res.json(placesResponse.data.features);
  } catch (error) {
    console.error("Error fetching places:", error);
    res.status(500).json({ error: "Failed to fetch places." });
  }
};
