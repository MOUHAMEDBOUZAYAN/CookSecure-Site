const API_URL = 'http://localhost:3000'

export const getRecipes = async () => {
  const response = await fetch(`${API_URL}/recipes?_expand=user`)
  return await response.json()
}

export const getRecipeById = async (id) => {
  const response = await fetch(`${API_URL}/recipes/${id}?_expand=user`)
  if (!response.ok) {
    throw new Error('Recipe not found')
  }
  return await response.json()
}

export const addRecipe = async (recipe, userId) => {
  const newRecipe = {
    ...recipe,
    userId
  }
  
  const response = await fetch(`${API_URL}/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newRecipe)
  })
  
  return await response.json()
}

export const updateRecipe = async (id, recipe) => {
  const response = await fetch(`${API_URL}/recipes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(recipe)
  })
  
  return await response.json()
}

export const deleteRecipe = async (id) => {
  const response = await fetch(`${API_URL}/recipes/${id}`, {
    method: 'DELETE'
  })
  
  return response.ok
}