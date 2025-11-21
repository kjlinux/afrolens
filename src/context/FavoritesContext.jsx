import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FavoritesService } from '../api';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load favorites when user logs in
  const loadFavorites = useCallback(async () => {
    if (!user) {
      setFavorites(new Set());
      return;
    }

    setLoading(true);
    try {
      const response = await FavoritesService.getUserFavorites();
      if (response.success && response.data?.data) {
        const favoriteIds = new Set(response.data.data.map(photo => photo.id));
        setFavorites(favoriteIds);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Check if a photo is favorited
  const isFavorite = useCallback((photoId) => {
    return favorites.has(photoId);
  }, [favorites]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async (photoId) => {
    if (!user) return false;

    const wasFavorite = favorites.has(photoId);

    // Optimistic update
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (wasFavorite) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });

    try {
      if (wasFavorite) {
        await FavoritesService.deleteUserFavorites(photoId);
      } else {
        await FavoritesService.storeUserFavorites(photoId);
      }
      return !wasFavorite;
    } catch (error) {
      // Revert on error
      console.error('Error toggling favorite:', error);
      setFavorites(prev => {
        const newSet = new Set(prev);
        if (wasFavorite) {
          newSet.add(photoId);
        } else {
          newSet.delete(photoId);
        }
        return newSet;
      });
      throw error;
    }
  }, [user, favorites]);

  // Add to favorites
  const addFavorite = useCallback(async (photoId) => {
    if (!user || favorites.has(photoId)) return;

    setFavorites(prev => new Set(prev).add(photoId));

    try {
      await FavoritesService.storeUserFavorites(photoId);
    } catch (error) {
      console.error('Error adding favorite:', error);
      setFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(photoId);
        return newSet;
      });
      throw error;
    }
  }, [user, favorites]);

  // Remove from favorites
  const removeFavorite = useCallback(async (photoId) => {
    if (!user || !favorites.has(photoId)) return;

    setFavorites(prev => {
      const newSet = new Set(prev);
      newSet.delete(photoId);
      return newSet;
    });

    try {
      await FavoritesService.deleteUserFavorites(photoId);
    } catch (error) {
      console.error('Error removing favorite:', error);
      setFavorites(prev => new Set(prev).add(photoId));
      throw error;
    }
  }, [user, favorites]);

  const value = {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    refreshFavorites: loadFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

export default FavoritesContext;
