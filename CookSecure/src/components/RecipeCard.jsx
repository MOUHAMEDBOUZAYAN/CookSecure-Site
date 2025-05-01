import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function RecipeCard({ recipe }) {
  const { user } = useAuth()

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
        <p className="text-gray-600 mb-4">{recipe.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">By {recipe.author}</span>
          <Link 
            to={`/recipes/${recipe.id}`} 
            className="text-blue-500 hover:text-blue-700"
          >
            View Recipe
          </Link>
        </div>
        {user?.role === 'admin' && (
          <Link 
            to={`/edit-recipe/${recipe.id}`}
            className="mt-2 inline-block text-sm text-yellow-600 hover:text-yellow-800"
          >
            Edit
          </Link>
        )}
      </div>
    </div>
  )
}