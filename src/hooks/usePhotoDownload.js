import { useState } from 'react';
import axios from 'axios';
import { useToast } from '../contexts/ToastContext';
import { STORAGE_KEYS } from '../utils/constants';

export function usePhotoDownload() {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fonction utilitaire pour créer le téléchargement
  const createDownload = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Fonction utilitaire pour gérer les erreurs
  const handleDownloadError = (err, defaultMessage) => {
    console.error('Erreur de téléchargement:', err);

    let errorMessage = defaultMessage;

    if (err.response) {
      if (err.response.status === 403) {
        errorMessage = "Vous n'avez pas accès à cette ressource";
      } else if (err.response.status === 404) {
        errorMessage = "Fichier introuvable sur le serveur";
      } else if (err.response.data?.message) {
        errorMessage = err.response.data.message;
      }
    } else if (err.request) {
      errorMessage = "Erreur réseau. Vérifiez votre connexion";
    }

    setError(errorMessage);
    toast.error(errorMessage);
    throw err;
  };

  // Téléchargement d'une photo individuelle
  const downloadPhoto = async (photoId, photoTitle) => {
    setDownloading(true);
    setError(null);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/downloads/photo/${photoId}`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      createDownload(response.data, `${photoTitle || 'photo'}.jpg`);
      toast.success('Photo téléchargée avec succès');
    } catch (err) {
      handleDownloadError(err, 'Impossible de télécharger la photo');
    } finally {
      setDownloading(false);
    }
  };

  // Téléchargement de toutes les photos d'une commande (ZIP)
  const downloadOrder = async (orderId, orderNumber) => {
    setDownloading(true);
    setError(null);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/downloads/order/${orderId}`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      createDownload(response.data, `Commande_${orderNumber}.zip`);
      toast.success('Toutes les photos ont été téléchargées');
    } catch (err) {
      handleDownloadError(err, 'Impossible de télécharger les photos');
    } finally {
      setDownloading(false);
    }
  };

  // Téléchargement de la facture (PDF)
  const downloadInvoice = async (orderId, orderNumber) => {
    setDownloading(true);
    setError(null);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/downloads/invoice/${orderId}`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      createDownload(response.data, `Facture_${orderNumber}.pdf`);
      toast.success('Facture téléchargée avec succès');
    } catch (err) {
      handleDownloadError(err, 'Impossible de télécharger la facture');
    } finally {
      setDownloading(false);
    }
  };

  return {
    downloadPhoto,
    downloadOrder,
    downloadInvoice,
    downloading,
    error,
  };
}
