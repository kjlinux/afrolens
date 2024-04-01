// Services pour les photographes utilisant l'API générée
import {
  PhotographerAnalyticsService,
  PhotographerDashboardService,
  PhotographerPhotosService,
  PhotographerRevenueService,
  PhotographerWithdrawalsService,
  Photo,
} from '@/api';
import { STORAGE_KEYS } from '@/utils/constants';

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
      hourlyViewsDistributionResponse,
      hourlySalesDistributionResponse,
      categoryPerformanceResponse,
    ] = await Promise.all([
      PhotographerAnalyticsService.getPhotographerAnalyticsSales(apiSalesPeriod),
      PhotographerAnalyticsService.getPhotographerAnalyticsPopularPhotos().catch(() => ({ success: true, data: [] })),
      PhotographerAnalyticsService.getPhotographerViewsOverTime(timeSeriesPeriod).catch(() => ({ success: true, data: [], summary: {} })),
      PhotographerAnalyticsService.getPhotographerSalesOverTime(timeSeriesPeriod).catch(() => ({ success: true, data: [], summary: {} })),
      PhotographerAnalyticsService.getPhotographerRevenueOverTime(timeSeriesPeriod).catch(() => ({ success: true, data: [], summary: {} })),
      PhotographerAnalyticsService.getPhotographerConversionOverTime(timeSeriesPeriod).catch(() => ({ success: true, data: [], summary: {} })),
      PhotographerAnalyticsService.getPhotographerHourlyDistribution(timeSeriesPeriod, 'views').catch(() => ({ success: true, data: [], peak_hours: [], lowest_hours: [] })),
      PhotographerAnalyticsService.getPhotographerHourlyDistribution(timeSeriesPeriod, 'sales').catch(() => ({ success: true, data: [], peak_hours: [], lowest_hours: [] })),
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

    // Transform hourly distribution data - combine views and sales
    const hourlyViewsData = hourlyViewsDistributionResponse.data || [];
    const hourlySalesData = hourlySalesDistributionResponse.data || [];

    // Create a map for quick lookup of sales by hour
    const salesByHour = new Map(hourlySalesData.map((item: any) => [item.hour, item.value]));

    const hourlyDistribution = hourlyViewsData.map((item: any) => ({
      hour: `${item.hour}h`,
      views: item.value,
      sales: salesByHour.get(item.hour) || 0,
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
      peakHours: hourlyViewsDistributionResponse.peak_hours || [],
      lowestHours: hourlyViewsDistributionResponse.lowest_hours || [],
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

  // Build FormData manually to ensure proper file handling
  const formData = new FormData();
  formData.append('photos[]', photoData.image);
  formData.append('category_id', photoData.category_id);
  formData.append('title', photoData.title);
  if (photoData.description) {
    formData.append('description', photoData.description);
  }
  if (tagsString) {
    formData.append('tags', tagsString);
  }
  formData.append('price_standard', String(photoData.price_standard));
  formData.append('price_extended', String(photoData.price_extended || photoData.price_standard * 3));
  if (photoData.location) {
    formData.append('location', photoData.location);
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/photographer/photos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`,
        'Accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de l\'upload');
    }

    const result = await response.json();
    if (result.success && result.data) {
      return result.data[0];
    }
    throw new Error('Erreur lors de l\'upload des photos');
  } catch (error: any) {
    console.error('Erreur lors de l\'upload de la photo:', error);
    throw new Error(error.message || 'Impossible d\'uploader la photo');
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
      // API returns: { month: "2025-09-01T00:00:00.000000Z", total, sales }
      // Chart expects: { month: "Sep 2025", sales (gross), net }
      return response.data.data.map((item: any) => {
        // Format month from ISO date to readable format
        const date = new Date(item.month);
        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        const formattedMonth = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

        // total is already the net revenue (after commission)
        const net = item.total || 0;
        // Calculate gross: net = 80% of gross, so gross = net / 0.8
        const gross = net > 0 ? Math.round(net / 0.8) : 0;

        return {
          month: formattedMonth,
          sales: gross,
          net: net,
        };
      }).reverse(); // Reverse to show oldest to newest for chart
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
    // Récupérer les données disponibles, en attente et les retraits en parallèle
    const [availableResponse, pendingResponse, withdrawalsResponse] = await Promise.allSettled([
      PhotographerRevenueService.getPhotographerRevenueAvailable(),
      PhotographerRevenueService.getPhotographerRevenuePending(),
      PhotographerWithdrawalsService.getPhotographerWithdrawals(),
    ]);

    // Extraire le solde disponible (c'est déjà le montant net après commission)
    let availableBalance = 0;
    if (availableResponse.status === 'fulfilled' && availableResponse.value.success) {
      // available_amount est une string, il faut la convertir en nombre
      const amount = availableResponse.value.data?.available_amount;
      availableBalance = typeof amount === 'string' ? parseFloat(amount) : (amount || 0);
    }

    // Calculer le solde en attente (montant net)
    let pendingBalance = 0;
    if (pendingResponse.status === 'fulfilled' && pendingResponse.value.success) {
      const pendingData = pendingResponse.value.data;
      if (Array.isArray(pendingData)) {
        pendingBalance = pendingData.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
      }
    }

    // Calculer le total retiré depuis les retraits complétés
    let totalWithdrawn = 0;
    if (withdrawalsResponse.status === 'fulfilled' && withdrawalsResponse.value.success) {
      const withdrawalsData = withdrawalsResponse.value.data?.data || [];
      totalWithdrawn = withdrawalsData
        .filter((w: any) => w.status === 'completed')
        .reduce((sum: number, w: any) => sum + (w.amount || 0), 0);
    }

    // Les montants disponibles et en attente sont déjà nets (après 20% commission)
    // netRevenue = availableBalance + pendingBalance + totalWithdrawn
    const netRevenue = availableBalance + pendingBalance + totalWithdrawn;

    // Pour calculer les ventes brutes: netRevenue = 80% de totalSales
    // donc totalSales = netRevenue / 0.8
    const totalSales = netRevenue > 0 ? Math.round(netRevenue / 0.8) : 0;
    const commission = totalSales - netRevenue;

    return {
      availableBalance,
      pendingBalance,
      totalSales,
      commission,
      netRevenue,
      totalWithdrawn,
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
        // Parse payment_details if it's a JSON string
        let paymentDetails = withdrawal.payment_details;
        if (typeof paymentDetails === 'string') {
          try {
            paymentDetails = JSON.parse(paymentDetails);
          } catch {
            paymentDetails = {};
          }
        }

        // Extract account info from payment_details
        let accountNumber = 'N/A';
        let operatorName = '';
        if (paymentDetails) {
          accountNumber = paymentDetails.phone ||
                         paymentDetails.phone_number ||
                         paymentDetails.account_number ||
                         paymentDetails.iban ||
                         'N/A';
          operatorName = paymentDetails.operator_name || '';
        }

        // Use operator_name from payment_details if available, otherwise map payment_method
        const methodNames: Record<string, string> = {
          'mobile_money': 'Mobile Money',
          'orange_money': 'Orange Money',
          'moov_money': 'Moov Money',
          'telecel_money': 'Telecel Money',
          'bank_transfer': 'Virement bancaire',
        };

        const displayMethod = operatorName || methodNames[withdrawal.payment_method] || withdrawal.payment_method;

        return {
          id: withdrawal.id,
          amount: withdrawal.amount,
          method: displayMethod,
          accountNumber: accountNumber,
          accountName: paymentDetails?.account_name || '',
          date: withdrawal.created_at,
          status: withdrawal.status,
          processedDate: withdrawal.processed_at,
          rejectionReason: withdrawal.rejection_reason,
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
