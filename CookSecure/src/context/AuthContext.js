import { createContext, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })
  const navigate = useNavigate()

  const login = (email, password) => {
    // Mock login
    const mockUser = {
      id: '1',
      email,
      name: 'Test User',
      role: email.includes('admin') ? 'admin' : 'user'
    }
    setUser(mockUser)
    localStorage.setItem('user', JSON.stringify(mockUser))
    toast.success('Logged in successfully!')
    navigate('/recipes')
    return mockUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    toast.success('Logged out successfully!')
    navigate('/login')
  }

  const register = (email, password, name) => {
    // Mock registration
    const mockUser = {
      id: '2',
      email,
      name,
      role: 'user'
    }
    setUser(mockUser)
    localStorage.setItem('user', JSON.stringify(mockUser))
    toast.success('Registered successfully!')
    navigate('/recipes')
    return mockUser
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)