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
 * Generate mock time series data for analytics
 */
const generateMockTimeSeriesData = (period: string, dataType: 'views' | 'sales' | 'revenue') => {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const data = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });

    let value = 0;
    if (dataType === 'views') {
      value = Math.floor(50 + Math.random() * 100);
    } else if (dataType === 'sales') {
      value = Math.floor(2 + Math.random() * 8);
    } else if (dataType === 'revenue') {
      value = Math.floor(1000 + Math.random() * 5000);
    }

    data.push({
      date: dateStr,
      value: value,
      [dataType]: value,
    });
  }

  return data;
};

/**
 * Récupérer les analytics du photographe
 * @param period - Période d'analyse (7d, 30d, 90d)
 * @returns Promise<any>
 */
export const getAnalytics = async (period: string = '30d'): Promise<any> => {
  try {
    // Map period format: '30d' -> '30days'
    const periodMap: Record<string, '7days' | '30days' | '90days'> = {
      '7d': '7days',
      '30d': '30days',
      '90d': '90days',
    };
    const apiPeriod = periodMap[period] || '30days';

    const [salesResponse, popularPhotosResponse] = await Promise.all([
      PhotographerAnalyticsService.getPhotographerAnalyticsSales(apiPeriod),
      PhotographerAnalyticsService.getPhotographerAnalyticsPopularPhotos().catch(() => ({ success: true, data: [] })),
    ]);

    if (salesResponse.success) {
      const salesData = salesResponse.data;
      const popularPhotos = popularPhotosResponse.data || [];

      // Calculate totals and averages
      const totalSales = salesData?.total_sales || 0;
      const totalRevenue = salesData?.total_revenue || 0;
      const avgSale = salesData?.average_sale || 0;

      // Generate mock data for charts (will be replaced when backend provides real data)
      const viewsOverTime = generateMockTimeSeriesData(period, 'views');
      const salesOverTime = generateMockTimeSeriesData(period, 'sales');
      const revenueOverTime = generateMockTimeSeriesData(period, 'revenue');

      // Transform API response to match expected Analytics component format
      return {
        overview: {
          totalViews: viewsOverTime.reduce((sum, item) => sum + item.value, 0),
          viewsChange: 12.5,
          totalDownloads: totalSales,
          downloadsChange: 8.3,
          conversionRate: totalSales > 0 ? 7.5 : 0,
          conversionChange: -2.1,
          avgPhotoPrice: avgSale,
          priceChange: 5.2,
        },
        topPhotos: popularPhotos.length > 0 ? popularPhotos.slice(0, 10).map((photo: any, index: number) => {
          const views = photo.view_count || 100;
          const sales = photo.order_items_count || 0;
          const downloads = sales;
          const conversionRate = views > 0 ? (sales / views) * 100 : 0;

          return {
            id: photo.id,
            title: photo.title,
            sales: sales,
            revenue: sales * (photo.price_standard || 0) * 0.8,
            views: views,
            downloads: downloads,
            conversionRate: conversionRate,
            thumbnail: photo.thumbnail_url,
            rank: index + 1,
          };
        }) : [],
        categoryPerformance: [],
        revenueByCategory: [],
        audienceInsights: {
          topCountries: [],
          deviceTypes: [],
          referralSources: [],
          topCustomers: [],
        },
        viewsOverTime: viewsOverTime,
        salesOverTime: salesOverTime,
        revenueOverTime: revenueOverTime,
        conversionOverTime: viewsOverTime.map((item, index) => ({
          date: item.date,
          conversion: salesOverTime[index] ? (salesOverTime[index].value / item.value) * 100 : 0,
        })),
        hourlyDistribution: Array.from({ length: 24 }, (_, i) => ({
          hour: `${i}h`,
          views: Math.floor(10 + Math.random() * 30),
          sales: Math.floor(Math.random() * 5),
        })),
      };
    }

    throw new Error('Erreur lors de la récupération des analytics');
  } catch (error: any) {
    console.error('Erreur lors de la récupération des analytics:', error);
    throw new Error(
      error.body?.message || 'Impossible de récupérer les analytics'
    );
  }
};

/**
 * Récupérer les photos populaires
 * @returns Promise<any>
 */
export const getPopularPhotos = async (): Promise<any> => {
  try {
    const response = await PhotographerAnalyticsService.getPhotographerAnalyticsPopularPhotos();

    if (response.success) {
      return response.data;
    }

    throw new Error('Erreur lors de la récupération des photos populaires');
  } catch (error: any) {
    console.error('Erreur lors de la récupération des photos populaires:', error);
    throw new Error(
      error.body?.message || 'Impossible de récupérer les photos populaires'
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
    const response = await PhotographerDashboardService.getPhotographerDashboard();

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

/**
 * Récupérer les statistiques du profil photographe
 * @returns Promise<any>
 */
export const getProfileStats = async (): Promise<any> => {
  try {
    const response = await PhotographerDashboardService.getPhotographerDashboardStats();

    if (response.success) {
      return response.data;
    }

    throw new Error('Erreur lors de la récupération des stats du profil');
  } catch (error: any) {
    console.error('Erreur lors de la récupération des stats du profil:', error);
    throw new Error(
      error.body?.message || 'Impossible de récupérer les statistiques du profil'
    );
  }
};

// =====================
// Photos Service
// =====================

/**
 * Récupérer toutes les photos du photographe
 * @param perPage - Nombre de photos par page
 * @returns Promise<any>
 */
export const getPhotographerPhotos = async (
  perPage: number = 20
): Promise<any> => {
  try {
    const response = await PhotographerPhotosService.getPhotographerPhotos(perPage);

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
 * Récupérer une photo spécifique
 * @param photoId - ID de la photo
 * @returns Promise<Photo>
 */
export const getPhoto = async (photoId: string): Promise<Photo> => {
  try {
    const response = await PhotographerPhotosService.getPhotographerPhoto(photoId);
    return response;
  } catch (error: any) {
    console.error('Erreur lors de la récupération de la photo:', error);
    throw new Error(
      error.body?.message || 'Impossible de récupérer la photo'
    );
  }
};

/**
 * Upload de nouvelles photos
 * @param formData - FormData contenant les informations des photos
 * @returns Promise<Photo[]>
 */
export const uploadPhotos = async (formData: {
  'photos[]'?: Array<Blob>;
  category_id: string;
  title: string;
  description?: string;
  tags?: string;
  price_standard: number;
  price_extended: number;
  location?: string;
}): Promise<Photo[]> => {
  try {
    const response = await PhotographerPhotosService.storePhotographerPhotos(formData);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Erreur lors de l\'upload des photos');
  } catch (error: any) {
    console.error('Erreur lors de l\'upload des photos:', error);
    throw new Error(
      error.body?.message || 'Impossible d\'uploader les photos'
    );
  }
};

/**
 * Upload une seule photo (alias pour uploadPhotos)
 * @param photoData - Données de la photo
 * @returns Promise<Photo>
 */
export const uploadPhoto = async (photoData: {
  title: string;
  description?: string;
  category_id: string;
  tags?: string | string[];
  price_standard: number;
  price_extended?: number;
  image: File;
  location?: string;
}): Promise<Photo> => {
  // Convert tags array to comma-separated string if needed
  const tagsString = Array.isArray(photoData.tags)
    ? photoData.tags.join(',')
    : photoData.tags;

  const formData = {
    'photos[]': [photoData.image],
    category_id: photoData.category_id,
    title: photoData.title,
    description: photoData.description,
    tags: tagsString,
    price_standard: photoData.price_standard,
    price_extended: photoData.price_extended || photoData.price_standard * 3,
    location: photoData.location,
  };

  const photos = await uploadPhotos(formData);
  return photos[0]; // Return first photo
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
    tags?: string;
    price_standard?: number;
    price_extended?: number;
    location?: string;
    is_public?: boolean;
  }
): Promise<Photo> => {
  try {
    const response = await PhotographerPhotosService.updatePhotographerPhotos(
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
    const response = await PhotographerPhotosService.deletePhotographerPhotos(photoId);
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
 * Note: This endpoint doesn't exist in the API yet, so we use the photo details
 * @param photoId - ID de la photo
 * @returns Promise<any>
 */
export const getPhotoStats = async (photoId: string): Promise<any> => {
  try {
    // The API doesn't have a dedicated stats endpoint, so we get the photo details
    const photo = await getPhoto(photoId);

    // Return stats from the photo object
    return {
      views: photo.view_count || 0,
      downloads: photo.download_count || 0,
      likes: photo.like_count || 0,
      sales: photo.order_items_count || 0,
      revenue: (photo.order_items_count || 0) * (photo.price_standard || 0) * 0.8, // 80% photographer share
    };
  } catch (error: any) {
    console.error('Erreur lors de la récupération des stats de la photo:', error);
    throw new Error(
      error.body?.message || 'Impossible de récupérer les statistiques de la photo'
    );
  }
};

// =====================
// Revenue Service
// =====================

/**
 * Récupérer tous les revenus
 * @returns Promise<any>
 */
export const getRevenue = async (): Promise<any> => {
  try {
    const response = await PhotographerRevenueService.getPhotographerRevenue();

    if (response.success) {
      return response.data;
    }

    throw new Error('Erreur lors de la récupération des revenus');
  } catch (error: any) {
    console.error('Erreur lors de la récupération des revenus:', error);
    throw new Error(
      error.body?.message || 'Impossible de récupérer les revenus'
    );
  }
};

/**
 * Récupérer le solde disponible
 * @returns Promise<any>
 */
export const getAvailableBalance = async (): Promise<any> => {
  try {
    const response = await PhotographerRevenueService.getPhotographerRevenueAvailable();

    if (response.success) {
      return response.data;
    }

    throw new Error('Erreur lors de la récupération du solde');
  } catch (error: any) {
    console.error('Erreur lors de la récupération du solde:', error);
    throw new Error(
      error.body?.message || 'Impossible de récupérer le solde disponible'
    );
  }
};

/**
 * Récupérer les revenus en attente
 * @returns Promise<any>
 */
export const getPendingRevenue = async (): Promise<any> => {
  try {
    const response = await PhotographerRevenueService.getPhotographerRevenuePending();

    if (response.success) {
      return response.data;
    }

    throw new Error('Erreur lors de la récupération des revenus en attente');
  } catch (error: any) {
    console.error('Erreur lors de la récupération des revenus en attente:', error);
    throw new Error(
      error.body?.message || 'Impossible de récupérer les revenus en attente'
    );
  }
};

/**
 * Récupérer l'historique des revenus
 * @returns Promise<any>
 */
export const getRevenueHistory = async (): Promise<any> => {
  try {
    const response = await PhotographerRevenueService.getPhotographerRevenueHistory();

    if (response.success) {
      return response.data;
    }

    throw new Error('Erreur lors de la récupération de l\'historique');
  } catch (error: any) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    throw new Error(
      error.body?.message || 'Impossible de récupérer l\'historique des revenus'
    );
  }
};

/**
 * Récupérer le résumé des revenus (alias pour getAvailableBalance)
 * @returns Promise<any>
 */
export const getRevenueSummary = async (): Promise<any> => {
  return getAvailableBalance();
};

/**
 * Récupérer l'historique des ventes (alias pour getRevenueHistory)
 * @returns Promise<any>
 */
export const getSalesHistory = async (): Promise<any> => {
  return getRevenueHistory();
};

// =====================
// Withdrawals Service
// =====================

/**
 * Récupérer toutes les demandes de retrait
 * @returns Promise<any>
 */
export const getWithdrawals = async (): Promise<any> => {
  try {
    const response = await PhotographerWithdrawalsService.getPhotographerWithdrawals();

    if (response.success) {
      return response.data;
    }

    throw new Error('Erreur lors de la récupération des retraits');
  } catch (error: any) {
    console.error('Erreur lors de la récupération des retraits:', error);
    throw new Error(
      error.body?.message || 'Impossible de récupérer les demandes de retrait'
    );
  }
};

/**
 * Récupérer une demande de retrait spécifique
 * @param withdrawalId - ID de la demande
 * @returns Promise<any>
 */
export const getWithdrawal = async (withdrawalId: string): Promise<any> => {
  try {
    const response = await PhotographerWithdrawalsService.getPhotographerWithdrawal(withdrawalId);

    if (response.success) {
      return response.data;
    }

    throw new Error('Erreur lors de la récupération de la demande');
  } catch (error: any) {
    console.error('Erreur lors de la récupération de la demande:', error);
    throw new Error(
      error.body?.message || 'Impossible de récupérer la demande de retrait'
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
  payment_details: Record<string, any>;
}): Promise<any> => {
  try {
    const response = await PhotographerWithdrawalsService.storePhotographerWithdrawals(data);

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
    const response = await PhotographerWithdrawalsService.deletePhotographerWithdrawals(withdrawalId);
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
  getPopularPhotos,

  // Dashboard
  getDashboardStats,
  getProfileStats,
  getStats: getDashboardStats, // Alias

  // Photos
  getPhotographerPhotos,
  getPhoto,
  uploadPhoto, // Single photo upload
  uploadPhotos, // Multiple photos upload
  updatePhoto,
  deletePhoto,
  getPhotoStats,

  // Revenue
  getRevenue,
  getAvailableBalance,
  getPendingRevenue,
  getRevenueHistory,
  getRevenueSummary,
  getSalesHistory,

  // Withdrawals
  getWithdrawals,
  getWithdrawal,
  createWithdrawal,
  cancelWithdrawal,
};
