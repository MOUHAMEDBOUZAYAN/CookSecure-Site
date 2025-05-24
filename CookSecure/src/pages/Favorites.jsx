// src/pages/Favorites.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RecipeCard from '../components/RecipeCard';
import { Search, Grid, List, Star, Clock, Trash2, Filter, AlertTriangle, Share2, Download, Heart } from 'lucide-react';

const Favorites = () => {
  const { favorites, removeFavorite } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [activeView, setActiveView] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState('date-desc');
  
  // Animation on mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timeout);
  }, []);
  
  // Set filtered favorites based on search and filters
  useEffect(() => {
    if (!favorites) {
      setFilteredFavorites([]);
      return;
    }
    
    let results = [...favorites];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(recipe => {
        const title = (recipe.strMeal || recipe.title || '').toLowerCase();
        const category = (recipe.strCategory || recipe.category || '').toLowerCase();
        const area = (recipe.strArea || recipe.area || '').toLowerCase();
        const ingredients = Object.keys(recipe)
          .filter(key => key.startsWith('strIngredient') && recipe[key])
          .map(key => recipe[key].toLowerCase());
        
        return (
          title.includes(query) || 
          category.includes(query) || 
          area.includes(query) ||
          ingredients.some(ingredient => ingredient.includes(query))
        );
      });
    }
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      results = results.filter(recipe => {
        const category = recipe.strCategory || recipe.category;
        return category && selectedCategories.includes(category);
      });
    }
    
    // Apply sorting
    results.sort((a, b) => {
      switch(sortOption) {
        case 'date-desc':
          return (b.dateAdded || Date.now()) - (a.dateAdded || Date.now());
        case 'date-asc':
          return (a.dateAdded || Date.now()) - (b.dateAdded || Date.now());
        case 'name-asc':
          return (a.strMeal || a.title || '').localeCompare(b.strMeal || b.title || '');
        case 'name-desc':
          return (b.strMeal || b.title || '').localeCompare(a.strMeal || a.title || '');
        default:
          return 0;
      }
    });
    
    setFilteredFavorites(results);
  }, [favorites, searchQuery, selectedCategories, sortOption]);
  
  // Get all available categories from favorites
  const getCategories = () => {
    if (!favorites) return [];
    
    const categories = favorites.map(recipe => recipe.strCategory || recipe.category)
      .filter(category => category) // Remove undefined/null
      .filter((category, index, self) => self.indexOf(category) === index); // Remove duplicates
    
    return categories;
  };
  
  // Toggle category selection
  const toggleCategory = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };
  
  // Handle removing a recipe from favorites
  const handleRemoveFavorite = (e, recipeId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to remove this recipe from favorites?')) {
      removeFavorite(recipeId);
    }
  };
  
  // Export favorites as JSON
  const exportFavorites = () => {
    const dataStr = JSON.stringify(favorites, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `cooksecure-favorites-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  // Share favorites collection
  const shareFavorites = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My CookSecure Favorites',
          text: `Check out my collection of ${favorites.length} favorite recipes on CookSecure!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        alert('Could not share collection. Try copying the URL manually.');
      }
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          alert('Link copied to clipboard! You can now share it manually.');
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
          alert('Could not copy the link. Please copy the URL manually.');
        });
    }
  };
  
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
            
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              {/* Export & Share buttons */}
              <button 
                onClick={exportFavorites}
                className="px-3 py-2 bg-white rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200 flex items-center"
              >
                <Download className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium">Export</span>
              </button>
              
              <button 
                onClick={shareFavorites}
                className="px-3 py-2 bg-white rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200 flex items-center"
              >
                <Share2 className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium">Share</span>
              </button>
              
              {/* View switcher */}
              {favorites?.length > 0 && (
                <div className="flex items-center bg-white rounded-lg shadow-sm p-1 border border-gray-200">
                  <button 
                    onClick={() => setActiveView('grid')}
                    className={`p-2 rounded-md text-sm flex items-center justify-center transition-colors duration-200 ${
                      activeView === 'grid' 
                        ? 'bg-orange-100 text-orange-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setActiveView('list')}
                    className={`p-2 rounded-md text-sm flex items-center justify-center transition-colors duration-200 ${
                      activeView === 'list' 
                        ? 'bg-orange-100 text-orange-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {!favorites || favorites.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 text-orange-500 mb-6">
                <Heart className="h-10 w-10" />
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
                  {[
                    {
                      title: "Garlic Butter Shrimp Pasta",
                      description: "Quick and flavorful pasta dish with juicy shrimp in a garlic butter sauce."
                    },
                    {
                      title: "Vegetarian Buddha Bowl",
                      description: "Nutritious and colorful bowl with quinoa, roasted vegetables, and tahini dressing."
                    },
                    {
                      title: "Blueberry Lemon Pancakes",
                      description: "Fluffy pancakes bursting with fresh blueberries and a hint of lemon zest."
                    }
                  ].map((item, index) => (
                    <div key={index} className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 text-left border border-orange-100 shadow-sm">
                      <Link to="/recipes" className="font-medium text-orange-700 mb-1 hover:text-orange-800 transition-colors">
                        {item.title}
                      </Link>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Search and filter bar */}
              <div className="bg-white rounded-xl shadow-md p-4 mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="relative flex-grow max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search your favorites..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                      {selectedCategories.length > 0 && (
                        <span className="ml-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {selectedCategories.length}
                        </span>
                      )}
                    </button>
                    
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">Sort:</span>
                      <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer bg-white"
                      >
                        <option value="date-desc">Recently Added</option>
                        <option value="date-asc">Oldest First</option>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Category filters */}
                {showFilters && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700">Filter by category</h4>
                      {selectedCategories.length > 0 && (
                        <button 
                          onClick={() => setSelectedCategories([])}
                          className="text-xs text-orange-600 hover:text-orange-700"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {getCategories().map(category => (
                        <button
                          key={category}
                          onClick={() => toggleCategory(category)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            selectedCategories.includes(category)
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          } transition-colors`}
                        >
                          {category}
                        </button>
                      ))}
                      
                      {getCategories().length === 0 && (
                        <div className="text-sm text-gray-500 italic">No categories available</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Display filtered results info */}
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-gray-600">
                  {filteredFavorites.length === favorites.length ? (
                    <span>Showing all {favorites.length} saved recipes</span>
                  ) : (
                    <span>Showing {filteredFavorites.length} of {favorites.length} saved recipes</span>
                  )}
                </div>
                
                {(searchQuery || selectedCategories.length > 0) && filteredFavorites.length === 0 && (
                  <div className="flex items-center text-amber-600">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span className="text-sm">No recipes match your filters</span>
                  </div>
                )}
              </div>
              
              {filteredFavorites.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-10 text-center border border-gray-200">
                  <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No matching recipes found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters to find what you're looking for.</p>
                  {(searchQuery || selectedCategories.length > 0) && (
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategories([]);
                      }}
                      className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-600 rounded-md hover:bg-orange-200 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset Filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Grid View */}
                  {activeView === 'grid' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredFavorites.map((recipe, index) => (
                        <div 
                          key={recipe.idMeal || recipe.id || index} 
                          className="transform transition-all duration-500 group"
                          style={{ 
                            transitionDelay: `${index * 50}ms`,
                            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                            opacity: isVisible ? 1 : 0
                          }}
                        >
                          <div className="relative">
                            <RecipeCard recipe={recipe} />
                            <button
                              onClick={(e) => handleRemoveFavorite(e, recipe.idMeal || recipe.id)}
                              className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                              title="Remove from favorites"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* List View */}
                  {activeView === 'list' && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                      {filteredFavorites.map((recipe, index) => (
                        <div 
                          key={recipe.idMeal || recipe.id || index}
                          className={`transform transition-all duration-500 group ${
                            index !== filteredFavorites.length - 1 ? 'border-b border-gray-100' : ''
                          }`}
                          style={{ 
                            transitionDelay: `${index * 50}ms`,
                            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                            opacity: isVisible ? 1 : 0
                          }}
                        >
                          <Link to={`/recipe/${recipe.idMeal || recipe.id}`} className="flex p-4 hover:bg-orange-50 transition-colors relative">
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
                              
                              {/* Additional recipe metadata */}
                              <div className="flex items-center mt-2 text-xs text-gray-500">
                                {recipe.prepTime && (
                                  <span className="flex items-center mr-3">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {recipe.prepTime}
                                  </span>
                                )}
                                {recipe.rating && (
                                  <span className="flex items-center">
                                    <Star className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400" />
                                    {recipe.rating} ({recipe.ratingCount || 0})
                                  </span>
                                )}
                                {recipe.dateAdded && (
                                  <span className="ml-auto">
                                    Added {new Date(recipe.dateAdded).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="ml-4 flex items-center self-center">
                              <button 
                                onClick={(e) => handleRemoveFavorite(e, recipe.idMeal || recipe.id)}
                                className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Share collection button at the bottom */}
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={shareFavorites}
                      className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Share2 className="h-4 w-4 mr-2 text-gray-500" />
                      Share My Collection
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;