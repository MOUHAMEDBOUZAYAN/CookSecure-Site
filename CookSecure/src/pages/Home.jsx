// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import HeroSection from '../components/HeroSection';
import { getRandomRecipes, getCategories, getUserRecipes } from '../services/recipes';

const Home = () => {
  const [featuredRecipe, setFeaturedRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get categories
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        
        // Get random recipes
        const randomRecipes = await getRandomRecipes(9);
        
        // Set the first random recipe as featured
        if (randomRecipes.length > 0) {
          setFeaturedRecipe(randomRecipes[0]);
          setRecipes(randomRecipes.slice(1));
        }
        
        // Get user recipes from db.json
        const userRecipesData = await getUserRecipes();
        setUserRecipes(userRecipesData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data for homepage:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section with Featured Recipe */}
      {featuredRecipe && (
        <HeroSection recipe={featuredRecipe} />
      )}
      
      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Categories</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <Link 
                to={`/category/${category.strCategory}`} 
                className="category-item" 
                key={category.idCategory}
              >
                <img 
                  src={category.strCategoryThumb} 
                  alt={category.strCategory} 
                  className="category-image"
                />
                <span className="category-name">{category.strCategory}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Simple and tasty recipes section */}
      <section className="recipes-section">
        <div className="container">
          <h2 className="section-title">Simple and tasty recipes</h2>
          <div className="recipes-grid">
            {recipes.slice(0, 6).map(recipe => (
              <RecipeCard key={recipe.idMeal} recipe={recipe} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Chef Banner */}
      <section className="chef-banner">
        <div className="container">
          <div className="chef-banner-content">
            <div className="chef-text">
              <h2>Everyone can be a chef in their own kitchen!</h2>
              <Link to="/add-recipe" className="btn">Create Recipe</Link>
            </div>
            <div className="chef-image">
              <img src="/assets/images/Chef1.jpg" alt="Chef" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Instagram Section */}
      <section className="instagram-section">
        <div className="container">
          <h2 className="section-title">Check our deliciousness on Instagram</h2>
          <div className="instagram-grid">
            {recipes.slice(0, 4).map(recipe => (
              <div className="instagram-item" key={recipe.idMeal}>
                <img src={recipe.strMealThumb} alt={recipe.strMeal} />
              </div>
            ))}
          </div>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn">Follow Us</a>
        </div>
      </section>
      
      {/* This week's recipes */}
      <section className="weekly-recipes">
        <div className="container">
          <h2 className="section-title">Try this delicious recipe this week</h2>
          <div className="recipes-grid">
            {recipes.slice(6).map(recipe => (
              <RecipeCard key={recipe.idMeal} recipe={recipe} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Deliciousness delivered section */}
      <section className="delivery-section">
        <div className="container">
          <h2 className="section-title">Deliciousness to your inbox</h2>
          <div className="newsletter-form">
            <p>Sign up for our newsletter to receive recipes every week!</p>
            <form className="subscribe-form">
              <input type="email" placeholder="Your email address" />
              <button type="submit" className="btn">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;