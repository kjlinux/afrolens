// Services pour les photographes utilisant l'API générée
import {
  PhotographerAnalyticsService,
  PhotographerDashboardService,
  PhotographerPhotosService,
  PhotographerRevenueService,
  PhotographerWithdrawalsService,
  Photo,
} from '@/api';

// =====================
// Analytics Service
// =====================

/**
 * Récupérer les analytics du photographe
 * @param period - Période d'analyse (7d, 30d, 90d, 1y, all)
 * @returns Promise<any>
 */
export const getAnalytics = async (period: string = '30d'): Promise<any> => {
  try {
    const response = await PhotographerAnalyticsService.d3Be8C9A74026E1Ac4Ed00D5E95({
      period,
    });

    if (response.success) {
      return response.data;
    }

    throw new Error('Erreur lors de la récupération des analytics');
  } catch (error: any) {
    console.error('Erreur lors de la récupération des analytics:', error);
    throw new Error(
      error.body?.message || 'Impossible de récupérer les analytics'
    );
  }
};

// =====================
// Dashboard Service
// =====================

/**
 * Récupérer les statistiques du tableau de bord
 * @returns Promise<any>
 */
export const getDashboardStats = async (): Promise<any> => {
  try {
    const response = await PhotographerDashboardService.a4Abd0D0Bebc11C4C2Eea8C1Eec();

    if (response.success) {
      return response.data;
    }

    throw new Error('Erreur lors de la récupération des stats');
  } catch (error: any) {
    console.error('Erreur lors de la récupération des stats:', error);
    throw new Error(
      error.body?.message || 'Impossible de récupérer les statistiques'
    );
  }
};

// =====================
// Photos Service
// =====================

/**
 * Récupérer toutes les photos du photographe
 * @param perPage - Nombre de photos par page
 * @param page - Numéro de page
 * @returns Promise<any>
 */
export const getPhotographerPhotos = async (
  perPage: number = 20,
  page: number = 1
): Promise<any> => {
  try {
    const response = await PhotographerPhotosService.c12Eb02A76D6C3B06935Ea55Cf8(
      perPage,
      page
    );

    return {
      data: response.data || [],
      meta: response.meta,
      links: response.links,
    };
  } catch (error: any) {
    console.error('Erreur lors de la récupération des photos:', error);
    throw new Error(
      error.body?.message || 'Impossible de récupérer les photos'
    );
  }
};

/**
 * Upload une nouvelle photo
 * @param formData - FormData contenant les informations de la photo
 * @returns Promise<Photo>
 */
export const uploadPhoto = async (photoData: {
  title: string;
  description?: string;
  category_id: string;
  tags: string[];
  price_standard: number;
  price_extended?: number;
  image: File;
}): Promise<Photo> => {
  try {
    const response = await PhotographerPhotosService.fdd5Dccf66Edc8Cd12F2F1962C8({
      title: photoData.title,
      description: photoData.description,
      category_id: photoData.category_id,
      tags: photoData.tags,
      price_standard: photoData.price_standard,
      price_extended: photoData.price_extended,
      image: photoData.image,
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Erreur lors de l\'upload de la photo');
  } catch (error: any) {
    console.error('Erreur lors de l\'upload de la photo:', error);
    throw new Error(
      error.body?.message || 'Impossible d\'uploader la photo'
    );
  }
};

/**
 * Mettre à jour une photo
 * @param photoId - ID de la photo
 * @param data - Données à mettre à jour
 * @returns Promise<Photo>
 */
export const updatePhoto = async (
  photoId: string,
  data: {
    title?: string;
    description?: string;
    category_id?: string;
    tags?: string[];
    price_standard?: number;
    price_extended?: number;
    is_public?: boolean;
  }
): Promise<Photo> => {
  try {
    const response = await PhotographerPhotosService.c5E45A2D1F082Aa86Fa4B3Cee36Ec8(
      photoId,
      data
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Erreur lors de la mise à jour de la photo');
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de la photo:', error);
    throw new Error(
      error.body?.message || 'Impossible de mettre à jour la photo'
    );
  }
};

/**
 * Supprimer une photo
 * @param photoId - ID de la photo
 * @returns Promise<boolean>
 */
export const deletePhoto = async (photoId: string): Promise<boolean> => {
  try {
    const response = await PhotographerPhotosService.e45Dae8C47Dfa4Ca3Dd6D87C49Ab(
      photoId
    );

    return response.success || false;
  } catch (error: any) {
    console.error('Erreur lors de la suppression de la photo:', error);
    throw new Error(
      error.body?.message || 'Impossible de supprimer la photo'
    );
  }
};

/**
 * Récupérer les statistiques d'une photo
 * @param photoId - ID de la photo
 * @returns Promise<any>
 */
export const getPhotoStats = async (photoId: string): Promise<any> => {
  try {
    const response = await PhotographerPhotosService.e7Fe4Ffc84Cb90Cba926B7D32C5E83(
      photoId
    );

    if (response.success) {
      return response.data;
    }

    throw new Error('Erreur lors de la récupération des stats');
  } catch (error: any) {
    console.error('Erreur lors de la récupération des stats:', error);
    throw new Error(
      error.body?.message || 'Impossible de récupérer les statistiques de la photo'
    );
  }
};

// =====================
// Revenue Service
// =====================

/**
 * Récupérer l'historique des revenus
 * @param period - Période (7d, 30d, 90d, 1y, all)
 * @returns Promise<any>
 */
export const getRevenueHistory = async (period: string = '30d'): Promise<any> => {
  try {
    const response = await PhotographerRevenueService.d83E7Bb55605Af16Ca8Eb88E33D({
      period,
    });

    if (response.success) {
      return response.data;
    }

    throw new Error('Erreur lors de la récupération des revenus');
  } catch (error: any) {
    console.error('Erreur lors de la récupération des revenus:', error);
    throw new Error(
      error.body?.message || 'Impossible de récupérer l\'historique des revenus'
    );
  }
};

/**
 * Récupérer le résumé des revenus
 * @returns Promise<any>
 */
export const getRevenueSummary = async (): Promise<any> => {
  try {
    const response = await PhotographerRevenueService.d6Bc3A14Bbf8Ea8A39074Bc2C8D();

    if (response.success) {
      return response.data;
    }

    throw new Error('Erreur lors de la récupération du résumé');
  } catch (error: any) {
    console.error('Erreur lors de la récupération du résumé:', error);
    throw new Error(
      error.body?.message || 'Impossible de récupérer le résumé des revenus'
    );
  }
};

/**
 * Récupérer l'historique des ventes
 * @param perPage - Nombre d'éléments par page
 * @returns Promise<any>
 */
export const getSalesHistory = async (perPage: number = 20): Promise<any> => {
  try {
    const response = await PhotographerRevenueService.be19Dcab8D8Ab0E0974Ad6C4F7F(
      perPage
    );

    return {
      data: response.data || [],
      meta: response.meta,
      links: response.links,
    };
  } catch (error: any) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    throw new Error(
      error.body?.message || 'Impossible de récupérer l\'historique des ventes'
    );
  }
};

// =====================
// Withdrawals Service
// =====================

/**
 * Récupérer toutes les demandes de retrait
 * @param perPage - Nombre d'éléments par page
 * @returns Promise<any>
 */
export const getWithdrawals = async (perPage: number = 20): Promise<any> => {
  try {
    const response = await PhotographerWithdrawalsService.e5C4A3Afb5B479Fc2Ea5D08Aa8F(
      perPage
    );

    return {
      data: response.data || [],
      meta: response.meta,
      links: response.links,
    };
  } catch (error: any) {
    console.error('Erreur lors de la récupération des retraits:', error);
    throw new Error(
      error.body?.message || 'Impossible de récupérer les demandes de retrait'
    );
  }
};

/**
 * Créer une nouvelle demande de retrait
 * @param data - Données de la demande
 * @returns Promise<any>
 */
export const createWithdrawal = async (data: {
  amount: number;
  payment_method: 'mobile_money' | 'bank_transfer';
  payment_details: {
    phone?: string;
    operator?: string;
    account_number?: string;
    account_name?: string;
    bank_name?: string;
  };
}): Promise<any> => {
  try {
    const response = await PhotographerWithdrawalsService.f37D653B2E10A4C8A0A09Dac3Aa(
      data
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Erreur lors de la création de la demande');
  } catch (error: any) {
    console.error('Erreur lors de la création de la demande de retrait:', error);
    throw new Error(
      error.body?.message || 'Impossible de créer la demande de retrait'
    );
  }
};

/**
 * Annuler une demande de retrait
 * @param withdrawalId - ID de la demande
 * @returns Promise<boolean>
 */
export const cancelWithdrawal = async (withdrawalId: string): Promise<boolean> => {
  try {
    const response = await PhotographerWithdrawalsService.dd1D7C1A8Bacd81C3Cc8A01Cec2Aa(
      withdrawalId
    );

    return response.success || false;
  } catch (error: any) {
    console.error('Erreur lors de l\'annulation de la demande:', error);
    throw new Error(
      error.body?.message || 'Impossible d\'annuler la demande de retrait'
    );
  }
};

// Export default avec tous les services
export default {
  // Analytics
  getAnalytics,

  // Dashboard
  getDashboardStats,
  getStats: getDashboardStats, // Alias

  // Photos
  getPhotographerPhotos,
  uploadPhoto,
  updatePhoto,
  deletePhoto,
  getPhotoStats,

  // Revenue
  getRevenueHistory,
  getRevenueSummary,
  getSalesHistory,
  getRevenue: getRevenueHistory, // Alias

  // Withdrawals
  getWithdrawals,
  createWithdrawal,
  cancelWithdrawal,
};
