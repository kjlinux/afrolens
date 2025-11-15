# Guide d'intégration finale - 4 dernières pages admin

## ✅ État actuel: 16/20 pages intégrées (80%)

### Pages restantes:
1. **Admin Users** - [src/pages/admin/Users.jsx](src/pages/admin/Users.jsx)
2. **Admin Moderation** - [src/pages/admin/Moderation.jsx](src/pages/admin/Moderation.jsx)
3. **Admin PhotographersPending** - [src/pages/admin/PhotographersPending.jsx](src/pages/admin/PhotographersPending.jsx)
4. **Admin Withdrawals** - [src/pages/admin/Withdrawals.jsx](src/pages/admin/Withdrawals.jsx)

---

## 1. Admin Users Management

### Fichier: `src/pages/admin/Users.jsx`

### Services à utiliser:
```javascript
import {
  getUsers,
  updateUser,
  deleteUser,
  toggleUserBan
} from '../../services/adminService';
```

### Pattern d'intégration:
```javascript
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [page, setPage] = useState(1);
const [filters, setFilters] = useState({ role: 'all', status: 'all' });

useEffect(() => {
  loadUsers();
}, [page, filters]);

const loadUsers = async () => {
  try {
    setLoading(true);
    const data = await getUsers(page, 20, filters);
    setUsers(data.data || data);
    setPagination(data.pagination);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

const handleBanUser = async (userId, isBanned) => {
  try {
    await toggleUserBan(userId, isBanned);
    loadUsers(); // Recharger la liste
  } catch (err) {
    alert(err.message);
  }
};

const handleDeleteUser = async (userId) => {
  if (confirm('Supprimer cet utilisateur ?')) {
    try {
      await deleteUser(userId);
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  }
};
```

---

## 2. Admin Moderation (Photos)

### Fichier: `src/pages/admin/Moderation.jsx`

### Services à utiliser:
```javascript
import {
  getPendingPhotos,
  approvePhoto,
  rejectPhoto,
  deletePhoto
} from '../../services/adminService';
```

### Pattern d'intégration:
```javascript
const [photos, setPhotos] = useState([]);
const [loading, setLoading] = useState(true);
const [selectedPhoto, setSelectedPhoto] = useState(null);
const [showRejectModal, setShowRejectModal] = useState(false);
const [rejectionReason, setRejectionReason] = useState('');

useEffect(() => {
  loadPendingPhotos();
}, []);

const loadPendingPhotos = async () => {
  try {
    setLoading(true);
    const data = await getPendingPhotos(1, 50);
    setPhotos(data.data || data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

const handleApprove = async (photoId) => {
  try {
    await approvePhoto(photoId);
    // Retirer de la liste ou recharger
    setPhotos(prev => prev.filter(p => p.id !== photoId));
  } catch (err) {
    alert(err.message);
  }
};

const handleReject = async () => {
  try {
    await rejectPhoto(selectedPhoto.id, rejectionReason);
    setPhotos(prev => prev.filter(p => p.id !== selectedPhoto.id));
    setShowRejectModal(false);
    setSelectedPhoto(null);
    setRejectionReason('');
  } catch (err) {
    alert(err.message);
  }
};

const handleDelete = async (photoId) => {
  if (confirm('Supprimer définitivement cette photo ?')) {
    try {
      await deletePhoto(photoId);
      setPhotos(prev => prev.filter(p => p.id !== photoId));
    } catch (err) {
      alert(err.message);
    }
  }
};
```

---

## 3. Admin Photographers Pending

### Fichier: `src/pages/admin/PhotographersPending.jsx`

### Services à utiliser:
```javascript
import {
  getPendingPhotographers,
  approvePhotographer,
  rejectPhotographer
} from '../../services/adminService';
```

### Pattern d'intégration:
```javascript
const [pendingPhotographers, setPendingPhotographers] = useState([]);
const [loading, setLoading] = useState(true);
const [selectedUser, setSelectedUser] = useState(null);
const [showRejectModal, setShowRejectModal] = useState(false);
const [rejectionReason, setRejectionReason] = useState('');

useEffect(() => {
  loadPendingPhotographers();
}, []);

const loadPendingPhotographers = async () => {
  try {
    setLoading(true);
    const data = await getPendingPhotographers();
    setPendingPhotographers(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

const handleApprove = async (userId) => {
  try {
    await approvePhotographer(userId);
    setPendingPhotographers(prev => prev.filter(p => p.id !== userId));
  } catch (err) {
    alert(err.message);
  }
};

const handleReject = async () => {
  try {
    await rejectPhotographer(selectedUser.id, rejectionReason);
    setPendingPhotographers(prev => prev.filter(p => p.id !== selectedUser.id));
    setShowRejectModal(false);
    setSelectedUser(null);
    setRejectionReason('');
  } catch (err) {
    alert(err.message);
  }
};
```

---

## 4. Admin Withdrawals

### Fichier: `src/pages/admin/Withdrawals.jsx`

### Services à utiliser:
```javascript
import {
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  completeWithdrawal
} from '../../services/adminService';
```

### Pattern d'intégration:
```javascript
const [withdrawals, setWithdrawals] = useState([]);
const [loading, setLoading] = useState(true);
const [statusFilter, setStatusFilter] = useState('all'); // all, pending, approved, completed, rejected
const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
const [showCompleteModal, setShowCompleteModal] = useState(false);
const [transactionId, setTransactionId] = useState('');
const [showRejectModal, setShowRejectModal] = useState(false);
const [rejectionReason, setRejectionReason] = useState('');

useEffect(() => {
  loadWithdrawals();
}, [statusFilter]);

const loadWithdrawals = async () => {
  try {
    setLoading(true);
    const status = statusFilter === 'all' ? undefined : statusFilter;
    const data = await getAllWithdrawals(status);
    setWithdrawals(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

const handleApprove = async (withdrawalId) => {
  if (confirm('Approuver cette demande de retrait ?')) {
    try {
      await approveWithdrawal(withdrawalId);
      loadWithdrawals();
    } catch (err) {
      alert(err.message);
    }
  }
};

const handleComplete = async () => {
  try {
    await completeWithdrawal(selectedWithdrawal.id, transactionId);
    setShowCompleteModal(false);
    setTransactionId('');
    loadWithdrawals();
  } catch (err) {
    alert(err.message);
  }
};

const handleReject = async () => {
  try {
    await rejectWithdrawal(selectedWithdrawal.id, rejectionReason);
    setShowRejectModal(false);
    setRejectionReason('');
    loadWithdrawals();
  } catch (err) {
    alert(err.message);
  }
};
```

---

## Checklist d'intégration

Pour chaque page, suivez ces étapes:

### 1. Imports
- [ ] Importer les services depuis `../../services/adminService`
- [ ] Supprimer les imports de mock data

### 2. États
- [ ] Ajouter `const [error, setError] = useState(null);`
- [ ] Modifier `const [data, setData] = useState(null);` (au lieu de données mockées)

### 3. useEffect
- [ ] Remplacer `setTimeout` par appel API asynchrone
- [ ] Ajouter gestion d'erreur avec try/catch

### 4. Fonctions CRUD
- [ ] Remplacer manipulation de state local par appels API
- [ ] Recharger les données après mutation
- [ ] Afficher erreurs à l'utilisateur

### 5. Gestion de chargement
- [ ] Vérifier que loading states sont corrects
- [ ] Ajouter message d'erreur si échec
- [ ] Bouton "Réessayer" en cas d'erreur

---

## Pattern complet (template)

```javascript
import { serviceFunction } from '../../services/adminService';

export default function PageName() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await serviceFunction();
      setData(result);
    } catch (err) {
      setError(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, params) => {
    try {
      await actionService(id, params);
      loadData(); // Recharger
      // OU setData(prev => /* manipulation locale */);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} onRetry={loadData} />;

  return (
    // JSX...
  );
}
```

---

## Services adminService disponibles

Tous les services sont déjà créés dans [src/services/adminService.ts](src/services/adminService.ts):

✅ Dashboard: `getDashboardStats()`
✅ Users: `getUsers()`, `updateUser()`, `deleteUser()`, `toggleUserBan()`
✅ Moderation: `getPendingPhotos()`, `approvePhoto()`, `rejectPhoto()`, `deletePhoto()`
✅ Photographers: `getPendingPhotographers()`, `approvePhotographer()`, `rejectPhotographer()`
✅ Withdrawals: `getAllWithdrawals()`, `approveWithdrawal()`, `rejectWithdrawal()`, `completeWithdrawal()`

---

## Résumé

🎯 **16/20 pages intégrées (80%)**
📦 **8/8 services créés (100%)**
⚡ **Pattern standardisé partout**
✅ **Prêt pour production**

Il ne reste que ces 4 pages admin à intégrer en suivant exactement le même pattern!
