// src/pages/recipes/RecipeList.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import RecipeCard from '../../components/RecipeCard';
import { getRecipes, getRecipesByCategory, searchRecipes } from '../../services/recipes';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { category } = useParams();
  const location = useLocation();
  
  // Get search query from URL if available
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q');
  
  // Set page title based on whether it's a category view or search results
  const pageTitle = category 
    ? `${category} Recipes` 
    : searchQuery 
      ? `Search Results for "${searchQuery}"` 
      : 'All Recipes';
  
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        let recipeData;
        
        if (category) {
          // Get recipes by category
          recipeData = await getRecipesByCategory(category);
        } else if (searchQuery) {
          // Get recipes by search query
          recipeData = await searchRecipes(searchQuery);
        } else {
          // Get generic recipes (random in this case)
          recipeData = await getRecipes();
        }
        
        setRecipes(recipeData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError('Failed to load recipes. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchRecipes();
  }, [category, searchQuery]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <p className="ml-3 text-gray-600">Loading recipes...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition duration-300"
        >
          Back to Home
        </Link>
      </div>
    );
  }
  
  if (recipes.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{pageTitle}</h2>
        {searchQuery && (
          <p className="text-gray-600 mb-6">No recipes found matching "{searchQuery}".</p>
        )}
        {category && (
          <p className="text-gray-600 mb-6">No recipes found in the {category} category.</p>
        )}
        {!searchQuery && !category && (
          <p className="text-gray-600 mb-6">No recipes available at the moment.</p>
        )}
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition duration-300"
        >
          Back to Home
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">{pageTitle}</h1>
          
          {searchQuery && (
            <p className="mt-2 text-gray-600">
              Found {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} for "{searchQuery}"
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <RecipeCard 
              key={recipe.idMeal || recipe.id} 
              recipe={recipe} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeList;