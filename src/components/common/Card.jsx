import React from 'react';

/**
 * Composant Card réutilisable
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenu de la carte
 * @param {string} props.className - Classes CSS additionnelles
 * @param {boolean} props.hoverable - Effet hover
 * @param {Function} props.onClick - Callback au clic
 * @param {boolean} props.noPadding - Sans padding
 */
export default function Card({
  children,
  className = '',
  hoverable = false,
  onClick,
  noPadding = false,
}) {
  const baseClasses = 'bg-white rounded-lg shadow-md';
  const hoverClasses = hoverable
    ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer'
    : '';
  const paddingClasses = noPadding ? '' : 'p-6';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${paddingClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
