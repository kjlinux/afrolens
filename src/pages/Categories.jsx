import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiCamera,
  FiUsers,
  FiTrendingUp,
  FiSun,
  FiMapPin,
  FiFeather,
  FiHeart,
  FiActivity,
  FiMusic,
  FiHome,
  FiShoppingBag,
  FiDroplet
} from 'react-icons/fi';

export default function Categories() {
  const categories = [
    {
      id: 'portraits',
      name: 'Portraits',
      description: 'Des portraits authentiques qui capturent l\'essence de l\'Afrique',
      icon: FiUsers,
      photoCount: 1245,
      color: 'from-pink-500 to-rose-500',
      image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800'
    },
    {
      id: 'paysages',
      name: 'Paysages',
      description: 'La beauté naturelle du continent africain',
      icon: FiSun,
      photoCount: 892,
      color: 'from-green-500 to-emerald-500',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800'
    },
    {
      id: 'culture',
      name: 'Culture & Traditions',
      description: 'Célébrations, rituels et patrimoine culturel',
      icon: FiMusic,
      photoCount: 756,
      color: 'from-orange-500 to-amber-500',
      image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800'
    },
    {
      id: 'urbain',
      name: 'Urbain & Architecture',
      description: 'Les villes africaines modernes et leur architecture',
      icon: FiHome,
      photoCount: 634,
      color: 'from-slate-500 to-gray-500',
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800'
    },
    {
      id: 'wildlife',
      name: 'Faune & Safari',
      description: 'La vie sauvage africaine dans toute sa splendeur',
      icon: FiFeather,
      photoCount: 1089,
      color: 'from-yellow-500 to-orange-500',
      image: 'https://images.unsplash.com/photo-1516571748831-5d81767b788d?w=800'
    },
    {
      id: 'mode',
      name: 'Mode & Lifestyle',
      description: 'Style, mode et tendances africaines',
      icon: FiShoppingBag,
      photoCount: 923,
      color: 'from-purple-500 to-pink-500',
      image: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?w=800'
    },
    {
      id: 'nature',
      name: 'Nature & Environnement',
      description: 'Flore, faune et écosystèmes africains',
      icon: FiDroplet,
      photoCount: 567,
      color: 'from-teal-500 to-cyan-500',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800'
    },
    {
      id: 'sport',
      name: 'Sport & Action',
      description: 'Moments sportifs et activités dynamiques',
      icon: FiActivity,
      photoCount: 445,
      color: 'from-red-500 to-rose-500',
      image: 'https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=800'
    },
    {
      id: 'evenements',
      name: 'Événements',
      description: 'Mariages, festivals et célébrations',
      icon: FiHeart,
      photoCount: 812,
      color: 'from-indigo-500 to-purple-500',
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800'
    },
    {
      id: 'business',
      name: 'Business & Entrepreneuriat',
      description: 'Le dynamisme économique africain',
      icon: FiTrendingUp,
      photoCount: 398,
      color: 'from-blue-500 to-indigo-500',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800'
    },
    {
      id: 'voyage',
      name: 'Voyage & Tourisme',
      description: 'Destinations et expériences de voyage',
      icon: FiMapPin,
      photoCount: 701,
      color: 'from-cyan-500 to-blue-500',
      image: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=800'
    },
    {
      id: 'art',
      name: 'Art & Créativité',
      description: 'Expressions artistiques et créations africaines',
      icon: FiCamera,
      photoCount: 534,
      color: 'from-fuchsia-500 to-pink-500',
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800'
    }
  ];

  const totalPhotos = categories.reduce((sum, cat) => sum + cat.photoCount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Catégories</h1>
          <p className="text-xl max-w-3xl mb-4">
            Explorez notre collection organisée de photos professionnelles africaines.
          </p>
          <p className="text-lg opacity-90">
            {totalPhotos.toLocaleString()} photos réparties dans {categories.length} catégories
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.id}
                to={`/search?category=${category.id}`}
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Background Image with Overlay */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-60 group-hover:opacity-70 transition-opacity`}></div>

                  {/* Icon */}
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>

                  {/* Photo Count Badge */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-gray-900">
                      {category.photoCount.toLocaleString()} photos
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {category.description}
                  </p>
                </div>

                {/* Hover Effect Arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-primary-600 text-white p-2 rounded-full">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Popular Categories Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Catégories populaires</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {categories
              .sort((a, b) => b.photoCount - a.photoCount)
              .slice(0, 3)
              .map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <div key={category.id} className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${category.color} text-white mb-4`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <Link
                      to={`/search?category=${category.id}`}
                      className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center"
                    >
                      Explorer
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FiCamera className="w-16 h-16 text-primary-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Vous ne trouvez pas ce que vous cherchez ?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Utilisez notre recherche avancée pour trouver exactement ce dont vous avez besoin.
          </p>
          <Link
            to="/search"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Recherche avancée
          </Link>
        </div>
      </div>
    </div>
  );
}
