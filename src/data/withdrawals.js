// Demandes de retrait mockées pour Pouire

export const withdrawals = [
  {
    id: 'withdrawal-001',
    photographer_id: 'photographer-1',
    amount: 150000, // FCFA
    status: 'pending', // pending, approved, rejected, completed
    payment_method: 'mobile_money',
    payment_details: {
      provider: 'orange_money',
      phone: '+226 70 98 76 54',
      name: 'Abdoul Pouire',
    },
    requested_at: '2024-10-28T10:30:00Z',
    processed_at: null,
    processed_by: null,
    notes: null,
  },
  {
    id: 'withdrawal-002',
    photographer_id: 'photographer-2',
    amount: 85000, // FCFA
    status: 'pending',
    payment_method: 'mobile_money',
    payment_details: {
      provider: 'moov_money',
      phone: '+226 70 55 44 33',
      name: 'Aminata Sawadogo',
    },
    requested_at: '2024-10-27T14:15:00Z',
    processed_at: null,
    processed_by: null,
    notes: null,
  },
  {
    id: 'withdrawal-003',
    photographer_id: 'photographer-3',
    amount: 120000, // FCFA
    status: 'pending',
    payment_method: 'bank_transfer',
    payment_details: {
      bank_name: 'Coris Bank',
      account_number: 'CI123456789',
      account_name: 'Youssouf Touré',
      iban: 'CI93CI0011112222233333344',
    },
    requested_at: '2024-10-26T09:45:00Z',
    processed_at: null,
    processed_by: null,
    notes: null,
  },
  {
    id: 'withdrawal-004',
    photographer_id: 'photographer-1',
    amount: 200000, // FCFA
    status: 'completed',
    payment_method: 'mobile_money',
    payment_details: {
      provider: 'orange_money',
      phone: '+226 70 98 76 54',
      name: 'Abdoul Pouire',
    },
    requested_at: '2024-10-15T11:20:00Z',
    processed_at: '2024-10-16T14:30:00Z',
    processed_by: 'admin-1',
    notes: 'Transfert effectué avec succès',
    transaction_id: 'OM-TRX-20241016-123456',
  },
  {
    id: 'withdrawal-005',
    photographer_id: 'photographer-2',
    amount: 75000, // FCFA
    status: 'completed',
    payment_method: 'mobile_money',
    payment_details: {
      provider: 'moov_money',
      phone: '+226 70 55 44 33',
      name: 'Aminata Sawadogo',
    },
    requested_at: '2024-10-10T16:00:00Z',
    processed_at: '2024-10-11T10:15:00Z',
    processed_by: 'admin-1',
    notes: 'Paiement validé',
    transaction_id: 'MM-TRX-20241011-789012',
  },
  {
    id: 'withdrawal-006',
    photographer_id: 'photographer-4',
    amount: 45000, // FCFA
    status: 'rejected',
    payment_method: 'mobile_money',
    payment_details: {
      provider: 'orange_money',
      phone: '+226 70 22 33 44',
      name: 'Ibrahim Compaoré',
    },
    requested_at: '2024-10-12T13:30:00Z',
    processed_at: '2024-10-13T09:00:00Z',
    processed_by: 'admin-1',
    notes: 'Solde insuffisant. Minimum requis: 50,000 FCFA',
  },
];

// Fonctions utilitaires
export const getWithdrawalById = (id) => {
  return withdrawals.find(withdrawal => withdrawal.id === id);
};

export const getWithdrawalsByPhotographer = (photographerId) => {
  return withdrawals.filter(withdrawal => withdrawal.photographer_id === photographerId);
};

export const getPendingWithdrawals = () => {
  return withdrawals.filter(withdrawal => withdrawal.status === 'pending');
};

export const getWithdrawalsByStatus = (status) => {
  return withdrawals.filter(withdrawal => withdrawal.status === status);
};

export const getTotalWithdrawalAmount = () => {
  return withdrawals
    .filter(withdrawal => withdrawal.status === 'completed')
    .reduce((total, withdrawal) => total + withdrawal.amount, 0);
};

export default withdrawals;
