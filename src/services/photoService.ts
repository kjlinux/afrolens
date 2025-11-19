// Service de gestion des photos utilisant l'API générée
import { PhotosService, SearchService, Photo } from '@/api';

/**
 * Interface pour les résultats paginés
 */
interface PaginatedPhotosResult {
  data: Photo[];
  total: number;
  page: number;
  pages: number;
}

/**
 * Récupérer toutes les photos avec pagination
 * @param page - Numéro de page
 * @param limit - Nombre de photos par page
 * @returns Promise<PaginatedPhotosResult>
 */
export const getPhotos = async (
  page: number = 1,
  limit: number = 24
): Promise<PaginatedPhotosResult> => {
  try {
    const response = await PhotosService.indexPhotos(limit, page);

    return {
      data: response.data || [],
      total: response.meta?.total || 0,
      page: response.meta?.current_page || page,
      pages: response.meta?.last_page || 1,
    };
  } catch (error: any) {
    console.error('Erreur lors de la récupération des photos:', error);
    throw new Error(error.body?.message || 'Erreur lors de la récupération des photos');
  }
};

/**
 * Récupérer une photo par son ID
 * @param id - ID de la photo
 * @returns Promise<Photo>
 */
export const getPhoto = async (id: string): Promise<Photo> => {
  try {
    const response = await PhotosService.showPhoto(id);

    if (!response.data) {
      throw new Error('Photo non trouvée');
    }

    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération de la photo:', error);
    throw new Error(error.body?.message || 'Photo non trouvée');
  }
};

/**
 * Récupérer les photos mises en avant
 * @param limit - Nombre de photos à récupérer
 * @returns Promise<Photo[]>
 */
export const getFeatured = async (limit: number = 10): Promise<Photo[]> => {
  try {
    const response = await PhotosService.featuredPhotos(limit);
    return response.data || [];
  } catch (error: any) {
    console.error('Erreur lors de la récupération des photos featured:', error);
    return [];
  }
};

/**
 * Récupérer les photos récentes
 * @param limit - Nombre de photos à récupérer
 * @returns Promise<Photo[]>
 */
export const getRecent = async (limit: number = 24): Promise<Photo[]> => {
  try {
    const response = await PhotosService.recentPhotos(limit);
    return response.data || [];
  } catch (error: any) {
    console.error('Erreur lors de la récupération des photos récentes:', error);
    return [];
  }
};

/**
 * Récupérer les photos populaires
 * @param limit - Nombre de photos à récupérer
 * @returns Promise<Photo[]>
 */
export const getPopular = async (limit: number = 24): Promise<Photo[]> => {
  try {
    const response = await PhotosService.popularPhotos(limit);
    return response.data || [];
  } catch (error: any) {
    console.error('Erreur lors de la récupération des photos populaires:', error);
    return [];
  }
};

/**
 * Récupérer les photos similaires
 * @param photoId - ID de la photo de référence
 * @param limit - Nombre de photos similaires à récupérer
 * @returns Promise<Photo[]>
 */
export const getSimilar = async (
  photoId: string,
  limit: number = 6
): Promise<Photo[]> => {
  try {
    const response = await PhotosService.similarPhotos(photoId, limit);
    return response.data || [];
  } catch (error: any) {
    console.error('Erreur lors de la récupération des photos similaires:', error);
    return [];
  }
};

/**
 * Rechercher des photos
 * Utilise le SearchService de l'API avec filtres avancés
 * @param query - Terme de recherche
 * @param filters - Filtres de recherche (categories, photographerId, minPrice, maxPrice, orientation, sortBy)
 * @returns Promise<Photo[]>
 */
export const search = async (
  query: string = '',
  filters: {
    categories?: string[];
    photographerId?: string;
    minPrice?: number;
    maxPrice?: number;
    orientation?: 'landscape' | 'portrait' | 'square';
    sortBy?: 'date' | 'popularity' | 'price_asc' | 'price_desc';
    perPage?: number;
  } = {}
): Promise<Photo[]> => {
  try {
    const response = await SearchService.searchPhotos(
      query || undefined,
      filters.categories,
      filters.photographerId,
      filters.minPrice,
      filters.maxPrice,
      filters.orientation,
      filters.sortBy || 'date',
      filters.perPage || 100
    );
    return response.data || [];
  } catch (error: any) {
    console.error('Erreur lors de la recherche de photos:', error);
    return [];
  }
};

/**
 * Récupérer les photos par catégorie
 * Utilise le SearchService avec filtre de catégorie
 * @param categoryId - ID de la catégorie
 * @param limit - Nombre de photos à récupérer
 * @returns Promise<Photo[]>
 */
export const getByCategory = async (
  categoryId: string,
  limit: number = 100
): Promise<Photo[]> => {
  try {
    const response = await SearchService.searchPhotos(
      undefined,
      [categoryId],
      undefined,
      undefined,
      undefined,
      undefined,
      'date',
      limit
    );
    return response.data || [];
  } catch (error: any) {
    console.error('Erreur lors de la récupération des photos par catégorie:', error);
    return [];
  }
};

/**
 * Incrémenter le compteur de vues
 * Note: Cette fonctionnalité nécessite l'implémentation de l'endpoint backend
 * POST /api/photos/{id}/view
 * @param photoId - ID de la photo
 * @returns Promise<boolean>
 */
export const incrementViews = async (photoId: string): Promise<boolean> => {
  // TODO BACKEND: Implémenter l'endpoint POST /api/photos/{id}/view
  // Voir ENDPOINTS_MANQUANTS.md pour plus de détails
  console.warn('incrementViews: Endpoint POST /api/photos/{id}/view non implémenté');
  return true;
};

/**
 * Upload une photo (photographe)
 * DEPRECATED: Utiliser directement PhotographerPhotosService.uploadPhoto
 * @param formData - Données du formulaire
 * @returns Promise<Photo>
 * @deprecated Utiliser PhotographerPhotosService.uploadPhoto
 */
export const uploadPhoto = async (formData: FormData): Promise<Photo> => {
  throw new Error('DEPRECATED: Utilisez PhotographerPhotosService.uploadPhoto à la place');
};

/**
 * Mettre à jour une photo
 * DEPRECATED: Utiliser directement PhotographerPhotosService.updatePhoto
 * @param id - ID de la photo
 * @param data - Données à mettre à jour
 * @returns Promise<Photo>
 * @deprecated Utiliser PhotographerPhotosService.updatePhoto
 */
export const updatePhoto = async (id: string, data: any): Promise<Photo> => {
  throw new Error('DEPRECATED: Utilisez PhotographerPhotosService.updatePhoto à la place');
};

/**
 * Supprimer une photo
 * DEPRECATED: Utiliser directement PhotographerPhotosService.deletePhoto
 * @param id - ID de la photo
 * @returns Promise<boolean>
 * @deprecated Utiliser PhotographerPhotosService.deletePhoto
 */
export const deletePhoto = async (id: string): Promise<boolean> => {
  throw new Error('DEPRECATED: Utilisez PhotographerPhotosService.deletePhoto à la place');
};

// Export alias pour la compatibilité
export const searchPhotos = search;

export default {
  getPhotos,
  getPhoto,
  search,
  searchPhotos,
  getFeatured,
  getRecent,
  getPopular,
  getByCategory,
  getSimilar,
  incrementViews,
  uploadPhoto,
  updatePhoto,
  deletePhoto,
};
