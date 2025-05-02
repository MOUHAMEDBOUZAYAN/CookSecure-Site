// src/components/RecipeCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RecipeCard = ({ recipe }) => {
  const { user } = useAuth();
  
  // Handle both TheMealDB API and custom recipes
  const id = recipe.idMeal || recipe.id;
  const title = recipe.strMeal || recipe.title;
  const category = recipe.strCategory || recipe.category;
  const image = recipe.strMealThumb || recipe.image;
  const description = recipe.strInstructions 
    ? recipe.strInstructions.split('.')[0] + '.' 
    : recipe.description || '';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/assets/images/default-recipe.jpg';
          }} 
        />
        {category && (
          <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {category}
          </span>
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
            {recipe.user?.name || recipe.author || 'TheMealDB'}
          </span>
          
          <Link 
            to={`/recipe/${id}`} 
            className="text-orange-500 hover:text-orange-600 text-sm font-medium"
          >
            View Recipe →
          </Link>
        </div>
        
        {(user?.id === recipe.userId || user?.role === 'admin') && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end space-x-2">
            <Link 
              to={`/edit-recipe/${id}`}
              className="text-sm text-yellow-600 hover:text-yellow-800"
            >
              Edit
            </Link>
            <button 
              className="text-sm text-red-600 hover:text-red-800"
              onClick={() => console.log('Delete recipe', id)}
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