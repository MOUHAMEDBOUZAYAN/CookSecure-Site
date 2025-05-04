// src/pages/recipes/RecipeDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { getRecipeById, getRandomRecipes, formatRecipeData, deleteRecipe } from '../../services/recipes';
import { useAuth } from '../../hooks/useAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [formattedRecipe, setFormattedRecipe] = useState(null);
  const [relatedRecipes, setRelatedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ingredients');
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Show toast if there's a success message in location state
    if (location.state && location.state.message) {
      toast.success(location.state.message);
    }

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
        setError('Failed to load recipe. Please try again.');
        setLoading(false);
      }
    };
    
    fetchRecipeDetails();
  }, [id, location.state]);

  // Check if user can edit or delete this recipe
  const canModifyRecipe = () => {
    if (!user || !recipe) return false;
    return user.role === 'admin' || (recipe.userId && recipe.userId === user.id);
  };

  // Handle recipe deletion
  const handleDeleteRecipe = async () => {
    try {
      setDeleting(true);
      await deleteRecipe(id);
      navigate('/recipes', { 
        state: { message: 'Recette supprimée avec succès!' } 
      });
    } catch (error) {
      console.error('Error deleting recipe:', error);
      setError('Failed to delete recipe. Please try again.');
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Default image
  const defaultImage = "https://placehold.co/800x600/f97316/ffffff?text=No+Image";
  
  // Check if image URL is base64
  const isBase64Image = (url) => {
    return typeof url === 'string' && url.startsWith('data:image');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <p className="ml-3 text-gray-600">Chargement de la recette...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
          <p>{error}</p>
        </div>
        <Link to="/recipes" className="inline-block px-6 py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition duration-300">
          Retour aux recettes
        </Link>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recette introuvable</h2>
        <p className="text-gray-600 mb-6">La recette que vous cherchez n'existe pas ou a été supprimée.</p>
        <Link to="/" className="inline-block px-6 py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition duration-300">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  // Get recipe title, user-friendly
  const recipeTitle = recipe.strMeal || recipe.title;
  
  // Get recipe image, with fallback
  const recipeImage = recipe.strMealThumb || recipe.image || defaultImage;
  
  // Get recipe category
  const recipeCategory = recipe.strCategory || recipe.category;
  
  // Get recipe area/region
  const recipeArea = recipe.strArea || recipe.area;

  return (
    <div className="bg-gray-50">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">{recipeTitle}</h1>
            <div className="flex flex-wrap gap-2">
              {recipeCategory && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                  {recipeCategory}
                </span>
              )}
              {recipeArea && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {recipeArea}
                </span>
              )}
            </div>
          </div>
          
          {/* Edit/Delete buttons for recipe owner or admin */}
          {canModifyRecipe() && (
            <div className="flex gap-2">
              <Link 
                to={`/edit-recipe/${id}`}
                className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Modifier
              </Link>
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer
              </button>
            </div>
          )}
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl overflow-hidden shadow-md mb-8">
              <img 
                src={isBase64Image(recipeImage) ? recipeImage : recipeImage}
                alt={recipeTitle} 
                className="w-full h-72 md:h-96 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImage;
                }}
              />
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button 
                    className={`px-6 py-4 font-medium text-sm ${activeTab === 'ingredients' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('ingredients')}
                  >
                    Ingrédients
                  </button>
                  <button 
                    className={`px-6 py-4 font-medium text-sm ${activeTab === 'directions' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('directions')}
                  >
                    Instructions
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingrédients</h3>
                    <ul className="space-y-2">
                      {formattedRecipe && formattedRecipe.ingredients && formattedRecipe.ingredients.length > 0 ? (
                        formattedRecipe.ingredients.map((item, index) => (
                          <li key={index} className="flex items-center py-2 border-b border-gray-100">
                            <span className="font-medium text-gray-700 w-24">{item.measure}</span>
                            <span className="text-gray-600">{item.name}</span>
                          </li>
                        ))
                      ) : recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
                        recipe.ingredients.map((item, index) => (
                          <li key={index} className="flex items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">{item}</span>
                          </li>
                        ))
                      ) : (
                        <p className="text-gray-500">Aucun ingrédient listé pour cette recette.</p>
                      )}
                    </ul>
                  </div>
                )}
                
                {activeTab === 'directions' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
                    <div className="space-y-6">
                      {recipe.strInstructions ? (
                        recipe.strInstructions.split('.').filter(instruction => instruction.trim() !== '').map((instruction, index) => (
                          <div key={index} className="flex">
                            <div className="flex-shrink-0 mr-4">
                              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 text-orange-500 font-semibold">
                                {index + 1}
                              </div>
                            </div>
                            <p className="text-gray-600">{instruction.trim()}.</p>
                          </div>
                        ))
                      ) : recipe.instructions ? (
                        recipe.instructions.split('.').filter(instruction => instruction.trim() !== '').map((instruction, index) => (
                          <div key={index} className="flex">
                            <div className="flex-shrink-0 mr-4">
                              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 text-orange-500 font-semibold">
                                {index + 1}
                              </div>
                            </div>
                            <p className="text-gray-600">{instruction.trim()}.</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">Aucune instruction fournie pour cette recette.</p>
                      )}
                    </div>
                  </div>
                )}
                
                {activeTab === 'notes' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                    <div className="space-y-4">
                      {recipe.notes ? (
                        <p className="text-gray-600">{recipe.notes}</p>
                      ) : (
                        <p className="text-gray-600">
                          Cette recette provient de {recipe.strSource ? (
                            <a href={recipe.strSource} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600">
                              la source originale
                            </a>
                          ) : recipe.source ? (
                            <a href={recipe.source} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600">
                              la source originale
                            </a>
                          ) : recipe.userName ? (
                            <span className="font-medium">{recipe.userName}</span>
                          ) : 'le créateur de la recette'}
                        </p>
                      )}
                      
                      {recipe.prepTime && (
                        <div className="mt-4">
                          <h4 className="text-base font-medium text-gray-800 mb-2">Temps de préparation:</h4>
                          <p className="text-gray-600">{recipe.prepTime}</p>
                        </div>
                      )}
                      
                      {recipe.cookTime && (
                        <div className="mt-4">
                          <h4 className="text-base font-medium text-gray-800 mb-2">Temps de cuisson:</h4>
                          <p className="text-gray-600">{recipe.cookTime}</p>
                        </div>
                      )}
                      
                      {recipe.servings && (
                        <div className="mt-4">
                          <h4 className="text-base font-medium text-gray-800 mb-2">Portions:</h4>
                          <p className="text-gray-600">{recipe.servings}</p>
                        </div>
                      )}
                      
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
            
            {recipe.difficulty && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Difficulté</h3>
                  <div className="flex items-center">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-800">
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {(recipe.strSource || recipe.source) && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Source</h3>
                  <a 
                    href={recipe.strSource || recipe.source} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-orange-500 hover:text-orange-600"
                  >
                    Visiter la recette originale
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Related Recipes */}
        {relatedRecipes.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Vous aimerez peut-être aussi</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedRecipes.map(relatedRecipe => (
                <div key={relatedRecipe.idMeal || relatedRecipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <Link to={`/recipe/${relatedRecipe.idMeal || relatedRecipe.id}`}>
                    <div className="relative h-48">
                      <img 
                        src={relatedRecipe.strMealThumb || relatedRecipe.image || defaultImage} 
                        alt={relatedRecipe.strMeal || relatedRecipe.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = defaultImage;
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-1 truncate">
                        {relatedRecipe.strMeal || relatedRecipe.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {relatedRecipe.strCategory || relatedRecipe.category || 'Recipe'}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Supprimer la recette</h3>
            <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer cette recette? Cette action ne peut pas être annulée.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteRecipe}
                disabled={deleting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                {deleting ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    Suppression...
                  </div>
                ) : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;