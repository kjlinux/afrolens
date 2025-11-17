// Service de gestion des utilisateurs

import { getUserById, users } from '../data/mockData';
import { delay } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';

export const getProfile = async (userId) => {
  await delay(400);
  const user = getUserById(userId);
  if (!user) throw new Error('Utilisateur non trouvé');
  return user;
};

export const updateProfile = async (userId, data) => {
  await delay(800);
  const user = getUserById(userId);
  if (!user) throw new Error('Utilisateur non trouvé');

  Object.assign(user, data, { updated_at: new Date().toISOString() });

  // Mettre à jour dans localStorage
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

  return user;
};

export const uploadAvatar = async (userId, file) => {
  await delay(1500);
  const user = getUserById(userId);
  if (!user) throw new Error('Utilisateur non trouvé');

  // Simuler l'URL de l'avatar
  user.avatar_url = URL.createObjectURL(file);
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

  return user;
};

// Alias pour compatibilité avec Profile.jsx
export const getUserProfile = async () => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  if (!userData) throw new Error('Utilisateur non connecté');

  const user = JSON.parse(userData);
  await delay(400);
  return user;
};

export const updateUserProfile = async (data) => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  if (!userData) throw new Error('Utilisateur non connecté');

  const user = JSON.parse(userData);
  await delay(800);

  Object.assign(user, data, { updated_at: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

  return user;
};

export const updateAvatar = async (file) => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  if (!userData) throw new Error('Utilisateur non connecté');

  const user = JSON.parse(userData);
  await delay(1500);

  user.avatar_url = URL.createObjectURL(file);
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

  return user;
};

export const changePassword = async (currentPassword, newPassword) => {
  await delay(800);
  // Simuler la vérification du mot de passe actuel
  if (!currentPassword || !newPassword) {
    throw new Error('Tous les champs sont requis');
  }

  if (newPassword.length < 8) {
    throw new Error('Le nouveau mot de passe doit contenir au moins 8 caractères');
  }

  return { success: true, message: 'Mot de passe modifié avec succès' };
};

export default { getProfile, updateProfile, uploadAvatar, getUserProfile, updateUserProfile, updateAvatar, changePassword };
