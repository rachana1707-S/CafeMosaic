import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuthUser } from "./AuthContext";

const CoffeeShopContext = createContext();

export function useCoffeeShops() {
  const context = useContext(CoffeeShopContext);
  if (!context) {
    throw new Error('useCoffeeShops must be used within a CoffeeShopProvider');
  }
  return context;
}

export function CoffeeShopProvider({ children }) {
  // Coffee shop data
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [collections, setCollections] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [visits, setVisits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  
  // Error states
  const [error, setError] = useState(null);

  const { user, isAuthenticated } = useAuthUser();

  // Load initial data when user logs in
  useEffect(() => {
    if (isAuthenticated()) {
      loadUserData();
    } else {
      // Clear user-specific data when logged out
      setFavorites([]);
      setCollections([]);
      setReviews([]);
      setVisits([]);
      setSearchHistory([]);
    }
  }, [user]);

  // Load user-specific data
  const loadUserData = async () => {
    if (!user?.id) return;

    try {
      await Promise.all([
        loadFavorites(),
        loadCollections(),
        loadUserReviews(),
        loadUserVisits(),
        loadSearchHistory()
      ]);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Load categories (public data)
  const loadCategories = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Search coffee shops - FIXED VERSION
  const searchCoffeeShops = async (searchParams) => {
    console.log("🔍 Frontend search called with:", searchParams);
    setLoading(true);
    setError(null);
    
    try {
      // Build URL parameters
      const params = new URLSearchParams();
      
      // Add parameters that exist and are not empty
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] && searchParams[key] !== "") {
          params.append(key, searchParams[key]);
        }
      });
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const fullUrl = `${apiUrl}/api/search?${params.toString()}`;
      
      console.log("🌐 API URL:", fullUrl);
      console.log("🔑 VITE_API_URL:", import.meta.env.VITE_API_URL);
      console.log("📋 Search params object:", searchParams);
      console.log("📋 URL params string:", params.toString());
      
      const response = await fetch(fullUrl, { 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("📡 Response status:", response.status);
      console.log("📡 Response ok:", response.ok);
      
      const data = await response.json();
      console.log("📦 Response data:", data);
      
      if (response.ok && data.success) {
        const shops = data.coffeeShops || [];
        console.log("✅ Setting coffee shops:", shops.length);
        console.log("✅ First shop:", shops[0]);
        setCoffeeShops(shops);
        return data;
      } else {
        console.error("❌ API returned error:", data);
        throw new Error(data.error || `HTTP ${response.status}: Search failed`);
      }
    } catch (error) {
      console.error("❌ Frontend search error:", error);
      setError(error.message);
      setCoffeeShops([]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Favorites management
  const loadFavorites = async () => {
    if (!user?.id) return;
    
    setFavoritesLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(
        `${apiUrl}/api/favorites/user/${user.id}`,
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || data);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setFavoritesLoading(false);
    }
  };

  const addToFavorites = async (coffeeShop) => {
    if (!isAuthenticated()) return { success: false, error: 'Please log in first' };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          coffeeShopId: coffeeShop.id,
          notes: ''
        })
      });

      if (response.ok) {
        await loadFavorites(); // Reload favorites
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const removeFromFavorites = async (coffeeShopId) => {
    if (!isAuthenticated()) return { success: false, error: 'Please log in first' };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(
        `${apiUrl}/api/favorites/${coffeeShopId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      if (response.ok) {
        setFavorites(prev => prev.filter(fav => fav.coffeeShopId !== coffeeShopId));
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const isFavorite = (coffeeShopId) => {
    return favorites.some(fav => fav.coffeeShopId === coffeeShopId || fav.coffeeShop?.id === coffeeShopId);
  };

  // Collections management
  const loadCollections = async () => {
    if (!user?.id) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(
        `${apiUrl}/api/collections/user/${user.id}`,
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const data = await response.json();
        setCollections(data.collections || data);
      }
    } catch (error) {
      console.error('Error loading collections:', error);
    }
  };

  const createCollection = async (collectionData) => {
    if (!isAuthenticated()) return { success: false, error: 'Please log in first' };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(collectionData)
      });

      if (response.ok) {
        const data = await response.json();
        await loadCollections(); // Reload collections
        return { success: true, collection: data.collection || data };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  // Reviews management
  const loadUserReviews = async () => {
    if (!user?.id) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(
        `${apiUrl}/api/reviews/user/${user.id}`,
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || data);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const addReview = async (reviewData) => {
    if (!isAuthenticated()) return { success: false, error: 'Please log in first' };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        await loadUserReviews(); // Reload reviews
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  // Visits management
  const loadUserVisits = async () => {
    if (!user?.id) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(
        `${apiUrl}/api/visits/user/${user.id}`,
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const data = await response.json();
        setVisits(data.visits || data);
      }
    } catch (error) {
      console.error('Error loading visits:', error);
    }
  };

  const logVisit = async (visitData) => {
    if (!isAuthenticated()) return { success: false, error: 'Please log in first' };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/visits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(visitData)
      });

      if (response.ok) {
        await loadUserVisits(); // Reload visits
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  // Search history
  const loadSearchHistory = async () => {
    if (!user?.id) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(
        `${apiUrl}/api/search/history`,
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const data = await response.json();
        setSearchHistory(data.history || data);
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  // Helper functions
  const getCoffeeShopById = (id) => {
    return coffeeShops.find(shop => shop.id === id);
  };

  const getUserStats = () => {
    return {
      favoritesCount: favorites.length,
      reviewsCount: reviews.length,
      visitsCount: visits.length,
      collectionsCount: collections.length
    };
  };

  // Initialize categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const contextValue = {
    // Data
    coffeeShops,
    favorites,
    collections,
    reviews,
    visits,
    categories,
    searchHistory,

    // Loading states
    loading,
    favoritesLoading,
    error,

    // Coffee shop functions
    searchCoffeeShops,
    getCoffeeShopById,

    // Favorites
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    loadFavorites,

    // Collections
    createCollection,
    loadCollections,

    // Reviews
    addReview,
    loadUserReviews,

    // Visits
    logVisit,
    loadUserVisits,

    // Categories
    loadCategories,

    // Search history
    loadSearchHistory,

    // Helper functions
    getUserStats,
    loadUserData
  };

  return (
    <CoffeeShopContext.Provider value={contextValue}>
      {children}
    </CoffeeShopContext.Provider>
  );
}