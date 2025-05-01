import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { addRecipe } from '../../services/recipes'
import toast from 'react-hot-toast'

export default function AddRecipe() {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [instructions, setInstructions] = useState('')
  const [prepTime, setPrepTime] = useState('')
  const [cookTime, setCookTime] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const ingredientsArray = ingredients.split('\n').filter(i => i.trim() !== '')
      
      await addRecipe({
        title,
        description,
        ingredients: ingredientsArray,
        instructions,
        prepTime,
        cookTime
      }, user.id)
      
      toast.success(`Recipe "${title}" added successfully!`)
      navigate('/recipes')
    } catch (error) {
      toast.error('Failed to add recipe')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add New Recipe</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-700 mb-2">Title*</label>
          <input
            id="title"
            type="text"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-700 mb-2">Description*</label>
          <input
            id="description"
            type="text"
            className="w-full p-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="ingredients" className="block text-gray-700 mb-2">Ingredients* (one per line)</label>
          <textarea
            id="ingredients"
            className="w-full p-2 border rounded h-32"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="instructions" className="block text-gray-700 mb-2">Instructions*</label>
          <textarea
            id="instructions"
            className="w-full p-2 border rounded h-48"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="prepTime" className="block text-gray-700 mb-2">Prep Time</label>
            <input
              id="prepTime"
              type="text"
              className="w-full p-2 border rounded"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="cookTime" className="block text-gray-700 mb-2">Cook Time</label>
            <input
              id="cookTime"
              type="text"
              className="w-full p-2 border rounded"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
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
            {isSubmitting ? 'Submitting...' : 'Submit Recipe'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/recipes')}
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