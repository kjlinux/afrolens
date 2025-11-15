// Configuration de l'API OpenAPI
import { OpenAPI } from '@/api';
import { STORAGE_KEYS } from '@/utils/constants';

// Configuration de base de l'API
export const configureAPI = () => {
  // URL de base de l'API
  OpenAPI.BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Version de l'API
  OpenAPI.VERSION = '1.0.0';

  // Credentials
  OpenAPI.WITH_CREDENTIALS = true;
  OpenAPI.CREDENTIALS = 'include';

  // Configuration du token JWT
  OpenAPI.TOKEN = async () => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return token || undefined;
  };

  // Headers personnalisés (optionnel)
  OpenAPI.HEADERS = async () => {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
  };
};

// Fonction pour mettre à jour le token
export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }
};

// Fonction pour récupérer le token
export const getAuthToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

// Fonction pour supprimer le token
export const clearAuthToken = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
};

// Initialiser la configuration au démarrage
configureAPI();

export default {
  configureAPI,
  setAuthToken,
  getAuthToken,
  clearAuthToken,
};
