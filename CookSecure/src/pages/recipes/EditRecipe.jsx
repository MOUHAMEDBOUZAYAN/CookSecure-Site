import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getRecipeById, updateRecipe } from '../../services/recipes'
import toast from 'react-hot-toast'

export default function EditRecipe() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    prepTime: '',
    cookTime: ''
  })
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id)
        
        // Vérifier que l'utilisateur est le propriétaire ou admin
        if (data.userId !== user?.id && user?.role !== 'admin') {
          toast.error('You are not authorized to edit this recipe')
          navigate('/recipes')
          return
        }
        
        setRecipe({
          ...data,
          ingredients: data.ingredients.join('\n')
        })
      } catch (error) {
        toast.error('Failed to load recipe')
        navigate('/recipes')
      } finally {
        setLoading(false)
      }
    }
    
    fetchRecipe()
  }, [id, user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const ingredientsArray = recipe.ingredients.split('\n').filter(i => i.trim() !== '')
      
      await updateRecipe(id, {
        ...recipe,
        ingredients: ingredientsArray
      })
      
      toast.success('Recipe updated successfully!')
      navigate(`/recipes/${id}`)
    } catch (error) {
      toast.error('Failed to update recipe')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setRecipe(prev => ({ ...prev, [name]: value }))
  }

  if (loading) {
    return <div className="text-center py-8">Loading recipe...</div>
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Recipe</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-700 mb-2">Title*</label>
          <input
            id="title"
            name="title"
            type="text"
            className="w-full p-2 border rounded"
            value={recipe.title}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-700 mb-2">Description*</label>
          <input
            id="description"
            name="description"
            type="text"
            className="w-full p-2 border rounded"
            value={recipe.description}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="ingredients" className="block text-gray-700 mb-2">Ingredients* (one per line)</label>
          <textarea
            id="ingredients"
            name="ingredients"
            className="w-full p-2 border rounded h-32"
            value={recipe.ingredients}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="instructions" className="block text-gray-700 mb-2">Instructions*</label>
          <textarea
            id="instructions"
            name="instructions"
            className="w-full p-2 border rounded h-48"
            value={recipe.instructions}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="prepTime" className="block text-gray-700 mb-2">Prep Time</label>
            <input
              id="prepTime"
              name="prepTime"
              type="text"
              className="w-full p-2 border rounded"
              value={recipe.prepTime}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="cookTime" className="block text-gray-700 mb-2">Cook Time</label>
            <input
              id="cookTime"
              name="cookTime"
              type="text"
              className="w-full p-2 border rounded"
              value={recipe.cookTime}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/recipes/${id}`)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}