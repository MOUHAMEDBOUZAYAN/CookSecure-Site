// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedChefRoute from './components/ProtectedChefRoute';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import RecipeDetail from './pages/recipes/RecipeDetail';
import RecipeList from './pages/recipes/RecipeList';
import AddRecipe from './pages/recipes/AddRecipe';
import EditRecipe from './pages/recipes/EditRecipe';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <ScrollToTop />
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              <Route path="/category/:category" element={<RecipeList />} />
              <Route path="/recipes" element={<RecipeList />} />
              <Route path="/search" element={<RecipeList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes (requires authentication) */}
              <Route 
                path="/favorites" 
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              {/* Chef/Admin protected routes */}
              <Route 
                path="/add-recipe" 
                element={
                  <ProtectedChefRoute>
                    <AddRecipe />
                  </ProtectedChefRoute>
                } 
              />
              <Route 
                path="/edit-recipe/:id" 
                element={
                  <ProtectedChefRoute>
                    <EditRecipe />
                  </ProtectedChefRoute>
                } 
              />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;