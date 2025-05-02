import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <Link 
        to="/" 
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg inline-block"
      >
        Go to Home
      </Link>
    </div>
  )
}