// src/pages/recipes/RecipeList.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import RecipeCard from '../../components/RecipeCard';
import { getRecipes, getRecipesByCategory, searchRecipes, getUserRecipes } from '../../services/recipes';
import { useAuth } from '../../hooks/useAuth';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  
  const { category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, canManageRecipes } = useAuth();
  const searchRef = useRef(null);
  
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
        const validRecipes = recipeData.filter(recipe => 
          recipe && (recipe.id || recipe.idMeal)
        );
        
        console.log(`Valid recipes: ${validRecipes.length}`);
        setRecipes(validRecipes);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError('Failed to load recipes. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchRecipes();
  }, [category, urlSearchQuery, userFilter, user]);
  
  // Search box component
  const SearchBox = () => (
    <div ref={searchRef} className="relative mb-8">
      <form onSubmit={handleSearch} className="flex">
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.trim().length >= 2) {
                setShowSuggestions(true);
              }
            }}
            onFocus={() => {
              if (searchQuery && searchQuery.trim().length >= 2) {
                setShowSuggestions(true);
              }
            }}
            placeholder="Rechercher des recettes..."
            className="w-full px-4 py-3 pl-10 pr-16 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            autoComplete="off"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSuggestions([]);
              }}
              className="absolute inset-y-0 right-12 flex items-center pr-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <button
          type="submit"
          className="ml-2 px-6 py-3 bg-orange-500 text-white rounded-lg shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          Rechercher
        </button>
      </form>
      
      {/* Suggestions dropdown */}
      {showSuggestions && searchQuery && searchQuery.trim().length >= 2 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto">
          {suggestionsLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin inline-block h-5 w-5 border-t-2 border-b-2 border-orange-500 rounded-full mr-2"></div>
              Chargement des suggestions...
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{recipe.title || recipe.strMeal}</p>
                      <p className="text-sm text-gray-500">
                        {recipe.category || recipe.strCategory || 'Recette'}
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
                Rechercher "{searchQuery}"
              </li>
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Aucune recette trouvée avec "{searchQuery}"
              <div className="mt-2">
                <button
                  onClick={handleSearch}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Rechercher "{searchQuery}" quand même
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Mes Recettes
            </Link>
          ) : (
            <Link 
              to="/recipes" 
              className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              Toutes les Recettes
            </Link>
          )}
          
          <Link 
            to="/add-recipe" 
            className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Ajouter une Recette
          </Link>
        </>
      )}
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
          <p className="ml-3 text-gray-600">Chargement des recettes...</p>
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
            Retour à l'accueil
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
          <h2 className="mt-4 text-xl font-medium text-gray-900">Aucune recette trouvée</h2>
          
          {urlSearchQuery && (
            <p className="mt-2 text-gray-600">Aucune recette ne correspond à votre recherche "{urlSearchQuery}"</p>
          )}
          
          {category && (
            <p className="mt-2 text-gray-600">Aucune recette trouvée dans la catégorie {category}</p>
          )}
          
          {userFilter === 'mine' && (
            <div className="mt-2 text-gray-600">
              <p>Vous n'avez pas encore créé de recettes</p>
              {canManageRecipes && canManageRecipes() && (
                <Link to="/add-recipe" className="mt-4 inline-block text-orange-500 hover:text-orange-600">
                  Créer votre première recette →
                </Link>
              )}
            </div>
          )}
          
          {!urlSearchQuery && !category && !userFilter && (
            <p className="mt-2 text-gray-600">Aucune recette disponible pour le moment</p>
          )}
          
          <Link 
            to="/" 
            className="mt-6 inline-block px-6 py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }
  
  // Recipes found - regular view
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{pageTitle}</h1>
      
      <SearchBox />
      <ActionButtons />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe, index) => (
          <RecipeCard 
            key={recipe.idMeal || recipe.id || `recipe-${index}`} 
            recipe={recipe} 
          />
        ))}
      </div>
    </div>
  );
};

export default RecipeList; 