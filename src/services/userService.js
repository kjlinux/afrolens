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

export default { getProfile, updateProfile, uploadAvatar };
