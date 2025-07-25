// ===== FILE: controllers/searchController.js =====
import axios from "axios";
import dotenv from "dotenv";
import prisma from "../config/db.js";

dotenv.config();

/**
 * Searches for nearby coffee shops based on location, distance, and filters.
 */
export const searchNearbyCoffeeShops = async (req, res) => {
  console.log("=== SEARCH API CALLED ===");
  console.log("Request query:", req.query);
  console.log("Request method:", req.method);
  console.log("Request URL:", req.url);
  
  const { 
    location, 
    latitude, 
    longitude, 
    distance = "10", 
    unit = 'km', 
    category,
    categories, // Frontend sends 'categories'
    limit = 50 
  } = req.query;
  
  const userId = req.user?.id;
  const ipAddress = req.ip || req.connection.remoteAddress;
  const apiKey = process.env.GEOAPIFY_API_KEY;
  
  console.log("Parsed params:", { location, latitude, longitude, distance, category, categories });
  console.log("API Key exists:", !!apiKey);
  console.log("User ID:", userId);

  // Validate required inputs
  if (!location && (!latitude || !longitude)) {
    console.log("❌ ERROR: Missing location data");
    return res.status(400).json({ 
      success: false,
      error: "Location or coordinates are required.",
      received: { location, latitude, longitude }
    });
  }

  if (!apiKey) {
    console.log("❌ ERROR: Missing Geoapify API key");
    return res.status(500).json({ 
      success: false,
      error: "Server configuration error - missing API key"
    });
  }

  try {
    let lat, lon;

    // Step 1: Get coordinates
    if (latitude && longitude) {
      lat = parseFloat(latitude);
      lon = parseFloat(longitude);
      console.log("✅ Using provided coordinates:", { lat, lon });
    } else {
      console.log("🔍 Geocoding location:", location);
      
      const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=${apiKey}`;
      console.log("Geocoding URL:", geocodeUrl);
      
      try {
        const geoResponse = await axios.get(geocodeUrl);
        console.log("✅ Geocoding successful, status:", geoResponse.status);
        console.log("Geocoding features found:", geoResponse.data.features?.length);

        if (!geoResponse.data.features?.length) {
          console.log("❌ No locations found for:", location);
          return res.status(404).json({ 
            success: false,
            error: `No locations found for "${location}". Please try a different search term.`,
            searchedFor: location
          });
        }

        [lon, lat] = geoResponse.data.features[0].geometry.coordinates;
        console.log("✅ Geocoded coordinates:", { lat, lon });
        
      } catch (geocodeError) {
        console.error("❌ Geocoding failed:", geocodeError.message);
        return res.status(500).json({
          success: false,
          error: "Failed to find location. Please check your search term.",
          details: geocodeError.message
        });
      }
    }

    // Step 2: Convert distance
    const distanceKm = unit === 'miles' ? parseFloat(distance) * 1.609344 : parseFloat(distance);
    console.log("Distance in km:", distanceKm);

    // Step 3: Build categories filter
    const searchCategories = categories || category || 'catering.cafe';
    console.log("Search categories:", searchCategories);

    // Step 4: Search for coffee shops
    const radiusInMeters = distanceKm * 1000;
    const geoapifyUrl = `https://api.geoapify.com/v2/places?categories=${searchCategories}&filter=circle:${lon},${lat},${radiusInMeters}&limit=${limit}&apiKey=${apiKey}`;
    console.log("🔍 Searching coffee shops with URL:", geoapifyUrl);

    try {
      const placesResponse = await axios.get(geoapifyUrl);
      console.log("✅ Coffee shop search successful, status:", placesResponse.status);
      console.log("Raw features found:", placesResponse.data.features?.length);

      const features = placesResponse.data.features || [];
      
      const coffeeShops = features.map((feature, index) => {
        const props = feature.properties || {};
        const coords = feature.geometry?.coordinates || [];
        
        return {
          id: props.place_id || `temp_${index}`,
          placeId: props.place_id || `temp_${index}`,
          name: props.name || props.housenumber ? `${props.housenumber} ${props.street || ''}`.trim() : 'Coffee Shop',
          address: props.formatted || props.address_line1 || `${props.housenumber || ''} ${props.street || ''} ${props.city || ''}`.trim() || 'Address not available',
          latitude: props.lat || coords[1] || lat,
          longitude: props.lon || coords[0] || lon,
          distance: props.distance ? (props.distance / (unit === 'km' ? 1000 : 1609.34)).toFixed(2) : null,
          rating: props.rating || null,
          phone: props.phone || props.contact?.phone || null,
          website: props.website || props.contact?.website || null,
          openingHours: props.opening_hours || null,
          category: props.categories?.[0] || 'cafe',
          priceLevel: props.price_level || null,
          source: 'Geoapify',
          rawData: props // For debugging
        };
      });

      console.log("✅ Successfully processed", coffeeShops.length, "coffee shops");
      
      // Log first coffee shop for debugging
      if (coffeeShops.length > 0) {
        console.log("Sample coffee shop:", JSON.stringify(coffeeShops[0], null, 2));
      }

      // Step 5: Save search history (skip if it fails)
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
        console.log("✅ Search history saved");
      } catch (historyError) {
        console.warn("⚠️ Failed to save search history (continuing anyway):", historyError.message);
      }

      const response = {
        success: true,
        location: { latitude: lat, longitude: lon },
        searchParams: { 
          distance: parseFloat(distance), 
          unit, 
          category: searchCategories,
          originalLocation: location 
        },
        results: coffeeShops.length,
        coffeeShops
      };

      console.log("✅ Sending response with", coffeeShops.length, "coffee shops");
      res.json(response);

    } catch (placesError) {
      console.error("❌ Coffee shop search failed:", placesError.message);
      if (placesError.response) {
        console.error("Places API Error:", placesError.response.status, placesError.response.data);
      }
      return res.status(500).json({
        success: false,
        error: "Failed to search for coffee shops in this area.",
        details: placesError.message
      });
    }

  } catch (error) {
    console.error("❌ GENERAL SEARCH ERROR:", error.message);
    console.error("Error stack:", error.stack);
    
    res.status(500).json({ 
      success: false,
      error: "Failed to search for coffee shops.", 
      details: error.message,
      debugInfo: {
        hasApiKey: !!apiKey,
        requestedLocation: location,
        searchCategories: categories || category,
        coordinates: { latitude, longitude }
      }
    });
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

    res.json({
      success: true,
      history
    });
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

    res.json({
      success: true,
      locations: popularLocations.map(loc => ({
        location: loc.location,
        searchCount: loc._count.location
      }))
    });
  } catch (error) {
    console.error("Error fetching popular locations:", error);
    res.status(500).json({ error: "Failed to fetch popular locations." });
  }
};