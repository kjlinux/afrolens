# Plateforme de Vente et Gestion de Photos Professionnelles

## 📋 Vue d'ensemble du projet

### Client
Photographe officiel des Étalons

### Prestataire
TANGA GROUP

### Date
Octobre 2025

### Objectif
Créer une plateforme web professionnelle de type banque d'images permettant:
- Au photographe principal de stocker, exposer et vendre ses photos
- À d'autres photographes de publier et commercialiser leurs propres images
- Aux utilisateurs (entreprises, médias, particuliers) d'acheter et télécharger des photos haute résolution
- De protéger les œuvres via des filigranes contre tout téléchargement non autorisé

---

## 🎯 Public cible

### Professionnels et Entreprises
- Agences de communication
- Médias et webzines
- Sociétés diverses

### Institutions
- ONG
- Ministères
- Fédérations
- Collectivités
- Structures culturelles et touristiques

### Photographes Indépendants
- Professionnels
- Amateurs souhaitant vendre leurs clichés

### Particuliers
- Passionnés de photographie
- Créateurs de contenu
- Artistes

---

## 🏗️ Architecture technique

### Stack technologique retenue

#### Frontend
- **Framework**: React.js
- **Styling**: TailwindCSS
- **State Management**: Context API / Redux (à définir selon complexité)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Form Management**: React Hook Form
- **Image Display**: React Image Gallery / Lightbox

#### Backend
- **Framework**: FastAPI (Python)
- **ORM**: SQLAlchemy
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger/OpenAPI (intégré FastAPI)

#### Base de données
- **SGBD**: PostgreSQL
- **Migration**: Alembic

#### Stockage d'images
- **Solution**: À définir ultérieurement
- **Options**: AWS S3 / Cloudflare R2 / Google Cloud Storage / Stockage local

#### Protection des images
- **Filigrane**: Sharp (Node.js) ou Pillow (Python)
- **Format**: Watermark automatique sur toutes les images preview

#### Paiement
- **Solution**: À définir ultérieurement
- **Options**: CinetPay / PayDunya / Flutterwave / Stripe
- **Méthodes**: Mobile Money (Orange Money, Moov Money, Telecel), Visa/Mastercard

#### Sécurité
- HTTPS/SSL
- JWT Authentication
- Password hashing (bcrypt)
- Anti-scraping
- Rate limiting
- CORS configuration

---

## 📦 Fonctionnalités détaillées

## 1. Module Authentification & Comptes Utilisateurs

### 1.1 Inscription utilisateur
**Endpoints API**
- `POST /api/auth/register`

**Fonctionnalités**
- Inscription par email/mot de passe
- Inscription via Google OAuth2
- Inscription via Facebook OAuth2
- Validation email obligatoire
- Hash du mot de passe (bcrypt)
- Génération token de vérification

**Champs requis**
```json
{
  "email": "string (unique, validated)",
  "password": "string (min 8 chars, 1 uppercase, 1 number, 1 special)",
  "first_name": "string",
  "last_name": "string",
  "phone": "string (optional)",
  "account_type": "buyer | photographer"
}
```

**Frontend - Pages/Composants**
- `/register` - Page d'inscription
- `RegisterForm` component
- `SocialAuthButtons` component (Google, Facebook)
- Validation en temps réel
- Messages d'erreur clairs

### 1.2 Connexion utilisateur
**Endpoints API**
- `POST /api/auth/login`
- `POST /api/auth/social-login/{provider}` (google, facebook)
- `POST /api/auth/refresh-token`

**Fonctionnalités**
- Connexion email/password
- Connexion OAuth (Google, Facebook)
- Génération JWT access token (expire 1h)
- Génération refresh token (expire 7 jours)
- Remember me option
- Limitation tentatives (max 5/15min)

**Frontend - Pages/Composants**
- `/login` - Page de connexion
- `LoginForm` component
- Redirection après login
- Stockage sécurisé tokens (httpOnly cookies préféré)

### 1.3 Gestion du mot de passe
**Endpoints API**
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password/{token}`
- `PUT /api/auth/change-password`

**Fonctionnalités**
- Demande réinitialisation par email
- Token reset sécurisé (expire 1h)
- Changement mot de passe (utilisateur connecté)
- Validation force du mot de passe

**Frontend - Pages/Composants**
- `/forgot-password` - Demande reset
- `/reset-password/:token` - Nouveau mot de passe
- `/settings/security` - Changement mot de passe

### 1.4 Profil utilisateur
**Endpoints API**
- `GET /api/users/me` - Profil actuel
- `PUT /api/users/me` - Modification profil
- `PUT /api/users/me/avatar` - Upload avatar
- `GET /api/users/{user_id}` - Profil public (photographes)

**Données profil**
```json
{
  "id": "uuid",
  "email": "string",
  "first_name": "string",
  "last_name": "string",
  "avatar_url": "string",
  "phone": "string",
  "bio": "string",
  "account_type": "buyer | photographer",
  "is_verified": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

**Frontend - Pages/Composants**
- `/profile` - Profil utilisateur
- `/profile/edit` - Édition profil
- `ProfileCard` component
- `AvatarUpload` component
- Prévisualisation avatar avant upload

---

## 2. Module Espace Utilisateur (Acheteur)

### 2.1 Page d'accueil & Navigation
**Endpoints API**
- `GET /api/photos/featured` - Photos mises en avant
- `GET /api/photos/recent` - Nouvelles photos
- `GET /api/photos/popular` - Photos populaires
- `GET /api/categories` - Liste des catégories

**Fonctionnalités**
- Grid de photos responsive
- Carrousel photos featured
- Catégories visuelles
- Photographes populaires
- Statistiques plateforme

**Frontend - Pages/Composants**
- `/` - Homepage
- `PhotoGrid` component
- `CategoryCard` component
- `FeaturedCarousel` component
- `PhotographerShowcase` component

### 2.2 Recherche et Filtrage
**Endpoints API**
- `GET /api/photos/search?q={query}&filters={json}`

**Paramètres de recherche**
```json
{
  "query": "string (mots-clés)",
  "category": "array",
  "photographer_id": "uuid",
  "min_price": "number",
  "max_price": "number",
  "orientation": "landscape | portrait | square",
  "color": "string (hex ou nom)",
  "date_from": "date",
  "date_to": "date",
  "sort_by": "popularity | date | price_asc | price_desc",
  "page": "number",
  "per_page": "number (default 24)"
}
```

**Fonctionnalités**
- Recherche par mots-clés (tags, titre, description)
- Filtres avancés (sidebar)
- Autocomplete sur recherche
- Suggestions de recherche
- Recherche par couleur dominante
- Filtrage temps réel
- Pagination infinie ou classique

**Frontend - Pages/Composants**
- `/search?q=...` - Page résultats
- `SearchBar` component (avec autocomplete)
- `FilterSidebar` component
- `PhotoResults` component
- `ColorPicker` component pour filtre couleur

### 2.3 Détail d'une photo
**Endpoints API**
- `GET /api/photos/{photo_id}` - Détails photo
- `GET /api/photos/{photo_id}/similar` - Photos similaires
- `POST /api/photos/{photo_id}/view` - Compteur vues

**Données photo détaillée**
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "photographer": {
    "id": "uuid",
    "name": "string",
    "avatar": "string"
  },
  "preview_url": "string (avec filigrane)",
  "dimensions": {
    "width": "number",
    "height": "number"
  },
  "file_size": "string",
  "format": "jpg | png | raw",
  "price": "number",
  "category": "string",
  "tags": ["string"],
  "uploaded_at": "datetime",
  "views_count": "number",
  "purchases_count": "number",
  "license_type": "standard | extended"
}
```

**Fonctionnalités**
- Image preview haute qualité (avec filigrane)
- Zoom sur image
- Informations complètes
- Bouton achat/ajout panier
- Bouton favoris
- Photos similaires
- Profil photographe
- Partage social

**Frontend - Pages/Composants**
- `/photo/:id` - Page détail photo
- `PhotoViewer` component (zoom, lightbox)
- `PhotoInfo` component
- `PhotographerCard` component
- `SimilarPhotos` component
- `AddToCart` button
- `AddToFavorites` button

### 2.4 Système de Favoris
**Endpoints API**
- `GET /api/users/me/favorites` - Liste favoris
- `POST /api/favorites/{photo_id}` - Ajouter aux favoris
- `DELETE /api/favorites/{photo_id}` - Retirer des favoris
- `GET /api/favorites/check/{photo_id}` - Vérifier si en favoris

**Fonctionnalités**
- Ajout/retrait favoris (toggle)
- Collection de favoris
- Organisation par dossiers (optionnel)
- Partage de collection

**Frontend - Pages/Composants**
- `/favorites` - Page favoris
- `FavoriteButton` component (heart icon)
- `FavoritesList` component
- Indication visuelle état favori

### 2.5 Suivi des photographes
**Endpoints API**
- `POST /api/photographers/{photographer_id}/follow` - Suivre
- `DELETE /api/photographers/{photographer_id}/unfollow` - Ne plus suivre
- `GET /api/users/me/following` - Liste photographes suivis
- `GET /api/users/me/feed` - Feed photos des photographes suivis

**Fonctionnalités**
- Suivre/ne plus suivre photographes
- Notifications nouvelles photos (optionnel)
- Feed personnalisé
- Liste photographes suivis

**Frontend - Pages/Composants**
- `/following` - Photographes suivis
- `/feed` - Feed personnalisé
- `FollowButton` component
- `PhotographerFeed` component

### 2.6 Panier d'achat
**Endpoints API**
- `GET /api/cart` - Contenu panier
- `POST /api/cart/items` - Ajouter au panier
- `PUT /api/cart/items/{item_id}` - Modifier quantité/licence
- `DELETE /api/cart/items/{item_id}` - Retirer du panier
- `DELETE /api/cart` - Vider panier

**Structure item panier**
```json
{
  "id": "uuid",
  "photo_id": "uuid",
  "photo_preview": "string",
  "photo_title": "string",
  "photographer_name": "string",
  "license_type": "standard | extended",
  "price": "number",
  "added_at": "datetime"
}
```

**Fonctionnalités**
- Persistance panier (DB + localStorage)
- Modification licence (standard/extended)
- Calcul total automatique
- Codes promo (optionnel)
- Sauvegarde panier utilisateur connecté
- Badge compteur panier

**Frontend - Pages/Composants**
- `/cart` - Page panier
- `Cart` component (sidebar ou page)
- `CartItem` component
- `CartSummary` component
- Badge notification navbar

### 2.7 Processus de paiement
**Endpoints API**
- `POST /api/orders/create` - Créer commande
- `POST /api/orders/{order_id}/payment` - Initialiser paiement
- `GET /api/orders/{order_id}` - Détails commande
- `POST /api/webhooks/payment` - Webhook confirmation paiement

**Flow de paiement**
1. Validation panier
2. Sélection méthode paiement
3. Redirection gateway paiement
4. Confirmation paiement (webhook)
5. Génération facture
6. Accès téléchargement

**Méthodes de paiement** (À intégrer plus tard)
- Mobile Money (Orange, Moov, Telecel)
- Carte bancaire (Visa/Mastercard)
- PayPal/Stripe

**Données commande**
```json
{
  "id": "uuid",
  "order_number": "string (unique)",
  "user_id": "uuid",
  "items": [
    {
      "photo_id": "uuid",
      "license_type": "string",
      "price": "number"
    }
  ],
  "subtotal": "number",
  "tax": "number",
  "total": "number",
  "payment_method": "string",
  "payment_status": "pending | completed | failed | refunded",
  "created_at": "datetime",
  "paid_at": "datetime"
}
```

**Frontend - Pages/Composants**
- `/checkout` - Page paiement
- `CheckoutForm` component
- `PaymentMethodSelector` component
- `OrderSummary` component
- `/order/:id/confirmation` - Confirmation commande

### 2.8 Historique des achats
**Endpoints API**
- `GET /api/users/me/orders` - Liste commandes
- `GET /api/orders/{order_id}/invoice` - Télécharger facture PDF
- `GET /api/orders/{order_id}/download/{photo_id}` - Télécharger photo achetée

**Fonctionnalités**
- Liste toutes les commandes
- Statut commande
- Téléchargement factures
- Téléchargements photos haute résolution (sans filigrane)
- Liens de téléchargement sécurisés (signés, expiration)
- Historique téléchargements

**Frontend - Pages/Composants**
- `/orders` - Historique commandes
- `/orders/:id` - Détail commande
- `OrdersList` component
- `OrderDetail` component
- `DownloadButton` component (avec progression)

---

## 3. Module Espace Photographe

### 3.1 Inscription photographe
**Endpoints API**
- `POST /api/photographers/apply` - Demande compte photographe
- `GET /api/admin/photographers/pending` - Demandes en attente (admin)
- `PUT /api/admin/photographers/{id}/approve` - Approuver (admin)
- `PUT /api/admin/photographers/{id}/reject` - Rejeter (admin)

**Données demande photographe**
```json
{
  "user_id": "uuid",
  "portfolio_url": "string",
  "bio": "string (min 100 chars)",
  "experience_years": "number",
  "specialties": ["string"],
  "sample_photos": ["url"], // 3-5 photos minimum
  "social_links": {
    "instagram": "string",
    "website": "string"
  },
  "status": "pending | approved | rejected",
  "applied_at": "datetime",
  "reviewed_at": "datetime",
  "reviewer_notes": "string"
}
```

**Fonctionnalités**
- Formulaire demande détaillé
- Upload photos échantillons
- Validation manuelle par admin
- Email notification approbation/rejet

**Frontend - Pages/Composants**
- `/become-photographer` - Formulaire demande
- `PhotographerApplicationForm` component
- `SamplePhotosUpload` component
- `/photographer/application-status` - Statut demande

### 3.2 Dashboard photographe
**Endpoints API**
- `GET /api/photographers/me/dashboard` - Statistiques dashboard

**Statistiques affichées**
```json
{
  "total_photos": "number",
  "total_sales": "number",
  "total_revenue": "number",
  "pending_revenue": "number",
  "available_balance": "number",
  "this_month_sales": "number",
  "this_month_revenue": "number",
  "views_count": "number",
  "followers_count": "number",
  "top_selling_photos": [
    {
      "photo_id": "uuid",
      "title": "string",
      "sales_count": "number",
      "revenue": "number"
    }
  ],
  "recent_sales": [
    {
      "order_id": "uuid",
      "photo_title": "string",
      "amount": "number",
      "sold_at": "datetime"
    }
  ]
}
```

**Frontend - Pages/Composants**
- `/photographer/dashboard` - Dashboard principal
- `StatsCards` component
- `RevenueChart` component (graphique évolution revenus)
- `TopPhotos` component
- `RecentSales` component

### 3.3 Upload et gestion des photos
**Endpoints API**
- `POST /api/photos/upload` - Upload photo (multipart/form-data)
- `GET /api/photographers/me/photos` - Liste mes photos
- `PUT /api/photos/{photo_id}` - Modifier métadonnées
- `DELETE /api/photos/{photo_id}` - Supprimer photo
- `PUT /api/photos/{photo_id}/visibility` - Publier/dépublier

**Processus upload**
1. Sélection fichier(s) (JPG, PNG, max 50MB)
2. Upload vers serveur
3. Génération preview avec filigrane automatique (Sharp)
4. Stockage fichier original (sécurisé)
5. Extraction métadonnées EXIF
6. Ajout métadonnées manuelles
7. Publication

**Métadonnées photo**
```json
{
  "title": "string (required, max 200 chars)",
  "description": "string (optional, max 2000 chars)",
  "category": "string (required)",
  "tags": ["string"] (min 3, max 20),
  "price_standard": "number (required, min 5)",
  "price_extended": "number (optional, si licensing avancé)",
  "location": "string (optional)",
  "camera": "string (auto EXIF ou manuel)",
  "lens": "string (auto EXIF ou manuel)",
  "iso": "number (auto EXIF)",
  "aperture": "string (auto EXIF)",
  "shutter_speed": "string (auto EXIF)",
  "is_public": "boolean (default false)"
}
```

**Fonctionnalités**
- Upload multiple (drag & drop)
- Barre progression upload
- Preview avant upload
- Éditeur métadonnées
- Suggestion tags (AI optionnel)
- Bulk edit pour plusieurs photos
- Tri/filtrage mes photos
- Recherche dans mes photos

**Frontend - Pages/Composants**
- `/photographer/upload` - Page upload
- `PhotoUpload` component (drag & drop zone)
- `UploadProgress` component
- `PhotoMetadataForm` component
- `/photographer/photos` - Gestion photos
- `MyPhotosGrid` component
- `PhotoEditModal` component
- `BulkActions` component

### 3.4 Portfolio public
**Endpoints API**
- `GET /api/photographers/{username}` - Profil public photographe
- `GET /api/photographers/{username}/photos` - Photos du photographe
- `PUT /api/photographers/me/profile` - Modifier profil public

**Profil photographe public**
```json
{
  "id": "uuid",
  "username": "string (unique)",
  "display_name": "string",
  "avatar_url": "string",
  "cover_photo_url": "string",
  "bio": "string",
  "location": "string",
  "website": "string",
  "social_links": {},
  "specialties": ["string"],
  "member_since": "date",
  "total_photos": "number",
  "total_sales": "number",
  "followers_count": "number"
}
```

**Fonctionnalités**
- Page profil public personnalisable
- Grid photos du photographe
- Statistiques publiques
- Bouton follow
- Liens sociaux
- Photo de couverture
- About section

**Frontend - Pages/Composants**
- `/@{username}` ou `/photographer/{username}` - Profil public
- `PhotographerProfile` component
- `PhotographerPhotos` component
- `PhotographerAbout` component

### 3.5 Gestion des revenus
**Endpoints API**
- `GET /api/photographers/me/revenue` - Détails revenus
- `GET /api/photographers/me/revenue/history` - Historique transactions
- `POST /api/photographers/me/withdraw` - Demande retrait

**Structure revenus**
```json
{
  "total_earned": "number (total gagné)",
  "commission_rate": "number (ex: 0.20 pour 20%)",
  "platform_fees": "number (total prélevé)",
  "net_earnings": "number (après commission)",
  "pending_balance": "number (ventes < 30 jours)",
  "available_balance": "number (disponible au retrait)",
  "withdrawn_total": "number (déjà retiré)",
  "next_payout_date": "date",
  "minimum_withdrawal": "number (ex: 50)"
}
```

**Système de commission**
- Commission plateforme configurable (ex: 20%)
- Période de sécurité: 30 jours avant disponibilité retrait
- Seuil minimum retrait
- Historique détaillé transactions

**Demande de retrait**
```json
{
  "amount": "number",
  "withdrawal_method": "mobile_money | bank_transfer",
  "account_details": {
    "phone": "string (si mobile money)",
    "bank_name": "string (si virement)",
    "account_number": "string",
    "account_name": "string"
  }
}
```

**Frontend - Pages/Composants**
- `/photographer/revenue` - Page revenus
- `RevenueOverview` component
- `TransactionHistory` component
- `WithdrawForm` component
- `WithdrawalHistory` component

### 3.6 Statistiques avancées
**Endpoints API**
- `GET /api/photographers/me/analytics` - Analytics détaillées

**Métriques disponibles**
```json
{
  "views": {
    "total": "number",
    "this_month": "number",
    "trend": "number (% change)"
  },
  "sales": {
    "total": "number",
    "this_month": "number",
    "trend": "number"
  },
  "revenue": {
    "total": "number",
    "this_month": "number",
    "trend": "number"
  },
  "conversion_rate": "number",
  "top_performing_photos": [],
  "views_by_date": [{date, count}],
  "sales_by_date": [{date, count, revenue}],
  "traffic_sources": [{source, views, percentage}],
  "popular_categories": [{category, sales}]
}
```

**Graphiques**
- Évolution vues/ventes dans le temps
- Revenus mensuels
- Performance par catégorie
- Sources de trafic

**Frontend - Pages/Composants**
- `/photographer/analytics` - Page analytics
- `AnalyticsCharts` component (utiliser Recharts/Chart.js)
- `PerformanceMetrics` component
- Filtres par période (7j, 30j, 90j, 1an, custom)

---

## 4. Module Administration

### 4.1 Dashboard administrateur
**Endpoints API**
- `GET /api/admin/dashboard` - Stats globales plateforme

**Statistiques plateforme**
```json
{
  "users": {
    "total": "number",
    "buyers": "number",
    "photographers": "number",
    "new_this_month": "number"
  },
  "photos": {
    "total": "number",
    "pending_moderation": "number",
    "published": "number"
  },
  "sales": {
    "total": "number",
    "this_month": "number",
    "revenue": "number",
    "commission_earned": "number"
  },
  "recent_activity": [],
  "top_photographers": [],
  "top_selling_photos": []
}
```

**Frontend - Pages/Composants**
- `/admin` - Dashboard admin
- `AdminStats` component
- `RecentActivity` component
- `TopPerformers` component

### 4.2 Gestion des utilisateurs
**Endpoints API**
- `GET /api/admin/users` - Liste tous utilisateurs
- `GET /api/admin/users/{user_id}` - Détails utilisateur
- `PUT /api/admin/users/{user_id}/status` - Activer/désactiver
- `DELETE /api/admin/users/{user_id}` - Supprimer utilisateur
- `GET /api/admin/users/{user_id}/activity` - Logs activité

**Fonctionnalités**
- Liste utilisateurs (tableau)
- Filtres (type compte, statut, date inscription)
- Recherche utilisateurs
- Voir historique achats/ventes
- Suspendre/bannir utilisateur
- Envoyer email utilisateur
- Notes admin sur utilisateur

**Frontend - Pages/Composants**
- `/admin/users` - Gestion utilisateurs
- `UsersTable` component
- `UserDetailsModal` component
- `UserActions` component

### 4.3 Validation photographes
**Endpoints API**
- `GET /api/admin/photographers/pending` - Demandes en attente
- `GET /api/admin/photographers/{id}/application` - Détails demande
- `PUT /api/admin/photographers/{id}/approve` - Approuver
- `PUT /api/admin/photographers/{id}/reject` - Rejeter

**Fonctionnalités**
- Queue demandes en attente
- Visualisation portfolio candidat
- Notes/commentaires admin
- Approbation/rejet avec feedback
- Email automatique notification

**Frontend - Pages/Composants**
- `/admin/photographers/pending` - Demandes en attente
- `PhotographerApplicationCard` component
- `ApplicationReview` component
- Galerie photos échantillons

### 4.4 Modération des photos
**Endpoints API**
- `GET /api/admin/photos/pending` - Photos en attente modération
- `GET /api/admin/photos/reported` - Photos signalées
- `PUT /api/admin/photos/{photo_id}/approve` - Approuver photo
- `PUT /api/admin/photos/{photo_id}/reject` - Rejeter photo
- `DELETE /api/admin/photos/{photo_id}` - Supprimer photo

**Règles de modération**
- Vérification qualité image
- Détection contenu inapproprié
- Vérification droits d'auteur
- Respect guidelines plateforme

**Fonctionnalités**
- Queue modération
- Visualisation photo haute qualité
- Métadonnées photo
- Historique photographe
- Approbation/rejet en masse
- Motifs de rejet prédéfinis
- Feedback au photographe

**Frontend - Pages/Composants**
- `/admin/moderation` - Queue modération
- `PhotoModerationCard` component
- `ModerationActions` component
- `RejectReasonModal` component

### 4.5 Gestion des catégories et tags
**Endpoints API**
- `GET /api/admin/categories` - Liste catégories
- `POST /api/admin/categories` - Créer catégorie
- `PUT /api/admin/categories/{id}` - Modifier catégorie
- `DELETE /api/admin/categories/{id}` - Supprimer catégorie
- `GET /api/admin/tags` - Liste tags populaires
- `DELETE /api/admin/tags/{id}` - Supprimer tag

**Fonctionnalités**
- CRUD catégories
- Hiérarchie catégories (parent/enfant)
- Icônes/images catégories
- Ordre affichage
- Gestion tags (nettoyage, fusion)
- Statistiques utilisation

**Frontend - Pages/Composants**
- `/admin/categories` - Gestion catégories
- `CategoryTree` component
- `CategoryForm` component
- `/admin/tags` - Gestion tags

### 4.6 Configuration commissions
**Endpoints API**
- `GET /api/admin/settings/commission` - Config actuelle
- `PUT /api/admin/settings/commission` - Modifier commission

**Paramètres commission**
```json
{
  "default_rate": "number (0-1, ex: 0.20 pour 20%)",
  "minimum_withdrawal": "number",
  "withdrawal_methods": ["mobile_money", "bank_transfer"],
  "security_hold_days": "number (default 30)",
  "custom_rates": [
    {
      "photographer_id": "uuid",
      "custom_rate": "number"
    }
  ]
}
```

**Frontend - Pages/Composants**
- `/admin/settings/commission` - Configuration commission
- `CommissionSettings` component

### 4.7 Gestion paiements et retraits
**Endpoints API**
- `GET /api/admin/payments` - Liste transactions
- `GET /api/admin/withdrawals/pending` - Demandes retrait en attente
- `PUT /api/admin/withdrawals/{id}/approve` - Approuver retrait
- `PUT /api/admin/withdrawals/{id}/complete` - Marquer comme payé
- `PUT /api/admin/withdrawals/{id}/reject` - Rejeter retrait

**Fonctionnalités**
- Liste toutes transactions
- Filtres (statut, méthode, période)
- Export CSV/Excel
- Gestion demandes retrait
- Validation manuelle retraits
- Historique paiements photographes
- Réconciliation financière

**Frontend - Pages/Composants**
- `/admin/payments` - Transactions
- `/admin/withdrawals` - Demandes retrait
- `TransactionsTable` component
- `WithdrawalRequest` component
- Export buttons

### 4.8 Rapports et analytics
**Endpoints API**
- `GET /api/admin/reports/sales` - Rapport ventes
- `GET /api/admin/reports/revenue` - Rapport revenus
- `GET /api/admin/reports/users` - Rapport utilisateurs
- `GET /api/admin/reports/photographers` - Rapport photographes

**Rapports disponibles**
- Ventes par période
- Revenus par catégorie
- Performance photographes
- Acquisition utilisateurs
- Taux de conversion
- Churn rate
- Export PDF/Excel

**Frontend - Pages/Composants**
- `/admin/reports` - Centre de rapports
- `ReportGenerator` component
- Filtres de dates
- Visualisations graphiques
- Export buttons

---

## 5. Module Protection et Sécurité des Images

### 5.1 Système de filigrane automatique
**Backend - Implémentation**

**Technologie**: Sharp (si Node.js) ou Pillow (Python/FastAPI)

**Processus**:
1. Upload photo originale
2. Génération automatique version preview:
   - Résolution réduite (max 1200px côté long)
   - Qualité JPEG 75-85%
   - Application filigrane
3. Stockage fichiers:
   - `/originals/` - Haute résolution (accès restreint)
   - `/previews/` - Avec filigrane (accès public)
   - `/thumbnails/` - Miniatures (200x200)

**Configuration filigrane**
```json
{
  "text": "© Photographe Name / Nom Plateforme",
  "position": "center | diagonal",
  "opacity": 0.3,
  "font_size": "responsive (based on image size)",
  "color": "white | black (based on image brightness)",
  "repeat": true (pattern répété)
}
```

**Endpoints API**
- `POST /api/admin/watermark/settings` - Config filigrane
- `GET /api/admin/watermark/preview` - Preview filigrane

**Code exemple (Python/Pillow)**
```python
from PIL import Image, ImageDraw, ImageFont
import math

def apply_watermark(image_path, watermark_text, output_path):
    # Ouvrir image
    image = Image.open(image_path).convert("RGBA")
    width, height = image.size
    
    # Créer layer watermark
    watermark = Image.new("RGBA", image.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(watermark)
    
    # Définir font
    font_size = int(min(width, height) / 20)
    font = ImageFont.truetype("arial.ttf", font_size)
    
    # Calculer position (diagonal pattern)
    text_width, text_height = draw.textsize(watermark_text, font)
    
    # Appliquer watermark en diagonal répété
    for y in range(0, height, text_height * 3):
        for x in range(0, width, text_width * 2):
            draw.text((x, y), watermark_text, fill=(255, 255, 255, 77), font=font)
    
    # Combiner image et watermark
    watermarked = Image.alpha_composite(image, watermark)
    watermarked.convert("RGB").save(output_path, "JPEG", quality=85)
```

### 5.2 Protection téléchargement
**Mesures frontend**
- Désactiver clic droit sur images
- Désactiver drag & drop
- Utiliser CSS `pointer-events: none` sur overlays
- Images en background CSS (plus difficile à sauvegarder)
- Lazy loading avec placeholder

**Mesures backend**
- URLs signées avec expiration pour downloads
- Vérification purchase avant download
- Limitation téléchargements (max 3 fois par purchase)
- Logs téléchargements
- Rate limiting strict

**Endpoint download sécurisé**
```
GET /api/downloads/{order_id}/{photo_id}?token={signed_token}
```

**Génération token signé**
```python
import jwt
from datetime import datetime, timedelta

def generate_download_token(order_id, photo_id, user_id):
    payload = {
        'order_id': order_id,
        'photo_id': photo_id,
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token
```

### 5.3 Protection anti-scraping
**Mesures**
- Rate limiting agressif (ex: 60 req/min par IP)
- CAPTCHA sur actions sensibles
- User-Agent validation
- Honeypot endpoints
- Block proxy/VPN connus (optionnel)
- Monitoring traffic suspect

**Frontend**
- Random delays sur requests
- Obfuscation URLs images
- Lazy loading progressif

---

## 6. Fonctionnalités additionnelles

### 6.1 Notifications
**Types de notifications**

**Pour acheteurs**:
- Confirmation commande
- Paiement reçu
- Liens téléchargement
- Nouveautés photographes suivis
- Promotions

**Pour photographes**:
- Nouvelle vente
- Upload approuvé/rejeté
- Nouveau follower
- Retrait approuvé
- Atteinte seuil revenus

**Pour admins**:
- Nouvelle demande photographe
- Photo à modérer
- Demande retrait
- Activité suspecte

**Endpoints API**
- `GET /api/notifications` - Liste notifications
- `PUT /api/notifications/{id}/read` - Marquer comme lu
- `PUT /api/notifications/read-all` - Tout marquer comme lu
- `DELETE /api/notifications/{id}` - Supprimer notification

**Canaux**
- In-app (bell icon)
- Email
- SMS (optionnel)

**Frontend - Composants**
- `NotificationBell` component
- `NotificationDropdown` component
- Badge compteur non lues

### 6.2 Système de reviews (optionnel)
**Fonctionnalités**
- Reviews sur photos achetées
- Rating photographes
- Modération reviews
- Réponse photographe possible

### 6.3 Collections/Lightboxes
**Fonctionnalités**
- Créer collections thématiques
- Ajouter photos à collections
- Collections publiques/privées
- Partage collections

### 6.4 Blog/Actualités (optionnel)
**Fonctionnalités**
- Articles blog
- Showcase photographes
- Conseils photo
- Actualités plateforme

---

## 7. Schéma de base de données

### Tables principales

#### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    account_type VARCHAR(20) DEFAULT 'buyer', -- 'buyer', 'photographer', 'admin'
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);
```

#### photographers
```sql
CREATE TABLE photographers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    bio TEXT,
    cover_photo_url VARCHAR(500),
    location VARCHAR(100),
    website VARCHAR(255),
    instagram VARCHAR(100),
    portfolio_url VARCHAR(255),
    specialties JSONB,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'suspended'
    commission_rate DECIMAL(5,4) DEFAULT 0.20,
    total_sales INTEGER DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0,
    followers_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    approved_by UUID REFERENCES users(id)
);
```

#### categories
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    parent_id UUID REFERENCES categories(id),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### photos
```sql
CREATE TABLE photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    photographer_id UUID REFERENCES photographers(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    tags TEXT[], -- Array de tags
    
    -- Fichiers
    original_url VARCHAR(500) NOT NULL, -- Haute résolution
    preview_url VARCHAR(500) NOT NULL, -- Avec filigrane
    thumbnail_url VARCHAR(500) NOT NULL,
    
    -- Métadonnées image
    width INTEGER,
    height INTEGER,
    file_size BIGINT, -- En bytes
    format VARCHAR(10), -- 'jpg', 'png', 'raw'
    color_palette JSONB, -- Couleurs dominantes
    
    -- Métadonnées EXIF
    camera VARCHAR(100),
    lens VARCHAR(100),
    iso INTEGER,
    aperture VARCHAR(10),
    shutter_speed VARCHAR(20),
    focal_length INTEGER,
    taken_at TIMESTAMP,
    location VARCHAR(200),
    
    -- Pricing
    price_standard DECIMAL(10,2) NOT NULL,
    price_extended DECIMAL(10,2),
    
    -- Stats
    views_count INTEGER DEFAULT 0,
    downloads_count INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    
    -- Status
    is_public BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    moderated_by UUID REFERENCES users(id),
    moderated_at TIMESTAMP,
    rejection_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_photos_photographer ON photos(photographer_id);
CREATE INDEX idx_photos_category ON photos(category_id);
CREATE INDEX idx_photos_status ON photos(status);
CREATE INDEX idx_photos_tags ON photos USING GIN(tags);
```

#### favorites
```sql
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, photo_id)
);
```

#### follows
```sql
CREATE TABLE follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    photographer_id UUID REFERENCES photographers(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, photographer_id)
);
```

#### orders
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL, -- Ex: "ORD-20250101-ABC123"
    user_id UUID REFERENCES users(id),
    
    -- Montants
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    
    -- Paiement
    payment_method VARCHAR(50), -- 'mobile_money', 'card', 'paypal'
    payment_provider VARCHAR(50), -- 'orange_money', 'stripe', etc.
    payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
    payment_id VARCHAR(255), -- ID transaction externe
    paid_at TIMESTAMP,
    
    -- Facturation
    invoice_url VARCHAR(500),
    billing_email VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(payment_status);
```

#### order_items
```sql
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    photo_id UUID REFERENCES photos(id),
    photographer_id UUID REFERENCES photographers(id),
    
    license_type VARCHAR(20) DEFAULT 'standard', -- 'standard', 'extended'
    price DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,4) NOT NULL, -- Rate au moment de la vente
    commission_amount DECIMAL(10,2) NOT NULL,
    photographer_earnings DECIMAL(10,2) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### downloads
```sql
CREATE TABLE downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_item_id UUID REFERENCES order_items(id),
    user_id UUID REFERENCES users(id),
    photo_id UUID REFERENCES photos(id),
    download_url VARCHAR(500),
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);
```

#### photographer_revenues
```sql
CREATE TABLE photographer_revenues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    photographer_id UUID REFERENCES photographers(id),
    order_item_id UUID REFERENCES order_items(id),
    
    amount DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    net_amount DECIMAL(10,2) NOT NULL,
    
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'available', 'withdrawn'
    available_at TIMESTAMP, -- Date disponibilité (created_at + 30 jours)
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### withdrawals
```sql
CREATE TABLE withdrawals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    photographer_id UUID REFERENCES photographers(id),
    
    amount DECIMAL(10,2) NOT NULL,
    withdrawal_method VARCHAR(50), -- 'mobile_money', 'bank_transfer'
    account_details JSONB NOT NULL,
    
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'completed', 'rejected'
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    processed_by UUID REFERENCES users(id),
    notes TEXT,
    
    transaction_reference VARCHAR(255)
);
```

#### notifications
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'sale', 'follower', 'withdrawal', etc.
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- Données additionnelles
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);
```

---

## 8. Structure du projet

### Frontend (React)
```
frontend/
├── public/
│   ├── index.html
│   └── assets/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ...
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── SocialAuthButtons.jsx
│   │   ├── photos/
│   │   │   ├── PhotoGrid.jsx
│   │   │   ├── PhotoCard.jsx
│   │   │   ├── PhotoViewer.jsx
│   │   │   ├── PhotoUpload.jsx
│   │   │   └── ...
│   │   ├── photographer/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PhotographerProfile.jsx
│   │   │   └── ...
│   │   ├── user/
│   │   │   ├── Cart.jsx
│   │   │   ├── Favorites.jsx
│   │   │   └── ...
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── UsersTable.jsx
│   │       └── ...
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Search.jsx
│   │   ├── PhotoDetail.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── photographer/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Upload.jsx
│   │   │   ├── MyPhotos.jsx
│   │   │   ├── Revenue.jsx
│   │   │   └── Analytics.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── Users.jsx
│   │       ├── Photos.jsx
│   │       ├── Moderation.jsx
│   │       └── ...
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   └── ...
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── ...
│   ├── services/
│   │   ├── api.js (axios instance)
│   │   ├── authService.js
│   │   ├── photoService.js
│   │   ├── orderService.js
│   │   └── ...
│   ├── utils/
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   └── constants.js
│   ├── styles/
│   │   └── tailwind.css
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── tailwind.config.js
├── vite.config.js (ou webpack.config.js)
└── .env
```

### Backend (FastAPI)
```
backend/
├── app/
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models/
│   │   ├── user.py
│   │   ├── photographer.py
│   │   ├── photo.py
│   │   ├── order.py
│   │   ├── category.py
│   │   └── ...
│   ├── schemas/
│   │   ├── user.py (Pydantic models)
│   │   ├── photographer.py
│   │   ├── photo.py
│   │   └── ...
│   ├── api/
│   │   ├── deps.py (dependencies)
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── photographers.py
│   │   ├── photos.py
│   │   ├── orders.py
│   │   ├── admin.py
│   │   └── ...
│   ├── core/
│   │   ├── security.py (JWT, password hashing)
│   │   ├── config.py
│   │   └── ...
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── photo_service.py
│   │   ├── watermark_service.py
│   │   ├── payment_service.py
│   │   ├── email_service.py
│   │   └── ...
│   ├── utils/
│   │   ├── image_processing.py
│   │   ├── file_upload.py
│   │   └── ...
│   └── alembic/
│       ├── versions/
│       └── env.py
├── tests/
│   ├── test_auth.py
│   ├── test_photos.py
│   └── ...
├── requirements.txt
├── .env
└── alembic.ini
```

---

## 9. Configuration environnement

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
VITE_API_TIMEOUT=30000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_FACEBOOK_APP_ID=your_facebook_app_id
```

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/photo_platform

# Security
SECRET_KEY=your_super_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# File Storage (à définir)
STORAGE_TYPE=local
STORAGE_PATH=/uploads
# ou AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME

# Email (ex: SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=noreply@yourplatform.com

# Payment (à définir plus tard)
# PAYMENT_PROVIDER=cinetpay
# PAYMENT_API_KEY=xxx

# Commission
DEFAULT_COMMISSION_RATE=0.20
MINIMUM_WITHDRAWAL=50
SECURITY_HOLD_DAYS=30
```

---

## 10. Guide de développement

### Étapes de développement suggérées

#### Phase 1: Setup et Authentication (Semaine 1)
1. Setup projet frontend (React + Vite + Tailwind)
2. Setup projet backend (FastAPI + PostgreSQL)
3. Configuration base de données (tables users, photographers)
4. Système authentification complet (JWT)
5. Pages login/register
6. OAuth Google/Facebook (optionnel)
7. Profile management

#### Phase 2: Gestion Photos et Upload (Semaine 2-3)
1. Modèles et tables photos, catégories
2. Upload photos (multipart/form-data)
3. Service watermark automatique (Sharp/Pillow)
4. Stockage fichiers (local ou cloud)
5. Page upload photographe
6. Gestion métadonnées
7. Preview et thumbnails

#### Phase 3: Frontend Utilisateur (Semaine 3-4)
1. Homepage avec grid photos
2. Page recherche et filtres
3. Page détail photo
4. Système favoris
5. Système follow photographes
6. Panier d'achat
7. Profil public photographe

#### Phase 4: Paiement et Commandes (Semaine 4-5)
1. Modèles orders, order_items
2. Processus checkout
3. Intégration gateway paiement
4. Génération factures PDF
5. Système téléchargement sécurisé
6. Historique achats
7. Webhooks paiement

#### Phase 5: Espace Photographe (Semaine 5-6)
1. Dashboard photographe
2. Statistiques et analytics
3. Gestion revenus
4. Système retraits
5. Portfolio public
6. Notifications ventes

#### Phase 6: Administration (Semaine 6-7)
1. Dashboard admin
2. Gestion utilisateurs
3. Validation photographes
4. Modération photos
5. Gestion catégories/tags
6. Configuration commissions
7. Gestion paiements/retraits
8. Rapports et analytics

#### Phase 7: Sécurité et Optimisation (Semaine 7-8)
1. Rate limiting
2. Anti-scraping
3. Protection images avancée
4. Optimisation performances
5. Caching (Redis optionnel)
6. CDN pour images (optionnel)
7. Tests et debugging
8. Documentation API

#### Phase 8: Finitions et Déploiement (Semaine 8)
1. Tests complets
2. Responsive design final
3. Optimisation SEO
4. Configuration production
5. Déploiement (Vercel/Netlify pour frontend, Railway/Heroku/VPS pour backend)
6. Configuration domaine
7. SSL/HTTPS
8. Monitoring et logs
9. Formation client
10. Documentation utilisateur

---

## 11. Points critiques et recommandations

### Sécurité
- ⚠️ Ne JAMAIS stocker mots de passe en clair
- ⚠️ Toujours valider et sanitizer inputs utilisateurs
- ⚠️ Limiter taille uploads (ex: 50MB max)
- ⚠️ Vérifier types MIME fichiers uploadés
- ⚠️ URLs de téléchargement doivent être signées et expirer
- ⚠️ Implémenter rate limiting strict
- ⚠️ Logs détaillés pour activités sensibles

### Performance
- Utiliser lazy loading pour images
- Implémenter pagination (ne pas charger toutes photos)
- Optimiser requêtes SQL (indexes, N+1 queries)
- Compresser images (WebP si possible)
- CDN pour assets statiques
- Caching intelligent (Redis)

### UX/UI
- Feedback immédiat sur actions (loading states)
- Messages d'erreur clairs et utiles
- Responsive design obligatoire
- Accessibilité (ARIA labels, contrast)
- Dark mode (optionnel)
- Transitions fluides

### Business
- Système commission flexible
- Période sécurité pour retraits (30j recommandé)
- Seuil minimum retrait raisonnable
- Modération photos stricte pour qualité
- Support multi-devises (optionnel)
- Facturation automatique conforme

### Évolutivité future
- Architecture modulaire
- API RESTful bien documentée
- Séparation frontend/backend claire
- Prêt pour scaling horizontal
- Multi-langues (i18n) facilement ajoutable
- Système de plugins/extensions

---

## 12. Livrables finaux

### Code
- ✅ Code source frontend (React)
- ✅ Code source backend (FastAPI)
- ✅ Fichiers configuration (.env.example)
- ✅ Scripts migration base de données

### Documentation
- ✅ Documentation API (Swagger/OpenAPI)
- ✅ Guide installation développeurs (README.md)
- ✅ Guide utilisateur (manuel utilisateur)
- ✅ Guide administrateur
- ✅ Guide photographe

### Déploiement
- ✅ Site web déployé et fonctionnel
- ✅ Base de données configurée
- ✅ Domaine configuré + SSL
- ✅ Backups automatiques configurés

### Formation
- ✅ Session formation client (2-3h)
- ✅ Vidéos tutoriels (optionnel)
- ✅ Support post-lancement (période à définir)

---

## 13. Planning et estimation

### Estimation totale: 6-8 semaines

- **Semaine 1**: Setup + Auth
- **Semaine 2-3**: Upload photos + Watermark
- **Semaine 3-4**: Frontend utilisateur
- **Semaine 4-5**: Paiement + Commandes
- **Semaine 5-6**: Espace photographe
- **Semaine 6-7**: Administration
- **Semaine 7-8**: Sécurité + Déploiement

### Ressources suggérées
- 1 développeur Full-Stack (React + FastAPI)
- ou 1 dev Frontend + 1 dev Backend
- 1 designer UI/UX (pour maquettes)

---

## 14. Technologies et dépendances

### Frontend
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "react-hook-form": "^7.48.0",
    "@headlessui/react": "^1.7.0",
    "react-icons": "^4.12.0",
    "react-image-gallery": "^1.3.0",
    "react-dropzone": "^14.2.0",
    "recharts": "^2.10.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### Backend
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
alembic==1.12.1
pydantic==2.5.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
Pillow==10.1.0
python-dotenv==1.0.0
aiofiles==23.2.1
```

---

## Conclusion

Ce document constitue la spécification complète pour le développement de la plateforme de vente de photos. Chaque section détaille les fonctionnalités, endpoints API, structures de données et composants frontend nécessaires.

**Points clés à retenir:**
1. Architecture séparée frontend (React) / backend (FastAPI)
2. Système de protection images robuste (watermark automatique)
3. Gestion multi-rôles (acheteur, photographe, admin)
4. Système paiement et commission flexible
5. Sécurité prioritaire à tous les niveaux

**Prochaines étapes:**
1. Valider ce cahier des charges avec le client
2. Créer maquettes UI/UX
3. Setup environnements de développement
4. Commencer Phase 1 (Auth)

Pour toute question ou clarification, n'hésitez pas à demander des précisions sur une section spécifique.
