// Service de gestion du panier

import { delay } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';

const getCartFromStorage = () => {
  const cart = localStorage.getItem(STORAGE_KEYS.CART);
  return cart ? JSON.parse(cart) : [];
};

const saveCartToStorage = (cart) => {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
};

export const getCart = async () => {
  await delay(300);
  return getCartFromStorage();
};

export const addToCart = async (photo, licenseType = 'standard') => {
  await delay(400);

  const cart = getCartFromStorage();

  // Vérifier si déjà dans le panier
  const exists = cart.find(item => item.photo_id === photo.id && item.license_type === licenseType);
  if (exists) {
    throw new Error('Cette photo est déjà dans votre panier');
  }

  const price = licenseType === 'extended' ? photo.price_extended : photo.price_standard;

  const item = {
    id: `cart-${Date.now()}`,
    photo_id: photo.id,
    photo_title: photo.title,
    photo_preview: photo.preview_url,
    photographer_id: photo.photographer_id,
    license_type: licenseType,
    price,
    added_at: new Date().toISOString(),
  };

  cart.push(item);
  saveCartToStorage(cart);

  return cart;
};

export const removeFromCart = async (itemId) => {
  await delay(300);

  let cart = getCartFromStorage();
  cart = cart.filter(item => item.id !== itemId);
  saveCartToStorage(cart);

  return cart;
};

export const updateCartItem = async (itemId, updates) => {
  await delay(400);

  const cart = getCartFromStorage();
  const item = cart.find(i => i.id === itemId);
  if (item) {
    Object.assign(item, updates);
    saveCartToStorage(cart);
  }

  return cart;
};

export const clearCart = async () => {
  await delay(200);
  saveCartToStorage([]);
  return [];
};

export default { getCart, addToCart, removeFromCart, updateCartItem, clearCart };
