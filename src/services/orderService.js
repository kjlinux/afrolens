// Service de gestion des commandes

import { orders, getOrdersByUser } from '../data/mockData';
import { delay, generateOrderNumber } from '../utils/helpers';

export const createOrder = async (userId, cartItems, billingInfo) => {
  await delay(800);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const newOrder = {
    id: `order-${Date.now()}`,
    order_number: generateOrderNumber(),
    user_id: userId,
    items: cartItems.map(item => ({
      id: `item-${Date.now()}-${Math.random()}`,
      photo_id: item.photo_id,
      photo_title: item.photo_title,
      photo_preview: item.photo_preview,
      photographer_id: item.photographer_id,
      photographer_name: item.photographer_name || 'Photographe',
      license_type: item.license_type,
      price: item.price,
    })),
    subtotal,
    tax: 0,
    discount: 0,
    total: subtotal,
    payment_status: 'pending',
    billing_email: billingInfo.email,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  orders.push(newOrder);
  return newOrder;
};

export const processPayment = async (orderId, paymentMethod, paymentDetails) => {
  await delay(3000); // Simule le traitement du paiement

  const order = orders.find(o => o.id === orderId);
  if (!order) throw new Error('Commande non trouvée');

  // Simule 95% de succès
  const success = Math.random() > 0.05;

  if (success) {
    order.payment_status = 'completed';
    order.payment_method = paymentMethod;
    order.payment_provider = paymentDetails.provider;
    order.payment_id = `PAY-${Date.now()}`;
    order.paid_at = new Date().toISOString();
    order.invoice_url = `/invoices/${order.order_number}.pdf`;
    order.updated_at = new Date().toISOString();

    return { success: true, order };
  } else {
    order.payment_status = 'failed';
    return { success: false, error: 'Le paiement a échoué. Veuillez réessayer.' };
  }
};

export const getOrders = async (userId) => {
  await delay(500);
  return getOrdersByUser(userId).sort((a, b) =>
    new Date(b.created_at) - new Date(a.created_at)
  );
};

export const getOrderById = async (orderId) => {
  await delay(400);
  const order = orders.find(o => o.id === orderId);
  if (!order) throw new Error('Commande non trouvée');
  return order;
};

export default { createOrder, processPayment, getOrders, getOrderById };
