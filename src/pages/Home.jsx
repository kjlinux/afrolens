import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as photoService from '../services/photoService';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const [featuredPhotos, recentPhotos] = await Promise.all([
        photoService.getFeatured(),
        photoService.getRecent(12),
      ]);
      setFeatured(featuredPhotos.slice(0, 6));
      setRecent(recentPhotos);
    } catch (error) {
      console.error('Erreur chargement photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const PhotoCard = ({ photo }) => (
    <Link to={`/photo/${photo.id}`} className="group card card-hover">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={photo.preview_url}
          alt={photo.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 protected-image"
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-semibold truncate">{photo.title}</h3>
            <p className="text-sm text-gray-300">{formatPrice(photo.price_standard)}</p>
          </div>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Découvrez l'Afrique en Images
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-primary-100 max-w-2xl mx-auto px-4">
              La première banque d'images professionnelles africaines
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
              <Link to="/search" className="bg-white text-primary-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center">
                Explorer les photos
              </Link>
              <Link to="/register" className="border-2 border-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors text-center">
                Devenir photographe
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-2 sm:gap-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Photos à la une</h2>
          <Link to="/search" className="text-primary-600 hover:underline text-sm sm:text-base whitespace-nowrap">
            Voir tout →
          </Link>
        </div>
        <div className="masonry-grid">
          {featured.map(photo => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      </section>

      {/* Recent */}
      <section className="bg-gray-100 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8">Nouveautés</h2>
          <div className="masonry-grid">
            {recent.map(photo => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-600">69+</div>
            <div className="text-gray-600 mt-2 text-sm sm:text-base">Photos professionnelles</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-600">10+</div>
            <div className="text-gray-600 mt-2 text-sm sm:text-base">Photographes talentueux</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-600">500+</div>
            <div className="text-gray-600 mt-2 text-sm sm:text-base">Clients satisfaits</div>
          </div>
        </div>
      </section>
    </div>
  );
}
