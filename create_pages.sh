#!/bin/bash

# Script pour créer toutes les pages nécessaires

# Pages utilisateur
cat > src/pages/Search.jsx << 'EOF'
export default function Search() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Recherche de photos</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-4">Filtres</h2>
          {/* Filtres à implémenter */}
        </div>
        <div className="md:col-span-3">
          <p className="text-gray-600">Résultats de recherche - À implémenter</p>
        </div>
      </div>
    </div>
  );
}
EOF

cat > src/pages/PhotoDetail.jsx << 'EOF'
import { useParams } from 'react-router-dom';
export default function PhotoDetail() {
  const { id } = useParams();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Détail Photo {id}</h1>
      <p className="text-gray-600">Page détail - À implémenter</p>
    </div>
  );
}
EOF

# Pages user
mkdir -p src/pages/user

cat > src/pages/user/Profile.jsx << 'EOF'
import { useAuth } from '../../context/AuthContext';
export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p>Bienvenue {user?.first_name} {user?.last_name}</p>
      </div>
    </div>
  );
}
EOF

cat > src/pages/user/Cart.jsx << 'EOF'
import { useCart } from '../../context/CartContext';
export default function Cart() {
  const { cart, getTotal } = useCart();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mon Panier ({cart.length})</h1>
      <p>Total: {getTotal()}FCFA</p>
    </div>
  );
}
EOF

cat > src/pages/user/Checkout.jsx << 'EOF'
export default function Checkout() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Paiement</h1>
      <p className="text-gray-600">Processus de paiement - À implémenter</p>
    </div>
  );
}
EOF

cat > src/pages/user/Orders.jsx << 'EOF'
export default function Orders() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mes Commandes</h1>
    </div>
  );
}
EOF

cat > src/pages/user/Favorites.jsx << 'EOF'
export default function Favorites() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mes Favoris</h1>
    </div>
  );
}
EOF

# Pages photographe
mkdir -p src/pages/photographer

cat > src/pages/photographer/Dashboard.jsx << 'EOF'
import { useAuth } from '../../context/AuthContext';
export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Photographe</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600">Total Photos</h3>
          <p className="text-3xl font-bold text-primary-600">69</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600">Total Ventes</h3>
          <p className="text-3xl font-bold text-green-600">487</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600">Revenus</h3>
          <p className="text-3xl font-bold text-blue-600">18,650FCFA</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600">Followers</h3>
          <p className="text-3xl font-bold text-purple-600">342</p>
        </div>
      </div>
    </div>
  );
}
EOF

cat > src/pages/photographer/MyPhotos.jsx << 'EOF'
export default function MyPhotos() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mes Photos</h1>
    </div>
  );
}
EOF

cat > src/pages/photographer/Upload.jsx << 'EOF'
export default function Upload() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Upload Photo</h1>
      <div className="bg-white p-8 rounded-lg shadow">
        <p>Formulaire d'upload - À implémenter</p>
      </div>
    </div>
  );
}
EOF

cat > src/pages/photographer/Revenue.jsx << 'EOF'
export default function Revenue() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mes Revenus</h1>
    </div>
  );
}
EOF

cat > src/pages/photographer/Analytics.jsx << 'EOF'
export default function Analytics() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>
    </div>
  );
}
EOF

# Pages admin
mkdir -p src/pages/admin

cat > src/pages/admin/Dashboard.jsx << 'EOF'
export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600">Utilisateurs</h3>
          <p className="text-3xl font-bold">145</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600">Photos</h3>
          <p className="text-3xl font-bold">69</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600">Revenus</h3>
          <p className="text-3xl font-bold">5,420FCFA</p>
        </div>
      </div>
    </div>
  );
}
EOF

cat > src/pages/admin/Users.jsx << 'EOF'
export default function Users() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestion Utilisateurs</h1>
    </div>
  );
}
EOF

cat > src/pages/admin/Moderation.jsx << 'EOF'
export default function Moderation() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Modération Photos</h1>
    </div>
  );
}
EOF

echo "✅ Tous les fichiers de pages ont été créés !"
