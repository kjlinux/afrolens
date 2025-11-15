import { OpenAPI, FavoritesService } from '../api';

/**
 * Get user's favorite photos
 */
export const getFavorites = async () => {
  try {
    const response = await FavoritesService.getUserFavorites();
    return response;
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    throw new Error(error.body?.message || 'Impossible de charger les favoris');
  }
};

/**
 * Add a photo to favorites
 */
export const addToFavorites = async (photoId: string) => {
  try {
    const response = await FavoritesService.addFavorite({ photo_id: photoId });
    return response;
  } catch (error: any) {
    console.error('Error adding to favorites:', error);
    throw new Error(error.body?.message || 'Impossible d\'ajouter aux favoris');
  }
};

/**
 * Remove a photo from favorites
 */
export const removeFromFavorites = async (photoId: string) => {
  try {
    const response = await FavoritesService.removeFavorite(photoId);
    return response;
  } catch (error: any) {
    console.error('Error removing from favorites:', error);
    throw new Error(error.body?.message || 'Impossible de retirer des favoris');
  }
};

/**
 * Check if a photo is in favorites
 */
export const isFavorite = async (photoId: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.some((fav: any) => fav.photo_id === photoId || fav.id === photoId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

/**
 * Toggle favorite status of a photo
 */
export const toggleFavorite = async (photoId: string, currentStatus: boolean) => {
  try {
    if (currentStatus) {
      await removeFromFavorites(photoId);
      return false;
    } else {
      await addToFavorites(photoId);
      return true;
    }
  } catch (error: any) {
    console.error('Error toggling favorite:', error);
    throw new Error(error.body?.message || 'Impossible de modifier les favoris');
  }
};
