// Fonctions de validation

import { VALIDATION_REGEX, CONFIG } from './constants';

/**
 * Valide une adresse email
 * @param {string} email - Email à valider
 * @returns {boolean} - True si valide
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  return VALIDATION_REGEX.EMAIL.test(email);
};

/**
 * Valide un mot de passe
 * Doit contenir au moins 8 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial
 * @param {string} password - Mot de passe à valider
 * @returns {boolean} - True si valide
 */
export const isValidPassword = (password) => {
  if (!password) return false;
  return VALIDATION_REGEX.PASSWORD.test(password);
};

/**
 * Calcule la force d'un mot de passe
 * @param {string} password - Mot de passe à évaluer
 * @returns {object} - { strength: 'weak'|'medium'|'strong', score: 0-100 }
 */
export const getPasswordStrength = (password) => {
  if (!password) return { strength: 'weak', score: 0 };

  let score = 0;

  // Longueur
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;

  // Minuscules
  if (/[a-z]/.test(password)) score += 10;

  // Majuscules
  if (/[A-Z]/.test(password)) score += 15;

  // Chiffres
  if (/\d/.test(password)) score += 15;

  // Caractères spéciaux
  if (/[@$!%*?&]/.test(password)) score += 20;

  // Pas de répétitions
  if (!/(.)\1{2,}/.test(password)) score += 10;

  let strength = 'weak';
  if (score >= 70) strength = 'strong';
  else if (score >= 40) strength = 'medium';

  return { strength, score: Math.min(score, 100) };
};

/**
 * Valide un numéro de téléphone burkinabé
 * @param {string} phone - Téléphone à valider
 * @returns {boolean} - True si valide
 */
export const isValidPhoneBF = (phone) => {
  if (!phone) return false;
  return VALIDATION_REGEX.PHONE_BF.test(phone);
};

/**
 * Valide un numéro de téléphone ivoirien
 * @param {string} phone - Téléphone à valider
 * @returns {boolean} - True si valide
 */
export const isValidPhoneCI = (phone) => {
  if (!phone) return false;
  return VALIDATION_REGEX.PHONE_CI.test(phone);
};

/**
 * Valide un nom d'utilisateur
 * @param {string} username - Username à valider
 * @returns {boolean} - True si valide
 */
export const isValidUsername = (username) => {
  if (!username) return false;
  return VALIDATION_REGEX.USERNAME.test(username);
};

/**
 * Valide une URL
 * @param {string} url - URL à valider
 * @returns {boolean} - True si valide
 */
export const isValidUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Valide la taille d'un fichier
 * @param {File} file - Fichier à valider
 * @param {number} maxSize - Taille max en bytes (défaut: 50MB)
 * @returns {boolean} - True si valide
 */
export const isValidFileSize = (file, maxSize = CONFIG.MAX_FILE_SIZE) => {
  if (!file) return false;
  return file.size <= maxSize;
};

/**
 * Valide le type d'un fichier
 * @param {File} file - Fichier à valider
 * @param {Array} acceptedTypes - Types acceptés
 * @returns {boolean} - True si valide
 */
export const isValidFileType = (file, acceptedTypes = CONFIG.ACCEPTED_IMAGE_FORMATS) => {
  if (!file) return false;
  return acceptedTypes.includes(file.type);
};

/**
 * Valide un fichier image (type + taille)
 * @param {File} file - Fichier à valider
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: 'Aucun fichier sélectionné' };
  }

  if (!isValidFileType(file)) {
    return {
      valid: false,
      error: 'Type de fichier non supporté. Utilisez JPG ou PNG.',
    };
  }

  if (!isValidFileSize(file)) {
    return {
      valid: false,
      error: 'Le fichier est trop volumineux (max 50MB)',
    };
  }

  return { valid: true, error: null };
};

/**
 * Valide le nombre de tags
 * @param {Array} tags - Tags à valider
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateTags = (tags) => {
  if (!tags || !Array.isArray(tags)) {
    return { valid: false, error: 'Les tags doivent être un tableau' };
  }

  if (tags.length < CONFIG.MIN_TAGS_PER_PHOTO) {
    return {
      valid: false,
      error: `Minimum ${CONFIG.MIN_TAGS_PER_PHOTO} tags requis`,
    };
  }

  if (tags.length > CONFIG.MAX_TAGS_PER_PHOTO) {
    return {
      valid: false,
      error: `Maximum ${CONFIG.MAX_TAGS_PER_PHOTO} tags autorisés`,
    };
  }

  return { valid: true, error: null };
};

/**
 * Valide un prix
 * @param {number} price - Prix à valider
 * @param {number} minPrice - Prix minimum (défaut: 5)
 * @returns {object} - { valid: boolean, error: string }
 */
export const validatePrice = (price, minPrice = 5) => {
  if (!price || isNaN(price)) {
    return { valid: false, error: 'Le prix est requis' };
  }

  if (price < minPrice) {
    return {
      valid: false,
      error: `Le prix minimum est de ${minPrice}€`,
    };
  }

  return { valid: true, error: null };
};

/**
 * Valide un formulaire de connexion
 * @param {object} data - { email, password }
 * @returns {object} - { valid: boolean, errors: object }
 */
export const validateLoginForm = (data) => {
  const errors = {};

  if (!data.email) {
    errors.email = 'L\'email est requis';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Email invalide';
  }

  if (!data.password) {
    errors.password = 'Le mot de passe est requis';
  } else if (data.password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Valide un formulaire d'inscription
 * @param {object} data - Données du formulaire
 * @returns {object} - { valid: boolean, errors: object }
 */
export const validateRegisterForm = (data) => {
  const errors = {};

  if (!data.first_name) {
    errors.first_name = 'Le prénom est requis';
  } else if (data.first_name.length < 2) {
    errors.first_name = 'Le prénom doit contenir au moins 2 caractères';
  }

  if (!data.last_name) {
    errors.last_name = 'Le nom est requis';
  } else if (data.last_name.length < 2) {
    errors.last_name = 'Le nom doit contenir au moins 2 caractères';
  }

  if (!data.email) {
    errors.email = 'L\'email est requis';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Email invalide';
  }

  if (!data.password) {
    errors.password = 'Le mot de passe est requis';
  } else if (!isValidPassword(data.password)) {
    errors.password =
      'Le mot de passe doit contenir au moins 8 caractères, 1 majuscule, 1 chiffre et 1 caractère spécial';
  }

  if (!data.password_confirmation) {
    errors.password_confirmation = 'La confirmation du mot de passe est requise';
  } else if (data.password !== data.password_confirmation) {
    errors.password_confirmation = 'Les mots de passe ne correspondent pas';
  }

  if (!data.account_type) {
    errors.account_type = 'Le type de compte est requis';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Valide un formulaire d'upload de photo
 * @param {object} data - Données du formulaire
 * @returns {object} - { valid: boolean, errors: object }
 */
export const validatePhotoUploadForm = (data) => {
  const errors = {};

  if (!data.title) {
    errors.title = 'Le titre est requis';
  } else if (data.title.length < 5) {
    errors.title = 'Le titre doit contenir au moins 5 caractères';
  } else if (data.title.length > 200) {
    errors.title = 'Le titre ne peut pas dépasser 200 caractères';
  }

  if (data.description && data.description.length > 2000) {
    errors.description = 'La description ne peut pas dépasser 2000 caractères';
  }

  if (!data.category_id) {
    errors.category_id = 'La catégorie est requise';
  }

  const tagsValidation = validateTags(data.tags);
  if (!tagsValidation.valid) {
    errors.tags = tagsValidation.error;
  }

  const priceValidation = validatePrice(data.price_standard);
  if (!priceValidation.valid) {
    errors.price_standard = priceValidation.error;
  }

  if (data.price_extended) {
    const extendedPriceValidation = validatePrice(data.price_extended, data.price_standard * 2);
    if (!extendedPriceValidation.valid) {
      errors.price_extended = 'Le prix extended doit être au moins 2x le prix standard';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Valide un formulaire de profil
 * @param {object} data - Données du formulaire
 * @returns {object} - { valid: boolean, errors: object }
 */
export const validateProfileForm = (data) => {
  const errors = {};

  if (!data.first_name) {
    errors.first_name = 'Le prénom est requis';
  }

  if (!data.last_name) {
    errors.last_name = 'Le nom est requis';
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.email = 'Email invalide';
  }

  if (data.phone && !isValidPhoneBF(data.phone) && !isValidPhoneCI(data.phone)) {
    errors.phone = 'Numéro de téléphone invalide';
  }

  if (data.website && !isValidUrl(data.website)) {
    errors.website = 'URL invalide';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Valide un formulaire de demande de retrait
 * @param {object} data - Données du formulaire
 * @param {number} availableBalance - Solde disponible
 * @returns {object} - { valid: boolean, errors: object }
 */
export const validateWithdrawalForm = (data, availableBalance) => {
  const errors = {};

  if (!data.amount) {
    errors.amount = 'Le montant est requis';
  } else if (isNaN(data.amount) || data.amount <= 0) {
    errors.amount = 'Le montant doit être supérieur à 0';
  } else if (data.amount < CONFIG.MINIMUM_WITHDRAWAL) {
    errors.amount = `Le montant minimum de retrait est de ${CONFIG.MINIMUM_WITHDRAWAL}€`;
  } else if (data.amount > availableBalance) {
    errors.amount = 'Montant supérieur au solde disponible';
  }

  if (!data.withdrawal_method) {
    errors.withdrawal_method = 'La méthode de retrait est requise';
  }

  if (data.withdrawal_method === 'mobile_money' && !data.phone) {
    errors.phone = 'Le numéro de téléphone est requis';
  }

  if (data.withdrawal_method === 'bank_transfer') {
    if (!data.bank_name) {
      errors.bank_name = 'Le nom de la banque est requis';
    }
    if (!data.account_number) {
      errors.account_number = 'Le numéro de compte est requis';
    }
    if (!data.account_name) {
      errors.account_name = 'Le nom du titulaire du compte est requis';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  isValidEmail,
  isValidPassword,
  getPasswordStrength,
  isValidPhoneBF,
  isValidPhoneCI,
  isValidUsername,
  isValidUrl,
  isValidFileSize,
  isValidFileType,
  validateImageFile,
  validateTags,
  validatePrice,
  validateLoginForm,
  validateRegisterForm,
  validatePhotoUploadForm,
  validateProfileForm,
  validateWithdrawalForm,
};
