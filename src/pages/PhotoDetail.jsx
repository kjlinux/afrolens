import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPhoto, getSimilar, incrementViews } from '../services/photoService';
import { toggleFavorite, isFavorite } from '../services/favoritesService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useS3Image } from '../hooks/useS3Image';
import { refreshUrl } from '../services/urlRefreshService';
import { formatPrice, formatDate } from '../utils/helpers';
import {
  FiHeart,
  FiShoppingCart,
  FiShare2,
  FiEye,
  FiDownload,
  FiCamera,
  FiMapPin,
  FiCalendar,
  FiAperture,
  FiGrid,
  FiInfo,
} from 'react-icons/fi';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Spinner from '../components/common/Spinner';
import PhotoGrid from '../components/photos/PhotoGrid';
import useImageProtection from '../hooks/useImageProtection';
import ImageWatermark from '../components/photos/ImageWatermark';

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
  const { user, isAuthenticated } = useAuth();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLicense, setSelectedLicense] = useState('standard');
  const [similarPhotos, setSimilarPhotos] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const viewTracked = useRef(false);

  // Use S3 image hook for main photo preview
  const {
    imageUrl: photoPreviewUrl,
    loading: photoLoading,
    error: photoError,
    handleImageError: handlePhotoError
  } = useS3Image({
    resourceId: id,
    resourceType: 'photo',
    urlType: 'preview',
    initialUrl: photo?.preview_url,
    fetchUrlFn: (photoId) => refreshUrl(photoId, 'preview', 'photo')
  });

  // Use S3 image hook for photographer avatar
  // Only initialize when photo data is available
  const photographerId = photo?.photographer?.id;
  const photographerAvatarUrl = photo?.photographer?.avatar_url;

  const {
    imageUrl: avatarUrl,
    loading: avatarLoading,
    error: avatarError,
    handleImageError: handleAvatarError
  } = useS3Image({
    resourceId: photographerId || null,
    resourceType: 'user',
    urlType: 'avatar',
    initialUrl: photographerAvatarUrl || null,
    fetchUrlFn: photographerId ? (userId) => refreshUrl(userId, 'avatar', 'user') : null
  });

  useEffect(() => {
    loadPhoto();
  }, [id]);

  // Track view when photo is loaded
  useEffect(() => {
    if (photo && id && !viewTracked.current) {
      viewTracked.current = true;
      incrementViews(id).then((result) => {
        if (result) {
          setPhoto(prev => ({ ...prev, views_count: result.views_count }));
        }
      }).catch(console.error);
    }
  }, [photo, id]);

  // Check if photo is in favorites
  useEffect(() => {
    if (isAuthenticated && id) {
      isFavorite(id).then(setIsFavorited).catch(console.error);
    }
  }, [isAuthenticated, id]);

  // Reset view tracking when id changes
  useEffect(() => {
    viewTracked.current = false;
  }, [id]);

  const loadPhoto = async () => {
    setLoading(true);
    try {
      const data = await getPhoto(id);
      setPhoto(data);

      // Charger photos similaires via API
      const similar = await getSimilar(id, 4);
      setSimilarPhotos(similar);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/photo/${id}` } });
      return;
    }

    setFavoriteLoading(true);
    try {
      const newStatus = await toggleFavorite(id, isFavorited);
      setIsFavorited(newStatus);
      // Update favorites count
      setPhoto(prev => ({
        ...prev,
        favorites_count: newStatus
          ? (prev.favorites_count || 0) + 1
          : Math.max(0, (prev.favorites_count || 0) - 1)
      }));
    } catch (error) {
      console.error('Erreur favoris:', error);
    } finally {
      setFavoriteLoading(false);
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
                {photoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Spinner size="lg" />
                  </div>
                )}
                {photoError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <p className="text-gray-500">Image non disponible</p>
                  </div>
                )}
                {photoPreviewUrl && !photoError && (
                  <img
                    src={photoPreviewUrl}
                    alt={photo.title}
                    className="w-full h-full object-contain"
                    onContextMenu={(e) => e.preventDefault()}
                    onError={handlePhotoError}
                    draggable={false}
                  />
                )}

                {/* Filigrane Pouire */}
                <ImageWatermark
                  brandName="Pouire"
                  showPattern={true}
                  position="center"
                />

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
                {avatarLoading ? (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <Spinner size="sm" />
                  </div>
                ) : avatarUrl && !avatarError ? (
                  <img
                    src={avatarUrl}
                    alt={`${photo.photographer?.first_name} ${photo.photographer?.last_name}`}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={handleAvatarError}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-bold">
                      {photo.photographer?.first_name?.charAt(0) || 'P'}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Par</p>
                  <Link
                    to={`/photographer/${photo.photographer?.id}`}
                    className="font-semibold text-gray-900 hover:text-primary"
                  >
                    {photo.photographer ? `${photo.photographer.first_name} ${photo.photographer.last_name}` : 'Photographe'}
                  </Link>
                </div>
              </div>

              {/* Catégorie */}
              {photo.category && (
                <div className="mb-6 pb-6 border-b">
                  <p className="text-sm text-gray-600 mb-1">Catégorie</p>
                  <Link
                    to={`/search?category=${photo.category.slug}`}
                    className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
                  >
                    {photo.category.name}
                  </Link>
                </div>
              )}

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
                        <span className="relative group">
                          <FiInfo className="w-4 h-4 text-gray-400 hover:text-primary cursor-help" />
                          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                            <strong className="block mb-1">Licence Standard</strong>
                            <ul className="space-y-1 text-gray-300">
                              <li>• Usage personnel, blog, réseaux sociaux</li>
                              <li>• Tirages limités (&lt; 500 000 copies)</li>
                              <li>• Revente interdite</li>
                              <li>• Pour usage interne uniquement</li>
                            </ul>
                            <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-900"></span>
                          </span>
                        </span>
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
                          <span className="relative group">
                            <FiInfo className="w-4 h-4 text-gray-400 hover:text-primary cursor-help" />
                            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                              <strong className="block mb-1">Licence Étendue</strong>
                              <ul className="space-y-1 text-gray-300">
                                <li>• Usage commercial illimité</li>
                                <li>• Tirages illimités</li>
                                <li>• Revente autorisée (templates, merchandising)</li>
                                <li>• Produits dérivés et vendus à des tiers</li>
                              </ul>
                              <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-900"></span>
                            </span>
                          </span>
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

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={handleToggleFavorite}
                    loading={favoriteLoading}
                    className={`flex items-center justify-center gap-2 ${
                      isFavorited ? 'text-red-500 border-red-500 hover:bg-red-50' : ''
                    }`}
                  >
                    <FiHeart className={isFavorited ? 'fill-current' : ''} />
                    {isFavorited ? 'Favori' : 'Favoris'}
                  </Button>

                  <Button variant="outline" fullWidth onClick={handleShare} className="flex items-center justify-center gap-2">
                    <FiShare2 />
                    Partager
                  </Button>
                </div>
              </div>

              {/* Métadonnées image */}
              <div className="text-sm space-y-2 text-gray-700">
                {photo.camera && (
                  <div className="flex items-center gap-2">
                    <FiCamera className="text-gray-400" />
                    <span>{photo.camera}</span>
                  </div>
                )}
                {photo.lens && (
                  <div className="flex items-center gap-2">
                    <FiAperture className="text-gray-400" />
                    <span>{photo.lens}</span>
                  </div>
                )}
                {photo.location && (
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-gray-400" />
                    <span>{photo.location}</span>
                  </div>
                )}
                {(photo.taken_at || photo.created_at) && (
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-gray-400" />
                    <span>{formatDate(photo.taken_at || photo.created_at)}</span>
                  </div>
                )}

                {/* Paramètres techniques */}
                {(photo.iso || photo.aperture || photo.shutter_speed || photo.focal_length) && (
                  <div className="pt-2 border-t text-xs text-gray-500 grid grid-cols-2 gap-1">
                    {photo.iso && <p>ISO: {photo.iso}</p>}
                    {photo.aperture && <p>Ouverture: {photo.aperture}</p>}
                    {photo.shutter_speed && <p>Vitesse: {photo.shutter_speed}</p>}
                    {photo.focal_length && <p>Focale: {photo.focal_length}</p>}
                  </div>
                )}

                {/* Dimensions et format */}
                <div className="pt-2 border-t text-xs text-gray-500">
                  <p>Dimensions: {photo.width} × {photo.height}px</p>
                  <p>Format: {photo.format?.toUpperCase()}</p>
                  <p>Orientation: {photo.orientation === 'landscape' ? 'Paysage' : photo.orientation === 'portrait' ? 'Portrait' : 'Carré'}</p>
                </div>

                {/* Palette de couleurs */}
                {photo.color_palette && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500 mb-2">Palette de couleurs</p>
                    <div className="flex gap-1">
                      {(() => {
                        const colors = typeof photo.color_palette === 'string'
                          ? JSON.parse(photo.color_palette)
                          : photo.color_palette;
                        return colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded border border-gray-200"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ));
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description et tags */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h2 className="text-xl font-bold mb-4">Description</h2>
          <p className="text-gray-700 mb-6">{photo.description}</p>

          {photo.tags && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  const tags = typeof photo.tags === 'string'
                    ? JSON.parse(photo.tags)
                    : photo.tags;
                  return tags.map((tag, index) => (
                    <Link
                      key={index}
                      to={`/search?q=${tag}`}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-primary-600 hover:text-white transition-colors"
                    >
                      #{tag}
                    </Link>
                  ));
                })()}
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
