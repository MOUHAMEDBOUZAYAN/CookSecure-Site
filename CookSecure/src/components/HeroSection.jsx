import React from 'react';
import { ChevronRight, Clock, Bookmark, Star, Heart } from 'lucide-react';

const EnhancedHeroSection = ({ recipe }) => {
  // Handle both TheMealDB API and custom recipes
  const id = recipe?.idMeal || recipe?.id;
  const title = recipe?.strMeal || recipe?.title;
  const category = recipe?.strCategory || recipe?.category;
  const area = recipe?.strArea || recipe?.area || '';
  const image = recipe?.strMealThumb || recipe?.image;
  
  return (
    <section className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0 order-2 md:order-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                <span className="text-xs font-medium leading-none text-orange-600">🔥</span>
              </span>
              <span className="text-sm font-medium text-orange-600 tracking-wide uppercase">Featured Recipe</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 font-serif mb-6 leading-tight">{title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-6">
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
              {recipe?.prepTime && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <Clock className="h-4 w-4 mr-1" />
                  {recipe.prepTime}
                </span>
              )}
              {recipe?.difficulty && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  Level: {recipe.difficulty}
                </span>
              )}
            </div>
            
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              {recipe?.strInstructions 
                ? recipe.strInstructions.split('.')[0] + '.' 
                : recipe?.description || 'Delicious recipe waiting to be explored'}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a 
                href={`/recipe/${id}`} 
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors"
              >
                View Full Recipe
                <ChevronRight className="ml-2 h-5 w-5" />
              </a>
              <button className="inline-flex items-center px-6 py-3 border border-orange-500 rounded-lg shadow-sm text-base font-medium text-orange-500 bg-white hover:bg-orange-50 transition-colors">
                <Bookmark className="mr-2 h-5 w-5" />
                Save for Later
              </button>
            </div>
            
            {/* Rating and cooking info */}
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="ml-2">4.9 (126 reviews)</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-gray-500" />
                <span>Cook time: 30 mins</span>
              </div>
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-1 text-gray-500" />
                <span>256 people saved this</span>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 order-1 md:order-2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform transition duration-300 hover:scale-[1.02]">
              <img 
                src={image || 'https://placehold.co/600x400/orange/white?text=Recipe'} 
                alt={title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              {/* Author badge */}
              <div className="absolute bottom-4 left-4 flex items-center bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-2">
                  <span className="font-bold text-orange-600">C</span>
                </div>
                <div>
                  <p className="text-xs text-gray-600">By Chef</p>
                  <p className="text-sm font-medium text-gray-900">CookSecure</p>
                </div>
              </div>
              
              {/* Featured badge */}
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                Editor's Choice
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;