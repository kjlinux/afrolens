import React from 'react';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Conditions d'utilisation</h1>
          <p className="text-xl max-w-3xl">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <div className="flex items-start space-x-3 mb-4">
            <FiAlertCircle className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-600 leading-relaxed">
                Bienvenue sur POUIRE. En utilisant notre plateforme, vous acceptez d'être lié par les présentes
                conditions d'utilisation. Veuillez les lire attentivement avant d'utiliser nos services.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Définitions */}
        <section className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Définitions</h2>
          <div className="space-y-4 text-gray-600">
            <div>
              <span className="font-semibold text-gray-900">Plateforme :</span> Le site web POUIRE et tous ses services associés.
            </div>
            <div>
              <span className="font-semibold text-gray-900">Photographe :</span> Tout utilisateur ayant le statut de photographe professionnel vérifié sur la plateforme.
            </div>
            <div>
              <span className="font-semibold text-gray-900">Acheteur :</span> Tout utilisateur qui achète des licences de photos sur la plateforme.
            </div>
            <div>
              <span className="font-semibold text-gray-900">Contenu :</span> Toutes les photos, images, descriptions et métadonnées téléchargées sur la plateforme.
            </div>
          </div>
        </section>

        {/* Section 2: Inscription et compte */}
        <section className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Inscription et compte utilisateur</h2>
          <div className="space-y-4 text-gray-600">
            <div className="flex items-start space-x-3">
              <FiCheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
              <p>Vous devez avoir au moins 18 ans pour créer un compte sur POUIRE.</p>
            </div>
            <div className="flex items-start space-x-3">
              <FiCheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
              <p>Vous êtes responsable de la confidentialité de vos identifiants de connexion.</p>
            </div>
            <div className="flex items-start space-x-3">
              <FiCheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
              <p>Vous devez fournir des informations exactes et à jour lors de votre inscription.</p>
            </div>
            <div className="flex items-start space-x-3">
              <FiCheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
              <p>Un seul compte par personne est autorisé.</p>
            </div>
          </div>
        </section>

        {/* Section 3: Pour les photographes */}
        <section className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Conditions pour les photographes</h2>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">3.1 Droits et responsabilités</h3>
          <div className="space-y-3 text-gray-600 mb-6">
            <p>En tant que photographe, vous garantissez que :</p>
            <div className="flex items-start space-x-3">
              <FiCheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
              <p>Vous détenez tous les droits sur les photos que vous téléchargez.</p>
            </div>
            <div className="flex items-start space-x-3">
              <FiCheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
              <p>Vous avez obtenu tous les consentements nécessaires (modèles, propriétés).</p>
            </div>
            <div className="flex items-start space-x-3">
              <FiCheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
              <p>Vos photos ne violent aucun droit de propriété intellectuelle.</p>
            </div>
            <div className="flex items-start space-x-3">
              <FiCheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
              <p>Vos photos respectent nos standards de qualité et nos directives de contenu.</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">3.2 Rémunération</h3>
          <div className="space-y-3 text-gray-600 mb-6">
            <p>Les photographes reçoivent 70% du prix de vente de chaque photo vendue.</p>
            <p>Les paiements sont effectués mensuellement, avec un seuil minimum de 50 USD.</p>
            <p>POUIRE se réserve le droit de modifier les taux de commission avec un préavis de 30 jours.</p>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">3.3 Licence accordée à POUIRE</h3>
          <div className="space-y-3 text-gray-600">
            <p>
              En téléchargeant vos photos, vous accordez à POUIRE une licence non-exclusive, mondiale et
              gratuite pour afficher, distribuer et commercialiser vos photos sur la plateforme.
            </p>
            <p>
              Vous conservez tous vos droits d'auteur et pouvez vendre vos photos ailleurs.
            </p>
          </div>
        </section>

        {/* Section 4: Pour les acheteurs */}
        <section className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Conditions pour les acheteurs</h2>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">4.1 Types de licences</h3>
          <div className="space-y-4 text-gray-600 mb-6">
            <div>
              <p className="font-semibold text-gray-900">Licence Personnelle :</p>
              <p className="ml-4">Usage non-commercial uniquement (blogs personnels, réseaux sociaux, projets personnels).</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Licence Commerciale :</p>
              <p className="ml-4">Usage commercial autorisé (publicité, marketing, sites web d'entreprise, produits imprimés).</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Licence Éditoriale :</p>
              <p className="ml-4">Usage éditorial uniquement (journaux, magazines, documentaires).</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">4.2 Restrictions d'utilisation</h3>
          <div className="space-y-3 text-gray-600">
            <p>Vous n'êtes pas autorisé à :</p>
            <div className="flex items-start space-x-3">
              <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
              <p>Revendre, redistribuer ou partager les fichiers originaux.</p>
            </div>
            <div className="flex items-start space-x-3">
              <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
              <p>Utiliser les photos pour créer des produits dérivés destinés à la vente (sauf licence étendue).</p>
            </div>
            <div className="flex items-start space-x-3">
              <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
              <p>Prétendre que vous êtes l'auteur des photos.</p>
            </div>
            <div className="flex items-start space-x-3">
              <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
              <p>Utiliser les photos de manière diffamatoire, pornographique ou illégale.</p>
            </div>
          </div>
        </section>

        {/* Section 5: Contenu interdit */}
        <section className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Contenu interdit</h2>
          <p className="text-gray-600 mb-4">Les types de contenu suivants sont strictement interdits :</p>
          <div className="space-y-3 text-gray-600">
            <div className="flex items-start space-x-3">
              <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
              <p>Contenu violent, haineux ou discriminatoire</p>
            </div>
            <div className="flex items-start space-x-3">
              <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
              <p>Contenu pornographique ou sexuellement explicite</p>
            </div>
            <div className="flex items-start space-x-3">
              <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
              <p>Contenu violant des droits de propriété intellectuelle</p>
            </div>
            <div className="flex items-start space-x-3">
              <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
              <p>Contenu illégal ou encourageant des activités illégales</p>
            </div>
          </div>
        </section>

        {/* Section 6: Paiements et remboursements */}
        <section className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Paiements et remboursements</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Tous les paiements sont traités de manière sécurisée via nos partenaires de paiement.
            </p>
            <p>
              Les prix sont affichés en USD et peuvent être convertis dans votre devise locale.
            </p>
            <p>
              Étant donné la nature numérique des produits, les remboursements ne sont généralement pas
              possibles sauf en cas d'erreur technique ou de problème de téléchargement.
            </p>
            <p>
              Pour toute demande de remboursement, contactez notre support dans les 7 jours suivant l'achat.
            </p>
          </div>
        </section>

        {/* Section 7: Propriété intellectuelle */}
        <section className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Propriété intellectuelle</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Tous les droits de propriété intellectuelle sur la plateforme POUIRE (design, code, logo, marque)
              appartiennent à TANGA GROUP.
            </p>
            <p>
              Les photographes conservent tous les droits d'auteur sur leurs photos.
            </p>
            <p>
              Les acheteurs reçoivent uniquement les droits d'utilisation spécifiés dans leur licence.
            </p>
          </div>
        </section>

        {/* Section 8: Limitation de responsabilité */}
        <section className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Limitation de responsabilité</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              POUIRE agit comme intermédiaire entre les photographes et les acheteurs. Nous ne garantissons
              pas l'exactitude, la qualité ou la légalité du contenu téléchargé par les utilisateurs.
            </p>
            <p>
              POUIRE ne peut être tenu responsable des dommages directs, indirects, accessoires ou
              consécutifs résultant de l'utilisation de la plateforme.
            </p>
            <p>
              Notre responsabilité totale envers vous ne dépassera pas le montant que vous avez payé
              pour nos services au cours des 12 derniers mois.
            </p>
          </div>
        </section>

        {/* Section 9: Résiliation */}
        <section className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Résiliation du compte</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Vous pouvez fermer votre compte à tout moment depuis les paramètres de votre profil.
            </p>
            <p>
              Nous nous réservons le droit de suspendre ou de fermer votre compte si vous violez
              ces conditions d'utilisation.
            </p>
            <p>
              En cas de fermeture de compte, les licences déjà accordées restent valides.
            </p>
          </div>
        </section>

        {/* Section 10: Modifications */}
        <section className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Modifications des conditions</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications
              importantes seront notifiées par email.
            </p>
            <p>
              L'utilisation continue de la plateforme après les modifications constitue votre acceptation
              des nouvelles conditions.
            </p>
          </div>
        </section>

        {/* Section 11: Loi applicable */}
        <section className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">11. Loi applicable et juridiction</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Ces conditions sont régies par les lois de la République Démocratique du Congo.
            </p>
            <p>
              Tout litige sera soumis à la juridiction exclusive des tribunaux de Kinshasa.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-primary-50 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions ?</h2>
          <p className="text-gray-600 mb-4">
            Si vous avez des questions concernant ces conditions d'utilisation, n'hésitez pas à nous contacter.
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Nous contacter
          </a>
        </section>
      </div>
    </div>
  );
}
