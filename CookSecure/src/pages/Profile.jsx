// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getUserRecipes } from '../services/recipes';
import { Toaster, toast } from 'react-hot-toast';
import RecipeCard from '../components/RecipeCard';
import axios from 'axios';
import { 
  UserIcon, 
  ChefHatIcon, 
  PencilIcon, 
  LogOutIcon, 
  PlusIcon, 
  StarIcon,
  SettingsIcon,
  BookmarkIcon,
  CalendarIcon,
  TrendingUpIcon,
  ShieldIcon,
  BellIcon,
  CameraIcon,
  SaveIcon,
  TrashIcon,
  EyeIcon,
  FilterIcon,
  ListOrderedIcon
} from 'lucide-react';

const Profile = () => {
  const { user, logout, favorites } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    recipes: 0,
    favorites: 0,
    comments: 0,
    views: 0,
    likes: 0
  });
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: 'Passionate about cooking and sharing recipes.'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'like',
      message: 'Chef Maria liked your Spaghetti Carbonara recipe',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'comment',
      message: 'John left a comment on your Chocolate Cake recipe',
      time: 'Yesterday',
      read: true
    },
    {
      id: 3,
      type: 'follow',
      message: 'Sarah started following you',
      time: '3 days ago',
      read: true
    }
  ]);

  // Initialize form data when user is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || 'Passionate about cooking and sharing recipes.'
      });
    }
  }, [user]);

  // Fetch user recipes and stats
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        if (user && user.id) {
          const recipes = await getUserRecipes(user.id);
          setUserRecipes(recipes);
          
          // Set stats
          setStats({
            recipes: recipes.length,
            favorites: favorites?.length || 0,
            comments: 12, // Example value
            views: 234, // Example value
            likes: 56 // Example value
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Unable to load your data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, favorites]);

  const handleLogout = () => {
    toast.success('Successfully logged out');
    setTimeout(() => {
      logout();
      navigate('/');
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      if (!user || !user.id) {
        toast.error('User not logged in');
        return;
      }

      // Update user in API
      toast.loading('Updating profile...');
      const response = await axios.patch(`/api/users/${user.id}`, {
        name: formData.name,
        email: formData.email,
        bio: formData.bio
      });

      if (response.data) {
        // Update user data in localStorage
        const updatedUser = {
          ...user,
          name: formData.name,
          email: formData.email,
          bio: formData.bio
        };

        localStorage.setItem('user', JSON.stringify(updatedUser));

        toast.dismiss();
        toast.success('Profile updated successfully');
        
        // Refresh data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      toast.dismiss();
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!user || !user.id) {
        toast.error('User not logged in');
        return;
      }

      // Validate passwords match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      // Validate password strength
      if (passwordData.newPassword.length < 8) {
        toast.error('Password must be at least 8 characters');
        return;
      }

      toast.loading('Updating password...');
      
      // Check current password (simulation)
      const checkUserResponse = await axios.get(`/api/users/${user.id}`);
      const currentUserData = checkUserResponse.data;

      if (currentUserData.password !== passwordData.currentPassword) {
        toast.dismiss();
        toast.error('Current password is incorrect');
        return;
      }

      // Update password
      const response = await axios.patch(`/api/users/${user.id}`, {
        password: passwordData.newPassword
      });

      if (response.data) {
        toast.dismiss();
        toast.success('Password changed successfully');
        
        // Reset form
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      toast.dismiss();
      console.error('Error changing password:', error);
      toast.error('Error changing password');
    }
  };

  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
            <UserIcon className="h-10 w-10 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">You're not logged in</h2>
          <p className="text-gray-600 mb-8">Please log in to access your profile</p>
          <Link 
            to="/login" 
            className="w-full inline-flex justify-center items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          success: {
            duration: 3000,
            style: {
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#14532d',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#7f1d1d',
            },
          },
        }}
      />
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Banner Image with Gradient Overlay */}
            <div className="h-64 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600"></div>
              <div className="absolute inset-0 opacity-20 bg-pattern"></div>
              
              {/* Profile info */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <div className="flex items-end gap-6">
                  <div className="h-32 w-32 rounded-xl bg-white p-1 shadow-xl relative bottom-6">
                    <div className="h-full w-full rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                      <span className="text-4xl font-semibold text-orange-600">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                      {/* Upload photo button */}
                      <button className="absolute bottom-0 right-0 bg-orange-500 rounded-full p-2 shadow-lg hover:bg-orange-600 transition-colors">
                        <CameraIcon className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white mb-1">
                      {user.name || 'User'}
                    </h1>
                    <p className="text-white text-opacity-90 flex items-center gap-2">
                      <span>{user.email}</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-800 bg-opacity-30 text-white">
                        {user.role || 'Chef'}
                      </span>
                    </p>
                    <p className="text-white text-opacity-75 text-sm mt-1">
                      <CalendarIcon className="inline h-4 w-4 mr-1" />
                      Member since {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                    </p>
                  </div>
                  
                  <div className="hidden md:flex space-x-2">
                    <Link to="/add-recipe" className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-orange-600 hover:bg-orange-50 transition-colors shadow-lg">
                      <PlusIcon className="h-4 w-4" />
                      <span>Add Recipe</span>
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
                      <LogOutIcon className="h-4 w-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="bg-orange-50 p-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 mb-2">
                    <ChefHatIcon className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-orange-600">{stats.recipes}</div>
                  <div className="text-xs text-gray-500">Recipes</div>
                </div>
                
                <div className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-100 mb-2">
                    <BookmarkIcon className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-red-600">{stats.favorites}</div>
                  <div className="text-xs text-gray-500">Favorites</div>
                </div>
                
                <div className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 mb-2">
                    <StarIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{stats.comments}</div>
                  <div className="text-xs text-gray-500">Comments</div>
                </div>
                
                <div className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100 mb-2">
                    <EyeIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">{stats.views}</div>
                  <div className="text-xs text-gray-500">Views</div>
                </div>
                
                <div className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{stats.likes}</div>
                  <div className="text-xs text-gray-500">Likes</div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200">
              <button 
                className={`flex items-center px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'profile' ? 'text-orange-500 border-orange-500' : 'text-gray-500 hover:text-gray-700 border-transparent'}`}
                onClick={() => setActiveTab('profile')}
              >
                <UserIcon className="h-4 w-4 mr-2" />
                Profile
              </button>
              <button 
                className={`flex items-center px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'recipes' ? 'text-orange-500 border-orange-500' : 'text-gray-500 hover:text-gray-700 border-transparent'}`}
                onClick={() => setActiveTab('recipes')}
              >
                <ChefHatIcon className="h-4 w-4 mr-2" />
                My Recipes
              </button>
              <button 
                className={`flex items-center px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'favorites' ? 'text-orange-500 border-orange-500' : 'text-gray-500 hover:text-gray-700 border-transparent'}`}
                onClick={() => setActiveTab('favorites')}
              >
                <BookmarkIcon className="h-4 w-4 mr-2" />
                Favorites
              </button>
              <button 
                className={`flex items-center px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'notifications' ? 'text-orange-500 border-orange-500' : 'text-gray-500 hover:text-gray-700 border-transparent'}`}
                onClick={() => setActiveTab('notifications')}
              >
                <BellIcon className="h-4 w-4 mr-2" />
                Notifications
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              <button 
                className={`flex items-center px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'settings' ? 'text-orange-500 border-orange-500' : 'text-gray-500 hover:text-gray-700 border-transparent'}`}
                onClick={() => setActiveTab('settings')}
              >
                <SettingsIcon className="h-4 w-4 mr-2" />
                Settings
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8">
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  {/* Profile Info Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">My Profile</h3>
                      <button 
                        onClick={() => setActiveTab('settings')}
                        className="text-sm text-orange-500 hover:text-orange-700 flex items-center"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-500">Name</label>
                          <p className="text-gray-900 font-medium">{user.name}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-500">Email</label>
                          <p className="text-gray-900 font-medium">{user.email}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-500">Role</label>
                          <p className="text-gray-900 font-medium capitalize">{user.role || 'Chef'}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-500">Bio</label>
                          <p className="text-gray-900">{formData.bio}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent Activity */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {/* Activity items */}
                        {[
                          { 
                            type: 'recipe', 
                            title: 'Added a new recipe', 
                            description: 'Delicious Chocolate Cake', 
                            time: '2 days ago',
                            icon: <PlusIcon className="h-4 w-4 text-green-500" />
                          },
                          { 
                            type: 'favorite', 
                            title: 'Saved to favorites', 
                            description: 'Chicken Parmesan', 
                            time: '1 week ago',
                            icon: <BookmarkIcon className="h-4 w-4 text-red-500" />
                          },
                          { 
                            type: 'comment', 
                            title: 'Left a comment', 
                            description: 'Great recipe! I added some garlic and it was perfect.', 
                            time: '2 weeks ago',
                            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                          }
                        ].map((activity, index) => (
                          <div key={index} className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-4 flex-shrink-0">
                              {activity.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-gray-900">{activity.title}</p>
                                  <p className="text-sm text-gray-600">{activity.description}</p>
                                </div>
                                <span className="text-xs text-gray-500">{activity.time}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'recipes' && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-semibold text-gray-900">My Recipes</h3>
                    <Link 
                      to="/add-recipe" 
                      className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg shadow-sm hover:bg-orange-600 transition-colors"
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Add New Recipe
                    </Link>
                  </div>

                  {/* Filters and sorting */}
                  <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-center">
                    <div className="flex items-center">
                      <FilterIcon className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Filter:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1.5 text-sm bg-orange-100 text-orange-800 rounded-md">
                        All
                      </button>
                      <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">
                        Published
                      </button>
                      <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">
                        Drafts
                      </button>
                    </div>
                    
                    <div className="ml-auto flex items-center">
                      <ListOrderedIcon className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700 mr-2">Sort:</span>
                      <select className="text-sm border-gray-300 rounded-md">
                        <option>Newest First</option>
                        <option>Oldest First</option>
                        <option>Most Popular</option>
                        <option>Alphabetical</option>
                      </select>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-12">
                      <div className="inline-block h-12 w-12 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin"></div>
                      <p className="mt-4 text-gray-600">Loading your recipes...</p>
                    </div>
                  ) : userRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userRecipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <ChefHatIcon className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No recipes yet</h3>
                      <p className="text-gray-500 mb-8">You haven't added any recipes yet</p>
                      <Link 
                        to="/add-recipe" 
                        className="inline-flex items-center px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
                      >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Create My First Recipe
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'favorites' && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-semibold text-gray-900">My Favorites</h3>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">{favorites?.length || 0} saved recipes</span>
                    </div>
                  </div>

                  {favorites && favorites.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favorites.map(recipe => (
                        <RecipeCard key={recipe.idMeal || recipe.id} recipe={recipe} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <BookmarkIcon className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No favorites yet</h3>
                      <p className="text-gray-500 mb-8">You haven't saved any recipes to your favorites yet</p>
                      <Link 
                        to="/recipes" 
                        className="inline-flex items-center px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
                      >
                        Explore Recipes
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-semibold text-gray-900">Notifications</h3>
                    {notifications.some(n => !n.read) && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-sm text-orange-500 hover:text-orange-700"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  {notifications.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                      {notifications.map((notification, index) => (
                        <div 
                          key={notification.id} 
                          className={`flex items-start p-4 ${index !== notifications.length - 1 ? 'border-b border-gray-100' : ''} ${!notification.read ? 'bg-orange-50' : ''}`}
                        >
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${
                            notification.type === 'like' ? 'bg-red-100 text-red-600' : 
                            notification.type === 'comment' ? 'bg-blue-100 text-blue-600' : 
                            'bg-green-100 text-green-600'
                          }`}>
                            {notification.type === 'like' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                              </svg>
                            ) : notification.type === 'comment' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                              </svg>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-gray-900">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                              </div>
                              {!notification.read && (
                                <button 
                                  onClick={() => markAsRead(notification.id)} 
                                  className="ml-4 text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-md hover:bg-orange-200"
                                >
                                  Mark as read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <BellIcon className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No notifications</h3>
                      <p className="text-gray-500 mb-8">You don't have any notifications at the moment</p>
                    </div>
                  )}
                  
                  {/* Notification preferences */}
                  <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {[
                          {
                            title: 'Recipe Comments',
                            description: 'When someone comments on your recipes',
                            enabled: true
                          },
                          {
                            title: 'Recipe Likes',
                            description: 'When someone likes your recipes',
                            enabled: true
                          },
                          {
                            title: 'New Followers',
                            description: 'When someone follows your profile',
                            enabled: true
                          },
                          {
                            title: 'New Features',
                            description: 'Updates and new features on CookSecure',
                            enabled: false
                          }
                        ].map((pref, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div>
                              <h4 className="text-base font-medium text-gray-900">{pref.title}</h4>
                              <p className="text-sm text-gray-600">{pref.description}</p>
                            </div>
                            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                              pref.enabled ? 'bg-orange-500' : 'bg-gray-300'
                            }`}>
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                pref.enabled ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-8">
                  {/* Profile Settings */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900">Profile Settings</h3>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Bio</label>
                          <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            rows="3"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={handleSaveProfile}
                          className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          <SaveIcon className="h-4 w-4 mr-2" />
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Password Settings */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Current Password</label>
                          <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">New Password</label>
                          <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={handleChangePassword}
                          className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          <ShieldIcon className="h-4 w-4 mr-2" />
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;