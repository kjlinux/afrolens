// Service de gestion des commandes utilisant l'API générée
import { OrdersService, Order } from '@/api';
import { OpenAPI } from '@/api/core/OpenAPI';
import { request as __request } from '@/api/core/request';

/**
 * Interface pour les items d'une commande
 */
export interface OrderItemInput {
  photo_id: string;
  license_type: 'standard' | 'extended';
}

/**
 * Interface pour créer une commande
 */
export interface CreateOrderData {
  items: OrderItemInput[];
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  payment_method: 'mobile_money'; // Ligdicash supporte uniquement mobile_money
  billing_email: string;
  billing_first_name: string;
  billing_last_name: string;
  billing_phone: string;
}

/**
 * Interface pour initier le paiement avec Ligdicash
 * Ligdicash gère automatiquement tous les opérateurs (Orange, Moov, Wave, MTN)
 */
export interface PaymentInitData {
  payment_method: 'mobile_money'; // Ligdicash supporte uniquement mobile_money
}

/**
 * Interface pour les résultats paginés
 */
export interface PaginatedOrdersResult {
  data: Order[];
  total: number;
  page: number;
  pages: number;
}

/**
 * Interface pour la demande d'OTP
 */
export interface RequestOTPData {
  phone: string;
  payment_provider: 'ORANGE' | 'LIGDICASH_WALLET';
}

/**
 * Interface pour la validation d'OTP
 */
export interface ValidateOTPData {
  otp: string;
}

/**
 * Interface pour la réponse de demande d'OTP
 */
export interface OTPResponse {
  success: boolean;
  message: string;
  data: {
    expires_at: string;
    attempts_remaining: number;
  };
}

/**
 * Interface pour la réponse de validation d'OTP
 */
export interface ValidateOTPResponse {
  success: boolean;
  message: string;
  data: {
    order_id: string;
    transaction_id: string;
  };
}

/**
 * Récupérer toutes les commandes de l'utilisateur
 * @param perPage - Nombre de commandes par page
 * @returns Promise<PaginatedOrdersResult>
 */
export const getOrders = async (
  perPage: number = 20
): Promise<PaginatedOrdersResult> => {
  try {
    const response = await OrdersService.getOrders(perPage);

    return {
      data: response.data || [],
      total: response.meta?.total || 0,
      page: response.meta?.current_page || 1,
      pages: response.meta?.last_page || 1,
    };
  } catch (error: any) {
    console.error('Erreur lors de la récupération des commandes:', error);
    throw new Error(
      error.body?.message || 'Erreur lors de la récupération des commandes'
    );
  }
};

/**
 * Récupérer les détails d'une commande
 * @param orderId - ID de la commande
 * @returns Promise<Order>
 */
export const getOrder = async (orderId: string): Promise<Order> => {
  try {
    const order = await OrdersService.getOrder(orderId);
    return order;
  } catch (error: any) {
    console.error('Erreur lors de la récupération de la commande:', error);
    throw new Error(error.body?.message || 'Commande non trouvée');
  }
};

/**
 * Créer une nouvelle commande
 * @param orderData - Données de la commande
 * @returns Promise<Order>
 */
export const createOrder = async (orderData: CreateOrderData): Promise<Order> => {
  try {
    const response = await OrdersService.storeOrders(orderData);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Erreur lors de la création de la commande');
  } catch (error: any) {
    console.error('Erreur lors de la création de la commande:', error);

    // Extraire les détails de l'erreur de validation
    let errorMessage = 'Impossible de créer la commande';

    if (error.body?.message) {
      errorMessage = error.body.message;
    } else if (error.body?.errors) {
      // Si l'erreur contient des détails de validation
      const errors = Object.values(error.body.errors).flat();
      errorMessage = errors.join('. ');
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Initier le paiement pour une commande
 * @param orderId - ID de la commande
 * @param paymentData - Données du paiement
 * @returns Promise<{ payment_url: string; payment_token: string }>
 */
export const initiatePayment = async (
  orderId: string,
  paymentData: PaymentInitData
): Promise<{ payment_url: string; payment_token: string }> => {
  try {
    const response = await OrdersService.payOrders(
      orderId,
      paymentData
    );

    if (response.success && response.data) {
      return {
        payment_url: response.data.payment_url || '',
        payment_token: response.data.payment_token || '',
      };
    }

    throw new Error('Erreur lors de l\'initiation du paiement');
  } catch (error: any) {
    console.error('Erreur lors de l\'initiation du paiement:', error);

    // Extraire les détails de l'erreur de validation
    let errorMessage = 'Impossible d\'initier le paiement';

    if (error.body?.message) {
      errorMessage = error.body.message;
    } else if (error.body?.errors) {
      // Si l'erreur contient des détails de validation
      const errors = Object.values(error.body.errors).flat();
      errorMessage = errors.join('. ');
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Fonction helper pour créer une commande et initier le paiement
 * @param orderData - Données de la commande
 * @param paymentData - Données du paiement
 * @returns Promise<{ order: Order; payment_url: string; payment_token: string }>
 */
export const createOrderAndPay = async (
  orderData: CreateOrderData,
  paymentData: PaymentInitData
): Promise<{
  order: Order;
  payment_url: string;
  payment_token: string;
}> => {
  try {
    // Créer la commande
    const order = await createOrder(orderData);

    // Initier le paiement
    const { payment_url, payment_token } = await initiatePayment(
      order.id!,
      paymentData
    );

    return {
      order,
      payment_url,
      payment_token,
    };
  } catch (error: any) {
    console.error('Erreur lors de la création et paiement de la commande:', error);
    throw error;
  }
};

/**
 * Récupérer le statut de paiement d'une commande
 * Note: Cette fonction utilise getOrder pour vérifier le statut
 * @param orderId - ID de la commande
 * @returns Promise<string> - Statut du paiement
 */
export const getPaymentStatus = async (orderId: string): Promise<string> => {
  try {
    const order = await getOrder(orderId);
    return order.payment_status || 'pending';
  } catch (error: any) {
    console.error('Erreur lors de la récupération du statut de paiement:', error);
    throw new Error(
      error.body?.message || 'Impossible de récupérer le statut de paiement'
    );
  }
};

/**
 * Demander un code OTP pour le paiement
 * @param orderId - ID de la commande
 * @param otpData - Données pour la demande d'OTP (phone, payment_provider)
 * @returns Promise<OTPResponse>
 */
export const requestOTP = async (
  orderId: string,
  otpData: RequestOTPData
): Promise<OTPResponse> => {
  try {
    const response = await __request(OpenAPI, {
      method: 'POST',
      url: `/api/orders/${orderId}/request-otp`,
      body: otpData,
      mediaType: 'application/json',
      errors: {
        400: `Erreur lors de l'envoi du code OTP`,
        401: `Unauthorized - Authentication required`,
        422: `Validation error - phone format invalid or provider not supported`,
      },
    });

    if (response.success) {
      return response;
    }

    throw new Error('Erreur lors de la demande d\'OTP');
  } catch (error: any) {
    console.error('Erreur lors de la demande d\'OTP:', error);

    let errorMessage = 'Impossible d\'envoyer le code OTP';

    if (error.body?.message) {
      errorMessage = error.body.message;
    } else if (error.body?.errors) {
      const errors = Object.values(error.body.errors).flat();
      errorMessage = errors.join('. ');
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Valider le code OTP et finaliser le paiement
 * @param orderId - ID de la commande
 * @param otpData - Données de validation (otp code)
 * @returns Promise<ValidateOTPResponse>
 */
export const validateOTP = async (
  orderId: string,
  otpData: ValidateOTPData
): Promise<ValidateOTPResponse> => {
  try {
    const response = await __request(OpenAPI, {
      method: 'POST',
      url: `/api/orders/${orderId}/validate-otp`,
      body: otpData,
      mediaType: 'application/json',
      errors: {
        400: `Code OTP invalide ou paiement refusé`,
        401: `Unauthorized - Authentication required`,
        422: `OTP expiré ou nombre maximum de tentatives atteint`,
      },
    });

    if (response.success) {
      return response;
    }

    throw new Error('Erreur lors de la validation de l\'OTP');
  } catch (error: any) {
    console.error('Erreur lors de la validation de l\'OTP:', error);

    let errorMessage = 'Code OTP invalide';

    if (error.body?.message) {
      errorMessage = error.body.message;
    } else if (error.body?.errors) {
      const errors = Object.values(error.body.errors).flat();
      errorMessage = errors.join('. ');
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export default {
  getOrders,
  getOrder,
  createOrder,
  initiatePayment,
  createOrderAndPay,
  getPaymentStatus,
  requestOTP,
  validateOTP,
};
