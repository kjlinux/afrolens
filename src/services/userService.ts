// Service de gestion du profil utilisateur utilisant l'API générée
import { UserProfileService } from '@/api';

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
  role: 'user' | 'photographer' | 'admin';
  created_at: string;
  photographer_profile?: {
    id: string;
    status: 'pending' | 'approved' | 'rejected';
    portfolio_url?: string | null;
    total_revenue: number;
  } | null;
}

/**
 * Interface pour mettre à jour le profil
 */
export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  phone?: string | null;
  bio?: string | null;
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
    const response = await UserProfileService.f982Fed939320696F49Aae69E0D6();

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
    const response = await UserProfileService.ed1Eeb1Dca260Eaf9823A1164A32738C(
      data
    );

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
    const response = await UserProfileService.e2D2514A22B7Fd00C76D733Aba3936A2({
      avatar: avatarFile,
    });

    return response.success || false;
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de l\'avatar:', error);
    throw new Error(
      error.body?.message || 'Impossible de mettre à jour l\'avatar'
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
    const response = await UserProfileService.a242B9024697A504E108E26A89F2(data);

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

export default {
  getUserProfile,
  updateUserProfile,
  updateAvatar,
  changePassword,
};
