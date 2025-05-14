// src/pages/auth/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useFormValidation } from '../../utils/FormValidation';

const Register = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'INFO' });
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  // Show toast notification
  const showToast = (message, type = 'INFO') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'INFO' });
    }, 3000);
  };
  
  // Define validation rules
  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      fieldName: 'Full name'
    },
    email: {
      required: true,
      type: 'email',
      fieldName: 'Email address'
    },
    password: {
      required: true,
      minLength: 8,
      type: 'password',
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\S]+$/,
      fieldName: 'Password'
    },
    role: {
      required: true,
      fieldName: 'Role'
    }
  };
  
  // Use form validation hook
  const {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll
  } = useFormValidation(
    { name: '', email: '', password: '', role: 'user' },
    validationRules
  );
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const isValid = validateAll();
    if (!isValid) {
      showToast('Please fix the validation errors', 'ERROR');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Pass the role to the register function
      await register(formData.email, formData.password, formData.name, formData.role);
      
      // Show success toast before redirecting
      showToast('Account created successfully!', 'SUCCESS');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please sign in with your new account.',
            type: 'SUCCESS'
          } 
        });
      }, 1000);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed');
      showToast('Registration failed', 'ERROR');
      setLoading(false);
    }
  };
  
  // Toast notification component
  const Toast = () => {
    if (!toast.show) return null;
    
    let bgColor, textColor, icon;
    switch (toast.type) {
      case 'SUCCESS':
        bgColor = 'bg-green-50';
        textColor = 'text-green-800';
        icon = (
          <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
        break;
      case 'ERROR':
        bgColor = 'bg-red-50';
        textColor = 'text-red-800';
        icon = (
          <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
        break;
      case 'WARNING':
        bgColor = 'bg-yellow-50';
        textColor = 'text-yellow-800';
        icon = (
          <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
        break;
      default: // INFO
        bgColor = 'bg-blue-50';
        textColor = 'text-blue-800';
        icon = (
          <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
    
    return (
      <div className="fixed top-4 right-4 z-50 flex animate-fade-in-down">
        <div className={`${bgColor} border-l-4 border-${toast.type.toLowerCase()}-500 p-4 rounded shadow-lg max-w-md`}>
          <div className="flex">
            <div className="flex-shrink-0">{icon}</div>
            <div className="ml-3">
              <p className={`text-sm ${textColor}`}>{toast.message}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setToast({ ...toast, show: false })}
                  className={`inline-flex rounded-md p-1.5 text-${toast.type.toLowerCase()}-500 hover:bg-${toast.type.toLowerCase()}-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${toast.type.toLowerCase()}-500`}
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      {/* Toast notification */}
      <Toast />
      
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 font-serif">Create an Account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Join our community to discover and share amazing recipes
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`appearance-none block w-full px-4 py-3 border ${
                  touched.name && errors.name ? 'border-red-500' : 'border-gray-300'
                } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                placeholder="Your full name"
              />
              {touched.name && errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`appearance-none block w-full px-4 py-3 border ${
                  touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                placeholder="your@email.com"
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`appearance-none block w-full px-4 py-3 border ${
                  touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                placeholder="••••••••"
              />
              {touched.password && errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters with uppercase, lowercase, and numbers
              </p>
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                I am registering as a:
              </label>
              <div className="flex space-x-4 mt-2">
                <div className="flex items-center">
                  <input
                    id="role-user"
                    name="role"
                    type="radio"
                    value="user"
                    checked={formData.role === 'user'}
                    onChange={handleChange}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                  />
                  <label htmlFor="role-user" className="ml-2 block text-sm text-gray-700">
                    User (view recipes only)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="role-chef"
                    name="role"
                    type="radio"
                    value="chef"
                    checked={formData.role === 'chef'}
                    onChange={handleChange}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                  />
                  <label htmlFor="role-chef" className="ml-2 block text-sm text-gray-700">
                    Chef (create and edit recipes)
                  </label>
                </div>
              </div>
              {touched.role && errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white ${
                  loading ? 'bg-orange-400' : 'bg-orange-500 hover:bg-orange-600'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-200`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-sm">
                <span className="text-gray-500">Already have an account?</span>{' '}
                <Link to="/login" className="font-medium text-orange-500 hover:text-orange-600">
                  Sign in instead
                </Link>
              </div>
            </div>
          </form>
          
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition duration-200">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.79-1.677-4.184-2.702-6.735-2.702-5.522 0-10 4.478-10 10s4.478 10 10 10c8.316 0 10-7.721 10-10 0-0.617-0.066-1.219-0.189-1.799h-9.811z"/>
                </svg>
                Google
              </button>
              <button className="flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition duration-200">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Side - Image */}
        <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/assets/images/register-image.jpg')" }}>
          <div className="h-full w-full bg-black bg-opacity-30 flex items-center">
            <div className="px-12 py-8">
              <h3 className="text-3xl text-white font-serif font-bold">Join our culinary community</h3>
              <p className="mt-4 text-lg text-white opacity-90">
                Share your favorite recipes and discover new culinary inspirations from chefs around the world.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;