/**
 * Permissions Constants
 *
 * These permissions must match exactly with the backend permissions
 * defined in RolePermissionSeeder.php
 */

// ============================================
// PERMISSIONS CONSTANTS
// ============================================

export const PERMISSIONS = {
  // Photo Management
  UPLOAD_PHOTOS: 'upload-photos',
  EDIT_OWN_PHOTOS: 'edit-own-photos',
  DELETE_OWN_PHOTOS: 'delete-own-photos',
  VIEW_ALL_PHOTOS: 'view-all-photos',
  MODERATE_PHOTOS: 'moderate-photos',
  APPROVE_PHOTOS: 'approve-photos',
  REJECT_PHOTOS: 'reject-photos',
  FEATURE_PHOTOS: 'feature-photos',
  DELETE_ANY_PHOTO: 'delete-any-photo',

  // Revenue & Withdrawals
  VIEW_OWN_REVENUE: 'view-own-revenue',
  VIEW_ALL_REVENUE: 'view-all-revenue',
  REQUEST_WITHDRAWALS: 'request-withdrawals',
  APPROVE_WITHDRAWALS: 'approve-withdrawals',
  REJECT_WITHDRAWALS: 'reject-withdrawals',
  COMPLETE_WITHDRAWALS: 'complete-withdrawals',

  // User Management
  VIEW_USERS: 'view-users',
  EDIT_USERS: 'edit-users',
  SUSPEND_USERS: 'suspend-users',
  ACTIVATE_USERS: 'activate-users',
  DELETE_USERS: 'delete-users',

  // Photographer Management
  VIEW_PHOTOGRAPHERS: 'view-photographers',
  APPROVE_PHOTOGRAPHERS: 'approve-photographers',
  REJECT_PHOTOGRAPHERS: 'reject-photographers',
  SUSPEND_PHOTOGRAPHERS: 'suspend-photographers',
  ACTIVATE_PHOTOGRAPHERS: 'activate-photographers',

  // Analytics
  VIEW_OWN_ANALYTICS: 'view-own-analytics',
  VIEW_PLATFORM_ANALYTICS: 'view-platform-analytics',

  // Orders
  VIEW_OWN_ORDERS: 'view-own-orders',
  VIEW_ALL_ORDERS: 'view-all-orders',
  MANAGE_ORDERS: 'manage-orders',

  // Categories
  MANAGE_CATEGORIES: 'manage-categories',

  // System
  MANAGE_FEATURED_CONTENT: 'manage-featured-content',
  VIEW_DASHBOARD: 'view-dashboard',
};

// ============================================
// PERMISSION GROUPS (for easier management)
// ============================================

export const PERMISSION_GROUPS = {
  PHOTO_BASIC: [
    PERMISSIONS.UPLOAD_PHOTOS,
    PERMISSIONS.EDIT_OWN_PHOTOS,
    PERMISSIONS.DELETE_OWN_PHOTOS,
  ],

  PHOTO_MODERATION: [
    PERMISSIONS.VIEW_ALL_PHOTOS,
    PERMISSIONS.MODERATE_PHOTOS,
    PERMISSIONS.APPROVE_PHOTOS,
    PERMISSIONS.REJECT_PHOTOS,
  ],

  PHOTO_ADMIN: [
    PERMISSIONS.FEATURE_PHOTOS,
    PERMISSIONS.DELETE_ANY_PHOTO,
  ],

  REVENUE_PHOTOGRAPHER: [
    PERMISSIONS.VIEW_OWN_REVENUE,
    PERMISSIONS.REQUEST_WITHDRAWALS,
  ],

  REVENUE_ADMIN: [
    PERMISSIONS.VIEW_ALL_REVENUE,
    PERMISSIONS.APPROVE_WITHDRAWALS,
    PERMISSIONS.REJECT_WITHDRAWALS,
    PERMISSIONS.COMPLETE_WITHDRAWALS,
  ],

  USER_MANAGEMENT: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.EDIT_USERS,
    PERMISSIONS.SUSPEND_USERS,
    PERMISSIONS.ACTIVATE_USERS,
    PERMISSIONS.DELETE_USERS,
  ],

  PHOTOGRAPHER_MANAGEMENT: [
    PERMISSIONS.VIEW_PHOTOGRAPHERS,
    PERMISSIONS.APPROVE_PHOTOGRAPHERS,
    PERMISSIONS.REJECT_PHOTOGRAPHERS,
    PERMISSIONS.SUSPEND_PHOTOGRAPHERS,
    PERMISSIONS.ACTIVATE_PHOTOGRAPHERS,
  ],

  ANALYTICS: [
    PERMISSIONS.VIEW_OWN_ANALYTICS,
    PERMISSIONS.VIEW_PLATFORM_ANALYTICS,
  ],

  ORDERS: [
    PERMISSIONS.VIEW_OWN_ORDERS,
    PERMISSIONS.VIEW_ALL_ORDERS,
    PERMISSIONS.MANAGE_ORDERS,
  ],
};

// ============================================
// ROLES CONSTANTS (matching backend)
// ============================================

export const ROLES = {
  BUYER: 'buyer',
  PHOTOGRAPHER: 'photographer',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
};

// ============================================
// PHOTOGRAPHER STATUS (matching backend)
// ============================================

export const PHOTOGRAPHER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if a user has a specific permission
 * @param {Object} user - User object with permissions array
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export const hasPermission = (user, permission) => {
  if (!user || !user.permissions) return false;
  return user.permissions.includes(permission);
};

/**
 * Check if a user has any of the specified permissions
 * @param {Object} user - User object with permissions array
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean}
 */
export const hasAnyPermission = (user, permissions) => {
  if (!user || !user.permissions || !Array.isArray(permissions)) return false;
  return permissions.some(permission => user.permissions.includes(permission));
};

/**
 * Check if a user has all of the specified permissions
 * @param {Object} user - User object with permissions array
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean}
 */
export const hasAllPermissions = (user, permissions) => {
  if (!user || !user.permissions || !Array.isArray(permissions)) return false;
  return permissions.every(permission => user.permissions.includes(permission));
};

/**
 * Check if a user has a specific role
 * @param {Object} user - User object with roles array
 * @param {string} role - Role to check
 * @returns {boolean}
 */
export const hasRole = (user, role) => {
  if (!user) return false;

  // Check roles array (new system)
  if (user.roles && Array.isArray(user.roles)) {
    return user.roles.includes(role);
  }

  // Fallback to account_type (backward compatibility)
  return user.account_type === role;
};

/**
 * Check if a user has any of the specified roles
 * @param {Object} user - User object with roles array
 * @param {string[]} roles - Array of roles to check
 * @returns {boolean}
 */
export const hasAnyRole = (user, roles) => {
  if (!user || !Array.isArray(roles)) return false;
  return roles.some(role => hasRole(user, role));
};

/**
 * Check if user is an approved photographer
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isApprovedPhotographer = (user) => {
  if (!user) return false;
  return user.is_approved_photographer === true;
};

/**
 * Get photographer status
 * @param {Object} user - User object
 * @returns {string|null}
 */
export const getPhotographerStatus = (user) => {
  if (!user) return null;
  return user.photographer_status || null;
};

/**
 * Check if user can upload photos (photographer + approved)
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const canUploadPhotos = (user) => {
  return hasPermission(user, PERMISSIONS.UPLOAD_PHOTOS) && isApprovedPhotographer(user);
};

/**
 * Check if user can moderate content
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const canModerate = (user) => {
  return hasPermission(user, PERMISSIONS.MODERATE_PHOTOS);
};

/**
 * Check if user can manage users
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const canManageUsers = (user) => {
  return hasAnyPermission(user, PERMISSION_GROUPS.USER_MANAGEMENT);
};

/**
 * Check if user can approve withdrawals
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const canApproveWithdrawals = (user) => {
  return hasPermission(user, PERMISSIONS.APPROVE_WITHDRAWALS);
};

/**
 * Check if user can view platform analytics
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const canViewPlatformAnalytics = (user) => {
  return hasPermission(user, PERMISSIONS.VIEW_PLATFORM_ANALYTICS);
};

/**
 * Get user capabilities (convenience flags)
 * @param {Object} user - User object
 * @returns {Object}
 */
export const getUserCapabilities = (user) => {
  return {
    canUploadPhotos: canUploadPhotos(user),
    canModerate: canModerate(user),
    canManageUsers: canManageUsers(user),
    canApproveWithdrawals: canApproveWithdrawals(user),
    canViewPlatformAnalytics: canViewPlatformAnalytics(user),
    isApprovedPhotographer: isApprovedPhotographer(user),
  };
};

export default PERMISSIONS;
