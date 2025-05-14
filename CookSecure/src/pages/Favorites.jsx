// src/pages/Favorites.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RecipeCard from '../components/RecipeCard';

const Favorites = () => {
  const { favorites } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [activeView, setActiveView] = useState('grid');
  
  // Animation on mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timeout);
  }, []);
  
  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div 
          className={`transition-all duration-700 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                My Favorite Recipes
              </h1>
              <p className="text-gray-600 mt-2">
                Your personal collection of saved recipes for quick access
              </p>
            </div>
            
            {/* View switcher */}
            {favorites.length > 0 && (
              <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-white rounded-lg shadow-sm p-1">
                <button 
                  onClick={() => setActiveView('grid')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeView === 'grid' 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Grid
                  </span>
                </button>
                <button 
                  onClick={() => setActiveView('list')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeView === 'list' 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    List
                  </span>
                </button>
              </div>
            )}
          </div>
          
          {favorites.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 text-orange-500 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="mt-4 text-2xl font-medium text-gray-900">Your favorites collection is empty</h2>
              <p className="mt-3 text-gray-600 max-w-lg mx-auto">
                Browse our recipes and click the heart icon to save your favorites for easy access later. Your saved recipes will be synced across all your devices.
              </p>
              <div className="mt-8">
                <Link 
                  to="/recipes" 
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-lg text-base font-medium text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                  </svg>
                  Explore Recipes
                </Link>
              </div>
              
              {/* Recipe inspiration */}
              <div className="mt-16">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Popular recipes you might like</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 text-left border border-orange-100 shadow-sm">
                      <div className="font-medium text-orange-700 mb-1">Recipe Idea {item}</div>
                      <p className="text-sm text-gray-600">
                        {item === 1 && "Try our classic Italian pasta with fresh herbs and homemade sauce."}
                        {item === 2 && "Discover our trending vegetarian curry with coconut milk."}
                        {item === 3 && "Explore our quick 15-minute breakfast ideas for busy mornings."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Show sort and search filters when recipes exist */}
              <div className="bg-white rounded-xl shadow-md p-4 mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="relative flex-grow max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search your favorites..."
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Sort by:</span>
                    <select
                      className="pl-3 pr-8 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer bg-white"
                    >
                      <option value="newest">Recently Added</option>
                      <option value="az">Name (A-Z)</option>
                      <option value="za">Name (Z-A)</option>
                      <option value="category">Category</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {activeView === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((recipe, index) => (
                    <div 
                      key={recipe.idMeal || recipe.id} 
                      className="transform transition-all duration-500"
                      style={{ 
                        transitionDelay: `${index * 50}ms`,
                        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                        opacity: isVisible ? 1 : 0
                      }}
                    >
                      <RecipeCard recipe={recipe} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  {favorites.map((recipe, index) => (
                    <div 
                      key={recipe.idMeal || recipe.id}
                      className={`transform transition-all duration-500 ${
                        index !== favorites.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                      style={{ 
                        transitionDelay: `${index * 50}ms`,
                        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                        opacity: isVisible ? 1 : 0
                      }}
                    >
                      <Link to={`/recipe/${recipe.idMeal || recipe.id}`} className="flex p-4 hover:bg-orange-50 transition-colors">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={recipe.strMealThumb || recipe.image} 
                            alt={recipe.strMeal || recipe.title} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/80x80/FDA172/ffffff?text=Recipe';
                            }}
                          />
                        </div>
                        <div className="ml-4 flex-grow">
                          <h3 className="text-lg font-medium text-gray-900">{recipe.strMeal || recipe.title}</h3>
                          <div className="flex items-center mt-1">
                            {(recipe.strCategory || recipe.category) && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 mr-2">
                                {recipe.strCategory || recipe.category}
                              </span>
                            )}
                            {(recipe.strArea || recipe.area) && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                {recipe.strArea || recipe.area}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-1">
                            {recipe.description || 'A delicious recipe waiting to be explored.'}
                          </p>
                        </div>
                        <div className="ml-4 flex items-center">
                          <button className="p-2 rounded-full bg-white shadow-sm hover:shadow-md border border-gray-200 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Share collection button */}
              <div className="mt-8 flex justify-center">
                <button
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    // Show toast notification
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share My Collection
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;