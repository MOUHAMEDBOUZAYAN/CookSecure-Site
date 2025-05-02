import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getUserById } from '../services/auth'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user: currentUser, logout } = useAuth()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById(currentUser.id)
        setUser(userData)
      } catch (error) {
        toast.error('Failed to load user profile')
      } finally {
        setLoading(false)
      }
    }
    
    if (currentUser) {
      fetchUser()
    }
  }, [currentUser])

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>
  }

  if (!user) {
    return <div className="text-center py-8">User not found</div>
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-600">Name</label>
          <p className="text-lg">{user.name}</p>
        </div>
        <div>
          <label className="block text-gray-600">Email</label>
          <p className="text-lg">{user.email}</p>
        </div>
        <div>
          <label className="block text-gray-600">Role</label>
          <p className="text-lg capitalize">{user.role}</p>
        </div>
        <button
          onClick={logout}
          className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors mt-6"
        >
          Logout
        </button>
      </div>
    </div>
  )
}