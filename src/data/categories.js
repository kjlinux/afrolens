export const categories = [
  {
    id: 'cat-1',
    name: 'Sport',
    slug: 'sport',
    description: 'Photos sportives professionnelles - Football, Cyclisme, Athlétisme',
    icon_url: '/images/pic_001.jpg',
    parent_id: null,
    display_order: 1,
    is_active: true,
    photo_count: 55,
  },
  {
    id: 'cat-2',
    name: 'Football',
    slug: 'football',
    description: 'Football africain et international',
    icon_url: '/images/pic_025.jpg',
    parent_id: 'cat-1',
    display_order: 1,
    is_active: true,
    photo_count: 42,
  },
  {
    id: 'cat-3',
    name: 'Cyclisme',
    slug: 'cyclisme',
    description: 'Cyclisme professionnel et compétitions',
    icon_url: '/images/pic_001.jpg',
    parent_id: 'cat-1',
    display_order: 2,
    is_active: true,
    photo_count: 8,
  },
  {
    id: 'cat-4',
    name: 'Athlétisme',
    slug: 'athletisme',
    description: 'Athlétisme et sports individuels',
    icon_url: '/images/pic_050.jpg',
    parent_id: 'cat-1',
    display_order: 3,
    is_active: true,
    photo_count: 3,
  },
  {
    id: 'cat-5',
    name: 'Motocross',
    slug: 'motocross',
    description: 'Sports mécaniques et motocross',
    icon_url: '/images/pic_015.jpg',
    parent_id: 'cat-1',
    display_order: 4,
    is_active: true,
    photo_count: 2,
  },
  {
    id: 'cat-6',
    name: 'Culture & Événements',
    slug: 'culture-evenements',
    description: 'Événements culturels, traditions et célébrations',
    icon_url: '/images/pic_044.jpg',
    parent_id: null,
    display_order: 2,
    is_active: true,
    photo_count: 12,
  },
  {
    id: 'cat-7',
    name: 'Traditions',
    slug: 'traditions',
    description: 'Costumes traditionnels et patrimoine culturel',
    icon_url: '/images/pic_044.jpg',
    parent_id: 'cat-6',
    display_order: 1,
    is_active: true,
    photo_count: 5,
  },
  {
    id: 'cat-8',
    name: 'Événements Internationaux',
    slug: 'evenements-internationaux',
    description: 'Compétitions et événements internationaux',
    icon_url: '/images/pic_010.jpg',
    parent_id: 'cat-6',
    display_order: 2,
    is_active: true,
    photo_count: 7,
  },
  {
    id: 'cat-9',
    name: 'Portraits',
    slug: 'portraits',
    description: 'Portraits professionnels de sportifs et personnalités',
    icon_url: '/images/pic_040.jpg',
    parent_id: null,
    display_order: 3,
    is_active: true,
    photo_count: 2,
  },
];

export const getCategoryById = (id) => {
  return categories.find(cat => cat.id === id);
};

export const getCategoryBySlug = (slug) => {
  return categories.find(cat => cat.slug === slug);
};

export const getMainCategories = () => {
  return categories.filter(cat => cat.parent_id === null);
};

export const getSubCategories = (parentId) => {
  return categories.filter(cat => cat.parent_id === parentId);
};
