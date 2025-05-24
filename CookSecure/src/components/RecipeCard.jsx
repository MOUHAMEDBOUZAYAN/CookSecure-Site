import React, { useState } from 'react';
import { Clock, Heart, ChefHat, Users, Star } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const RecipeCard = ({ recipe }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { favorites, addFavorite, removeFavorite } = useAuth();
  
  // Handle both TheMealDB API and custom recipes
  const id = recipe?.idMeal || recipe?.id;
  const title = recipe?.strMeal || recipe?.title;
  const category = recipe?.strCategory || recipe?.category;
  const area = recipe?.strArea || recipe?.area;
  const image = recipe?.strMealThumb || recipe?.image;
  
  // Check if this recipe is in favorites
  const isFavorite = favorites?.some(fav => (fav.idMeal || fav.id) === id);
  
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeFavorite(id);
    } else {
      addFavorite(recipe);
    }
  };
  
  return (
    <div 
      className="group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a href={`/recipe/${id}`} className="block">
        {/* Image container */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image || 'https://placehold.co/400x300/orange/white?text=Recipe'}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          
          {/* Category badge */}
          {category && (
            <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-md text-orange-800 shadow-sm">
              {category}
            </div>
          )}
          
          {/* Favorite button */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
              isFavorite 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Quick view button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-medium text-gray-900 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              View Recipe
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {/* Title and rating */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors duration-300">
              {title}
            </h3>
            
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-sm text-gray-600">4.8</span>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {area && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {area}
              </span>
            )}
            {recipe?.prepTime && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                <Clock className="h-3 w-3 mr-1" />
                {recipe.prepTime}
              </span>
            )}
            {recipe?.servings && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                <Users className="h-3 w-3 mr-1" />
                {recipe.servings}
              </span>
            )}
          </div>
          
          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {recipe?.description || 'A delicious recipe waiting to be explored. Click to view the full details and start cooking!'}
          </p>
          
          {/* Footer */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div className="flex items-center">
              <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center mr-2">
                <ChefHat className="h-3 w-3 text-orange-600" />
              </div>
              <span className="text-xs text-gray-500">
                {recipe?.author || 'CookSecure Chef'}
              </span>
            </div>
            
            <span className="text-xs text-gray-500">
              {recipe?.createdAt 
                ? new Date(recipe.createdAt).toLocaleDateString() 
                : 'Just added'
              }
            </span>
          </div>
        </div>
      </a>
    </div>
  );
};

export default RecipeCard;