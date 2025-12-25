// Service de gestion du profil utilisateur utilisant l'API générée
import { UserProfileService, OpenAPI } from '@/api';
import axios from 'axios';

/**
 * Interface pour le profil photographe
 */
export interface PhotographerProfile {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  cover_photo_url?: string | null;
  location?: string | null;
  website?: string | null;
  instagram?: string | null;
  portfolio_url?: string | null;
  specialties?: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  commission_rate: string;
  total_sales: number;
  total_revenue: number;
  followers_count: number;
  rejection_reason?: string | null;
  approved_at?: string | null;
  approved_by?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Interface pour le profil utilisateur
 */
export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  account_type: 'buyer' | 'photographer' | 'admin';
  is_verified: boolean;
  is_active: boolean;
  email_verified_at?: string | null;
  last_login?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  photographer_profile?: PhotographerProfile | null;
}

/**
 * Interface pour mettre à jour le profil
 */
export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  phone?: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
}

/**
 * Interface pour changer le mot de passe
 */
export interface ChangePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

/**
 * Récupérer le profil de l'utilisateur connecté
 * @returns Promise<UserProfile>
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await UserProfileService.getUserProfile();

    if (response.success && response.data) {
      return response.data as UserProfile;
    }

    throw new Error('Erreur lors de la récupération du profil');
  } catch (error: any) {
    console.error('Erreur lors de la récupération du profil:', error);
    throw new Error(
      error.body?.message || 'Impossible de récupérer le profil'
    );
  }
};

/**
 * Mettre à jour le profil de l'utilisateur
 * @param data - Données à mettre à jour
 * @returns Promise<UserProfile>
 */
export const updateUserProfile = async (
  data: UpdateProfileData
): Promise<UserProfile> => {
  try {
    const response = await UserProfileService.updateUserProfile(data);

    if (response.success && response.data) {
      return response.data as UserProfile;
    }

    throw new Error('Erreur lors de la mise à jour du profil');
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    throw new Error(
      error.body?.message || 'Impossible de mettre à jour le profil'
    );
  }
};

/**
 * Mettre à jour l'avatar de l'utilisateur
 * @param avatarFile - Fichier image de l'avatar
 * @returns Promise<boolean>
 */
export const updateAvatar = async (avatarFile: File): Promise<boolean> => {
  try {
    // Use native FormData and axios directly to properly handle file upload
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    const token = typeof OpenAPI.TOKEN === 'function'
      ? await OpenAPI.TOKEN({} as any)
      : OpenAPI.TOKEN;

    const response = await axios.post(
      `${OpenAPI.BASE}/api/user/profile/avatar`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          // Let axios set Content-Type automatically with boundary
        },
      }
    );

    return response.data?.success || false;
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de l\'avatar:', error);
    throw new Error(
      error.response?.data?.message || 'Impossible de mettre à jour l\'avatar'
    );
  }
};

/**
 * Changer le mot de passe de l'utilisateur
 * @param data - Données du changement de mot de passe
 * @returns Promise<boolean>
 */
export const changePassword = async (
  data: ChangePasswordData
): Promise<boolean> => {
  try {
    const response = await UserProfileService.passwordUserProfile(data);

    return response.success || false;
  } catch (error: any) {
    console.error('Erreur lors du changement de mot de passe:', error);

    // Message d'erreur personnalisé selon le code d'erreur
    if (error.status === 400) {
      throw new Error('Le mot de passe actuel est incorrect');
    }

    throw new Error(
      error.body?.message || 'Impossible de changer le mot de passe'
    );
  }
};

// Alias pour compatibilité
export const updatePassword = changePassword;

export default {
  getUserProfile,
  updateUserProfile,
  updateAvatar,
  changePassword,
  updatePassword,
};
