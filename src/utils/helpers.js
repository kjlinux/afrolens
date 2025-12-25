// Fonctions utilitaires réutilisables

import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formate un prix en Franc CFA
 * @param {number} price - Prix à formater
 * @param {string} currency - Devise (défaut: XOF)
 * @returns {string} - Prix formaté
 */
export const formatPrice = (price, currency = 'XOF') => {
  if (price === null || price === undefined || isNaN(price)) {
    return 'N/A';
  }
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Formate une date
 * @param {string|Date} date - Date à formater
 * @param {string} formatStr - Format souhaité (défaut: 'dd/MM/yyyy')
 * @returns {string} - Date formatée
 */
export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  if (!date) return 'N/A';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    // Vérifier si la date est valide
    if (isNaN(dateObj.getTime())) {
      return 'Date invalide';
    }

    return format(dateObj, formatStr, { locale: fr });
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error, date);
    return 'Date invalide';
  }
};

/**
 * Formate une date en "il y a X temps"
 * @param {string|Date} date - Date à formater
 * @returns {string} - Date relative
 */
export const formatRelativeDate = (date) => {
  if (!date) return 'N/A';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    // Vérifier si la date est valide
    if (isNaN(dateObj.getTime())) {
      return 'Date invalide';
    }

    return formatDistanceToNow(dateObj, { addSuffix: true, locale: fr });
  } catch (error) {
    console.error('Erreur lors du formatage de la date relative:', error, date);
    return 'Date invalide';
  }
};

/**
 * Formate une taille de fichier en unités lisibles
 * @param {number} bytes - Taille en bytes
 * @returns {string} - Taille formatée
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Formate un nombre avec séparateurs
 * @param {number} num - Nombre à formater
 * @returns {string} - Nombre formaté
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

/**
 * Génère un slug à partir d'une chaîne
 * @param {string} str - Chaîne à slugifier
 * @returns {string} - Slug généré
 */
export const slugify = (str) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

/**
 * Tronque un texte
 * @param {string} text - Texte à tronquer
 * @param {number} length - Longueur maximale
 * @param {string} suffix - Suffixe (défaut: '...')
 * @returns {string} - Texte tronqué
 */
export const truncate = (text, length = 100, suffix = '...') => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length).trim() + suffix;
};

/**
 * Génère un ID unique
 * @returns {string} - ID unique
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Génère un numéro de commande unique
 * @returns {string} - Numéro de commande
 */
export const generateOrderNumber = () => {
  const date = format(new Date(), 'yyyyMMdd');
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `ORD-${date}-${random}`;
};

/**
 * Calcule le pourcentage de commission
 * @param {number} amount - Montant
 * @param {number} rate - Taux de commission (0.20 pour 20%)
 * @returns {object} - { commission, net }
 */
export const calculateCommission = (amount, rate = 0.20) => {
  const commission = amount * rate;
  const net = amount - commission;
  return {
    commission: parseFloat(commission.toFixed(2)),
    net: parseFloat(net.toFixed(2)),
  };
};

/**
 * Détermine l'orientation d'une photo
 * @param {number} width - Largeur
 * @param {number} height - Hauteur
 * @returns {string} - 'landscape' | 'portrait' | 'square'
 */
export const getPhotoOrientation = (width, height) => {
  if (width > height) return 'landscape';
  if (height > width) return 'portrait';
  return 'square';
};

/**
 * Extrait les initiales d'un nom
 * @param {string} name - Nom complet
 * @returns {string} - Initiales
 */
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Copie du texte dans le presse-papiers
 * @param {string} text - Texte à copier
 * @returns {Promise<boolean>} - Succès ou échec
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Télécharge un fichier
 * @param {string} url - URL du fichier
 * @param {string} filename - Nom du fichier
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Simule un délai (pour les appels API mockés)
 * @param {number} ms - Délai en millisecondes
 * @returns {Promise} - Promise résolue après le délai
 */
export const delay = (ms = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Vérifie si une image existe
 * @param {string} url - URL de l'image
 * @returns {Promise<boolean>} - True si l'image existe
 */
export const imageExists = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

/**
 * Génère un avatar URL depuis UI Avatars
 * @param {string} name - Nom
 * @param {string} bg - Couleur de fond (hex sans #)
 * @returns {string} - URL de l'avatar
 */
export const generateAvatarUrl = (name, bg = '22c55e') => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=200`;
};

/**
 * Construit l'URL complète S3 à partir d'un chemin relatif
 * @param {string} path - Chemin relatif (ex: "users/xxx/avatars/avatar.jpg")
 * @returns {string|null} - URL complète S3 ou null si path est invalide
 */
export const getS3Url = (path) => {
  if (!path) return null;

  // Si c'est déjà une URL complète, la retourner telle quelle
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const bucketUrl = import.meta.env.VITE_S3_BUCKET_URL;
  if (!bucketUrl) {
    console.warn('VITE_S3_BUCKET_URL is not defined');
    return null;
  }

  // Nettoyer le chemin (supprimer les slashes au début)
  const cleanPath = path.replace(/^\/+/, '');

  return `${bucketUrl}/${cleanPath}`;
};

/**
 * Calcule le total d'un panier
 * @param {Array} items - Items du panier
 * @returns {object} - { subtotal, tax, total }
 */
export const calculateCartTotal = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = 0; // Pas de taxe pour le moment
  const total = subtotal + tax;
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
};

/**
 * Groupe un tableau d'objets par clé
 * @param {Array} array - Tableau à grouper
 * @param {string} key - Clé de groupement
 * @returns {object} - Objet groupé
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Debounce une fonction
 * @param {Function} func - Fonction à debounce
 * @param {number} wait - Délai d'attente en ms
 * @returns {Function} - Fonction debouncée
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Vérifie si l'utilisateur est sur mobile
 * @returns {boolean} - True si mobile
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Scroll vers le haut de la page
 * @param {boolean} smooth - Smooth scroll (défaut: true)
 */
export const scrollToTop = (smooth = true) => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto',
  });
};

/**
 * Génère une couleur aléatoire (hex)
 * @returns {string} - Couleur hex
 */
export const randomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

/**
 * Vérifie si une date est dans le futur
 * @param {string|Date} date - Date à vérifier
 * @returns {boolean} - True si dans le futur
 */
export const isFutureDate = (date) => {
  if (!date) return false;

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (isNaN(dateObj.getTime())) return false;
    return dateObj > new Date();
  } catch (error) {
    console.error('Erreur lors de la vérification de la date:', error, date);
    return false;
  }
};

/**
 * Vérifie si une date est passée
 * @param {string|Date} date - Date à vérifier
 * @returns {boolean} - True si passée
 */
export const isPastDate = (date) => {
  if (!date) return false;

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (isNaN(dateObj.getTime())) return false;
    return dateObj < new Date();
  } catch (error) {
    console.error('Erreur lors de la vérification de la date:', error, date);
    return false;
  }
};

/**
 * Calcule le nombre de jours entre deux dates
 * @param {string|Date} date1 - Première date
 * @param {string|Date} date2 - Deuxième date
 * @returns {number} - Nombre de jours
 */
export const daysBetween = (date1, date2) => {
  if (!date1 || !date2) return 0;

  try {
    const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;

    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (error) {
    console.error('Erreur lors du calcul des jours entre les dates:', error, date1, date2);
    return 0;
  }
};

export default {
  formatPrice,
  formatDate,
  formatRelativeDate,
  formatFileSize,
  formatNumber,
  slugify,
  truncate,
  generateId,
  generateOrderNumber,
  calculateCommission,
  getPhotoOrientation,
  getInitials,
  copyToClipboard,
  downloadFile,
  delay,
  imageExists,
  generateAvatarUrl,
  getS3Url,
  calculateCartTotal,
  groupBy,
  debounce,
  isMobile,
  scrollToTop,
  randomColor,
  isFutureDate,
  isPastDate,
  daysBetween,
};
