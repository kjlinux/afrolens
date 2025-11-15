// Service de gestion des photos utilisant l'API générée
import { PhotosService, Photo } from '@/api';

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
 * Note: Utilise le SearchService de l'API
 * @param query - Terme de recherche
 * @param filters - Filtres de recherche
 * @returns Promise<Photo[]>
 */
export const search = async (
  query: string,
  filters: any = {}
): Promise<Photo[]> => {
  // TODO: Implémenter avec SearchService quand disponible
  console.warn('search: Utiliser SearchService à la place');
  try {
    // Pour l'instant, retourner toutes les photos et filtrer côté client
    const response = await PhotosService.indexPhotos(100, 1);
    const photos = response.data || [];

    // Filtrage basique côté client
    return photos.filter((photo) =>
      photo.title?.toLowerCase().includes(query.toLowerCase()) ||
      photo.description?.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error: any) {
    console.error('Erreur lors de la recherche de photos:', error);
    return [];
  }
};

/**
 * Récupérer les photos par catégorie
 * Note: Cette fonctionnalité devrait utiliser le CategoriesService
 * @param categoryId - ID de la catégorie
 * @returns Promise<Photo[]>
 */
export const getByCategory = async (categoryId: string): Promise<Photo[]> => {
  // TODO: Utiliser CategoriesService.getCategoryPhotos quand disponible
  console.warn('getByCategory: Non implémenté dans l\'API actuelle');
  try {
    // Pour l'instant, récupérer toutes les photos et filtrer
    const response = await PhotosService.indexPhotos(100, 1);
    const photos = response.data || [];

    return photos.filter((photo) => photo.category_id === categoryId);
  } catch (error: any) {
    console.error('Erreur lors de la récupération des photos par catégorie:', error);
    return [];
  }
};

/**
 * Incrémenter le compteur de vues
 * Note: Cette fonctionnalité n'est pas disponible dans l'API générée
 * @param photoId - ID de la photo
 * @returns Promise<boolean>
 */
export const incrementViews = async (photoId: string): Promise<boolean> => {
  // TODO: Implémenter quand l'endpoint sera disponible
  console.warn('incrementViews: Endpoint non disponible dans l\'API');
  return true;
};

/**
 * Upload une photo (photographe)
 * Note: Utilise PhotographerPhotosService
 * @param formData - Données du formulaire
 * @returns Promise<Photo>
 */
export const uploadPhoto = async (formData: FormData): Promise<Photo> => {
  // TODO: Implémenter avec PhotographerPhotosService
  console.warn('uploadPhoto: Utiliser PhotographerPhotosService à la place');
  throw new Error('Utilisez PhotographerPhotosService.uploadPhoto');
};

/**
 * Mettre à jour une photo
 * Note: Utilise PhotographerPhotosService
 * @param id - ID de la photo
 * @param data - Données à mettre à jour
 * @returns Promise<Photo>
 */
export const updatePhoto = async (id: string, data: any): Promise<Photo> => {
  // TODO: Implémenter avec PhotographerPhotosService
  console.warn('updatePhoto: Utiliser PhotographerPhotosService à la place');
  throw new Error('Utilisez PhotographerPhotosService.updatePhoto');
};

/**
 * Supprimer une photo
 * Note: Utilise PhotographerPhotosService
 * @param id - ID de la photo
 * @returns Promise<boolean>
 */
export const deletePhoto = async (id: string): Promise<boolean> => {
  // TODO: Implémenter avec PhotographerPhotosService
  console.warn('deletePhoto: Utiliser PhotographerPhotosService à la place');
  throw new Error('Utilisez PhotographerPhotosService.deletePhoto');
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
