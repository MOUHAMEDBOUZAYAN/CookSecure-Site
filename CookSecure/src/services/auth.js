const API_URL = 'http://localhost:3000'

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/users?email=${email}&password=${password}`)
  const users = await response.json()
  
  if (users.length === 0) {
    throw new Error('Invalid email or password')
  }
  
  return users[0]
}

export const register = async (email, password, name) => {
  const checkUser = await fetch(`${API_URL}/users?email=${email}`)
  const existingUsers = await checkUser.json()
  
  if (existingUsers.length > 0) {
    throw new Error('Email already exists')
  }
  
  const newUser = {
    email,
    password,
    name,
    role: 'user'
  }
  
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newUser)
  })
  
  return await response.json()
}

export const getUserById = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}`)
  if (!response.ok) {
    throw new Error('User not found')
  }
  return await response.json()
}