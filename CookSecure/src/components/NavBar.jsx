import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Cooking Platform</Link>
        <div className="flex space-x-4">
          <Link to="/recipes" className="hover:underline">Recipes</Link>
          {user ? (
            <>
              <Link to="/add-recipe" className="hover:underline">Add Recipe</Link>
              <Link to="/profile" className="hover:underline">Profile</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:underline">Admin</Link>
              )}
              <button onClick={logout} className="hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}