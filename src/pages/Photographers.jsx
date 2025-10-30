import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCamera, FiMapPin, FiImage, FiHeart, FiSearch } from 'react-icons/fi';

export default function Photographers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');

  // Données de démonstration - à remplacer par des données réelles depuis l'API
  const photographers = [
    {
      id: 1,
      name: 'Amadou Diallo',
      country: 'Sénégal',
      city: 'Dakar',
      photoCount: 245,
      likes: 1520,
      avatar: 'https://i.pravatar.cc/150?img=1',
      coverImage: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800',
      specialty: 'Paysages & Nature'
    },
    {
      id: 2,
      name: 'Fatima Ndiaye',
      country: 'Côte d\'Ivoire',
      city: 'Abidjan',
      photoCount: 312,
      likes: 2180,
      avatar: 'https://i.pravatar.cc/150?img=5',
      coverImage: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?w=800',
      specialty: 'Portraits & Mode'
    },
    {
      id: 3,
      name: 'Kwame Mensah',
      country: 'Ghana',
      city: 'Accra',
      photoCount: 189,
      likes: 1340,
      avatar: 'https://i.pravatar.cc/150?img=3',
      coverImage: 'https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=800',
      specialty: 'Culture & Traditions'
    },
    {
      id: 4,
      name: 'Amina Hassan',
      country: 'Kenya',
      city: 'Nairobi',
      photoCount: 428,
      likes: 3250,
      avatar: 'https://i.pravatar.cc/150?img=9',
      coverImage: 'https://images.unsplash.com/photo-1516571748831-5d81767b788d?w=800',
      specialty: 'Wildlife & Safari'
    },
    {
      id: 5,
      name: 'Jean-Pierre Tshimanga',
      country: 'RD Congo',
      city: 'Kinshasa',
      photoCount: 267,
      likes: 1890,
      avatar: 'https://i.pravatar.cc/150?img=7',
      coverImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
      specialty: 'Urbain & Architecture'
    },
    {
      id: 6,
      name: 'Zainab Mohammed',
      country: 'Nigeria',
      city: 'Lagos',
      photoCount: 356,
      likes: 2670,
      avatar: 'https://i.pravatar.cc/150?img=10',
      coverImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800',
      specialty: 'Événements & Célébrations'
    },
    {
      id: 7,
      name: 'Omar Benali',
      country: 'Maroc',
      city: 'Casablanca',
      photoCount: 198,
      likes: 1450,
      avatar: 'https://i.pravatar.cc/150?img=12',
      coverImage: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=800',
      specialty: 'Architecture & Patrimoine'
    },
    {
      id: 8,
      name: 'Thandiwe Khumalo',
      country: 'Afrique du Sud',
      city: 'Cape Town',
      photoCount: 401,
      likes: 3120,
      avatar: 'https://i.pravatar.cc/150?img=8',
      coverImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800',
      specialty: 'Mode & Lifestyle'
    }
  ];

  const countries = ['all', 'Sénégal', 'Côte d\'Ivoire', 'Ghana', 'Kenya', 'RD Congo', 'Nigeria', 'Maroc', 'Afrique du Sud'];

  const filteredPhotographers = photographers.filter(photographer => {
    const matchesSearch = photographer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photographer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photographer.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || photographer.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Nos Photographes</h1>
          <p className="text-xl max-w-3xl">
            Découvrez les talents qui font vivre POUIRE. Chaque photographe apporte sa vision unique
            de l'Afrique et de sa diversité culturelle.
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par nom, ville ou spécialité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Country Filter */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Tous les pays</option>
              {countries.slice(1).map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <p className="text-gray-600 mt-4">
            {filteredPhotographers.length} photographe{filteredPhotographers.length > 1 ? 's' : ''} trouvé{filteredPhotographers.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Photographers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredPhotographers.length === 0 ? (
          <div className="text-center py-16">
            <FiCamera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun photographe trouvé</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPhotographers.map(photographer => (
              <Link
                key={photographer.id}
                to={`/photographer/${photographer.id}`}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={photographer.coverImage}
                    alt={`Travaux de ${photographer.name}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                  {/* Avatar */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                    <img
                      src={photographer.avatar}
                      alt={photographer.name}
                      className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="pt-12 pb-6 px-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {photographer.name}
                  </h3>

                  <div className="flex items-center justify-center text-gray-600 mb-3">
                    <FiMapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{photographer.city}, {photographer.country}</span>
                  </div>

                  <p className="text-sm text-primary-600 font-medium mb-4">
                    {photographer.specialty}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <FiImage className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {photographer.photoCount} photos
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiHeart className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {photographer.likes.toLocaleString()} likes
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FiCamera className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Vous êtes photographe ?</h2>
          <p className="text-xl mb-8">
            Rejoignez notre communauté de talents et partagez vos œuvres avec le monde entier.
          </p>
          <Link
            to="/become-photographer"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Devenir photographe sur POUIRE
          </Link>
        </div>
      </div>
    </div>
  );
}
