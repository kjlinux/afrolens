# Services API - Documentation

Ce dossier contient tous les wrappers de services pour interagir avec l'API backend.

## Structure

```
src/services/
├── index.ts                    # Point d'entrée centralisé
├── authService.ts             # Service d'authentification
├── photoService.ts            # Service de gestion des photos
├── cartService.ts             # Service du panier
├── orderService.ts            # Service des commandes
├── userService.ts             # Service du profil utilisateur
├── photographerService.ts     # Services pour les photographes
└── api.js                     # Configuration Axios (legacy - à migrer)
```

## Configuration

Avant d'utiliser les services, assurez-vous que l'API est configurée :

```typescript
import { configureAPI } from '@/services';

// La configuration se fait automatiquement au démarrage
// Vous pouvez configurer l'URL de base via VITE_API_URL dans .env
```

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
VITE_API_URL=http://localhost:8000
```

## Utilisation

### Import des services

```typescript
// Import d'un service spécifique
import { authService } from '@/services';

// Ou import du service par défaut
import auth from '@/services/authService';

// Ou import des fonctions individuelles
import { login, register } from '@/services/authService';
```

### Service d'authentification

```typescript
import { authService } from '@/services';

// Connexion
const { user, token } = await authService.login(
  'email@example.com',
  'password',
  true // remember me
);

// Inscription
const { user, token } = await authService.register({
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  password: 'SecurePass123!',
  password_confirmation: 'SecurePass123!',
  account_type: 'buyer', // ou 'photographer'
  phone: '+226 12 34 56 78',
});

// Déconnexion
await authService.logout();

// Vérifier si connecté
const isAuth = authService.isAuthenticated();

// Récupérer l'utilisateur actuel
const user = authService.getCurrentUser();

// Rafraîchir le token
const newToken = await authService.refreshToken();
```

### Service Photos

```typescript
import { photoService } from '@/services';

// Récupérer toutes les photos (paginé)
const { data, total, page, pages } = await photoService.getPhotos(1, 24);

// Récupérer une photo par ID
const photo = await photoService.getPhoto('photo-id');

// Photos en vedette
const featured = await photoService.getFeatured(10);

// Photos récentes
const recent = await photoService.getRecent(24);

// Photos populaires
const popular = await photoService.getPopular(24);

// Photos similaires
const similar = await photoService.getSimilar('photo-id', 6);

// Rechercher des photos
const results = await photoService.search('paysage', filters);
```

### Service Panier

```typescript
import { cartService } from '@/services';

// Récupérer le panier
const cart = await cartService.getCart();

// Ajouter au panier
const updatedCart = await cartService.addToCart('photo-id', 'standard');

// Mettre à jour un item
const updatedCart = await cartService.updateCartItem(0, 'extended');

// Retirer un item
const updatedCart = await cartService.removeFromCart(0);

// Vider le panier
await cartService.clearCart();

// Nombre d'items
const count = await cartService.getCartItemsCount();
```

### Service Commandes

```typescript
import { orderService } from '@/services';

// Récupérer toutes les commandes
const { data, total, page, pages } = await orderService.getOrders(20);

// Récupérer une commande
const order = await orderService.getOrder('order-id');

// Créer une commande
const order = await orderService.createOrder({
  items: [
    { photo_id: 'photo-1', license_type: 'standard' },
    { photo_id: 'photo-2', license_type: 'extended' },
  ],
  subtotal: 10000,
  total: 10000,
  payment_method: 'mobile_money',
  billing_email: 'john@example.com',
  billing_first_name: 'John',
  billing_last_name: 'Doe',
  billing_phone: '+226 12 34 56 78',
});

// Initier le paiement
const { payment_url, payment_token } = await orderService.initiatePayment(
  'order-id',
  {
    payment_method: 'mobile_money',
    payment_provider: 'FLOOZ',
    phone: '+226 12 34 56 78',
  }
);

// Créer et payer en une seule fois
const { order, payment_url, payment_token } = await orderService.createOrderAndPay(
  orderData,
  paymentData
);
```

### Service Utilisateur

```typescript
import { userService } from '@/services';

// Récupérer le profil
const profile = await userService.getUserProfile();

// Mettre à jour le profil
const updatedProfile = await userService.updateUserProfile({
  first_name: 'Jane',
  last_name: 'Doe',
  phone: '+226 12 34 56 78',
  bio: 'Photographe passionnée',
});

// Mettre à jour l'avatar
await userService.updateAvatar(avatarFile);

// Changer le mot de passe
await userService.changePassword({
  current_password: 'OldPass123!',
  password: 'NewPass123!',
  password_confirmation: 'NewPass123!',
});
```

### Services Photographe

```typescript
import { photographerService } from '@/services';

// Dashboard
const stats = await photographerService.getDashboardStats();

// Analytics
const analytics = await photographerService.getAnalytics('30d');

// Photos
const { data, meta } = await photographerService.getPhotographerPhotos(20, 1);

// Upload photo
const photo = await photographerService.uploadPhoto({
  title: 'Sunset in Ouagadougou',
  description: 'Beautiful sunset...',
  category_id: 'cat-id',
  tags: ['sunset', 'ouagadougou', 'burkina'],
  price_standard: 5000,
  price_extended: 15000,
  image: photoFile,
});

// Mettre à jour photo
const updated = await photographerService.updatePhoto('photo-id', {
  title: 'New title',
  price_standard: 6000,
});

// Supprimer photo
await photographerService.deletePhoto('photo-id');

// Stats d'une photo
const photoStats = await photographerService.getPhotoStats('photo-id');

// Revenus
const revenue = await photographerService.getRevenueHistory('30d');
const summary = await photographerService.getRevenueSummary();
const sales = await photographerService.getSalesHistory(20);

// Retraits
const withdrawals = await photographerService.getWithdrawals(20);

const withdrawal = await photographerService.createWithdrawal({
  amount: 50000,
  payment_method: 'mobile_money',
  payment_details: {
    phone: '+226 12 34 56 78',
    operator: 'Orange Money',
  },
});

await photographerService.cancelWithdrawal('withdrawal-id');
```

## Gestion des erreurs

Tous les services utilisent des try/catch et lancent des erreurs avec des messages personnalisés :

```typescript
try {
  const user = await authService.login(email, password);
} catch (error) {
  console.error(error.message); // Message d'erreur utilisateur
  // Afficher une notification à l'utilisateur
}
```

## Types TypeScript

Tous les services sont typés avec TypeScript. Les types sont générés automatiquement depuis l'API OpenAPI :

```typescript
import type { User, Photo, Order } from '@/services';

const user: User = await authService.getCurrentUser();
const photo: Photo = await photoService.getPhoto('id');
const order: Order = await orderService.getOrder('id');
```

## Migration depuis l'ancien système

Si vous utilisez encore les anciens services mockés, voici comment migrer :

### Avant (mock)
```typescript
import { login } from '@/services/authService';
const { user, token } = await login(email, password);
```

### Après (API réelle)
```typescript
import { authService } from '@/services';
const { user, token } = await authService.login(email, password);
```

Les signatures de fonctions sont identiques pour faciliter la migration.

## Notes importantes

1. **Token JWT** : Le token est automatiquement géré et ajouté aux requêtes
2. **Erreurs 401** : Les erreurs d'authentification nettoient automatiquement les tokens
3. **Configuration** : L'URL de base est configurée via `VITE_API_URL`
4. **Types** : Tous les types sont générés depuis l'OpenAPI spec
5. **Compatibilité** : Les anciens fichiers `.js` peuvent coexister avec les nouveaux `.ts`

## Développement

Pour régénérer les types de l'API depuis la spec OpenAPI :

```bash
# TODO: Ajouter la commande de génération
npm run generate:api
```
