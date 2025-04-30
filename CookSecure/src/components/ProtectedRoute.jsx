import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export default function ProtectedRoute() {
  const { user } = useAuth()

  if (!user) {
    toast.error('You need to login first!')
    return <Navigate to="/login" />
  }

  return <Outlet />
}