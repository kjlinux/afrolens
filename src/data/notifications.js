// Notifications mockées pour tous les types d'utilisateurs

export const notifications = [
  // NOTIFICATIONS BUYER
  {
    id: 'notif-001',
    user_id: 'user-buyer-1',
    type: 'order_completed',
    title: 'Commande confirmée',
    message: 'Votre commande ORD-20241025-ABC123 a été confirmée. Vous pouvez télécharger vos photos.',
    data: {
      order_id: 'order-001',
      order_number: 'ORD-20241025-ABC123',
    },
    is_read: false,
    created_at: '2024-10-25T14:35:00Z',
  },
  {
    id: 'notif-002',
    user_id: 'user-buyer-1',
    type: 'new_photo_from_followed',
    title: 'Nouvelles photos disponibles',
    message: 'Pouire Service Photographie a ajouté 5 nouvelles photos de sport.',
    data: {
      photographer_id: 'photographer-1',
      photographer_name: 'Pouire Service Photographie',
      photos_count: 5,
    },
    is_read: true,
    created_at: '2024-10-24T10:00:00Z',
  },
  {
    id: 'notif-003',
    user_id: 'user-buyer-1',
    type: 'favorite_photo_on_sale',
    title: 'Photo favorite en promotion',
    message: 'Une photo dans vos favoris est maintenant en promotion -20%!',
    data: {
      photo_id: 'photo-030',
      discount: 20,
    },
    is_read: true,
    created_at: '2024-10-22T08:00:00Z',
  },

  // NOTIFICATIONS PHOTOGRAPHER
  {
    id: 'notif-004',
    user_id: 'photographer-1',
    type: 'new_sale',
    title: 'Nouvelle vente !',
    message: 'Félicitations ! Votre photo "Gardien des Étalons avec trophée CAF" vient d\'être vendue pour 50.00 FCFA.',
    data: {
      order_id: 'order-001',
      photo_id: 'photo-030',
      amount: 50.00,
      commission: 10.00,
      net_amount: 40.00,
    },
    is_read: false,
    created_at: '2024-10-25T14:35:00Z',
  },
  {
    id: 'notif-005',
    user_id: 'photographer-1',
    type: 'new_follower',
    title: 'Nouveau follower',
    message: 'Jean Ouedraogo suit maintenant votre portfolio.',
    data: {
      follower_id: 'user-buyer-1',
      follower_name: 'Jean Ouedraogo',
    },
    is_read: false,
    created_at: '2024-10-26T11:00:00Z',
  },
  {
    id: 'notif-006',
    user_id: 'photographer-1',
    type: 'photo_approved',
    title: 'Photo approuvée',
    message: 'Votre photo "Cycliste sprint final" a été approuvée et est maintenant publique.',
    data: {
      photo_id: 'photo-004',
      photo_title: 'Cycliste sprint final',
    },
    is_read: true,
    created_at: '2024-10-23T09:00:00Z',
  },
  {
    id: 'notif-007',
    user_id: 'photographer-1',
    type: 'withdrawal_approved',
    title: 'Demande de retrait approuvée',
    message: 'Votre demande de retrait de 500.00 FCFA a été approuvée. Le paiement sera effectué sous 48h.',
    data: {
      withdrawal_id: 'withdrawal-001',
      amount: 500.00,
    },
    is_read: true,
    created_at: '2024-10-20T14:00:00Z',
  },
  {
    id: 'notif-008',
    user_id: 'photographer-1',
    type: 'milestone_reached',
    title: 'Félicitations ! 🎉',
    message: 'Vous avez atteint 500 ventes sur la plateforme !',
    data: {
      milestone: 'sales',
      value: 500,
    },
    is_read: true,
    created_at: '2024-10-18T16:00:00Z',
  },

  // NOTIFICATIONS ADMIN
  {
    id: 'notif-009',
    user_id: 'admin-1',
    type: 'new_photographer_application',
    title: 'Nouvelle demande photographe',
    message: 'Karim Ouattara a soumis une demande de compte photographe.',
    data: {
      photographer_id: 'photographer-pending-1',
      photographer_name: 'Karim Ouattara',
    },
    is_read: false,
    created_at: '2024-10-20T10:05:00Z',
  },
  {
    id: 'notif-010',
    user_id: 'admin-1',
    type: 'photo_to_moderate',
    title: '5 photos en attente de modération',
    message: 'Il y a actuellement 5 photos en attente de votre validation.',
    data: {
      pending_count: 5,
    },
    is_read: false,
    created_at: '2024-10-29T08:00:00Z',
  },
  {
    id: 'notif-011',
    user_id: 'admin-1',
    type: 'new_withdrawal_request',
    title: 'Nouvelle demande de retrait',
    message: 'Aminata Sawadogo demande un retrait de 250.00 FCFA.',
    data: {
      withdrawal_id: 'withdrawal-002',
      photographer_id: 'photographer-2',
      amount: 250.00,
    },
    is_read: false,
    created_at: '2024-10-28T15:00:00Z',
  },
  {
    id: 'notif-012',
    user_id: 'admin-1',
    type: 'suspicious_activity',
    title: 'Activité suspecte détectée',
    message: 'Activité inhabituelle détectée sur le compte suspended@test.com',
    data: {
      user_id: 'user-suspended-1',
      activity_type: 'multiple_failed_logins',
    },
    is_read: true,
    created_at: '2024-08-10T09:30:00Z',
  },

  // NOTIFICATIONS PHOTOGRAPHE 2
  {
    id: 'notif-013',
    user_id: 'photographer-2',
    type: 'new_sale',
    title: 'Nouvelle vente !',
    message: 'Votre photo a été vendue pour 35.00 FCFA.',
    data: {
      photo_id: 'photo-XXX',
      amount: 35.00,
    },
    is_read: false,
    created_at: '2024-10-27T13:00:00Z',
  },

  // NOTIFICATIONS PHOTOGRAPHE PENDING
  {
    id: 'notif-014',
    user_id: 'photographer-pending-1',
    type: 'application_submitted',
    title: 'Demande de compte photographe soumise',
    message: 'Votre demande de compte photographe a été soumise avec succès. Elle sera examinée sous 48h.',
    data: {
      application_date: '2024-10-20T10:00:00Z',
    },
    is_read: true,
    created_at: '2024-10-20T10:05:00Z',
  },
];

// Fonctions utilitaires
export const getNotificationsByUser = (userId) => {
  return notifications.filter(notif => notif.user_id === userId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

export const getUnreadNotifications = (userId) => {
  return notifications.filter(notif => notif.user_id === userId && !notif.is_read);
};

export const getUnreadCount = (userId) => {
  return getUnreadNotifications(userId).length;
};

export const markAsRead = (notificationId) => {
  const notif = notifications.find(n => n.id === notificationId);
  if (notif) {
    notif.is_read = true;
  }
  return notif;
};

export const markAllAsRead = (userId) => {
  notifications
    .filter(notif => notif.user_id === userId)
    .forEach(notif => notif.is_read = true);
};

export default notifications;
