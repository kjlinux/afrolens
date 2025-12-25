import React, { useState, useEffect } from 'react';
import { Search, Filter, Ban, UserCheck, Camera, ShoppingCart, Eye, Mail, MapPin, Calendar, Image as ImageIcon, Check, X, Clock } from 'lucide-react';
import { getUsers, toggleUserBan, approvePhotographer, rejectPhotographer, getPendingPhotographers } from '../../services/adminService';
import { formatDate, formatNumber } from '../../utils/helpers';
import { PERMISSIONS } from '../../utils/permissions';
import { Can } from '../../components/auth';
import { usePermission } from '../../hooks/usePermission';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Spinner from '../../components/common/Spinner';

export default function Users() {
  // Permission checks
  const canViewUsers = usePermission(PERMISSIONS.VIEW_USERS);
  const canSuspendUsers = usePermission(PERMISSIONS.SUSPEND_USERS);
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showBanModal, setShowBanModal] = useState(false);
  const [userToBan, setUserToBan] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [userToReject, setUserToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingApproval, setProcessingApproval] = useState(null);
  const [pendingPhotographersCount, setPendingPhotographersCount] = useState(0);
  const [pagination, setPagination] = useState({ page: 1, perPage: 20, total: 0 });

  useEffect(() => {
    loadUsers();
  }, [searchTerm, filterRole, filterStatus, pagination.page]);

  // Charger le compteur de photographes en attente
  useEffect(() => {
    const loadPendingCount = async () => {
      try {
        const response = await getPendingPhotographers();
        const count = response?.data?.length || response?.length || 0;
        setPendingPhotographersCount(count);
      } catch (err) {
        console.error('Erreur chargement photographes en attente:', err);
      }
    };
    loadPendingCount();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {};
      if (filterRole !== 'all') filters.account_type = filterRole;
      if (filterStatus === 'pending_photographer') {
        filters.account_type = 'photographer';
        filters.photographer_status = 'pending';
      } else if (filterStatus !== 'all') {
        filters.status = filterStatus;
      }
      if (searchTerm) filters.search = searchTerm;

      const response = await getUsers(pagination.page, pagination.perPage, filters);
      // API returns: { success, data: { current_page, data: [...], total } }
      const usersData = response.data?.data || [];
      setUsers(Array.isArray(usersData) ? usersData : []);

      if (response.data) {
        setPagination(prev => ({
          ...prev,
          page: response.data.current_page || prev.page,
          total: response.data.total || 0
        }));
      }
    } catch (err) {
      console.error('Erreur chargement utilisateurs:', err);
      setError(err.message || 'Impossible de charger les utilisateurs');
      setUsers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Calcul des statistiques basé sur les utilisateurs chargés
  const stats = {
    total: pagination.total || users.length,
    buyers: users.filter(u => u.account_type === 'buyer').length,
    photographers: users.filter(u => u.account_type === 'photographer').length,
    admins: users.filter(u => u.account_type === 'admin').length,
    active: users.filter(u => u.is_active !== false).length,
    banned: users.filter(u => u.is_active === false).length,
  };

  const handleBanClick = (user) => {
    setUserToBan(user);
    setShowBanModal(true);
  };

  const confirmBan = async () => {
    try {
      const newStatus = !(userToBan.is_active !== false);
      await toggleUserBan(userToBan.id, !newStatus);

      // Mise à jour locale optimiste
      const updatedUsers = users.map(u =>
        u.id === userToBan.id ? { ...u, is_active: newStatus } : u
      );
      setUsers(updatedUsers);
      setShowBanModal(false);
      setUserToBan(null);
      toast.success(`Utilisateur ${userToBan.is_active !== false ? 'banni' : 'débanni'} avec succès`);
    } catch (err) {
      toast.error(err.message || 'Erreur lors du changement de statut');
    }
  };

  const handleApprovePhotographer = async (user) => {
    try {
      setProcessingApproval(user.id);
      await approvePhotographer(user.id);

      // Mise à jour locale
      const updatedUsers = users.map(u =>
        u.id === user.id ? { ...u, photographer_status: 'approved' } : u
      );
      setUsers(updatedUsers);
      setSelectedUser(null);
      setPendingPhotographersCount(prev => Math.max(0, prev - 1));
      toast.success(`${user.first_name} ${user.last_name} a été approuvé comme photographe`);

      // Si on est sur le filtre pending, recharger la liste
      if (filterStatus === 'pending_photographer') {
        loadUsers();
      }
    } catch (err) {
      toast.error(err.message || 'Erreur lors de l\'approbation');
    } finally {
      setProcessingApproval(null);
    }
  };

  const handleRejectClick = (user) => {
    setUserToReject(user);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const confirmRejectPhotographer = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Veuillez fournir une raison pour le rejet');
      return;
    }

    try {
      setProcessingApproval(userToReject.id);
      await rejectPhotographer(userToReject.id, rejectionReason);

      // Mise à jour locale
      const updatedUsers = users.map(u =>
        u.id === userToReject.id ? { ...u, photographer_status: 'rejected' } : u
      );
      setUsers(updatedUsers);
      setShowRejectModal(false);
      setUserToReject(null);
      setRejectionReason('');
      setSelectedUser(null);
      setPendingPhotographersCount(prev => Math.max(0, prev - 1));
      toast.success('Demande de photographe rejetée');

      // Si on est sur le filtre pending, recharger la liste
      if (filterStatus === 'pending_photographer') {
        loadUsers();
      }
    } catch (err) {
      toast.error(err.message || 'Erreur lors du rejet');
    } finally {
      setProcessingApproval(null);
    }
  };

  const getRoleBadge = (role) => {
    const configs = {
      admin: { variant: 'primary', label: 'Admin', icon: UserCheck },
      photographer: { variant: 'info', label: 'Photographe', icon: Camera },
      buyer: { variant: 'default', label: 'Acheteur', icon: ShoppingCart },
    };

    const config = configs[role] || configs.buyer;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (isActive) => {
    return isActive !== false ? (
      <Badge variant="success">Actif</Badge>
    ) : (
      <Badge variant="danger">Banni</Badge>
    );
  };

  const getPhotographerStatusBadge = (status) => {
    const configs = {
      pending: { variant: 'warning', label: 'En attente', icon: Clock },
      approved: { variant: 'success', label: 'Approuvé', icon: Check },
      rejected: { variant: 'danger', label: 'Rejeté', icon: X },
      suspended: { variant: 'danger', label: 'Suspendu', icon: Ban },
    };

    const config = configs[status] || configs.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const UserDetailModal = ({ user, onClose }) => {
    if (!user) return null;

    // Stats photographe (si disponibles dans l'objet user)
    const userStats = {
      photos: user.photos_count || 0,
      approvedPhotos: user.approved_photos_count || 0,
      totalViews: user.total_views || 0,
      totalSales: user.total_sales || 0,
    };

    return (
      <Modal isOpen={!!user} onClose={onClose} title="Détails de l'utilisateur" size="large">
        <div className="p-6">
          {/* Header utilisateur */}
          <div className="flex items-start gap-4 mb-6 pb-6 border-b">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {user.first_name[0]}{user.last_name[0]}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {user.first_name} {user.last_name}
              </h2>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                {getRoleBadge(user.account_type)}
                {getStatusBadge(user.is_active)}
                {user.account_type === 'photographer' && user.photographer_status && (
                  getPhotographerStatusBadge(user.photographer_status)
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Informations générales */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Date d'inscription</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{formatDate(user.created_at, 'dd MMMM yyyy')}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Dernière activité</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{formatDate(user.last_login || user.created_at, 'dd MMMM yyyy')}</span>
              </div>
            </div>
          </div>

          {/* Biographie si photographe */}
          {user.bio && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Biographie</p>
              <p className="text-gray-900">{user.bio}</p>
            </div>
          )}

          {/* Statistiques si photographe */}
          {user.account_type === 'photographer' && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Statistiques photographe</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    <p className="text-sm text-gray-600">Photos</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{userStats.photos}</p>
                  <p className="text-xs text-gray-500 mt-1">{userStats.approvedPhotos} approuvées</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-gray-600">Vues</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(userStats.totalViews)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingCart className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-gray-600">Ventes</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(userStats.totalSales)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCheck className="w-5 h-5 text-purple-600" />
                    <p className="text-sm text-gray-600">Taux conversion</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {userStats.totalViews > 0 ? ((userStats.totalSales / userStats.totalViews) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions d'approbation pour photographes en attente */}
          {user.account_type === 'photographer' && user.photographer_status === 'pending' && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Demande d'approbation en attente
              </h3>
              <p className="text-sm text-yellow-700 mb-4">
                Ce photographe a créé son compte et attend votre approbation pour commencer à vendre ses photos.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleApprovePhotographer(user)}
                  variant="success"
                  disabled={processingApproval === user.id}
                  className="flex-1"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {processingApproval === user.id ? 'Approbation...' : 'Approuver'}
                </Button>
                <Button
                  onClick={() => {
                    onClose();
                    handleRejectClick(user);
                  }}
                  variant="danger"
                  disabled={processingApproval === user.id}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Rejeter
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t">
            <Can permission={PERMISSIONS.SUSPEND_USERS}>
              <Button
                onClick={() => handleBanClick(user)}
                variant={user.is_active !== false ? 'warning' : 'success'}
                fullWidth
              >
                <Ban className="w-4 h-4 mr-2" />
                {user.is_active !== false ? 'Bannir' : 'Débannir'}
              </Button>
            </Can>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestion Utilisateurs</h1>
        <p className="text-gray-600 mt-2">Gérer tous les utilisateurs de la plateforme</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Acheteurs</p>
          <p className="text-2xl font-bold text-gray-700">{stats.buyers}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Photographes</p>
          <p className="text-2xl font-bold text-blue-600">{stats.photographers}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Admins</p>
          <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Actifs</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Bannis</p>
          <p className="text-2xl font-bold text-red-600">{stats.banned}</p>
        </Card>
      </div>

      {/* Alerte photographes en attente */}
      {pendingPhotographersCount > 0 && (
        <div
          onClick={() => setFilterStatus('pending_photographer')}
          className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-200 rounded-full">
                <Clock className="w-6 h-6 text-yellow-700" />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-800 text-lg">
                  {pendingPhotographersCount} photographe{pendingPhotographersCount > 1 ? 's' : ''} en attente d'approbation
                </h3>
                <p className="text-sm text-yellow-700">
                  Cliquez ici pour voir et approuver les demandes
                </p>
              </div>
            </div>
            <Button
              variant="warning"
              onClick={(e) => {
                e.stopPropagation();
                setFilterStatus('pending_photographer');
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              Voir les demandes
            </Button>
          </div>
        </div>
      )}

      {/* Barre de recherche et filtres */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Tous les rôles</option>
              <option value="buyer">Acheteurs</option>
              <option value="photographer">Photographes</option>
              <option value="admin">Admins</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="banned">Bannis</option>
              <option value="pending_photographer">📸 En attente d'approbation</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tableau des utilisateurs */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos filtres de recherche</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inscription
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-medium">
                            {user.first_name[0]}{user.last_name[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                          {user.location && (
                            <div className="text-sm text-gray-500">{user.location}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.account_type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {getStatusBadge(user.is_active)}
                        {user.account_type === 'photographer' && user.photographer_status && (
                          getPhotographerStatusBadge(user.photographer_status)
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.created_at, 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => setSelectedUser(user)}
                          size="sm"
                          variant="ghost"
                          title="Voir les détails"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {user.account_type === 'photographer' && user.photographer_status === 'pending' && (
                          <>
                            <Button
                              onClick={() => handleApprovePhotographer(user)}
                              size="sm"
                              variant="success"
                              title="Approuver le photographe"
                              disabled={processingApproval === user.id}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleRejectClick(user)}
                              size="sm"
                              variant="danger"
                              title="Rejeter la demande"
                              disabled={processingApproval === user.id}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Can permission={PERMISSIONS.SUSPEND_USERS}>
                          <Button
                            onClick={() => handleBanClick(user)}
                            size="sm"
                            variant={user.is_active !== false ? 'warning' : 'success'}
                            title={user.is_active !== false ? 'Bannir' : 'Débannir'}
                          >
                            <Ban className="w-4 h-4" />
                          </Button>
                        </Can>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal Détails Utilisateur */}
      <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />

      {/* ConfirmDialog Bannissement */}
      {showBanModal && userToBan && (
        <ConfirmDialog
          isOpen={showBanModal}
          onClose={() => {
            setShowBanModal(false);
            setUserToBan(null);
          }}
          onConfirm={confirmBan}
          title={userToBan.is_active !== false ? 'Bannir l\'utilisateur' : 'Débannir l\'utilisateur'}
          message={`Êtes-vous sûr de vouloir ${userToBan.is_active !== false ? 'bannir' : 'débannir'} ${userToBan.first_name} ${userToBan.last_name} ?`}
          confirmText={userToBan.is_active !== false ? 'Bannir' : 'Débannir'}
          variant={userToBan.is_active !== false ? 'warning' : 'info'}
        />
      )}

      {/* Modal Rejet Photographe */}
      {showRejectModal && userToReject && (
        <Modal
          isOpen={showRejectModal}
          onClose={() => {
            setShowRejectModal(false);
            setUserToReject(null);
            setRejectionReason('');
          }}
          title="Rejeter la demande de photographe"
        >
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Vous êtes sur le point de rejeter la demande de{' '}
              <strong>
                {userToReject.first_name} {userToReject.last_name}
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
                placeholder="Ex: Informations incomplètes, portfolio non conforme aux critères, etc."
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={confirmRejectPhotographer}
                variant="danger"
                fullWidth
                disabled={!rejectionReason.trim() || processingApproval === userToReject.id}
              >
                <X className="w-5 h-5 mr-2" />
                {processingApproval === userToReject.id ? 'Rejet en cours...' : 'Confirmer le rejet'}
              </Button>
              <Button
                onClick={() => {
                  setShowRejectModal(false);
                  setUserToReject(null);
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
