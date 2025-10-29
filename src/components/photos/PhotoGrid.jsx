import PhotoCard from './PhotoCard';

/**
 * Composant PhotoGrid pour afficher une grille de photos
 * @param {Object} props
 * @param {Array} props.photos - Tableau de photos
 * @param {boolean} props.loading - État de chargement
 * @param {React.ReactNode} props.emptyState - Composant à afficher si vide
 * @param {boolean} props.showPhotographer - Afficher le nom du photographe sur les cartes
 */
export default function PhotoGrid({
  photos = [],
  loading = false,
  emptyState = null,
  showPhotographer = true,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="bg-gray-200 rounded-lg overflow-hidden animate-pulse"
          >
            <div className="aspect-[4/3] bg-gray-300"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!photos || photos.length === 0) {
    return (
      emptyState || (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📷</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Aucune photo trouvée
          </h3>
          <p className="text-gray-500">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      )
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          showPhotographer={showPhotographer}
        />
      ))}
    </div>
  );
}
