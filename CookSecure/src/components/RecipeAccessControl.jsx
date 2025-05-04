// src/components/RecipeAccessControl.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// This component wraps recipe management pages (AddRecipe, EditRecipe)
// to restrict access based on user role
const RecipeAccessControl = ({ children, recipe = null }) => {
  const { user, canManageRecipes, canEditRecipe } = useAuth();
  
  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // For edit pages, check if user can edit the specific recipe
  if (recipe) {
    if (!canEditRecipe(recipe)) {
      return (
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-4">
            You don't have permission to edit this recipe.
          </div>
          <p className="text-gray-600 mb-6">
            Only chefs or admins can edit their own recipes.
          </p>
          <a 
            href={`/recipe/${recipe.id}`}
            className="inline-block px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-600"
          >
            Back to Recipe
          </a>
        </div>
      );
    }
  }
  
  // For add recipe page, check if user can create recipes
  if (!canManageRecipes()) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-4">
          You don't have permission to create recipes.
        </div>
        <p className="text-gray-600 mb-6">
          Only chefs or admins can create and edit recipes.
        </p>
        <a 
          href="/"
          className="inline-block px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-600"
        >
          Back to Home
        </a>
      </div>
    );
  }
  
  // If user has permission, render the children components
  return children;
};

export default RecipeAccessControl;