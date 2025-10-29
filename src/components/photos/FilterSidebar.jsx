import React, { useState } from 'react';
import { categories } from '../../data/mockData';
import Button from '../common/Button';

/**
 * Composant FilterSidebar pour filtrer les photos
 * @param {Object} props
 * @param {Object} props.filters - Filtres actuels
 * @param {Function} props.onFilterChange - Callback quand les filtres changent
 * @param {Function} props.onReset - Callback pour réinitialiser les filtres
 */
export default function FilterSidebar({ filters, onFilterChange, onReset }) {
  const handleCategoryChange = (categoryId) => {
    const currentCategories = filters.category || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id) => id !== categoryId)
      : [...currentCategories, categoryId];
    onFilterChange({ ...filters, category: newCategories });
  };

  const handlePriceChange = (type, value) => {
    onFilterChange({
      ...filters,
      [type]: value ? parseFloat(value) : undefined,
    });
  };

  const handleOrientationChange = (orientation) => {
    onFilterChange({
      ...filters,
      orientation: filters.orientation === orientation ? undefined : orientation,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Filtres</h2>
        <button
          onClick={onReset}
          className="text-sm text-primary hover:text-primary-dark"
        >
          Réinitialiser
        </button>
      </div>

      {/* Catégories */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-gray-900">Catégories</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
            >
              <input
                type="checkbox"
                checked={(filters.category || []).includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Prix */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-gray-900">Prix (FCFA)</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Minimum</label>
            <input
              type="number"
              value={filters.min_price || ''}
              onChange={(e) => handlePriceChange('min_price', e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Maximum</label>
            <input
              type="number"
              value={filters.max_price || ''}
              onChange={(e) => handlePriceChange('max_price', e.target.value)}
              placeholder="100000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Orientation */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-gray-900">Orientation</h3>
        <div className="space-y-2">
          {[
            { value: 'landscape', label: 'Paysage', icon: '🖼️' },
            { value: 'portrait', label: 'Portrait', icon: '📱' },
            { value: 'square', label: 'Carré', icon: '⬜' },
          ].map((orientation) => (
            <button
              key={orientation.value}
              onClick={() => handleOrientationChange(orientation.value)}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                filters.orientation === orientation.value
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span>{orientation.icon}</span>
              <span className="text-sm font-medium">{orientation.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bouton Appliquer (mobile) */}
      <Button fullWidth className="md:hidden">
        Appliquer les filtres
      </Button>
    </div>
  );
}
