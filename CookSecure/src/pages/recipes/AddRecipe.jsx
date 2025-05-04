// src/pages/recipes/AddRecipe.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { addRecipe } from '../../services/recipes';

const AddRecipe = () => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Format ingredients from textarea to array
      const ingredientsArray = recipe.ingredients
        .split('\n')
        .filter(i => i.trim() !== '')
        .map(i => i.trim());
      
      const newRecipe = {
        ...recipe,
        ingredients: ingredientsArray,
        userId: user.id,  // Link recipe to the current user
        userName: user.name // Store user name for display
      };
      
      const createdRecipe = await addRecipe(newRecipe);
      console.log('Recipe created successfully:', createdRecipe);
      
      // Navigate to the newly created recipe
      navigate(`/recipe/${createdRecipe.id}`, { 
        state: { message: 'Recipe added successfully!' } 
      });
    } catch (error) {
      console.error('Failed to add recipe:', error);
      alert('Failed to add recipe. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({ ...prev, [name]: value }));
  };

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
    'Other'
  ];

  // Difficulty levels
  const difficultyLevels = ['Easy', 'Medium', 'Hard', 'Chef Level'];

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Add New Recipe</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Recipe Title *
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={recipe.title}
                      onChange={handleChange}
                      required
                      placeholder="Enter recipe title"
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={recipe.category}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                        Difficulty
                      </label>
                      <select
                        id="difficulty"
                        name="difficulty"
                        value={recipe.difficulty}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        {difficultyLevels.map((level) => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={recipe.description}
                      onChange={handleChange}
                      required
                      placeholder="Brief description of your recipe"
                      disabled={isSubmitting}
                      rows="3"
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      id="image"
                      name="image"
                      type="url"
                      value={recipe.image}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Enter a URL to an image of your recipe (optional)
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Recipe Details */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Recipe Details</h2>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Preparation Time
                      </label>
                      <input
                        id="prepTime"
                        name="prepTime"
                        type="text"
                        value={recipe.prepTime}
                        onChange={handleChange}
                        placeholder="e.g. 15 minutes"
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                        value={recipe.cookTime}
                        onChange={handleChange}
                        placeholder="e.g. 30 minutes"
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-1">
                        Servings
                      </label>
                      <input
                        id="servings"
                        name="servings"
                        type="text"
                        value={recipe.servings}
                        onChange={handleChange}
                        placeholder="e.g. 4 servings"
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-1">
                      Ingredients * (one per line)
                    </label>
                    <textarea
                      id="ingredients"
                      name="ingredients"
                      value={recipe.ingredients}
                      onChange={handleChange}
                      required
                      placeholder="1 cup flour
2 eggs
1/2 cup sugar
..."
                      disabled={isSubmitting}
                      rows="8"
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
                      Instructions *
                    </label>
                    <textarea
                      id="instructions"
                      name="instructions"
                      value={recipe.instructions}
                      onChange={handleChange}
                      required
                      placeholder="Step-by-step instructions for preparing the recipe..."
                      disabled={isSubmitting}
                      rows="10"
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (optional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={recipe.notes}
                      onChange={handleChange}
                      placeholder="Any additional tips, variations, or notes about the recipe..."
                      disabled={isSubmitting}
                      rows="4"
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
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
                  {isSubmitting ? 'Creating Recipe...' : 'Create Recipe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRecipe;