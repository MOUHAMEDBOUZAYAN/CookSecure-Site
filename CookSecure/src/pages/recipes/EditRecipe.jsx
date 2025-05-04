// src/pages/recipes/EditRecipe.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getRecipeById, updateRecipe } from '../../services/recipes';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditRecipe = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    title: '',
    category: '',
    description: '',
    ingredients: '',
    instructions: '',
    image: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: 'Medium',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Predefined categories for selection
  const categories = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Appetizer',
    'Soup',
    'Salad',
    'Main Course',
    'Side Dish',
    'Dessert',
    'Snack',
    'Beverage',
    'Baking',
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Seafood',
    'Miscellaneous'
  ];

  // Difficulty levels
  const difficultyLevels = ['Easy', 'Medium', 'Hard', 'Chef Level'];

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const data = await getRecipeById(id);
        
        // Check user authorization - only recipe owner or admin can edit
        if (data.userId !== user?.id && user?.role !== 'admin') {
          toast.error('Vous n\'êtes pas autorisé à modifier cette recette');
          setTimeout(() => navigate('/recipes'), 2000);
          return;
        }
        
        // Format ingredients array to string with line breaks
        const ingredientsText = Array.isArray(data.ingredients) 
          ? data.ingredients.join('\n') 
          : data.ingredients;
        
        // Set recipe data in state
        setRecipe({
          ...data,
          ingredients: ingredientsText,
          category: data.strCategory || data.category || '',
          title: data.strMeal || data.title || '',
          description: data.description || '',
          instructions: data.strInstructions || data.instructions || '',
          image: data.strMealThumb || data.image || '',
          prepTime: data.prepTime || '',
          cookTime: data.cookTime || '',
          servings: data.servings || '',
          difficulty: data.difficulty || 'Medium',
          notes: data.notes || ''
        });
        
        // Set preview image
        if (data.strMealThumb || data.image) {
          setPreviewImage(data.strMealThumb || data.image);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to load recipe:', error);
        toast.error('Échec du chargement de la recette');
        setLoading(false);
      }
    };
    
    fetchRecipe();
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const ingredientsArray = recipe.ingredients.split('\n').filter(i => i.trim() !== '');
      
      let imageUrl = recipe.image;
      
      // If file is selected, convert to base64 or upload to server
      if (selectedFile) {
        // For this example, we'll convert to base64
        imageUrl = await convertFileToBase64(selectedFile);
      }
      
      await updateRecipe(id, {
        ...recipe,
        ingredients: ingredientsArray,
        image: imageUrl
      });
      
      // Show success message via toast
      toast.success('Recette mise à jour avec succès!');
      
      // Navigate to recipe detail page
      setTimeout(() => {
        navigate(`/recipe/${id}`, { 
          state: { message: 'Recette mise à jour avec succès!' }
        });
      }, 1000);
    } catch (error) {
      console.error('Failed to update recipe:', error);
      toast.error('Échec de la mise à jour de la recette. Veuillez réessayer.');
      setIsSubmitting(false);
    }
  };

  // Convert file to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({ ...prev, [name]: value }));
    
    // Set preview image when image URL changes
    if (name === 'image' && value) {
      setPreviewImage(value);
      setSelectedFile(null); // Clear any selected file when URL is entered
    }
  };
  
  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner un fichier image');
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La taille de l\'image doit être inférieure à 5 Mo');
      return;
    }
    
    setSelectedFile(file);
    
    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
    
    // Clear any existing image URL
    setRecipe(prev => ({ ...prev, image: '' }));
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Default image for preview
  const defaultImage = "https://placehold.co/800x600/f97316/ffffff?text=No+Image";

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
        <p className="text-gray-600 mb-6">Redirection vers la page des recettes...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-orange-50 to-orange-100 py-12 min-h-screen">
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-8 sm:p-10 border-b border-orange-100">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Modifier la recette</h1>
            <p className="text-gray-600">Mettre à jour votre chef-d'œuvre culinaire</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
            {/* Recipe Header Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de la recette <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={recipe.title}
                    onChange={handleChange}
                    required
                    placeholder="Donnez un nom accrocheur à votre recette"
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Catégorie <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={recipe.category}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                      Difficulté
                    </label>
                    <select
                      id="difficulty"
                      name="difficulty"
                      value={recipe.difficulty}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                    >
                      {difficultyLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={recipe.description}
                    onChange={handleChange}
                    required
                    placeholder="Brève description de votre recette"
                    disabled={isSubmitting}
                    rows="3"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                  />
                </div>
              </div>
              
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Image de la recette
                </label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center h-64 flex flex-col items-center justify-center relative overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={triggerFileInput}
                >
                  {previewImage ? (
                    <>
                      <img 
                        src={previewImage} 
                        alt="Aperçu de la recette" 
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultImage;
                        }}
                      />
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        Cliquer pour changer
                      </div>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-700 font-medium mb-1">Télécharger une image</p>
                      <p className="text-xs text-gray-500">Cliquez pour parcourir ou déposez une image ici</p>
                    </>
                  )}
                  
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
                
                <div className="mt-3 grid grid-cols-1 gap-3">
                  <div className="flex items-center">
                    <div className="h-px bg-gray-300 flex-grow"></div>
                    <span className="px-2 text-sm text-gray-500">OU</span>
                    <div className="h-px bg-gray-300 flex-grow"></div>
                  </div>
                  
                  <input
                    id="image"
                    name="image"
                    type="url"
                    value={recipe.image}
                    onChange={handleChange}
                    placeholder="Entrer l'URL de l'image"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm shadow-sm"
                  />
                  
                  {selectedFile && (
                    <div className="text-xs text-gray-500 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Recipe Details */}
            <div className="bg-orange-50 p-6 rounded-lg shadow-inner">
              <h2 className="text-xl font-serif font-semibold text-gray-900 mb-4">Détails de la recette</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Temps de préparation
                  </label>
                  <input
                    id="prepTime"
                    name="prepTime"
                    type="text"
                    value={recipe.prepTime}
                    onChange={handleChange}
                    placeholder="ex. 15 minutes"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Temps de cuisson
                  </label>
                  <input
                    id="cookTime"
                    name="cookTime"
                    type="text"
                    value={recipe.cookTime}
                    onChange={handleChange}
                    placeholder="ex. 30 minutes"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-1">
                    Portions
                  </label>
                  <input
                    id="servings"
                    name="servings"
                    type="text"
                    value={recipe.servings}
                    onChange={handleChange}
                    placeholder="ex. 4 portions"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-1">
                    Ingrédients <span className="text-red-500">*</span> (un par ligne)
                  </label>
                  <textarea
                    id="ingredients"
                    name="ingredients"
                    value={recipe.ingredients}
                    onChange={handleChange}
                    required
                    placeholder="1 tasse de farine
2 œufs
1/2 tasse de sucre
..."
                    disabled={isSubmitting}
                    rows="10"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm font-mono text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
                    Instructions <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    value={recipe.instructions}
                    onChange={handleChange}
                    required
                    placeholder="Instructions étape par étape pour préparer la recette..."
                    disabled={isSubmitting}
                    rows="10"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Additional Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes additionnelles
              </label>
              <textarea
                id="notes"
                name="notes"
                value={recipe.notes}
                onChange={handleChange}
                placeholder="Conseils supplémentaires, variations, ou notes sur la recette..."
                disabled={isSubmitting}
                rows="4"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(`/recipe/${id}`)}
                disabled={isSubmitting}
                className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enregistrement...
                  </div>
                ) : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRecipe;