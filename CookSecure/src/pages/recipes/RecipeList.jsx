// src/pages/recipes/RecipeList.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import RecipeCard from '../../components/RecipeCard';
import { getRecipes, getRecipesByCategory, searchRecipes, getUserRecipes } from '../../services/recipes';
import { useAuth } from '../../hooks/useAuth';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  ChevronDown, 
  Grid, 
  List, 
  Clock, 
  Award, 
  ThumbsUp, 
  ArrowUpDown, 
  X, 
  ChevronsLeft, 
  ChevronsRight, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  User,
  RefreshCcw
} from 'lucide-react';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [activeView, setActiveView] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [filters, setFilters] = useState({
    difficulty: [],
    time: [],
    category: [],
    rating: null
  });
  
  const [sortOption, setSortOption] = useState('newest');
  
  const { category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, canManageRecipes } = useAuth();
  const searchRef = useRef(null);
  
  // Items per page
  const ITEMS_PER_PAGE = 9;
  
  // Get search query from URL if available
  const queryParams = new URLSearchParams(location.search);
  const urlSearchQuery = queryParams.get('q');
  const userFilter = queryParams.get('user');
  
  // Update local search state when URL changes
  useEffect(() => {
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
    }
  }, [urlSearchQuery]);
  
  // Set page title based on filters
  const pageTitle = category 
    ? `${category} Recipes` 
    : urlSearchQuery 
      ? `Search Results for "${urlSearchQuery}"`
      : userFilter === 'mine' && user
        ? `My Recipes`
        : 'All Recipes';
  
  // Handle search submission
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchQuery && searchQuery.trim()) {
      navigate(`/recipes?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };
  
  // Handle suggestion selection
  const handleSelectSuggestion = (recipe) => {
    if (recipe && recipe.id) {
      navigate(`/recipe/${recipe.id}`);
      setShowSuggestions(false);
    } else if (recipe && recipe.idMeal) {
      navigate(`/recipe/${recipe.idMeal}`);
      setShowSuggestions(false);
    }
  };
  
  // Get suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery && searchQuery.trim().length >= 2) {
        setSuggestionsLoading(true);
        try {
          const results = await searchRecipes(searchQuery);
          // Only show first 5 suggestions
          setSuggestions(Array.isArray(results) ? results.slice(0, 5) : []);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        } finally {
          setSuggestionsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };
    
    // Use debounce to avoid too many requests
    const timeoutId = setTimeout(() => {
      if (searchQuery && searchQuery.trim().length >= 2) {
        fetchSuggestions();
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle page navigation
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      difficulty: [],
      time: [],
      category: [],
      rating: null
    });
    setSortOption('newest');
  };
  
  // Toggle filters in mobile view
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => {
      // For arrays (multiple selection)
      if (Array.isArray(prevFilters[filterType])) {
        if (prevFilters[filterType].includes(value)) {
          return {
            ...prevFilters,
            [filterType]: prevFilters[filterType].filter(item => item !== value)
          };
        } else {
          return {
            ...prevFilters,
            [filterType]: [...prevFilters[filterType], value]
          };
        }
      } 
      // For single values
      else {
        return {
          ...prevFilters,
          [filterType]: prevFilters[filterType] === value ? null : value
        };
      }
    });
    
    // Reset to page 1 when filters change
    setCurrentPage(1);
  };
  
  // Handle sort change
  const handleSortChange = (option) => {
    setSortOption(option);
  };
  
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        let recipeData = [];
        
        // Get recipes based on filters
        if (userFilter === 'mine' && user) {
          recipeData = await getUserRecipes(user.id);
          console.log(`Fetched ${recipeData?.length || 0} recipes for user ${user.id}`);
        } else if (category) {
          recipeData = await getRecipesByCategory(category);
          console.log(`Fetched ${recipeData?.length || 0} recipes for category ${category}`);
        } else if (urlSearchQuery) {
          recipeData = await searchRecipes(urlSearchQuery);
          console.log(`Fetched ${recipeData?.length || 0} recipes for search "${urlSearchQuery}"`);
        } else {
          recipeData = await getRecipes();
          console.log(`Fetched ${recipeData?.length || 0} recipes (all)`);
        }
        
        // Ensure recipeData is an array and validate recipes
        if (!Array.isArray(recipeData)) {
          recipeData = [];
        }
        
        // Filter out any invalid recipes (no id/idMeal)
        let validRecipes = recipeData.filter(recipe => 
          recipe && (recipe.id || recipe.idMeal)
        );
        
        // Apply filters
        if (filters.difficulty.length > 0) {
          validRecipes = validRecipes.filter(recipe => 
            recipe.difficulty && filters.difficulty.includes(recipe.difficulty)
          );
        }
        
        if (filters.time.length > 0) {
          validRecipes = validRecipes.filter(recipe => {
            const prepTime = parseInt(recipe.prepTime);
            if (isNaN(prepTime)) return false;
            
            return filters.time.some(timeRange => {
              if (timeRange === 'under15') return prepTime < 15;
              if (timeRange === '15to30') return prepTime >= 15 && prepTime <= 30;
              if (timeRange === '30to60') return prepTime > 30 && prepTime <= 60;
              if (timeRange === 'over60') return prepTime > 60;
              return false;
            });
          });
        }
        
        if (filters.category.length > 0) {
          validRecipes = validRecipes.filter(recipe => 
            recipe.strCategory && filters.category.includes(recipe.strCategory)
          );
        }
        
        if (filters.rating) {
          validRecipes = validRecipes.filter(recipe => 
            recipe.rating && recipe.rating >= filters.rating
          );
        }
        
        // Apply sorting
        validRecipes = validRecipes.sort((a, b) => {
          switch (sortOption) {
            case 'newest':
              return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
            case 'oldest':
              return new Date(a.createdAt || Date.now()) - new Date(b.createdAt || Date.now());
            case 'popular':
              return (b.likes || 0) - (a.likes || 0);
            case 'rating':
              return (b.rating || 0) - (a.rating || 0);
            case 'az':
              return (a.strMeal || a.title || '').localeCompare(b.strMeal || b.title || '');
            case 'za':
              return (b.strMeal || b.title || '').localeCompare(a.strMeal || a.title || '');
            default:
              return 0;
          }
        });
        
        // Calculate total pages
        setTotalPages(Math.ceil(validRecipes.length / ITEMS_PER_PAGE));
        
        // Slice recipes for current page
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        
        setRecipes(validRecipes);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError('Failed to load recipes. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchRecipes();
  }, [category, urlSearchQuery, userFilter, user, filters, sortOption, currentPage]);
  
  // Get active filters count
  const activeFiltersCount = 
    filters.difficulty.length + 
    filters.time.length + 
    filters.category.length + 
    (filters.rating ? 1 : 0);
  
  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center items-center mt-8 space-x-2">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <ChevronsLeft className="h-5 w-5" />
        </button>
        
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          
          // Show current page, and 1 page before and after
          if (
            pageNumber === 1 || 
            pageNumber === totalPages || 
            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
          ) {
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`w-10 h-10 rounded-md ${
                  currentPage === pageNumber
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {pageNumber}
              </button>
            );
          }
          
          // Show ellipsis
          if (
            (pageNumber === 2 && currentPage > 3) ||
            (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
          ) {
            return <span key={pageNumber} className="text-gray-500">...</span>;
          }
          
          return null;
        })}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <ChevronsRight className="h-5 w-5" />
        </button>
      </div>
    );
  };
  
  // Search box component
  const SearchBox = () => (
    <div ref={searchRef} className="relative mb-8">
      <form onSubmit={handleSearch} className="flex">
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes, ingredients, cuisines..."
            className="w-full px-4 py-3 pl-10 pr-16 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            autoComplete="off"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSuggestions([]);
                setShowSuggestions(false);
              }}
              className="absolute inset-y-0 right-12 flex items-center pr-3"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        
        <button
          type="submit"
          className="ml-2 px-6 py-3 bg-orange-500 text-white rounded-lg shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          Search
        </button>
      </form>
      
      {/* Suggestions dropdown */}
      {showSuggestions && searchQuery && searchQuery.trim().length >= 2 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto">
          {suggestionsLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin inline-block h-5 w-5 border-t-2 border-b-2 border-orange-500 rounded-full mr-2"></div>
              Loading suggestions...
            </div>
          ) : suggestions.length > 0 ? (
            <ul>
              {suggestions.map((recipe) => (
                <li 
                  key={recipe.id || recipe.idMeal || Math.random()} 
                  className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSelectSuggestion(recipe)}
                >
                  <div className="flex items-center">
                    {recipe.image || recipe.strMealThumb ? (
                      <img 
                        src={recipe.image || recipe.strMealThumb} 
                        alt={recipe.title || recipe.strMeal} 
                        className="h-10 w-10 object-cover rounded-md mr-3"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/40?text=?';
                        }}
                      />
                    ) : (
                      <div className="h-10 w-10 bg-orange-100 rounded-md mr-3 flex items-center justify-center">
                        <Plus className="h-6 w-6 text-orange-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{recipe.title || recipe.strMeal}</p>
                      <p className="text-sm text-gray-500">
                        {recipe.category || recipe.strCategory || 'Recipe'}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
              
              {/* Show "search for more" option */}
              <li 
                className="px-4 py-3 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer text-gray-700 font-medium"
                onClick={handleSearch}
              >
                Search for "{searchQuery}"
              </li>
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No recipes found with "{searchQuery}"
              <div className="mt-2">
                <button
                  onClick={handleSearch}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Search for "{searchQuery}" anyway
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
  
  // Action buttons (View My Recipes / Add Recipe)
  const ActionButtons = () => (
    <div className="flex flex-wrap gap-2 mb-8">
      {user && canManageRecipes && canManageRecipes() && (
        <>
          {userFilter !== 'mine' ? (
            <Link 
              to="/recipes?user=mine" 
              className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800 hover:bg-orange-200"
            >
              <User className="h-5 w-5 mr-1" />
              My Recipes
            </Link>
          ) : (
            <Link 
              to="/recipes" 
              className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              All Recipes
            </Link>
          )}
          
          <Link 
            to="/add-recipe" 
            className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200"
          >
            <Plus className="h-5 w-5 mr-1" />
            Add Recipe
          </Link>
        </>
      )}
    </div>
  );
  
  // Filters sidebar
  const FiltersSidebar = () => (
    <div className={`lg:block ${showFilters ? 'block' : 'hidden'} bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-24`}>
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-lg font-medium text-gray-900">Filters</h4>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-sm text-orange-600 hover:text-orange-700 flex items-center"
            >
              <RefreshCcw className="h-4 w-4 mr-1" />
              Reset
            </button>
          )}
          <button
            onClick={toggleFilters}
            className="lg:hidden p-1 hover:bg-gray-100 rounded-md"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>
      
      {/* Filter sections */}
      <div className="space-y-6">
        {/* Difficulty filter */}
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-3">Difficulty</h5>
          <div className="space-y-2">
            {['Easy', 'Medium', 'Hard'].map(level => (
              <div key={level} className="flex items-center">
                <input
                  id={`difficulty-${level.toLowerCase()}`}
                  type="checkbox"
                  checked={filters.difficulty.includes(level.toLowerCase())}
                  onChange={() => handleFilterChange('difficulty', level.toLowerCase())}
                  className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor={`difficulty-${level.toLowerCase()}`} className="ml-2 text-sm text-gray-700">
                  {level}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Preparation time filter */}
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-3">Preparation Time</h5>
          <div className="space-y-2">
            {[
              { id: 'under15', label: 'Under 15 minutes' },
              { id: '15to30', label: '15-30 minutes' },
              { id: '30to60', label: '30-60 minutes' },
              { id: 'over60', label: 'Over 60 minutes' }
            ].map(time => (
              <div key={time.id} className="flex items-center">
                <input
                  id={`time-${time.id}`}
                  type="checkbox"
                  checked={filters.time.includes(time.id)}
                  onChange={() => handleFilterChange('time', time.id)}
                  className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor={`time-${time.id}`} className="ml-2 text-sm text-gray-700">
                  {time.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Rating filter */}
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-3">Rating</h5>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center">
                <input
                  id={`rating-${rating}`}
                  type="radio"
                  checked={filters.rating === rating}
                  onChange={() => handleFilterChange('rating', rating)}
                  className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                />
                <label htmlFor={`rating-${rating}`} className="ml-2 text-sm text-gray-700 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1">& Up</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  
  // Sort and view options
  const SortAndViewOptions = () => (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center mb-4 sm:mb-0">
        <button
          onClick={toggleFilters}
          className="lg:hidden mr-4 flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
        >
          <Filter className="h-4 w-4 mr-1" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">Sort by:</span>
          <select
            value={sortOption}
            onChange={(e) => handleSortChange(e.target.value)}
            className="text-sm border-gray-300 rounded-md focus:border-orange-500 focus:ring-orange-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="az">Name (A-Z)</option>
            <option value="za">Name (Z-A)</option>
          </select>
        </div>
      </div>
      
      <div className="flex items-center">
        <span className="text-sm text-gray-500 mr-2">View:</span>
        <div className="flex border border-gray-300 rounded-md overflow-hidden">
          <button
            onClick={() => setActiveView('grid')}
            className={`p-2 text-sm ${
              activeView === 'grid'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setActiveView('list')}
            className={`p-2 text-sm ${
              activeView === 'list'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
  
  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{pageTitle}</h1>
        <SearchBox />
        <ActionButtons />
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="ml-3 text-gray-600">Loading recipes...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{pageTitle}</h1>
        <SearchBox />
        <ActionButtons />
        <div className="text-center py-16 bg-red-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mt-4 text-xl font-medium text-red-800">{error}</h2>
          <Link 
            to="/" 
            className="mt-6 inline-block px-6 py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
  
  // Empty state (no recipes)
  if (recipes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{pageTitle}</h1>
        <SearchBox />
        <ActionButtons />
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-16 w-16 mx-auto text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
          <h2 className="mt-4 text-xl font-medium text-gray-900">No recipes found</h2>
          
          {urlSearchQuery && (
            <p className="mt-2 text-gray-600">No recipes match your search for "{urlSearchQuery}"</p>
          )}
          
          {category && (
            <p className="mt-2 text-gray-600">No recipes found in the {category} category</p>
          )}
          
          {userFilter === 'mine' && (
            <div className="mt-2 text-gray-600">
              <p>You haven't created any recipes yet</p>
              {canManageRecipes && canManageRecipes() && (
                <Link to="/add-recipe" className="mt-4 inline-block text-orange-500 hover:text-orange-600">
                  Create your first recipe →
                </Link>
              )}
            </div>
          )}
          
          {!urlSearchQuery && !category && !userFilter && (
            <p className="mt-2 text-gray-600">No recipes available at the moment</p>
          )}
          
          <Link 
            to="/" 
            className="mt-6 inline-block px-6 py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
  
  // Calculate pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedRecipes = recipes.slice(startIndex, endIndex);
  
  // Main view - recipes found
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{pageTitle}</h1>
      
      <SearchBox />
      <ActionButtons />
      
      <div className="lg:flex lg:gap-8">
        {/* Filters sidebar */}
        <div className="lg:w-1/4 mb-6 lg:mb-0">
          <FiltersSidebar />
        </div>
        
        {/* Main content */}
        <div className="lg:w-3/4">
          <SortAndViewOptions />
          
          {/* Display results count */}
          <div className="text-sm text-gray-600 mb-6">
            Showing {startIndex + 1}-{Math.min(endIndex, recipes.length)} of {recipes.length} recipes
            {activeFiltersCount > 0 && (
              <span> • {activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filters'} applied</span>
            )}
          </div>
          
          {/* Grid View */}
          {activeView === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedRecipes.map((recipe) => (
                <RecipeCard 
                  key={recipe.idMeal || recipe.id || `recipe-${recipe.strMeal || recipe.title}`} 
                  recipe={recipe} 
                />
              ))}
            </div>
          )}
          
          {/* List View */}
          {activeView === 'list' && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {displayedRecipes.map((recipe, index) => {
                const id = recipe.idMeal || recipe.id;
                const title = recipe.strMeal || recipe.title;
                const category = recipe.strCategory || recipe.category;
                const area = recipe.strArea || recipe.area;
                const image = recipe.strMealThumb || recipe.image;
                
                return (
                  <Link 
                    key={id || `recipe-${index}`}
                    to={`/recipe/${id}`} 
                    className={`flex p-4 hover:bg-orange-50 transition-colors ${
                      index !== displayedRecipes.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={image || 'https://placehold.co/80x80/FDA172/ffffff?text=Recipe'} 
                        alt={title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/80x80/FDA172/ffffff?text=Recipe';
                        }}
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                      <div className="flex items-center mt-1 flex-wrap gap-1">
                        {category && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 mr-2">
                            {category}
                          </span>
                        )}
                        {area && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                            {area}
                          </span>
                        )}
                        {recipe.prepTime && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            <Clock className="h-3 w-3 mr-1" />
                            {recipe.prepTime}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-1">
                        {recipe.description || recipe.strInstructions?.substring(0, 100) || 'A delicious recipe waiting to be explored.'}
                      </p>
                      
                      {/* Rating if available */}
                      {recipe.rating && (
                        <div className="mt-2 flex items-center">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-4 w-4 ${
                                  star <= recipe.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                }`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-1 text-xs text-gray-500">
                            ({recipe.ratingCount || 0} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex items-center self-center">
                      <button className="p-2 rounded-full hover:bg-orange-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
          
          {/* Pagination */}
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default RecipeList;