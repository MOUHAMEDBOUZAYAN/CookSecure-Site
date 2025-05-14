// src/services/users.js
import axios from 'axios';

const API_URL = '/api/users';

// Gérer les erreurs API
const handleApiError = (error, message) => {
  console.error(message, error);
  if (error.response) {
    console.error('Server responded with:', error.response.status, error.response.data);
  } else if (error.request) {
    console.error('No response received:', error.request);
  }
  return error;
};

// Obtenir un utilisateur par ID
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, `Error fetching user with ID ${userId}:`);
    throw error;
  }
};

// Mettre à jour le profil utilisateur
export const updateUserProfile = async (userId, userData) => {
  try {
    const response = await axios.patch(`${API_URL}/${userId}`, userData);
    return response.data;
  } catch (error) {
    handleApiError(error, `Error updating user profile for ID ${userId}:`);
    throw error;
  }
};

// Vérifier le mot de passe actuel
export const verifyCurrentPassword = async (userId, password) => {
  try {
    const user = await getUserById(userId);
    // Dans une vraie application, la vérification du mot de passe serait faite sur le serveur
    // Ce code est une simulation pour la démo
    return user.password === password;
  } catch (error) {
    handleApiError(error, `Error verifying password for user ID ${userId}:`);
    throw error;
  }
};

// Mettre à jour le mot de passe
export const updateUserPassword = async (userId, newPassword) => {
  try {
    const response = await axios.patch(`${API_URL}/${userId}`, { password: newPassword });
    return response.data;
  } catch (error) {
    handleApiError(error, `Error updating password for user ID ${userId}:`);
    throw error;
  }
};

// Mettre à jour les données utilisateur dans le localStorage
export const updateLocalStorageUser = (userData) => {
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const updatedUser = { ...parsedUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    }
    return null;
  } catch (error) {
    console.error('Error updating user in localStorage:', error);
    return null;
  }
};