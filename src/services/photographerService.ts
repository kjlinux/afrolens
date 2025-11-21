// Services pour les photographes utilisant l'API générée
import {
  PhotographerAnalyticsService,
  PhotographerDashboardService,
  PhotographerPhotosService,
  PhotographerRevenueService,
  PhotographerWithdrawalsService,
  Photo,
} from '@/api';

// Type for transaction data
interface Transaction {
  id: string;
  type: 'sale';
  description: string;
  date: string;
  net: number;
  gross: number;
  commission: number;
  status: 'completed' | 'pending';
  photoId?: string;
  thumbnail?: string;
  licenseType?: string;
  orderNumber?: string;
}

// =====================
// Analytics Service
// =====================

/**
 * Récupérer les analytics du photographe
 * Utilise les vrais endpoints API pour récupérer les données
 * @param period - Période d'analyse (7d, 30d, 90d)
 * @returns Promise<any>
 */
export const getAnalytics = async (period: string = '30d'): Promise<any> => {
  try {
    // Map period format for sales endpoint: '30d' -> '30days'
    const salesPeriodMap: Record<string, '7days' | '30days' | '90days'> = {
      '7d': '7days',
      '30d': '30days',
      '90d': '90days',
    };
    const apiSalesPeriod = salesPeriodMap[period] || '30days';

    // Map period format for time series endpoints: '30d' -> '30d'
    const timeSeriesPeriod = period as '7d' | '30d' | '90d';

    // Fetch all analytics data in parallel
    const [
      salesResponse,
      popularPhotosResponse,
      viewsOverTimeResponse,
      salesOverTimeResponse,
      revenueOverTimeResponse,
      conversionOverTimeResponse,
      hourlyDistributionResponse,
      categoryPerformanceResponse,
    ] = await Promise.all([
      PhotographerAnalyticsService.getPhotographerAnalyticsSales(apiSalesPeriod),
      PhotographerAnalyticsService.getPhotographerAnalyticsPopularPhotos().catch(() => ({ success: true, data: [] })),
      PhotographerAnalyticsService.getPhotographerViewsOverTime(timeSeriesPeriod).catch(() => ({ success: true, data: [], summary: {} })),
      PhotographerAnalyticsService.getPhotographerSalesOverTime(timeSeriesPeriod).catch(() => ({ success: true, data: [], summary: {} })),
      PhotographerAnalyticsService.getPhotographerRevenueOverTime(timeSeriesPeriod).catch(() => ({ success: true, data: [], summary: {} })),
      PhotographerAnalyticsService.getPhotographerConversionOverTime(timeSeriesPeriod).catch(() => ({ success: true, data: [], summary: {} })),
      PhotographerAnalyticsService.getPhotographerHourlyDistribution(timeSeriesPeriod, 'views').catch(() => ({ success: true, data: [], peak_hours: [], lowest_hours: [] })),
      PhotographerAnalyticsService.getPhotographerCategoryPerformance(timeSeriesPeriod).catch(() => ({ success: true, data: [], top_category: {} })),
    ]);

    const salesData = salesResponse.data;
    const popularPhotos = popularPhotosResponse.data || [];

    // Calculate totals from real data
    const totalSales = salesData?.total_sales || 0;
    const totalRevenue = salesData?.total_revenue || 0;
    const avgSale = salesData?.average_sale || 0;

    // Transform views over time data
    const viewsOverTime = (viewsOverTimeResponse.data || []).map((item: any) => ({
      date: item.date,
      value: item.views,
      views: item.views,
    }));

    // Transform sales over time data
    const salesOverTime = (salesOverTimeResponse.data || []).map((item: any) => ({
      date: item.date,
      value: item.sales,
      sales: item.sales,
    }));

    // Transform revenue over time data
    const revenueOverTime = (revenueOverTimeResponse.data || []).map((item: any) => ({
      date: item.date,
      value: item.revenue,
      revenue: item.revenue,
    }));

    // Transform conversion over time data
    const conversionOverTime = (conversionOverTimeResponse.data || []).map((item: any) => ({
      date: item.date,
      value: item.conversion_rate,
      conversion: item.conversion_rate,
    }));

    // Transform hourly distribution data
    const hourlyDistribution = (hourlyDistributionResponse.data || []).map((item: any) => ({
      hour: `${item.hour}h`,
      views: item.value,
      sales: 0, // Will need separate call for sales metric
    }));

    // Transform category performance data
    const categoryPerformance = (categoryPerformanceResponse.data || []).map((item: any) => ({
      category: item.category_name,
      categoryId: item.category_id,
      sales: item.total_sales,
      revenue: item.total_revenue,
      views: item.total_views,
      conversionRate: item.conversion_rate,
      avgPrice: item.average_price,
    }));

    // Calculate totals from time series data
    const totalViews = viewsOverTimeResponse.summary?.total_views ||
      viewsOverTime.reduce((sum: number, item: any) => sum + (item.value || 0), 0);
    const viewsChange = viewsOverTimeResponse.summary?.change_percentage || 0;
    const downloadsChange = salesOverTimeResponse.summary?.change_percentage || 0;
    const conversionChange = conversionOverTimeResponse.summary?.change_percentage || 0;
    const avgConversionRate = conversionOverTimeResponse.summary?.average_conversion_rate ||
      (totalViews > 0 ? (totalSales / totalViews) * 100 : 0);

    // Transform API response to match expected Analytics component format
    return {
      overview: {
        totalViews: totalViews,
        viewsChange: viewsChange,
        totalDownloads: totalSales,
        downloadsChange: downloadsChange,
        conversionRate: avgConversionRate,
        conversionChange: conversionChange,
        avgPhotoPrice: avgSale,
        priceChange: revenueOverTimeResponse.summary?.change_percentage || 0,
      },
      topPhotos: popularPhotos.length > 0 ? popularPhotos.slice(0, 10).map((photo: any, index: number) => {
        const views = photo.view_count || 0;
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
      categoryPerformance: categoryPerformance.map((cat: any) => ({
        name: cat.category,
        photos: cat.photos || 0,
        views: cat.views,
        sales: cat.sales,
        revenue: cat.revenue,
      })),
      revenueByCategory: categoryPerformance.map((cat: any) => ({
        name: cat.category,
        value: cat.revenue,
      })),
      viewsOverTime: viewsOverTime,
      salesOverTime: salesOverTime,
      revenueOverTime: revenueOverTime,
      conversionOverTime: conversionOverTime,
      hourlyDistribution: hourlyDistribution,
      // Additional metadata
      peakHours: hourlyDistributionResponse.peak_hours || [],
      lowestHours: hourlyDistributionResponse.lowest_hours || [],
      topCategory: categoryPerformanceResponse.top_category || {},
    };
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

    if (response.success && response.data) {
      const data = response.data;

      // Transform API response to match Dashboard component expectations
      const totalEarnings = data.revenue?.total_earnings || 0;
      // Calculate total revenue (before 20% commission): netRevenue = 80% of totalRevenue
      // So totalRevenue = netRevenue / 0.8
      const totalRevenue = totalEarnings > 0 ? Math.round(totalEarnings / 0.8) : 0;

      return {
        // Photo stats
        totalPhotos: data.photos?.total || 0,
        publishedPhotos: data.photos?.approved || 0,
        pendingPhotos: data.photos?.pending || 0,
        rejectedPhotos: data.photos?.rejected || 0,
        totalViews: data.photos?.views || 0,

        // Revenue stats
        netRevenue: totalEarnings,
        totalRevenue: totalRevenue,
        availableBalance: data.revenue?.available || 0,
        pendingRevenue: data.revenue?.pending || 0,
        thisMonthRevenue: data.revenue?.this_month || 0,

        // Sales stats
        totalSales: data.sales?.total_sales || 0,
        totalDownloads: data.sales?.total_downloads || 0,
        thisMonthSales: data.sales?.this_month_sales || 0,

        // Likes (not provided by API, default to 0)
        totalLikes: 0,

        // Recent data
        recentSales: data.recent_sales || [],
        recentPhotos: data.recent_photos || [],
      };
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

    if (response.success && response.data?.data) {
      // Transform API response to match chart expectations
      // API returns: { month, total, sales }
      // Chart expects: { month, sales (gross), net }
      return response.data.data.map((item: any) => ({
        month: item.month,
        sales: Math.round((item.total || 0) / 0.8), // Convert net to gross (total is 80% of gross)
        net: item.total || 0,
      }));
    }

    return [];
  } catch (error: any) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    // Retourner un tableau vide en cas d'erreur pour ne pas bloquer la page
    return [];
  }
};

/**
 * Récupérer le résumé des revenus
 * @returns Promise<any>
 */
export const getRevenueSummary = async (): Promise<any> => {
  try {
    // Récupérer les données disponibles et en attente en parallèle
    const [availableResponse, pendingResponse] = await Promise.allSettled([
      PhotographerRevenueService.getPhotographerRevenueAvailable(),
      PhotographerRevenueService.getPhotographerRevenuePending(),
    ]);

    // Extraire le solde disponible
    let availableBalance = 0;
    if (availableResponse.status === 'fulfilled' && availableResponse.value.success) {
      availableBalance = availableResponse.value.data?.available_amount || 0;
    }

    // Calculer le solde en attente
    let pendingBalance = 0;
    if (pendingResponse.status === 'fulfilled' && pendingResponse.value.success) {
      const pendingData = pendingResponse.value.data;
      if (Array.isArray(pendingData)) {
        pendingBalance = pendingData.reduce((sum: number, item: any) => sum + (item.photographer_amount || 0), 0);
      }
    }

    // Calculer les totaux
    const totalSales = availableBalance + pendingBalance;
    const commission = totalSales * 0.15; // 15% commission
    const netRevenue = totalSales - commission;

    return {
      availableBalance,
      pendingBalance,
      totalSales,
      commission,
      netRevenue,
      totalWithdrawn: 0, // TODO: Récupérer depuis l'API des retraits
      nextPayoutDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Prochaine semaine
    };
  } catch (error: any) {
    console.error('Erreur lors de la récupération du résumé des revenus:', error);
    // Retourner des valeurs par défaut en cas d'erreur
    return {
      availableBalance: 0,
      pendingBalance: 0,
      totalSales: 0,
      commission: 0,
      netRevenue: 0,
      totalWithdrawn: 0,
      nextPayoutDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }
};

/**
 * Récupérer l'historique des ventes (transactions récentes détaillées)
 * @param perPage - Nombre de transactions par page
 * @param status - Filtrer par statut
 * @returns Promise<Transaction[]>
 */
export const getSalesHistory = async (
  perPage: number = 15,
  status?: 'completed' | 'pending'
): Promise<Transaction[]> => {
  try {
    const response = await PhotographerRevenueService.getPhotographerRevenueTransactions(
      perPage,
      status
    );

    if (response.success && response.data?.data) {
      // Transform API response to match component expectations
      return response.data.data.map((item: any) => ({
        id: item.id,
        type: 'sale' as const,
        description: item.description || 'Vente de photo',
        date: item.date,
        net: item.amount || 0,
        gross: item.gross_amount || 0,
        commission: item.commission || 0,
        status: item.status || 'completed',
        photoId: item.photo_id,
        thumbnail: item.photo_thumbnail,
        licenseType: item.license_type,
        orderNumber: item.order_number,
      }));
    }

    return [];
  } catch (error: any) {
    console.error('Erreur lors de la récupération des transactions:', error);
    // Retourner un tableau vide en cas d'erreur pour ne pas bloquer la page
    return [];
  }
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

    if (response.success && response.data?.data) {
      // Transform API response to match component expectations
      return response.data.data.map((withdrawal: any) => {
        // Extract account number from payment_details
        let accountNumber = 'N/A';
        if (withdrawal.payment_details) {
          accountNumber = withdrawal.payment_details.phone_number ||
                         withdrawal.payment_details.account_number ||
                         withdrawal.payment_details.iban ||
                         'N/A';
        }

        // Map payment_method to display name
        const methodNames: Record<string, string> = {
          'mobile_money': 'Mobile Money',
          'orange_money': 'Orange Money',
          'moov_money': 'Moov Money',
          'telecel_money': 'Telecel Money',
          'bank_transfer': 'Virement bancaire',
        };

        return {
          id: withdrawal.id,
          amount: withdrawal.amount,
          method: methodNames[withdrawal.payment_method] || withdrawal.payment_method,
          accountNumber: accountNumber,
          date: withdrawal.created_at,
          status: withdrawal.status,
          processedDate: withdrawal.processed_at,
        };
      });
    }

    return [];
  } catch (error: any) {
    console.error('Erreur lors de la récupération des retraits:', error);
    // Retourner un tableau vide en cas d'erreur pour ne pas bloquer la page
    return [];
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
