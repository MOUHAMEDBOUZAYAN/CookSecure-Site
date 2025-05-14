// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import HeroSection from '../components/HeroSection';
import { getRandomRecipes, getCategories, getUserRecipes } from '../services/recipes';

const Home = () => {
  const [featuredRecipe, setFeaturedRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get categories
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        
        // Get random recipes
        const randomRecipes = await getRandomRecipes(9);
        
        // Set the first random recipe as featured
        if (randomRecipes.length > 0) {
          setFeaturedRecipe(randomRecipes[0]);
          setRecipes(randomRecipes.slice(1));
        }
        
        // Get user recipes from db.json
        const userRecipesData = await getUserRecipes();
        setUserRecipes(userRecipesData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data for homepage:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 relative animate-spin">
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-8 border-orange-200 border-t-orange-500"></div>
          </div>
          <p className="mt-4 text-orange-800 font-medium animate-pulse">Loading culinary inspiration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50 min-h-screen">
      {/* Hero Section with Featured Recipe */}
      {featuredRecipe && (
        <HeroSection recipe={featuredRecipe} />
      )}
      
      {/* Search Bar Section */}
      <section className="py-10 bg-white shadow-md relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl p-6 shadow-lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-orange-800 mb-2">
                Find the Perfect Recipe
              </h2>
              <p className="text-gray-700">
                Search from thousands of delicious recipes for any meal, ingredient, or occasion
              </p>
            </div>
            
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for recipes, ingredients, cuisines..." 
                  className="w-full pl-12 pr-4 py-4 rounded-lg shadow-sm border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  aria-label="Search recipes"
                />
              </div>
              <button 
                type="submit" 
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg shadow-md hover:shadow-lg hover:from-orange-600 hover:to-amber-700 transition-all duration-300 font-medium flex items-center justify-center"
              >
                <span>Search</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </form>
            
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="text-sm text-gray-600">Popular searches:</span>
              {['Pasta', 'Chicken', 'Vegan', 'Dessert', 'Quick meals'].map((term, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(term);
                    navigate(`/search?q=${encodeURIComponent(term)}`);
                  }}
                  className="text-sm px-3 py-1 bg-white rounded-full border border-gray-200 text-gray-700 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Explore Recipe Categories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover dishes from around the world, from quick breakfast ideas to elaborate dinner recipes
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
            {categories.map((category, index) => (
              <div 
                key={category.idCategory}
                className="group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link 
                  to={`/category/${category.strCategory}`} 
                  className="flex flex-col items-center"
                >
                  <div className="relative mb-4 rounded-full overflow-hidden transition-all duration-500 transform group-hover:scale-105 shadow-md group-hover:shadow-xl border-2 border-transparent group-hover:border-orange-200">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100">
                      <img 
                        src={category.strCategoryThumb} 
                        alt={category.strCategory} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/200x200/FDA172/ffffff?text=${category.strCategory.charAt(0)}`;
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors duration-300">{category.strCategory}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Simple and tasty recipes section */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-orange-200 to-transparent"></div>
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-amber-200 to-transparent"></div>
          <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23f97316\' fill-opacity=\'0.08\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 text-sm font-medium rounded-full mb-4 border border-orange-200">
              Chef's Selection
            </span>
            <h2 className="text-3xl font-serif font-bold mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Simple and Tasty Recipes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Delicious meals that anyone can make, perfect for both beginners and experienced cooks
            </p>
          </div>
          
          {/* Category filters */}
          <div className="flex flex-wrap justify-center mb-8 gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === 'all'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Recipes
            </button>
            {categories.slice(0, 5).map(category => (
              <button
                key={category.idCategory}
                onClick={() => setActiveCategory(category.strCategory)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.strCategory
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.strCategory}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.slice(0, 6).map((recipe, index) => (
              <RecipeCard 
                key={recipe.idMeal || `recipe-${index}`} 
                recipe={recipe} 
              />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/recipes"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-lg text-base font-medium text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Explore All Recipes
            </Link>
          </div>
        </div>
      </section>
      
      {/* Chef Banner */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="bg-white/20 backdrop-blur-sm py-2 px-4 rounded-full inline-block mb-6">
                <span className="text-white/90 text-sm font-medium">Join our community</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 leading-tight">Everyone can be a chef in their own kitchen!</h2>
              <p className="text-white/90 mb-8 max-w-lg">
                Share your culinary creations with our community. Whether you're a beginner or a seasoned chef, your recipes can inspire others.
              </p>
              <Link 
                to="/add-recipe" 
                className="inline-flex items-center px-6 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-all duration-300 shadow-lg transform hover:-translate-y-1 hover:shadow-xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Recipe
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-lg transform transition-transform duration-700 hover:scale-105 hover:rotate-3">
                <img 
                  src="/assets/images/Chef1.jpg" 
                  alt="Chef" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/400x400/FDA172/ffffff?text=Chef';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Instagram Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-pink-500">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-serif font-bold mb-4 bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
              Join Our Food Community on Instagram
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow us for daily food inspiration, cooking tips, and behind-the-scenes moments from our kitchen to yours
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recipes.slice(0, 4).map((recipe, index) => (
              <div 
                className="aspect-square overflow-hidden rounded-lg group relative shadow-md hover:shadow-xl transition-all duration-300" 
                key={recipe.idMeal || `insta-${index}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <img 
                  src={recipe.strMealThumb} 
                  alt={recipe.strMeal} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-end p-4">
                  <p className="text-white font-medium text-sm mb-2 text-center line-clamp-2">{recipe.strMeal}</p>
                  <div className="flex space-x-3">
                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-pink-300/20 transform hover:-translate-y-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              Follow Us @CookSecure
            </a>
          </div>
        </div>
      </section>
      
      {/* This week's recipes */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 text-sm font-medium rounded-full mb-4 border border-orange-200">
              Fresh & Seasonal
            </span>
            <h2 className="text-3xl font-serif font-bold mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Try these delicious recipes this week
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Fresh inspiration for your weekly meal planning, featuring seasonal ingredients and trending flavors
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.slice(6).map((recipe, index) => (
              <RecipeCard 
                key={recipe.idMeal || `weekly-${index}`} 
                recipe={recipe} 
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Deliciousness delivered section */}
      <section className="py-20 bg-gradient-to-r from-orange-100 to-amber-100 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23f97316\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
            <div className="text-center">
              <div className="inline-block mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Deliciousness to your inbox</h2>
              <p className="text-gray-600 mb-8">Sign up for our newsletter to receive recipes every week, cooking tips, and exclusive offers!</p>
              <form className="flex flex-col sm:flex-row">
                <div className="relative flex-grow mb-3 sm:mb-0 sm:mr-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                  />
                </div>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg shadow-lg hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-1 font-medium"
                >
                  Subscribe
                </button>
              </form>
              <p className="mt-4 text-xs text-gray-500">By subscribing, you agree to our Privacy Policy. We'll never share your email address.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;