import React, { useState, useEffect } from 'react';
import { Check, X, Eye, User, Calendar, Tag, AlertCircle, Filter, Clock, MapPin } from 'lucide-react';
import { getPendingPhotos, approvePhoto, rejectPhoto, deletePhoto } from '../../services/adminService';
import { formatDate, formatPrice } from '../../utils/helpers';
import { PHOTO_STATUS } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

export default function Moderation() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [photoToReject, setPhotoToReject] = useState(null);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    loadPhotos();
  }, [filterStatus]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger toutes les photos en attente (on peut paginer si besoin)
      const data = await getPendingPhotos(1, 100);
      const allPhotos = data.data || data;

      // Filtrer par statut si nécessaire
      let filteredPhotos = allPhotos;
      if (filterStatus !== 'all' && filterStatus !== 'pending') {
        filteredPhotos = allPhotos.filter(p => p.status === filterStatus);
      }

      setPhotos(filteredPhotos);

      // Calculer les stats
      setStats({
        pending: allPhotos.filter(p => p.status === PHOTO_STATUS.PENDING).length,
        approved: allPhotos.filter(p => p.status === PHOTO_STATUS.APPROVED).length,
        rejected: allPhotos.filter(p => p.status === PHOTO_STATUS.REJECTED).length,
      });
    } catch (err) {
      console.error('Erreur chargement photos:', err);
      setError(err.message || 'Impossible de charger les photos');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (photoId) => {
    try {
      await approvePhoto(photoId);

      // Retirer de la liste locale
      setPhotos(prev => prev.filter(p => p.id !== photoId));
      setSelectedPhoto(null);

      // Afficher un message de succès
      alert('Photo approuvée avec succès !');

      // Recharger pour mettre à jour les stats
      loadPhotos();
    } catch (err) {
      alert(err.message || 'Erreur lors de l\'approbation');
    }
  };

  const handleRejectClick = (photo) => {
    setPhotoToReject(photo);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Veuillez fournir une raison pour le rejet');
      return;
    }

    try {
      await rejectPhoto(photoToReject.id, rejectionReason);

      // Retirer de la liste locale
      setPhotos(prev => prev.filter(p => p.id !== photoToReject.id));
      setSelectedPhoto(null);
      setShowRejectModal(false);
      setPhotoToReject(null);
      setRejectionReason('');

      // Afficher un message de succès
      alert('Photo rejetée avec succès');

      // Recharger pour mettre à jour les stats
      loadPhotos();
    } catch (err) {
      alert(err.message || 'Erreur lors du rejet');
    }
  };

  const getStatusBadge = (status) => {
    const configs = {
      [PHOTO_STATUS.PENDING]: { variant: 'warning', label: 'En attente' },
      [PHOTO_STATUS.APPROVED]: { variant: 'success', label: 'Approuvée' },
      [PHOTO_STATUS.REJECTED]: { variant: 'danger', label: 'Rejetée' },
    };

    const config = configs[status] || configs[PHOTO_STATUS.PENDING];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const PhotoDetailModal = ({ photo, onClose }) => {
    if (!photo) return null;

    // Les infos photographe et catégorie sont incluses dans l'objet photo
    const photographer = photo.photographer;
    const category = photo.category;

    return (
      <Modal isOpen={!!photo} onClose={onClose} title="Détails de la photo" size="large">
        <div className="p-6">
          {/* Image */}
          <div className="mb-6 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={photo.preview_url}
              alt={photo.title}
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Titre</p>
              <p className="font-semibold text-gray-900">{photo.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Statut</p>
              {getStatusBadge(photo.status)}
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Photographe</p>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-medium">
                  {photographer ? `${photographer.first_name} ${photographer.last_name}` : 'Inconnu'}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Date de soumission</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="font-medium">
                  {formatDate(photo.created_at, 'dd MMMM yyyy HH:mm')}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Catégorie</p>
              <span className="font-medium">{category?.name || 'Non définie'}</span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Prix</p>
              <div className="space-y-1">
                <p className="font-medium">Standard: {formatPrice(photo.price_standard)}</p>
                <p className="font-medium">Étendu: {formatPrice(photo.price_extended)}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Description</p>
            <p className="text-gray-900">{photo.description || 'Aucune description'}</p>
          </div>

          {/* Tags */}
          {photo.tags && photo.tags.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {photo.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Localisation */}
          {photo.location && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Localisation</p>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{photo.location}</span>
              </div>
            </div>
          )}

          {/* Métadonnées techniques */}
          {photo.metadata && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-3">Métadonnées EXIF</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {photo.metadata.camera && (
                  <div>
                    <span className="text-gray-600">Appareil:</span>
                    <span className="ml-2 font-medium">{photo.metadata.camera}</span>
                  </div>
                )}
                {photo.metadata.lens && (
                  <div>
                    <span className="text-gray-600">Objectif:</span>
                    <span className="ml-2 font-medium">{photo.metadata.lens}</span>
                  </div>
                )}
                {photo.metadata.iso && (
                  <div>
                    <span className="text-gray-600">ISO:</span>
                    <span className="ml-2 font-medium">{photo.metadata.iso}</span>
                  </div>
                )}
                {photo.metadata.aperture && (
                  <div>
                    <span className="text-gray-600">Ouverture:</span>
                    <span className="ml-2 font-medium">f/{photo.metadata.aperture}</span>
                  </div>
                )}
                {photo.metadata.shutter_speed && (
                  <div>
                    <span className="text-gray-600">Vitesse:</span>
                    <span className="ml-2 font-medium">{photo.metadata.shutter_speed}s</span>
                  </div>
                )}
                {photo.metadata.focal_length && (
                  <div>
                    <span className="text-gray-600">Focale:</span>
                    <span className="ml-2 font-medium">{photo.metadata.focal_length}mm</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Raison du rejet */}
          {photo.rejection_reason && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-900">Raison du rejet</p>
                  <p className="text-sm text-red-700 mt-1">{photo.rejection_reason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          {photo.status === PHOTO_STATUS.PENDING && (
            <div className="flex gap-3">
              <Button
                onClick={() => handleApprove(photo.id)}
                variant="success"
                fullWidth
              >
                <Check className="w-5 h-5 mr-2" />
                Approuver
              </Button>
              <Button
                onClick={() => handleRejectClick(photo)}
                variant="danger"
                fullWidth
              >
                <X className="w-5 h-5 mr-2" />
                Rejeter
              </Button>
            </div>
          )}
        </div>
      </Modal>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Modération Photos</h1>
        <p className="text-gray-600 mt-2">Approuver ou rejeter les photos soumises par les photographes</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900">En attente</h3>
          </div>
          <p className="text-4xl font-bold text-yellow-600">{stats.pending}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-green-100 rounded-lg">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Approuvées</h3>
          </div>
          <p className="text-4xl font-bold text-green-600">{stats.approved}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-red-100 rounded-lg">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Rejetées</h3>
          </div>
          <p className="text-4xl font-bold text-red-600">{stats.rejected}</p>
        </Card>
      </div>

      {/* Filtre */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-3">
          <Filter className="text-gray-400 w-5 h-5" />
          <label className="text-sm font-medium text-gray-700">Filtrer par statut:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="pending">En attente</option>
            <option value="approved">Approuvées</option>
            <option value="rejected">Rejetées</option>
            <option value="all">Toutes</option>
          </select>
          <span className="text-sm text-gray-600 ml-auto">
            {photos.length} photo{photos.length > 1 ? 's' : ''}
          </span>
        </div>
      </Card>

      {/* Grille de photos */}
      <Card className="p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune photo</h3>
            <p className="text-gray-500">
              {filterStatus === 'pending'
                ? 'Aucune photo en attente de modération'
                : `Aucune photo ${filterStatus === 'approved' ? 'approuvée' : filterStatus === 'rejected' ? 'rejetée' : ''}`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => {
              const photographer = photo.photographer;

              return (
                <div key={photo.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-gray-200">
                    <img
                      src={photo.preview_url}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(photo.status)}
                    </div>
                  </div>

                  {/* Infos */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 truncate">{photo.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <User className="w-4 h-4" />
                      <span className="truncate">
                        {photographer ? `${photographer.first_name} ${photographer.last_name}` : 'Inconnu'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSelectedPhoto(photo)}
                        variant="ghost"
                        size="sm"
                        fullWidth
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Voir
                      </Button>
                      {photo.status === PHOTO_STATUS.PENDING && (
                        <>
                          <Button
                            onClick={() => handleApprove(photo.id)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white px-3"
                            title="Approuver"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleRejectClick(photo)}
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white px-3"
                            title="Rejeter"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Modal Détails Photo */}
      <PhotoDetailModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />

      {/* Modal Rejet */}
      {showRejectModal && photoToReject && (
        <Modal
          isOpen={showRejectModal}
          onClose={() => {
            setShowRejectModal(false);
            setPhotoToReject(null);
            setRejectionReason('');
          }}
          title="Rejeter la photo"
        >
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Vous êtes sur le point de rejeter la photo "<strong>{photoToReject.title}</strong>".
              Veuillez fournir une raison pour informer le photographe.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raison du rejet <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: La qualité de l'image est insuffisante, le sujet ne correspond pas aux catégories acceptées, etc."
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={confirmReject}
                variant="danger"
                fullWidth
                disabled={!rejectionReason.trim()}
              >
                <X className="w-5 h-5 mr-2" />
                Confirmer le rejet
              </Button>
              <Button
                onClick={() => {
                  setShowRejectModal(false);
                  setPhotoToReject(null);
                  setRejectionReason('');
                }}
                variant="ghost"
                fullWidth
              >
                Annuler
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
