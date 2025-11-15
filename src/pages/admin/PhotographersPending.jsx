import React, { useState, useEffect } from 'react';
import { Check, X, Eye, User, Calendar, Mail, Phone, Globe, Instagram, Briefcase, MapPin, ExternalLink } from 'lucide-react';
import { getPendingPhotographers, approvePhotographer, rejectPhotographer } from '../../services/adminService';
import { formatDate } from '../../utils/helpers';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

export default function PhotographersPending() {
  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhotographer, setSelectedPhotographer] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [photographerToReject, setPhotographerToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadPhotographers();
  }, []);

  const loadPhotographers = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getPendingPhotographers();
      setPhotographers(data);
    } catch (err) {
      console.error('Erreur chargement photographes:', err);
      setError(err.message || 'Impossible de charger les photographes en attente');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (photographerId) => {
    try {
      await approvePhotographer(photographerId);

      // Retirer de la liste locale
      setPhotographers(prev => prev.filter(p => p.id !== photographerId));
      setSelectedPhotographer(null);

      // Afficher un message de succès
      alert('Photographe approuvé avec succès ! Le photographe peut maintenant commencer à vendre ses photos.');
    } catch (err) {
      alert(err.message || 'Erreur lors de l\'approbation');
    }
  };

  const handleRejectClick = (photographer) => {
    setPhotographerToReject(photographer);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Veuillez fournir une raison pour le rejet');
      return;
    }

    try {
      await rejectPhotographer(photographerToReject.id, rejectionReason);

      // Retirer de la liste locale
      setPhotographers(prev => prev.filter(p => p.id !== photographerToReject.id));
      setSelectedPhotographer(null);
      setShowRejectModal(false);
      setPhotographerToReject(null);
      setRejectionReason('');

      // Afficher un message de succès
      alert('Demande de photographe rejetée');
    } catch (err) {
      alert(err.message || 'Erreur lors du rejet');
    }
  };

  const PhotographerDetailModal = ({ photographer, onClose }) => {
    if (!photographer) return null;

    return (
      <Modal isOpen={!!photographer} onClose={onClose} title="Détails du photographe" size="large">
        <div className="p-6">
          {/* Photo de profil et informations principales */}
          <div className="flex items-start gap-6 mb-6 pb-6 border-b">
            <img
              src={photographer.avatar_url}
              alt={`${photographer.first_name} ${photographer.last_name}`}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {photographer.first_name} {photographer.last_name}
              </h3>
              <p className="text-lg text-gray-600 mb-2">{photographer.display_name}</p>
              <Badge variant="warning">En attente d'approbation</Badge>
            </div>
          </div>

          {/* Informations de contact */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Informations de contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{photographer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Téléphone</p>
                  <p className="font-medium">{photographer.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Localisation</p>
                  <p className="font-medium">{photographer.location || 'Non renseignée'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Nom d'utilisateur</p>
                  <p className="font-medium">@{photographer.username}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Biographie</h4>
            <p className="text-gray-700">{photographer.bio || 'Aucune biographie fournie'}</p>
          </div>

          {/* Spécialités */}
          {photographer.specialties && photographer.specialties.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Spécialités</h4>
              <div className="flex flex-wrap gap-2">
                {photographer.specialties.map((specialty, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    <Briefcase className="w-3 h-3" />
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Liens */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Liens</h4>
            <div className="space-y-2">
              {photographer.website && (
                <a
                  href={photographer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                >
                  <Globe className="w-4 h-4" />
                  <span>{photographer.website}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {photographer.instagram && (
                <a
                  href={`https://instagram.com/${photographer.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                >
                  <Instagram className="w-4 h-4" />
                  <span>{photographer.instagram}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {photographer.portfolio_url && (
                <a
                  href={photographer.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Portfolio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Informations supplémentaires</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Date d'inscription:</span>
                <span className="ml-2 font-medium">{formatDate(photographer.created_at, 'dd MMMM yyyy')}</span>
              </div>
              <div>
                <span className="text-gray-600">Dernière connexion:</span>
                <span className="ml-2 font-medium">{formatDate(photographer.last_login, 'dd MMMM yyyy HH:mm')}</span>
              </div>
              <div>
                <span className="text-gray-600">Compte vérifié:</span>
                <span className="ml-2 font-medium">{photographer.is_verified ? 'Oui' : 'Non'}</span>
              </div>
              <div>
                <span className="text-gray-600">Commission:</span>
                <span className="ml-2 font-medium">{photographer.commission_rate * 100}%</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => handleApprove(photographer.id)}
              variant="success"
              fullWidth
            >
              <Check className="w-5 h-5 mr-2" />
              Approuver
            </Button>
            <Button
              onClick={() => {
                onClose();
                handleRejectClick(photographer);
              }}
              variant="danger"
              fullWidth
            >
              <X className="w-5 h-5 mr-2" />
              Rejeter
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Demandes de photographes</h1>
        <p className="text-gray-600 mt-2">
          Approuver ou rejeter les demandes d'inscription de nouveaux photographes
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <User className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Demandes en attente d'approbation</h3>
          </div>
          <p className="text-4xl font-bold text-yellow-600">{photographers.length}</p>
        </Card>
      </div>

      {/* Liste des photographes */}
      <Card className="p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : photographers.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune demande en attente</h3>
            <p className="text-gray-500">
              Il n'y a actuellement aucune demande de photographe à traiter.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {photographers.map((photographer) => (
              <div
                key={photographer.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <img
                    src={photographer.avatar_url}
                    alt={`${photographer.first_name} ${photographer.last_name}`}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />

                  {/* Informations */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {photographer.first_name} {photographer.last_name}
                        </h3>
                        <p className="text-gray-600">{photographer.display_name}</p>
                      </div>
                      <Badge variant="warning">En attente</Badge>
                    </div>

                    <p className="text-gray-700 mb-3 line-clamp-2">{photographer.bio}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{photographer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{photographer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Inscrit le {formatDate(photographer.created_at, 'dd/MM/yyyy')}</span>
                      </div>
                    </div>

                    {/* Spécialités */}
                    {photographer.specialties && photographer.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {photographer.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSelectedPhotographer(photographer)}
                        variant="ghost"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Voir détails
                      </Button>
                      <Button
                        onClick={() => handleApprove(photographer.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approuver
                      </Button>
                      <Button
                        onClick={() => handleRejectClick(photographer)}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Rejeter
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal Détails Photographe */}
      <PhotographerDetailModal
        photographer={selectedPhotographer}
        onClose={() => setSelectedPhotographer(null)}
      />

      {/* Modal Rejet */}
      {showRejectModal && photographerToReject && (
        <Modal
          isOpen={showRejectModal}
          onClose={() => {
            setShowRejectModal(false);
            setPhotographerToReject(null);
            setRejectionReason('');
          }}
          title="Rejeter la demande"
        >
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Vous êtes sur le point de rejeter la demande de{' '}
              <strong>
                {photographerToReject.first_name} {photographerToReject.last_name}
              </strong>
              . Veuillez fournir une raison pour informer le photographe.
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
                placeholder="Ex: Portfolio insuffisant, informations incomplètes, etc."
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
                  setPhotographerToReject(null);
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
