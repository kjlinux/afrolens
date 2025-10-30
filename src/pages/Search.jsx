import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchPhotos } from '../services/photoService';
import PhotoGrid from '../components/photos/PhotoGrid';
import FilterSidebar from '../components/photos/FilterSidebar';
import { FiSearch, FiSliders } from 'react-icons/fi';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: [],
    min_price: undefined,
    max_price: undefined,
    orientation: undefined,
    sort_by: 'popularity',
  });
  const [totalResults, setTotalResults] = useState(0);

  // Charger les photos selon les filtres
  useEffect(() => {
    loadPhotos();
  }, [filters, searchQuery]);

  const loadPhotos = async () => {
    setLoading(true);
    try {
      const result = await searchPhotos(searchQuery, filters);
      setPhotos(result.data || result);
      setTotalResults(result.total || result.length);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      category: [],
      min_price: undefined,
      max_price: undefined,
      orientation: undefined,
      sort_by: 'popularity',
    });
  };

  const handleSortChange = (e) => {
    setFilters({ ...filters, sort_by: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header avec recherche */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Recherche de photos</h1>

          {/* Barre de recherche */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher des photos (sport, culture, événements...)"
                className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Rechercher
              </button>
            </div>
          </form>

          {/* Résultats et tri */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-gray-600">
              {loading ? (
                'Recherche en cours...'
              ) : (
                <>
                  <span className="font-semibold">{totalResults}</span> photo
                  {totalResults > 1 ? 's' : ''} trouvée
                  {totalResults > 1 ? 's' : ''}
                  {searchQuery && ` pour "${searchQuery}"`}
                </>
              )}
            </p>

            <div className="flex items-center gap-4">
              {/* Bouton filtres mobile */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FiSliders className="w-4 h-4" />
                Filtres
              </button>

              {/* Tri */}
              <select
                value={filters.sort_by}
                onChange={handleSortChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="popularity">Plus populaires</option>
                <option value="date">Plus récentes</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grille avec filtres */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar filtres */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Grille de photos */}
          <div className="lg:col-span-3">
            <PhotoGrid photos={photos} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
