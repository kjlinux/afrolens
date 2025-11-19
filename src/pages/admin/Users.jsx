import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Ban, Trash2, UserCheck, Camera, ShoppingCart, Eye, Mail, MapPin, Calendar, Image as ImageIcon } from 'lucide-react';
import { getUsers, deleteUser, toggleUserBan, updateUser } from '../../services/adminService';
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

export default function Users() {
  // Permission checks
  const canViewUsers = usePermission(PERMISSIONS.VIEW_USERS);
  const canEditUsers = usePermission(PERMISSIONS.EDIT_USERS);
  const canSuspendUsers = usePermission(PERMISSIONS.SUSPEND_USERS);
  const canDeleteUsers = usePermission(PERMISSIONS.DELETE_USERS);
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showMenu, setShowMenu] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToBan, setUserToBan] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, perPage: 20, total: 0 });

  useEffect(() => {
    loadUsers();
  }, [searchTerm, filterRole, filterStatus, pagination.page]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {};
      if (filterRole !== 'all') filters.role = filterRole;
      if (filterStatus !== 'all') filters.status = filterStatus;
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
    buyers: users.filter(u => u.role === 'buyer').length,
    photographers: users.filter(u => u.role === 'photographer').length,
    admins: users.filter(u => u.role === 'admin').length,
    active: users.filter(u => u.is_active !== false).length,
    banned: users.filter(u => u.is_active === false).length,
  };

  const handleBanClick = (user) => {
    setUserToBan(user);
    setShowBanModal(true);
    setShowMenu(null);
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

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
    setShowMenu(null);
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(userToDelete.id);

      const updatedUsers = users.filter(u => u.id !== userToDelete.id);
      setUsers(updatedUsers);
      setShowDeleteModal(false);
      setUserToDelete(null);
      toast.success('Utilisateur supprimé avec succès');
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleChangeRole = async (user, newRole) => {
    // TODO: Implement role change when API endpoint is available
    toast.info('La modification de rôle n\'est pas encore disponible dans l\'API');
    return;

    // if (!window.confirm(`Changer le rôle de ${user.first_name} ${user.last_name} en "${newRole}" ?`)) {
    //   return;
    // }

    // try {
    //   await updateUser(user.id, { role: newRole });

    //   const updatedUsers = users.map(u =>
    //     u.id === user.id ? { ...u, role: newRole } : u
    //   );
    //   setUsers(updatedUsers);
    //   setShowMenu(null);
    //   alert('Rôle modifié avec succès');
    // } catch (err) {
    //   alert(err.message || 'Erreur lors du changement de rôle');
    // }
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
              <div className="flex items-center gap-3 mb-3">
                {getRoleBadge(user.role)}
                {getStatusBadge(user.is_active)}
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
          {user.role === 'photographer' && (
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

            <Can permission={PERMISSIONS.DELETE_USERS}>
              <Button
                onClick={() => {
                  onClose();
                  handleDeleteClick(user);
                }}
                variant="danger"
                fullWidth
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
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
            </select>
          </div>
        </div>
      </Card>

      {/* Tableau des utilisateurs */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.is_active)}
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
                        <div className="relative">
                          <button
                            onClick={() => setShowMenu(showMenu === user.id ? null : user.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {showMenu === user.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowMenu(null)}
                              ></div>
                              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-20 border">
                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      const newRole = user.role === 'photographer' ? 'buyer' : 'photographer';
                                      handleChangeRole(user, newRole);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                  >
                                    <UserCheck className="w-4 h-4" />
                                    Changer en {user.role === 'photographer' ? 'Acheteur' : 'Photographe'}
                                  </button>
                                  <button
                                    onClick={() => handleBanClick(user)}
                                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                                      user.is_active !== false
                                        ? 'text-orange-600 hover:bg-orange-50'
                                        : 'text-green-600 hover:bg-green-50'
                                    }`}
                                  >
                                    <Ban className="w-4 h-4" />
                                    {user.is_active !== false ? 'Bannir' : 'Débannir'}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteClick(user)}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Supprimer
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
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

      {/* Modal Suppression */}
      {showDeleteModal && userToDelete && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setUserToDelete(null);
          }}
          title="Supprimer l'utilisateur"
        >
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Êtes-vous sûr de vouloir supprimer définitivement <strong>{userToDelete.first_name} {userToDelete.last_name}</strong> ?
              Cette action est irréversible et supprimera également toutes les données associées (photos, commandes, etc.).
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800 font-medium">
                ⚠️ Cette action est irréversible
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={confirmDelete}
                variant="danger"
                fullWidth
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Confirmer la suppression
              </Button>
              <Button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
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
    </div>
  );
}
