// Fichier principal qui exporte toutes les données mockées

// Import first to use in default export
import { categories, getCategoryById, getCategoryBySlug, getMainCategories, getSubCategories } from './categories';
import { allPhotos, getPhotoById, getPhotosByCategory, getPhotosByPhotographer, getFeaturedPhotos, getRecentPhotos, getPopularPhotos, searchPhotos } from './photos';
import { users, getUserById, getUserByEmail, getPhotographers, getApprovedPhotographers, getPendingPhotographers, getBuyers, authenticateUser } from './users';
import { orders, getOrderById, getOrdersByUser, getOrdersByStatus, getCompletedOrders, getTotalRevenue } from './orders';
import { notifications, getNotificationsByUser, getUnreadNotifications, getUnreadCount, markAsRead, markAllAsRead } from './notifications';

// Re-export everything
export { categories, getCategoryById, getCategoryBySlug, getMainCategories, getSubCategories };
export { allPhotos, allPhotos as photos, getPhotoById, getPhotosByCategory, getPhotosByPhotographer, getFeaturedPhotos, getRecentPhotos, getPopularPhotos, searchPhotos };
export { users, getUserById, getUserByEmail, getPhotographers, getApprovedPhotographers, getPendingPhotographers, getBuyers, authenticateUser };
export { orders, getOrderById, getOrdersByUser, getOrdersByStatus, getCompletedOrders, getTotalRevenue };
export { notifications, getNotificationsByUser, getUnreadNotifications, getUnreadCount, markAsRead, markAllAsRead };

// Export par défaut de toutes les données
export default {
  categories,
  photos: allPhotos,
  users,
  orders,
  notifications,
};
