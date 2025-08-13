// // ===== FILE: controllers/searchController.js =====
// import axios from "axios";
// import dotenv from "dotenv";
// import prisma from "../config/db.js";

// dotenv.config();

// /**
//  * Searches for nearby coffee shops based on location, distance, and filters.
//  */
// export const searchNearbyCoffeeShops = async (req, res) => {
//   console.log("=== SEARCH API CALLED ===");
//   console.log("Request query:", req.query);
//   console.log("Request method:", req.method);
//   console.log("Request URL:", req.url);
  
//   const { 
//     location, 
//     latitude, 
//     longitude, 
//     distance = "10", 
//     unit = 'km', 
//     category,
//     categories, // Frontend sends 'categories'
//     limit = 50 
//   } = req.query;
  
//   const userId = req.user?.id;
//   const ipAddress = req.ip || req.connection.remoteAddress;
//   const apiKey = process.env.GEOAPIFY_API_KEY;
  
//   console.log("Parsed params:", { location, latitude, longitude, distance, category, categories });
//   console.log("API Key exists:", !!apiKey);
//   console.log("User ID:", userId);

//   // Validate required inputs
//   if (!location && (!latitude || !longitude)) {
//     console.log("❌ ERROR: Missing location data");
//     return res.status(400).json({ 
//       success: false,
//       error: "Location or coordinates are required.",
//       received: { location, latitude, longitude }
//     });
//   }

//   if (!apiKey) {
//     console.log("❌ ERROR: Missing Geoapify API key");
//     return res.status(500).json({ 
//       success: false,
//       error: "Server configuration error - missing API key"
//     });
//   }

//   try {
//     let lat, lon;

//     // Step 1: Get coordinates
//     if (latitude && longitude) {
//       lat = parseFloat(latitude);
//       lon = parseFloat(longitude);
//       console.log("✅ Using provided coordinates:", { lat, lon });
//     } else {
//       console.log("🔍 Geocoding location:", location);
      
//       const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=${apiKey}`;
//       console.log("Geocoding URL:", geocodeUrl);
      
//       try {
//         const geoResponse = await axios.get(geocodeUrl);
//         console.log("✅ Geocoding successful, status:", geoResponse.status);
//         console.log("Geocoding features found:", geoResponse.data.features?.length);

//         if (!geoResponse.data.features?.length) {
//           console.log("❌ No locations found for:", location);
//           return res.status(404).json({ 
//             success: false,
//             error: `No locations found for "${location}". Please try a different search term.`,
//             searchedFor: location
//           });
//         }

//         [lon, lat] = geoResponse.data.features[0].geometry.coordinates;
//         console.log("✅ Geocoded coordinates:", { lat, lon });
        
//       } catch (geocodeError) {
//         console.error("❌ Geocoding failed:", geocodeError.message);
//         return res.status(500).json({
//           success: false,
//           error: "Failed to find location. Please check your search term.",
//           details: geocodeError.message
//         });
//       }
//     }

//     // Step 2: Convert distance
//     const distanceKm = unit === 'miles' ? parseFloat(distance) * 1.609344 : parseFloat(distance);
//     console.log("Distance in km:", distanceKm);

//     // Step 3: Build categories filter
//     const searchCategories = categories || category || 'catering.cafe';
//     console.log("Search categories:", searchCategories);

//     // Step 4: Search for coffee shops
//     const radiusInMeters = distanceKm * 1000;
//     const geoapifyUrl = `https://api.geoapify.com/v2/places?categories=${searchCategories}&filter=circle:${lon},${lat},${radiusInMeters}&limit=${limit}&apiKey=${apiKey}`;
//     console.log("🔍 Searching coffee shops with URL:", geoapifyUrl);

//     try {
//       const placesResponse = await axios.get(geoapifyUrl);
//       console.log("✅ Coffee shop search successful, status:", placesResponse.status);
//       console.log("Raw features found:", placesResponse.data.features?.length);

//       const features = placesResponse.data.features || [];
      
//       const coffeeShops = features.map((feature, index) => {
//         const props = feature.properties || {};
//         const coords = feature.geometry?.coordinates || [];
        
//         return {
//           id: props.place_id || `temp_${index}`,
//           placeId: props.place_id || `temp_${index}`,
//           name: props.name || props.housenumber ? `${props.housenumber} ${props.street || ''}`.trim() : 'Coffee Shop',
//           address: props.formatted || props.address_line1 || `${props.housenumber || ''} ${props.street || ''} ${props.city || ''}`.trim() || 'Address not available',
//           latitude: props.lat || coords[1] || lat,
//           longitude: props.lon || coords[0] || lon,
//           distance: props.distance ? (props.distance / (unit === 'km' ? 1000 : 1609.34)).toFixed(2) : null,
//           rating: props.rating || null,
//           phone: props.phone || props.contact?.phone || null,
//           website: props.website || props.contact?.website || null,
//           openingHours: props.opening_hours || null,
//           category: props.categories?.[0] || 'cafe',
//           priceLevel: props.price_level || null,
//           source: 'Geoapify',
//           rawData: props // For debugging
//         };
//       });

//       console.log("✅ Successfully processed", coffeeShops.length, "coffee shops");
      
//       // Log first coffee shop for debugging
//       if (coffeeShops.length > 0) {
//         console.log("Sample coffee shop:", JSON.stringify(coffeeShops[0], null, 2));
//       }

//       // Step 5: Save search history (skip if it fails)
//       try {
//         await prisma.searchHistory.create({
//           data: {
//             userId: userId || null,
//             location: location || `${lat}, ${lon}`,
//             latitude: lat,
//             longitude: lon,
//             radius: parseFloat(distance),
//             unit,
//             resultsCount: coffeeShops.length,
//             ipAddress
//           }
//         });
//         console.log("✅ Search history saved");
//       } catch (historyError) {
//         console.warn("⚠️ Failed to save search history (continuing anyway):", historyError.message);
//       }

//       const response = {
//         success: true,
//         location: { latitude: lat, longitude: lon },
//         searchParams: { 
//           distance: parseFloat(distance), 
//           unit, 
//           category: searchCategories,
//           originalLocation: location 
//         },
//         results: coffeeShops.length,
//         coffeeShops
//       };

//       console.log("✅ Sending response with", coffeeShops.length, "coffee shops");
//       res.json(response);

//     } catch (placesError) {
//       console.error("❌ Coffee shop search failed:", placesError.message);
//       if (placesError.response) {
//         console.error("Places API Error:", placesError.response.status, placesError.response.data);
//       }
//       return res.status(500).json({
//         success: false,
//         error: "Failed to search for coffee shops in this area.",
//         details: placesError.message
//       });
//     }

//   } catch (error) {
//     console.error("❌ GENERAL SEARCH ERROR:", error.message);
//     console.error("Error stack:", error.stack);
    
//     res.status(500).json({ 
//       success: false,
//       error: "Failed to search for coffee shops.", 
//       details: error.message,
//       debugInfo: {
//         hasApiKey: !!apiKey,
//         requestedLocation: location,
//         searchCategories: categories || category,
//         coordinates: { latitude, longitude }
//       }
//     });
//   }
// };

// /**
//  * Get user's search history
//  */
// export const getSearchHistory = async (req, res) => {
//   const userId = req.user?.id;
//   const { limit = 20 } = req.query;

//   if (!userId) {
//     return res.status(401).json({ error: "Authentication required." });
//   }

//   try {
//     const history = await prisma.searchHistory.findMany({
//       where: { userId },
//       orderBy: { createdAt: 'desc' },
//       take: parseInt(limit)
//     });

//     res.json({
//       success: true,
//       history
//     });
//   } catch (error) {
//     console.error("Error fetching search history:", error);
//     res.status(500).json({ error: "Failed to fetch search history." });
//   }
// };

// /**
//  * Get popular search locations
//  */
// export const getPopularLocations = async (req, res) => {
//   try {
//     const popularLocations = await prisma.searchHistory.groupBy({
//       by: ['location'],
//       _count: {
//         location: true
//       },
//       orderBy: {
//         _count: {
//           location: 'desc'
//         }
//       },
//       take: 10,
//       where: {
//         createdAt: {
//           gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
//         }
//       }
//     });

//     res.json({
//       success: true,
//       locations: popularLocations.map(loc => ({
//         location: loc.location,
//         searchCount: loc._count.location
//       }))
//     });
//   } catch (error) {
//     console.error("Error fetching popular locations:", error);
//     res.status(500).json({ error: "Failed to fetch popular locations." });
//   }
// };



import prisma from '../config/db.js';
import axios from 'axios';

// Search nearby coffee shops/restaurants
export const searchNearbyCoffeeShops = async (req, res) => {
  try {
    const {
      location = 'Boston, MA',
      latitude,
      longitude,
      categories = 'catering.restaurant,catering.cafe,catering.bar,catering.fast_food,catering.ice_cream,catering.food_court',
      distance = 10,
      unit = 'km',
      limit = 20,
      query // Search query for filtering by name
    } = req.query;

    console.log('Search request:', { location, categories, distance, limit, query });

    let searchResults = [];
    let coords = { lat: null, lng: null };

    // If lat/lng provided, use them; otherwise geocode the location
    if (latitude && longitude) {
      coords = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
    } else {
      // Geocode the location using a geocoding service
      coords = await geocodeLocation(location);
    }

    // Search using Geoapify API
    const apiKey = process.env.GEOAPIFY_API_KEY;
    if (!apiKey) {
      console.warn('Geoapify API key not found, using mock data');
      searchResults = generateMockResults(coords, query, parseInt(limit));
    } else {
      try {
        const geoapifyResponse = await searchWithGeoapify(coords, categories, distance, limit, query, apiKey);
        searchResults = geoapifyResponse;
      } catch (apiError) {
        console.error('Geoapify API error:', apiError.message);
        console.log('Falling back to mock data');
        searchResults = generateMockResults(coords, query, parseInt(limit));
      }
    }

    // Filter results by query if provided
    if (query) {
      searchResults = searchResults.filter(place =>
        place.name.toLowerCase().includes(query.toLowerCase()) ||
        place.address.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Save search history if user is authenticated
    if (req.user) {
      try {
        await prisma.searchHistory.create({
          data: {
            userId: req.user.id,
            location: location,
            latitude: coords.lat,
            longitude: coords.lng,
            radius: parseFloat(distance),
            unit: unit,
            resultsCount: searchResults.length,
            ipAddress: req.ip
          }
        });
      } catch (historyError) {
        console.error('Error saving search history:', historyError);
        // Don't fail the request if history saving fails
      }
    }

    // Transform results to match expected format
    const transformedResults = searchResults.map(place => ({
      id: place.id || place.place_id,
      placeId: place.place_id || place.id,
      name: place.name || place.properties?.name || 'Unknown Place',
      address: place.address || place.properties?.formatted || 'Address not available',
      latitude: place.latitude || place.geometry?.coordinates?.[1] || place.lat,
      longitude: place.longitude || place.geometry?.coordinates?.[0] || place.lng,
      rating: place.rating || (Math.random() * 1.5 + 3.5).toFixed(1),
      category: place.category || place.properties?.categories?.[0] || 'catering.restaurant',
      distance: place.distance || calculateDistance(
        coords.lat,
        coords.lng,
        place.latitude || place.geometry?.coordinates?.[1] || place.lat,
        place.longitude || place.geometry?.coordinates?.[0] || place.lng
      ).toFixed(1),
      phone: place.phone || place.properties?.contact?.phone,
      website: place.website || place.properties?.contact?.website,
      imageUrl: place.imageUrl || generateImageForCategory(place.category || 'restaurant'),
      priceLevel: place.priceLevel || Math.floor(Math.random() * 4) + 1,
      types: place.types || [place.category || 'restaurant'],
      searchedAt: new Date().toISOString()
    }));

    res.json({
      coffeeShops: transformedResults,
      places: transformedResults, // Alias for backward compatibility
      searchParams: {
        location,
        coordinates: coords,
        categories: categories.split(','),
        distance: parseFloat(distance),
        unit,
        limit: parseInt(limit),
        query
      },
      resultsCount: transformedResults.length
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      message: 'Search failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get user's search history
export const getSearchHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const searchHistory = await prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    });

    const totalHistory = await prisma.searchHistory.count({
      where: { userId }
    });

    res.json({
      history: searchHistory,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalHistory / parseInt(limit)),
        totalItems: totalHistory,
        hasNext: skip + searchHistory.length < totalHistory,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ 
      message: 'Failed to fetch search history',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get popular search locations
export const getPopularLocations = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

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
      take: parseInt(limit),
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });

    const transformedLocations = popularLocations.map(loc => ({
      location: loc.location,
      searchCount: loc._count.location
    }));

    res.json({
      popularLocations: transformedLocations
    });

  } catch (error) {
    console.error('Error fetching popular locations:', error);
    res.status(500).json({ 
      message: 'Failed to fetch popular locations',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Helper function to geocode location
async function geocodeLocation(location) {
  try {
    const apiKey = process.env.GEOAPIFY_API_KEY;
    if (!apiKey) {
      // Return default Boston coordinates
      return { lat: 42.3601, lng: -71.0589 };
    }

    const response = await axios.get(`https://api.geoapify.com/v1/geocode/search`, {
      params: {
        text: location,
        apiKey: apiKey,
        limit: 1
      }
    });

    if (response.data.features && response.data.features.length > 0) {
      const coordinates = response.data.features[0].geometry.coordinates;
      return { lat: coordinates[1], lng: coordinates[0] };
    }
    
    // Fallback to Boston coordinates
    return { lat: 42.3601, lng: -71.0589 };

  } catch (error) {
    console.error('Geocoding error:', error);
    return { lat: 42.3601, lng: -71.0589 };
  }
}

// Helper function to search with Geoapify
async function searchWithGeoapify(coords, categories, distance, limit, query, apiKey) {
  try {
    const response = await axios.get('https://api.geoapify.com/v2/places', {
      params: {
        categories: categories,
        filter: `circle:${coords.lng},${coords.lat},${distance * 1000}`, // Convert km to meters
        bias: `proximity:${coords.lng},${coords.lat}`,
        limit: parseInt(limit),
        apiKey: apiKey
      }
    });

    return response.data.features.map((feature, index) => ({
      id: feature.properties.place_id || `geoapify_${index}`,
      place_id: feature.properties.place_id,
      name: feature.properties.name || 'Unknown Place',
      address: feature.properties.formatted || 'Address not available',
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
      category: feature.properties.categories?.[0] || 'catering.restaurant',
      phone: feature.properties.contact?.phone,
      website: feature.properties.contact?.website,
      distance: calculateDistance(
        coords.lat,
        coords.lng,
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0]
      ).toFixed(1)
    }));

  } catch (error) {
    throw new Error(`Geoapify API error: ${error.message}`);
  }
}

// Helper function to generate mock results when API is unavailable
function generateMockResults(coords, query, limit) {
  const mockPlaces = [
    {
      id: 'mock_1',
      name: 'Boston Brew House',
      address: '123 Main St, Boston, MA 02101',
      category: 'catering.cafe',
      rating: 4.5
    },
    {
      id: 'mock_2', 
      name: 'The Local Bistro',
      address: '456 Park Ave, Boston, MA 02102',
      category: 'catering.restaurant',
      rating: 4.2
    },
    {
      id: 'mock_3',
      name: 'Harbor Bar & Grill',
      address: '789 Harbor St, Boston, MA 02103',
      category: 'catering.bar',
      rating: 4.0
    },
    {
      id: 'mock_4',
      name: 'Quick Bites Express',
      address: '321 Speed Way, Boston, MA 02104',
      category: 'catering.fast_food',
      rating: 3.8
    },
    {
      id: 'mock_5',
      name: 'Gelato Dreams',
      address: '654 Sweet Ave, Boston, MA 02105',
      category: 'catering.ice_cream',
      rating: 4.7
    }
  ];

  return mockPlaces.slice(0, limit).map(place => ({
    ...place,
    latitude: coords.lat + (Math.random() - 0.5) * 0.02,
    longitude: coords.lng + (Math.random() - 0.5) * 0.02,
    phone: `+1-617-555-${Math.floor(Math.random() * 9000) + 1000}`,
    website: `https://${place.name.toLowerCase().replace(/\s+/g, '')}.com`,
    distance: (Math.random() * 3 + 0.5).toFixed(1),
    priceLevel: Math.floor(Math.random() * 4) + 1
  }));
}

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Helper function to generate images for categories
function generateImageForCategory(category) {
  const images = {
    'catering.restaurant': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop&auto=format&q=80',
    'catering.cafe': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&auto=format&q=80',
    'catering.bar': 'https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=300&h=200&fit=crop&auto=format&q=80',
    'catering.fast_food': 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&h=200&fit=crop&auto=format&q=80',
    'catering.ice_cream': 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=300&h=200&fit=crop&auto=format&q=80',
    'catering.food_court': 'https://images.unsplash.com/photo-1567521464027-f32a2d9b9e89?w=300&h=200&fit=crop&auto=format&q=80'
  };

  return images[category] || images['catering.restaurant'];
}