// File: src/services/recipes.js
// This file will handle all API calls to TheMealDB and local db.json

import axios from 'axios';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';
const LOCAL_API_URL = 'http://localhost:3001'; // for json-server

// Get random recipes for homepage
export const getRandomRecipes = async (count = 8) => {
  try {
    const recipes = [];
    // TheMealDB only returns one random meal per call, so we need to make multiple calls
    for (let i = 0; i < count; i++) {
      const response = await axios.get(`${API_BASE_URL}/random.php`);
      const meal = response.data.meals[0];
      // Avoid duplicates
      if (!recipes.some(recipe => recipe.idMeal === meal.idMeal)) {
        recipes.push(meal);
      } else {
        i--; // Try again
      }
    }
    return recipes;
  } catch (error) {
    console.error('Error fetching random recipes:', error);
    return [];
  }
};


export const getRecipes = async (params = {}) => {
  try {
    const { category, query, limit } = params;
    
    // If category is provided, get recipes by category
    if (category) {
      return getRecipesByCategory(category);
    }
    
    // If search query is provided, search recipes
    if (query) {
      return searchRecipes(query);
    }
    
    // Default: get random recipes
    return getRandomRecipes(limit || 10);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
};

// Get recipe categories
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories.php`);
    return response.data.categories.slice(0, 8); // Limit to 8 categories for UI
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Get recipes by category
export const getRecipesByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/filter.php?c=${category}`);
    return response.data.meals || [];
  } catch (error) {
    console.error(`Error fetching recipes for category ${category}:`, error);
    return [];
  }
};

// Get recipe details by ID
export const getRecipeById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/lookup.php?i=${id}`);
    return response.data.meals ? response.data.meals[0] : null;
  } catch (error) {
    console.error(`Error fetching recipe details for ID ${id}:`, error);
    return null;
  }
};

// Search recipes by name
export const searchRecipes = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search.php?s=${query}`);
    return response.data.meals || [];
  } catch (error) {
    console.error(`Error searching recipes with query ${query}:`, error);
    return [];
  }
};

// Get user-created recipes from db.json
export const getUserRecipes = async () => {
  try {
    const response = await axios.get(`${LOCAL_API_URL}/recipes`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    return [];
  }
};

// Add a new recipe to db.json
export const addRecipe = async (recipe) => {
  try {
    const response = await axios.post(`${LOCAL_API_URL}/recipes`, {
      ...recipe,
      id: Date.now().toString(), // Simple unique ID generation
      date: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('Error adding recipe:', error);
    throw error;
  }
};

// Update existing recipe in db.json
export const updateRecipe = async (id, recipe) => {
  try {
    const response = await axios.put(`${LOCAL_API_URL}/recipes/${id}`, recipe);
    return response.data;
  } catch (error) {
    console.error(`Error updating recipe with ID ${id}:`, error);
    throw error;
  }
};

// Delete recipe from db.json
export const deleteRecipe = async (id) => {
  try {
    await axios.delete(`${LOCAL_API_URL}/recipes/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting recipe with ID ${id}:`, error);
    throw error;
  }
};

// Format recipe data - convert API response to our app format
export const formatRecipeData = (apiRecipe) => {
  // TheMealDB API has ingredients and measures in separate fields (strIngredient1, strMeasure1, etc.)
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