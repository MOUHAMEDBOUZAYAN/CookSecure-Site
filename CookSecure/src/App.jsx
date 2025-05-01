import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import RecipeList from './pages/recipes/RecipeList'
import RecipeDetail from './pages/recipes/RecipeDetail'
import AddRecipe from './pages/recipes/AddRecipe'
import EditRecipe from './pages/recipes/EditRecipe'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import RoleRoute from './components/RoleRoute';
// import Navbar from './components/Navbar';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<RecipeList />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/add-recipe" element={<AddRecipe />} />
              <Route path="/edit-recipe/:id" element={<EditRecipe />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route element={<RoleRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<div className="p-4">Admin Panel</div>} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  )
}