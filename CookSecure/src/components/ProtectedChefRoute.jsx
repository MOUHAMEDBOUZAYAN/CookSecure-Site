// src/components/ProtectedChefRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedChefRoute = ({ children }) => {
  const { user, loading, canManageRecipes } = useAuth();
  const location = useLocation();

  // Show loading state while auth state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <p className="ml-3 text-gray-600">Loading...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login with return path
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  // If authenticated but not a chef or admin, redirect to home with message
  if (!canManageRecipes()) {
    return <Navigate to="/" state={{ 
      error: "You don't have permission to access this page. Only chefs and admins can manage recipes." 
    }} />;
  }

  // If authenticated and has correct role, render the protected component
  return children;
};

export default ProtectedChefRoute;