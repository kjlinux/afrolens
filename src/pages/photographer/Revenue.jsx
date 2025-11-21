import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getRevenueSummary,
  getRevenueHistory,
  getSalesHistory,
  getWithdrawals,
  createWithdrawal,
} from "../../services/photographerService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  formatPrice,
  formatDate,
  formatNumber,
  calculateCommission,
} from "../../utils/helpers";
import { CONFIG } from "../../utils/constants";
import { useToast } from "../../contexts/ToastContext";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Modal from "../../components/common/Modal";

export default function Revenue() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [withdrawalMethod, setWithdrawalMethod] = useState("orange_money");
  const [withdrawalDetails, setWithdrawalDetails] = useState("");
  const [withdrawalProcessing, setWithdrawalProcessing] = useState(false);

  const [revenueData, setRevenueData] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);

  useEffect(() => {
    loadRevenueData();
  }, []);

  const loadRevenueData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Utiliser Promise.allSettled pour ne pas bloquer si une requête échoue
      const [summaryResult, historyResult, salesResult, withdrawalsResult] = await Promise.allSettled([
        getRevenueSummary(),
        getRevenueHistory(),
        getSalesHistory(),
        getWithdrawals(),
      ]);

      // Extraire les données ou utiliser des valeurs par défaut
      const summary = summaryResult.status === 'fulfilled' ? summaryResult.value : {
        availableBalance: 0,
        pendingBalance: 0,
        totalSales: 0,
        commission: 0,
        netRevenue: 0,
        totalWithdrawn: 0,
        nextPayoutDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const history = historyResult.status === 'fulfilled' ? historyResult.value : [];
      const sales = salesResult.status === 'fulfilled' ? salesResult.value : [];
      const withdrawals = withdrawalsResult.status === 'fulfilled' ? withdrawalsResult.value : [];

      setRevenueData(summary);

      // Ensure arrays are properly extracted from paginated API responses
      // API returns { data: { data: [...] } } for paginated responses
      const extractArray = (response) => {
        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.data?.data)) return response.data.data;
        if (Array.isArray(response?.data)) return response.data;
        return [];
      };

      setMonthlyRevenue(extractArray(history));
      setRecentTransactions(extractArray(sales));
      setWithdrawalHistory(extractArray(withdrawals));
    } catch (err) {
      console.error('Erreur lors du chargement des revenus:', err);
      // En cas d'erreur générale, utiliser des valeurs par défaut
      setRevenueData({
        availableBalance: 0,
        pendingBalance: 0,
        totalSales: 0,
        commission: 0,
        netRevenue: 0,
        totalWithdrawn: 0,
        nextPayoutDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
      setMonthlyRevenue([]);
      setRecentTransactions([]);
      setWithdrawalHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async (e) => {
    e.preventDefault();

    const amount = parseFloat(withdrawalAmount);

    if (isNaN(amount) || amount <= 0) {
      toast.warning('Veuillez entrer un montant valide');
      return;
    }

    if (amount > (revenueData?.availableBalance || 0)) {
      toast.error('Le montant demandé dépasse votre solde disponible');
      return;
    }

    if (amount < CONFIG.MIN_WITHDRAWAL_AMOUNT) {
      toast.warning(`Le montant minimum de retrait est de ${formatPrice(CONFIG.MIN_WITHDRAWAL_AMOUNT)}`);
      return;
    }

    try {
      setWithdrawalProcessing(true);

      await createWithdrawal({
        amount,
        payment_method: withdrawalMethod,
        payment_details: withdrawalDetails,
      });

      // Recharger les données
      await loadRevenueData();

      // Fermer le modal et réinitialiser
      setShowWithdrawalModal(false);
      setWithdrawalAmount('');
      setWithdrawalDetails('');
      toast.success('Demande de retrait envoyée avec succès');
    } catch (err) {
      console.error('Erreur lors de la demande de retrait:', err);
      toast.error(err.message || 'Impossible de créer la demande de retrait');
    } finally {
      setWithdrawalProcessing(false);
    }
  };


  const handleWithdrawalRequest = async (e) => {
    e.preventDefault();

    const amount = parseFloat(withdrawalAmount);

    // Validations
    if (amount < CONFIG.MINIMUM_WITHDRAWAL) {
      toast.warning(
        `Le montant minimum de retrait est de ${formatPrice(
          CONFIG.MINIMUM_WITHDRAWAL
        )}`
      );
      return;
    }

    if (amount > (revenueData?.availableBalance || 0)) {
      toast.error("Solde disponible insuffisant");
      return;
    }

    if (!withdrawalDetails.trim()) {
      toast.warning("Veuillez fournir les détails du compte");
      return;
    }

    // En production, appeler l'API
    console.log("Demande de retrait:", {
      amount,
      method: withdrawalMethod,
      details: withdrawalDetails,
    });

    toast.success(`Demande de retrait de ${formatPrice(amount)} soumise avec succès!`);
    setShowWithdrawalModal(false);
    setWithdrawalAmount("");
    setWithdrawalDetails("");
  };

  const getStatusBadge = (status) => {
    const configs = {
      completed: { variant: "success", label: "Complété" },
      pending: { variant: "warning", label: "En attente" },
      rejected: { variant: "danger", label: "Rejeté" },
    };
    const config = configs[status] || configs.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg">Chargement des données de revenus...</p>
        </div>
      </div>
    );
  }


  // Si revenueData est null après le chargement, afficher avec des valeurs par défaut
  const data = revenueData || {
    availableBalance: 0,
    pendingBalance: 0,
    totalSales: 0,
    commission: 0,
    netRevenue: 0,
    totalWithdrawn: 0,
    nextPayoutDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mes Revenus</h1>
            <p className="text-gray-600">
              Gérez vos revenus et demandes de retrait
            </p>
          </div>
          <Button
            onClick={() => setShowWithdrawalModal(true)}
            disabled={data.availableBalance < CONFIG.MINIMUM_WITHDRAWAL}
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Demander un retrait
          </Button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Solde disponible</p>
              <p className="text-3xl font-bold text-green-600">
                {formatPrice(data.availableBalance)}
              </p>
              <p className="text-xs text-gray-500 mt-2">Prêt à retirer</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">En attente</p>
              <p className="text-3xl font-bold text-yellow-600">
                {formatPrice(data.pendingBalance)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Sécurité {CONFIG.SECURITY_HOLD_DAYS}j
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Revenus nets</p>
              <p className="text-3xl font-bold text-blue-600">
                {formatPrice(data.netRevenue)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Total après commission
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total retiré</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatPrice(data.totalWithdrawn)}
              </p>
              <p className="text-xs text-gray-500 mt-2">Depuis le début</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Informations importantes */}
      <Card className="p-6 mb-8 bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">
              À propos des retraits
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • Commission de {CONFIG.COMMISSION_RATE * 100}% sur toutes les
                ventes
              </li>
              <li>
                • Montant minimum de retrait:{" "}
                {formatPrice(CONFIG.MINIMUM_WITHDRAWAL)}
              </li>
              <li>
                • Période de sécurité: {CONFIG.SECURITY_HOLD_DAYS} jours après
                la vente
              </li>
              <li>
                • Délai de traitement: 24-48h pour Mobile Money, 3-5 jours pour
                virement bancaire
              </li>
              <li>
                • Prochaine date de paiement automatique:{" "}
                {formatDate(data.nextPayoutDate, "dd MMMM yyyy")}
              </li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Graphique des revenus */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-6">Évolution des revenus</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Ventes brutes (FCFA)"
              />
              <Line
                type="monotone"
                dataKey="net"
                stroke="#22c55e"
                strokeWidth={2}
                name="Revenus nets (FCFA)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Répartition */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">
            Répartition des revenus
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Ventes totales</span>
                <span className="font-semibold">
                  {formatPrice(data.totalSales)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">
                  Commission ({CONFIG.COMMISSION_RATE * 100}%)
                </span>
                <span className="font-semibold text-red-600">
                  -{formatPrice(data.commission)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${CONFIG.COMMISSION_RATE * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">
                  Revenus nets
                </span>
                <span className="font-bold text-green-600">
                  {formatPrice(data.netRevenue)}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Disponible</span>
                <span className="font-semibold text-green-600">
                  {formatPrice(data.availableBalance)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">En attente</span>
                <span className="font-semibold text-yellow-600">
                  {formatPrice(data.pendingBalance)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Déjà retiré</span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(data.totalWithdrawn)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transactions récentes */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Transactions récentes</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === "sale"
                        ? "bg-green-100"
                        : "bg-blue-100"
                    }`}
                  >
                    {transaction.type === "sale" ? (
                      <svg
                        className="w-5 h-5 text-green-600"
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
                    ) : (
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(transaction.date, "dd MMM yyyy HH:mm")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      transaction.net > 0 ? "text-green-600" : "text-gray-900"
                    }`}
                  >
                    {transaction.net > 0 ? "+" : ""}
                    {formatPrice(transaction.net)}
                  </p>
                  {getStatusBadge(transaction.status)}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Historique des retraits */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">
            Historique des retraits
          </h3>
          {withdrawalHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg
                className="mx-auto h-12 w-12 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p>Aucun retrait effectué</p>
            </div>
          ) : (
            <div className="space-y-4">
              {withdrawalHistory.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {formatPrice(withdrawal.amount)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {withdrawal.method}
                      </p>
                    </div>
                    {getStatusBadge(withdrawal.status)}
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Compte: {withdrawal.accountNumber}</p>
                    <p>
                      Demandé:{" "}
                      {formatDate(withdrawal.date, "dd MMM yyyy HH:mm")}
                    </p>
                    {withdrawal.processedDate && (
                      <p>
                        Traité:{" "}
                        {formatDate(
                          withdrawal.processedDate,
                          "dd MMM yyyy HH:mm"
                        )}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Modal de demande de retrait */}
      {showWithdrawalModal && (
        <Modal
          isOpen={showWithdrawalModal}
          onClose={() => setShowWithdrawalModal(false)}
          title="Demander un retrait"
        >
          <form onSubmit={handleWithdrawalRequest} className="p-6">
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Solde disponible</p>
              <p className="text-2xl font-bold text-green-600">
                {formatPrice(data.availableBalance)}
              </p>
            </div>

            <Input
              label="Montant à retirer (FCFA)"
              type="number"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              required
              min={CONFIG.MINIMUM_WITHDRAWAL}
              max={data.availableBalance}
              step="0.01"
              helperText={`Minimum: ${formatPrice(CONFIG.MINIMUM_WITHDRAWAL)}`}
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Méthode de retrait <span className="text-red-500">*</span>
              </label>
              <select
                value={withdrawalMethod}
                onChange={(e) => setWithdrawalMethod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="orange_money">Orange Money</option>
                <option value="moov_money">Moov Money</option>
                <option value="telecel_money">Telecel Money</option>
                <option value="bank_transfer">Virement bancaire</option>
              </select>
            </div>

            <Input
              label={
                withdrawalMethod === "bank_transfer"
                  ? "IBAN ou numéro de compte"
                  : "Numéro de téléphone"
              }
              type="text"
              value={withdrawalDetails}
              onChange={(e) => setWithdrawalDetails(e.target.value)}
              required
              placeholder={
                withdrawalMethod === "bank_transfer"
                  ? "BF** **** **** ****"
                  : "+226 XX XX XX XX"
              }
            />

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Remarque:</strong> Les retraits sont traités sous 24-48h
                pour Mobile Money et 3-5 jours pour virements bancaires.
              </p>
            </div>

            <div className="flex gap-3">
              <Button type="submit" fullWidth>
                Confirmer le retrait
              </Button>
              <Button
                type="button"
                variant="ghost"
                fullWidth
                onClick={() => setShowWithdrawalModal(false)}
              >
                Annuler
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
