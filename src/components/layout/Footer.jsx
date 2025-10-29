import React from 'react';
import { Link } from 'react-router-dom';
import { FiCamera, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <FiCamera className="w-8 h-8 text-primary-400" />
              <span className="text-2xl font-bold">AfroLens</span>
            </div>
            <p className="text-gray-400 text-sm">
              La première plateforme de vente de photos professionnelles africaines.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Explorer</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/search" className="hover:text-white">Photos</Link></li>
              <li><Link to="/categories" className="hover:text-white">Catégories</Link></li>
              <li><Link to="/photographers" className="hover:text-white">Photographes</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">À propos</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-white">Qui sommes-nous</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link to="/terms" className="hover:text-white">Conditions</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400"><FiFacebook className="w-6 h-6" /></a>
              <a href="#" className="hover:text-primary-400"><FiInstagram className="w-6 h-6" /></a>
              <a href="#" className="hover:text-primary-400"><FiTwitter className="w-6 h-6" /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 AfroLens by TANGA GROUP. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
