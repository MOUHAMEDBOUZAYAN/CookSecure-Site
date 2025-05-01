import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export default function RoleRoute({ allowedRoles }) {
  const { user } = useAuth()

  if (!user) {
    toast.error('You need to login first!')
    return <Navigate to="/login" />
  }

  if (!allowedRoles.includes(user.role)) {
    toast.error('You dont have permission to access this page!')
    return <Navigate to="/" />
  }
  return <Outlet />
}