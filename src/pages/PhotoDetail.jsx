import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPhoto } from '../services/photoService';
import { useCart } from '../context/CartContext';
import { formatPrice, formatDate, formatFileSize } from '../utils/helpers';
import {
  FiHeart,
  FiShoppingCart,
  FiShare2,
  FiEye,
  FiDownload,
  FiCamera,
  FiMapPin,
  FiCalendar,
} from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Spinner from '../components/common/Spinner';
import PhotoGrid from '../components/photos/PhotoGrid';
import { allPhotos } from '../data/mockData';
import useImageProtection from '../hooks/useImageProtection';

export default function PhotoDetail() {
  // Activer la protection avancée des images
  useImageProtection({
    blockKeyboardShortcuts: true,
    blockRightClick: true,
    blockPrintScreen: false,
    showAlert: false
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState('standard');
  const [similarPhotos, setSimilarPhotos] = useState([]);

  useEffect(() => {
    loadPhoto();
  }, [id]);

  const loadPhoto = async () => {
    setLoading(true);
    try {
      const data = await getPhoto(id);
      setPhoto(data);

      // Charger photos similaires (même catégorie)
      const similar = allPhotos
        .filter(p => p.category_id === data.category_id && p.id !== data.id)
        .slice(0, 4);
      setSimilarPhotos(similar);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart({ ...photo, license_type: selectedLicense });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: photo.title,
          text: photo.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Erreur partage:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" text="Chargement de la photo..." />
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Photo introuvable</h2>
          <Button onClick={() => navigate('/search')}>Retour à la recherche</Button>
        </div>
      </div>
    );
  }

  const currentPrice =
    selectedLicense === 'extended' ? photo.price_extended : photo.price_standard;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-primary">Accueil</Link>
          <span className="mx-2">/</span>
          <Link to="/search" className="hover:text-primary">Recherche</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{photo.title}</span>
        </nav>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Image principale */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative aspect-[4/3] bg-gray-200 group">
                <img
                  src={photo.preview_url}
                  alt={photo.title}
                  className="w-full h-full object-contain"
                  onContextMenu={(e) => e.preventDefault()}
                  draggable={false}
                />

                {/* Overlay watermark */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-transparent via-transparent to-black/5">
                  <div className="absolute bottom-4 right-4 text-white/20 text-xs font-bold">
                    © POUIRE
                  </div>
                </div>

                {/* Badge Featured */}
                {photo.featured && (
                  <Badge className="absolute top-4 left-4" variant="warning">
                    ⭐ À la une
                  </Badge>
                )}
              </div>

              {/* Stats */}
              <div className="p-4 border-t flex items-center gap-6 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <FiEye />
                  {photo.views_count} vues
                </span>
                <span className="flex items-center gap-2">
                  <FiDownload />
                  {photo.sales_count} ventes
                </span>
                <span className="flex items-center gap-2">
                  <FiHeart />
                  {photo.favorites_count} favoris
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar info et achat */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
              <h1 className="text-2xl font-bold mb-4">{photo.title}</h1>

              {/* Photographe */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-lg font-bold">
                    {photo.photographer_name?.charAt(0) || 'P'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Par</p>
                  <Link
                    to={`/photographer/${photo.photographer_id}`}
                    className="font-semibold text-gray-900 hover:text-primary"
                  >
                    {photo.photographer_name || 'Photographe'}
                  </Link>
                </div>
              </div>

              {/* Choix licence */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Type de licence</label>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setSelectedLicense('standard')}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all cursor-pointer ${
                      selectedLicense === 'standard'
                        ? 'border-primary bg-primary/10 shadow-md'
                        : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold flex items-center gap-2">
                        {selectedLicense === 'standard' && (
                          <span className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <span className="w-2 h-2 bg-white rounded-full"></span>
                          </span>
                        )}
                        {selectedLicense !== 'standard' && (
                          <span className="w-4 h-4 border-2 border-gray-300 rounded-full"></span>
                        )}
                        Standard
                      </span>
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(photo.price_standard)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 ml-6">
                      Usage personnel et commercial limité
                    </p>
                  </button>

                  {photo.price_extended && (
                    <button
                      type="button"
                      onClick={() => setSelectedLicense('extended')}
                      className={`w-full p-4 border-2 rounded-lg text-left transition-all cursor-pointer ${
                        selectedLicense === 'extended'
                          ? 'border-primary bg-primary/10 shadow-md'
                          : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold flex items-center gap-2">
                          {selectedLicense === 'extended' && (
                            <span className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                              <span className="w-2 h-2 bg-white rounded-full"></span>
                            </span>
                          )}
                          {selectedLicense !== 'extended' && (
                            <span className="w-4 h-4 border-2 border-gray-300 rounded-full"></span>
                          )}
                          Extended
                        </span>
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(photo.price_extended)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 ml-6">
                        Usage commercial étendu sans limite
                      </p>
                    </button>
                  )}
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="space-y-3 mb-6">
                <Button
                  fullWidth
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2"
                >
                  <FiShoppingCart />
                  Ajouter au panier - {formatPrice(currentPrice)}
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="flex items-center justify-center gap-2"
                  >
                    {isFavorite ? (
                      <>
                        <FaHeart className="text-red-500" />
                        Retiré des favoris
                      </>
                    ) : (
                      <>
                        <FiHeart />
                        Ajouter aux favoris
                      </>
                    )}
                  </Button>

                  <Button variant="ghost" onClick={handleShare}>
                    <FiShare2 />
                  </Button>
                </div>
              </div>

              {/* Métadonnées image */}
              <div className="text-sm space-y-2 text-gray-700">
                <div className="flex items-center gap-2">
                  <FiCamera className="text-gray-400" />
                  <span>{photo.camera || 'N/A'}</span>
                </div>
                {photo.location && (
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-gray-400" />
                    <span>{photo.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-gray-400" />
                  <span>{formatDate(photo.taken_at || photo.created_at)}</span>
                </div>
                <div className="pt-2 border-t text-xs text-gray-500">
                  <p>Dimensions: {photo.width} × {photo.height}px</p>
                  <p>Format: {photo.format?.toUpperCase()}</p>
                  <p>Taille: {formatFileSize(photo.file_size)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description et tags */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h2 className="text-xl font-bold mb-4">Description</h2>
          <p className="text-gray-700 mb-6">{photo.description}</p>

          {photo.tags && photo.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {photo.tags.map((tag, index) => (
                  <Link
                    key={index}
                    to={`/search?q=${tag}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-primary-600 hover:text-white transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Photos similaires */}
        {similarPhotos.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Photos similaires</h2>
            <PhotoGrid photos={similarPhotos} />
          </div>
        )}
      </div>
    </div>
  );
}
