# Guide de Migration - Services API

Ce guide vous aide à migrer de l'ancien système de services mockés vers les nouveaux services utilisant l'API réelle.

## Vue d'ensemble

L'application dispose maintenant de deux systèmes de services :
- **Anciens services** (`.js` - mockés) : Dans `src/services/`
- **Nouveaux services** (`.ts` - API réelle) : Dans `src/services/`

Les nouveaux services TypeScript remplacent les anciens tout en gardant la même interface pour faciliter la migration.

## Fichiers créés

### Configuration
- `src/config/apiConfig.ts` - Configuration centralisée de l'API OpenAPI

### Services
- `src/services/authService.ts` - Authentification (remplace `authService.js`)
- `src/services/photoService.ts` - Gestion des photos (remplace `photoService.js`)
- `src/services/cartService.ts` - Panier (remplace `cartService.js`)
- `src/services/orderService.ts` - Commandes (remplace `orderService.js`)
- `src/services/userService.ts` - Profil utilisateur (remplace `userService.js`)
- `src/services/photographerService.ts` - Services photographe (nouveau)
- `src/services/index.ts` - Point d'entrée centralisé
- `src/services/README.md` - Documentation des services

### Fichiers à supprimer (après migration complète)
- `src/services/authService.js`
- `src/services/photoService.js`
- `src/services/cartService.js`
- `src/services/orderService.js`
- `src/services/userService.js`

## Migration par service

### 1. Service d'authentification

#### Ancien (authService.js)
```javascript
import { login, register, logout } from '@/services/authService';
```

#### Nouveau (authService.ts)
```typescript
import { authService } from '@/services';
// ou
import { login, register, logout } from '@/services/authService';
```

**Changements** :
- Signatures identiques
- Retours typés avec TypeScript
- Erreurs plus détaillées depuis l'API
- Token géré automatiquement

### 2. Service Photos

#### Ancien (photoService.js)
```javascript
import { getPhotos, getPhoto, getFeatured } from '@/services/photoService';
```

#### Nouveau (photoService.ts)
```typescript
import { photoService } from '@/services';
// ou
import { getPhotos, getPhoto, getFeatured } from '@/services/photoService';
```

**Changements** :
- `search()` utilise maintenant l'API (pas encore complètement implémenté)
- `uploadPhoto()`, `updatePhoto()`, `deletePhoto()` redirigent vers `PhotographerPhotosService`
- Résultats paginés avec métadonnées

### 3. Service Panier

#### Ancien (cartService.js - n'existait pas)
```javascript
// Pas d'ancien service
```

#### Nouveau (cartService.ts)
```typescript
import { cartService } from '@/services';

const cart = await cartService.getCart();
await cartService.addToCart('photo-id', 'standard');
```

**Nouveau service** - Aucune migration nécessaire

### 4. Service Commandes

#### Ancien (orderService.js)
```javascript
import orderService from '@/services/orderService';
```

#### Nouveau (orderService.ts)
```typescript
import { orderService } from '@/services';
```

**Changements** :
- Support complet de CinetPay pour les paiements
- `createOrderAndPay()` combine création et paiement
- Nouveaux champs pour les informations de facturation

### 5. Service Utilisateur

#### Ancien (userService.js)
```javascript
import userService from '@/services/userService';
```

#### Nouveau (userService.ts)
```typescript
import { userService } from '@/services';
```

**Changements** :
- `changePassword()` maintenant disponible dans l'API
- `updateAvatar()` gère l'upload de fichier
- Profil photographe inclus dans les données

### 6. Services Photographe (Nouveau)

```typescript
import { photographerService } from '@/services';

// Dashboard
const stats = await photographerService.getDashboardStats();

// Analytics
const analytics = await photographerService.getAnalytics('30d');

// Photos
const photos = await photographerService.getPhotographerPhotos(20, 1);

// Revenue
const revenue = await photographerService.getRevenueHistory('30d');

// Withdrawals
const withdrawals = await photographerService.getWithdrawals(20);
```

## Étapes de migration

### Étape 1 : Configuration de l'environnement

1. Créer un fichier `.env` à la racine :
```env
VITE_API_URL=http://localhost:8000
```

2. Vérifier que l'API backend est accessible

### Étape 2 : Migration progressive par composant

Pour chaque composant utilisant les anciens services :

1. **Identifier les imports**
```javascript
// Avant
import { login } from '@/services/authService';
```

2. **Mettre à jour les imports**
```typescript
// Après
import { authService } from '@/services';
```

3. **Adapter les appels**
```typescript
// Avant
const result = await login(email, password);

// Après
const result = await authService.login(email, password);
```

4. **Tester le composant**

### Étape 3 : Gestion des erreurs

Les nouveaux services retournent des erreurs plus détaillées :

```typescript
try {
  const user = await authService.login(email, password);
} catch (error) {
  // error.message contient un message utilisateur friendly
  console.error(error.message);

  // Pour les détails techniques
  console.error(error);
}
```

### Étape 4 : Types TypeScript

Si vous utilisez TypeScript dans vos composants :

```typescript
import type { User, Photo, Order } from '@/services';

const user: User = authService.getCurrentUser();
const photo: Photo = await photoService.getPhoto(id);
```

### Étape 5 : Tests

Après chaque migration de composant :
1. Tester les fonctionnalités
2. Vérifier les appels réseau dans DevTools
3. Vérifier la gestion des erreurs

## Composants à migrer (par ordre de priorité)

### Haute priorité
1. **Login/Register** - `src/pages/Login.jsx`, `src/pages/Register.jsx`
2. **User Profile** - `src/pages/ProfileEdit.jsx`
3. **Photos** - Tous les composants affichant des photos
4. **Cart & Checkout** - `src/pages/Cart.jsx`, `src/pages/Checkout.jsx`

### Moyenne priorité
5. **Photographer Dashboard** - `src/pages/photographer/*`
6. **Orders** - `src/pages/Orders.jsx`

### Basse priorité
7. **Admin** - `src/pages/admin/*` (à vérifier si l'API admin est prête)

## Vérification de la migration

### Checklist par composant

- [ ] Imports mis à jour
- [ ] Appels de fonctions adaptés
- [ ] Gestion des erreurs en place
- [ ] Types TypeScript ajoutés (si applicable)
- [ ] Testé en développement
- [ ] Testé avec l'API backend

### Outils de vérification

```bash
# Trouver les imports de l'ancien système
grep -r "from '@/services/authService'" src/

# Vérifier qu'il n'y a plus d'imports .js
grep -r "from '@/services/.*\.js'" src/
```

## Dépannage

### Erreur : "Cannot find module '@/api'"

**Solution** : Vérifier que `tsconfig.json` ou `jsconfig.json` a bien le path alias :
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Erreur : "Network Error" ou "CORS"

**Solution** :
1. Vérifier que l'API backend est démarrée
2. Vérifier `VITE_API_URL` dans `.env`
3. Vérifier la configuration CORS du backend

### Erreur : "401 Unauthorized"

**Solution** :
1. Vérifier que le token est bien stocké
2. Se reconnecter
3. Vérifier la configuration du token dans `apiConfig.ts`

### Les données ne s'affichent pas

**Solution** :
1. Ouvrir DevTools > Network
2. Vérifier les requêtes API
3. Vérifier les réponses du serveur
4. Vérifier la structure des données retournées

## Support

Pour toute question ou problème :
1. Consulter la documentation : `src/services/README.md`
2. Vérifier les exemples dans les services
3. Consulter l'API OpenAPI générée : `src/api/`

## Après la migration complète

Une fois tous les composants migrés :

1. Supprimer les anciens fichiers `.js` :
```bash
rm src/services/authService.js
rm src/services/photoService.js
rm src/services/cartService.js
rm src/services/orderService.js
rm src/services/userService.js
```

2. Supprimer `src/data/mockData.js` si plus utilisé

3. Nettoyer `src/services/api.js` (peut être gardé pour compatibilité)

4. Mettre à jour la documentation

## Notes importantes

- Les anciens et nouveaux services peuvent coexister pendant la migration
- Tester chaque composant après migration
- Ne pas supprimer les anciens services tant que la migration n'est pas complète
- Garder une copie de sauvegarde avant de supprimer les anciens fichiers
