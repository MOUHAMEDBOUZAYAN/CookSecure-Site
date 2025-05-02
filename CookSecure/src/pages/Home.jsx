import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-6">Welcome to Cooking Platform</h1>
      <p className="text-xl mb-8 max-w-2xl mx-auto">
        Discover and share amazing recipes with our community of food lovers!
      </p>
      <div className="flex justify-center gap-4">
        <Link 
          to="/recipes" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Browse Recipes
        </Link>
        {user && (
          <Link 
            to="/add-recipe" 
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Share Your Recipe
          </Link>
        )}
      </div>
    </div>
  )
}