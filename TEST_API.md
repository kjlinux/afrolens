# Guide de Test de l'API

## Vérification Rapide

Voici comment vérifier que votre application utilise bien l'API réelle et non plus les données mockées.

## 1. Vérifier la Configuration

### Console du Navigateur

1. Ouvrez l'application : `pnpm run dev`
2. Ouvrez la console du navigateur (F12)
3. Tapez :

```javascript
console.log(import.meta.env.VITE_API_URL);
```

**Résultat attendu** : `http://localhost:8000`

### Vérifier l'Initialisation

Dans la console, vous devriez voir que l'API OpenAPI est configurée. Vous pouvez vérifier avec :

```javascript
// Dans la console du navigateur
import('@/api').then(api => console.log(api.OpenAPI));
```

## 2. Tester les Appels API

### Test 1 : Récupération des Photos

1. Allez sur la page d'accueil
2. Ouvrez l'onglet "Network" (Réseau) de la console
3. Filtrez par "XHR" ou "Fetch"
4. Rafraîchissez la page

**Résultat attendu** :
- Vous devriez voir une requête vers `http://localhost:8000/api/photos`
- Si le backend n'est pas disponible, vous verrez une erreur réseau

### Test 2 : Connexion

1. Allez sur la page de connexion
2. Ouvrez l'onglet "Network"
3. Essayez de vous connecter avec :
   - Email : (un compte test de votre backend)
   - Password : (le mot de passe correspondant)

**Résultat attendu** :
- Requête POST vers `http://localhost:8000/api/auth/login`
- Réponse avec `access_token` si les identifiants sont corrects
- Erreur 401 si les identifiants sont incorrects

### Test 3 : Panier

1. Connectez-vous
2. Ajoutez une photo au panier
3. Vérifiez l'onglet "Network"

**Résultat attendu** :
- Requête POST vers `http://localhost:8000/api/cart/items`
- Le panier est maintenant géré côté serveur, pas en localStorage

## 3. Comparer Ancien vs Nouveau Comportement

| Fonctionnalité | Ancien (Mock) | Nouveau (API) |
|---------------|---------------|---------------|
| **Photos** | Chargement instantané | Délai réseau visible |
| **Connexion** | Toujours email/password123 | Authentification réelle |
| **Panier** | Stocké dans localStorage | Stocké sur le serveur |
| **Token** | `mock_token_...` | JWT réel du backend |
| **Erreurs** | Messages génériques | Messages du backend |

## 4. Points de Contrôle

### ✅ L'API est bien configurée si :

- [ ] Les requêtes apparaissent dans l'onglet Network vers `localhost:8000`
- [ ] Les tokens JWT sont stockés dans localStorage au format JWT réel
- [ ] Le panier persiste même après rafraîchissement de la page (stocké serveur)
- [ ] Les erreurs montrent des messages provenant du backend
- [ ] Les délais réseau sont visibles lors des requêtes

### ❌ Problèmes potentiels :

#### Aucune requête réseau visible
**Cause** : Les anciens services `.js` sont peut-être encore utilisés
**Solution** : Vérifier que les fichiers `.js.backup` ne sont pas importés

#### Erreur CORS
**Cause** : Le backend ne permet pas les requêtes depuis `localhost:5173`
**Solution** : Configurer CORS dans le backend FastAPI

#### 404 Not Found
**Cause** : Le backend ne tourne pas ou l'URL est incorrecte
**Solution** : Démarrer le backend et vérifier `.env`

## 5. Tests Fonctionnels Complets

### Scénario 1 : Nouveau Compte

1. ✅ S'inscrire avec un nouveau compte
2. ✅ Vérifier que le token est reçu
3. ✅ Vérifier que l'utilisateur est connecté
4. ✅ Se déconnecter
5. ✅ Se reconnecter avec les mêmes identifiants

### Scénario 2 : Achat de Photo

1. ✅ Se connecter
2. ✅ Naviguer vers une photo
3. ✅ Ajouter au panier
4. ✅ Voir le panier
5. ✅ Procéder au checkout
6. ✅ Vérifier la création de commande

### Scénario 3 : Upload Photo (Photographe)

1. ✅ Se connecter en tant que photographe approuvé
2. ✅ Aller sur la page d'upload
3. ✅ Uploader une photo
4. ✅ Vérifier le statut "pending"

## 6. Debugging

### Activer les Logs Détaillés

Dans `src/config/apiConfig.ts`, vous pouvez ajouter des intercepteurs pour logger toutes les requêtes :

```typescript
// Exemple de logging (à ajouter temporairement)
OpenAPI.interceptors = {
  request: async (config) => {
    console.log('🚀 API Request:', config.url, config);
    return config;
  },
  response: async (response) => {
    console.log('✅ API Response:', response);
    return response;
  },
};
```

### Vérifier le Token JWT

Dans la console :

```javascript
const token = localStorage.getItem('auth_token');
console.log('Token:', token);

// Décoder le JWT (partie payload)
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('Token payload:', payload);
}
```

## 7. Checklist de Validation Finale

- [ ] Backend FastAPI tourne sur `http://localhost:8000`
- [ ] Frontend tourne sur `http://localhost:5173`
- [ ] Fichier `.env` créé avec `VITE_API_URL=http://localhost:8000`
- [ ] Les requêtes API apparaissent dans Network tab
- [ ] La connexion fonctionne avec un compte réel
- [ ] Le panier fonctionne et persiste
- [ ] Les photos se chargent depuis le backend
- [ ] Les erreurs sont claires et proviennent du backend

## 8. En Cas de Problème

### Le backend répond 500
Vérifiez les logs du backend FastAPI pour voir l'erreur détaillée

### Les photos ne s'affichent pas
Vérifiez que la base de données contient des photos approuvées

### Le token expire rapidement
Normal, c'est la sécurité JWT. Rafraîchissez ou reconnectez-vous

### CORS Error
Ajoutez dans le backend FastAPI :
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

**Bon test !** 🚀
