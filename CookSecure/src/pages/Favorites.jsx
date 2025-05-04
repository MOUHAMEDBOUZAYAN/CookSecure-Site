// src/pages/Favorites.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RecipeCard from '../components/RecipeCard';

const Favorites = () => {
  const { favorites } = useAuth();
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">My Favorite Recipes</h1>
        
        {favorites.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-10 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="mt-4 text-xl font-medium text-gray-900">You haven't saved any favorites yet</h2>
            <p className="mt-2 text-gray-600 max-w-md mx-auto">
              Browse our recipes and click the heart icon to save your favorites for easy access later.
            </p>
            <Link 
              to="/recipes" 
              className="mt-6 inline-block px-6 py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition duration-300"
            >
              Browse Recipes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((recipe) => (
              <RecipeCard 
                key={recipe.idMeal || recipe.id} 
                recipe={recipe} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;