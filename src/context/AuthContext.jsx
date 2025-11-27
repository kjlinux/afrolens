import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
  isApprovedPhotographer as checkIsApprovedPhotographer,
  getPhotographerStatus as checkPhotographerStatus,
  canUploadPhotos as checkCanUploadPhotos,
  getUserCapabilities,
} from '../utils/permissions';
import { setupAxiosInterceptor } from '../utils/axiosInterceptor';
import { clearAuthToken } from '../config/apiConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Force logout function for interceptor (synchronous, no API call)
  const forceLogout = useCallback(() => {
    clearAuthToken();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Setup axios interceptor for 401 errors
  useEffect(() => {
    const cleanup = setupAxiosInterceptor(forceLogout, navigate);
    return cleanup;
  }, [forceLogout, navigate]);

  useEffect(() => {
    // Charger l'utilisateur depuis localStorage au démarrage
    const loadUser = () => {
      // Migration: Clear stale URLs from localStorage
      const userData = localStorage.getItem('pouire_user_data');
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          if (parsed.avatar_url || parsed.cover_url) {
            const { avatar_url, cover_url, ...rest } = parsed;
            localStorage.setItem('pouire_user_data', JSON.stringify(rest));
            console.log('[AuthContext] Migrated user data - removed stale URLs');
          }
        } catch (error) {
          console.error('[AuthContext] Error migrating user data:', error);
        }
      }

      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password, rememberMe) => {
    const { user: loggedUser, token } = await authService.login(email, password, rememberMe);
    setUser(loggedUser);
    setIsAuthenticated(true);
    return loggedUser;
  };

  const register = async (data) => {
    const { user: newUser, token } = await authService.register(data);
    setUser(newUser);
    setIsAuthenticated(true);
    return newUser;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);

    // Strip URLs before storing in localStorage
    const { avatar_url, cover_url, ...sanitizedUser } = updatedUser;
    localStorage.setItem('pouire_user_data', JSON.stringify(sanitizedUser));
  };

  /**
   * Refresh user abilities from the API
   * Call this after significant events: login, role change, photographer approval, etc.
   */
  const refreshAbilities = async () => {
    try {
      const abilities = await authService.fetchAbilities();
      updateUser(abilities);
      return abilities;
    } catch (error) {
      console.error('Failed to refresh user abilities:', error);
      throw error;
    }
  };

  // ============================================
  // PERMISSION & ROLE HELPERS
  // ============================================

  /**
   * Check if user has a specific permission
   * @param {string} permission - Permission to check
   * @returns {boolean}
   */
  const userHasPermission = (permission) => {
    return hasPermission(user, permission);
  };

  /**
   * Check if user has any of the specified permissions
   * @param {string[]} permissions - Array of permissions
   * @returns {boolean}
   */
  const userHasAnyPermission = (permissions) => {
    return hasAnyPermission(user, permissions);
  };

  /**
   * Check if user has all of the specified permissions
   * @param {string[]} permissions - Array of permissions
   * @returns {boolean}
   */
  const userHasAllPermissions = (permissions) => {
    return hasAllPermissions(user, permissions);
  };

  /**
   * Check if user has a specific role
   * @param {string} role - Role to check
   * @returns {boolean}
   */
  const userHasRole = (role) => {
    return hasRole(user, role);
  };

  /**
   * Check if user has any of the specified roles
   * @param {string[]} roles - Array of roles
   * @returns {boolean}
   */
  const userHasAnyRole = (roles) => {
    return hasAnyRole(user, roles);
  };

  /**
   * Check if user is an approved photographer
   * @returns {boolean}
   */
  const userIsApprovedPhotographer = () => {
    return checkIsApprovedPhotographer(user);
  };

  /**
   * Get photographer status
   * @returns {string|null} - 'pending' | 'approved' | 'rejected' | 'suspended' | null
   */
  const userPhotographerStatus = () => {
    return checkPhotographerStatus(user);
  };

  /**
   * Check if user can upload photos (photographer + approved)
   * @returns {boolean}
   */
  const userCanUploadPhotos = () => {
    return checkCanUploadPhotos(user);
  };

  /**
   * Get all user capabilities
   * @returns {Object}
   */
  const getCapabilities = () => {
    return getUserCapabilities(user);
  };

  const value = {
    // State
    user,
    isAuthenticated,
    loading,

    // Actions
    login,
    register,
    logout,
    updateUser,
    refreshAbilities,

    // Permission Helpers
    hasPermission: userHasPermission,
    hasAnyPermission: userHasAnyPermission,
    hasAllPermissions: userHasAllPermissions,

    // Role Helpers
    hasRole: userHasRole,
    hasAnyRole: userHasAnyRole,

    // Photographer Helpers
    isApprovedPhotographer: userIsApprovedPhotographer,
    getPhotographerStatus: userPhotographerStatus,
    canUploadPhotos: userCanUploadPhotos,

    // Capabilities
    getCapabilities,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
