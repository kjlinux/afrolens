import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { generateAvatarUrl } from '../../utils/helpers';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
  });

  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar_url || generateAvatarUrl(user?.first_name + ' ' + user?.last_name)
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Veuillez sélectionner une image valide' });
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'L\'image ne doit pas dépasser 5MB' });
        return;
      }

      // Créer une prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mettre à jour l'utilisateur dans le contexte
      const updatedUser = {
        ...user,
        ...formData,
        avatar_url: avatarPreview,
      };

      // En production, cela devrait appeler l'API
      updateUser(updatedUser);

      setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du profil' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || '',
    });
    setAvatarPreview(
      user?.avatar_url || generateAvatarUrl(user?.first_name + ' ' + user?.last_name)
    );
    setIsEditing(false);
    setMessage(null);
  };

  const getRoleBadge = (role) => {
    const configs = {
      buyer: { variant: 'info', label: 'Acheteur' },
      photographer: { variant: 'success', label: 'Photographe' },
      admin: { variant: 'danger', label: 'Administrateur' },
    };
    const config = configs[role] || configs.buyer;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mon Profil</h1>
        <p className="text-gray-600">Gérez vos informations personnelles</p>
      </div>

      {/* Message de succès/erreur */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche - Avatar et infos de base */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <img
                  src={avatarPreview}
                  alt={`${formData.first_name} ${formData.last_name}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                />
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors shadow-lg"
                    title="Changer la photo de profil"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              {/* Nom et rôle */}
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {formData.first_name} {formData.last_name}
              </h2>
              <div className="flex justify-center mb-4">
                {getRoleBadge(user?.role)}
              </div>
              <p className="text-sm text-gray-600 mb-4">{formData.email}</p>

              {/* Actions */}
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  fullWidth
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Modifier le profil
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button
                    type="submit"
                    form="profile-form"
                    loading={loading}
                    fullWidth
                  >
                    Enregistrer
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleCancel}
                    fullWidth
                    disabled={loading}
                  >
                    Annuler
                  </Button>
                </div>
              )}
            </div>

            {/* Statistiques rapides */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Statistiques
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Membre depuis</span>
                  <span className="font-medium text-gray-900">
                    {new Date(user?.created_at || Date.now()).toLocaleDateString('fr-FR', {
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                {user?.role === 'buyer' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Photos achetées</span>
                      <span className="font-medium text-gray-900">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Favoris</span>
                      <span className="font-medium text-gray-900">0</span>
                    </div>
                  </>
                )}
                {user?.role === 'photographer' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Photos publiées</span>
                      <span className="font-medium text-gray-900">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ventes</span>
                      <span className="font-medium text-gray-900">0</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Colonne droite - Formulaire d'édition */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Informations personnelles
            </h3>

            <form id="profile-form" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Prénom */}
                <Input
                  label="Prénom"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                />

                {/* Nom */}
                <Input
                  label="Nom"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                />
              </div>

              {/* Email */}
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />

              {/* Téléphone */}
              <Input
                label="Téléphone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
                helperText="Format: +226 XX XX XX XX"
              />

              {/* Localisation */}
              <Input
                label="Localisation"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                disabled={!isEditing}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
                helperText="Ville, Pays"
              />

              {/* Site web */}
              <Input
                label="Site web"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleInputChange}
                disabled={!isEditing}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                }
              />

              {/* Bio */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Biographie
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                    !isEditing ? 'bg-gray-50' : ''
                  }`}
                  placeholder="Parlez-nous un peu de vous..."
                />
                <p className="mt-1 text-sm text-gray-500">
                  {formData.bio.length} / 500 caractères
                </p>
              </div>
            </form>
          </Card>

          {/* Section sécurité */}
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Sécurité
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Mot de passe</p>
                  <p className="text-sm text-gray-600">
                    Dernière modification: Il y a 30 jours
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Modifier
                </Button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium text-gray-900">
                    Authentification à deux facteurs
                  </p>
                  <p className="text-sm text-gray-600">
                    Sécurisez votre compte avec 2FA
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Activer
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
