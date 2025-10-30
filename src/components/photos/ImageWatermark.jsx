import React from 'react';

/**
 * Composant de filigrane pour les images
 * Ajoute un filigrane semi-transparent sur les images pour les protéger
 * @param {Object} props
 * @param {string} props.brandName - Nom de la marque à afficher (par défaut: "POUIRE")
 * @param {boolean} props.showPattern - Afficher le motif répété en arrière-plan (par défaut: false)
 * @param {string} props.position - Position du filigrane: 'bottom-right', 'center', 'bottom-left', 'top-right', 'top-left' (par défaut: 'bottom-right')
 */
export default function ImageWatermark({
  brandName = 'POUIRE',
  showPattern = false,
  position = 'bottom-right'
}) {

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl'
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* Motif répété optionnel */}
      {showPattern && (
        <div
          className="absolute inset-0 opacity-5 text-gray-900"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 100px,
              currentColor 100px,
              currentColor 101px
            )`
          }}
        >
          <div
            className="absolute inset-0 flex flex-wrap items-center justify-center gap-24 p-8"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'center'
            }}
          >
            {[...Array(20)].map((_, i) => (
              <span
                key={i}
                className="text-2xl font-bold whitespace-nowrap opacity-10"
              >
                {brandName}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filigrane principal */}
      <div className={`absolute ${positionClasses[position]} text-white/20 text-xs font-bold select-none`}>
        © {brandName}
      </div>
    </div>
  );
}
