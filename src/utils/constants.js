// Constantes globales de l'application POUIRE

// Rôles utilisateurs
export const USER_ROLES = {
  BUYER: 'buyer',
  PHOTOGRAPHER: 'photographer',
  ADMIN: 'admin',
};

// Statuts des commandes
export const ORDER_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// Statuts des photos
export const PHOTO_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// Statuts des photographes
export const PHOTOGRAPHER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
};

// Types de licence
export const LICENSE_TYPES = {
  STANDARD: 'standard',
  EXTENDED: 'extended',
};

// Méthodes de paiement
export const PAYMENT_METHODS = {
  MOBILE_MONEY: 'mobile_money',
  CARD: 'card',
  PAYPAL: 'paypal',
};

// Providers de paiement
export const PAYMENT_PROVIDERS = {
  ORANGE_MONEY: 'orange_money',
  MOOV_MONEY: 'moov_money',
  TELECEL_MONEY: 'telecel_money',
  STRIPE: 'stripe',
  PAYPAL: 'paypal',
};

// Orientations des photos
export const PHOTO_ORIENTATIONS = {
  LANDSCAPE: 'landscape',
  PORTRAIT: 'portrait',
  SQUARE: 'square',
};

// Options de tri
export const SORT_OPTIONS = {
  POPULARITY: 'popularity',
  DATE: 'date',
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
};

// Types de notifications
export const NOTIFICATION_TYPES = {
  ORDER_COMPLETED: 'order_completed',
  NEW_PHOTO_FROM_FOLLOWED: 'new_photo_from_followed',
  FAVORITE_PHOTO_ON_SALE: 'favorite_photo_on_sale',
  NEW_SALE: 'new_sale',
  NEW_FOLLOWER: 'new_follower',
  PHOTO_APPROVED: 'photo_approved',
  PHOTO_REJECTED: 'photo_rejected',
  WITHDRAWAL_APPROVED: 'withdrawal_approved',
  WITHDRAWAL_REJECTED: 'withdrawal_rejected',
  MILESTONE_REACHED: 'milestone_reached',
  NEW_PHOTOGRAPHER_APPLICATION: 'new_photographer_application',
  PHOTO_TO_MODERATE: 'photo_to_moderate',
  NEW_WITHDRAWAL_REQUEST: 'new_withdrawal_request',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  APPLICATION_SUBMITTED: 'application_submitted',
};

// Types d'URL S3
export const S3_URL_TYPES = {
  PREVIEW: 'preview',
  THUMBNAIL: 'thumbnail',
  AVATAR: 'avatar',
};

// TTL (Time To Live) pour les URLs S3 signées (en minutes)
// Avec buffer de sécurité pour éviter les expirations
export const S3_URL_TTL = {
  PREVIEW: 50,        // 50 minutes (buffer de 10 min avant expiration à 60 min)
  THUMBNAIL: 50,      // 50 minutes (buffer de 10 min avant expiration à 60 min)
  AVATAR: 23 * 60,    // 23 heures (buffer de 1h avant expiration à 24h)
};

// Clés localStorage
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'pouire_auth_token',
  USER_DATA: 'pouire_user_data',
  CART: 'pouire_cart',
  FAVORITES: 'pouire_favorites',
  REMEMBER_ME: 'pouire_remember_me',
};

// Configuration
export const CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  API_TIMEOUT: 30000,
  ITEMS_PER_PAGE: 24,
  MAX_FILE_SIZE: 52428800, // 50MB en bytes
  ACCEPTED_IMAGE_FORMATS: ['image/jpeg', 'image/png', 'image/jpg'],
  COMMISSION_RATE: 0.20, // 20%
  MINIMUM_WITHDRAWAL: 50.00,
  SECURITY_HOLD_DAYS: 30,
  MAX_TAGS_PER_PHOTO: 20,
  MIN_TAGS_PER_PHOTO: 3,
};

// Messages d'erreur
export const ERROR_MESSAGES = {
  LOGIN_FAILED: 'Email ou mot de passe incorrect',
  NETWORK_ERROR: 'Erreur de connexion. Veuillez réessayer.',
  SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.',
  UNAUTHORIZED: 'Vous devez être connecté pour accéder à cette page',
  FORBIDDEN: 'Vous n\'avez pas les permissions nécessaires',
  NOT_FOUND: 'Ressource non trouvée',
  VALIDATION_ERROR: 'Veuillez vérifier les informations saisies',
  FILE_TOO_LARGE: 'Le fichier est trop volumineux (max 50MB)',
  INVALID_FILE_TYPE: 'Type de fichier non supporté',
};

// Messages de succès
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Connexion réussie',
  LOGOUT_SUCCESS: 'Déconnexion réussie',
  REGISTER_SUCCESS: 'Inscription réussie',
  PROFILE_UPDATED: 'Profil mis à jour avec succès',
  PHOTO_UPLOADED: 'Photo uploadée avec succès',
  PHOTO_UPDATED: 'Photo mise à jour avec succès',
  PHOTO_DELETED: 'Photo supprimée avec succès',
  ORDER_COMPLETED: 'Commande effectuée avec succès',
  ADDED_TO_CART: 'Ajouté au panier',
  REMOVED_FROM_CART: 'Retiré du panier',
  ADDED_TO_FAVORITES: 'Ajouté aux favoris',
  REMOVED_FROM_FAVORITES: 'Retiré des favoris',
  WITHDRAWAL_REQUESTED: 'Demande de retrait soumise',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  SEARCH: '/search',
  PHOTO_DETAIL: '/photo/:id',
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_CONFIRMATION: '/order/:id/confirmation',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  FAVORITES: '/favorites',
  FOLLOWING: '/following',
  FEED: '/feed',
  BECOME_PHOTOGRAPHER: '/become-photographer',
  PHOTOGRAPHER_PUBLIC_PROFILE: '/photographer/:username',

  // Routes Photographe
  PHOTOGRAPHER_DASHBOARD: '/photographer/dashboard',
  PHOTOGRAPHER_PHOTOS: '/photographer/photos',
  PHOTOGRAPHER_UPLOAD: '/photographer/upload',
  PHOTOGRAPHER_REVENUE: '/photographer/revenue',
  PHOTOGRAPHER_ANALYTICS: '/photographer/analytics',
  PHOTOGRAPHER_SETTINGS: '/photographer/settings',

  // Routes Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_PHOTOGRAPHERS_PENDING: '/admin/photographers/pending',
  ADMIN_MODERATION: '/admin/moderation',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_WITHDRAWALS: '/admin/withdrawals',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_REPORTS: '/admin/reports',
};

// Regex de validation
export const VALIDATION_REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_BF: /^\+226\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/,
  PHONE_CI: /^\+225\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/,
  PASSWORD: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
};

export default {
  USER_ROLES,
  ORDER_STATUS,
  PHOTO_STATUS,
  PHOTOGRAPHER_STATUS,
  LICENSE_TYPES,
  PAYMENT_METHODS,
  PAYMENT_PROVIDERS,
  PHOTO_ORIENTATIONS,
  SORT_OPTIONS,
  NOTIFICATION_TYPES,
  S3_URL_TYPES,
  S3_URL_TTL,
  STORAGE_KEYS,
  CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ROUTES,
  VALIDATION_REGEX,
};
