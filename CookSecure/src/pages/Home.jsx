// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import HeroSection from '../components/HeroSection';
import { getRandomRecipes, getCategories, getUserRecipes } from '../services/recipes';

const Home = () => {
  const [featuredRecipe, setFeaturedRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section with Featured Recipe */}
      {featuredRecipe && (
        <HeroSection recipe={featuredRecipe} />
      )}
      
      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map(category => (
              <Link 
                to={`/category/${category.strCategory}`} 
                className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition duration-300 group" 
                key={category.idCategory}
              >
                <div className="w-16 h-16 rounded-full overflow-hidden mb-3">
                  <img 
                    src={category.strCategoryThumb} 
                    alt={category.strCategory} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-500 transition duration-300">{category.strCategory}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Simple and tasty recipes section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">Simple and tasty recipes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.slice(0, 6).map(recipe => (
              <RecipeCard key={recipe.idMeal} recipe={recipe} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Chef Banner */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-serif font-bold mb-4">Everyone can be a chef in their own kitchen!</h2>
              <Link 
                to="/add-recipe" 
                className="inline-block px-6 py-3 bg-white text-orange-500 rounded-md font-medium hover:bg-gray-100 transition duration-300"
              >
                Create Recipe
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img 
                  src="/assets/images/Chef1.jpg" 
                  alt="Chef" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x300?text=Chef';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Instagram Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">Check our deliciousness on Instagram</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {recipes.slice(0, 4).map(recipe => (
              <div className="aspect-square overflow-hidden rounded-md group relative" key={recipe.idMeal}>
                <img 
                  src={recipe.strMealThumb} 
                  alt={recipe.strMeal} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-0 w-0 group-hover:h-10 group-hover:w-10 text-white transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md font-medium hover:from-purple-600 hover:to-pink-600 transition duration-300"
            >
              Follow Us
            </a>
          </div>
        </div>
      </section>
      
      {/* This week's recipes */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">Try this delicious recipe this week</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.slice(6).map(recipe => (
              <RecipeCard key={recipe.idMeal} recipe={recipe} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Deliciousness delivered section */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Deliciousness to your inbox</h2>
            <p className="text-gray-600 mb-6">Sign up for our newsletter to receive recipes every week!</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-3 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <button 
                type="submit" 
                className="px-6 py-3 bg-orange-500 text-white rounded-r-md border border-orange-500 hover:bg-orange-600 transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;