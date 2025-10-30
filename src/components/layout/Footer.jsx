import React from "react";
import { Link } from "react-router-dom";
import { FiCamera, FiFacebook, FiInstagram } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <FiCamera className="w-6 h-6 sm:w-8 sm:h-8 text-primary-400" />
              <span className="text-xl sm:text-2xl font-bold">POUIRE</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              La première plateforme de vente de photos professionnelles
              africaines.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
              Explorer
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  to="/search"
                  className="hover:text-white transition-colors"
                >
                  Photos
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="hover:text-white transition-colors"
                >
                  Catégories
                </Link>
              </li>
              <li>
                <Link
                  to="/photographers"
                  className="hover:text-white transition-colors"
                >
                  Photographes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
              À propos
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  to="/about"
                  className="hover:text-white transition-colors"
                >
                  Qui sommes-nous
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-white transition-colors"
                >
                  Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
              Suivez-nous
            </h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="hover:text-primary-400 transition-colors"
                aria-label="Facebook"
              >
                <FiFacebook className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a
                href="#"
                className="hover:text-primary-400 transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a
                href="#"
                className="hover:text-primary-400 transition-colors"
                aria-label="X (Twitter)"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
          <p>&copy; 2025 POUIRE by TANGA GROUP. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
