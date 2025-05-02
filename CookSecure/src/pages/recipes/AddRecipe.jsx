// src/pages/recipes/AddRecipe.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { addRecipe } from '../../services/recipes';
import { Toaster, toast } from 'react-hot-toast';

const AddRecipe = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    prepTime: '',
    cookTime: '',
    category: 'Miscellaneous', // Valeur par défaut
    image: '' // Optionnel
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Prévisualisation de l'image si URL valide
    if (name === 'image' && value.trim() !== '') {
      setPreviewImage(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // Validation de base
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Le titre et la description sont obligatoires');
      toast.error('Le titre et la description sont obligatoires');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const ingredientsArray = formData.ingredients
        .split('\n')
        .filter(i => i.trim() !== '');
      
      if (ingredientsArray.length === 0) {
        setError('Au moins un ingrédient est requis');
        toast.error('Au moins un ingrédient est requis');
        setIsSubmitting(false);
        return;
      }
      
      // Préparer les données de la recette
      const recipeData = {
        ...formData,
        ingredients: ingredientsArray,
        userId: user?.id || 'anonymous'
      };
      
      console.log('Envoi de la recette:', recipeData);
      
      // Notification de chargement
      const loadingToast = toast.loading('Ajout de la recette en cours...');
      
      // Appeler le service d'ajout de recette
      const result = await addRecipe(recipeData, user?.id);
      
      console.log('Recette ajoutée avec succès:', result);
      
      // Remplacer la notification de chargement par une notification de succès
      toast.dismiss(loadingToast);
      toast.success(`Recette "${formData.title}" ajoutée avec succès!`);
      
      // Rediriger après un court délai pour que l'utilisateur puisse voir la notification
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Échec de l\'ajout de recette:', err);
      setError(`Échec de l'ajout de recette: ${err.message || 'Erreur inconnue'}`);
      toast.error(`Échec de l'ajout: ${err.message || 'Erreur de connexion au serveur'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          success: {
            duration: 3000,
            style: {
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#14532d',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#7f1d1d',
            },
          },
          loading: {
            style: {
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1e40af',
            },
          },
        }}
      />
      <div className="bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-8 sm:p-10">
              <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Ajouter une nouvelle recette</h1>
              
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Titre de la recette *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Entrer le titre de la recette"
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="Miscellaneous">Divers</option>
                    <option value="Beef">Bœuf</option>
                    <option value="Chicken">Poulet</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Lamb">Agneau</option>
                    <option value="Pasta">Pâtes</option>
                    <option value="Pork">Porc</option>
                    <option value="Seafood">Fruits de mer</option>
                    <option value="Side">Accompagnement</option>
                    <option value="Starter">Entrée</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Vegetarian">Végétarien</option>
                    <option value="Breakfast">Petit-déjeuner</option>
                    <option value="Goat">Chèvre</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Décrivez brièvement votre recette"
                    rows="3"
                  />
                </div>
                
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    URL de l'image (optionnel)
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="url"
                    value={formData.image}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="https://exemple.com/votre-image.jpg"
                  />
                  {previewImage && formData.image && (
                    <div className="mt-2">
                      <img 
                        src={formData.image} 
                        alt="Prévisualisation de la recette" 
                        className="h-40 w-auto object-cover rounded" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/400x300/orange/white?text=Recipe';
                          setPreviewImage(false);
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-1">
                    Ingrédients * (un par ligne)
                  </label>
                  <textarea
                    id="ingredients"
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-32"
                    placeholder="ex:&#10;2 tasses de farine&#10;1 c. à thé de sel&#10;3 gros œufs"
                  />
                </div>
                
                <div>
                  <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
                    Instructions *
                  </label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-48"
                    placeholder="Étapes de préparation détaillées de la recette..."
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Temps de préparation
                    </label>
                    <input
                      id="prepTime"
                      name="prepTime"
                      type="text"
                      value={formData.prepTime}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="ex. 15 minutes"
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
                      value={formData.cookTime}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="ex. 30 minutes"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    disabled={isSubmitting}
                    className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enregistrement...
                      </span>
                    ) : 'Enregistrer la recette'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddRecipe;