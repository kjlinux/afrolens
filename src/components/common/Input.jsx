import React, { forwardRef } from 'react';

/**
 * Composant Input réutilisable avec label, erreur et icône
 * @param {Object} props
 * @param {string} props.label - Label de l'input
 * @param {string} props.error - Message d'erreur
 * @param {string} props.helperText - Texte d'aide
 * @param {React.ReactNode} props.icon - Icône à gauche
 * @param {React.ReactNode} props.rightIcon - Icône à droite
 * @param {boolean} props.required - Champ requis
 * @param {string} props.className - Classes CSS additionnelles
 */
const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon,
      rightIcon,
      required = false,
      className = '',
      type = 'text',
      ...props
    },
    ref
  ) => {
    const inputClasses = `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
      icon ? 'pl-10' : ''
    } ${rightIcon ? 'pr-10' : ''} ${
      error
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:border-primary'
    } ${className}`;

    return (
      <div className="mb-4">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}

          <input ref={ref} type={type} className={inputClasses} {...props} />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
