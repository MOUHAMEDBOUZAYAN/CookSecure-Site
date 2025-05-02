import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const HeroSection = ({ featuredRecipes, activeRecipeIndex, setActiveRecipeIndex }) => {
  // Auto rotate featured recipes every 5 seconds if parent component doesn't handle it
  useEffect(() => {
    if (featuredRecipes.length > 0 && !setActiveRecipeIndex) {
      const interval = setInterval(() => {
        setActiveRecipeIndex(current => 
          current === featuredRecipes.length - 1 ? 0 : current + 1
        );
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [featuredRecipes, setActiveRecipeIndex]);

  // Get the current active recipe or use default data if no recipes available
  const activeRecipe = featuredRecipes.length > 0 
    ? featuredRecipes[activeRecipeIndex] 
    : { 
        title: 'Spicy delicious chicken wings',
        description: 'Lorem ipsum dolor sit amet, consectetuipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqut enim ad minim',
        cookingTime: '30 Minutes',
        category: 'Chicken',
        author: 'John Smith',
        date: '15 March 2022',
        image: null
      };

  return (
    <div className="bg-blue-50/60 py-10 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-7xl bg-blue-50/90 py-12 px-6 lg:px-12 rounded-3xl shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 z-10">
              {/* Hot Recipes Badge */}
              <div className="mb-6">
                <span className="bg-white px-4 py-2 rounded-full inline-flex items-center shadow-sm">
                  <span className="bg-orange-100 text-orange-500 p-1 rounded-full mr-2">🔥</span>
                  <span className="font-medium">Hot Recipes</span>
                </span>
              </div>
              
              {/* Recipe Title & Description */}
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {activeRecipe.title}
              </h1>
              <p className="text-gray-600 mb-8 max-w-lg">
                {activeRecipe.description}
              </p>
              
              {/* Cooking Info */}
              <div className="flex mb-8">
                <div className="flex items-center bg-white px-3 py-2 rounded-full mr-4 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>{activeRecipe.cookingTime || '30 Minutes'}</span>
                </div>
                
                <div className="flex items-center bg-white px-3 py-2 rounded-full shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M17 9V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h3"></path>
                    <path d="M12 19h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-8v12z"></path>
                  </svg>
                  <span>{activeRecipe.category || 'Chicken'}</span>
                </div>
              </div>
              
              {/* Author Info */}
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 overflow-hidden rounded-full mr-3 bg-gray-200">
                  <img 
                    src={activeRecipe.authorImage || "/api/placeholder/100/100"} 
                    alt={activeRecipe.author || "Chef"} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <p className="font-medium">{activeRecipe.author || 'John Smith'}</p>
                  <p className="text-gray-500 text-sm">{activeRecipe.date || '15 March 2022'}</p>
                </div>
              </div>
              
              {/* View Recipes Button */}
              <div>
                <Link to="/recipes" className="inline-flex items-center bg-black text-white px-6 py-3 rounded-full font-medium transition-colors">
                  View Recipes
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Right side with recipe image */}
            <div className="md:w-1/2 relative flex justify-center">
              {/* Main Dish Image */}
              <div className="relative w-[350px] h-[350px] md:w-[400px] md:h-[400px]">
                <img 
                  src={activeRecipe.image || "/api/placeholder/600/600"} 
                  alt={activeRecipe.title} 
                  className="w-full h-full object-contain z-10 relative"
                  style={{ filter: 'drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.1))' }}
                />
                
                {/* Circle background for the image */}
                <div className="absolute inset-0 bg-white rounded-full transform scale-95 -z-10">
                  {/* This creates a white circular background */}
                </div>
                
                {/* Decorative dots pattern - optional */}
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-100 rounded-full opacity-50"></div>
                <div className="absolute -right-8 -top-8 w-16 h-16 bg-orange-100 rounded-full opacity-50"></div>
              </div>
              
              {/* Handpicked Recipe Badge */}
              <div className="absolute top-1/4 left-0 transform -translate-x-1/2 z-20">
                <div className="bg-black text-white rounded-full p-3 w-24 h-24 flex flex-col items-center justify-center shadow-lg">
                  <div className="bg-white text-black rounded-full p-1 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                    </svg>
                  </div>
                  <span className="text-xs text-center leading-tight">HANDPICKED RECIPES</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recipe carousel indicators - shown only when there are multiple recipes */}
          {featuredRecipes.length > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {featuredRecipes.slice(0, 4).map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveRecipeIndex(idx)} 
                  className={`w-3 h-3 rounded-full ${activeRecipeIndex === idx ? 'bg-blue-500' : 'bg-gray-300'}`}
                  aria-label={`Go to recipe ${idx + 1}`}
                ></button>
              ))}
            </div>
          )}
          
          {/* Animated cards - visible when recipes are available */}
          {featuredRecipes.length > 1 && (
            <div className="absolute top-1/2 right-0 transform translate-x-1/4 -translate-y-1/2 hidden md:block">
              <div className="relative">
                {featuredRecipes.slice(0, 3).map((recipe, idx) => (
                  idx !== activeRecipeIndex && (
                    <div 
                      key={recipe.id}
                      className={`absolute top-0 w-48 h-64 bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 opacity-0 transform`}
                      style={{
                        opacity: idx === (activeRecipeIndex + 1) % featuredRecipes.length ? 0.7 : 
                                idx === (activeRecipeIndex + 2) % featuredRecipes.length ? 0.4 : 0,
                        transform: `translateX(${idx === (activeRecipeIndex + 1) % featuredRecipes.length ? '30px' : '60px'}) 
                                    translateY(${idx === (activeRecipeIndex + 1) % featuredRecipes.length ? '20px' : '40px'})
                                    scale(${idx === (activeRecipeIndex + 1) % featuredRecipes.length ? 0.9 : 0.8})`,
                        zIndex: featuredRecipes.length - idx
                      }}
                    >
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={recipe.image || `/api/placeholder/200/150`}
                          alt={recipe.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-sm truncate">{recipe.title}</h3>
                        <p className="text-xs text-gray-500">{recipe.author || 'Chef'}</p>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

HeroSection.propTypes = {
  featuredRecipes: PropTypes.array,
  activeRecipeIndex: PropTypes.number,
  setActiveRecipeIndex: PropTypes.func
};

HeroSection.defaultProps = {
  featuredRecipes: [],
  activeRecipeIndex: 0
};

export default HeroSection;