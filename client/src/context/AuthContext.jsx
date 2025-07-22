import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState({
    unit: 'km',
    defaultRadius: 5,
    favoriteCategories: []
  });
  const navigate = useNavigate();

  // Function to fetch logged-in user
  const fetchUser = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        
        // Set user preferences if available
        if (userData.preferences) {
          setUserPreferences(prev => ({
            ...prev,
            ...userData.preferences
          }));
        }
      } else {
        setUser(null);
        // Reset to default preferences if no user
        setUserPreferences({
          unit: 'km',
          defaultRadius: 5,
          favoriteCategories: []
        });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (response.ok) {
        await fetchUser(); // Fetch user data after login
        return { success: true, response };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Login failed' };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      const data = await response.json();
      
      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Update user preferences
  const updateUserPreferences = async (newPreferences) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/preferences`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: newPreferences }),
        credentials: "include",
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser.user);
        setUserPreferences(prev => ({
          ...prev,
          ...newPreferences
        }));
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Failed to update preferences' };
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setUserPreferences({
        unit: 'km',
        defaultRadius: 5,
        favoriteCategories: []
      });
      navigate("/");
    }
  };

  // Helper functions for coffee shop features
  const isAuthenticated = () => !!user;
  
  const getUserId = () => user?.id;
  
  const getPreferredUnit = () => userPreferences.unit || 'km';
  
  const getDefaultRadius = () => userPreferences.defaultRadius || 5;

  const contextValue = {
    // User data
    user,
    loading,
    userPreferences,
    
    // Authentication functions
    login,
    register,
    logout,
    fetchUser,
    
    // Preferences
    updateUserPreferences,
    
    // Helper functions
    isAuthenticated,
    getUserId,
    getPreferredUnit,
    getDefaultRadius
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuthUser() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthUser must be used within an AuthProvider');
  }
  return context;
}

// Alternative export for backward compatibility
export { useAuthUser as useAuth };