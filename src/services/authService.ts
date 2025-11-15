// Service d'authentification utilisant l'API générée
import { AuthenticationService, User } from '@/api';
import { setAuthToken, clearAuthToken } from '@/config/apiConfig';
import { STORAGE_KEYS } from '@/utils/constants';

/**
 * Type pour la réponse de login/register
 */
interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Connexion utilisateur
 * @param email - Email de l'utilisateur
 * @param password - Mot de passe
 * @param rememberMe - Se souvenir de moi
 * @returns Promise<AuthResponse>
 */
export const login = async (
  email: string,
  password: string,
  rememberMe: boolean = false
): Promise<AuthResponse> => {
  try {
    const response = await AuthenticationService.login({
      email,
      password,
      remember_me: rememberMe,
    });

    if (response.success && response.data) {
      const { user, access_token } = response.data;

      if (user && access_token) {
        // Stocker le token et les données utilisateur
        setAuthToken(access_token);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

        if (rememberMe) {
          localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
        }

        return { user, token: access_token };
      }
    }

    throw new Error('Réponse invalide du serveur');
  } catch (error: any) {
    console.error('Erreur de connexion:', error);
    throw new Error(error.body?.message || 'Email ou mot de passe incorrect');
  }
};

/**
 * Inscription utilisateur
 * @param data - Données d'inscription
 * @returns Promise<AuthResponse>
 */
export const register = async (data: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  account_type: 'buyer' | 'photographer';
  phone?: string | null;
}): Promise<AuthResponse> => {
  try {
    const response = await AuthenticationService.register(data);

    if (response.success && response.data) {
      const { user, access_token } = response.data;

      if (user && access_token) {
        // Stocker le token et les données utilisateur
        setAuthToken(access_token);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

        return { user, token: access_token };
      }
    }

    throw new Error('Réponse invalide du serveur');
  } catch (error: any) {
    console.error('Erreur d\'inscription:', error);
    throw new Error(error.body?.message || 'Erreur lors de l\'inscription');
  }
};

/**
 * Déconnexion
 * @returns Promise<boolean>
 */
export const logout = async (): Promise<boolean> => {
  try {
    await AuthenticationService.logout();

    // Supprimer le token et les données utilisateur
    clearAuthToken();
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);

    return true;
  } catch (error: any) {
    console.error('Erreur de déconnexion:', error);
    // Même en cas d'erreur, on nettoie les données locales
    clearAuthToken();
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
    return true;
  }
};

/**
 * Récupérer l'utilisateur actuellement connecté depuis le serveur
 * @returns Promise<User | null>
 */
export const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await AuthenticationService.me();

    if (response.success && response.data) {
      // Mettre à jour les données utilisateur dans le localStorage
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data));
      return response.data;
    }

    return null;
  } catch (error: any) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    // Si non authentifié, nettoyer les données locales
    if (error.status === 401) {
      clearAuthToken();
    }
    return null;
  }
};

/**
 * Récupérer l'utilisateur depuis le localStorage (synchrone)
 * @returns User | null
 */
export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Vérifier si l'utilisateur est connecté
 * @returns boolean
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return !!token;
};

/**
 * Rafraîchir le token JWT
 * @returns Promise<string>
 */
export const refreshToken = async (): Promise<string> => {
  try {
    const response = await AuthenticationService.refreshToken();

    if (response.success && response.data?.access_token) {
      const newToken = response.data.access_token;
      setAuthToken(newToken);
      return newToken;
    }

    throw new Error('Token invalide');
  } catch (error: any) {
    console.error('Erreur lors du rafraîchissement du token:', error);
    // Si le token ne peut pas être rafraîchi, déconnecter l'utilisateur
    clearAuthToken();
    throw new Error('Session expirée, veuillez vous reconnecter');
  }
};

/**
 * Demander la réinitialisation du mot de passe
 * Note: Cette fonctionnalité n'est pas encore implémentée dans l'API générée
 * @param email - Email
 * @returns Promise<boolean>
 */
export const forgotPassword = async (email: string): Promise<boolean> => {
  // TODO: Implémenter quand l'endpoint sera disponible dans l'API
  console.warn('forgotPassword: Endpoint non disponible dans l\'API');
  throw new Error('Fonctionnalité non disponible pour le moment');
};

/**
 * Réinitialiser le mot de passe
 * Note: Cette fonctionnalité n'est pas encore implémentée dans l'API générée
 * @param token - Token de réinitialisation
 * @param newPassword - Nouveau mot de passe
 * @returns Promise<boolean>
 */
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<boolean> => {
  // TODO: Implémenter quand l'endpoint sera disponible dans l'API
  console.warn('resetPassword: Endpoint non disponible dans l\'API');
  throw new Error('Fonctionnalité non disponible pour le moment');
};

/**
 * Changer le mot de passe
 * Note: Cette fonctionnalité n'est pas encore implémentée dans l'API générée
 * @param currentPassword - Mot de passe actuel
 * @param newPassword - Nouveau mot de passe
 * @returns Promise<boolean>
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<boolean> => {
  // TODO: Implémenter quand l'endpoint sera disponible dans l'API
  console.warn('changePassword: Endpoint non disponible dans l\'API');
  throw new Error('Fonctionnalité non disponible pour le moment');
};

export default {
  login,
  register,
  logout,
  getCurrentUser,
  fetchCurrentUser,
  isAuthenticated,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
};
