// src/pages/recipes/RecipeDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRecipeById, getRandomRecipes, formatRecipeData } from '../../services/recipes';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [formattedRecipe, setFormattedRecipe] = useState(null);
  const [relatedRecipes, setRelatedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ingredients');

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch recipe details
        const recipeData = await getRecipeById(id);
        setRecipe(recipeData);
        
        if (recipeData) {
          // Format the recipe data
          const formatted = formatRecipeData(recipeData);
          setFormattedRecipe(formatted);
          
          // Fetch related recipes (random in this case, but you could filter by category)
          const randomRecipes = await getRandomRecipes(4);
          setRelatedRecipes(randomRecipes);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
        setLoading(false);
      }
    };
    
    fetchRecipeDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <p className="ml-3 text-gray-600">Loading recipe...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recipe Not Found</h2>
        <p className="text-gray-600 mb-6">The recipe you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="inline-block px-6 py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition duration-300">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">{recipe.strMeal}</h1>
          <div className="flex flex-wrap gap-2">
            {recipe.strCategory && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                {recipe.strCategory}
              </span>
            )}
            {recipe.strArea && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {recipe.strArea}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl overflow-hidden shadow-md mb-8">
              <img 
                src={recipe.strMealThumb} 
                alt={recipe.strMeal} 
                className="w-full h-72 md:h-96 object-cover"
              />
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button 
                    className={`px-6 py-4 font-medium text-sm ${activeTab === 'ingredients' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('ingredients')}
                  >
                    Ingredients
                  </button>
                  <button 
                    className={`px-6 py-4 font-medium text-sm ${activeTab === 'directions' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('directions')}
                  >
                    Directions
                  </button>
                  <button 
                    className={`px-6 py-4 font-medium text-sm ${activeTab === 'notes' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('notes')}
                  >
                    Notes
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {activeTab === 'ingredients' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingredients</h3>
                    <ul className="space-y-2">
                      {formattedRecipe.ingredients.map((item, index) => (
                        <li key={index} className="flex items-center py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-700 w-24">{item.measure}</span>
                          <span className="text-gray-600">{item.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {activeTab === 'directions' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Directions</h3>
                    <div className="space-y-6">
                      {recipe.strInstructions.split('.').filter(instruction => instruction.trim() !== '').map((instruction, index) => (
                        <div key={index} className="flex">
                          <div className="flex-shrink-0 mr-4">
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 text-orange-500 font-semibold">
                              {index + 1}
                            </div>
                          </div>
                          <p className="text-gray-600">{instruction.trim()}.</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'notes' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        This recipe comes from {recipe.strSource ? (
                          <a href={recipe.strSource} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600">
                            the original source
                          </a>
                        ) : 'TheMealDB'}
                      </p>
                      
                      {recipe.strTags && (
                        <div>
                          <h4 className="text-base font-medium text-gray-800 mb-2">Tags:</h4>
                          <div className="flex flex-wrap gap-2">
                            {recipe.strTags.split(',').map((tag, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {recipe.strYoutube && (
                        <div>
                          <h4 className="text-base font-medium text-gray-800 mb-2">Video Tutorial:</h4>
                          <a 
                            href={recipe.strYoutube} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            Watch on YouTube
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nutrition Information</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Calories</span>
                    <span className="font-semibold text-gray-800">350 kcal</span>
                  </li>
                  <li className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Carbs</span>
                    <span className="font-semibold text-gray-800">45g</span>
                  </li>
                  <li className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Protein</span>
                    <span className="font-semibold text-gray-800">20g</span>
                  </li>
                  <li className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Fat</span>
                    <span className="font-semibold text-gray-800">10g</span>
                  </li>
                </ul>
                <small className="block mt-4 text-gray-500 text-xs">* Approximate values</small>
              </div>
            </div>
            
            {recipe.strSource && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Source</h3>
                  <a 
                    href={recipe.strSource} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-orange-500 hover:text-orange-600"
                  >
                    Visit Original Recipe
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mt-12 p-6">
          <div className="flex flex-col sm:flex-row items-center">
            <div className="sm:w-1/4 mb-4 sm:mb-0">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden">
                <img 
                  src="/assets/images/Chef1.jpg" 
                  alt="Chef" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/100x100?text=Chef';
                  }}
                />
              </div>
            </div>
            <div className="sm:w-3/4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Recipe by Chef Jane</h3>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </div>
        
        {/* Related Recipes */}
        <section className="mt-12">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">You may like these recipes too</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedRecipes.map(relatedRecipe => (
              <div key={relatedRecipe.idMeal} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <Link to={`/recipe/${relatedRecipe.idMeal}`}>
                  <div className="relative h-48">
                    <img 
                      src={relatedRecipe.strMealThumb} 
                      alt={relatedRecipe.strMeal} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-1 truncate">{relatedRecipe.strMeal}</h3>
                    <p className="text-sm text-gray-500">{relatedRecipe.strCategory}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
      
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

export default RecipeDetail;