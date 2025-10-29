// Fichier principal qui exporte toutes les données mockées

export { categories, getCategoryById, getCategoryBySlug, getMainCategories, getSubCategories } from './categories';

export {
  allPhotos as photos,
  getPhotoById,
  getPhotosByCategory,
  getPhotosByPhotographer,
  getFeaturedPhotos,
  getRecentPhotos,
  getPopularPhotos,
  searchPhotos
} from './photos';

export {
  users,
  getUserById,
  getUserByEmail,
  getPhotographers,
  getApprovedPhotographers,
  getPendingPhotographers,
  getBuyers,
  authenticateUser
} from './users';

export {
  orders,
  getOrderById,
  getOrdersByUser,
  getOrdersByStatus,
  getCompletedOrders,
  getTotalRevenue
} from './orders';

export {
  notifications,
  getNotificationsByUser,
  getUnreadNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead
} from './notifications';

// Export par défaut de toutes les données
export default {
  categories,
  photos,
  users,
  orders,
  notifications,
};
