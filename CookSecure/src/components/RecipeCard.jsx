// src/components/RecipeCard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RecipeCard = ({ recipe }) => {
  const { user, addToFavorites, removeFromFavorites, isFavorite } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Handle both TheMealDB API and custom recipes
  const id = recipe.idMeal || recipe.id;
  const title = recipe.strMeal || recipe.title || 'Untitled Recipe';
  const category = recipe.strCategory || recipe.category;
  const area = recipe.strArea || recipe.area;
  const image = recipe.strMealThumb || recipe.image;
  const description = recipe.strInstructions 
    ? recipe.strInstructions.substring(0, 120) + '...' 
    : (recipe.description ? recipe.description.substring(0, 120) + '...' : '');
  
  // Check if recipe is in favorites
  const favorite = isFavorite && isFavorite(id);
  
  // Default image
  const defaultImage = "https://placehold.co/400x300/FDA172/ffffff?text=Delicious";
  
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
  
  // Add animation when component loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Reset image error state when recipe changes
  useEffect(() => {
    setImageError(false);
  }, [recipe]);

  return (
    <div 
      className={`group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 h-full flex flex-col overflow-hidden transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transition: 'transform 0.3s ease, opacity 0.5s ease, box-shadow 0.3s ease' }}
    >
      <Link to={`/recipe/${id}`} className="flex-grow flex flex-col">
        <div className="relative h-48 overflow-hidden bg-orange-100">
          {/* Image with parallax effect on hover */}
          <img 
            src={!imageError && image ? image : defaultImage}
            alt={title} 
            className="h-full w-full object-cover transition-transform duration-700 ease-out"
            style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
            onError={() => setImageError(true)}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-50"></div>
          
          {/* Category label */}
          {category && (
            <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white bg-orange-500 shadow-md backdrop-blur-sm bg-opacity-80 transform transition-transform duration-300 group-hover:scale-110">
              {category}
            </span>
          )}
          
          {/* Area/Region pill */}
          {area && (
            <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-medium text-white bg-blue-500 shadow-md backdrop-blur-sm bg-opacity-80 transform transition-opacity duration-300 opacity-0 group-hover:opacity-100">
              {area}
            </span>
          )}
          
          {/* Favorite button */}
          <button 
            onClick={handleFavoriteToggle}
            className={`absolute top-4 left-4 p-2 rounded-full shadow-md transition-all duration-300 ${
              favorite 
                ? 'bg-pink-50 hover:bg-pink-100 text-pink-500' 
                : 'bg-white/90 hover:bg-white text-gray-600 hover:text-gray-700'
            } ${!user && 'opacity-60 cursor-not-allowed'}`}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            disabled={!user}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              className={`h-5 w-5 transition-transform duration-300 ${
                favorite 
                  ? 'fill-current text-pink-500 scale-110' 
                  : 'fill-none stroke-current text-gray-600 group-hover:scale-110'
              }`}
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
        
        <div className="p-5 flex-grow flex flex-col">
          <div className="flex-grow">
            <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-orange-600 transition-colors duration-300">{title}</h3>
            
            {description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[60px]">
                {description}
              </p>
            )}
          </div>
          
          {/* Recipe metrics - conditionally rendered */}
          {(recipe.prepTime || recipe.cookTime || recipe.servings) && (
            <div className="grid grid-cols-3 gap-2 mb-4 border-t border-gray-100 pt-4">
              {recipe.prepTime && (
                <div className="flex flex-col items-center text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-500">Prep</span>
                  <span className="text-sm text-gray-700">{recipe.prepTime}</span>
                </div>
              )}
              
              {recipe.cookTime && (
                <div className="flex flex-col items-center text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-500">Cook</span>
                  <span className="text-sm text-gray-700">{recipe.cookTime}</span>
                </div>
              )}
              
              {recipe.servings && (
                <div className="flex flex-col items-center text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-500">Serves</span>
                  <span className="text-sm text-gray-700">{recipe.servings}</span>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-between items-center">
            {/* User badge - if recipe has a user */}
            {recipe.userName && (
              <div className="flex items-center text-xs">
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold">
                  {recipe.userName?.charAt(0) || 'C'}
                </div>
                <span className="ml-1 text-gray-600">
                  by {recipe.userName || 'Chef'}
                </span>
              </div>
            )}
            
            <div className="mt-2">
              <Link 
                to={`/recipe/${id}`} 
                className="inline-flex items-center text-orange-500 hover:text-orange-600 text-sm font-medium group"
              >
                View Recipe
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-300 transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RecipeCard;