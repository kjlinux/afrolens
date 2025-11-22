import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Award, Image, Heart, Share2, Mail } from 'lucide-react';
import { SearchService, CategoriesService } from '../../api';
import { formatDate, formatNumber } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import PhotoGrid from '../../components/photos/PhotoGrid';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';

export default function PublicProfile() {
  const { photographerId } = useParams();
  const { user } = useAuth();
  const [photographer, setPhotographer] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // all, category
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadPhotographerData();
    loadCategories();
  }, [photographerId]);

  const loadCategories = async () => {
    try {
      const response = await CategoriesService.indexCategories();
      if (response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const loadPhotographerData = async () => {
    try {
      setLoading(true);

      // Charger les photos du photographe via SearchService
      // Les informations du photographe seront extraites des photos
      const photosResponse = await SearchService.searchPhotos(
        undefined, // query
        undefined, // categories
        photographerId, // photographer_id
        undefined, // min_price
        undefined, // max_price
        undefined, // orientation
        'date', // sort_by
        100 // per_page
      );

      const photographerPhotos = photosResponse.data || [];
      setPhotos(photographerPhotos);

      // Extraire les informations du photographe depuis la première photo
      if (photographerPhotos.length > 0 && photographerPhotos[0].photographer) {
        const photographerData = photographerPhotos[0].photographer;
        setPhotographer({
          id: photographerData.user_id || photographerId,
          first_name: photographerData.first_name || 'Photographe',
          last_name: photographerData.last_name || '',
          email: photographerData.email,
          bio: photographerData.bio,
          location: photographerData.location,
          avatar_url: photographerData.avatar_url,
          created_at: photographerData.created_at,
        });
      } else {
        // Pas de photos trouvées pour ce photographe
        setPhotographer(null);
      }

      // Simuler le statut de suivi (en production, charger depuis l'API)
      setIsFollowing(false);

    } catch (error) {
      console.error('Erreur lors du chargement du photographe:', error);
      setPhotographer(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = () => {
    // En production, appeler l'API
    setIsFollowing(!isFollowing);
  };

  const handleShare = () => {
    // Copier le lien dans le presse-papier
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Lien copié dans le presse-papier !');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (!photographer) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Photographe non trouvé</h2>
          <p className="text-gray-600 mb-6">Ce profil n'existe pas ou a été supprimé.</p>
          <Link to="/">
            <Button>Retour à l'accueil</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Calculer les statistiques du photographe
  const stats = {
    totalPhotos: photos.length,
    totalViews: photos.reduce((sum, p) => sum + (p.views_count || 0), 0),
    totalSales: photos.reduce((sum, p) => sum + (p.sales_count || 0), 0),
    followers: Math.floor(Math.random() * 500) + 100, // Simulé
  };

  // Obtenir les catégories utilisées par ce photographe
  const photographerCategories = [...new Set(photos.map(p => p.category_id))];
  const categoriesWithCounts = photographerCategories.map(catId => {
    const cat = categories.find(c => c.id === catId);
    const count = photos.filter(p => p.category_id === catId).length;
    return { ...cat, count };
  }).filter(c => c).sort((a, b) => b.count - a.count);

  // Filtrer les photos selon l'onglet actif
  const filteredPhotos = selectedCategory
    ? photos.filter(p => p.category_id === selectedCategory)
    : photos;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Cover */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold border-4 border-white">
                {photographer.first_name[0]}{photographer.last_name[0]}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">
                  {photographer.first_name} {photographer.last_name}
                </h1>
                <Badge variant="primary">Photographe</Badge>
              </div>

              {photographer.bio && (
                <p className="text-white/90 mb-4 max-w-2xl">
                  {photographer.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                {photographer.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{photographer.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Membre depuis {formatDate(photographer.created_at, 'MMMM yyyy')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  <span>{stats.totalPhotos} photos</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {user && user.id !== photographer.id && (
                <Button
                  onClick={handleFollow}
                  variant={isFollowing ? 'ghost' : 'primary'}
                  className={isFollowing ? 'bg-white/20 hover:bg-white/30 text-white' : ''}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                  {isFollowing ? 'Abonné' : 'Suivre'}
                </Button>
              )}

              <Button
                onClick={handleShare}
                variant="ghost"
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>

              {photographer.email && (
                <a href={`mailto:${photographer.email}`}>
                  <Button variant="ghost" className="bg-white/20 hover:bg-white/30 text-white">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalPhotos)}</p>
              <p className="text-sm text-gray-600 mt-1">Photos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalViews)}</p>
              <p className="text-sm text-gray-600 mt-1">Vues</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalSales)}</p>
              <p className="text-sm text-gray-600 mt-1">Ventes</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.followers)}</p>
              <p className="text-sm text-gray-600 mt-1">Abonnés</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories Filter */}
        {categoriesWithCounts.length > 0 && (
          <Card className="p-4 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Catégories:</span>
              <Button
                size="sm"
                variant={!selectedCategory ? 'primary' : 'ghost'}
                onClick={() => setSelectedCategory(null)}
              >
                Toutes ({photos.length})
              </Button>
              {categoriesWithCounts.map(cat => (
                <Button
                  key={cat.id}
                  size="sm"
                  variant={selectedCategory === cat.id ? 'primary' : 'ghost'}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name} ({cat.count})
                </Button>
              ))}
            </div>
          </Card>
        )}

        {/* Photos Grid */}
        {filteredPhotos.length === 0 ? (
          <Card className="p-12 text-center">
            <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune photo</h3>
            <p className="text-gray-600">
              {selectedCategory
                ? 'Aucune photo dans cette catégorie pour le moment.'
                : 'Ce photographe n\'a pas encore publié de photos.'}
            </p>
          </Card>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedCategory
                  ? `${categoriesWithCounts.find(c => c.id === selectedCategory)?.name} (${filteredPhotos.length})`
                  : `Toutes les photos (${filteredPhotos.length})`}
              </h2>
            </div>
            <PhotoGrid photos={filteredPhotos} />
          </>
        )}
      </div>
    </div>
  );
}
