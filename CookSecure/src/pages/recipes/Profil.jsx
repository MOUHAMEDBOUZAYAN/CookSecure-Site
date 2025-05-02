// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getUserRecipes } from '../services/recipes';
import { Toaster, toast } from 'react-hot-toast';
import RecipeCard from '../components/RecipeCard';

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        setLoading(true);
        if (user && user.id) {
          const recipes = await getUserRecipes(user.id);
          setUserRecipes(recipes);
        }
      } catch (error) {
        console.error('Error fetching user recipes:', error);
        toast.error('Impossible de charger vos recettes');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRecipes();
  }, [user]);

  const handleLogout = () => {
    toast.success('Déconnexion réussie');
    setTimeout(() => {
      logout();
      navigate('/');
    }, 1000);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vous n'êtes pas connecté</h2>
          <p className="text-gray-600 mb-6">Veuillez vous connecter pour accéder à votre profil</p>
          <Link 
            to="/login" 
            className="px-6 py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition duration-300"
          >
            Se connecter
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Banner Image */}
            <div className="h-48 w-full bg-gradient-to-r from-orange-400 to-orange-600 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-3xl font-bold text-white">Mon profil de chef</h1>
              </div>
            </div>

            {/* Profile Header */}
            <div className="px-6 pt-16 pb-6 relative">
              <div className="absolute -top-16 left-6 h-32 w-32 rounded-full bg-white p-1 shadow-lg">
                <div className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-4xl font-semibold text-gray-600">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
              </div>
              <div className="ml-36">
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 mt-1">Membre depuis {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <button 
                  className={`px-6 py-4 font-medium text-sm ${activeTab === 'profile' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  Profil
                </button>
                <button 
                  className={`px-6 py-4 font-medium text-sm ${activeTab === 'recipes' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('recipes')}
                >
                  Mes Recettes
                </button>
                <button 
                  className={`px-6 py-4 font-medium text-sm ${activeTab === 'favorites' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('favorites')}
                >
                  Favoris
                </button>
                <button 
                  className={`px-6 py-4 font-medium text-sm ${activeTab === 'settings' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('settings')}
                >
                  Paramètres
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Mon profil</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Nom</label>
                          <p className="mt-1 text-gray-900 font-medium">{user.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <p className="mt-1 text-gray-900 font-medium">{user.email}</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Rôle</label>
                        <p className="mt-1 text-gray-900 font-medium capitalize">{user.role || 'Utilisateur'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Bio</label>
                        <p className="mt-1 text-gray-900">Passionné(e) de cuisine et de partage de recettes.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Statistiques</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <span className="block text-3xl font-bold text-orange-500">{userRecipes.length}</span>
                        <span className="text-gray-700">Recettes créées</span>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <span className="block text-3xl font-bold text-orange-500">0</span>
                        <span className="text-gray-700">Recettes favorites</span>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <span className="block text-3xl font-bold text-orange-500">0</span>
                        <span className="text-gray-700">Commentaires</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'recipes' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Mes recettes</h3>
                    <Link 
                      to="/add-recipe" 
                      className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Ajouter une recette
                    </Link>
                  </div>

                  {loading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                      <p className="mt-2 text-gray-600">Chargement de vos recettes...</p>
                    </div>
                  ) : userRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userRecipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">Aucune recette</h3>
                      <p className="mt-1 text-gray-500">Vous n'avez pas encore ajouté de recettes</p>
                      <div className="mt-6">
                        <Link 
                          to="/add-recipe" 
                          className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                        >
                          Créer ma première recette
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'favorites' && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun favori</h3>
                  <p className="mt-1 text-gray-500">Vous n'avez pas encore ajouté de recettes aux favoris</p>
                  <div className="mt-6">
                    <Link 
                      to="/" 
                      className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                    >
                      Explorer des recettes
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Paramètres du compte</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          defaultValue={user.name}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          defaultValue={user.email}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                        <textarea
                          id="bio"
                          name="bio"
                          rows={3}
                          defaultValue="Passionné(e) de cuisine et de partage de recettes."
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                          Enregistrer les modifications
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Sécurité</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                      <div>
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">Mot de passe actuel</label>
                        <input
                          type="password"
                          id="current-password"
                          name="current-password"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                        <input
                          type="password"
                          id="new-password"
                          name="new-password"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                        <input
                          type="password"
                          id="confirm-password"
                          name="confirm-password"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                          Changer le mot de passe
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-red-600 mb-3">Danger Zone</h3>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-base font-medium text-red-800">Déconnexion</h4>
                          <p className="text-sm text-red-700">Vous serez déconnecté de votre compte</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Déconnexion
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
};

export default Profile;