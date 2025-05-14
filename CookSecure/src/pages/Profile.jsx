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
  BookmarkIcon
} from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Nouveaux états pour les formulaires
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: 'Passionné(e) de cuisine et de partage de recettes.'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Initialiser les données du formulaire quand l'utilisateur est chargé
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: 'Passionné(e) de cuisine et de partage de recettes.'
      });
    }
  }, [user]);

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

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gérer les changements dans le formulaire de mot de passe
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Sauvegarder les modifications du profil
  const handleSaveProfile = async () => {
    try {
      if (!user || !user.id) {
        toast.error('Utilisateur non connecté');
        return;
      }

      // Mise à jour de l'utilisateur dans l'API
      const response = await axios.patch(`/api/users/${user.id}`, {
        name: formData.name,
        email: formData.email
      });

      if (response.data) {
        // Mettre à jour les données utilisateur dans localStorage
        const updatedUser = {
          ...user,
          name: formData.name,
          email: formData.email
        };

        localStorage.setItem('user', JSON.stringify(updatedUser));

        toast.success('Profil mis à jour avec succès');
        
        // Rediriger pour rafraîchir les données
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    }
  };

  // Changer le mot de passe
  const handleChangePassword = async () => {
    try {
      if (!user || !user.id) {
        toast.error('Utilisateur non connecté');
        return;
      }

      // Vérifier que les mots de passe correspondent
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error('Les mots de passe ne correspondent pas');
        return;
      }

      // Vérifier le mot de passe actuel (simulation)
      // Dans une vraie app, cela devrait se faire côté serveur
      const checkUserResponse = await axios.get(`/api/users/${user.id}`);
      const currentUserData = checkUserResponse.data;

      if (currentUserData.password !== passwordData.currentPassword) {
        toast.error('Mot de passe actuel incorrect');
        return;
      }

      // Mise à jour du mot de passe
      const response = await axios.patch(`/api/users/${user.id}`, {
        password: passwordData.newPassword
      });

      if (response.data) {
        toast.success('Mot de passe modifié avec succès');
        
        // Réinitialiser le formulaire
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      toast.error('Erreur lors du changement de mot de passe');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
            <UserIcon className="h-10 w-10 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vous n'êtes pas connecté</h2>
          <p className="text-gray-600 mb-8">Veuillez vous connecter pour accéder à votre profil</p>
          <Link 
            to="/login" 
            className="w-full inline-flex justify-center items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Banner Image with Gradient Overlay */}
            <div className="h-56 w-full bg-gradient-to-r from-orange-400 to-orange-600 relative">
              <div className="absolute inset-0 bg-[url('/img/pattern.svg')] opacity-10"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">Mon profil de chef</h1>
              </div>
            </div>

            {/* Profile Header */}
            <div className="px-6 pt-20 pb-6 relative border-b border-gray-200">
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 sm:left-8 sm:translate-x-0">
                <div className="h-32 w-32 rounded-full bg-white p-1 shadow-xl">
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                    <span className="text-4xl font-semibold text-orange-600">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-center sm:text-left sm:ml-36">
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 mt-1">Membre depuis {new Date().toLocaleDateString()}</p>
              </div>
              
              {/* Action button (mobile) */}
              <div className="absolute top-6 right-6 sm:hidden">
                <button onClick={handleLogout} className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                  <LogOutIcon className="h-5 w-5" />
                </button>
              </div>
              
              {/* Action buttons (desktop) */}
              <div className="hidden sm:flex absolute top-6 right-6 space-x-2">
                <Link to="/add-recipe" className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                  <PlusIcon className="h-4 w-4" />
                  <span>Ajouter une recette</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                  <LogOutIcon className="h-4 w-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex overflow-x-auto scrollbar-hide">
              <button 
                className={`flex items-center px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'profile' ? 'text-orange-500 border-orange-500' : 'text-gray-500 hover:text-gray-700 border-transparent'}`}
                onClick={() => setActiveTab('profile')}
              >
                <UserIcon className="h-4 w-4 mr-2" />
                Profil
              </button>
              <button 
                className={`flex items-center px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'recipes' ? 'text-orange-500 border-orange-500' : 'text-gray-500 hover:text-gray-700 border-transparent'}`}
                onClick={() => setActiveTab('recipes')}
              >
                <ChefHatIcon className="h-4 w-4 mr-2" />
                Mes Recettes
              </button>
              <button 
                className={`flex items-center px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'favorites' ? 'text-orange-500 border-orange-500' : 'text-gray-500 hover:text-gray-700 border-transparent'}`}
                onClick={() => setActiveTab('favorites')}
              >
                <BookmarkIcon className="h-4 w-4 mr-2" />
                Favoris
              </button>
              <button 
                className={`flex items-center px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'settings' ? 'text-orange-500 border-orange-500' : 'text-gray-500 hover:text-gray-700 border-transparent'}`}
                onClick={() => setActiveTab('settings')}
              >
                <SettingsIcon className="h-4 w-4 mr-2" />
                Paramètres
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8">
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900">Mon profil</h3>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-500">Nom</label>
                          <p className="text-gray-900 font-medium">{user.name}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-500">Email</label>
                          <p className="text-gray-900 font-medium">{user.email}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-500">Rôle</label>
                          <p className="text-gray-900 font-medium capitalize">{user.role || 'Utilisateur'}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-500">Bio</label>
                          <p className="text-gray-900">Passionné(e) de cuisine et de partage de recettes.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900">Statistiques</h3>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 text-center">
                          <span className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-white text-orange-500">
                            <ChefHatIcon className="h-6 w-6" />
                          </span>
                          <span className="block text-3xl font-bold text-orange-600 mb-1">{userRecipes.length}</span>
                          <span className="text-gray-700">Recettes créées</span>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                          <span className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-white text-blue-500">
                            <BookmarkIcon className="h-6 w-6" />
                          </span>
                          <span className="block text-3xl font-bold text-blue-600 mb-1">0</span>
                          <span className="text-gray-700">Recettes favorites</span>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
                          <span className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-white text-green-500">
                            <StarIcon className="h-6 w-6" />
                          </span>
                          <span className="block text-3xl font-bold text-green-600 mb-1">0</span>
                          <span className="text-gray-700">Commentaires</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'recipes' && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-semibold text-gray-900">Mes recettes</h3>
                    <Link 
                      to="/add-recipe" 
                      className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg shadow-sm hover:bg-orange-600 transition-colors"
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Ajouter une recette
                    </Link>
                  </div>

                  {loading ? (
                    <div className="text-center py-12">
                      <div className="inline-block h-12 w-12 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin"></div>
                      <p className="mt-4 text-gray-600">Chargement de vos recettes...</p>
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
                      <h3 className="text-xl font-medium text-gray-900 mb-2">Aucune recette</h3>
                      <p className="text-gray-500 mb-8">Vous n'avez pas encore ajouté de recettes</p>
                      <Link 
                        to="/add-recipe" 
                        className="inline-flex items-center px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
                      >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Créer ma première recette
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'favorites' && (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <BookmarkIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun favori</h3>
                  <p className="text-gray-500 mb-8">Vous n'avez pas encore ajouté de recettes aux favoris</p>
                  <Link 
                    to="/" 
                    className="inline-flex items-center px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
                  >
                    Explorer des recettes
                  </Link>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-8">
                  {/* Formulaire de profil */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900">Paramètres du compte</h3>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                          <textarea
                            id="bio"
                            name="bio"
                            rows={3}
                            value={formData.bio}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={handleSaveProfile}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                          >
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Enregistrer les modifications
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Formulaire de sécurité (mot de passe) */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900">Sécurité</h3>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                          <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                          <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                          <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={handleChangePassword}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                          >
                            Changer le mot de passe
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Zone de danger */}
                  <div className="bg-red-50 rounded-xl shadow-sm border border-red-100">
                    <div className="px-6 py-4 border-b border-red-100">
                      <h3 className="text-lg font-semibold text-red-600">Zone de danger</h3>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                          <h4 className="text-base font-medium text-red-800 mb-1">Déconnexion</h4>
                          <p className="text-sm text-red-700">Vous serez déconnecté de votre compte</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                          <LogOutIcon className="h-4 w-4 mr-2" />
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