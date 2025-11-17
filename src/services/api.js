// Instance Axios configurée pour l'API

import axios from 'axios';
import { CONFIG, STORAGE_KEYS } from '../utils/constants';

// Créer l'instance Axios
const api = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs globalement
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gestion des erreurs
    if (error.response) {
      const { status, data } = error.response;

      // 401 - Non autorisé (token invalide ou expiré)
      if (status === 401) {
        // Déconnecter l'utilisateur
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);

        // Rediriger vers login si pas déjà sur la page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }

      // 403 - Accès interdit (permissions insuffisantes ou statut photographe)
      if (status === 403) {
        // Vérifier si l'erreur contient des informations sur le statut photographe
        if (data && data.photographer_status) {
          const photographerStatus = data.photographer_status;

          // Rediriger vers la page de statut appropriée
          switch (photographerStatus) {
            case 'pending':
              window.location.href = '/photographer/pending';
              break;
            case 'rejected':
              window.location.href = '/photographer/rejected';
              break;
            case 'suspended':
              window.location.href = '/photographer/suspended';
              break;
            default:
              window.location.href = '/forbidden';
          }
        } else {
          // Erreur 403 générique - permissions insuffisantes
          if (!window.location.pathname.includes('/forbidden')) {
            window.location.href = '/forbidden';
          }
        }
      }

      // 404 - Ressource non trouvée
      if (status === 404) {
        console.error('Ressource non trouvée:', error.config.url);
      }

      // 422 - Erreur de validation
      if (status === 422) {
        console.error('Erreur de validation:', data.errors || data.message);
      }

      // 500 - Erreur serveur
      if (status >= 500) {
        console.error('Erreur serveur:', data.message || 'Une erreur inattendue est survenue');
      }
    } else if (error.request) {
      // Erreur de requête (pas de réponse du serveur)
      console.error('Erreur réseau: Impossible de contacter le serveur');
      console.error('Détails:', error.request);
    } else {
      // Erreur lors de la configuration de la requête
      console.error('Erreur de configuration:', error.message);
    }

    return Promise.reject(error);
  }
);

// Photographer service
export const photographerService = {
  getAnalytics: async (photographerId, period = '30d') => {
    const response = await api.get(`/photographers/${photographerId}/analytics`, {
      params: { period }
    });
    return response.data;
  },
  getRevenue: async (photographerId, period = '30d') => {
    const response = await api.get(`/photographers/${photographerId}/revenue`, {
      params: { period }
    });
    return response.data;
  },
  getStats: async (photographerId) => {
    const response = await api.get(`/photographers/${photographerId}/stats`);
    return response.data;
  },
};

export default api;
