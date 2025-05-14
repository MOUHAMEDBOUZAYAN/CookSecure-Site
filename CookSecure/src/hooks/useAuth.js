// src/hooks/useAuth.js
import { useState, useEffect, useContext, createContext } from 'react';
import React from 'react';
import axios from 'axios';
import { updateUserProfile as apiUpdateUserProfile, updateLocalStorageUser } from '../services/users';

// Create an auth context
const AuthContext = createContext(null);

// Auth provider component (using React.createElement instead of JSX)
export const AuthProvider = (props) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Load favorites from localStorage
      const storedFavorites = localStorage.getItem(`favorites_${parsedUser.id}`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      // For JSON Server, we need to find the user by email first
      const response = await axios.get(`/api/users?email=${email}`);
      
      if (response.data.length === 0) {
        return { success: false, error: 'User not found' };
      }
      
      const userData = response.data[0];
      
      if (userData.password !== password) { // In a real app, use proper password hashing
        return { success: false, error: 'Invalid password' };
      }
      
      // Remove password from user data before storing
      const { password: _, ...userWithoutPassword } = userData;
      
      // Store user in state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      // Load favorites from localStorage
      const storedFavorites = localStorage.getItem(`favorites_${userWithoutPassword.id}`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  // Register function (with role support)
  const register = async (email, password, name, role = 'user') => {
    try {
      // Check if user already exists
      const checkUser = await axios.get(`/api/users?email=${email}`);
      
      if (checkUser.data.length > 0) {
        throw new Error('User with this email already exists');
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(), // Simple ID generation
        email,
        password, // In a real app, use proper password hashing
        name,
        role // Include the role field
      };
      
      // Save user to database
      const response = await axios.post('/api/users', newUser);
      
      // Initialize empty favorites for the new user
      localStorage.setItem(`favorites_${newUser.id}`, JSON.stringify([]));
      
      // Return success without logging in
      return { success: true, user: response.data };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setFavorites([]);
    localStorage.removeItem('user');
  };

  // Nouvelle fonction pour mettre à jour le profil utilisateur
  const updateUserProfile = async (userData) => {
    try {
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }
      
      // Appeler l'API pour mettre à jour le profil
      const updatedUserData = await apiUpdateUserProfile(user.id, userData);
      
      if (updatedUserData) {
        // Créer un nouvel objet utilisateur avec les données mises à jour
        const updatedUser = { ...user, ...userData };
        
        // Mettre à jour l'état local
        setUser(updatedUser);
        
        // Mettre à jour localStorage
        updateLocalStorageUser(userData);
        
        return { success: true, user: updatedUser };
      }
      
      return { success: false, error: 'Failed to update user profile' };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message || 'Update failed' };
    }
  };

  // Check if user is a chef or admin (for creating/editing recipes)
  const canManageRecipes = () => {
    return user && (user.role === 'chef' || user.role === 'admin');
  };

  // Check if user can edit a specific recipe
  const canEditRecipe = (recipe) => {
    // Only the recipe creator (if chef or admin) can edit
    if (!user) return false;
    if (user.role === 'admin') return true; // Admins can edit any recipe
    if (user.role === 'chef' && recipe.userId === user.id) return true;
    return false;
  };

  // Add recipe to favorites
  const addToFavorites = (recipe) => {
    if (!user) return false;
    
    const recipeId = recipe.idMeal || recipe.id;
    
    // Check if already in favorites
    if (favorites.some(fav => (fav.idMeal || fav.id) === recipeId)) {
      return false;
    }
    
    const newFavorites = [...favorites, recipe];
    setFavorites(newFavorites);
    
    // Save to localStorage
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
    
    return true;
  };

  // Remove recipe from favorites
  const removeFromFavorites = (recipeId) => {
    if (!user) return false;
    
    const newFavorites = favorites.filter(recipe => {
      const id = recipe.idMeal || recipe.id;
      return id !== recipeId;
    });
    
    setFavorites(newFavorites);
    
    // Save to localStorage
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
    
    return true;
  };

  // Check if a recipe is in favorites
  const isFavorite = (recipeId) => {
    return favorites.some(recipe => (recipe.idMeal || recipe.id) === recipeId);
  };

  // Get all favorites
  const getFavorites = () => {
    return favorites;
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    canManageRecipes,
    canEditRecipe,
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavorites,
    updateUserProfile // Exposer la nouvelle fonction
  };

  // Use React.createElement instead of JSX
  return React.createElement(
    AuthContext.Provider,
    { value: value },
    props.children
  );
};

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};