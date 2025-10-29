// Service de gestion des photos (mocké)

import {
  allPhotos,
  getPhotoById,
  getPhotosByCategory,
  getFeaturedPhotos,
  getRecentPhotos,
  getPopularPhotos,
  searchPhotos,
} from '../data/mockData';
import { delay, generateId } from '../utils/helpers';

/**
 * Récupérer toutes les photos
 * @param {number} page - Page
 * @param {number} limit - Limite par page
 * @returns {Promise<object>} - { data, total, page, pages }
 */
export const getPhotos = async (page = 1, limit = 24) => {
  await delay(600);

  const start = (page - 1) * limit;
  const end = start + limit;
  const data = allPhotos.slice(start, end);
  const total = allPhotos.length;
  const pages = Math.ceil(total / limit);

  return { data, total, page, pages };
};

/**
 * Récupérer une photo par ID
 * @param {string} id - ID de la photo
 * @returns {Promise<object>} - Photo
 */
export const getPhoto = async (id) => {
  await delay(400);

  const photo = getPhotoById(id);
  if (!photo) {
    throw new Error('Photo non trouvée');
  }

  return photo;
};

/**
 * Rechercher des photos
 * @param {string} query - Recherche
 * @param {object} filters - Filtres
 * @returns {Promise<Array>} - Photos trouvées
 */
export const search = async (query, filters = {}) => {
  await delay(700);

  const results = searchPhotos(query, filters);
  return results;
};

/**
 * Récupérer les photos mises en avant
 * @returns {Promise<Array>} - Photos featured
 */
export const getFeatured = async () => {
  await delay(500);
  return getFeaturedPhotos();
};

/**
 * Récupérer les photos récentes
 * @param {number} limit - Limite
 * @returns {Promise<Array>} - Photos récentes
 */
export const getRecent = async (limit = 24) => {
  await delay(500);
  return getRecentPhotos(limit);
};

/**
 * Récupérer les photos populaires
 * @param {number} limit - Limite
 * @returns {Promise<Array>} - Photos populaires
 */
export const getPopular = async (limit = 24) => {
  await delay(500);
  return getPopularPhotos(limit);
};

/**
 * Récupérer les photos d'une catégorie
 * @param {string} categoryId - ID catégorie
 * @returns {Promise<Array>} - Photos
 */
export const getByCategory = async (categoryId) => {
  await delay(600);
  return getPhotosByCategory(categoryId);
};

/**
 * Récupérer les photos similaires
 * @param {string} photoId - ID photo
 * @returns {Promise<Array>} - Photos similaires
 */
export const getSimilar = async (photoId) => {
  await delay(500);

  const photo = getPhotoById(photoId);
  if (!photo) return [];

  // Récupérer photos de la même catégorie
  const similar = getPhotosByCategory(photo.category_id)
    .filter(p => p.id !== photoId)
    .slice(0, 6);

  return similar;
};

/**
 * Incrémenter le compteur de vues
 * @param {string} photoId - ID photo
 * @returns {Promise<boolean>}
 */
export const incrementViews = async (photoId) => {
  await delay(200);

  const photo = getPhotoById(photoId);
  if (photo) {
    photo.views_count += 1;
  }

  return true;
};

/**
 * Upload une photo (photographe)
 * @param {FormData} formData - Données du formulaire
 * @returns {Promise<object>} - Photo créée
 */
export const uploadPhoto = async (formData) => {
  await delay(2000); // Simule upload + traitement

  const newPhoto = {
    id: `photo-${generateId()}`,
    photographer_id: formData.get('photographer_id'),
    category_id: formData.get('category_id'),
    title: formData.get('title'),
    description: formData.get('description'),
    tags: JSON.parse(formData.get('tags') || '[]'),
    original_url: '/images/uploaded_photo.jpg', // Simul é
    preview_url: '/images/uploaded_photo.jpg',
    thumbnail_url: '/images/uploaded_photo.jpg',
    width: 1080,
    height: 720,
    file_size: Math.floor(Math.random() * 5000000),
    format: 'jpg',
    color_palette: ['#000000', '#FFFFFF'],
    price_standard: parseFloat(formData.get('price_standard')),
    price_extended: parseFloat(formData.get('price_extended') || 0),
    views_count: 0,
    downloads_count: 0,
    favorites_count: 0,
    sales_count: 0,
    is_public: false,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  allPhotos.push(newPhoto);

  return newPhoto;
};

/**
 * Mettre à jour une photo
 * @param {string} id - ID photo
 * @param {object} data - Nouvelles données
 * @returns {Promise<object>} - Photo mise à jour
 */
export const updatePhoto = async (id, data) => {
  await delay(800);

  const photo = getPhotoById(id);
  if (!photo) {
    throw new Error('Photo non trouvée');
  }

  Object.assign(photo, data, { updated_at: new Date().toISOString() });

  return photo;
};

/**
 * Supprimer une photo
 * @param {string} id - ID photo
 * @returns {Promise<boolean>}
 */
export const deletePhoto = async (id) => {
  await delay(600);

  const index = allPhotos.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Photo non trouvée');
  }

  allPhotos.splice(index, 1);

  return true;
};

export default {
  getPhotos,
  getPhoto,
  search,
  getFeatured,
  getRecent,
  getPopular,
  getByCategory,
  getSimilar,
  incrementViews,
  uploadPhoto,
  updatePhoto,
  deletePhoto,
};
