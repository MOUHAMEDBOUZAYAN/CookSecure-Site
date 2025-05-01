import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { login, register, getUserById } from '../services/auth'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const userId = sessionStorage.getItem('userId')
      if (userId) {
        try {
          const userData = await getUserById(userId)
          setUser(userData)
        } catch (error) {
          console.error('Failed to fetch user:', error)
          sessionStorage.removeItem('userId')
        }
      }
      setLoading(false)
    }
    
    checkAuth()
  }, [])

  const loginUser = async (email, password) => {
    try {
      const userData = await login(email, password)
      setUser(userData)
      sessionStorage.setItem('userId', userData.id)
      toast.success('Logged in successfully!')
      navigate('/recipes')
    } catch (error) {
      toast.error(error.message)
      throw error
    }
  }

  const registerUser = async (email, password, name) => {
    try {
      const userData = await register(email, password, name)
      setUser(userData)
      sessionStorage.setItem('userId', userData.id)
      toast.success('Registered successfully!')
      navigate('/recipes')
    } catch (error) {
      toast.error(error.message)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('userId')
    toast.success('Logged out successfully!')
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      login: loginUser, 
      logout, 
      register: registerUser 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)