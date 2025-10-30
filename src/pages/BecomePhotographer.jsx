import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Camera, CheckCircle, Upload, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CONFIG } from '../utils/constants';
import { formatFileSize } from '../utils/helpers';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';

export default function BecomePhotographer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: form, 2: upload, 3: success
  const [submitting, setSubmitting] = useState(false);
  const [samplePhotos, setSamplePhotos] = useState([]);

  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    experience: '',
    portfolio: '',
    instagram: '',
    facebook: '',
    motivation: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(file => {
        if (file.file.size > CONFIG.MAX_FILE_SIZE) {
          return `${file.file.name}: Fichier trop volumineux`;
        }
        return `${file.file.name}: Format non supporté`;
      });
      alert(errors.join('\n'));
      return;
    }

    // Limite de 10 photos échantillons
    if (samplePhotos.length + acceptedFiles.length > 10) {
      alert('Maximum 10 photos échantillons autorisées');
      return;
    }

    const newPhotos = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
    }));

    setSamplePhotos(prev => [...prev, ...newPhotos]);
  }, [samplePhotos]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: CONFIG.MAX_FILE_SIZE,
    multiple: true,
  });

  const removePhoto = (photoId) => {
    setSamplePhotos(prev => {
      const photo = prev.find(p => p.id === photoId);
      if (photo) {
        URL.revokeObjectURL(photo.preview);
      }
      return prev.filter(p => p.id !== photoId);
    });
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.bio.trim() || formData.bio.length < 50) {
      alert('Votre biographie doit contenir au moins 50 caractères');
      return;
    }

    if (!formData.experience.trim()) {
      alert('Veuillez décrire votre expérience');
      return;
    }

    if (!formData.motivation.trim() || formData.motivation.length < 100) {
      alert('Votre motivation doit contenir au moins 100 caractères');
      return;
    }

    setStep(2);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    if (samplePhotos.length < 3) {
      alert('Veuillez ajouter au moins 3 photos échantillons');
      return;
    }

    if (samplePhotos.length > 10) {
      alert('Maximum 10 photos échantillons autorisées');
      return;
    }

    setSubmitting(true);

    try {
      // Simuler l'envoi de la demande
      await new Promise(resolve => setTimeout(resolve, 2000));

      // En production, envoyer les données à l'API
      console.log('Demande de photographe soumise:', {
        ...formData,
        samplePhotos: samplePhotos.map(p => p.file.name),
      });

      setStep(3);

      // Nettoyer les URLs de preview
      samplePhotos.forEach(photo => URL.revokeObjectURL(photo.preview));

    } catch (error) {
      alert('Erreur lors de la soumission. Veuillez réessayer.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Étape 1: Formulaire d'informations
  if (step === 1) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Camera className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Devenir Photographe POUIRE
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Rejoignez notre communauté de photographes talentueux et vendez vos photos à travers le monde.
          </p>
        </div>

        {/* Étapes */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold">
                1
              </div>
              <span className="text-sm font-medium text-gray-900">Informations</span>
            </div>
            <div className="w-16 h-1 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 text-sm font-bold">
                2
              </div>
              <span className="text-sm font-medium text-gray-500">Photos échantillons</span>
            </div>
            <div className="w-16 h-1 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 text-sm font-bold">
                3
              </div>
              <span className="text-sm font-medium text-gray-500">Confirmation</span>
            </div>
          </div>
        </div>

        <Card className="p-8">
          <form onSubmit={handleStep1Submit}>
            <h2 className="text-xl font-semibold mb-6">Vos informations</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Prénom"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                disabled={!!user}
              />
              <Input
                label="Nom"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                disabled={!!user}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={!!user}
              />
              <Input
                label="Téléphone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="+226 XX XX XX XX"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Biographie <span className="text-red-500">*</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Présentez-vous en quelques lignes... (minimum 50 caractères)"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.bio.length}/50 caractères minimum
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expérience professionnelle <span className="text-red-500">*</span>
              </label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Décrivez votre parcours et votre expérience en photographie..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivation <span className="text-red-500">*</span>
              </label>
              <textarea
                name="motivation"
                value={formData.motivation}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Pourquoi souhaitez-vous rejoindre POUIRE ? (minimum 100 caractères)"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.motivation.length}/100 caractères minimum
              </p>
            </div>

            <h3 className="text-lg font-semibold mb-4 mt-8">Présence en ligne (optionnel)</h3>

            <Input
              label="Site Web / Portfolio"
              type="url"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleInputChange}
              placeholder="https://monportfolio.com"
              className="mb-4"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input
                label="Instagram"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                placeholder="@votre_compte"
              />
              <Input
                label="Facebook"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                placeholder="facebook.com/votrepage"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">À savoir :</p>
                  <ul className="space-y-1">
                    <li>• Commission de 20% sur chaque vente</li>
                    <li>• Vos photos seront modérées avant publication</li>
                    <li>• Watermark automatique sur toutes vos photos</li>
                    <li>• Retrait minimum : 5000 FCFA</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" fullWidth>
                Continuer vers l'étape 2
              </Button>
              <Button type="button" variant="ghost" fullWidth onClick={() => navigate(-1)}>
                Annuler
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  // Étape 2: Upload des photos échantillons
  if (step === 2) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Photos Échantillons
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ajoutez entre 3 et 10 de vos meilleures photos pour nous permettre d'évaluer votre travail.
          </p>
        </div>

        {/* Étapes */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white text-sm">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-500">Informations</span>
            </div>
            <div className="w-16 h-1 bg-primary"></div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold">
                2
              </div>
              <span className="text-sm font-medium text-gray-900">Photos échantillons</span>
            </div>
            <div className="w-16 h-1 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 text-sm font-bold">
                3
              </div>
              <span className="text-sm font-medium text-gray-500">Confirmation</span>
            </div>
          </div>
        </div>

        <Card className="p-8">
          <form onSubmit={handleFinalSubmit}>
            {/* Zone de drop */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors mb-6 ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 hover:border-primary'
              }`}
            >
              <input {...getInputProps()} />

              <Upload
                className={`mx-auto h-12 w-12 mb-4 ${
                  isDragActive ? 'text-primary' : 'text-gray-400'
                }`}
              />

              {isDragActive ? (
                <p className="text-lg text-primary font-medium">
                  Déposez les photos ici...
                </p>
              ) : (
                <>
                  <p className="text-lg text-gray-900 font-medium mb-2">
                    Glissez-déposez vos photos ici
                  </p>
                  <p className="text-gray-600 mb-4">
                    ou cliquez pour sélectionner des fichiers
                  </p>
                  <p className="text-sm text-gray-500">
                    JPG, JPEG, PNG • Maximum {formatFileSize(CONFIG.MAX_FILE_SIZE)} par photo
                  </p>
                  <p className="text-sm text-gray-500">
                    Entre 3 et 10 photos • {samplePhotos.length}/10 ajoutées
                  </p>
                </>
              )}
            </div>

            {/* Grille de preview */}
            {samplePhotos.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-4">
                  Photos sélectionnées ({samplePhotos.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {samplePhotos.map(photo => (
                    <div
                      key={photo.id}
                      className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100"
                    >
                      <img
                        src={photo.preview}
                        alt="Sample"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        disabled={submitting}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Conseils pour vos photos échantillons :</p>
                  <ul className="space-y-1">
                    <li>• Choisissez vos meilleures photos représentatives de votre style</li>
                    <li>• Privilégiez la qualité à la quantité</li>
                    <li>• Assurez-vous d'avoir les droits sur toutes les photos</li>
                    <li>• Variez les sujets et compositions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                fullWidth
                onClick={() => setStep(1)}
                disabled={submitting}
              >
                Retour
              </Button>
              <Button
                type="submit"
                fullWidth
                loading={submitting}
                disabled={samplePhotos.length < 3 || samplePhotos.length > 10}
              >
                {submitting ? 'Envoi en cours...' : 'Soumettre ma demande'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  // Étape 3: Confirmation
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card className="p-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Demande envoyée avec succès !
        </h1>

        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Merci pour votre candidature ! Notre équipe va examiner votre profil et vos photos échantillons.
          Vous recevrez une réponse par email sous 3 à 5 jours ouvrables.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
          <h3 className="font-semibold text-blue-900 mb-3">Prochaines étapes :</h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>Notre équipe examinera votre demande et vos photos échantillons</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>Vous recevrez un email de validation ou de demande de complément d'information</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>Une fois approuvé, vous pourrez commencer à uploader vos photos</span>
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
          {user && (
            <Button variant="ghost" onClick={() => navigate('/profile')}>
              Mon profil
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
