# Guide d'Utilisation - Système de Permissions Pouire

## 🎯 Vue d'Ensemble

Le système de permissions de Pouire est désormais **complètement implémenté** et prêt à l'emploi. Ce guide vous montre comment utiliser tous les outils disponibles dans vos composants.

---

## 📚 Table des Matières

1. [Outils Disponibles](#outils-disponibles)
2. [Utilisation dans les Composants](#utilisation-dans-les-composants)
3. [Exemples Pratiques](#exemples-pratiques)
4. [Composants Déjà Améliorés](#composants-déjà-améliorés)
5. [Bonnes Pratiques](#bonnes-pratiques)

---

## 🛠️ Outils Disponibles

### 1. **Hooks Personnalisés**

#### `usePermission(permission)`
Vérifie si l'utilisateur a une permission spécifique.

```jsx
import { usePermission } from '../hooks/usePermission';
import { PERMISSIONS } from '../utils/permissions';

function MyComponent() {
  const canUpload = usePermission(PERMISSIONS.UPLOAD_PHOTOS);

  return canUpload ? <UploadButton /> : <UpgradeMessage />;
}
```

#### `useRole(role)`
Vérifie si l'utilisateur a un rôle spécifique.

```jsx
import { useRole, useIsAdmin } from '../hooks/useRole';

function MyComponent() {
  const isPhotographer = useRole('photographer');
  const isAdmin = useIsAdmin();

  return isAdmin ? <AdminPanel /> : <UserPanel />;
}
```

#### `usePhotographerStatus()`
Obtient le statut du photographe.

```jsx
import { useIsApprovedPhotographer, usePhotographerStatus } from '../hooks/usePhotographerStatus';

function MyComponent() {
  const isApproved = useIsApprovedPhotographer();
  const status = usePhotographerStatus();

  if (status === 'pending') {
    return <PendingMessage />;
  }

  return isApproved ? <Dashboard /> : <WaitingMessage />;
}
```

### 2. **Composants d'Autorisation**

#### `<Can>`
Affiche conditionnellement du contenu basé sur les permissions.

```jsx
import { Can } from '../components/auth';
import { PERMISSIONS } from '../utils/permissions';

function MyComponent() {
  return (
    <div>
      <Can permission={PERMISSIONS.UPLOAD_PHOTOS}>
        <UploadButton />
      </Can>

      <Can anyPermission={[PERMISSIONS.MODERATE_PHOTOS, PERMISSIONS.APPROVE_PHOTOS]}>
        <ModerateButton />
      </Can>

      <Can role="admin">
        <AdminSettings />
      </Can>

      <Can photographerApproved>
        <PhotographerDashboard />
      </Can>

      {/* Avec fallback */}
      <Can
        permission={PERMISSIONS.DELETE_ANY_PHOTO}
        fallback={<UpgradeMessage />}
      >
        <DeleteButton />
      </Can>
    </div>
  );
}
```

#### `<RequirePermission>`
Similaire à `Can`, mais affiche un message d'erreur au lieu de se cacher.

```jsx
import { RequirePermission } from '../components/auth';
import { PERMISSIONS } from '../utils/permissions';

function MyComponent() {
  return (
    <RequirePermission
      permission={PERMISSIONS.UPLOAD_PHOTOS}
      deniedMessage="Vous devez être un photographe approuvé pour uploader."
    >
      <UploadForm />
    </RequirePermission>
  );
}
```

#### `<PhotographerGuard>`
Protège tout le contenu et gère automatiquement les différents statuts photographe.

```jsx
import { PhotographerGuard } from '../components/auth';

function PhotographerPage() {
  return (
    <PhotographerGuard>
      {/* Ce contenu s'affiche uniquement si le photographe est approuvé */}
      <PhotographerDashboard />
    </PhotographerGuard>
  );
}
```

### 3. **Context API - useAuth()**

Le hook `useAuth()` expose maintenant toutes les fonctions de permission :

```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const {
    user,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    isApprovedPhotographer,
    getPhotographerStatus,
    canUploadPhotos,
    getCapabilities,
    refreshAbilities
  } = useAuth();

  // Utiliser les fonctions
  if (hasPermission('upload-photos')) {
    // ...
  }

  if (hasAnyRole(['admin', 'moderator'])) {
    // ...
  }
}
```

---

## 💡 Utilisation dans les Composants

### Pattern 1 : Rendu Conditionnel Simple

```jsx
import { Can } from '../components/auth';
import { PERMISSIONS } from '../utils/permissions';

function PhotoActions({ photo }) {
  return (
    <div className="flex gap-2">
      {/* Visible uniquement si l'utilisateur peut éditer */}
      <Can permission={PERMISSIONS.EDIT_OWN_PHOTOS}>
        <button onClick={handleEdit}>Modifier</button>
      </Can>

      {/* Visible uniquement si l'utilisateur peut supprimer */}
      <Can permission={PERMISSIONS.DELETE_OWN_PHOTOS}>
        <button onClick={handleDelete}>Supprimer</button>
      </Can>

      {/* Visible uniquement pour admin */}
      <Can permission={PERMISSIONS.DELETE_ANY_PHOTO}>
        <button onClick={handleForceDelete}>Forcer la suppression</button>
      </Can>
    </div>
  );
}
```

### Pattern 2 : Protection de Page Entière

```jsx
import { PhotographerGuard } from '../components/auth';

export default function UploadPage() {
  return (
    <PhotographerGuard>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1>Uploader des Photos</h1>
        <UploadForm />
      </div>
    </PhotographerGuard>
  );
}
```

### Pattern 3 : Vérification dans la Logique

```jsx
import { usePermission } from '../hooks/usePermission';
import { PERMISSIONS } from '../utils/permissions';

function PhotoCard({ photo }) {
  const canEdit = usePermission(PERMISSIONS.EDIT_OWN_PHOTOS);
  const canDelete = usePermission(PERMISSIONS.DELETE_OWN_PHOTOS);

  const handleAction = () => {
    if (!canEdit) {
      alert('Vous n\'avez pas la permission de modifier');
      return;
    }

    // Procéder avec l'édition
    editPhoto(photo);
  };

  return (
    <div>
      {canEdit && <button onClick={handleAction}>Modifier</button>}
      {canDelete && <button onClick={handleDelete}>Supprimer</button>}
    </div>
  );
}
```

### Pattern 4 : Menu Dynamique

```jsx
import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../utils/permissions';

function DashboardMenu() {
  const { hasPermission, hasRole } = useAuth();

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      show: true
    },
    {
      label: 'Mes Photos',
      path: '/photographer/photos',
      show: hasRole('photographer')
    },
    {
      label: 'Upload',
      path: '/photographer/upload',
      show: hasPermission(PERMISSIONS.UPLOAD_PHOTOS)
    },
    {
      label: 'Modération',
      path: '/admin/moderation',
      show: hasPermission(PERMISSIONS.MODERATE_PHOTOS)
    },
    {
      label: 'Utilisateurs',
      path: '/admin/users',
      show: hasPermission(PERMISSIONS.VIEW_USERS)
    }
  ];

  return (
    <nav>
      {menuItems
        .filter(item => item.show)
        .map(item => (
          <Link key={item.path} to={item.path}>
            {item.label}
          </Link>
        ))
      }
    </nav>
  );
}
```

---

## 🎨 Exemples Pratiques

### Exemple 1 : Formulaire d'Upload avec Protection

```jsx
import { PhotographerGuard } from '../components/auth';
import { usePermission } from '../hooks/usePermission';
import { PERMISSIONS } from '../utils/permissions';

export default function UploadPage() {
  const canUpload = usePermission(PERMISSIONS.UPLOAD_PHOTOS);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!canUpload) {
      alert('Permission refusée');
      return;
    }

    // Procéder avec l'upload
    uploadPhoto(formData);
  };

  return (
    <PhotographerGuard>
      <form onSubmit={handleSubmit}>
        <input type="file" />
        <button type="submit" disabled={!canUpload}>
          {canUpload ? 'Uploader' : 'Non autorisé'}
        </button>
      </form>
    </PhotographerGuard>
  );
}
```

### Exemple 2 : Actions Admin avec Permissions Granulaires

```jsx
import { Can } from '../components/auth';
import { PERMISSIONS } from '../utils/permissions';

function UserActions({ user }) {
  return (
    <div className="flex gap-2">
      <Can permission={PERMISSIONS.EDIT_USERS}>
        <button onClick={() => editUser(user)}>Modifier</button>
      </Can>

      <Can permission={PERMISSIONS.SUSPEND_USERS}>
        <button onClick={() => suspendUser(user)}>
          {user.is_active ? 'Suspendre' : 'Activer'}
        </button>
      </Can>

      <Can permission={PERMISSIONS.DELETE_USERS}>
        <button onClick={() => deleteUser(user)} className="text-red-600">
          Supprimer
        </button>
      </Can>
    </div>
  );
}
```

### Exemple 3 : Statut Photographe avec Messages

```jsx
import { usePhotographerInfo } from '../hooks/usePhotographerStatus';

function PhotographerStatus() {
  const { status, isApproved, isPending, isRejected, isSuspended } = usePhotographerInfo();

  return (
    <div>
      {isPending && (
        <div className="bg-yellow-100 p-4 rounded">
          Votre profil est en attente d'approbation.
        </div>
      )}

      {isRejected && (
        <div className="bg-red-100 p-4 rounded">
          Votre profil a été refusé. Contactez le support.
        </div>
      )}

      {isSuspended && (
        <div className="bg-orange-100 p-4 rounded">
          Votre compte est suspendu.
        </div>
      )}

      {isApproved && (
        <div className="bg-green-100 p-4 rounded">
          Votre profil est actif !
        </div>
      )}
    </div>
  );
}
```

---

## ✅ Composants Déjà Améliorés

Les composants suivants ont **déjà été améliorés** avec le système de permissions :

### Pages Photographe
- ✅ [PhotographerUpload.jsx](src/pages/photographer/Upload.jsx) - Protégé avec `PhotographerGuard`
- ✅ [PhotographerAnalytics.jsx](src/pages/photographer/Analytics.jsx) - Protégé avec `PhotographerGuard`
- ✅ [MyPhotos.jsx](src/pages/photographer/MyPhotos.jsx) - Protégé avec `PhotographerGuard` + boutons Edit/Delete protégés

### Pages Admin
- ✅ [AdminDashboard.jsx](src/pages/admin/Dashboard.jsx) - Imports permissions ajoutés
- ✅ [AdminModeration.jsx](src/pages/admin/Moderation.jsx) - Boutons Approuver/Rejeter protégés avec `Can`
- ✅ [AdminUsers.jsx](src/pages/admin/Users.jsx) - Boutons Suspendre/Supprimer protégés avec `Can`

### Layout
- ✅ [Navbar.jsx](src/components/layout/Navbar.jsx) - Menu dynamique avec badges de statut photographe

### Routes
- ✅ [App.jsx](src/App.jsx) - ProtectedRoute amélioré avec `requirePermission` et `requireApproval`

---

## 📖 Bonnes Pratiques

### ✅ À FAIRE

1. **Utiliser `<Can>` pour le rendu conditionnel**
   ```jsx
   <Can permission="upload-photos">
     <UploadButton />
   </Can>
   ```

2. **Utiliser `PhotographerGuard` pour les pages photographe**
   ```jsx
   <PhotographerGuard>
     <PhotographerContent />
   </PhotographerGuard>
   ```

3. **Vérifier les permissions avant les actions critiques**
   ```jsx
   const handleDelete = () => {
     if (!hasPermission(PERMISSIONS.DELETE_ANY_PHOTO)) {
       alert('Permission refusée');
       return;
     }
     deletePhoto();
   };
   ```

4. **Utiliser les constantes PERMISSIONS**
   ```jsx
   import { PERMISSIONS } from '../utils/permissions';
   hasPermission(PERMISSIONS.UPLOAD_PHOTOS); // ✅ BON
   ```

5. **Préférer les permissions aux rôles quand possible**
   ```jsx
   hasPermission('moderate-photos'); // ✅ BON (granulaire)
   hasRole('moderator'); // ❌ MOINS BON (trop large)
   ```

### ❌ À ÉVITER

1. **Ne pas utiliser uniquement `account_type`**
   ```jsx
   user.account_type === 'admin'; // ❌ Éviter
   hasRole('admin'); // ✅ Utiliser ça à la place
   ```

2. **Ne pas oublier la vérification photographe approuvé**
   ```jsx
   // ❌ Mauvais
   hasRole('photographer') // Pas suffisant !

   // ✅ Bon
   hasRole('photographer') && isApprovedPhotographer()
   // OU mieux encore :
   canUploadPhotos()
   ```

3. **Ne pas hard-coder les permissions**
   ```jsx
   hasPermission('upload-photos'); // ❌ Éviter
   hasPermission(PERMISSIONS.UPLOAD_PHOTOS); // ✅ BON
   ```

4. **Ne pas dupliquer la logique de vérification**
   ```jsx
   // ❌ Mauvais - dupliquer partout
   if (user?.roles?.includes('photographer') && user?.is_approved_photographer) {
     // ...
   }

   // ✅ Bon - utiliser les helpers
   if (canUploadPhotos()) {
     // ...
   }
   ```

---

## 🔄 Rafraîchir les Permissions

Après certains événements, vous devez rafraîchir les permissions de l'utilisateur :

```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { refreshAbilities } = useAuth();

  const handleSomething = async () => {
    // Faire une action qui change les permissions
    await someApiCall();

    // Rafraîchir les permissions
    await refreshAbilities();
  };
}
```

**Quand rafraîchir :**
- Après approbation/rejet de photographe
- Après changement de rôle
- Après mise à jour de profil
- Après toute action qui affecte les permissions

---

## 🎓 Résumé Rapide

| Besoin | Outil à Utiliser |
|--------|------------------|
| Afficher conditionnellement un composant | `<Can>` |
| Vérifier une permission dans la logique | `usePermission()` |
| Vérifier un rôle | `useRole()` ou `useIsAdmin()` |
| Protéger une page photographe | `<PhotographerGuard>` |
| Protéger une route | `<ProtectedRoute>` avec `requirePermission` |
| Afficher message si permission refusée | `<RequirePermission>` |
| Vérifier statut photographe | `usePhotographerStatus()` ou `useIsApprovedPhotographer()` |
| Obtenir toutes les capacités | `getCapabilities()` |

---

## 📞 Support

Si vous avez des questions :
1. Consultez ce guide
2. Regardez les exemples dans les composants déjà améliorés
3. Consultez [FRONTEND_ROLES_PERMISSIONS_GUIDE.md](FRONTEND_ROLES_PERMISSIONS_GUIDE.md)

---

**Version** : 2.0
**Dernière mise à jour** : 2025-11-17
**Auteur** : Équipe Frontend Pouire
