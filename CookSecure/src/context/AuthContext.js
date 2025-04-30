import { createContext, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { showNotification } from '../utils/notification'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
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
    showNotification('Success', 'Logged in successfully!')
    navigate('/recipes')
    return mockUser
  }

  const logout = () => {
    setUser(null)
    showNotification('Success', 'Logged out successfully!')
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
    showNotification('Success', 'Registered successfully!')
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