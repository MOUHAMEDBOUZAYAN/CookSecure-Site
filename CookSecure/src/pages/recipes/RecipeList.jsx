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
  const { user, canManageRecipes } = useAuth();
  
  // Get search query from URL if available
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q');
  const userFilter = queryParams.get('user');
  
  // Set page title based on filters
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
        
        // Get recipes based on filters
        if (userFilter === 'mine' && user) {
          recipeData = await getUserRecipes(user.id);
          console.log(`Fetched ${recipeData?.length || 0} recipes for user ${user.id}`);
        } else if (category) {
          recipeData = await getRecipesByCategory(category);
          console.log(`Fetched ${recipeData?.length || 0} recipes for category ${category}`);
        } else if (searchQuery) {
          recipeData = await searchRecipes(searchQuery);
          console.log(`Fetched ${recipeData?.length || 0} recipes for search "${searchQuery}"`);
        } else {
          recipeData = await getRecipes();
          console.log(`Fetched ${recipeData?.length || 0} recipes (all)`);
        }
        
        // Ensure recipeData is an array and validate recipes
        if (!Array.isArray(recipeData)) {
          recipeData = [];
        }
        
        // Filter out any invalid recipes (no id/idMeal)
        const validRecipes = recipeData.filter(recipe => 
          recipe && (recipe.id || recipe.idMeal)
        );
        
        console.log(`Valid recipes: ${validRecipes.length}`);
        setRecipes(validRecipes);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError('Failed to load recipes. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchRecipes();
  }, [category, searchQuery, userFilter, user]);
  
  // Action buttons (View My Recipes / Add Recipe)
  const ActionButtons = () => (
    <div className="flex flex-wrap gap-2 mb-8">
      {user && canManageRecipes && canManageRecipes() && (
        <>
          {userFilter !== 'mine' ? (
            <Link 
              to="/recipes?user=mine" 
              className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800 hover:bg-orange-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              View My Recipes
            </Link>
          ) : (
            <Link 
              to="/recipes" 
              className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              View All Recipes
            </Link>
          )}
          
          <Link 
            to="/add-recipe" 
            className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Recipe
          </Link>
        </>
      )}
    </div>
  );
  
  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{pageTitle}</h1>
        <ActionButtons />
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="ml-3 text-gray-600">Loading recipes...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{pageTitle}</h1>
        <ActionButtons />
        <div className="text-center py-16 bg-red-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mt-4 text-xl font-medium text-red-800">{error}</h2>
          <Link 
            to="/" 
            className="mt-6 inline-block px-6 py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  // Empty state (no recipes)
  if (recipes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{pageTitle}</h1>
        <ActionButtons />
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-16 w-16 mx-auto text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
          <h2 className="mt-4 text-xl font-medium text-gray-900">No recipes found</h2>
          
          {searchQuery && (
            <p className="mt-2 text-gray-600">No recipes match your search for "{searchQuery}"</p>
          )}
          
          {category && (
            <p className="mt-2 text-gray-600">No recipes found in the {category} category</p>
          )}
          
          {userFilter === 'mine' && (
            <div className="mt-2 text-gray-600">
              <p>You haven't created any recipes yet</p>
              {canManageRecipes && canManageRecipes() && (
                <Link to="/add-recipe" className="mt-4 inline-block text-orange-500 hover:text-orange-600">
                  Create your first recipe →
                </Link>
              )}
            </div>
          )}
          
          {!searchQuery && !category && !userFilter && (
            <p className="mt-2 text-gray-600">No recipes available at the moment</p>
          )}
          
          <Link 
            to="/" 
            className="mt-6 inline-block px-6 py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  // Recipes found - regular view
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{pageTitle}</h1>
      
      <ActionButtons />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe, index) => (
          <RecipeCard 
            key={recipe.idMeal || recipe.id || `recipe-${index}`} 
            recipe={recipe} 
          />
        ))}
      </div>
    </div>
  );
};

export default RecipeList;