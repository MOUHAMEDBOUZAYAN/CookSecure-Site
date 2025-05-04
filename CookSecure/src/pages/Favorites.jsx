// src/pages/Favorites.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RecipeCard from '../components/RecipeCard';

const Favorites = () => {
  const { favorites, removeFromFavorites } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Get unique categories from favorites
  const categories = ['All', ...new Set(favorites.map(recipe => 
    recipe.strCategory || recipe.category || 'Uncategorized'
  ))];
  
  // Filter recipes by selected category
  const filteredRecipes = selectedCategory === 'All' 
    ? favorites 
    : favorites.filter(recipe => 
        (recipe.strCategory || recipe.category) === selectedCategory
      );
  
  // Handle removing a recipe from favorites
  const handleRemove = (recipeId) => {
    removeFromFavorites(recipeId);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">My Favorite Recipes</h1>
          <p className="mt-2 text-lg text-gray-600">
            Your personal collection of favorite recipes
          </p>
        </div>
        
        {favorites.length === 0 ? (
          <div className="text-center py-12">
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
            <h2 className="mt-4 text-xl font-medium text-gray-900">No favorite recipes yet</h2>
            <p className="mt-2 text-gray-600">
              Browse recipes and click the heart icon to add them to your favorites
            </p>
            <Link 
              to="/recipes" 
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
            >
              Browse Recipes
            </Link>
          </div>
        ) : (
          <>
            {/* Category filter */}
            {categories.length > 1 && (
              <div className="mb-8 flex flex-wrap justify-center gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      selectedCategory === category
                        ? 'bg-orange-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    } transition-colors duration-200`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
            
            {/* Recipe grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRecipes.map(recipe => (
                <RecipeCard 
                  key={recipe.idMeal || recipe.id} 
                  recipe={recipe} 
                  onDelete={handleRemove}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;