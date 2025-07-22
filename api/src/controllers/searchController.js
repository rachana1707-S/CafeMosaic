// ===== FILE: controllers/searchController.js =====
import axios from "axios";
import dotenv from "dotenv";
import prisma from "../config/db.js";

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
 * Searches for nearby coffee shops based on location, distance, and filters.
 */
export const searchNearbyCoffeeShops = async (req, res) => {
  const { 
    location, 
    latitude, 
    longitude, 
    distance, 
    unit = 'km', 
    category,
    limit = 20 
  } = req.query;
  
  const userId = req.user?.id;
  const ipAddress = req.ip || req.connection.remoteAddress;
  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!location && (!latitude || !longitude)) {
    return res.status(400).json({ error: "Location or coordinates are required." });
  }

  if (!distance) {
    return res.status(400).json({ error: "Search distance is required." });
  }

  try {
    let lat, lon;

    // If coordinates provided, use them directly
    if (latitude && longitude) {
      lat = parseFloat(latitude);
      lon = parseFloat(longitude);
    } else {
      // Geocode the location string
      const geoResponse = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          location
        )}&apiKey=${apiKey}`
      );

      if (!geoResponse.data.features.length) {
        return res.status(404).json({ error: "Location not found." });
      }

      [lon, lat] = geoResponse.data.features[0].geometry.coordinates;
    }

    // Convert distance to kilometers if in miles
    const distanceKm = unit === 'miles' ? parseFloat(distance) * 1.609344 : parseFloat(distance);

    // Build categories filter for Geoapify
    const categories = category ? category : 'catering.cafe,catering.coffee_shop';

    // Search using circle filter (more accurate than bounding box)
    const placesResponse = await axios.get(
      `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},${distanceKm * 1000}&limit=${limit}&apiKey=${apiKey}`
    );

    const coffeeShops = placesResponse.data.features.map(feature => ({
      placeId: feature.properties.place_id,
      name: feature.properties.name || 'Coffee Shop',
      address: feature.properties.formatted || feature.properties.address_line1 || 'Address not available',
      latitude: feature.properties.lat || feature.geometry.coordinates[1],
      longitude: feature.properties.lon || feature.geometry.coordinates[0],
      distance: feature.properties.distance ? (feature.properties.distance / (unit === 'km' ? 1000 : 1609.34)).toFixed(2) : null,
      rating: feature.properties.rating || null,
      phone: feature.properties.phone || null,
      website: feature.properties.website || null,
      openingHours: feature.properties.opening_hours || null,
      category: feature.properties.categories?.[0] || 'cafe',
      source: 'Geoapify'
    }));

    // Save search history
    try {
      await prisma.searchHistory.create({
        data: {
          userId: userId || null,
          location: location || `${lat}, ${lon}`,
          latitude: lat,
          longitude: lon,
          radius: parseFloat(distance),
          unit,
          resultsCount: coffeeShops.length,
          ipAddress
        }
      });
    } catch (historyError) {
      console.warn("Failed to save search history:", historyError);
    }

    res.json({
      location: { latitude: lat, longitude: lon },
      searchParams: { distance: parseFloat(distance), unit, category },
      results: coffeeShops.length,
      coffeeShops
    });

  } catch (error) {
    console.error("Error searching coffee shops:", error);
    res.status(500).json({ error: "Failed to search for coffee shops." });
  }
};

/**
 * Get user's search history
 */
export const getSearchHistory = async (req, res) => {
  const userId = req.user?.id;
  const { limit = 20 } = req.query;

  if (!userId) {
    return res.status(401).json({ error: "Authentication required." });
  }

  try {
    const history = await prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit)
    });

    res.json(history);
  } catch (error) {
    console.error("Error fetching search history:", error);
    res.status(500).json({ error: "Failed to fetch search history." });
  }
};

/**
 * Get popular search locations
 */
export const getPopularLocations = async (req, res) => {
  try {
    const popularLocations = await prisma.searchHistory.groupBy({
      by: ['location'],
      _count: {
        location: true
      },
      orderBy: {
        _count: {
          location: 'desc'
        }
      },
      take: 10,
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });

    res.json(popularLocations.map(loc => ({
      location: loc.location,
      searchCount: loc._count.location
    })));
  } catch (error) {
    console.error("Error fetching popular locations:", error);
    res.status(500).json({ error: "Failed to fetch popular locations." });
  }
};