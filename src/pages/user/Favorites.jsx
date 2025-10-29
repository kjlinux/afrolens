import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getPhotoById } from '../../data/mockData';
import { STORAGE_KEYS } from '../../utils/constants';
import PhotoGrid from '../../components/photos/PhotoGrid';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';

export default function Favorites() {
  const { user } = useAuth();
  const [favoritePhotos, setFavoritePhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent'); // recent, price_asc, price_desc, popular

  useEffect(() => {
    loadFavorites();
  }, [user]);

  const loadFavorites = () => {
    try {
      setLoading(true);

      // Récupérer les IDs des favoris depuis localStorage
      const favoritesKey = `${STORAGE_KEYS.FAVORITES}_${user.id}`;
      const storedFavorites = localStorage.getItem(favoritesKey);
      const favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];

      // Charger les photos complètes à partir des IDs
      const photos = favoriteIds
        .map(id => getPhotoById(id))
        .filter(photo => photo !== undefined); // Filtrer les photos non trouvées

      // Ajouter un timestamp pour le tri (simulé)
      const photosWithTimestamp = photos.map((photo, index) => ({
        ...photo,
        addedToFavoritesAt: Date.now() - (favoriteIds.length - index) * 86400000, // Simule des ajouts sur plusieurs jours
      }));

      setFavoritePhotos(photosWithTimestamp);
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
      setFavoritePhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (photoId) => {
    try {
      // Supprimer du localStorage
      const favoritesKey = `${STORAGE_KEYS.FAVORITES}_${user.id}`;
      const storedFavorites = localStorage.getItem(favoritesKey);
      const favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];
      const updatedIds = favoriteIds.filter(id => id !== photoId);
      localStorage.setItem(favoritesKey, JSON.stringify(updatedIds));

      // Mettre à jour l'état local
      setFavoritePhotos(prev => prev.filter(photo => photo.id !== photoId));
    } catch (error) {
      console.error('Erreur lors de la suppression du favori:', error);
    }
  };

  const clearAllFavorites = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer tous vos favoris ?')) {
      try {
        const favoritesKey = `${STORAGE_KEYS.FAVORITES}_${user.id}`;
        localStorage.removeItem(favoritesKey);
        setFavoritePhotos([]);
      } catch (error) {
        console.error('Erreur lors de la suppression des favoris:', error);
      }
    }
  };

  // Tri des photos
  const sortedPhotos = [...favoritePhotos].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return b.addedToFavoritesAt - a.addedToFavoritesAt;
      case 'price_asc':
        return a.price_standard - b.price_standard;
      case 'price_desc':
        return b.price_standard - a.price_standard;
      case 'popular':
        return (b.favorites_count || 0) - (a.favorites_count || 0);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mes Favoris</h1>
            <p className="text-gray-600">
              {favoritePhotos.length > 0
                ? `${favoritePhotos.length} photo${favoritePhotos.length > 1 ? 's' : ''} favorite${favoritePhotos.length > 1 ? 's' : ''}`
                : 'Aucune photo favorite pour le moment'
              }
            </p>
          </div>
          {favoritePhotos.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              onClick={clearAllFavorites}
            >
              <svg
                className="mr-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Tout supprimer
            </Button>
          )}
        </div>

        {/* Filtres et tri */}
        {favoritePhotos.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-gray-600 font-medium">Trier par:</span>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={sortBy === 'recent' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSortBy('recent')}
              >
                Plus récents
              </Button>
              <Button
                variant={sortBy === 'popular' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSortBy('popular')}
              >
                Plus populaires
              </Button>
              <Button
                variant={sortBy === 'price_asc' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSortBy('price_asc')}
              >
                Prix croissant
              </Button>
              <Button
                variant={sortBy === 'price_desc' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSortBy('price_desc')}
              >
                Prix décroissant
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Grille de photos ou état vide */}
      {favoritePhotos.length === 0 ? (
        <Card className="text-center py-16">
          <svg
            className="mx-auto h-20 w-20 text-gray-400 mb-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Aucune photo favorite
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Commencez à ajouter des photos à vos favoris pour les retrouver facilement ici.
            Cliquez sur l'icône de cœur sur n'importe quelle photo pour l'ajouter.
          </p>
          <Link to="/search">
            <Button size="lg">
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Explorer les photos
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Grille de photos avec bouton de suppression personnalisé */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedPhotos.map((photo) => (
              <div key={photo.id} className="relative group">
                {/* Bouton de suppression */}
                <button
                  onClick={() => removeFavorite(photo.id)}
                  className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                  title="Retirer des favoris"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                {/* Carte photo */}
                <Link
                  to={`/photo/${photo.id}`}
                  className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                    <img
                      src={photo.preview_url}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />

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

                    <p className="text-sm text-gray-600 mb-3">
                      Par{' '}
                      <span className="font-medium text-gray-900">
                        {photo.photographer_name || 'Photographe'}
                      </span>
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {photo.views_count || 0}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-primary">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                        }).format(photo.price_standard)}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Actions en bas */}
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Vous aimez ces photos ?
                </h3>
                <p className="text-gray-600">
                  Ajoutez-les à votre panier pour les acheter
                </p>
              </div>
              <Link to="/cart">
                <Button>
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Voir mon panier
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
