// src/components/RecipeCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { deleteRecipe } from '../services/recipes';

const RecipeCard = ({ recipe, onDelete }) => {
  const { user, canEditRecipe, addToFavorites, removeFromFavorites, isFavorite } = useAuth();
  
  // Handle both TheMealDB API and custom recipes
  const id = recipe.idMeal || recipe.id;
  const title = recipe.strMeal || recipe.title;
  const category = recipe.strCategory || recipe.category;
  const image = recipe.strMealThumb || recipe.image;
  const description = recipe.strInstructions 
    ? recipe.strInstructions.split('.')[0] + '.' 
    : recipe.description || '';
  
  // Check if recipe is in favorites
  const favorite = isFavorite(id);
  
  // Toggle favorite status
  const handleFavoriteToggle = (e) => {
    e.preventDefault(); // Prevent navigation to recipe detail
    e.stopPropagation();
    
    if (favorite) {
      removeFromFavorites(id);
    } else {
      addToFavorites(recipe);
    }
  };

  // Handle delete recipe
  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await deleteRecipe(id);
        
        // If there's an onDelete callback, call it to update the UI
        if (onDelete) {
          onDelete(id);
        } else {
          // Refresh the page if no callback provided
          window.location.reload();
        }
      } catch (error) {
        console.error('Error deleting recipe:', error);
        alert('Failed to delete recipe. Please try again.');
      }
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/400x300/orange/white?text=Recipe';
          }} 
        />
        {category && (
          <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {category}
          </span>
        )}
        
        {/* Favorite button - only show when user is logged in */}
        {user && (
          <button 
            onClick={handleFavoriteToggle}
            className={`absolute top-2 left-2 p-2 rounded-full ${favorite ? 'bg-red-500' : 'bg-gray-100'}`}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 ${favorite ? 'text-white' : 'text-gray-600'}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
                clipRule="evenodd" 
              />
            </svg>
          </button>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        
        {description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {description}
          </p>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {recipe.userId && user && user.id === recipe.userId ? 'Your recipe' : ''}
          </span>
          
          <Link 
            to={`/recipe/${id}`} 
            className="text-orange-500 hover:text-orange-600 text-sm font-medium"
          >
            View Recipe →
          </Link>
        </div>
        
        {/* Edit/Delete buttons - only show to authorized users */}
        {canEditRecipe(recipe) && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end space-x-2">
            <Link 
              to={`/edit-recipe/${id}`}
              className="text-sm text-yellow-600 hover:text-yellow-800"
            >
              Edit
            </Link>
            <button 
              className="text-sm text-red-600 hover:text-red-800"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;