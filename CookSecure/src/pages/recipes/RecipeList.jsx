// src/pages/RecipeList.jsx
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
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading recipes...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/" className="btn">Back to Home</Link>
      </div>
    );
  }
  
  if (recipes.length === 0) {
    return (
      <div className="empty-results">
        <div className="container">
          <h2>{pageTitle}</h2>
          {searchQuery && (
            <p>No recipes found matching "{searchQuery}".</p>
          )}
          {category && (
            <p>No recipes found in the {category} category.</p>
          )}
          {!searchQuery && !category && (
            <p>No recipes available at the moment.</p>
          )}
          <Link to="/" className="btn">Back to Home</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="recipe-list-page">
      <div className="container">
        <h1 className="page-title">{pageTitle}</h1>
        
        {searchQuery && (
          <p className="search-results-count">
            Found {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} for "{searchQuery}"
          </p>
        )}
        
        <div className="recipes-grid">
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