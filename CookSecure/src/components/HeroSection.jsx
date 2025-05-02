// src/components/HeroSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = ({ recipe }) => {
  // Handle both TheMealDB API and custom recipes
  const id = recipe.idMeal || recipe.id;
  const title = recipe.strMeal || recipe.title;
  const category = recipe.strCategory || recipe.category;
  const area = recipe.strArea || recipe.area || '';
  const image = recipe.strMealThumb || recipe.image;

  return (
    <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
            <div className="text-sm font-medium text-orange-600 mb-2">Featured Recipe</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 font-serif mb-4">{title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                  {category}
                </span>
              )}
              {area && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {area}
                </span>
              )}
              {recipe.prepTime && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {recipe.prepTime}
                </span>
              )}
            </div>
            
            <p className="text-lg text-gray-700 mb-6">
              {recipe.strInstructions 
                ? recipe.strInstructions.split('.')[0] + '.' 
                : recipe.description || 'Delicious recipe waiting to be explored'}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                to={`/recipe/${id}`} 
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-600"
              >
                View Recipe
              </Link>
              <button className="inline-flex items-center px-6 py-3 border border-orange-500 rounded-md shadow-sm text-base font-medium text-orange-500 bg-white hover:bg-orange-50">
                Save for Later
              </button>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={image} 
                alt={title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/600x400/orange/white?text=Recipe';
                }} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;