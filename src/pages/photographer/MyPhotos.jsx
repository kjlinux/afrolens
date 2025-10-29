import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { photos, getPhotosByPhotographer } from '../../data/mockData';
import { formatPrice, formatDate, formatNumber } from '../../utils/helpers';
import { PHOTO_STATUS } from '../../utils/constants';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

export default function MyPhotos() {
  const { user } = useAuth();
  const [myPhotos, setMyPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [filterStatus, setFilterStatus] = useState('all'); // all, approved, pending, rejected
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // recent, sales, views, price
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);

  useEffect(() => {
    loadPhotos();
  }, [user]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      // En production, appeler l'API
      const data = getPhotosByPhotographer(user.id);
      setMyPhotos(data);
    } catch (error) {
      console.error('Erreur lors du chargement des photos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrage et tri
  const filteredPhotos = myPhotos
    .filter(photo => {
      // Filtre par statut
      if (filterStatus !== 'all' && photo.status !== filterStatus) return false;

      // Filtre par recherche
      if (searchQuery && !photo.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'sales':
          return (b.sales_count || 0) - (a.sales_count || 0);
        case 'views':
          return (b.views_count || 0) - (a.views_count || 0);
        case 'price':
          return b.price_standard - a.price_standard;
        default:
          return 0;
      }
    });

  const getStatusBadge = (status) => {
    const configs = {
      [PHOTO_STATUS.APPROVED]: { variant: 'success', label: 'Approuvée' },
      [PHOTO_STATUS.PENDING]: { variant: 'warning', label: 'En attente' },
      [PHOTO_STATUS.REJECTED]: { variant: 'danger', label: 'Rejetée' },
    };
    const config = configs[status] || configs[PHOTO_STATUS.PENDING];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleSelectPhoto = (photoId) => {
    setSelectedPhotos(prev =>
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPhotos.length === filteredPhotos.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(filteredPhotos.map(p => p.id));
    }
  };

  const handleDeletePhoto = (photo) => {
    setPhotoToDelete(photo);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // En production, appeler l'API pour supprimer
    setMyPhotos(prev => prev.filter(p => p.id !== photoToDelete.id));
    setShowDeleteModal(false);
    setPhotoToDelete(null);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Supprimer ${selectedPhotos.length} photo(s) ?`)) {
      setMyPhotos(prev => prev.filter(p => !selectedPhotos.includes(p.id)));
      setSelectedPhotos([]);
    }
  };

  const stats = {
    total: myPhotos.length,
    approved: myPhotos.filter(p => p.status === PHOTO_STATUS.APPROVED).length,
    pending: myPhotos.filter(p => p.status === PHOTO_STATUS.PENDING).length,
    rejected: myPhotos.filter(p => p.status === PHOTO_STATUS.REJECTED).length,
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mes Photos</h1>
            <p className="text-gray-600">
              Gérez votre portfolio de {myPhotos.length} photo{myPhotos.length > 1 ? 's' : ''}
            </p>
          </div>
          <Link to="/photographer/upload">
            <Button>
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Uploader une photo
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Approuvées</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">En attente</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Rejetées</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card className="p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Recherche */}
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Rechercher une photo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>

          {/* Filtres de statut */}
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'Toutes' },
              { value: PHOTO_STATUS.APPROVED, label: 'Approuvées' },
              { value: PHOTO_STATUS.PENDING, label: 'En attente' },
              { value: PHOTO_STATUS.REJECTED, label: 'Rejetées' },
            ].map(filter => (
              <Button
                key={filter.value}
                variant={filterStatus === filter.value ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilterStatus(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Tri */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="recent">Plus récentes</option>
            <option value="sales">Plus vendues</option>
            <option value="views">Plus vues</option>
            <option value="price">Prix décroissant</option>
          </select>

          {/* Mode d'affichage */}
          <div className="flex gap-1 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Actions en masse */}
        {selectedPhotos.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {selectedPhotos.length} photo{selectedPhotos.length > 1 ? 's' : ''} sélectionnée{selectedPhotos.length > 1 ? 's' : ''}
            </span>
            <Button variant="danger" size="sm" onClick={handleBulkDelete}>
              Supprimer la sélection
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedPhotos([])}>
              Annuler
            </Button>
          </div>
        )}
      </Card>

      {/* Liste des photos */}
      {filteredPhotos.length === 0 ? (
        <Card className="p-12 text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune photo trouvée</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || filterStatus !== 'all'
              ? 'Essayez de modifier vos filtres'
              : 'Commencez par uploader votre première photo'
            }
          </p>
          {!searchQuery && filterStatus === 'all' && (
            <Link to="/photographer/upload">
              <Button>Uploader une photo</Button>
            </Link>
          )}
        </Card>
      ) : viewMode === 'grid' ? (
        // Vue grille
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhotos.map(photo => (
            <Card key={photo.id} className="overflow-hidden group">
              {/* Image */}
              <div className="relative aspect-[4/3] bg-gray-200">
                <img
                  src={photo.preview_url}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />

                {/* Checkbox de sélection */}
                <div className="absolute top-3 left-3">
                  <input
                    type="checkbox"
                    checked={selectedPhotos.includes(photo.id)}
                    onChange={() => handleSelectPhoto(photo.id)}
                    className="w-5 h-5 rounded border-2 border-white shadow-lg"
                  />
                </div>

                {/* Badge de statut */}
                <div className="absolute top-3 right-3">
                  {getStatusBadge(photo.status)}
                </div>

                {/* Overlay avec actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Link to={`/photo/${photo.id}`}>
                    <button className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors" title="Voir">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </Link>
                  <button
                    onClick={() => setEditingPhoto(photo)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    title="Modifier"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeletePhoto(photo)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Supprimer"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Infos */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {photo.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>{formatDate(photo.created_at, 'dd MMM yyyy')}</span>
                  <span className="font-semibold text-primary">{formatPrice(photo.price_standard)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {formatNumber(photo.views_count || 0)}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {photo.sales_count || 0}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        // Vue liste
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedPhotos.length === filteredPhotos.length && filteredPhotos.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Photo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vues</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ventes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPhotos.map(photo => (
                  <tr key={photo.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPhotos.includes(photo.id)}
                        onChange={() => handleSelectPhoto(photo.id)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={photo.preview_url}
                          alt={photo.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{photo.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{photo.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(photo.status)}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {formatPrice(photo.price_standard)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatNumber(photo.views_count || 0)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {photo.sales_count || 0}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {formatDate(photo.created_at, 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/photo/${photo.id}`}>
                          <button className="p-2 text-gray-600 hover:text-primary" title="Voir">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </Link>
                        <button
                          onClick={() => setEditingPhoto(photo)}
                          className="p-2 text-gray-600 hover:text-primary"
                          title="Modifier"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeletePhoto(photo)}
                          className="p-2 text-red-600 hover:text-red-700"
                          title="Supprimer"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal de suppression */}
      {showDeleteModal && photoToDelete && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Supprimer la photo"
        >
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer "<strong>{photoToDelete.title}</strong>" ?
              Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <Button variant="danger" onClick={confirmDelete} fullWidth>
                Supprimer
              </Button>
              <Button variant="ghost" onClick={() => setShowDeleteModal(false)} fullWidth>
                Annuler
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
