# POUIRE - Plateforme de Vente de Photos Professionnelles

![POUIRE](https://img.shields.io/badge/Status-En%20D%C3%A9veloppement-yellow)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-06B6D4)

## 📋 Vue d'ensemble

POUIRE est une plateforme web professionnelle de type banque d'images permettant aux photographes de stocker, exposer et vendre leurs photos, et aux utilisateurs d'acheter et télécharger des photos haute résolution.

### Caractéristiques principales

- ✅ **69 photos professionnelles** avec métadonnées complètes
- ✅ **Système d'authentification** avec 3 rôles (Acheteur, Photographe, Admin)
- ✅ **Panier d'achat** avec persistance localStorage
- ✅ **Simulation paiement** (Mobile Money, Carte bancaire)
- ✅ **Dashboard photographe** avec statistiques
- ✅ **Panel administrateur** pour modération
- ✅ **Données mockées complètes** pour démonstration

---

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+ ou Bun
- pnpm (recommandé) ou npm

### Installation

```bash
# Cloner le projet
cd pouire/frontend

# Installer les dépendances
pnpm install

# Lancer le serveur de développement
pnpm dev
```

L'application sera accessible sur **http://localhost:5173**

---

## 👤 Comptes de Test

### Acheteur (Buyer)
- **Email**: `buyer@test.com`
- **Mot de passe**: `password123`
- **Accès**: Recherche, panier, commandes, favoris

### Photographe
- **Email**: `photographer@test.com`
- **Mot de passe**: `password123`
- **Accès**: Dashboard, upload photos, revenus, analytics

### Administrateur
- **Email**: `admin@test.com`
- **Mot de passe**: `password123`
- **Accès**: Dashboard admin, modération, gestion utilisateurs

---

## 📁 Structure du Projet

```
frontend/
├── public/
│   └── images/              # 69 photos (pic_001.jpg à pic_069.jpg)
├── src/
│   ├── components/
│   │   ├── common/          # Composants réutilisables (à développer)
│   │   ├── layout/          # Navbar, Footer ✅
│   │   ├── auth/            # Composants auth (à développer)
│   │   ├── photos/          # Composants photos (à développer)
│   │   └── ...
│   ├── pages/
│   │   ├── Home.jsx         # Page d'accueil ✅
│   │   ├── Search.jsx       # Recherche photos ⚠️
│   │   ├── PhotoDetail.jsx  # Détail photo ⚠️
│   │   ├── auth/            # Login ✅, Register ✅
│   │   ├── user/            # Profil, Cart, Orders ⚠️
│   │   ├── photographer/    # Dashboard ⚠️, Upload, Analytics
│   │   └── admin/           # Dashboard admin ⚠️, Modération
│   ├── context/
│   │   ├── AuthContext.jsx  # Gestion auth ✅
│   │   └── CartContext.jsx  # Gestion panier ✅
│   ├── services/
│   │   ├── authService.js   # API auth mockée ✅
│   │   ├── photoService.js  # API photos mockée ✅
│   │   ├── cartService.js   # API cart mockée ✅
│   │   └── orderService.js  # API orders mockée ✅
│   ├── data/
│   │   ├── photos.js        # 69 photos avec métadonnées ✅
│   │   ├── users.js         # Utilisateurs mockés ✅
│   │   ├── categories.js    # Catégories ✅
│   │   ├── orders.js        # Commandes mockées ✅
│   │   └── notifications.js # Notifications ✅
│   ├── utils/
│   │   ├── constants.js     # Constantes globales ✅
│   │   ├── helpers.js       # Fonctions utilitaires ✅
│   │   └── validators.js    # Validations ✅
│   ├── App.jsx              # App principale + routing ✅
│   ├── main.jsx             # Point d'entrée ✅
│   └── index.css            # Styles Tailwind ✅
├── package.json
├── tailwind.config.js       ✅
├── postcss.config.js        ✅
└── vite.config.js
```

**Légende**:
- ✅ Complètement développé et fonctionnel
- ⚠️ Structure créée, à compléter (placeholder)
- ❌ Non créé

---

## 🎨 Technologies Utilisées

### Frontend
- **React 19.2** - Framework UI
- **Vite** - Build tool ultra-rapide
- **TailwindCSS 4.1** - Framework CSS utility-first
- **React Router 7** - Routing
- **Axios** - HTTP client
- **React Hook Form** - Gestion formulaires
- **React Icons** - Icônes
- **Recharts** - Graphiques
- **date-fns** - Gestion dates

### State Management
- **Context API** (AuthContext, CartContext)
- **localStorage** pour persistance

### Données
- **Données 100% mockées** (pas de backend nécessaire pour la démo)
- **Simulation API** avec délais réalistes (delay())
- **69 images réelles** avec métadonnées complètes

---

## 🔧 Fonctionnalités Développées

### ✅ Authentification
- [x] Login avec validation
- [x] Register (Buyer/Photographer)
- [x] Logout
- [x] Persistance session (localStorage)
- [x] Routes protégées par rôle
- [x] 3 comptes de test pré-configurés

### ✅ Navigation & Layout
- [x] Navbar responsive avec menu utilisateur
- [x] Footer avec liens
- [x] Badge compteur panier
- [x] Redirection selon rôle après login

### ✅ Page d'accueil
- [x] Hero section
- [x] Photos à la une (featured)
- [x] Nouvelles photos (recent)
- [x] Statistiques plateforme
- [x] Grille responsive (masonry)

### ✅ Données & Services
- [x] 69 photos avec métadonnées complètes
- [x] Catégories (Sport, Culture, Événements, etc.)
- [x] 12 utilisateurs mockés
- [x] 6 commandes exemples
- [x] Notifications par rôle
- [x] Services API mockés avec async/await

### ✅ Utilitaires
- [x] Formatage prix, dates, tailles fichiers
- [x] Validations (email, password, formulaires)
- [x] Helpers (slugify, truncate, etc.)
- [x] Constantes globales

---

## 📝 À Compléter / Développer

### Pages à compléter
1. **Search.jsx** - Recherche avec filtres avancés
2. **PhotoDetail.jsx** - Page détail avec zoom, ajout panier
3. **Cart.jsx** - Panier complet avec modification licence
4. **Checkout.jsx** - Processus paiement simulé
5. **Orders.jsx** - Historique commandes avec téléchargements
6. **Favorites.jsx** - Gestion favoris
7. **Photographer/Upload.jsx** - Formulaire upload avec drag & drop
8. **Photographer/MyPhotos.jsx** - Gestion photos avec édition
9. **Photographer/Revenue.jsx** - Revenus et demandes retrait
10. **Photographer/Analytics.jsx** - Graphiques Recharts
11. **Admin/Users.jsx** - Table utilisateurs avec actions
12. **Admin/Moderation.jsx** - Queue modération photos

### Composants UI à créer
- Button, Input, Modal, Card (dans `/components/common/`)
- PhotoGrid, PhotoCard, PhotoViewer
- FilterSidebar, SearchBar avec autocomplete
- CartItem, CartSummary
- FavoriteButton avec animation
- UploadZone (drag & drop)
- Charts composants (Recharts)

### Fonctionnalités à implémenter
- Système favoris complet
- Système follows photographes
- Notifications en temps réel
- Filtres recherche avancés
- Upload photos avec preview
- Graphiques analytics
- Export PDF factures
- Protection images (disable right-click)

---

## 🎯 Guide de Développement

### 1. Compléter la page Search

```jsx
// frontend/src/pages/Search.jsx
import { useState, useEffect } from 'react';
import * as photoService from '../services/photoService';

export default function Search() {
  const [photos, setPhotos] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const loadPhotos = async () => {
      const results = await photoService.search('', filters);
      setPhotos(results);
    };
    loadPhotos();
  }, [filters]);

  // Implémenter FilterSidebar + PhotoGrid
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Votre implémentation */}
    </div>
  );
}
```

### 2. Ajouter un composant Button réutilisable

```jsx
// frontend/src/components/common/Button.jsx
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  ...props
}) {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost: 'btn-ghost',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

### 3. Implémenter la recherche avec filtres

```jsx
// Utiliser searchPhotos() depuis data/photos.js
import { searchPhotos } from '../data/mockData';

const results = searchPhotos('football', {
  category: ['cat-2'],
  min_price: 20,
  max_price: 50,
  orientation: 'landscape',
  sort_by: 'popularity'
});
```

---

## 🚨 Points Importants

### Simulation vs Production
- **Actuellement**: Toutes les données sont mockées (localStorage + data/)
- **Production**: Remplacer les services mockés par de vrais appels API
- **Backend FastAPI**: À développer selon PROJECT_SPECIFICATION.md

### Images
- 69 images disponibles dans `/public/images/`
- Métadonnées complètes dans `/src/data/photos.js`
- Utilisées pour la démonstration

### Authentification
- Tokens mockés (pas de vraie sécurité)
- Passwords en clair dans data/users.js (⚠️ NE JAMAIS FAIRE EN PRODUCTION)
- localStorage pour persistance (remplacer par httpOnly cookies en prod)

### Paiement
- Simulation avec délai de 3 secondes
- 95% de succès simulé
- À remplacer par vraie intégration (CinetPay, Stripe, etc.)

---

## 📚 Ressources

### Documentation
- [React](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Recharts](https://recharts.org/)

### Spécification Complète
Voir `PROJECT_SPECIFICATION.md` à la racine pour:
- Architecture technique détaillée
- Schéma base de données
- Tous les endpoints API
- Wireframes et flow

---

## 🤝 Contribution

Pour continuer le développement:

1. **Choisir une fonctionnalité** dans la section "À Compléter"
2. **Créer les composants** nécessaires dans `/components/`
3. **Utiliser les services mockés** déjà créés
4. **Tester** avec les 3 comptes de test
5. **Commit** avec des messages clairs

### Exemple de workflow

```bash
# Créer une branche
git checkout -b feature/photo-detail-page

# Développer la fonctionnalité
# Tester avec pnpm dev

# Commit
git add .
git commit -m "feat: Ajout page détail photo avec zoom et ajout panier"

# Push
git push origin feature/photo-detail-page
```

---

## 📞 Support

Pour toute question:
- **Client**: Photographe officiel des Étalons
- **Prestataire**: TANGA GROUP
- **Documentation**: PROJECT_SPECIFICATION.md

---

## 📜 Licence

Propriété de TANGA GROUP - Tous droits réservés

---

**Développé avec ❤️ par Claude Code**

*Note: Ce projet est en cours de développement. Toutes les fonctionnalités listées dans PROJECT_SPECIFICATION.md ne sont pas encore implémentées.*
