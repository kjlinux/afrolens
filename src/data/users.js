// Utilisateurs mockés pour Pouire
// 3 comptes de test principaux + autres utilisateurs pour la démo

export const users = [
  // COMPTE TEST - BUYER
  {
    id: 'user-buyer-1',
    email: 'buyer@test.com',
    password: 'password123', // En prod, ce serait hashé
    first_name: 'Jean',
    last_name: 'Ouedraogo',
    avatar_url: 'https://ui-avatars.com/api/?name=Jean+Ouedraogo&background=22c55e&color=fff',
    phone: '+226 70 12 34 56',
    bio: 'Acheteur régulier de photos sportives pour mon agence de communication.',
    account_type: 'buyer',
    is_verified: true,
    is_active: true,
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-10-15T14:30:00Z',
    last_login: '2024-10-29T08:00:00Z',
  },

  // COMPTE TEST - PHOTOGRAPHER
  {
    id: 'photographer-1',
    email: 'photographer@test.com',
    password: 'password123',
    first_name: 'Abdoul',
    last_name: 'Pouire',
    avatar_url: 'https://ui-avatars.com/api/?name=Abdoul+Pouire&background=3b82f6&color=fff',
    phone: '+226 70 98 76 54',
    bio: 'Photographe officiel des Étalons du Burkina Faso. Passionné de sport et culture africaine depuis 15 ans.',
    account_type: 'photographer',
    is_verified: true,
    is_active: true,
    created_at: '2023-06-15T09:00:00Z',
    updated_at: '2024-10-28T16:00:00Z',
    last_login: '2024-10-29T07:30:00Z',
    // Données supplémentaires pour photographe
    username: 'pouire_photo',
    display_name: 'Pouire Service Photographie',
    cover_photo_url: '/images/pic_030.jpg',
    location: 'Ouagadougou, Burkina Faso',
    website: 'https://pouirephoto.com',
    instagram: '@pouirephoto',
    portfolio_url: 'https://portfolio.pouirephoto.com',
    specialties: ['Sport', 'Culture', 'Événementiel', 'Portrait'],
    status: 'approved',
    commission_rate: 0.20,
    total_sales: 487,
    total_revenue: 18650.00,
    followers_count: 342,
    approved_at: '2023-06-16T10:00:00Z',
  },

  // COMPTE TEST - ADMIN
  {
    id: 'admin-1',
    email: 'admin@test.com',
    password: 'password123',
    first_name: 'Admin',
    last_name: 'POUIRE',
    avatar_url: 'https://ui-avatars.com/api/?name=Admin+POUIRE&background=ef4444&color=fff',
    phone: '+226 70 00 00 00',
    bio: 'Administrateur de la plateforme POUIRE.',
    account_type: 'admin',
    is_verified: true,
    is_active: true,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2024-10-29T09:00:00Z',
    last_login: '2024-10-29T09:00:00Z',
  },

  // AUTRES BUYERS
  {
    id: 'user-buyer-2',
    email: 'marie.kone@email.com',
    password: 'password123',
    first_name: 'Marie',
    last_name: 'Koné',
    avatar_url: 'https://ui-avatars.com/api/?name=Marie+Kone&background=8b5cf6&color=fff',
    phone: '+225 07 12 34 56',
    bio: 'Journaliste sportive passionnée.',
    account_type: 'buyer',
    is_verified: true,
    is_active: true,
    created_at: '2024-02-20T11:00:00Z',
    updated_at: '2024-10-20T10:00:00Z',
    last_login: '2024-10-28T15:00:00Z',
  },
  {
    id: 'user-buyer-3',
    email: 'samuel.traore@media.bf',
    password: 'password123',
    first_name: 'Samuel',
    last_name: 'Traoré',
    avatar_url: 'https://ui-avatars.com/api/?name=Samuel+Traore&background=f59e0b&color=fff',
    phone: '+226 70 45 67 89',
    bio: 'Directeur artistique chez Media BF.',
    account_type: 'buyer',
    is_verified: true,
    is_active: true,
    created_at: '2024-03-05T14:00:00Z',
    updated_at: '2024-10-25T12:00:00Z',
    last_login: '2024-10-27T09:00:00Z',
  },
  {
    id: 'user-buyer-4',
    email: 'fatou.diallo@ong.org',
    password: 'password123',
    first_name: 'Fatou',
    last_name: 'Diallo',
    avatar_url: 'https://ui-avatars.com/api/?name=Fatou+Diallo&background=ec4899&color=fff',
    phone: '+226 70 11 22 33',
    bio: 'Responsable communication ONG internationale.',
    account_type: 'buyer',
    is_verified: true,
    is_active: true,
    created_at: '2024-04-12T09:00:00Z',
    updated_at: '2024-10-22T14:00:00Z',
    last_login: '2024-10-26T11:00:00Z',
  },
  {
    id: 'user-buyer-5',
    email: 'pierre.kabore@entreprise.bf',
    password: 'password123',
    first_name: 'Pierre',
    last_name: 'Kaboré',
    avatar_url: 'https://ui-avatars.com/api/?name=Pierre+Kabore&background=06b6d4&color=fff',
    phone: '+226 70 98 76 54',
    bio: 'Chef de projet marketing digital.',
    account_type: 'buyer',
    is_verified: true,
    is_active: true,
    created_at: '2024-05-08T10:00:00Z',
    updated_at: '2024-10-24T16:00:00Z',
    last_login: '2024-10-29T08:30:00Z',
  },

  // AUTRES PHOTOGRAPHES
  {
    id: 'photographer-2',
    email: 'aminata.photo@gmail.com',
    password: 'password123',
    first_name: 'Aminata',
    last_name: 'Sawadogo',
    avatar_url: 'https://ui-avatars.com/api/?name=Aminata+Sawadogo&background=10b981&color=fff',
    phone: '+226 70 55 44 33',
    bio: 'Photographe de mariage et événements culturels. Capturer l\'authenticité africaine.',
    account_type: 'photographer',
    is_verified: true,
    is_active: true,
    created_at: '2023-09-20T10:00:00Z',
    updated_at: '2024-10-27T11:00:00Z',
    last_login: '2024-10-28T14:00:00Z',
    username: 'aminata_captures',
    display_name: 'Aminata Sawadogo Photography',
    cover_photo_url: '/images/pic_044.jpg',
    location: 'Bobo-Dioulasso, Burkina Faso',
    website: 'https://aminataphoto.com',
    instagram: '@aminata_captures',
    portfolio_url: 'https://portfolio.aminata.com',
    specialties: ['Mariage', 'Culture', 'Portrait', 'Événementiel'],
    status: 'approved',
    commission_rate: 0.20,
    total_sales: 156,
    total_revenue: 5840.00,
    followers_count: 128,
    approved_at: '2023-09-21T09:00:00Z',
  },
  {
    id: 'photographer-3',
    email: 'youssouf.lens@photo.ci',
    password: 'password123',
    first_name: 'Youssouf',
    last_name: 'Touré',
    avatar_url: 'https://ui-avatars.com/api/?name=Youssouf+Toure&background=f97316&color=fff',
    phone: '+225 07 88 99 00',
    bio: 'Photographe sportif spécialisé dans le football africain.',
    account_type: 'photographer',
    is_verified: true,
    is_active: true,
    created_at: '2023-11-10T12:00:00Z',
    updated_at: '2024-10-26T15:00:00Z',
    last_login: '2024-10-28T17:00:00Z',
    username: 'youssouf_sports',
    display_name: 'Youssouf Sports Photography',
    cover_photo_url: '/images/pic_025.jpg',
    location: 'Abidjan, Côte d\'Ivoire',
    website: 'https://youssouf-sports.com',
    instagram: '@youssouf_lens',
    portfolio_url: 'https://portfolio.youssouf.com',
    specialties: ['Football', 'Sport', 'Action'],
    status: 'approved',
    commission_rate: 0.20,
    total_sales: 203,
    total_revenue: 7615.00,
    followers_count: 215,
    approved_at: '2023-11-11T10:00:00Z',
  },
  {
    id: 'photographer-4',
    email: 'ibrahim.focus@outlook.com',
    password: 'password123',
    first_name: 'Ibrahim',
    last_name: 'Compaoré',
    avatar_url: 'https://ui-avatars.com/api/?name=Ibrahim+Compaore&background=6366f1&color=fff',
    phone: '+226 70 22 33 44',
    bio: 'Photographe de paysages et nature africaine.',
    account_type: 'photographer',
    is_verified: true,
    is_active: true,
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-10-25T13:00:00Z',
    last_login: '2024-10-27T10:00:00Z',
    username: 'ibrahim_nature',
    display_name: 'Ibrahim Nature Photography',
    cover_photo_url: '/images/pic_015.jpg',
    location: 'Koudougou, Burkina Faso',
    website: 'https://ibrahim-nature.com',
    instagram: '@ibrahim_focus',
    portfolio_url: 'https://portfolio.ibrahim.com',
    specialties: ['Nature', 'Paysages', 'Wildlife'],
    status: 'approved',
    commission_rate: 0.20,
    total_sales: 89,
    total_revenue: 3345.00,
    followers_count: 94,
    approved_at: '2024-01-16T10:00:00Z',
  },
  {
    id: 'photographer-5',
    email: 'rachelle.art@yahoo.fr',
    password: 'password123',
    first_name: 'Rachelle',
    last_name: 'Zongo',
    avatar_url: 'https://ui-avatars.com/api/?name=Rachelle+Zongo&background=ec4899&color=fff',
    phone: '+226 70 66 77 88',
    bio: 'Photographe portraitiste et documentaire.',
    account_type: 'photographer',
    is_verified: true,
    is_active: true,
    created_at: '2024-03-22T11:00:00Z',
    updated_at: '2024-10-23T14:00:00Z',
    last_login: '2024-10-26T12:00:00Z',
    username: 'rachelle_portraits',
    display_name: 'Rachelle Art Photography',
    cover_photo_url: '/images/pic_040.jpg',
    location: 'Ouagadougou, Burkina Faso',
    website: 'https://rachelle-art.com',
    instagram: '@rachelle_art',
    portfolio_url: 'https://portfolio.rachelle.com',
    specialties: ['Portrait', 'Documentaire', 'Street Photography'],
    status: 'approved',
    commission_rate: 0.20,
    total_sales: 124,
    total_revenue: 4680.00,
    followers_count: 167,
    approved_at: '2024-03-23T09:00:00Z',
  },

  // PHOTOGRAPHES EN ATTENTE DE VALIDATION
  {
    id: 'photographer-pending-1',
    email: 'karim.new@gmail.com',
    password: 'password123',
    first_name: 'Karim',
    last_name: 'Ouattara',
    avatar_url: 'https://ui-avatars.com/api/?name=Karim+Ouattara&background=gray&color=fff',
    phone: '+226 70 99 88 77',
    bio: 'Jeune photographe passionné par le sport et la culture. 5 ans d\'expérience.',
    account_type: 'photographer',
    is_verified: false,
    is_active: true,
    created_at: '2024-10-20T10:00:00Z',
    updated_at: '2024-10-20T10:00:00Z',
    last_login: '2024-10-28T16:00:00Z',
    username: 'karim_shoots',
    display_name: 'Karim Photography',
    location: 'Ouagadougou, Burkina Faso',
    website: '',
    instagram: '@karim_shoots',
    portfolio_url: 'https://behance.net/karim',
    specialties: ['Sport', 'Culture', 'Événementiel'],
    status: 'pending',
    commission_rate: 0.20,
    total_sales: 0,
    total_revenue: 0.00,
    followers_count: 0,
  },
  {
    id: 'photographer-pending-2',
    email: 'sophie.lens@hotmail.com',
    password: 'password123',
    first_name: 'Sophie',
    last_name: 'Ilboudo',
    avatar_url: 'https://ui-avatars.com/api/?name=Sophie+Ilboudo&background=gray&color=fff',
    phone: '+226 70 11 22 44',
    bio: 'Photographe de mode et lifestyle. Portfolio international.',
    account_type: 'photographer',
    is_verified: false,
    is_active: true,
    created_at: '2024-10-25T14:00:00Z',
    updated_at: '2024-10-25T14:00:00Z',
    last_login: '2024-10-27T11:00:00Z',
    username: 'sophie_style',
    display_name: 'Sophie Style Photography',
    location: 'Ouagadougou, Burkina Faso',
    website: 'https://sophie-style.com',
    instagram: '@sophie_lens',
    portfolio_url: 'https://sophie-portfolio.com',
    specialties: ['Mode', 'Lifestyle', 'Portrait Commercial'],
    status: 'pending',
    commission_rate: 0.20,
    total_sales: 0,
    total_revenue: 0.00,
    followers_count: 0,
  },

  // UTILISATEUR SUSPENDU (pour tester la gestion admin)
  {
    id: 'user-suspended-1',
    email: 'suspended@test.com',
    password: 'password123',
    first_name: 'User',
    last_name: 'Suspended',
    avatar_url: 'https://ui-avatars.com/api/?name=User+Suspended&background=gray&color=fff',
    phone: '+226 70 00 11 22',
    bio: 'Compte suspendu pour violation des conditions.',
    account_type: 'buyer',
    is_verified: false,
    is_active: false,
    created_at: '2024-06-10T10:00:00Z',
    updated_at: '2024-08-15T14:00:00Z',
    last_login: '2024-08-10T09:00:00Z',
  },
];

// Fonctions utilitaires
export const getUserById = (id) => {
  return users.find(user => user.id === id);
};

export const getUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

export const getPhotographers = () => {
  return users.filter(user => user.account_type === 'photographer' && user.is_active);
};

export const getApprovedPhotographers = () => {
  return users.filter(
    user => user.account_type === 'photographer' &&
      user.status === 'approved' &&
      user.is_active
  );
};

export const getPendingPhotographers = () => {
  return users.filter(
    user => user.account_type === 'photographer' && user.status === 'pending'
  );
};

export const getBuyers = () => {
  return users.filter(user => user.account_type === 'buyer' && user.is_active);
};

export const authenticateUser = (email, password) => {
  const user = users.find(
    u => u.email === email && u.password === password && u.is_active
  );
  if (user) {
    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

export default users;
