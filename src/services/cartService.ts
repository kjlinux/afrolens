// Service de gestion du panier utilisant l'API générée
import { CartService } from '@/api';

/**
 * Interface pour un item du panier
 */
export interface CartItem {
  photo_id: string;
  photo_title?: string;
  photo_thumbnail?: string;
  photographer_id?: string;
  photographer_name?: string;
  license_type: 'standard' | 'extended';
  price: number;
}

/**
 * Interface pour les données du panier
 */
export interface CartData {
  items: CartItem[];
  subtotal: number;
  total: number;
  items_count: number;
}

/**
 * Récupérer le panier de l'utilisateur connecté
 * @returns Promise<CartData>
 */
export const getCart = async (): Promise<CartData> => {
  try {
    const response = await CartService.fdb9B40Bd4Ad2Baf12Aa15164Eab788();

    if (response.success && response.data) {
      return {
        items: (response.data.items || []) as CartItem[],
        subtotal: response.data.subtotal || 0,
        total: response.data.total || 0,
        items_count: response.data.items_count || 0,
      };
    }

    return {
      items: [],
      subtotal: 0,
      total: 0,
      items_count: 0,
    };
  } catch (error: any) {
    console.error('Erreur lors de la récupération du panier:', error);
    // Retourner un panier vide en cas d'erreur
    return {
      items: [],
      subtotal: 0,
      total: 0,
      items_count: 0,
    };
  }
};

/**
 * Ajouter un item au panier
 * @param photoId - ID de la photo
 * @param licenseType - Type de licence (standard ou extended)
 * @returns Promise<CartData>
 */
export const addToCart = async (
  photoId: string,
  licenseType: 'standard' | 'extended' = 'standard'
): Promise<CartData> => {
  try {
    const response = await CartService.c1Ea70Dfbb034F059570D0Ab4A0({
      photo_id: photoId,
      license_type: licenseType,
    });

    if (response.success && response.data) {
      return {
        items: (response.data.items || []) as CartItem[],
        subtotal: response.data.subtotal || 0,
        total: response.data.total || 0,
        items_count: response.data.items_count || 0,
      };
    }

    throw new Error('Erreur lors de l\'ajout au panier');
  } catch (error: any) {
    console.error('Erreur lors de l\'ajout au panier:', error);
    throw new Error(error.body?.message || 'Impossible d\'ajouter l\'article au panier');
  }
};

/**
 * Mettre à jour un item du panier
 * @param index - Index de l'item dans le panier
 * @param licenseType - Nouveau type de licence
 * @returns Promise<CartData>
 */
export const updateCartItem = async (
  index: number,
  licenseType: 'standard' | 'extended'
): Promise<CartData> => {
  try {
    const response = await CartService.dbda638A0Efc2D64E70Dfd4F01F6979(index, {
      license_type: licenseType,
    });

    if (response.success && response.data) {
      return {
        items: (response.data.items || []) as CartItem[],
        subtotal: response.data.subtotal || 0,
        total: response.data.total || 0,
        items_count: response.data.items?.length || 0,
      };
    }

    throw new Error('Erreur lors de la mise à jour de l\'article');
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de l\'article:', error);
    throw new Error(error.body?.message || 'Impossible de mettre à jour l\'article');
  }
};

/**
 * Retirer un item du panier
 * @param index - Index de l'item dans le panier
 * @returns Promise<CartData>
 */
export const removeFromCart = async (index: number): Promise<CartData> => {
  try {
    const response = await CartService.eb273E1375182A67Df9E585D2222B15F(index);

    if (response.success && response.data) {
      return {
        items: (response.data.items || []) as CartItem[],
        subtotal: response.data.subtotal || 0,
        total: response.data.total || 0,
        items_count: response.data.items?.length || 0,
      };
    }

    throw new Error('Erreur lors de la suppression de l\'article');
  } catch (error: any) {
    console.error('Erreur lors de la suppression de l\'article:', error);
    throw new Error(error.body?.message || 'Impossible de supprimer l\'article');
  }
};

/**
 * Vider le panier complètement
 * @returns Promise<boolean>
 */
export const clearCart = async (): Promise<boolean> => {
  try {
    const response = await CartService.c37760F7C1C679D2A0C391E6A666105();
    return response.success || false;
  } catch (error: any) {
    console.error('Erreur lors du vidage du panier:', error);
    throw new Error(error.body?.message || 'Impossible de vider le panier');
  }
};

/**
 * Récupérer le nombre d'items dans le panier
 * @returns Promise<number>
 */
export const getCartItemsCount = async (): Promise<number> => {
  try {
    const cart = await getCart();
    return cart.items_count;
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre d\'items:', error);
    return 0;
  }
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartItemsCount,
};
