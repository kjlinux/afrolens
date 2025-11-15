// Point d'entrée centralisé pour tous les services de l'application
// Exporte tous les services avec une interface cohérente

// Configuration API
export * from '@/config/apiConfig';

// Services principaux
export * as authService from './authService';
export * as photoService from './photoService';
export * as cartService from './cartService';
export * as orderService from './orderService';
export * as userService from './userService';
export * as photographerService from './photographerService';
export * as favoritesService from './favoritesService';
export * as adminService from './adminService';

// Exports par défaut pour compatibilité
export { default as auth } from './authService';
export { default as photo } from './photoService';
export { default as cart } from './cartService';
export { default as order } from './orderService';
export { default as user } from './userService';
export { default as photographer } from './photographerService';

// Types et modèles de l'API générée
export type {
  User,
  Photo,
  Order,
  OrderItem,
  Category,
  PhotographerProfile,
} from '@/api';

// Réexporter OpenAPI et les erreurs pour un accès facile
export { OpenAPI, ApiError } from '@/api';
