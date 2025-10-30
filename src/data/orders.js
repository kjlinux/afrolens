// Commandes mockées pour Pouire

export const orders = [
  {
    id: 'order-001',
    order_number: 'ORD-20251025-ABC123',
    user_id: 'user-buyer-1',
    items: [
      {
        id: 'item-001',
        photo_id: 'photo-030',
        photo_title: 'Gardien des Étalons avec trophée CAF',
        photo_preview: '/images/pic_030.jpg',
        photographer_id: 'photographer-1',
        photographer_name: 'Pouire Service Photographie',
        license_type: 'standard',
        price: 32800,
      },
      {
        id: 'item-002',
        photo_id: 'photo-044',
        photo_title: 'Supportrice en costume traditionnel vert',
        photo_preview: '/images/pic_044.jpg',
        photographer_id: 'photographer-1',
        photographer_name: 'Pouire Service Photographie',
        license_type: 'extended',
        price: 82000,
      },
    ],
    subtotal: 114800,
    tax: 0.00,
    discount: 0.00,
    total: 114800,
    payment_method: 'mobile_money',
    payment_provider: 'orange_money',
    payment_status: 'completed',
    payment_id: 'PAY-OM-20251025-123456',
    paid_at: '2025-10-25T14:35:00Z',
    invoice_url: '/invoices/ORD-20251025-ABC123.pdf',
    billing_email: 'buyer@test.com',
    created_at: '2025-10-25T14:30:00Z',
    updated_at: '2025-10-25T14:35:00Z',
  },
  {
    id: 'order-002',
    order_number: 'ORD-20251020-DEF456',
    user_id: 'user-buyer-1',
    items: [
      {
        id: 'item-003',
        photo_id: 'photo-010',
        photo_title: 'Délégation Burkina Faso - Paris 2025',
        photo_preview: '/images/pic_010.jpg',
        photographer_id: 'photographer-1',
        photographer_name: 'Pouire Service Photographie',
        license_type: 'standard',
        price: 29520,
      },
    ],
    subtotal: 29520,
    tax: 0.00,
    discount: 0.00,
    total: 29520,
    payment_method: 'card',
    payment_provider: 'stripe',
    payment_status: 'completed',
    payment_id: 'PAY-STRIPE-789012',
    paid_at: '2025-10-20T10:15:00Z',
    invoice_url: '/invoices/ORD-20251020-DEF456.pdf',
    billing_email: 'buyer@test.com',
    created_at: '2025-10-20T10:10:00Z',
    updated_at: '2025-10-20T10:15:00Z',
  },
  {
    id: 'order-003',
    order_number: 'ORD-20251018-GHI789',
    user_id: 'user-buyer-2',
    items: [
      {
        id: 'item-004',
        photo_id: 'photo-025',
        photo_title: 'Match des Étalons - Action de jeu',
        photo_preview: '/images/pic_025.jpg',
        photographer_id: 'photographer-1',
        photographer_name: 'Pouire Service Photographie',
        license_type: 'standard',
        price: 22960,
      },
      {
        id: 'item-005',
        photo_id: 'photo-001',
        photo_title: 'Équipe cycliste nationale - Départ de course',
        photo_preview: '/images/pic_001.jpg',
        photographer_id: 'photographer-1',
        photographer_name: 'Pouire Service Photographie',
        license_type: 'standard',
        price: 16400,
      },
    ],
    subtotal: 39360,
    tax: 0.00,
    discount: 0.00,
    total: 39360,
    payment_method: 'mobile_money',
    payment_provider: 'moov_money',
    payment_status: 'completed',
    paid_at: '2025-10-18T16:20:00Z',
    invoice_url: '/invoices/ORD-20251018-GHI789.pdf',
    billing_email: 'marie.kone@email.com',
    created_at: '2025-10-18T16:15:00Z',
    updated_at: '2025-10-18T16:20:00Z',
  },
  {
    id: 'order-004',
    order_number: 'ORD-20251015-JKL012',
    user_id: 'user-buyer-3',
    items: [
      {
        id: 'item-006',
        photo_id: 'photo-015',
        photo_title: 'Course de motocross - Action dans le sable',
        photo_preview: '/images/pic_015.jpg',
        photographer_id: 'photographer-1',
        photographer_name: 'Pouire Service Photographie',
        license_type: 'extended',
        price: 75440,
      },
    ],
    subtotal: 75440,
    tax: 0.00,
    discount: 0.00,
    total: 75440,
    payment_method: 'mobile_money',
    payment_provider: 'orange_money',
    payment_status: 'completed',
    paid_at: '2025-10-15T11:45:00Z',
    invoice_url: '/invoices/ORD-20251015-JKL012.pdf',
    billing_email: 'samuel.traore@media.bf',
    created_at: '2025-10-15T11:40:00Z',
    updated_at: '2025-10-15T11:45:00Z',
  },
  {
    id: 'order-005',
    order_number: 'ORD-20251010-MNO345',
    user_id: 'user-buyer-4',
    items: [
      {
        id: 'item-007',
        photo_id: 'photo-040',
        photo_title: 'Portrait joueur Étalons en maillot vert',
        photo_preview: '/images/pic_040.jpg',
        photographer_id: 'photographer-1',
        photographer_name: 'Pouire Service Photographie',
        license_type: 'standard',
        price: 26240,
      },
    ],
    subtotal: 26240,
    tax: 0.00,
    discount: 0.00,
    total: 26240,
    payment_method: 'card',
    payment_provider: 'stripe',
    payment_status: 'completed',
    paid_at: '2025-10-10T14:25:00Z',
    invoice_url: '/invoices/ORD-20251010-MNO345.pdf',
    billing_email: 'fatou.diallo@ong.org',
    created_at: '2025-10-10T14:20:00Z',
    updated_at: '2025-10-10T14:25:00Z',
  },
  {
    id: 'order-006',
    order_number: 'ORD-20251029-PQR678',
    user_id: 'user-buyer-5',
    items: [
      {
        id: 'item-008',
        photo_id: 'photo-059',
        photo_title: 'Portrait athlète JO',
        photo_preview: '/images/pic_059.jpg',
        photographer_id: 'photographer-1',
        photographer_name: 'Pouire Service Photographie',
        license_type: 'standard',
        price: 24928,
      },
    ],
    subtotal: 24928,
    tax: 0.00,
    discount: 0.00,
    total: 24928,
    payment_method: 'mobile_money',
    payment_provider: 'orange_money',
    payment_status: 'pending',
    payment_id: null,
    paid_at: null,
    invoice_url: null,
    billing_email: 'pierre.kabore@entreprise.bf',
    created_at: '2025-10-29T09:00:00Z',
    updated_at: '2025-10-29T09:00:00Z',
  },
];

// Fonctions utilitaires
export const getOrderById = (id) => {
  return orders.find(order => order.id === id);
};

export const getOrdersByUser = (userId) => {
  return orders.filter(order => order.user_id === userId);
};

export const getOrdersByStatus = (status) => {
  return orders.filter(order => order.payment_status === status);
};

export const getCompletedOrders = () => {
  return orders.filter(order => order.payment_status === 'completed');
};

export const getTotalRevenue = () => {
  return orders
    .filter(order => order.payment_status === 'completed')
    .reduce((total, order) => total + order.total, 0);
};

export default orders;
