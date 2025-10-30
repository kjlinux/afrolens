import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiUser, FiLogOut, FiCamera, FiSettings } from 'react-icons/fi';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FiCamera className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">POUIRE</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-2xl mx-8">
            <input
              type="search"
              placeholder="Rechercher des photos..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              onFocus={() => navigate('/search')}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Cart */}
                <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg">
                  <FiShoppingCart className="w-6 h-6" />
                  {getItemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getItemCount()}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg">
                    <img
                      src={user.avatar_url}
                      alt={user.first_name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="hidden md:block">{user.first_name}</span>
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 hover:bg-gray-100"
                    >
                      <FiUser className="mr-2" /> Profil
                    </Link>

                    {user.account_type === 'photographer' && (
                      <Link
                        to="/photographer/dashboard"
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                      >
                        <FiCamera className="mr-2" /> Dashboard
                      </Link>
                    )}

                    {user.account_type === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                      >
                        <FiSettings className="mr-2" /> Administration
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      <FiLogOut className="mr-2" /> Déconnexion
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">
                  Connexion
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
