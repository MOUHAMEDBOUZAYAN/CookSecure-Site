// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <div className="navbar-left">
            <Link to="/" className="navbar-logo">
              <img src="/assets/images/logo.svg" alt="Recipe Platform" />
              <span>CookSecure</span>
            </Link>
          </div>

          <div className="navbar-center">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>

          <div className="navbar-right">
            <div className={`navbar-menu ${mobileMenuOpen ? 'is-open' : ''}`}>
              <Link to="/" className="navbar-item" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/add-recipe" className="navbar-item" onClick={() => setMobileMenuOpen(false)}>
                Add Recipe
              </Link>
              {user ? (
                <>
                  <Link to="/profile" className="navbar-item" onClick={() => setMobileMenuOpen(false)}>
                    My Recipes
                  </Link>
                  <button className="navbar-item logout-button" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="navbar-item" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="navbar-item navbar-button" onClick={() => setMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
              <span className={`hamburger ${mobileMenuOpen ? 'is-open' : ''}`}></span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;