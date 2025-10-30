import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { formatPrice } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';

/**
 * Composant PhotoCard pour afficher une photo dans une grille
 * @param {Object} props
 * @param {Object} props.photo - Objet photo avec toutes les infos
 * @param {boolean} props.showPhotographer - Afficher le nom du photographe
 */
export default function PhotoCard({ photo, showPhotographer = true }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart } = useCart();

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
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
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
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

        {/* Overlay au hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 pointer-events-none">
          <div className="flex items-center justify-center h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-3 pointer-events-auto">
              <button
                onClick={handleAddToCart}
                className="p-3 bg-white text-gray-900 rounded-full hover:bg-primary hover:text-white transition-colors shadow-lg"
                title="Ajouter au panier"
              >
                <FiShoppingCart className="w-5 h-5" />
              </button>
              <button
                onClick={handleFavoriteClick}
                className="p-3 bg-white text-gray-900 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-lg"
                title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                {isFavorite ? (
                  <FaHeart className="w-5 h-5 text-red-500" />
                ) : (
                  <FiHeart className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Badge Featured */}
        {photo.featured && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            À la une
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {photo.title}
        </h3>

        {showPhotographer && (
          <p className="text-sm text-gray-600 mb-3">
            Par{' '}
            <span className="font-medium text-gray-900">
              {photo.photographer_name || 'Photographe'}
            </span>
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FiEye className="w-4 h-4" />
              {photo.views_count || 0}
            </span>
            <span className="flex items-center gap-1">
              <FiHeart className="w-4 h-4" />
              {photo.favorites_count || 0}
            </span>
          </div>
          <p className="text-base font-bold text-primary">
            {formatPrice(photo.price_standard)}
          </p>
        </div>
      </div>
    </Link>
  );
}
