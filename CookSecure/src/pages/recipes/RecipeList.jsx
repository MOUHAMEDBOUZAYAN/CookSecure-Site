// src/pages/recipes/RecipeList.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import RecipeCard from '../../components/RecipeCard';
import { getRecipes, getRecipesByCategory, searchRecipes, getUserRecipes } from '../../services/recipes';
import { useAuth } from '../../hooks/useAuth';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { category } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get search query from URL if available
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q');
  const userFilter = queryParams.get('user');
  
  // Set page title based on whether it's a category view, search results, or user recipes
  const pageTitle = category 
    ? `${category} Recipes` 
    : searchQuery 
      ? `Search Results for "${searchQuery}"`
      : userFilter === 'mine' && user
        ? `My Recipes`
        : 'All Recipes';
  
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        let recipeData = [];
        
        // Filter by user's own recipes if requested
        if (userFilter === 'mine' && user) {
          recipeData = await getUserRecipes(user.id);
        }
        // Filter by category
        else if (category) {
          recipeData = await getRecipesByCategory(category);
        } 
        // Search by query
        else if (searchQuery) {
          recipeData = await searchRecipes(searchQuery);
        } 
        // Get all recipes (both API and local)
        else {
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
  }, [category, searchQuery, userFilter, user]);
  
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
        {userFilter === 'mine' && (
          <p className="text-gray-600 mb-6">
            You haven't created any recipes yet.
            {user?.role === 'chef' || user?.role === 'admin' ? (
              <Link to="/add-recipe" className="ml-2 text-orange-500 hover:text-orange-600">
                Create your first recipe!
              </Link>
            ) : null}
          </p>
        )}
        {!searchQuery && !category && !userFilter && (
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
          
          {/* If chef/admin logged in, show link to view their recipes or add new ones */}
          {user && (user.role === 'chef' || user.role === 'admin') && (
            <div className="mt-4 flex flex-wrap gap-2">
              {userFilter !== 'mine' ? (
                <Link 
                  to="/recipes?user=mine" 
                  className="inline-flex items-center px-3 py-1.5 bg-orange-100 text-orange-800 rounded-full text-sm font-medium hover:bg-orange-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  View My Recipes
                </Link>
              ) : (
                <Link 
                  to="/recipes" 
                  className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  View All Recipes
                </Link>
              )}
              <Link 
                to="/add-recipe" 
                className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium hover:bg-green-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Recipe
              </Link>
            </div>
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