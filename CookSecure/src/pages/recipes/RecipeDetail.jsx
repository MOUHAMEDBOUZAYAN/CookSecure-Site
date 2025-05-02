// src/pages/RecipeDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRecipeById, getRandomRecipes, formatRecipeData } from '../services/recipes';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [formattedRecipe, setFormattedRecipe] = useState(null);
  const [relatedRecipes, setRelatedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ingredients');

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch recipe details
        const recipeData = await getRecipeById(id);
        setRecipe(recipeData);
        
        if (recipeData) {
          // Format the recipe data
          const formatted = formatRecipeData(recipeData);
          setFormattedRecipe(formatted);
          
          // Fetch related recipes (random in this case, but you could filter by category)
          const randomRecipes = await getRandomRecipes(4);
          setRelatedRecipes(randomRecipes);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
        setLoading(false);
      }
    };
    
    fetchRecipeDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading recipe...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="error-container">
        <h2>Recipe Not Found</h2>
        <p>The recipe you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="btn">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="recipe-detail-page">
      <div className="container">
        <div className="recipe-header">
          <h1 className="recipe-title">{recipe.strMeal}</h1>
          <div className="recipe-meta">
            {recipe.strCategory && (
              <span className="recipe-category">{recipe.strCategory}</span>
            )}
            {recipe.strArea && (
              <span className="recipe-area">{recipe.strArea}</span>
            )}
          </div>
        </div>
        
        <div className="recipe-content">
          <div className="recipe-main">
            <div className="recipe-image-container">
              <img 
                src={recipe.strMealThumb} 
                alt={recipe.strMeal} 
                className="recipe-detail-image"
              />
            </div>
            
            <div className="recipe-tabs">
              <div className="tab-buttons">
                <button 
                  className={`tab-button ${activeTab === 'ingredients' ? 'active' : ''}`}
                  onClick={() => setActiveTab('ingredients')}
                >
                  Ingredients
                </button>
                <button 
                  className={`tab-button ${activeTab === 'directions' ? 'active' : ''}`}
                  onClick={() => setActiveTab('directions')}
                >
                  Directions
                </button>
                <button 
                  className={`tab-button ${activeTab === 'notes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notes')}
                >
                  Notes
                </button>
              </div>
              
              <div className="tab-content">
                {activeTab === 'ingredients' && (
                  <div className="ingredients-tab">
                    <h3>Ingredients</h3>
                    <ul className="ingredients-list">
                      {formattedRecipe.ingredients.map((item, index) => (
                        <li key={index} className="ingredient-item">
                          <span className="ingredient-measure">{item.measure}</span>
                          <span className="ingredient-name">{item.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {activeTab === 'directions' && (
                  <div className="directions-tab">
                    <h3>Directions</h3>
                    <div className="directions-content">
                      {recipe.strInstructions.split('.').filter(instruction => instruction.trim() !== '').map((instruction, index) => (
                        <div key={index} className="direction-step">
                          <div className="step-number">{index + 1}</div>
                          <div className="step-instruction">{instruction.trim()}.</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'notes' && (
                  <div className="notes-tab">
                    <h3>Notes</h3>
                    <div className="notes-content">
                      <p>This recipe comes from {recipe.strSource ? (
                        <a href={recipe.strSource} target="_blank" rel="noopener noreferrer">
                          the original source
                        </a>
                      ) : 'TheMealDB'}</p>
                      
                      {recipe.strTags && (
                        <div className="recipe-tags">
                          <h4>Tags:</h4>
                          <div className="tags-list">
                            {recipe.strTags.split(',').map((tag, index) => (
                              <span key={index} className="recipe-tag">{tag.trim()}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {recipe.strYoutube && (
                        <div className="recipe-video">
                          <h4>Video Tutorial:</h4>
                          <a href={recipe.strYoutube} target="_blank" rel="noopener noreferrer" className="btn">
                            Watch on YouTube
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="recipe-sidebar">
            <div className="nutrition-facts">
              <h3>Nutrition Information</h3>
              <ul className="nutrition-list">
                <li><span>Calories</span> <span>350 kcal</span></li>
                <li><span>Carbs</span> <span>45g</span></li>
                <li><span>Protein</span> <span>20g</span></li>
                <li><span>Fat</span> <span>10g</span></li>
              </ul>
              <small>* Approximate values</small>
            </div>
            
            {recipe.strSource && (
              <div className="recipe-source">
                <h3>Source</h3>
                <a href={recipe.strSource} target="_blank" rel="noopener noreferrer">
                  Visit Original Recipe
                </a>
              </div>
            )}
          </div>
        </div>
        
        <div className="chef-section">
          <div className="chef-image">
            <img src="/assets/images/Chef1.jpg" alt="Chef" />
          </div>
          <div className="chef-info">
            <h3>Recipe by Chef Jane</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
        </div>
        
        {/* Related Recipes */}
        <section className="related-recipes">
          <h2 className="section-title">You may like these recipes too</h2>
          <div className="recipes-grid">
            {relatedRecipes.map(relatedRecipe => (
              <div className="recipe-card" key={relatedRecipe.idMeal}>
                <Link to={`/recipe/${relatedRecipe.idMeal}`} className="recipe-card-link">
                  <div className="recipe-image-container">
                    <img 
                      src={relatedRecipe.strMealThumb} 
                      alt={relatedRecipe.strMeal} 
                      className="recipe-image"
                    />
                  </div>
                  <div className="recipe-info">
                    <h3 className="recipe-title">{relatedRecipe.strMeal}</h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
      
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

export default RecipeDetail;