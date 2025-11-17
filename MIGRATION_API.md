# Migration des Données Mockées vers l'API Réelle

## Résumé des Changements

Cette migration remplace complètement les services JavaScript mockés par des services TypeScript utilisant l'API backend réelle.

## Fichiers Modifiés

### 1. Configuration

#### `.env` (créé)
- Fichier de configuration créé à partir de `.env.example`
- URL de l'API configurée : `VITE_API_URL=http://localhost:8000`

#### `src/main.jsx` (modifié)
- Ajout de l'appel à `configureAPI()` au démarrage de l'application
- Cette fonction initialise la configuration OpenAPI avec l'URL du backend et les tokens JWT

### 2. Services Migrés

Les anciens services `.js` ont été renommés en `.js.backup` et remplacés par leurs équivalents TypeScript :

| Ancien Service | Nouveau Service | Status |
|---------------|----------------|--------|
| `authService.js` | `authService.ts` | ✅ Migré |
| `photoService.js` | `photoService.ts` | ✅ Migré |
| `userService.js` | `userService.ts` | ✅ Migré |
| `orderService.js` | `orderService.ts` | ✅ Migré |
| `cartService.js` | `cartService.ts` | ✅ Migré |

### 3. Contexts Adaptés

#### `src/context/CartContext.jsx` (modifié)
- Adapté pour utiliser la nouvelle structure de données de l'API
- L'API retourne un objet `CartData` avec `{ items, subtotal, total, items_count }`
- Les fonctions ont été adaptées pour :
  - `addToCart` : accepte maintenant un `photoId` (string)
  - `removeFromCart` / `updateCartItem` : utilisent des index au lieu d'IDs

## Différences Clés entre Mock et API Réelle

### 1. Panier (Cart)

**Ancien (Mock)** :
```javascript
// Retournait un tableau d'items
const cart = await cartService.getCart(); // Array
cart.forEach(item => console.log(item));
```

**Nouveau (API)** :
```typescript
// Retourne un objet CartData
const cartData = await cartService.getCart(); // { items, subtotal, total, items_count }
cartData.items.forEach(item => console.log(item));
```

### 2. Photos

**Ancien (Mock)** :
```javascript
// Manipulait des données en mémoire
const photos = searchPhotos(query); // Filtrage côté client
```

**Nouveau (API)** :
```typescript
// Appelle l'API backend
const photos = await getPhoto(id); // Requête HTTP réelle
```

### 3. Authentification

**Ancien (Mock)** :
```javascript
// Générait un token mocké
const token = `mock_token_${user.id}_${Date.now()}`;
```

**Nouveau (API)** :
```typescript
// Reçoit un token JWT du backend
const { access_token } = await AuthenticationService.login({...});
```

## Fonctionnalités Non Encore Implémentées dans l'API

Certaines fonctionnalités du mock ne sont pas encore disponibles dans l'API backend :

### `authService.ts`
- ❌ `forgotPassword()` - Endpoint non disponible
- ❌ `resetPassword()` - Endpoint non disponible

### `photoService.ts`
- ⚠️ `search()` - Utilise un filtrage côté client temporaire
- ⚠️ `getByCategory()` - Utilise un filtrage côté client temporaire
- ❌ `incrementViews()` - Endpoint non disponible
- ⚠️ `uploadPhoto()`, `updatePhoto()`, `deletePhoto()` - Utilisent `PhotographerPhotosService`

## Comment Tester

### 1. Démarrer le Backend

Assurez-vous que votre backend FastAPI tourne sur `http://localhost:8000` :

```bash
# Dans le dossier backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Démarrer le Frontend

```bash
# Dans le dossier frontend
pnpm run dev
```

### 3. Vérifier les Appels API

Ouvrez la console de développement (F12) et l'onglet "Network" pour voir les requêtes HTTP réelles vers l'API.

## Messages d'Erreur Possibles

### Backend Non Accessible

**Erreur** : `Failed to fetch` ou `Network Error`

**Solution** :
- Vérifier que le backend tourne sur `http://localhost:8000`
- Vérifier la configuration dans `.env`
- Vérifier les logs du backend pour détecter les erreurs CORS

### Token Expiré

**Erreur** : `401 Unauthorized` ou `Session expirée`

**Solution** :
- Se reconnecter
- Le système devrait automatiquement nettoyer les tokens expirés

### Photo Non Trouvée

**Erreur** : `404 Not Found` ou `Photo non trouvée`

**Cause** : L'ID de la photo existe dans le mock mais pas dans la base de données réelle

**Solution** : Uploader des photos via l'interface photographe

## Retour en Arrière (Rollback)

Si vous devez revenir aux données mockées temporairement :

```bash
# Dans src/services/
mv authService.ts authService.ts.temp
mv authService.js.backup authService.js

mv photoService.ts photoService.ts.temp
mv photoService.js.backup photoService.js

mv userService.ts userService.ts.temp
mv userService.js.backup userService.js

mv orderService.ts orderService.ts.temp
mv orderService.js.backup orderService.js

mv cartService.ts cartService.ts.temp
mv cartService.js.backup cartService.js
```

## Prochaines Étapes

1. ✅ Migrer tous les services vers TypeScript
2. ✅ Adapter les contexts pour la nouvelle API
3. ⏳ Implémenter les endpoints manquants dans le backend :
   - Forgot/Reset Password
   - Increment Views
   - Search avec filtres avancés
4. ⏳ Optimiser les performances avec du caching
5. ⏳ Ajouter des tests d'intégration

## Support

En cas de problème, vérifiez :
1. Les logs du backend FastAPI
2. La console du navigateur (onglet Console)
3. Les requêtes réseau (onglet Network)
4. La configuration de l'API dans `.env`

---

**Date de migration** : 2025-11-17
**Version** : 1.0.0
