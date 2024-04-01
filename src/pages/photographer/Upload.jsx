import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { uploadPhoto } from '../../services/photographerService';
import { CategoriesService } from '../../api';
import { CONFIG, LICENSE_TYPES } from '../../utils/constants';
import { PERMISSIONS } from '../../utils/permissions';
import { formatFileSize } from '../../utils/helpers';
import { PhotographerGuard } from '../../components/auth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export default function Upload() {
  const { user, hasPermission, canUploadPhotos } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState(null);

  const [files, setFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    tags: '',
    price_standard: 500,
    price_extended: 1500,
    location: '',
  });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoriesService.indexCategories();
        if (response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Helper functions for categories
  const getMainCategories = () => categories.filter(cat => !cat.parent_id);
  const getSubCategories = (parentId) => categories.filter(cat => cat.parent_id === parentId);

  const mainCategories = getMainCategories();

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Gérer les fichiers rejetés
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(file => {
        if (file.file.size > CONFIG.MAX_FILE_SIZE) {
          return `${file.file.name}: Fichier trop volumineux (max ${formatFileSize(CONFIG.MAX_FILE_SIZE)})`;
        }
        if (!CONFIG.ACCEPTED_IMAGE_FORMATS.includes(file.file.type)) {
          return `${file.file.name}: Format non supporté`;
        }
        return `${file.file.name}: Erreur inconnue`;
      });
      setMessage({ type: 'error', text: errors.join(', ') });
      return;
    }

    // Traiter les fichiers acceptés
    const newFiles = acceptedFiles.map(file => {
      // Créer une prévisualisation
      const preview = URL.createObjectURL(file);

      return {
        file,
        preview,
        metadata: {
          title: '',
          description: '',
          category_id: '',
          tags: '',
          price_standard: '',
          price_extended: '',
          location: '',
        }
      };
    });

    setFiles(prev => [...prev, ...newFiles]);
    setMessage({ type: 'success', text: `${acceptedFiles.length} photo(s) ajoutée(s)` });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: CONFIG.MAX_FILE_SIZE,
    multiple: true,
  });

  const removeFile = (index) => {
    setFiles(prev => {
      const newFiles = [...prev];
      // Libérer l'URL de prévisualisation
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });

    // Ajuster l'index actuel si nécessaire
    if (currentFileIndex >= files.length - 1) {
      setCurrentFileIndex(Math.max(0, files.length - 2));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner au moins une photo' });
      return;
    }

    // Validation
    if (!formData.title.trim()) {
      setMessage({ type: 'error', text: 'Le titre est obligatoire' });
      return;
    }

    if (!formData.category_id) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner une catégorie' });
      return;
    }

    const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
    if (tags.length < CONFIG.MIN_TAGS_PER_PHOTO) {
      setMessage({
        type: 'error',
        text: `Veuillez ajouter au moins ${CONFIG.MIN_TAGS_PER_PHOTO} tags`
      });
      return;
    }

    if (tags.length > CONFIG.MAX_TAGS_PER_PHOTO) {
      setMessage({
        type: 'error',
        text: `Maximum ${CONFIG.MAX_TAGS_PER_PHOTO} tags autorisés`
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setMessage(null);

    try {
      // Upload chaque fichier
      const uploadPromises = files.map(async (fileData, index) => {
        const photoData = {
          image: fileData.file,
          title: fileData.metadata.title || formData.title,
          description: fileData.metadata.description || formData.description,
          category_id: fileData.metadata.category_id || formData.category_id,
          tags: (fileData.metadata.tags || formData.tags).split(',').map(t => t.trim()).filter(t => t.length > 0),
          price_standard: parseFloat(fileData.metadata.price_standard) || formData.price_standard,
          price_extended: parseFloat(fileData.metadata.price_extended) || formData.price_extended,
          location: fileData.metadata.location || formData.location,
        };

        // Mettre à jour la progression
        setUploadProgress(Math.round(((index + 1) / files.length) * 100));

        return await uploadPhoto(photoData);
      });

      const results = await Promise.all(uploadPromises);

      setMessage({
        type: 'success',
        text: `${files.length} photo(s) uploadée(s) avec succès! En attente de modération.`
      });

      // Réinitialiser après 2 secondes
      setTimeout(() => {
        setFiles([]);
        setFormData({
          title: '',
          description: '',
          category_id: '',
          tags: '',
          price_standard: 500,
          price_extended: 1500,
          location: '',
        });
        setUploadProgress(0);
        // Rediriger vers la page de gestion des photos
        // navigate('/photographer/photos');
      }, 2000);

    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'upload. Veuillez réessayer.' });
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const currentFile = files[currentFileIndex];

  return (
    <PhotographerGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Uploader des Photos</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Ajoutez vos photos à la plateforme POUIRE
          </p>
        </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center">
            <svg
              className="h-5 w-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              {message.type === 'success' ? (
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              )}
            </svg>
            {message.text}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Zone de drop */}
        <div className="lg:col-span-2">
          <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Sélectionner les photos</h3>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 sm:p-8 lg:p-12 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 hover:border-primary'
              }`}
            >
              <input {...getInputProps()} />

              <svg
                className={`mx-auto h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 mb-3 sm:mb-4 ${
                  isDragActive ? 'text-primary' : 'text-gray-400'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>

              {isDragActive ? (
                <p className="text-base sm:text-lg text-primary font-medium mb-2">
                  Déposez les photos ici...
                </p>
              ) : (
                <>
                  <p className="text-base sm:text-lg text-gray-900 font-medium mb-2">
                    Glissez-déposez vos photos ici
                  </p>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                    ou cliquez pour sélectionner des fichiers
                  </p>
                </>
              )}

              <p className="text-xs sm:text-sm text-gray-500">
                JPG, JPEG, PNG jusqu'à {formatFileSize(CONFIG.MAX_FILE_SIZE)}
              </p>
            </div>
          </Card>

          {/* Liste des fichiers sélectionnés */}
          {files.length > 0 && (
            <Card className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
                <h3 className="text-base sm:text-lg font-semibold">
                  Photos sélectionnées ({files.length})
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    files.forEach(f => URL.revokeObjectURL(f.preview));
                    setFiles([]);
                    setCurrentFileIndex(0);
                  }}
                  disabled={uploading}
                >
                  Tout supprimer
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {files.map((fileObj, index) => (
                  <div
                    key={index}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 ${
                      index === currentFileIndex
                        ? 'border-primary'
                        : 'border-transparent'
                    }`}
                    onClick={() => setCurrentFileIndex(index)}
                  >
                    <div className="aspect-square">
                      <img
                        src={fileObj.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Bouton de suppression */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      disabled={uploading}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Indicateur de sélection */}
                    {index === currentFileIndex && (
                      <div className="absolute top-2 left-2 p-1 bg-primary text-white rounded-full">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}

                    {/* Nom du fichier */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
                      {fileObj.file.name}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Formulaire de métadonnées */}
        <div className="lg:col-span-1">
          <Card className="p-4 sm:p-6 lg:sticky lg:top-4">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Informations de la photo</h3>

            {files.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <svg
                  className="mx-auto h-10 w-10 sm:h-12 sm:w-12 mb-2 sm:mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm sm:text-base">Ajoutez des photos pour commencer</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Prévisualisation de la photo sélectionnée */}
                {currentFile && (
                  <div className="mb-4">
                    <img
                      src={currentFile.preview}
                      alt="Preview"
                      className="w-full rounded-lg"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      {formatFileSize(currentFile.file.size)} • Photo {currentFileIndex + 1}/{files.length}
                    </p>
                  </div>
                )}

                {/* Titre */}
                <Input
                  label="Titre"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  disabled={uploading}
                  placeholder="Titre descriptif de la photo"
                />

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={uploading}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Décrivez votre photo..."
                  />
                </div>

                {/* Catégorie */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    required
                    disabled={uploading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {mainCategories.map(cat => (
                      <optgroup key={cat.id} label={cat.name}>
                        <option value={cat.id}>{cat.name}</option>
                        {getSubCategories(cat.id).map(subCat => (
                          <option key={subCat.id} value={subCat.id}>
                            → {subCat.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    required
                    disabled={uploading}
                    placeholder="sport, football, équipe nationale"
                    helperText={`Minimum ${CONFIG.MIN_TAGS_PER_PHOTO} tags, séparés par des virgules`}
                  />
                </div>

                {/* Prix */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Prix Standard (FCFA)"
                    name="price_standard"
                    type="number"
                    value={formData.price_standard}
                    onChange={handleInputChange}
                    required
                    disabled={uploading}
                    min="5"
                    step="5"
                  />
                  <Input
                    label="Prix Étendu (FCFA)"
                    name="price_extended"
                    type="number"
                    value={formData.price_extended}
                    onChange={handleInputChange}
                    required
                    disabled={uploading}
                    min="20"
                    step="5"
                  />
                </div>

                {/* Localisation */}
                <Input
                  label="Localisation"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={uploading}
                  placeholder="Ouagadougou, Burkina Faso"
                />

                {/* Barre de progression */}
                {uploading && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Upload en cours...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Boutons d'action */}
                <div className="space-y-2">
                  <Button
                    type="submit"
                    fullWidth
                    loading={uploading}
                    disabled={files.length === 0}
                  >
                    {uploading ? 'Upload en cours...' : `Uploader ${files.length} photo(s)`}
                  </Button>

                  {files.length > 0 && !uploading && (
                    <Button
                      type="button"
                      variant="ghost"
                      fullWidth
                      onClick={() => navigate('/photographer/photos')}
                    >
                      Annuler
                    </Button>
                  )}
                </div>

                {/* Informations */}
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-xs sm:text-sm font-semibold text-blue-900 mb-2">
                    À savoir
                  </h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Les photos seront modérées avant publication</li>
                    <li>• Un watermark sera automatiquement ajouté</li>
                    <li>• Commission de {CONFIG.COMMISSION_RATE * 100}% sur les ventes</li>
                    <li>• Retrait minimum: {CONFIG.MINIMUM_WITHDRAWAL} FCFA</li>
                  </ul>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
      </div>
    </PhotographerGuard>
  );
}
