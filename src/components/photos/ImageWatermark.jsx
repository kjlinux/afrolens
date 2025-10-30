import React from 'react';

/**
 * Composant de filigrane pour les images
 * Ajoute un filigrane semi-transparent sur les images pour les protéger
 * @param {Object} props
 * @param {string} props.brandName - Nom de la marque à afficher (par défaut: "POUIRE")
 * @param {boolean} props.showPattern - Afficher le motif répété en arrière-plan (par défaut: true)
 * @param {string} props.position - Position du filigrane principal: 'bottom-right', 'center', 'bottom-left', 'top-right', 'top-left' (par défaut: 'center')
 */
export default function ImageWatermark({
  brandName = 'POUIRE',
  showPattern = true,
  position = 'center'
}) {

  // Générer un nombre suffisant de répétitions pour remplir l'image
  // On crée une grille de filigranes en diagonale
  const rows = 12; // Nombre de lignes augmenté
  const cols = 12; // Nombre de colonnes augmenté
  const totalWatermarks = rows * cols;

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      {/* Motif répété remplissant toute l'image */}
      <div className="absolute inset-0">
        <div
          className="absolute flex flex-wrap content-center justify-center"
          style={{
            transform: 'rotate(-45deg) scale(1.5)',
            transformOrigin: 'center center',
            width: '300%',
            height: '300%',
            left: '-100%',
            top: '-100%',
            gap: '50px 70px'
          }}
        >
          {[...Array(totalWatermarks)].map((_, i) => (
            <span
              key={i}
              className="text-2xl md:text-3xl font-bold whitespace-nowrap text-white/15 select-none"
              style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
              }}
            >
              {brandName}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
