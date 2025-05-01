import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import RecipeCard from '../../components/RecipeCard'
import { getRecipes } from '../../services/recipes'
import toast from 'react-hot-toast'

export default function RecipeList() {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getRecipes()
        setRecipes(data)
      } catch (error) {
        toast.error('Failed to load recipes')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchRecipes()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading recipes...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Recipes</h1>
        {user && (
          <Link 
            to="/add-recipe" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add New Recipe
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}