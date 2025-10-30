import React from 'react';
import ImageWatermark from './ImageWatermark';

/**
 * Composant d'image protégée avec filigrane intégré
 * Empêche le téléchargement et ajoute automatiquement un filigrane "Pouire"
 * @param {Object} props
 * @param {string} props.src - URL de l'image
 * @param {string} props.alt - Texte alternatif
 * @param {string} props.className - Classes CSS supplémentaires
 * @param {boolean} props.showPattern - Afficher le motif répété en arrière-plan (par défaut: true)
 * @param {string} props.position - Position du filigrane (par défaut: 'center')
 * @param {Function} props.onClick - Fonction de clic
 * @param {boolean} props.loading - Lazy loading (par défaut: 'lazy')
 * @param {Object} props.style - Styles inline
 * @param {string} props.brandName - Nom de la marque (par défaut: 'Pouire')
 */
export default function ProtectedImage({
  src,
  alt = '',
  className = '',
  showPattern = true,
  position = 'center',
  onClick,
  loading = 'lazy',
  style = {},
  brandName = 'Pouire',
  ...otherProps
}) {
  return (
    <div className={`relative ${className}`} style={style}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover protected-image"
        loading={loading}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onClick={onClick}
        {...otherProps}
      />
      <ImageWatermark
        brandName={brandName}
        showPattern={showPattern}
        position={position}
      />
    </div>
  );
}
