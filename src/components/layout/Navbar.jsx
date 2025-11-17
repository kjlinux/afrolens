import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiUser, FiLogOut, FiCamera, FiSettings, FiMenu, FiX, FiSearch, FiAlertCircle } from 'react-icons/fi';
import { PERMISSIONS, PHOTOGRAPHER_STATUS } from '../../utils/permissions';

export default function Navbar() {
  const {
    user,
    isAuthenticated,
    logout,
    hasRole,
    hasPermission,
    isApprovedPhotographer,
    getPhotographerStatus
  } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Get photographer status for badge display
  const photographerStatus = getPhotographerStatus();
  const canAccessPhotographerDashboard = hasRole('photographer') && isApprovedPhotographer();

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 shrink-0" onClick={closeMobileMenu}>
            <FiCamera className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
            <span className="text-xl sm:text-2xl font-bold text-gray-900">POUIRE</span>
          </Link>

          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <input
              type="search"
              placeholder="Rechercher des photos..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              onFocus={() => navigate('/search')}
            />
          </div>

          {/* Search Icon - Mobile/Tablet */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <FiSearch className="w-6 h-6" />
          </button>

          {/* Actions - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
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
                    <span className="hidden lg:block">{user.first_name}</span>
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 pt-2 w-48 hidden group-hover:block">
                    <div className="bg-white rounded-lg shadow-lg py-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                      >
                        <FiUser className="mr-2" /> Profil
                      </Link>

                      {/* Photographer Dashboard - Only if approved */}
                      {hasRole('photographer') && (
                        <>
                          {canAccessPhotographerDashboard ? (
                            <Link
                              to="/photographer/dashboard"
                              className="flex items-center px-4 py-2 hover:bg-gray-100"
                            >
                              <FiCamera className="mr-2" /> Dashboard
                              <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                Approuvé
                              </span>
                            </Link>
                          ) : (
                            <Link
                              to={
                                photographerStatus === PHOTOGRAPHER_STATUS.PENDING
                                  ? '/photographer/pending'
                                  : photographerStatus === PHOTOGRAPHER_STATUS.REJECTED
                                  ? '/photographer/rejected'
                                  : photographerStatus === PHOTOGRAPHER_STATUS.SUSPENDED
                                  ? '/photographer/suspended'
                                  : '/photographer/pending'
                              }
                              className="flex items-center px-4 py-2 hover:bg-gray-100"
                            >
                              <FiAlertCircle className="mr-2 text-yellow-600" />
                              <span>Dashboard</span>
                              <span className="ml-auto text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                {photographerStatus === PHOTOGRAPHER_STATUS.PENDING && 'En attente'}
                                {photographerStatus === PHOTOGRAPHER_STATUS.REJECTED && 'Refusé'}
                                {photographerStatus === PHOTOGRAPHER_STATUS.SUSPENDED && 'Suspendu'}
                              </span>
                            </Link>
                          )}
                        </>
                      )}

                      {/* Admin Dashboard - Permission based */}
                      {hasPermission(PERMISSIONS.VIEW_DASHBOARD) && (
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
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost text-sm lg:text-base">
                  Connexion
                </Link>
                <Link to="/register" className="btn btn-primary text-sm lg:text-base">
                  Inscription
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="md:hidden py-4 border-t">
            <input
              type="search"
              placeholder="Rechercher des photos..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              onFocus={() => {
                navigate('/search');
                setSearchOpen(false);
              }}
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-4 space-y-3">
            {isAuthenticated ? (
              <>
                {/* User Info */}
                <div className="flex items-center space-x-3 pb-3 border-b">
                  <img
                    src={user.avatar_url}
                    alt={user.first_name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{user.first_name} {user.last_name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                {/* Cart */}
                <Link
                  to="/cart"
                  className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg"
                  onClick={closeMobileMenu}
                >
                  <span className="flex items-center">
                    <FiShoppingCart className="w-5 h-5 mr-3" />
                    Panier
                  </span>
                  {getItemCount() > 0 && (
                    <span className="bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {getItemCount()}
                    </span>
                  )}
                </Link>

                {/* Profile */}
                <Link
                  to="/profile"
                  className="flex items-center py-2 px-3 hover:bg-gray-50 rounded-lg"
                  onClick={closeMobileMenu}
                >
                  <FiUser className="w-5 h-5 mr-3" />
                  Profil
                </Link>

                {/* Photographer Dashboard - Only if photographer role */}
                {hasRole('photographer') && (
                  <>
                    {canAccessPhotographerDashboard ? (
                      <Link
                        to="/photographer/dashboard"
                        className="flex items-center py-2 px-3 hover:bg-gray-50 rounded-lg"
                        onClick={closeMobileMenu}
                      >
                        <FiCamera className="w-5 h-5 mr-3" />
                        <span className="flex-1">Dashboard Photographe</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          Approuvé
                        </span>
                      </Link>
                    ) : (
                      <Link
                        to={
                          photographerStatus === PHOTOGRAPHER_STATUS.PENDING
                            ? '/photographer/pending'
                            : photographerStatus === PHOTOGRAPHER_STATUS.REJECTED
                            ? '/photographer/rejected'
                            : photographerStatus === PHOTOGRAPHER_STATUS.SUSPENDED
                            ? '/photographer/suspended'
                            : '/photographer/pending'
                        }
                        className="flex items-center py-2 px-3 hover:bg-gray-50 rounded-lg"
                        onClick={closeMobileMenu}
                      >
                        <FiAlertCircle className="w-5 h-5 mr-3 text-yellow-600" />
                        <span className="flex-1">Dashboard Photographe</span>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                          {photographerStatus === PHOTOGRAPHER_STATUS.PENDING && 'En attente'}
                          {photographerStatus === PHOTOGRAPHER_STATUS.REJECTED && 'Refusé'}
                          {photographerStatus === PHOTOGRAPHER_STATUS.SUSPENDED && 'Suspendu'}
                        </span>
                      </Link>
                    )}
                  </>
                )}

                {/* Admin Dashboard - Permission based */}
                {hasPermission(PERMISSIONS.VIEW_DASHBOARD) && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center py-2 px-3 hover:bg-gray-50 rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    <FiSettings className="w-5 h-5 mr-3" />
                    Administration
                  </Link>
                )}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full py-2 px-3 hover:bg-red-50 rounded-lg text-red-600"
                >
                  <FiLogOut className="w-5 h-5 mr-3" />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block w-full py-2 px-4 text-center border border-gray-300 rounded-lg hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="block w-full py-2 px-4 text-center bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  onClick={closeMobileMenu}
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
