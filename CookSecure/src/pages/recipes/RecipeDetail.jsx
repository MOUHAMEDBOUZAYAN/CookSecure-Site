import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getRecipeById, deleteRecipe } from '../../services/recipes'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function RecipeDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id)
        setRecipe(data)
      } catch (error) {
        toast.error('Recipe not found')
        navigate('/recipes')
      } finally {
        setLoading(false)
      }
    }
    
    fetchRecipe()
  }, [id, navigate])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return
    
    setIsDeleting(true)
    try {
      const success = await deleteRecipe(id)
      if (success) {
        toast.success('Recipe deleted successfully!')
        navigate('/recipes')
      } else {
        throw new Error('Failed to delete recipe')
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading recipe...</div>
  }

  if (!recipe) {
    return <div className="text-center py-8">Recipe not found</div>
  }

  const isOwner = user?.id === recipe.userId
  const isAdmin = user?.role === 'admin'

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
          <p className="text-gray-600">By {recipe.user?.name || recipe.author}</p>
        </div>
        {(isOwner || isAdmin) && (
          <div className="flex gap-2">
            <Link 
              to={`/edit-recipe/${id}`}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
            >
              Edit
            </Link>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded disabled:bg-red-300"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-700 mb-6">{recipe.description}</p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
            <ul className="list-disc pl-5 space-y-1">
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-3">Instructions</h2>
            <div className="whitespace-pre-line">{recipe.instructions}</div>
          </div>
        </div>

        <div className="flex gap-4 text-sm text-gray-500">
          {recipe.prepTime && <div>Prep Time: {recipe.prepTime}</div>}
          {recipe.cookTime && <div>Cook Time: {recipe.cookTime}</div>}
        </div>
      </div>
    </div>
  )
}