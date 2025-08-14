import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthUser } from "../context/AuthContext";
import CollectionSelectorModal from "../components/CollectionSelectorModal";
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Clock, 
  Globe, 
  Star, 
  Heart, 
  Share2,
  Utensils,
  DollarSign,
  Wifi,
  Car,
  CreditCard,
  Users,
  Folder,
  Plus
} from "lucide-react";

export default function FoodPlaceDetails() {
  const { foodPlaceId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthUser();
  
  const [foodPlace, setFoodPlace] = useState(null);
  const [similarPlaces, setSimilarPlaces] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: '',
    title: '',
    comment: '',
    visitDate: ''
  });

  // Category-specific placeholder images for different food types
  const foodImages = {
    restaurant: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=600&h=400&fit=crop&auto=format&q=80'
    ],
    cafe: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&auto=format&q=80'
    ],
    bar: [
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=400&fit=crop&auto=format&q=80'
    ],
    pub: [
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop&auto=format&q=80'
    ],
    fast_food: [
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1586816001966-79b736744398?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop&auto=format&q=80'
    ],
    food_court: [
      'https://images.unsplash.com/photo-1567521464027-f32a2d9b9e89?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop&auto=format&q=80'
    ],
    ice_cream: [
      'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&h=400&fit=crop&auto=format&q=80'
    ],
    biergarten: [
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop&auto=format&q=80'
    ],
    taproom: [
      'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop&auto=format&q=80'
    ]
  };

  const generatePhoneNumber = () => {
    return `+1-617-555-${Math.floor(Math.random() * 9000) + 1000}`;
  };

  const generateWebsite = (name) => {
    if (!name) return null;
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `https://${cleanName}.com`;
  };

  const getImageForCategory = (category) => {
    const categoryType = category ? category.replace('catering.', '') : 'restaurant';
    const categoryImages = foodImages[categoryType] || foodImages.restaurant;
    return categoryImages[Math.floor(Math.random() * categoryImages.length)];
  };

  // Generate description based on name and category
  const generateDescription = (name, category) => {
    const descriptions = {
      restaurant: `${name} offers an exceptional dining experience with carefully crafted dishes and warm hospitality. Perfect for both casual meals and special occasions.`,
      cafe: `${name} is a welcoming neighborhood cafe serving artisanal coffee, fresh pastries, and light meals in a cozy atmosphere.`,
      bar: `${name} is the perfect spot to unwind with craft cocktails, local beers, and a vibrant atmosphere that brings people together.`,
      pub: `${name} offers a traditional pub experience with hearty comfort food, premium beverages, and a warm, friendly environment.`,
      fast_food: `${name} provides quick, fresh, and delicious meals prepared with quality ingredients for people on the go.`,
      food_court: `${name} features a variety of food options under one roof, perfect for groups with different tastes and preferences.`
    };
    
    return descriptions[category] || descriptions.restaurant;
  };

  // Generate opening hours based on category
  const generateOpeningHours = (category) => {
    const hours = {
      cafe: {
        monday: "07:00 - 20:00",
        tuesday: "07:00 - 20:00",
        wednesday: "07:00 - 20:00", 
        thursday: "07:00 - 20:00",
        friday: "07:00 - 21:00",
        saturday: "08:00 - 21:00",
        sunday: "08:00 - 19:00"
      },
      bar: {
        monday: "16:00 - 01:00",
        tuesday: "16:00 - 01:00",
        wednesday: "16:00 - 01:00",
        thursday: "16:00 - 02:00", 
        friday: "16:00 - 02:00",
        saturday: "14:00 - 02:00",
        sunday: "14:00 - 24:00"
      },
      pub: {
        monday: "16:00 - 01:00",
        tuesday: "16:00 - 01:00",
        wednesday: "16:00 - 01:00",
        thursday: "16:00 - 02:00", 
        friday: "16:00 - 02:00",
        saturday: "14:00 - 02:00",
        sunday: "14:00 - 24:00"
      },
      fast_food: {
        monday: "10:00 - 23:00",
        tuesday: "10:00 - 23:00",
        wednesday: "10:00 - 23:00",
        thursday: "10:00 - 23:00",
        friday: "10:00 - 24:00", 
        saturday: "10:00 - 24:00",
        sunday: "11:00 - 22:00"
      },
      restaurant: {
        monday: "11:00 - 22:00",
        tuesday: "11:00 - 22:00",
        wednesday: "11:00 - 22:00",
        thursday: "11:00 - 22:00",
        friday: "11:00 - 23:00",
        saturday: "10:00 - 23:00", 
        sunday: "10:00 - 21:00"
      }
    };
    
    return hours[category] || hours.restaurant;
  };

  // Generate amenities based on category
  const generateAmenities = (category) => {
    const amenities = {
      cafe: {
        wifi: true,
        creditCards: true,
        parking: false,
        outdoorSeating: true,
        wheelchair: true,
        delivery: false,
        takeout: true
      },
      bar: {
        wifi: true,
        creditCards: true,
        parking: true,
        outdoorSeating: true,
        wheelchair: true,
        delivery: false,
        takeout: false
      },
      pub: {
        wifi: true,
        creditCards: true,
        parking: true,
        outdoorSeating: true,
        wheelchair: true,
        delivery: false,
        takeout: false
      },
      fast_food: {
        wifi: true,
        creditCards: true,
        parking: true,
        outdoorSeating: false,
        wheelchair: true,
        delivery: true,
        takeout: true
      },
      restaurant: {
        wifi: true,
        creditCards: true,
        parking: true,
        outdoorSeating: true,
        wheelchair: true,
        delivery: true,
        takeout: true
      }
    };
    
    return amenities[category] || amenities.restaurant;
  };

  // Fallback function for generating mock data when no cached data exists
  const generateMockFoodPlace = (id) => {
    // Try to extract meaningful info from the ID if it looks like an address or name
    let name = "Local Restaurant";
    let address = "Address not available";
    let category = "restaurant";
    
    if (id.includes("boylston")) {
      name = "Boylston Street Bistro";
      address = "1165 Boylston St, Boston, MA 02215";
      category = "restaurant";
    } else if (id.includes("newbury")) {
      name = "Newbury Street Cafe";
      address = id.replace(/_/g, ' ');
      category = "cafe";
    } else if (id.includes("cambridge")) {
      name = "Cambridge Corner";
      address = id.replace(/_/g, ' ');
      category = "restaurant";
    } else if (id.includes("bar") || id.includes("pub")) {
      name = id.replace(/_/g, ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      address = `${Math.floor(Math.random() * 999) + 100} Main St, Boston, MA`;
      category = id.includes("bar") ? "bar" : "pub";
    } else {
      // Generate name from ID
      name = id.replace(/_/g, ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      address = `${Math.floor(Math.random() * 999) + 100} ${name.split(' ')[0]} St, Boston, MA`;
    }

    return {
      id: id,
      placeId: id,
      name: name,
      address: address,
      phone: `+1-617-555-${Math.floor(Math.random() * 9000) + 1000}`,
      website: `https://${name.toLowerCase().replace(/\s+/g, '')}.com`,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      priceLevel: Math.floor(Math.random() * 4) + 1,
      category: category,
      cuisine: "International",
      description: generateDescription(name, category),
      imageUrl: getImageForCategory(category),
      latitude: 42.3601 + (Math.random() - 0.5) * 0.02,
      longitude: -71.0589 + (Math.random() - 0.5) * 0.02,
      openingHours: generateOpeningHours(category),
      amenities: generateAmenities(category),
      distance: (Math.random() * 3 + 0.1).toFixed(1)
    };
  };

  // Check if current food place is in favorites
  const checkIfFavorite = (place) => {
    if (!place) return false;
    
    const favorites = JSON.parse(localStorage.getItem('foodPlaceFavorites') || '[]');
    return favorites.some(fav => 
      (fav.id && fav.id === place.id) || 
      (fav.placeId && fav.placeId === place.placeId) ||
      (place.placeId && fav.placeId === place.placeId)
    );
  };

  useEffect(() => {
    fetchFoodPlaceDetails();
  }, [foodPlaceId]);

  useEffect(() => {
    // Update favorite status when food place data changes
    if (foodPlace) {
      setIsFavorite(checkIfFavorite(foodPlace));
    }
  }, [foodPlace]);

  const fetchFoodPlaceDetails = async () => {
    try {
      setLoading(true);
      
      console.log("🔍 Looking for place with ID:", foodPlaceId);
      
      // First, try to get data from localStorage (if navigated from search/favorites)
      const cachedPlaces = JSON.parse(localStorage.getItem('searchResults') || '[]');
      const cachedFavorites = JSON.parse(localStorage.getItem('foodPlaceFavorites') || '[]');
      
      console.log("📦 Cached search results:", cachedPlaces.length, "items");
      console.log("❤️ Cached favorites:", cachedFavorites.length, "items");
      
      // Look for the place in cached search results or favorites
      let foundPlace = cachedPlaces.find(place => {
        const matches = place.id === foodPlaceId || 
                       place.placeId === foodPlaceId ||
                       place.place_id === foodPlaceId ||
                       String(place.id) === String(foodPlaceId) ||
                       String(place.placeId) === String(foodPlaceId) ||
                       String(place.place_id) === String(foodPlaceId);
        
        if (matches) {
          console.log("✅ Found matching place in search results:", place.name);
        }
        return matches;
      });
      
      if (!foundPlace) {
        foundPlace = cachedFavorites.find(place => {
          const matches = place.id === foodPlaceId || 
                         place.placeId === foodPlaceId ||
                         place.place_id === foodPlaceId ||
                         String(place.id) === String(foodPlaceId) ||
                         String(place.placeId) === String(foodPlaceId) ||
                         String(place.place_id) === String(foodPlaceId);
          
          if (matches) {
            console.log("✅ Found matching place in favorites:", place.name);
          }
          return matches;
        });
      }
      
      let mockFoodPlace;
      
      if (foundPlace) {
        console.log("🎯 Using found place data:", foundPlace);
        
        // Use the actual place data from search results or favorites
        mockFoodPlace = {
          id: foundPlace.id || foundPlace.placeId || foundPlace.place_id || foodPlaceId,
          placeId: foundPlace.placeId || foundPlace.id || foundPlace.place_id || foodPlaceId,
          name: foundPlace.name || "Restaurant",
          address: foundPlace.address || foundPlace.vicinity || foundPlace.formatted_address || "Address not available",
          phone: foundPlace.phone || foundPlace.formatted_phone_number || generatePhoneNumber(),
          website: foundPlace.website || foundPlace.url || generateWebsite(foundPlace.name),
          rating: foundPlace.rating || (Math.random() * 1.5 + 3.5).toFixed(1),
          priceLevel: foundPlace.priceLevel || foundPlace.price_level || Math.floor(Math.random() * 4) + 1,
          category: foundPlace.category || (foundPlace.types && foundPlace.types[0]) || "restaurant",
          cuisine: foundPlace.cuisine || (foundPlace.types && foundPlace.types.slice(0,2).join(", ")) || "International",
          description: foundPlace.description || generateDescription(foundPlace.name || "Restaurant", foundPlace.category || "restaurant"),
          imageUrl: foundPlace.imageUrl || (foundPlace.photos && foundPlace.photos[0]) || getImageForCategory(foundPlace.category || "restaurant"),
          latitude: foundPlace.latitude || (foundPlace.geometry && foundPlace.geometry.location && foundPlace.geometry.location.lat) || 42.3601,
          longitude: foundPlace.longitude || (foundPlace.geometry && foundPlace.geometry.location && foundPlace.geometry.location.lng) || -71.0589,
          distance: foundPlace.distance || (Math.random() * 3 + 0.1).toFixed(1),
          openingHours: foundPlace.openingHours || (foundPlace.opening_hours && foundPlace.opening_hours.weekday_text) || generateOpeningHours(foundPlace.category || "restaurant"),
          amenities: foundPlace.amenities || generateAmenities(foundPlace.category || "restaurant"),
          reviews: foundPlace.reviews || [],
          // Preserve additional data
          types: foundPlace.types,
          geometry: foundPlace.geometry,
          photos: foundPlace.photos,
          place_id: foundPlace.place_id,
          formatted_address: foundPlace.formatted_address,
          vicinity: foundPlace.vicinity,
          searchedAt: foundPlace.searchedAt,
          dateAdded: foundPlace.dateAdded
        };
        
        console.log("✅ Created food place object:", mockFoodPlace.name, mockFoodPlace.address);
        
      } else {
        console.log("⚠️ No cached data found, trying API or generating fallback data");
        
        // Try to fetch from a real API if available
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          const response = await fetch(`${apiUrl}/api/coffee-shops/${foodPlaceId}`, {
            credentials: 'include'
          });
          
          if (response.ok) {
            const placeData = await response.json();
            console.log("🌐 Got data from API:", placeData);
            
            mockFoodPlace = {
              id: placeData.id || foodPlaceId,
              placeId: placeData.placeId || placeData.id || foodPlaceId,
              name: placeData.name || "Restaurant",
              address: placeData.address || placeData.formatted_address || "Address not available",
              phone: placeData.phone || placeData.formatted_phone_number || generatePhoneNumber(),
              website: placeData.website || placeData.url || generateWebsite(placeData.name),
              rating: placeData.rating || (Math.random() * 1.5 + 3.5).toFixed(1),
              priceLevel: placeData.priceLevel || placeData.price_level || Math.floor(Math.random() * 4) + 1,
              category: placeData.category || (placeData.types && placeData.types[0]) || "restaurant",
              cuisine: placeData.cuisine || "International",
              description: placeData.description || generateDescription(placeData.name, placeData.category || "restaurant"),
              imageUrl: placeData.imageUrl || (placeData.photos && placeData.photos[0]) || getImageForCategory(placeData.category || "restaurant"),
              latitude: placeData.latitude || (placeData.geometry && placeData.geometry.location && placeData.geometry.location.lat) || 42.3601,
              longitude: placeData.longitude || (placeData.geometry && placeData.geometry.location && placeData.geometry.location.lng) || -71.0589,
              distance: placeData.distance || (Math.random() * 3 + 0.1).toFixed(1),
              openingHours: placeData.openingHours || generateOpeningHours(placeData.category || "restaurant"),
              amenities: placeData.amenities || generateAmenities(placeData.category || "restaurant"),
              reviews: placeData.reviews || []
            };
          } else {
            throw new Error(`API returned ${response.status}`);
          }
        } catch (apiError) {
          console.log("❌ API call failed:", apiError.message, "- using intelligent fallback");
          mockFoodPlace = generateMockFoodPlace(foodPlaceId);
        }
      }

      setFoodPlace(mockFoodPlace);
      
      // Fetch similar places
      fetchSimilarPlaces(mockFoodPlace);
      
      // Fetch reviews for this specific place
      fetchReviews(mockFoodPlace.id);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarPlaces = async (currentPlace) => {
    try {
      // Generate different similar places based on current place category
      const generateSimilarPlaces = (category, currentId) => {
        const allPlaces = [
          {
            id: "italian_corner",
            name: "Italian Corner",
            address: "234 Little Italy St, Boston, MA",
            rating: 4.7,
            category: "restaurant",
            priceLevel: 3
          },
          {
            id: "brew_masters",
            name: "Brew Masters Pub",
            address: "567 Hops Street, Boston, MA",
            rating: 4.4,
            category: "pub", 
            priceLevel: 2
          },
          {
            id: "morning_glory_cafe",
            name: "Morning Glory Cafe",
            address: "890 Dawn Avenue, Boston, MA",
            rating: 4.6,
            category: "cafe",
            priceLevel: 1
          },
          {
            id: "speedy_eats",
            name: "Speedy Eats",
            address: "111 Fast Lane, Boston, MA",
            rating: 3.9,
            category: "fast_food",
            priceLevel: 1
          },
          {
            id: "cocktail_lounge",
            name: "The Cocktail Lounge",
            address: "444 Mix Street, Boston, MA",
            rating: 4.3,
            category: "bar",
            priceLevel: 3
          },
          {
            id: "fusion_kitchen",
            name: "Fusion Kitchen",
            address: "777 Blend Blvd, Boston, MA",
            rating: 4.5,
            category: "restaurant",
            priceLevel: 2
          }
        ];

        // Filter out current place and return 3 similar ones
        return allPlaces
          .filter(place => place.id !== currentId)
          .sort(() => 0.5 - Math.random()) // Shuffle
          .slice(0, 3)
          .map(place => ({
            ...place,
            distance: (Math.random() * 2 + 0.5).toFixed(1),
            imageUrl: getImageForCategory(place.category)
          }));
      };

      const mockSimilarPlaces = generateSimilarPlaces(currentPlace.category, currentPlace.id);
      setSimilarPlaces(mockSimilarPlaces);
    } catch (error) {
      console.error("Error fetching similar places:", error);
    }
  };

  const fetchReviews = async (placeId) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/reviews/coffee-shop/${placeId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Reviews for this place:", data);
        
        // Transform the reviews to match expected format
        const transformedReviews = (data.reviews || data || []).map(review => ({
          id: review.id,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          visitDate: review.visitDate,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,
          user: {
            id: review.user?.id || review.userId,
            username: review.user?.username || 'Anonymous'
          }
        }));
        
        setReviews(transformedReviews);
      } else {
        console.error("Failed to fetch reviews:", response.status);
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    }
  };

  const handleAddToFavorites = async () => {
    if (!isAuthenticated()) {
      alert("Please log in to add favorites");
      navigate("/login");
      return;
    }

    if (!foodPlace) return;
    
    try {
      // Get current favorites from localStorage
      const currentFavorites = JSON.parse(localStorage.getItem('foodPlaceFavorites') || '[]');
      
      // Check if already in favorites
      const existingIndex = currentFavorites.findIndex(fav => 
        (fav.id && fav.id === foodPlace.id) || 
        (fav.placeId && fav.placeId === foodPlace.placeId) ||
        (foodPlace.placeId && fav.placeId === foodPlace.placeId)
      );
      
      let updatedFavorites;
      let action;
      
      if (existingIndex > -1) {
        // Remove from favorites
        updatedFavorites = currentFavorites.filter((_, index) => index !== existingIndex);
        action = "removed";
        setIsFavorite(false);
      } else {
        // Add to favorites
        const favoriteItem = {
          id: foodPlace.id,
          placeId: foodPlace.placeId,
          name: foodPlace.name,
          address: foodPlace.address,
          phone: foodPlace.phone,
          website: foodPlace.website,
          rating: foodPlace.rating,
          priceLevel: foodPlace.priceLevel,
          category: foodPlace.category,
          cuisine: foodPlace.cuisine,
          description: foodPlace.description,
          imageUrl: foodPlace.imageUrl,
          latitude: foodPlace.latitude,
          longitude: foodPlace.longitude,
          distance: foodPlace.distance,
          dateAdded: new Date().toISOString(),
          amenities: foodPlace.amenities,
          openingHours: foodPlace.openingHours
        };
        
        updatedFavorites = [favoriteItem, ...currentFavorites];
        action = "added";
        setIsFavorite(true);
      }
      
      // Update localStorage
      localStorage.setItem('foodPlaceFavorites', JSON.stringify(updatedFavorites));
      
      // Show success message
      alert(`${foodPlace.name} ${action === "added" ? "added to" : "removed from"} favorites!`);
      
    } catch (error) {
      console.error("Error updating favorites:", error);
      alert("Error updating favorites. Please try again.");
      
      // Revert the state change on error
      setIsFavorite(!isFavorite);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: foodPlace.name,
          text: `Check out ${foodPlace.name} on FoodSocial!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handlePlaceAddedToCollection = (place, collectionIds) => {
    console.log(`${place.name} added to ${collectionIds.length} collection(s)`);
    // You can add additional logic here if needed
    // For example, show a success notification or update the UI
  };

  const ensureCoffeeShopExists = async (foodPlace) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // First check if the coffee shop exists by placeId
      const checkResponse = await fetch(`${apiUrl}/api/coffee-shops?placeId=${foodPlace.placeId || foodPlace.id}`, {
        credentials: 'include'
      });

      if (checkResponse.ok) {
        const data = await checkResponse.json();
        const existingShops = data.coffeeShops || data || [];
        
        // Find shop with matching placeId
        const existingShop = existingShops.find(shop => 
          shop.placeId === (foodPlace.placeId || foodPlace.id) ||
          shop.id === parseInt(foodPlace.id)
        );
        
        if (existingShop) {
          console.log("Coffee shop exists:", existingShop.id);
          return existingShop.id;
        }
      }

      // Coffee shop doesn't exist, we need to create it
      // But since we can't use the admin endpoint, we'll create it through review submission
      console.log("Coffee shop doesn't exist, will create during review submission");
      return foodPlace.placeId || foodPlace.id; // Return the external ID for now
      
    } catch (error) {
      console.error("Error checking coffee shop:", error);
      return foodPlace.placeId || foodPlace.id;
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      alert("Please log in to write a review");
      navigate("/login");
      return;
    }
    
    if (!newReview.rating || !newReview.comment.trim() || !newReview.title.trim()) {
      alert("Please provide a rating, title, and comment");
      return;
    }
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      // Try a different approach - submit review with place data
      // The backend can create the coffee shop if it doesn't exist
      const reviewPayload = {
        // Coffee shop data for creation if needed
        coffeeShopData: {
          placeId: foodPlace.placeId || foodPlace.id,
          name: foodPlace.name,
          address: foodPlace.address,
          latitude: parseFloat(foodPlace.latitude) || 42.3601,
          longitude: parseFloat(foodPlace.longitude) || -71.0589,
          phone: foodPlace.phone || null,
          website: foodPlace.website || null,
          imageUrl: foodPlace.imageUrl || null,
          rating: parseFloat(foodPlace.rating) || null,
          priceLevel: parseInt(foodPlace.priceLevel) || null,
          city: foodPlace.city || "Boston",
          state: foodPlace.state || "MA",
          country: "US"
        },
        // Review data
        rating: parseInt(newReview.rating),
        title: newReview.title.trim(),
        comment: newReview.comment.trim(),
        visitDate: newReview.visitDate || null,
        isRecommended: true
      };

      console.log("Submitting review with coffee shop data:", reviewPayload);

      const response = await fetch(`${apiUrl}/api/reviews/create-with-place`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(reviewPayload)
      });

      console.log("Review submission response status:", response.status);

      if (response.ok) {
        const submittedReview = await response.json();
        console.log("Review submitted successfully:", submittedReview);
        
        const reviewWithUser = {
          ...submittedReview.review,
          user: { 
            id: user.id,
            username: user.username 
          }
        };
        
        setReviews([reviewWithUser, ...reviews]);
        setNewReview({ rating: '', title: '', comment: '', visitDate: '' });
        setShowReviewForm(false);
        alert("Review submitted successfully!");
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error("Failed to submit review:", errorData);
        
        // Fallback: Try the regular review endpoint with just basic data
        console.log("Trying fallback approach...");
        await tryFallbackReviewSubmission();
      }
    } catch (error) {
      console.log("API submission failed:", error);
      // Try fallback approach
      await tryFallbackReviewSubmission();
    }
  };

  const tryFallbackReviewSubmission = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // Use a simpler approach - try to find existing coffee shop by name/address
      const searchResponse = await fetch(`${apiUrl}/api/coffee-shops?name=${encodeURIComponent(foodPlace.name)}`, {
        credentials: 'include'
      });

      let coffeeShopId = null;

      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        const coffeeShops = searchData.coffeeShops || searchData || [];
        const matchingShop = coffeeShops.find(shop => 
          shop.name.toLowerCase() === foodPlace.name.toLowerCase() ||
          shop.address.toLowerCase().includes(foodPlace.address.toLowerCase().substring(0, 20))
        );
        
        if (matchingShop) {
          coffeeShopId = matchingShop.id;
          console.log("Found existing coffee shop by name/address:", coffeeShopId);
        }
      }

      if (!coffeeShopId) {
        // Still no coffee shop found, show error message
        alert("This place is not yet in our database. Please contact support to add it, or try reviewing a different place.");
        return;
      }

      // Now try to submit the review with the found coffee shop ID
      const reviewPayload = {
        coffeeShopId: coffeeShopId,
        rating: parseInt(newReview.rating),
        title: newReview.title.trim(),
        comment: newReview.comment.trim(),
        visitDate: newReview.visitDate || null,
        isRecommended: true
      };

      const response = await fetch(`${apiUrl}/api/reviews`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(reviewPayload)
      });

      if (response.ok) {
        const submittedReview = await response.json();
        console.log("Review submitted successfully (fallback):", submittedReview);
        
        const reviewWithUser = {
          ...submittedReview.review,
          user: { 
            id: user.id,
            username: user.username 
          }
        };
        
        setReviews([reviewWithUser, ...reviews]);
        setNewReview({ rating: '', title: '', comment: '', visitDate: '' });
        setShowReviewForm(false);
        alert("Review submitted successfully!");
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        alert(errorData.message || "Failed to submit review. This place may not be available for reviews yet.");
      }

    } catch (error) {
      console.error("Fallback submission failed:", error);
      alert("Unable to submit review. Please try again later.");
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="d-flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            className={star <= rating ? "text-warning" : "text-muted"}
            fill={star <= rating ? "currentColor" : "none"}
          />
        ))}
      </div>
    );
  };

  const renderPriceLevel = (level) => {
    return (
      <div className="d-flex align-items-center">
        {[1, 2, 3, 4].map((price) => (
          <DollarSign
            key={price}
            size={16}
            className={price <= level ? "text-success" : "text-muted"}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Utensils size={64} style={{ color: "#FFD700" }} className="mb-3" />
          <h4 className="text-muted">Loading food place details...</h4>
          <div className="spinner-border" style={{ color: "#FFD700" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  };

  if (error || !foodPlace) {
    return (
      <div className="container-fluid py-4" style={{ marginTop: '80px' }}>
        <div className="container">
          <div className="text-center py-5">
            <Utensils size={64} className="text-danger mb-3" />
            <h4 className="text-danger mb-3">Food Place Not Found</h4>
            <p className="text-muted mb-4">
              {error || "The food place you're looking for doesn't exist or has been removed."}
            </p>
            <button 
              className="btn rounded-pill px-4 text-dark fw-bold"
              onClick={() => navigate('/search-food-places')}
              style={{ backgroundColor: "#FFD700", border: "none" }}
            >
              Find Other Food Places
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ marginTop: '80px' }}>
      <div className="container">
        {/* Back Button */}
        <button
          className="btn btn-outline-secondary rounded-circle mb-4"
          onClick={() => navigate(-1)}
          style={{ width: '48px', height: '48px' }}
        >
          <ArrowLeft size={20} />
        </button>

        {/* Main Food Place Card */}
        <div className="card shadow-lg mb-5" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          {/* Hero Image */}
          <div className="position-relative">
            <img
              src={foodPlace.imageUrl || getImageForCategory(foodPlace.category)}
              alt={foodPlace.name}
              className="w-100"
              style={{ height: '400px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = getImageForCategory(foodPlace.category);
              }}
            />
            
            {/* Action Buttons Overlay */}
            <div className="position-absolute top-0 end-0 m-4">
              <div className="d-flex gap-2">
                <button
                  className={`btn rounded-circle ${isFavorite ? 'text-white' : 'text-dark'}`}
                  onClick={handleAddToFavorites}
                  style={{ 
                    backgroundColor: isFavorite ? "#dc3545" : "#FFD700",
                    border: "none",
                    width: '50px',
                    height: '50px',
                    transition: 'all 0.3s ease'
                  }}
                  title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart 
                    size={20} 
                    fill={isFavorite ? "currentColor" : "none"}
                    className={isFavorite ? "text-white" : ""}
                  />
                </button>
                <button
                  className="btn rounded-circle text-dark"
                  onClick={handleShare}
                  style={{ 
                    backgroundColor: "#FFD700",
                    border: "none",
                    width: '50px',
                    height: '50px'
                  }}
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Category Badge */}
            <div className="position-absolute bottom-0 start-0 m-4">
              <span 
                className="badge px-3 py-2 text-dark fw-bold"
                style={{ 
                  backgroundColor: "#FFD700",
                  fontSize: '0.9rem',
                  borderRadius: '15px'
                }}
              >
                {foodPlace.category.charAt(0).toUpperCase() + foodPlace.category.slice(1)}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="card-body p-5">
            <div className="row">
              <div className="col-lg-8">
                {/* Header */}
                <div className="mb-4">
                  <h1 className="fw-bold mb-2">{foodPlace.name}</h1>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    {renderStars(foodPlace.rating)}
                    <span className="fw-semibold">{foodPlace.rating}/5</span>
                    <span className="text-muted">({reviews.length} reviews)</span>
                    {renderPriceLevel(foodPlace.priceLevel)}
                  </div>
                  {foodPlace.cuisine && (
                    <p className="text-muted fs-5 mb-3">{foodPlace.cuisine}</p>
                  )}
                  {foodPlace.description && (
                    <p className="lead">{foodPlace.description}</p>
                  )}
                </div>

                {/* Contact Information */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-3">
                      <MapPin size={20} className="text-muted me-3" />
                      <div>
                        <strong>Address</strong><br />
                        <span className="text-muted">{foodPlace.address}</span>
                      </div>
                    </div>
                    
                    {foodPlace.phone && (
                      <div className="d-flex align-items-center mb-3">
                        <Phone size={20} className="text-muted me-3" />
                        <div>
                          <strong>Phone</strong><br />
                          <a href={`tel:${foodPlace.phone}`} className="text-decoration-none">
                            {foodPlace.phone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="col-md-6">
                    {foodPlace.website && (
                      <div className="d-flex align-items-center mb-3">
                        <Globe size={20} className="text-muted me-3" />
                        <div>
                          <strong>Website</strong><br />
                          <a 
                            href={foodPlace.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                          >
                            Visit Website
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {foodPlace.distance && (
                      <div className="d-flex align-items-center mb-3">
                        <MapPin size={20} className="text-muted me-3" />
                        <div>
                          <strong>Distance</strong><br />
                          <span className="text-muted">{foodPlace.distance} km away</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Opening Hours */}
                {foodPlace.openingHours && (
                  <div className="mb-4">
                    <h5 className="mb-3"><Clock size={20} className="me-2" />Opening Hours</h5>
                    <div className="row">
                      {Object.entries(foodPlace.openingHours).map(([day, hours]) => (
                        <div key={day} className="col-md-6 mb-2">
                          <div className="d-flex justify-content-between">
                            <span className="fw-semibold text-capitalize">{day}:</span>
                            <span className="text-muted">{hours}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amenities */}
                {foodPlace.amenities && (
                  <div className="mb-4">
                    <h5 className="mb-3">Amenities</h5>
                    <div className="row">
                      {Object.entries(foodPlace.amenities).map(([amenity, available]) => (
                        available && (
                          <div key={amenity} className="col-md-4 mb-2">
                            <div className="d-flex align-items-center">
                              {amenity === 'wifi' && <Wifi size={16} className="me-2 text-success" />}
                              {amenity === 'parking' && <Car size={16} className="me-2 text-success" />}
                              {amenity === 'creditCards' && <CreditCard size={16} className="me-2 text-success" />}
                              {amenity === 'outdoorSeating' && <Users size={16} className="me-2 text-success" />}
                              <span className="text-capitalize">{amenity.replace(/([A-Z])/g, ' $1').trim()}</span>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Sidebar */}
              <div className="col-lg-4">
                <div className="sticky-top" style={{ top: '100px' }}>
                  <div className="card border-0 shadow">
                    <div className="card-body">
                      <h5 className="mb-3">Quick Actions</h5>
                      
                      <div className="d-grid gap-2 mb-3">
                        <button 
                          className="btn text-dark fw-bold"
                          onClick={() => window.open(`https://maps.google.com/?q=${foodPlace.latitude},${foodPlace.longitude}`, '_blank')}
                          style={{ backgroundColor: "#FFD700", border: "none" }}
                        >
                          <MapPin size={16} className="me-2" />
                          Get Directions
                        </button>
                        
                        {foodPlace.phone && (
                          <button 
                            className="btn text-dark fw-bold"
                            onClick={() => window.open(`tel:${foodPlace.phone}`)}
                            style={{ backgroundColor: "#FFD700", border: "none" }}
                          >
                            <Phone size={16} className="me-2" />
                            Call Now
                          </button>
                        )}
                        
                        <button 
                          className="btn text-dark fw-bold"
                          onClick={() => setShowReviewForm(!showReviewForm)}
                          style={{ backgroundColor: "#FFD700", border: "none" }}
                        >
                          <Star size={16} className="me-2" />
                          Write Review
                        </button>

                        {/* Add to Collection Button */}
                        {isAuthenticated() && (
                          <button 
                            className="btn text-dark fw-bold"
                            onClick={() => setShowCollectionModal(true)}
                            style={{ backgroundColor: "#FFD700", border: "none" }}
                          >
                            <Folder size={16} className="me-2" />
                            Add to Collection
                          </button>
                        )}

                        <button 
                          className={`btn fw-bold ${isFavorite ? 'text-white' : 'text-dark'}`}
                          onClick={handleAddToFavorites}
                          style={{ 
                            backgroundColor: isFavorite ? "#dc3545" : "#FFD700", 
                            border: "none",
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <Heart size={16} className="me-2" fill={isFavorite ? "currentColor" : "none"} />
                          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                        </button>
                      </div>

                      {/* Quick Stats */}
                      <div className="border-top pt-3">
                        <div className="row text-center">
                          <div className="col-6">
                            <div className="fw-bold">{foodPlace.rating}</div>
                            <div className="small text-muted">Rating</div>
                          </div>
                          <div className="col-6">
                            <div className="fw-bold">{reviews.length}</div>
                            <div className="small text-muted">Reviews</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Form - ONLY CHANGE: This form now appears inline */}
        {showReviewForm && (
          <div className="card shadow mb-5" style={{ borderRadius: '15px' }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5>Write a Review for {foodPlace.name}</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowReviewForm(false)}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleReviewSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Overall Rating *</label>
                    <div className="d-flex align-items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={24}
                          className={`me-1 cursor-pointer ${
                            star <= newReview.rating ? "text-warning" : "text-muted"
                          }`}
                          fill={star <= newReview.rating ? "currentColor" : "none"}
                          onClick={() => setNewReview({...newReview, rating: star})}
                          style={{ cursor: 'pointer' }}
                        />
                      ))}
                      <span className="ms-2 text-muted">
                        {newReview.rating ? `${newReview.rating}/5` : "Click to rate"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Visit Date</label>
                    <input 
                      type="date"
                      className="form-control"
                      value={newReview.visitDate}
                      onChange={(e) => setNewReview({...newReview, visitDate: e.target.value})}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Review Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Summarize your experience"
                    value={newReview.title}
                    onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                    maxLength={100}
                    required
                  />
                  <div className="form-text">{newReview.title.length}/100 characters</div>
                </div>
                
                <div className="mb-4">
                  <label className="form-label fw-semibold">Your Review *</label>
                  <textarea 
                    className="form-control"
                    rows="4"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    placeholder="Share your experience..."
                    maxLength={1000}
                    required
                  />
                  <div className="form-text">{newReview.comment.length}/1000 characters</div>
                </div>

                <div className="d-flex gap-2">
                  <button 
                    type="submit" 
                    className="btn text-dark fw-bold"
                    disabled={!newReview.rating || !newReview.comment || !newReview.title}
                    style={{ backgroundColor: "#FFD700", border: "none" }}
                  >
                    Submit Review
                  </button>
                  <button 
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="card shadow mb-5" style={{ borderRadius: '15px' }}>
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4>Customer Reviews ({reviews.length})</h4>
              <button 
                className="btn text-dark fw-bold"
                onClick={() => setShowReviewForm(!showReviewForm)}
                style={{ backgroundColor: "#FFD700", border: "none" }}
              >
                <Plus size={16} className="me-2" />
                Write Review
              </button>
            </div>
            
            {reviews.length === 0 ? (
              <div className="text-center py-4">
                <Star size={48} className="text-muted mb-3" />
                <p className="text-muted mb-3">No reviews yet. Be the first to review this place!</p>
                <button 
                  className="btn text-dark fw-bold"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  style={{ backgroundColor: "#FFD700", border: "none" }}
                >
                  <Plus size={16} className="me-2" />
                  Write First Review
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {reviews.map((review) => (
                  <div key={review.id} className="col-md-6">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="mb-1">{review.user.username}</h6>
                            <div className="d-flex align-items-center">
                              {renderStars(review.rating)}
                              <span className="ms-2 small text-muted">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        {review.title && (
                          <h6 className="fw-semibold mb-2">{review.title}</h6>
                        )}
                        <p className="mb-0">{review.comment}</p>
                        {review.visitDate && (
                          <small className="text-muted">
                            Visited: {new Date(review.visitDate).toLocaleDateString()}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Similar Places Section */}
        <div className="mb-5">
          <h4 className="mb-4">Similar Places Nearby</h4>
          
          {similarPlaces.length === 0 ? (
            <div className="text-center py-4">
              <Utensils size={48} className="text-muted mb-3" />
              <p className="text-muted">No similar places found.</p>
            </div>
          ) : (
            <div className="row g-4">
              {similarPlaces.map((place) => (
                <div key={place.id} className="col-lg-4 col-md-6">
                  <div 
                    className="card h-100 border-0 shadow-sm"
                    style={{ 
                      borderRadius: '15px',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease'
                    }}
                    onClick={() => navigate(`/food-places/${place.id}`)}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <img
                      src={place.imageUrl || getImageForCategory(place.category)}
                      alt={place.name}
                      className="card-img-top"
                      style={{ 
                        height: '200px', 
                        objectFit: 'cover',
                        borderRadius: '15px 15px 0 0'
                      }}
                      onError={(e) => {
                        e.target.src = getImageForCategory(place.category);
                      }}
                    />
                    
                    {/* Distance Badge */}
                    <div 
                      className="position-absolute top-0 end-0 m-3 badge text-white"
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        fontSize: '0.75rem'
                      }}
                    >
                      {place.distance} km
                    </div>
                    
                    <div className="card-body">
                      <h5 className="card-title fw-bold mb-2">{place.name}</h5>
                      <p className="card-text text-muted small mb-2">
                        <MapPin size={14} className="me-1" />
                        {place.address}
                      </p>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          {renderStars(place.rating)}
                          <span className="ms-2 fw-semibold">{place.rating}</span>
                        </div>
                        {renderPriceLevel(place.priceLevel)}
                      </div>
                      
                      <button 
                        className="btn btn-sm w-100 mt-3 text-dark fw-bold"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/food-places/${place.id}`);
                        }}
                        style={{ backgroundColor: "#FFD700", border: "none" }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Collection Selector Modal */}
        <CollectionSelectorModal 
          show={showCollectionModal}
          onHide={() => setShowCollectionModal(false)}
          selectedPlace={foodPlace}
          onPlaceAddedToCollection={handlePlaceAddedToCollection}
        />
      </div>
    </div>
  );
}