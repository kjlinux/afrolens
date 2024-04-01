import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { formatPrice } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import ImageWatermark from './ImageWatermark';
import Spinner from '../common/Spinner';

/**
 * Composant PhotoCard pour afficher une photo dans une grille
 * @param {Object} props
 * @param {Object} props.photo - Objet photo avec toutes les infos
 * @param {boolean} props.showPhotographer - Afficher le nom du photographe
 */
export default function PhotoCard({ photo, showPhotographer = true }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const photoIsFavorite = isFavorite(photo.id);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Require authentication
    if (!user) {
      return;
    }

    try {
      await toggleFavorite(photo.id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(photo);
  };

  return (
    <Link
      to={`/photo/${photo.id}`}
      className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner size="md" />
          </div>
        )}
        <img
          src={photo.preview_url}
          alt={photo.title}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 protected-image ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          draggable={false}
          loading="lazy"
        />

        {/* Filigrane Pouire */}
        <ImageWatermark
          brandName="Pouire"
          showPattern={true}
          position="center"
        />

        {/* Overlay au hover - Desktop only */}
        <div className="hidden sm:block absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 pointer-events-none">
          <div className="flex items-center justify-center h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-2 sm:gap-3 pointer-events-auto">
              <button
                onClick={handleAddToCart}
                className="p-2 sm:p-3 bg-white text-gray-900 rounded-full hover:bg-primary-600 hover:text-white transition-colors shadow-lg"
                title="Ajouter au panier"
              >
                <FiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={handleFavoriteClick}
                className="p-2 sm:p-3 bg-white text-gray-900 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-lg"
                title={photoIsFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                {photoIsFavorite ? (
                  <FaHeart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                ) : (
                  <FiHeart className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Action Buttons - Always visible on mobile */}
        <div className="sm:hidden absolute bottom-2 right-2 flex gap-2">
          <button
            onClick={handleAddToCart}
            className="p-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full shadow-lg active:scale-95 transition-transform"
            title="Ajouter au panier"
          >
            <FiShoppingCart className="w-4 h-4" />
          </button>
          <button
            onClick={handleFavoriteClick}
            className="p-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full shadow-lg active:scale-95 transition-transform"
            title={photoIsFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            {photoIsFavorite ? (
              <FaHeart className="w-4 h-4 text-red-500" />
            ) : (
              <FiHeart className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Badge Featured */}
        {photo.featured && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-yellow-500 text-white text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
            À la une
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {photo.title}
        </h3>

        {showPhotographer && (
          <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 truncate">
            Par{' '}
            <span className="font-medium text-gray-900">
              {photo.photographer
                ? `${photo.photographer.first_name} ${photo.photographer.last_name}`
                : photo.photographer_name || 'Photographe'}
            </span>
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FiEye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">{photo.views_count || 0}</span>
            </span>
            <span className="flex items-center gap-1">
              <FiHeart className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">{photo.favorites_count || 0}</span>
            </span>
          </div>
          <p className="text-sm sm:text-base font-bold text-primary">
            {formatPrice(photo.price_standard)}
          </p>
        </div>
      </div>
    </Link>
  );
}
