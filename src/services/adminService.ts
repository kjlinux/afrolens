import {
  OpenAPI,
  AdminDashboardService,
  AdminPhotoModerationService,
  AdminPhotographersService,
  AdminUsersService,
  AdminWithdrawalsService,
  AdminAnalyticsService,
  PhotosService
} from '../api';

// ===========================
// ADMIN DASHBOARD
// ===========================

/**
 * Get admin dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    const response = await AdminDashboardService.getAdminDashboard();
    return response;
  } catch (error: any) {
    console.error('Error fetching admin dashboard:', error);
    throw new Error(error.body?.message || 'Impossible de charger le dashboard admin');
  }
};

// ===========================
// USER MANAGEMENT
// ===========================

/**
 * Get all users with pagination
 */
export const getUsers = async (page: number = 1, perPage: number = 20, filters?: any) => {
  try {
    const response = await AdminUsersService.getAdminUsers(
      filters?.role,
      filters?.status === 'active' ? true : filters?.status === 'banned' ? false : undefined,
      filters?.search,
      perPage
    );
    return response;
  } catch (error: any) {
    console.error('Error fetching users:', error);
    throw new Error(error.body?.message || 'Impossible de charger les utilisateurs');
  }
};

/**
 * Get a specific user
 */
export const getUser = async (userId: string) => {
  try {
    const response = await AdminUsersService.getAdminUser(userId);
    return response;
  } catch (error: any) {
    console.error('Error fetching user:', error);
    throw new Error(error.body?.message || 'Impossible de charger l\'utilisateur');
  }
};

/**
 * Update user
 */
export const updateUser = async (userId: string, data: any) => {
  try {
    // Note: There's no generic update method in the API,
    // we need to use specific methods like suspend/activate
    throw new Error('Use specific update methods like toggleUserBan');
  } catch (error: any) {
    console.error('Error updating user:', error);
    throw new Error(error.body?.message || 'Impossible de mettre à jour l\'utilisateur');
  }
};

/**
 * Delete user
 */
export const deleteUser = async (userId: string) => {
  try {
    const response = await AdminUsersService.deleteAdminUser(userId);
    return response;
  } catch (error: any) {
    console.error('Error deleting user:', error);
    throw new Error(error.body?.message || 'Impossible de supprimer l\'utilisateur');
  }
};

/**
 * Ban/unban user
 */
export const toggleUserBan = async (userId: string, isBanned: boolean) => {
  try {
    const response = isBanned
      ? await AdminUsersService.suspendAdminUser(userId)
      : await AdminUsersService.activateAdminUser(userId);
    return response;
  } catch (error: any) {
    console.error('Error toggling user ban:', error);
    throw new Error(error.body?.message || 'Impossible de modifier le statut de l\'utilisateur');
  }
};

// ===========================
// PHOTO MODERATION
// ===========================

/**
 * Get pending photos for moderation
 */
export const getPendingPhotos = async (page: number = 1, perPage: number = 20) => {
  try {
    const response = await AdminPhotoModerationService.getAdminPhotosPending(perPage, page);
    return response;
  } catch (error: any) {
    console.error('Error fetching pending photos:', error);
    throw new Error(error.body?.message || 'Impossible de charger les photos en attente');
  }
};

/**
 * Approve a photo
 */
export const approvePhoto = async (photoId: string) => {
  try {
    const response = await AdminPhotoModerationService.approveAdminPhoto(photoId);
    return response;
  } catch (error: any) {
    console.error('Error approving photo:', error);
    throw new Error(error.body?.message || 'Impossible d\'approuver la photo');
  }
};

/**
 * Reject a photo
 */
export const rejectPhoto = async (photoId: string, reason: string) => {
  try {
    const response = await AdminPhotoModerationService.rejectAdminPhoto(photoId, { rejection_reason: reason });
    return response;
  } catch (error: any) {
    console.error('Error rejecting photo:', error);
    throw new Error(error.body?.message || 'Impossible de rejeter la photo');
  }
};

/**
 * Delete a photo (admin)
 */
export const deletePhoto = async (photoId: string) => {
  try {
    const response = await AdminPhotoModerationService.deleteAdminPhoto(photoId);
    return response;
  } catch (error: any) {
    console.error('Error deleting photo:', error);
    throw new Error(error.body?.message || 'Impossible de supprimer la photo');
  }
};

// ===========================
// PHOTOGRAPHER APPLICATIONS
// ===========================

/**
 * Get pending photographer applications
 */
export const getPendingPhotographers = async () => {
  try {
    const response = await AdminPhotographersService.getPendingPhotographers();
    return response;
  } catch (error: any) {
    console.error('Error fetching pending photographers:', error);
    throw new Error(error.body?.message || 'Impossible de charger les demandes de photographes');
  }
};

/**
 * Approve photographer application
 */
export const approvePhotographer = async (userId: string) => {
  try {
    const response = await AdminPhotographersService.approvePhotographer(userId);
    return response;
  } catch (error: any) {
    console.error('Error approving photographer:', error);
    throw new Error(error.body?.message || 'Impossible d\'approuver le photographe');
  }
};

/**
 * Reject photographer application
 */
export const rejectPhotographer = async (userId: string, reason: string) => {
  try {
    const response = await AdminPhotographersService.rejectPhotographer(userId, { rejection_reason: reason });
    return response;
  } catch (error: any) {
    console.error('Error rejecting photographer:', error);
    throw new Error(error.body?.message || 'Impossible de rejeter la demande');
  }
};

// ===========================
// WITHDRAWAL MANAGEMENT
// ===========================

/**
 * Get all withdrawal requests
 */
export const getAllWithdrawals = async (status?: string) => {
  try {
    const response = await AdminWithdrawalsService.getAdminWithdrawals(
      status as 'pending' | 'approved' | 'rejected' | 'completed' | undefined
    );
    return response;
  } catch (error: any) {
    console.error('Error fetching withdrawals:', error);
    throw new Error(error.body?.message || 'Impossible de charger les retraits');
  }
};

/**
 * Approve withdrawal
 */
export const approveWithdrawal = async (withdrawalId: string, transactionRef?: string, notes?: string) => {
  try {
    const response = await AdminWithdrawalsService.approveAdminWithdrawal(withdrawalId, {
      transaction_reference: transactionRef,
      admin_notes: notes
    });
    return response;
  } catch (error: any) {
    console.error('Error approving withdrawal:', error);
    throw new Error(error.body?.message || 'Impossible d\'approuver le retrait');
  }
};

/**
 * Reject withdrawal
 */
export const rejectWithdrawal = async (withdrawalId: string, reason: string) => {
  try {
    const response = await AdminWithdrawalsService.rejectAdminWithdrawal(withdrawalId, { rejection_reason: reason });
    return response;
  } catch (error: any) {
    console.error('Error rejecting withdrawal:', error);
    throw new Error(error.body?.message || 'Impossible de rejeter le retrait');
  }
};

/**
 * Mark withdrawal as completed
 */
export const completeWithdrawal = async (withdrawalId: string, transactionRef: string) => {
  try {
    const response = await AdminWithdrawalsService.completeAdminWithdrawal(withdrawalId, { transaction_reference: transactionRef });
    return response;
  } catch (error: any) {
    console.error('Error completing withdrawal:', error);
    throw new Error(error.body?.message || 'Impossible de marquer le retrait comme complété');
  }
};

// ===========================
// ANALYTICS & REPORTS
// ===========================

/**
 * Get platform analytics
 */
export const getPlatformAnalytics = async (period: string = '30d') => {
  try {
    const response = await AdminAnalyticsService.getAnalytics({ period });
    return response;
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    throw new Error(error.body?.message || 'Impossible de charger les analytics');
  }
};

/**
 * Get revenue report
 */
export const getRevenueReport = async (startDate?: string, endDate?: string) => {
  try {
    const response = await AdminAnalyticsService.getRevenueReport({ start_date: startDate, end_date: endDate });
    return response;
  } catch (error: any) {
    console.error('Error fetching revenue report:', error);
    throw new Error(error.body?.message || 'Impossible de charger le rapport de revenus');
  }
};
