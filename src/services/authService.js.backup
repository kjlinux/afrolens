// Service d'authentification (mocké)

import { authenticateUser, getUserByEmail, users } from '../data/mockData';
import { delay, generateId } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';

// Simule la génération d'un token JWT
const generateToken = (user) => {
  return `mock_token_${user.id}_${Date.now()}`;
};

/**
 * Connexion utilisateur
 * @param {string} email - Email
 * @param {string} password - Mot de passe
 * @param {boolean} rememberMe - Se souvenir de moi
 * @returns {Promise<object>} - { user, token }
 */
export const login = async (email, password, rememberMe = false) => {
  await delay(800); // Simule le délai réseau

  const user = authenticateUser(email, password);

  if (!user) {
    throw new Error('Email ou mot de passe incorrect');
  }

  // Générer token
  const token = generateToken(user);

  // Stocker dans localStorage
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  if (rememberMe) {
    localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
  }

  return { user, token };
};

/**
 * Inscription utilisateur
 * @param {object} data - Données d'inscription
 * @returns {Promise<object>} - { user, token }
 */
export const register = async (data) => {
  await delay(1000);

  // Vérifier si l'email existe déjà
  const existingUser = getUserByEmail(data.email);
  if (existingUser) {
    throw new Error('Cet email est déjà utilisé');
  }

  // Créer nouvel utilisateur
  const newUser = {
    id: generateId(),
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    avatar_url: `https://ui-avatars.com/api/?name=${data.first_name}+${data.last_name}&background=22c55e&color=fff`,
    phone: data.phone || '',
    bio: '',
    account_type: data.account_type,
    is_verified: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
  };

  // Si c'est un photographe, ajouter les champs supplémentaires
  if (data.account_type === 'photographer') {
    newUser.username = data.email.split('@')[0];
    newUser.display_name = `${data.first_name} ${data.last_name}`;
    newUser.status = 'pending';
    newUser.commission_rate = 0.20;
    newUser.total_sales = 0;
    newUser.total_revenue = 0.00;
    newUser.followers_count = 0;
  }

  // Ajouter à la liste mockée (en production ce serait sauvegardé en BDD)
  users.push(newUser);

  // Générer token
  const token = generateToken(newUser);

  // Stocker dans localStorage
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(newUser));

  return { user: newUser, token };
};

/**
 * Déconnexion
 * @returns {Promise<void>}
 */
export const logout = async () => {
  await delay(300);

  // Supprimer du localStorage
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);

  return true;
};

/**
 * Récupérer l'utilisateur actuellement connecté
 * @returns {object|null} - Utilisateur ou null
 */
export const getCurrentUser = () => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Vérifier si l'utilisateur est connecté
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return !!token;
};

/**
 * Rafraîchir le token
 * @returns {Promise<string>} - Nouveau token
 */
export const refreshToken = async () => {
  await delay(500);

  const user = getCurrentUser();
  if (!user) {
    throw new Error('Utilisateur non connecté');
  }

  const newToken = generateToken(user);
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);

  return newToken;
};

/**
 * Demander la réinitialisation du mot de passe
 * @param {string} email - Email
 * @returns {Promise<boolean>}
 */
export const forgotPassword = async (email) => {
  await delay(1000);

  const user = getUserByEmail(email);
  if (!user) {
    // En production, on ne révélerait pas si l'email existe ou non
    throw new Error('Email non trouvé');
  }

  // En production, un email serait envoyé
  console.log(`Email de réinitialisation envoyé à ${email}`);

  return true;
};

/**
 * Réinitialiser le mot de passe
 * @param {string} token - Token de réinitialisation
 * @param {string} newPassword - Nouveau mot de passe
 * @returns {Promise<boolean>}
 */
export const resetPassword = async (token, newPassword) => {
  await delay(1000);

  // En production, on vérifierait le token et on mettrait à jour le mot de passe
  console.log(`Mot de passe réinitialisé avec le token: ${token}`);

  return true;
};

/**
 * Changer le mot de passe
 * @param {string} currentPassword - Mot de passe actuel
 * @param {string} newPassword - Nouveau mot de passe
 * @returns {Promise<boolean>}
 */
export const changePassword = async (currentPassword, newPassword) => {
  await delay(800);

  const user = getCurrentUser();
  if (!user) {
    throw new Error('Utilisateur non connecté');
  }

  // En production, on vérifierait le mot de passe actuel et on mettrait à jour
  console.log(`Mot de passe changé pour l'utilisateur ${user.id}`);

  return true;
};

export default {
  login,
  register,
  logout,
  getCurrentUser,
  isAuthenticated,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
};
