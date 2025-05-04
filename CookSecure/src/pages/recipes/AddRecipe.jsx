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
    category: 'Miscellaneous', // Default value
    image: '' // Optional
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
    
    // Preview image if URL is valid
    if (name === 'image' && value.trim() !== '') {
      setPreviewImage(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // Basic validation
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required');
      toast.error('Title and description are required');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const ingredientsArray = formData.ingredients
        .split('\n')
        .filter(i => i.trim() !== '');
      
      if (ingredientsArray.length === 0) {
        setError('At least one ingredient is required');
        toast.error('At least one ingredient is required');
        setIsSubmitting(false);
        return;
      }
      
      // Prepare recipe data
      const recipeData = {
        ...formData,
        ingredients: ingredientsArray,
        userId: user?.id || 'anonymous',
        author: user?.name || 'Anonymous'
      };
      
      console.log('Sending recipe:', recipeData);
      
      // Show loading notification
      const loadingToast = toast.loading('Adding recipe...');
      
      // Call recipe service
      const result = await addRecipe(recipeData);
      
      console.log('Recipe added successfully:', result);
      
      // Replace loading notification with success notification
      toast.dismiss(loadingToast);
      toast.success(`Recipe "${formData.title}" added successfully!`);
      
      // Redirect after a short delay to show notification
      setTimeout(() => {
        navigate('/recipes?user=mine');
      }, 1500);
    } catch (err) {
      console.error('Failed to add recipe:', err);
      setError(`Failed to add recipe: ${err.message || 'Unknown error'}`);
      toast.error(`Failed to add: ${err.message || 'Server connection error'}`);
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
              <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Add a New Recipe</h1>
              
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Recipe Title *
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
                    placeholder="Enter recipe title"
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
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
                    <option value="Miscellaneous">Miscellaneous</option>
                    <option value="Beef">Beef</option>
                    <option value="Chicken">Chicken</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Lamb">Lamb</option>
                    <option value="Pasta">Pasta</option>
                    <option value="Pork">Pork</option>
                    <option value="Seafood">Seafood</option>
                    <option value="Side">Side Dish</option>
                    <option value="Starter">Starter</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Goat">Goat</option>
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
                    placeholder="Briefly describe your recipe"
                    rows="3"
                  />
                </div>
                
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL (optional)
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="url"
                    value={formData.image}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="https://example.com/your-image.jpg"
                  />
                  {previewImage && formData.image && (
                    <div className="mt-2">
                      <img 
                        src={formData.image} 
                        alt="Recipe preview" 
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
                    Ingredients * (one per line)
                  </label>
                  <textarea
                    id="ingredients"
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-32"
                    placeholder="e.g.:&#10;2 cups flour&#10;1 tsp salt&#10;3 large eggs"
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
                    placeholder="Detailed preparation steps..."
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Preparation Time
                    </label>
                    <input
                      id="prepTime"
                      name="prepTime"
                      type="text"
                      value={formData.prepTime}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g. 15 minutes"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Cooking Time
                    </label>
                    <input
                      id="cookTime"
                      name="cookTime"
                      type="text"
                      value={formData.cookTime}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g. 30 minutes"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/recipes')}
                    disabled={isSubmitting}
                    className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    Cancel
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
                        Saving...
                      </span>
                    ) : 'Save Recipe'}
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