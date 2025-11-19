import React, { useState, useEffect } from 'react';

// Configuration des pays avec leurs indicatifs et patterns
const COUNTRIES = [
  {
    code: 'BF',
    name: 'Burkina Faso',
    dialCode: '+226',
    pattern: 'XX XX XX XX',
    placeholder: '70 12 34 56',
    regex: /^[0-9]{8}$/,
    example: '+226 70 12 34 56',
  },
  {
    code: 'BJ',
    name: 'Bénin',
    dialCode: '+229',
    pattern: 'XX XX XX XX',
    placeholder: '97 12 34 56',
    regex: /^[0-9]{8}$/,
    example: '+229 97 12 34 56',
  },
  {
    code: 'CI',
    name: 'Côte d\'Ivoire',
    dialCode: '+225',
    pattern: 'XX XX XX XX XX',
    placeholder: '07 12 34 56 78',
    regex: /^[0-9]{10}$/,
    example: '+225 07 12 34 56 78',
  },
  {
    code: 'TG',
    name: 'Togo',
    dialCode: '+228',
    pattern: 'XX XX XX XX',
    placeholder: '90 12 34 56',
    regex: /^[0-9]{8}$/,
    example: '+228 90 12 34 56',
  },
  {
    code: 'SN',
    name: 'Sénégal',
    dialCode: '+221',
    pattern: 'XX XXX XX XX',
    placeholder: '77 123 45 67',
    regex: /^[0-9]{9}$/,
    example: '+221 77 123 45 67',
  },
  {
    code: 'ML',
    name: 'Mali',
    dialCode: '+223',
    pattern: 'XX XX XX XX',
    placeholder: '70 12 34 56',
    regex: /^[0-9]{8}$/,
    example: '+223 70 12 34 56',
  },
  {
    code: 'NE',
    name: 'Niger',
    dialCode: '+227',
    pattern: 'XX XX XX XX',
    placeholder: '90 12 34 56',
    regex: /^[0-9]{8}$/,
    example: '+227 90 12 34 56',
  },
  {
    code: 'FR',
    name: 'France',
    dialCode: '+33',
    pattern: 'X XX XX XX XX',
    placeholder: '6 12 34 56 78',
    regex: /^[0-9]{9}$/,
    example: '+33 6 12 34 56 78',
  },
];

/**
 * Formater un numéro de téléphone selon le pattern du pays
 */
const formatPhoneNumber = (value, pattern) => {
  const numbers = value.replace(/\D/g, '');
  let formatted = '';
  let numberIndex = 0;

  for (let i = 0; i < pattern.length && numberIndex < numbers.length; i++) {
    if (pattern[i] === 'X') {
      formatted += numbers[numberIndex];
      numberIndex++;
    } else {
      formatted += pattern[i];
    }
  }

  return formatted;
};

/**
 * Composant d'input pour numéro de téléphone avec sélection du pays
 */
export default function PhoneInput({
  label = 'Téléphone',
  value = '',
  onChange,
  required = false,
  helperText = '',
  error = '',
  defaultCountry = 'BF', // Burkina Faso par défaut
}) {
  const [selectedCountry, setSelectedCountry] = useState(
    COUNTRIES.find((c) => c.code === defaultCountry) || COUNTRIES[0]
  );
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showCountryList, setShowCountryList] = useState(false);

  // Parser et afficher la valeur initiale
  useEffect(() => {
    if (value) {
      // Extraire les chiffres du numéro
      const numbers = value.replace(/\D/g, '');

      // Trouver le pays correspondant au préfixe
      const matchedCountry = COUNTRIES.find(country =>
        value.startsWith(country.dialCode)
      );

      if (matchedCountry) {
        setSelectedCountry(matchedCountry);
        // Retirer l'indicatif pour obtenir le numéro local
        const dialCodeDigits = matchedCountry.dialCode.replace(/\D/g, '');
        const localNumber = numbers.substring(dialCodeDigits.length);
        // Formater pour l'affichage
        const formatted = formatPhoneNumber(localNumber, matchedCountry.pattern);
        setPhoneNumber(formatted);
      } else {
        // Si pas de pays trouvé, utiliser le numéro tel quel
        const formatted = formatPhoneNumber(numbers, selectedCountry.pattern);
        setPhoneNumber(formatted);
      }
    }
  }, [value]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowCountryList(false);
    // Réinitialiser le numéro lors du changement de pays
    setPhoneNumber('');
    if (onChange) {
      onChange('');
    }
  };

  const handlePhoneChange = (e) => {
    const input = e.target.value;
    const numbers = input.replace(/\D/g, '');

    // Limiter au nombre de chiffres du pattern
    const maxDigits = selectedCountry.pattern.split('X').length - 1;
    const limitedNumbers = numbers.slice(0, maxDigits);

    // Formater selon le pattern pour l'affichage
    const formatted = formatPhoneNumber(limitedNumbers, selectedCountry.pattern);

    setPhoneNumber(formatted);

    // Retourner le numéro complet avec l'indicatif (format international sans espaces)
    if (onChange) {
      const fullNumber = limitedNumbers ? `${selectedCountry.dialCode}${limitedNumbers}` : '';
      onChange(fullNumber);
    }
  };

  const isValid = () => {
    const numbers = phoneNumber.replace(/\D/g, '');
    return selectedCountry.regex.test(numbers);
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="flex gap-2">
        {/* Sélecteur de pays */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCountryList(!showCountryList)}
            className="h-full px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-w-[100px] flex items-center justify-between gap-2"
          >
            <span className="text-sm font-medium">
              {selectedCountry.code}
            </span>
            <span className="text-xs text-gray-600">
              {selectedCountry.dialCode}
            </span>
          </button>

          {/* Liste déroulante des pays */}
          {showCountryList && (
            <>
              {/* Overlay pour fermer la liste */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowCountryList(false)}
              />

              {/* Liste des pays */}
              <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                {COUNTRIES.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                      selectedCountry.code === country.code
                        ? 'bg-primary/5 text-primary'
                        : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-sm">{country.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {country.example}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        {country.dialCode}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Input du numéro */}
        <div className="flex-1">
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder={selectedCountry.placeholder}
            required={required}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300'
            }`}
          />
        </div>
      </div>

      {/* Texte d'aide */}
      {(helperText || error) && (
        <p
          className={`mt-2 text-xs ${
            error ? 'text-red-500' : 'text-gray-500'
          }`}
        >
          {error || helperText}
        </p>
      )}

      {/* Exemple de format */}
      {!error && phoneNumber && !isValid() && (
        <p className="mt-2 text-xs text-orange-500">
          Format attendu: {selectedCountry.example}
        </p>
      )}
    </div>
  );
}
