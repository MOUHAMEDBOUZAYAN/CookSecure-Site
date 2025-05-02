import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useEffect, useState } from 'react'
import { getRecipes } from '../services/recipes'
import RecipeCard from '../components/RecipeCard'
import HeroSection from '../components/HeroSection'

export default function Home() {
  const { user } = useAuth()
  const [featuredRecipes, setFeaturedRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeRecipeIndex, setActiveRecipeIndex] = useState(0)

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipes = await getRecipes()
        setFeaturedRecipes(recipes) // Get all recipes to use in different sections
      } catch (error) {
        console.error('Failed to load recipes:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchRecipes()
  }, [])

  // Auto rotate featured recipes every 5 seconds
  useEffect(() => {
    if (featuredRecipes.length > 0) {
      const interval = setInterval(() => {
        setActiveRecipeIndex(current => 
          current === featuredRecipes.length - 1 ? 0 : current + 1
        )
      }, 5000)
      
      return () => clearInterval(interval)
    }
  }, [featuredRecipes])

  // Categories with icons
  const categories = [
    { name: 'Breakfast', icon: '🍳' },
    { name: 'Vegan', icon: '🥗' },
    { name: 'Meat', icon: '🥩' },
    { name: 'Dessert', icon: '🍰' },
    { name: 'Lunch', icon: '🍱' },
    { name: 'Chocolate', icon: '🍫' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Use the separate HeroSection component */}
      <HeroSection 
        featuredRecipes={featuredRecipes}
        activeRecipeIndex={activeRecipeIndex}
        setActiveRecipeIndex={setActiveRecipeIndex}
      />

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h2 className="text-3xl font-bold mb-4 md:mb-0">Categories</h2>
          <Link to="/categories" className="text-sm font-medium px-6 py-3 bg-blue-50 text-blue-800 rounded-full hover:bg-blue-100 transition-colors">
            View All Categories
          </Link>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <Link key={index} to={`/categories/${category.name.toLowerCase()}`} className="text-center group">
              <div className="w-full aspect-square bg-gray-100 group-hover:bg-blue-50 rounded-xl flex items-center justify-center text-3xl mb-3 mx-auto transition-colors">
                {category.icon}
              </div>
              <span className="font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Simple and Tasty Recipes */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h2 className="text-3xl font-bold mb-4 md:mb-0">Simple and tasty recipes</h2>
          <Link to="/recipes" className="text-sm font-medium px-6 py-3 bg-blue-50 text-blue-800 rounded-full hover:bg-blue-100 transition-colors">
            View All Recipes
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2">Loading recipes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredRecipes.slice(0, 9).map(recipe => (
              <div key={recipe.id} className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden transition-shadow">
                <div className="aspect-video overflow-hidden relative">
                  <img 
                    src={recipe.image || `/api/placeholder/400/250`} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 right-3 bg-white text-sm px-2 py-1 rounded-full shadow-sm">
                    25 min
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-lg">{recipe.title}</h3>
                    <div className="flex items-center text-sm">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1">4.5</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">By {recipe.author || 'Chef'}</p>
                  <Link 
                    to={`/recipes/${recipe.id}`} 
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                  >
                    View Recipe
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chef Banner Section */}
      <div className="bg-blue-50 py-16 px-4 my-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <img 
              src="/api/placeholder/400/400" 
              alt="Chef" 
              className="mx-auto h-64 object-cover rounded-lg"
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left md:pl-12">
            <h2 className="text-3xl font-bold mb-4">Everyone can be a chef in their own kitchen</h2>
            <p className="text-gray-600 mb-6">
              Discover the joy of cooking with our easy-to-follow recipes and transform your everyday meals into culinary adventures.
            </p>
            <Link 
              to="/recipes" 
              className="inline-flex items-center bg-black text-white px-6 py-3 rounded-full transition-colors"
            >
              Learn More
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Instagram Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Check our deliciousness on Instagram</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="aspect-square overflow-hidden rounded-lg">
              <img 
                src={`/api/placeholder/300/300`} 
                alt={`Instagram post ${idx}`} 
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center bg-black text-white px-6 py-3 rounded-full transition-colors"
          >
            Follow Us
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>

      {/* Try This Delicious Recipe Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h2 className="text-3xl font-bold mb-4 md:mb-0">Try this delicious recipe today</h2>
          <Link to="/recipes" className="text-sm font-medium px-6 py-3 bg-blue-50 text-blue-800 rounded-full hover:bg-blue-100 transition-colors">
            View More Recipes
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {loading ? (
            <div className="text-center col-span-4 py-10">Loading recipes...</div>
          ) : (
            featuredRecipes.slice(0, 4).map(recipe => (
              <div key={recipe.id} className="overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={recipe.image || `/api/placeholder/250/250`} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-base">{recipe.title}</h3>
                  <p className="text-sm text-gray-500">{recipe.author || 'Chef'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-100 py-16 px-4 mt-8">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Deliciousness to your inbox</h2>
          <p className="text-gray-600 mb-8">
            Subscribe to our newsletter and get weekly updates on new recipes, cooking tips, and special offers.
          </p>
          <form className="flex flex-col md:flex-row gap-4 justify-center">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="px-6 py-3 rounded-full border border-gray-300 flex-grow"
              required
            />
            <button 
              type="submit" 
              className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Import and use the Footer component */}
      
    </div>
  )
}