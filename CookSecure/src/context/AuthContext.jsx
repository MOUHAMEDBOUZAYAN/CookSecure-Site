// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
export const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  // Check if user is already logged in from localStorage and load favorites
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    }
    setLoading(false);
  }, []);

  // Persist favorites to localStorage whenever it changes
  useEffect(() => {
    if (favorites !== null) { // Avoid saving initial null/empty state if not loaded yet
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  // Login function
  const login = async (email, password) => {
    try {
      // For this example, we're simulating authentication
      // In a real app, this would make an API call to your backend
      
      // Simulate API call
      const userData = {
        id: '1',
        name: 'Demo User',
        email: email,
        // Don't store password in state
      };
      
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Load user-specific favorites after login (if applicable)
      // For this example, we'll just clear or load default favorites
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
         setFavorites(JSON.parse(storedFavorites));
      } else {
         setFavorites([]); // Start with empty favorites for new user
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Invalid credentials' };
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      // For this example, we're simulating registration
      // In a real app, this would make an API call to your backend
      
      // Simulate API call
      const userData = {
        id: Date.now().toString(),
        name: name,
        email: email,
        // Don't store password in state
      };
      
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setFavorites([]); // New user starts with empty favorites
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('favorites');
    setUser(null);
    setFavorites([]);
  };

  // Add recipe to favorites
  const addFavorite = (recipe) => {
    const recipeId = recipe?.idMeal || recipe?.id;
    if (!favorites.some(fav => (fav.idMeal || fav.id) === recipeId)) {
      setFavorites(prevFavorites => [...prevFavorites, recipe]);
    }
  };

  // Remove recipe from favorites
  const removeFavorite = (recipeId) => {
    setFavorites(prevFavorites => prevFavorites.filter(fav => (fav.idMeal || fav.id) !== recipeId));
  };

  // Create the context value
  const value = {
    user,
    login,
    register,
    logout,
    loading,
    favorites,
    addFavorite,
    removeFavorite
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook moved to src/hooks/useAuth.js

export default AuthContext;