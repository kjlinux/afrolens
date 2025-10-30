import React from 'react';
import { Link } from 'react-router-dom';
import { FiCamera, FiHeart, FiUsers, FiGlobe } from 'react-icons/fi';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Qui sommes-nous</h1>
          <p className="text-xl max-w-3xl">
            POUIRE est la première plateforme dédiée à la vente de photos professionnelles africaines.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre Mission</h2>
            <p className="text-gray-600 text-lg mb-4">
              POUIRE a pour mission de valoriser et de promouvoir le talent des photographes africains
              en leur offrant une plateforme mondiale pour vendre leurs œuvres.
            </p>
            <p className="text-gray-600 text-lg mb-4">
              Nous croyons en la richesse et la diversité de la photographie africaine. Notre plateforme
              permet aux créateurs de contenu, aux entreprises et aux particuliers du monde entier
              d'accéder à des images authentiques et de qualité professionnelle.
            </p>
            <p className="text-gray-600 text-lg">
              En mettant en relation photographes et acheteurs, nous contribuons au développement
              de l'économie créative africaine et à la diffusion d'une image positive et diversifiée du continent.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <FiCamera className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Photos Professionnelles</h3>
                  <p className="text-gray-600">Des images de haute qualité capturées par des talents africains</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <FiUsers className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Communauté Créative</h3>
                  <p className="text-gray-600">Un réseau de photographes passionnés et talentueux</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <FiGlobe className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Portée Mondiale</h3>
                  <p className="text-gray-600">Une plateforme accessible partout dans le monde</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <FiHeart className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Passion & Authenticité</h3>
                  <p className="text-gray-600">Des images qui racontent l'histoire vraie de l'Afrique</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Nos Valeurs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiHeart className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-gray-600">
                Nous sélectionnons rigoureusement chaque photo pour garantir la meilleure qualité à nos clients.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Équité</h3>
              <p className="text-gray-600">
                Nous rémunérons équitablement nos photographes et respectons leurs droits d'auteur.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiGlobe className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Diversité</h3>
              <p className="text-gray-600">
                Nous célébrons la richesse culturelle et la diversité des perspectives africaines.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Rejoignez-nous</h2>
          <p className="text-xl text-gray-600 mb-8">
            Que vous soyez photographe professionnel ou acheteur à la recherche d'images uniques,
            POUIRE est la plateforme qu'il vous faut.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/become-photographer"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Devenir photographe
            </Link>
            <Link
              to="/search"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition-colors"
            >
              Explorer les photos
            </Link>
          </div>
        </div>
      </div>

      {/* TANGA GROUP Section */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg">
            POUIRE est une initiative de <span className="font-bold text-primary-400">TANGA GROUP</span>
          </p>
          <p className="text-gray-400 mt-2">
            Ensemble, construisons l'avenir de la photographie africaine
          </p>
        </div>
      </div>
    </div>
  );
}
