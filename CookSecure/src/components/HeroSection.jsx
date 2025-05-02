// src/components/HeroSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = ({ recipe }) => {
  // Handle both TheMealDB API and custom recipes
  const id = recipe.idMeal || recipe.id;
  const title = recipe.strMeal || recipe.title;
  const category = recipe.strCategory || recipe.category;
  const area = recipe.strArea || recipe.area || '';
  const image = recipe.strMealThumb || recipe.image;

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-tag">Featured Recipe</span>
            <h1 className="hero-title">{title}</h1>
            <div className="hero-meta">
              {category && <span className="hero-category">{category}</span>}
              {area && <span className="hero-area">{area}</span>}
              {recipe.prepTime && <span className="hero-time">{recipe.prepTime}</span>}
            </div>
            <p className="hero-description">
              {recipe.strInstructions 
                ? recipe.strInstructions.split('.')[0] + '.' 
                : 'Spicy delicious chicken wings'}
            </p>
            <div className="hero-actions">
              <Link to={`/recipe/${id}`} className="btn btn-primary">View Recipe</Link>
              <button className="btn btn-outline">Save for Later</button>
            </div>
          </div>
          <div className="hero-image">
            <img 
              src={image} 
              alt={title} 
              className="featured-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/images/default-recipe.jpg';
              }} 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;