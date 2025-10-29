import React from 'react';

/**
 * Composant Badge pour afficher des statuts ou tags
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenu du badge
 * @param {'success'|'warning'|'danger'|'info'|'gray'} props.variant - Variante de couleur
 * @param {'sm'|'md'|'lg'} props.size - Taille du badge
 * @param {string} props.className - Classes CSS additionnelles
 */
export default function Badge({
  children,
  variant = 'gray',
  size = 'md',
  className = '',
}) {
  const variantClasses = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
}
