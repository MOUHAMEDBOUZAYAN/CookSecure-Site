// Fixed RecipeCard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RecipeCard = ({ recipe }) => {
  const { user, addToFavorites, removeFromFavorites, isFavorite } = useAuth();
  const [imageError, setImageError] = useState(false);
  
  // Handle both TheMealDB API and custom recipes
  const id = recipe.idMeal || recipe.id;
  const title = recipe.strMeal || recipe.title || 'Untitled Recipe';
  const category = recipe.strCategory || recipe.category;
  const image = recipe.strMealThumb || recipe.image;
  const description = recipe.strInstructions 
    ? recipe.strInstructions.substring(0, 120) + '...' 
    : (recipe.description ? recipe.description.substring(0, 120) + '...' : '');
  
  // Check if recipe is in favorites
  const favorite = isFavorite && isFavorite(id);
  
  // Default image
  const defaultImage = "https://placehold.co/400x300/f97316/ffffff?text=No+Image";
  
  // Handle favorite toggle
  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;
    
    if (favorite) {
      removeFromFavorites(id);
    } else {
      addToFavorites(recipe);
    }
  };
  
  // Reset image error state when recipe changes
  useEffect(() => {
    setImageError(false);
  }, [recipe]);
  
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full">
      <div className="relative h-60">
        {/* Recipe image with fallback */}
        <img 
          src={!imageError && image ? image : defaultImage}
          alt={title} 
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          onError={() => setImageError(true)}
        />
        
        {/* Category label */}
        {category && (
          <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white bg-orange-500 shadow-md">
            {category}
          </span>
        )}
        
        {/* Favorite button */}
        <button 
          onClick={handleFavoriteToggle}
          className="absolute top-4 left-4 p-2 rounded-full bg-white bg-opacity-90 shadow-md hover:shadow-lg transition-shadow"
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            className={`h-5 w-5 ${favorite ? 'fill-current text-red-500' : 'fill-none stroke-current text-gray-700'}`}
            strokeWidth="2"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
        </button>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
        {description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
            {description}
          </p>
        )}
        
        <div className="mt-4 flex justify-end">
          <Link 
            to={`/recipe/${id}`} 
            className="text-orange-500 hover:text-orange-600 text-sm font-medium inline-flex items-center"
          >
            View Recipe
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;