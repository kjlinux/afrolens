import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  Eye,
  DollarSign,
  Clock,
  User,
  Calendar,
  CreditCard,
  Smartphone,
  Building2,
  AlertCircle,
  Filter,
} from "lucide-react";
import {
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  completeWithdrawal,
} from "../../services/adminService";
import { formatPrice, formatDate } from "../../utils/helpers";
import { useToast } from "../../contexts/ToastContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Modal from "../../components/common/Modal";
import Spinner from "../../components/common/Spinner";

export default function Withdrawals() {
  const { toast } = useToast();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [withdrawalToProcess, setWithdrawalToProcess] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [notes, setNotes] = useState("");
  const [stats, setStats] = useState({ pending: 0, pendingAmount: 0, completed: 0, rejected: 0 });

  useEffect(() => {
    loadWithdrawals();
  }, [filterStatus]);

  const loadWithdrawals = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger tous les retraits ou filtrer par statut
      const status = filterStatus === "all" ? undefined : filterStatus;
      const response = await getAllWithdrawals(status);
      // API returns: { success, data: { current_page, data: [...], total } }
      const allWithdrawals = response.data?.data || [];

      // Parser payment_details et trier par date (plus récent en premier)
      const parsedWithdrawals = Array.isArray(allWithdrawals)
        ? allWithdrawals.map(w => ({
            ...w,
            payment_details: typeof w.payment_details === 'string'
              ? JSON.parse(w.payment_details)
              : w.payment_details || {}
          }))
        : [];

      const sortedWithdrawals = [...parsedWithdrawals].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setWithdrawals(sortedWithdrawals);

      // Calculer les stats
      if (Array.isArray(allWithdrawals)) {
        setStats({
          pending: allWithdrawals.filter((w) => w.status === "pending").length,
          pendingAmount: allWithdrawals
            .filter((w) => w.status === "pending")
            .reduce((sum, w) => sum + (w.amount || 0), 0),
          completed: allWithdrawals.filter((w) => w.status === "completed").length,
          rejected: allWithdrawals.filter((w) => w.status === "rejected").length,
        });
      }
    } catch (err) {
      console.error("Erreur chargement retraits:", err);
      setError(err.message || "Impossible de charger les retraits");
      setWithdrawals([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClick = (withdrawal) => {
    setWithdrawalToProcess(withdrawal);
    setTransactionId("");
    setNotes("");
    setShowApproveModal(true);
  };

  const confirmApprove = async () => {
    if (!transactionId.trim()) {
      toast.warning("Veuillez fournir un ID de transaction");
      return;
    }

    try {
      await completeWithdrawal(withdrawalToProcess.id, transactionId);

      setSelectedWithdrawal(null);
      setShowApproveModal(false);
      setWithdrawalToProcess(null);
      setTransactionId("");
      setNotes("");

      // Afficher un message de succès
      toast.success("Demande de retrait approuvée et paiement effectué !");

      // Recharger
      loadWithdrawals();
    } catch (err) {
      toast.error(err.message || "Erreur lors de l'approbation");
    }
  };

  const handleRejectClick = (withdrawal) => {
    setWithdrawalToProcess(withdrawal);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      toast.warning("Veuillez fournir une raison pour le rejet");
      return;
    }

    try {
      await rejectWithdrawal(withdrawalToProcess.id, rejectionReason);

      setSelectedWithdrawal(null);
      setShowRejectModal(false);
      setWithdrawalToProcess(null);
      setRejectionReason("");

      // Afficher un message de succès
      toast.success("Demande de retrait rejetée");

      // Recharger
      loadWithdrawals();
    } catch (err) {
      toast.error(err.message || "Erreur lors du rejet");
    }
  };

  const getStatusBadge = (status) => {
    const configs = {
      pending: { variant: "warning", label: "En attente" },
      completed: { variant: "success", label: "Complété" },
      rejected: { variant: "danger", label: "Rejeté" },
      approved: { variant: "info", label: "Approuvé" },
    };

    const config = configs[status] || configs.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "mobile_money":
        return <Smartphone className="w-5 h-5" />;
      case "bank_transfer":
        return <Building2 className="w-5 h-5" />;
      case "card":
        return <CreditCard className="w-5 h-5" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case "mobile_money":
        return "Mobile Money";
      case "bank_transfer":
        return "Virement bancaire";
      case "card":
        return "Carte bancaire";
      default:
        return method;
    }
  };

  const WithdrawalDetailModal = ({ withdrawal, onClose }) => {
    if (!withdrawal) return null;

    // Les infos photographe sont incluses dans l'objet withdrawal
    const photographer = withdrawal.photographer || withdrawal.user;

    return (
      <Modal
        isOpen={!!withdrawal}
        onClose={onClose}
        title="Détails de la demande"
        size="large"
      >
        <div className="p-6">
          {/* Informations photographe */}
          <div className="mb-6 pb-6 border-b">
            <h4 className="font-semibold text-gray-900 mb-3">Photographe</h4>
            <div className="flex items-center gap-4">
              <img
                src={photographer?.avatar_url}
                alt={photographer?.display_name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-900">
                  {photographer?.first_name} {photographer?.last_name}
                </p>
                <p className="text-sm text-gray-600">
                  {photographer?.display_name}
                </p>
              </div>
            </div>
          </div>

          {/* Montant et statut */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Montant demandé</p>
              <p className="text-2xl font-bold text-primary-600">
                {formatPrice(withdrawal.amount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Statut</p>
              {getStatusBadge(withdrawal.status)}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Date de demande</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="font-medium">
                  {formatDate(withdrawal.created_at, "dd MMMM yyyy HH:mm")}
                </span>
              </div>
            </div>
            {withdrawal.processed_at && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Date de traitement</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">
                    {formatDate(withdrawal.processed_at, "dd MMMM yyyy HH:mm")}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Méthode de paiement */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              {getPaymentMethodIcon(withdrawal.payment_method)}
              <h4 className="font-semibold text-gray-900">
                {getPaymentMethodLabel(withdrawal.payment_method)}
              </h4>
            </div>

            {withdrawal.payment_method === "mobile_money" && (
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Opérateur:</span>
                  <span className="ml-2 font-medium">
                    {withdrawal.payment_details.operator_name || withdrawal.payment_details.operator?.replace(/_/g, " ")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Numéro:</span>
                  <span className="ml-2 font-medium">
                    {withdrawal.payment_details.phone}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Nom:</span>
                  <span className="ml-2 font-medium">
                    {withdrawal.payment_details.account_name}
                  </span>
                </div>
              </div>
            )}

            {withdrawal.payment_method === "bank_transfer" && (
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Banque:</span>
                  <span className="ml-2 font-medium">
                    {withdrawal.payment_details.bank_name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Numéro de compte:</span>
                  <span className="ml-2 font-medium">
                    {withdrawal.payment_details.account_number}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Titulaire:</span>
                  <span className="ml-2 font-medium">
                    {withdrawal.payment_details.account_name}
                  </span>
                </div>
                {withdrawal.payment_details.iban && (
                  <div>
                    <span className="text-gray-600">IBAN:</span>
                    <span className="ml-2 font-medium">
                      {withdrawal.payment_details.iban}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ID de transaction (si complété) */}
          {withdrawal.transaction_id && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-1">ID de transaction</p>
              <p className="font-mono text-sm bg-gray-100 px-3 py-2 rounded">
                {withdrawal.transaction_id}
              </p>
            </div>
          )}

          {/* Notes */}
          {withdrawal.notes && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                withdrawal.status === "rejected"
                  ? "bg-red-50 border border-red-200"
                  : "bg-blue-50 border border-blue-200"
              }`}
            >
              <div className="flex items-start gap-2">
                <AlertCircle
                  className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    withdrawal.status === "rejected"
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                />
                <div>
                  <p
                    className={`text-sm font-medium ${
                      withdrawal.status === "rejected"
                        ? "text-red-900"
                        : "text-blue-900"
                    }`}
                  >
                    {withdrawal.status === "rejected"
                      ? "Raison du rejet"
                      : "Notes"}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      withdrawal.status === "rejected"
                        ? "text-red-700"
                        : "text-blue-700"
                    }`}
                  >
                    {withdrawal.notes}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          {withdrawal.status === "pending" && (
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  onClose();
                  handleApproveClick(withdrawal);
                }}
                variant="success"
                fullWidth
              >
                <Check className="w-5 h-5 mr-2" />
                Approuver et payer
              </Button>
              <Button
                onClick={() => {
                  onClose();
                  handleRejectClick(withdrawal);
                }}
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
        <h1 className="text-3xl font-bold text-gray-900">
          Demandes de retrait
        </h1>
        <p className="text-gray-600 mt-2">
          Gérer les demandes de retrait des photographes
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900">En attente</h3>
          </div>
          <p className="text-4xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-gray-600 mt-1">
            {formatPrice(stats.pendingAmount)}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-green-100 rounded-lg">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Complétés</h3>
          </div>
          <p className="text-4xl font-bold text-green-600">{stats.completed}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-red-100 rounded-lg">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Rejetés</h3>
          </div>
          <p className="text-4xl font-bold text-red-600">{stats.rejected}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Total</h3>
          </div>
          <p className="text-4xl font-bold text-blue-600">
            {withdrawals.length}
          </p>
        </Card>
      </div>

      {/* Filtre */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-3">
          <Filter className="text-gray-400 w-5 h-5" />
          <label className="text-sm font-medium text-gray-700">
            Filtrer par statut:
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="pending">En attente</option>
            <option value="completed">Complétés</option>
            <option value="rejected">Rejetés</option>
            <option value="all">Tous</option>
          </select>
          <span className="text-sm text-gray-600 ml-auto">
            {withdrawals.length} demande{withdrawals.length > 1 ? "s" : ""}
          </span>
        </div>
      </Card>

      {/* Liste des retraits */}
      <Card className="p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune demande
            </h3>
            <p className="text-gray-500">
              {filterStatus === "pending"
                ? "Aucune demande de retrait en attente"
                : `Aucune demande ${
                    filterStatus === "completed"
                      ? "complétée"
                      : filterStatus === "rejected"
                      ? "rejetée"
                      : ""
                  }`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {withdrawals.map((withdrawal) => {
              const photographer = withdrawal.photographer || withdrawal.user;

              return (
                <div
                  key={withdrawal.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <img
                      src={photographer?.avatar_url}
                      alt={photographer?.display_name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />

                    {/* Informations */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {photographer?.first_name} {photographer?.last_name}
                          </h3>
                          <p className="text-gray-600">
                            {photographer?.display_name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary-600">
                            {formatPrice(withdrawal.amount)}
                          </p>
                          {getStatusBadge(withdrawal.status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          {getPaymentMethodIcon(withdrawal.payment_method)}
                          <span>
                            {getPaymentMethodLabel(withdrawal.payment_method)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(
                              withdrawal.created_at,
                              "dd/MM/yyyy HH:mm"
                            )}
                          </span>
                        </div>
                        {withdrawal.payment_method === "mobile_money" && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Smartphone className="w-4 h-4" />
                            <span>{withdrawal.payment_details.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setSelectedWithdrawal(withdrawal)}
                          variant="ghost"
                          size="sm"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Voir détails
                        </Button>
                        {withdrawal.status === "pending" && (
                          <>
                            <Button
                              onClick={() => handleApproveClick(withdrawal)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Approuver
                            </Button>
                            <Button
                              onClick={() => handleRejectClick(withdrawal)}
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Rejeter
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Modal Détails */}
      <WithdrawalDetailModal
        withdrawal={selectedWithdrawal}
        onClose={() => setSelectedWithdrawal(null)}
      />

      {/* Modal Approbation */}
      {showApproveModal && withdrawalToProcess && (
        <Modal
          isOpen={showApproveModal}
          onClose={() => {
            setShowApproveModal(false);
            setWithdrawalToProcess(null);
            setTransactionId("");
            setNotes("");
          }}
          title="Approuver et effectuer le paiement"
        >
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Vous êtes sur le point d'approuver et d'effectuer le paiement de{" "}
              <strong>{formatPrice(withdrawalToProcess.amount)}</strong> pour{" "}
              <strong>
                {(withdrawalToProcess.photographer || withdrawalToProcess.user)?.first_name}{" "}
                {(withdrawalToProcess.photographer || withdrawalToProcess.user)?.last_name}
              </strong>
              .
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID de transaction <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: OM-TRX-20251030-123456"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optionnel)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Informations additionnelles..."
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={confirmApprove}
                variant="success"
                fullWidth
                disabled={!transactionId.trim()}
              >
                <Check className="w-5 h-5 mr-2" />
                Confirmer le paiement
              </Button>
              <Button
                onClick={() => {
                  setShowApproveModal(false);
                  setWithdrawalToProcess(null);
                  setTransactionId("");
                  setNotes("");
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

      {/* Modal Rejet */}
      {showRejectModal && withdrawalToProcess && (
        <Modal
          isOpen={showRejectModal}
          onClose={() => {
            setShowRejectModal(false);
            setWithdrawalToProcess(null);
            setRejectionReason("");
          }}
          title="Rejeter la demande"
        >
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Vous êtes sur le point de rejeter la demande de retrait de{" "}
              <strong>{formatPrice(withdrawalToProcess.amount)}</strong> pour{" "}
              <strong>
                {(withdrawalToProcess.photographer || withdrawalToProcess.user)?.first_name}{" "}
                {(withdrawalToProcess.photographer || withdrawalToProcess.user)?.last_name}
              </strong>
              . Veuillez fournir une raison.
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
                placeholder="Ex: Solde insuffisant, informations bancaires incorrectes, etc."
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
                  setWithdrawalToProcess(null);
                  setRejectionReason("");
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
