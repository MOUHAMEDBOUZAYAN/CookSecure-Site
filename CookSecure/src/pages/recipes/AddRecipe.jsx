// src/pages/recipes/AddRecipe.jsx
import React, { useState, useRef, useEffect } from 'react';
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
  const [previewImage, setPreviewImage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  
  // Validation states
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  
  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'INFO' });

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        return !value.trim() ? 'Recipe title is required' : '';
      case 'category':
        return !value.trim() ? 'Please select a category' : '';
      case 'description':
        return !value.trim() ? 'Description is required' : 
               value.length < 10 ? 'Description should be at least 10 characters' : '';
      case 'ingredients':
        return !value.trim() ? 'Ingredients are required' : 
               value.split('\n').filter(i => i.trim()).length < 2 ? 'Please add at least 2 ingredients' : '';
      case 'instructions':
        return !value.trim() ? 'Instructions are required' : 
               value.length < 50 ? 'Instructions should be more detailed (at least 50 characters)' : '';
      case 'prepTime':
        if (value && !/^\d+\s*(minutes|mins|min|hours|hrs|h)?$/i.test(value)) {
          return 'Invalid format. Example: "15 minutes" or "1 hour"';
        }
        return '';
      case 'cookTime':
        if (value && !/^\d+\s*(minutes|mins|min|hours|hrs|h)?$/i.test(value)) {
          return 'Invalid format. Example: "30 minutes" or "2 hours"';
        }
        return '';
      case 'servings':
        if (value && !/^\d+(-\d+)?\s*(servings|serving|people|person)?$/i.test(value)) {
          return 'Invalid format. Example: "4 servings" or "2-4 people"';
        }
        return '';
      default:
        return '';
    }
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Mark all required fields as touched
    const allTouched = {
      title: true,
      category: true,
      description: true,
      ingredients: true,
      instructions: true
    };
    
    setTouched(prev => ({ ...prev, ...allTouched }));
    
    // Validate each field
    Object.keys(allTouched).forEach(field => {
      const error = validateField(field, recipe[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    
    // Additional validation for fields that are filled but not required
    ['prepTime', 'cookTime', 'servings'].forEach(field => {
      if (recipe[field]) {
        const error = validateField(field, recipe[field]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  // Show toast notification
  const showToast = (message, type = 'INFO') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'INFO' });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      showToast('Please fix the validation errors before submitting', 'ERROR');
      // Scroll to the first error
      const firstErrorField = document.querySelector('.border-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format ingredients from textarea to array
      const ingredientsArray = recipe.ingredients
        .split('\n')
        .filter(i => i.trim() !== '')
        .map(i => i.trim());
      
      let imageUrl = recipe.image;
      
      // If file is selected, convert to base64 or upload to server
      if (selectedFile) {
        // For this example, we'll convert to base64
        // In production, you'd probably upload to a server and get a URL back
        imageUrl = await convertFileToBase64(selectedFile);
      }
      
      const newRecipe = {
        ...recipe,
        ingredients: ingredientsArray,
        image: imageUrl,
        userId: user.id,  // Link recipe to the current user
        userName: user.name // Store user name for display
      };
      
      const createdRecipe = await addRecipe(newRecipe);
      console.log('Recipe created successfully:', createdRecipe);
      
      // Show success toast
      showToast('Recipe created successfully!', 'SUCCESS');
      
      // Navigate to the newly created recipe after a short delay
      setTimeout(() => {
        navigate(`/recipe/${createdRecipe.id}`, { 
          state: { message: 'Recipe added successfully!', type: 'SUCCESS' } 
        });
      }, 1000);
    } catch (error) {
      console.error('Failed to add recipe:', error);
      showToast('Failed to add recipe. Please try again.', 'ERROR');
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
    
    // Validate on change if the field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };
  
  // Handle field blur for validation
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };
  
  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'ERROR');
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB', 'ERROR');
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
  
  // Toast notification component
  const Toast = () => {
    if (!toast.show) return null;
    
    let bgColor, textColor, icon;
    switch (toast.type) {
      case 'SUCCESS':
        bgColor = 'bg-green-50';
        textColor = 'text-green-800';
        icon = (
          <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
        break;
      case 'ERROR':
        bgColor = 'bg-red-50';
        textColor = 'text-red-800';
        icon = (
          <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
        break;
      case 'WARNING':
        bgColor = 'bg-yellow-50';
        textColor = 'text-yellow-800';
        icon = (
          <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
        break;
      default: // INFO
        bgColor = 'bg-blue-50';
        textColor = 'text-blue-800';
        icon = (
          <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
    
    return (
      <div className="fixed top-4 right-4 z-50 flex animate-fade-in-down">
        <div className={`${bgColor} border-l-4 border-${toast.type.toLowerCase()}-500 p-4 rounded shadow-lg max-w-md`}>
          <div className="flex">
            <div className="flex-shrink-0">{icon}</div>
            <div className="ml-3">
              <p className={`text-sm ${textColor}`}>{toast.message}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setToast({ ...toast, show: false })}
                  className={`inline-flex rounded-md p-1.5 text-${toast.type.toLowerCase()}-500 hover:bg-${toast.type.toLowerCase()}-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${toast.type.toLowerCase()}-500`}
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-orange-50 to-orange-100 py-12 min-h-screen">
      {/* Toast notification */}
      <Toast />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-8 sm:p-10 border-b border-orange-100">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Create New Recipe</h1>
            <p className="text-gray-600">Share your culinary masterpiece with the world</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
            {/* Recipe Header Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Recipe Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={recipe.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    placeholder="Give your recipe a catchy name"
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 rounded-md border ${
                      touched.title && errors.title ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm`}
                  />
                  {touched.title && errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={recipe.category}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 rounded-md border ${
                        touched.category && errors.category ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {touched.category && errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                    )}
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
                    onBlur={handleBlur}
                    required
                    placeholder="Brief description of your recipe"
                    disabled={isSubmitting}
                    rows="3"
                    className={`w-full px-4 py-3 rounded-md border ${
                      touched.description && errors.description ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm`}
                  />
                  {touched.description && errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>
              </div>
              
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Recipe Image
                </label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center h-64 flex flex-col items-center justify-center relative overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={triggerFileInput}
                >
                  {previewImage ? (
                    <>
                      <img 
                        src={previewImage} 
                        alt="Recipe preview" 
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={() => {
                          setPreviewImage('');
                          showToast('Invalid image URL or failed to load image', 'ERROR');
                        }}
                      />
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        Click to change
                      </div>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-700 font-medium mb-1">Upload an image</p>
                      <p className="text-xs text-gray-500">Click to browse or drop an image here</p>
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
                    <span className="px-2 text-sm text-gray-500">OR</span>
                    <div className="h-px bg-gray-300 flex-grow"></div>
                  </div>
                  
                  <input
                    id="image"
                    name="image"
                    type="url"
                    value={recipe.image}
                    onChange={handleChange}
                    placeholder="Enter image URL"
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
              <h2 className="text-xl font-serif font-semibold text-gray-900 mb-4">Recipe Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                    onBlur={handleBlur}
                    placeholder="e.g. 15 minutes"
                    disabled={isSubmitting}
                    className={`w-full px-4 py-2 rounded-md border ${
                      touched.prepTime && errors.prepTime ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm`}
                  />
                  {touched.prepTime && errors.prepTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.prepTime}</p>
                  )}
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
                    onBlur={handleBlur}
                    placeholder="e.g. 30 minutes"
                    disabled={isSubmitting}
                    className={`w-full px-4 py-2 rounded-md border ${
                      touched.cookTime && errors.cookTime ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm`}
                  />
                  {touched.cookTime && errors.cookTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.cookTime}</p>
                  )}
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
                    onBlur={handleBlur}
                    placeholder="e.g. 4 servings"
                    disabled={isSubmitting}
                    className={`w-full px-4 py-2 rounded-md border ${
                      touched.servings && errors.servings ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm`}
                  />
                  {touched.servings && errors.servings && (
                    <p className="mt-1 text-sm text-red-600">{errors.servings}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-1">
                    Ingredients <span className="text-red-500">*</span> (one per line)
                  </label>
                  <textarea
                    id="ingredients"
                    name="ingredients"
                    value={recipe.ingredients}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    placeholder="1 cup flour
2 eggs
1/2 cup sugar
..."
                    disabled={isSubmitting}
                    rows="10"
                    className={`w-full px-4 py-3 rounded-md border ${
                      touched.ingredients && errors.ingredients ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm font-mono text-sm`}
                  />
                  {touched.ingredients && errors.ingredients && (
                    <p className="mt-1 text-sm text-red-600">{errors.ingredients}</p>
                  )}
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
                    onBlur={handleBlur}
                    required
                    placeholder="Step-by-step instructions for preparing the recipe..."
                    disabled={isSubmitting}
                    rows="10"
                    className={`w-full px-4 py-3 rounded-md border ${
                      touched.instructions && errors.instructions ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm`}
                  />
                  {touched.instructions && errors.instructions && (
                    <p className="mt-1 text-sm text-red-600">{errors.instructions}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Additional Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={recipe.notes}
                onChange={handleChange}
                placeholder="Any additional tips, variations, or notes about the recipe..."
                disabled={isSubmitting}
                rows="4"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  if (Object.values(recipe).some(value => value && value.toString().trim() !== '')) {
                    // Show confirmation if form has any data
                    if (window.confirm('Are you sure you want to discard your recipe?')) {
                      navigate('/recipes');
                    }
                  } else {
                    navigate('/recipes');
                  }
                }}
                disabled={isSubmitting}
                className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                Cancel
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
                    Creating Recipe...
                  </div>
                ) : 'Create Recipe'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRecipe;