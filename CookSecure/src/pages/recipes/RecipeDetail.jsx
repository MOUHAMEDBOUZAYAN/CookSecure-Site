// src/pages/recipes/RecipeDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { getRecipeById, getRandomRecipes, formatRecipeData, deleteRecipe } from '../../services/recipes';
import { useAuth } from '../../hooks/useAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Heart, Clock, User, Printer, Share2, Star, ChevronLeft } from 'lucide-react';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, favorites, addFavorite, removeFavorite } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [formattedRecipe, setFormattedRecipe] = useState(null);
  const [relatedRecipes, setRelatedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ingredients');
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [animateFavorite, setAnimateFavorite] = useState(false);

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

  // Check if this recipe is in favorites
  const recipeId = recipe?.idMeal || recipe?.id;
  const isFavorite = favorites?.some(fav => (fav.idMeal || fav.id) === recipeId);
  
  // Enhanced favorite handling with animation
  const handleFavoriteClick = () => {
    setAnimateFavorite(true);
    setTimeout(() => setAnimateFavorite(false), 700);
    
    if (isFavorite) {
      removeFavorite(recipeId);
      toast.info('Recette retirée des favoris');
    } else {
      addFavorite(recipe);
      toast.success('Recette ajoutée aux favoris!');
    }
  };

  // Handle print functionality
  const handlePrintRecipe = () => {
    window.print();
  };

  // Handle share functionality
  const handleShareRecipe = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.strMeal || recipe.title,
        text: `Découvrez cette délicieuse recette: ${recipe.strMeal || recipe.title}`,
        url: window.location.href,
      })
      .catch(err => {
        console.error('Error sharing recipe:', err);
        toast.info('Lien de la recette copié dans le presse-papier');
        copyToClipboard(window.location.href);
      });
    } else {
      toast.info('Lien de la recette copié dans le presse-papier');
      copyToClipboard(window.location.href);
    }
  };

  // Copy to clipboard utility
  const copyToClipboard = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
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
    <div className="bg-gray-50 print:bg-white">
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
        {/* Back navigation */}
        <div className="mb-6 print:hidden">
          <Link to="/recipes" className="inline-flex items-center text-gray-600 hover:text-orange-500">
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>Retour aux recettes</span>
          </Link>
        </div>
        
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
              {recipe.prepTime && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <Clock className="h-4 w-4 mr-1" />
                  {recipe.prepTime}
                </span>
              )}
              {recipe.userName && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  <User className="h-4 w-4 mr-1" />
                  {recipe.userName}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            {/* Favorite button - Enhanced with animation */}
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-full transition-all duration-300 border ${
                isFavorite 
                ? 'bg-red-500 text-white shadow-md border-red-500' 
                : 'bg-white text-gray-600 hover:text-red-500 hover:border-red-300 border-gray-300'
              } ${animateFavorite ? 'scale-125' : ''}`}
              title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <Heart className={`h-6 w-6 ${isFavorite ? 'fill-white' : ''} ${animateFavorite ? 'animate-pulse' : ''}`} />
            </button>
            
            {/* Print recipe button */}
            <button
              onClick={handlePrintRecipe}
              className="p-2 rounded-full bg-white text-gray-600 hover:text-orange-500 border border-gray-300 hover:border-orange-300"
              title="Imprimer la recette"
            >
              <Printer className="h-6 w-6" />
            </button>
            
            {/* Share recipe button */}
            <button
              onClick={handleShareRecipe}
              className="p-2 rounded-full bg-white text-gray-600 hover:text-blue-500 border border-gray-300 hover:border-blue-300"
              title="Partager la recette"
            >
              <Share2 className="h-6 w-6" />
            </button>
            
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
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl overflow-hidden shadow-md mb-8 group relative">
              <img 
                src={isBase64Image(recipeImage) ? recipeImage : recipeImage}
                alt={recipeTitle} 
                className="w-full h-72 md:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImage;
                }}
              />
              
              {/* Favorite overlay - appears on image hover */}
              <div className="absolute top-4 right-4 print:hidden">
                <button
                  onClick={handleFavoriteClick}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isFavorite 
                    ? 'bg-red-500 text-white shadow-lg' 
                    : 'bg-white/80 text-gray-700 opacity-0 group-hover:opacity-100 hover:bg-white'
                  }`}
                  title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  <Heart className={`h-7 w-7 ${isFavorite ? 'fill-white' : ''}`} />
                </button>
              </div>
            </div>
            
            {/* Recipe rating system */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-8 print:hidden">
              <div className="flex items-center justify-between">
                <p className="text-gray-700 font-medium">Évaluez cette recette:</p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className="h-6 w-6 cursor-pointer text-gray-300 hover:text-yellow-400" 
                      onClick={() => toast.success(`Vous avez noté cette recette ${star}/5 !`)}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex flex-wrap">
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
                            <div className="flex items-center justify-center h-5 w-5 bg-orange-100 rounded-md mr-3 print:hidden">
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-orange-500 border-orange-300 rounded"
                              />
                            </div>
                            <span className="font-medium text-gray-700 w-24">{item.measure}</span>
                            <span className="text-gray-600">{item.name}</span>
                          </li>
                        ))
                      ) : recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
                        recipe.ingredients.map((item, index) => (
                          <li key={index} className="flex items-center py-2 border-b border-gray-100">
                            <div className="flex items-center justify-center h-5 w-5 bg-orange-100 rounded-md mr-3 print:hidden">
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-orange-500 border-orange-300 rounded"
                              />
                            </div>
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
                            <div className="flex-1">
                              <p className="text-gray-600">{instruction.trim()}.</p>
                              {index === 0 && recipe.image && (
                                <div className="mt-4 mb-4 print:hidden">
                                  <div className="bg-orange-50 p-3 rounded-md">
                                    <p className="text-orange-700 text-sm italic">
                                      Astuce: Pour un résultat optimal, assurez-vous que tous les ingrédients sont à température ambiante avant de commencer.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
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
                            <div className="flex-1">
                              <p className="text-gray-600">{instruction.trim()}.</p>
                              {index === 0 && recipe.image && (
                                <div className="mt-4 mb-4 print:hidden">
                                  <div className="bg-orange-50 p-3 rounded-md">
                                    <p className="text-orange-700 text-sm italic">
                                      Astuce: Pour un résultat optimal, assurez-vous que tous les ingrédients sont à température ambiante avant de commencer.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
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
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        {recipe.prepTime && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-base font-medium text-gray-800 mb-2 flex items-center">
                              <Clock className="h-5 w-5 mr-2 text-orange-500" />
                              Temps de préparation:
                            </h4>
                            <p className="text-gray-600">{recipe.prepTime}</p>
                          </div>
                        )}
                        
                        {recipe.cookTime && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-base font-medium text-gray-800 mb-2 flex items-center">
                              <Clock className="h-5 w-5 mr-2 text-orange-500" />
                              Temps de cuisson:
                            </h4>
                            <p className="text-gray-600">{recipe.cookTime}</p>
                          </div>
                        )}
                        
                        {recipe.servings && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-base font-medium text-gray-800 mb-2 flex items-center">
                              <User className="h-5 w-5 mr-2 text-orange-500" />
                              Portions:
                            </h4>
                            <p className="text-gray-600">{recipe.servings}</p>
                          </div>
                        )}
                      </div>
                      
                      {recipe.strTags && (
                        <div className="mt-6">
                          <h4 className="text-base font-medium text-gray-800 mb-2">Tags:</h4>
                          <div className="flex flex-wrap gap-2">
                            {recipe.strTags.split(',').map((tag, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer transition">
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
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 print:break-inside-avoid">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Information Nutritionnelle</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Calories</span>
                    <span className="font-semibold text-gray-800">350 kcal</span>
                  </li>
                  <li className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Glucides</span>
                    <span className="font-semibold text-gray-800">45g</span>
                  </li>
                  <li className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Protéines</span>
                    <span className="font-semibold text-gray-800">20g</span>
                  </li>
                  <li className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Lipides</span>
                    <span className="font-semibold text-gray-800">10g</span>
                  </li>
                  <li className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Fibres</span>
                    <span className="font-semibold text-gray-800">5g</span>
                  </li>
                </ul>
                <small className="block mt-4 text-gray-500 text-xs">* Valeurs approximatives</small>
              </div>
            </div>
            
            {recipe.difficulty && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Difficulté</h3>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-orange-500 h-2.5 rounded-full" 
                        style={{ 
                          width: recipe.difficulty === 'Facile' ? '33%' : 
                                 recipe.difficulty === 'Moyen' ? '66%' : '100%' 
                        }}
                      ></div>
                    </div>
                    <span className="ml-4 px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-800">
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Favoris card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 print:hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Favoris</h3>
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={handleFavoriteClick}
                    className={`flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                      isFavorite 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`h-5 w-5 mr-2 ${isFavorite ? 'fill-white' : ''}`} />
                    {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  </button>
                  
                  <Link 
                    to="/favorites" 
                    className="flex items-center justify-center py-3 px-4 rounded-lg font-medium bg-orange-50 text-orange-600 hover:bg-orange-100 transition"
                  >
                    Voir tous vos favoris
                  </Link>
                </div>
              </div>
            </div>
            
            {(recipe.strSource || recipe.source) && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Source</h3>
                  <a 
                    href={recipe.strSource || recipe.source} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-orange-500 hover:text-orange-600 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Visiter la recette originale
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Related Recipes */}
        {relatedRecipes.length > 0 && (
          <section className="mt-12 print:hidden">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Vous aimerez peut-être aussi</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedRecipes.map(relatedRecipe => {
                const relatedRecipeId = relatedRecipe.idMeal || relatedRecipe.id;
                const isRelatedFavorite = favorites?.some(fav => (fav.idMeal || fav.id) === relatedRecipeId);
                
                return (
                  <div key={relatedRecipeId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                    <div className="relative">
                      <Link to={`/recipe/${relatedRecipeId}`}>
                        <div className="relative h-48">
                          <img 
                            src={relatedRecipe.strMealThumb || relatedRecipe.image || defaultImage} 
                            alt={relatedRecipe.strMeal || relatedRecipe.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.onerror = null; 
                              e.target.src = defaultImage;
                            }}
                          />
                        </div>
                      </Link>
                      
                      {/* Favorite button for related recipes */}
                      <button
                        onClick={() => {
                          if (isRelatedFavorite) {
                            removeFavorite(relatedRecipeId);
                            toast.info('Recette retirée des favoris');
                          } else {
                            addFavorite(relatedRecipe);
                            toast.success('Recette ajoutée aux favoris!');
                          }
                        }}
                        className={`absolute top-2 right-2 p-2 rounded-full ${
                          isRelatedFavorite 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white/80 text-gray-600 opacity-0 group-hover:opacity-100'
                        } transition-all duration-300`}
                      >
                        <Heart className={`h-5 w-5 ${isRelatedFavorite ? 'fill-white' : ''}`} />
                      </button>
                    </div>
                    
                    <Link to={`/recipe/${relatedRecipeId}`}>
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-1 truncate">
                          {relatedRecipe.strMeal || relatedRecipe.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500">
                            {relatedRecipe.strCategory || relatedRecipe.category || 'Recette'}
                          </p>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                            <span className="text-sm text-gray-700">4.5</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 text-center">
              <Link 
                to="/recipes" 
                className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition duration-300"
              >
                Découvrir plus de recettes
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
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
      
      {/* Add to favorites toast notification */}
      <div id="favorite-toast" className="fixed bottom-0 right-0 m-6 transform translate-y-16 opacity-0 transition-all duration-500 pointer-events-none">
        <div className="bg-white rounded-lg shadow-lg p-4 flex items-center">
          <Heart className="h-6 w-6 text-red-500 mr-3" fill="currentColor" />
          <p className="text-gray-800">Recette ajoutée aux favoris!</p>
        </div>
      </div>
      
      {/* Add to favorites floating button (mobile) */}
      <div className="lg:hidden fixed bottom-6 right-6 z-10 print:hidden">
        <button
          onClick={handleFavoriteClick}
          className={`h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-700'
          }`}
        >
          <Heart className={`h-7 w-7 ${isFavorite ? 'fill-white' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default RecipeDetail;