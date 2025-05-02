// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RecipeDetail from './pages/recipes/RecipeDetail';
import RecipeList from './pages/recipes/RecipeList';
import AddRecipe from './pages/recipes/AddRecipe';
import EditRecipe from './pages/recipes/EditRecipe';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              <Route path="/category/:category" element={<RecipeList />} />
              <Route path="/search" element={<RecipeList />} />
              
              {/* Protected routes */}
              <Route 
                path="/add-recipe" 
                element={
                  <ProtectedRoute>
                    <AddRecipe />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/edit-recipe/:id" 
                element={
                  <ProtectedRoute>
                    <EditRecipe />
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
              
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <footer className="app-footer">
            <div className="container">
              <p>&copy; {new Date().getFullYear()} Recipe Platform. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;