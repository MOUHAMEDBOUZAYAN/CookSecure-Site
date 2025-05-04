// src/services/recipes.js
import axios from 'axios';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';
const LOCAL_API_URL = 'http://localhost:3001'; // json-server URL

// Helper function to handle API errors
const handleApiError = (error, message) => {
  console.error(message, error);
  if (error.response) {
    console.error('Server responded with:', error.response.status, error.response.data);
  } else if (error.request) {
    console.error('No response received:', error.request);
  }
  return error;
};

// Validate recipe object to ensure it has necessary fields
const validateRecipe = (recipe) => {
  if (!recipe || typeof recipe !== 'object') return null;
  
  // Check if it has required fields
  if (!recipe.idMeal && !recipe.id) return null;
  
  // Return the recipe
  return recipe;
};

// Get all recipes (both API and local)
export const getRecipes = async (limit = 16) => {
  try {
    // Fetch from API first - search.php?s= returns a large set of meals
    let apiRecipes = [];
    try {
      const apiResponse = await axios.get(`${API_BASE_URL}/search.php?s=`);
      apiRecipes = apiResponse.data?.meals || [];
      console.log('API recipes count:', apiRecipes.length);
    } catch (apiError) {
      console.error('Error fetching API recipes:', apiError);
    }
    
    // Fetch local recipes
    let localRecipes = [];
    try {
      const localResponse = await axios.get(`${LOCAL_API_URL}/recipes`);
      localRecipes = localResponse.data || [];
      console.log('Local recipes count:', localRecipes.length);
    } catch (localError) {
      console.error('Error fetching local recipes:', localError);
    }
    
    // Filter out invalid recipes and combine
    const validApiRecipes = apiRecipes.filter(recipe => validateRecipe(recipe));
    const validLocalRecipes = localRecipes.filter(recipe => validateRecipe(recipe));
    
    const combinedRecipes = [...validLocalRecipes, ...validApiRecipes];
    console.log('Combined valid recipes count:', combinedRecipes.length);
    
    // Return limited number of recipes (or all if fewer than limit)
    return combinedRecipes.slice(0, limit);
  } catch (error) {
    handleApiError(error, 'Error in getRecipes:');
    return []; // Return empty array on error
  }
};

// Get random recipes
export const getRandomRecipes = async (count = 9) => {
  try {
    let recipes = [];
    
    // If count <= 1, just use the API's random endpoint
    if (count <= 1) {
      const response = await axios.get(`${API_BASE_URL}/random.php`);
      return response.data?.meals || [];
    }
    
    // For multiple recipes, we need to make multiple calls
    // TheMealDB only returns one random meal per call
    const promises = [];
    for (let i = 0; i < count; i++) {
      promises.push(axios.get(`${API_BASE_URL}/random.php`));
    }
    
    const results = await Promise.all(promises);
    
    // Extract meals from each response
    results.forEach(result => {
      if (result.data && result.data.meals && result.data.meals.length > 0) {
        recipes.push(result.data.meals[0]);
      }
    });
    
    return recipes;
  } catch (error) {
    handleApiError(error, 'Error fetching random recipes:');
    return [];
  }
};

// Get all categories
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories.php`);
    return response.data?.categories || [];
  } catch (error) {
    handleApiError(error, 'Error fetching categories:');
    return [];
  }
};

// Get recipes by category
export const getRecipesByCategory = async (category) => {
  try {
    let results = [];
    
    // Fetch API recipes
    try {
      const apiResponse = await axios.get(`${API_BASE_URL}/filter.php?c=${category}`);
      if (apiResponse.data && apiResponse.data.meals) {
        results = [...results, ...apiResponse.data.meals];
      }
    } catch (apiError) {
      console.error(`Error fetching API recipes for category ${category}:`, apiError);
    }
    
    // Fetch local recipes
    try {
      const localResponse = await axios.get(`${LOCAL_API_URL}/recipes?category=${category}`);
      if (localResponse.data) {
        results = [...results, ...localResponse.data];
      }
    } catch (localError) {
      console.error(`Error fetching local recipes for category ${category}:`, localError);
    }
    
    // Return filtered valid recipes
    return results.filter(recipe => validateRecipe(recipe));
  } catch (error) {
    handleApiError(error, `Error in getRecipesByCategory for ${category}:`);
    return [];
  }
};

// Get recipe details by ID
export const getRecipeById = async (id) => {
  // Try local database first
  try {
    const localResponse = await axios.get(`${LOCAL_API_URL}/recipes/${id}`);
    if (localResponse.data) {
      return localResponse.data;
    }
  } catch (localError) {
    console.log(`Recipe not found in local DB with ID ${id}, checking API...`);
  }
  
  // Then try API
  try {
    const apiResponse = await axios.get(`${API_BASE_URL}/lookup.php?i=${id}`);
    if (apiResponse.data && apiResponse.data.meals && apiResponse.data.meals.length > 0) {
      return apiResponse.data.meals[0];
    }
  } catch (apiError) {
    console.error(`Error fetching API recipe with ID ${id}:`, apiError);
  }
  
  // If we get here, recipe wasn't found
  throw new Error(`Recipe not found with ID ${id}`);
};

// Search recipes by name
export const searchRecipes = async (query) => {
  try {
    let results = [];
    
    // Search in API
    try {
      const apiResponse = await axios.get(`${API_BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
      if (apiResponse.data && apiResponse.data.meals) {
        results = [...results, ...apiResponse.data.meals];
      }
    } catch (apiError) {
      console.error(`Error searching API for "${query}":`, apiError);
    }
    
    // Search in local recipes
    try {
      const localResponse = await axios.get(`${LOCAL_API_URL}/recipes`);
      const allLocalRecipes = localResponse.data || [];
      
      // Filter local recipes by title or description matching query
      const matchingLocalRecipes = allLocalRecipes.filter(recipe => {
        const title = recipe.title?.toLowerCase() || '';
        const description = recipe.description?.toLowerCase() || '';
        const q = query.toLowerCase();
        return title.includes(q) || description.includes(q);
      });
      
      results = [...results, ...matchingLocalRecipes];
    } catch (localError) {
      console.error(`Error searching local recipes for "${query}":`, localError);
    }
    
    // Return filtered valid recipes
    return results.filter(recipe => validateRecipe(recipe));
  } catch (error) {
    handleApiError(error, `Error in searchRecipes for "${query}":`);
    return [];
  }
};

// Get user-created recipes
export const getUserRecipes = async (userId) => {
  try {
    // Get recipes filtered by userId
    const response = await axios.get(`${LOCAL_API_URL}/recipes?userId=${userId}`);
    return response.data || [];
  } catch (error) {
    handleApiError(error, `Error fetching recipes for user ${userId}:`);
    return [];
  }
};

// Add a new recipe
export const addRecipe = async (recipe) => {
  try {
    const newRecipe = {
      ...recipe,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    
    const response = await axios.post(`${LOCAL_API_URL}/recipes`, newRecipe);
    console.log('Recipe added successfully:', response.data);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error adding recipe:');
    throw error;
  }
};

// Update existing recipe
export const updateRecipe = async (id, recipe) => {
  try {
    const response = await axios.put(`${LOCAL_API_URL}/recipes/${id}`, recipe);
    return response.data;
  } catch (error) {
    handleApiError(error, `Error updating recipe ${id}:`);
    throw error;
  }
};

// Delete recipe
export const deleteRecipe = async (id) => {
  try {
    await axios.delete(`${LOCAL_API_URL}/recipes/${id}`);
    return true;
  } catch (error) {
    handleApiError(error, `Error deleting recipe ${id}:`);
    throw error;
  }
};

// Format recipe data from API
export const formatRecipeData = (apiRecipe) => {
  // Handle null/undefined recipe
  if (!apiRecipe) return null;
  
  // Extract ingredients from TheMealDB format
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = apiRecipe[`strIngredient${i}`];
    const measure = apiRecipe[`strMeasure${i}`];
    
    if (ingredient && ingredient.trim() !== '') {
      ingredients.push({
        name: ingredient,
        measure: measure || ''
      });
    }
  }
  
  return {
    id: apiRecipe.idMeal,
    title: apiRecipe.strMeal,
    category: apiRecipe.strCategory,
    area: apiRecipe.strArea,
    instructions: apiRecipe.strInstructions,
    image: apiRecipe.strMealThumb,
    tags: apiRecipe.strTags ? apiRecipe.strTags.split(',') : [],
    youtube: apiRecipe.strYoutube,
    ingredients,
    source: apiRecipe.strSource,
    dateModified: apiRecipe.dateModified
  };
};