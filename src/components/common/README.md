# Composants UI Réutilisables

Ce dossier contient les composants UI communs réutilisables dans toute l'application.

## Toast Notifications

Système de notifications toast avec Context API pour afficher des messages à l'utilisateur.

### Utilisation

```jsx
import { useToast } from '../../contexts/ToastContext';

function MyComponent() {
  const { toast } = useToast();

  const handleAction = () => {
    // Success notification
    toast.success('Action effectuée avec succès !');

    // Error notification
    toast.error('Une erreur est survenue');

    // Warning notification
    toast.warning('Attention, cette action est irréversible');

    // Info notification
    toast.info('Information importante');

    // Custom duration (default: 5000ms)
    toast.success('Message rapide', 2000);
  };

  return <button onClick={handleAction}>Action</button>;
}
```

### Features
- 4 types: Success, Error, Warning, Info
- Auto-dismiss configurable
- File d'attente de notifications
- Animations smooth (slide-in/slide-out)
- Position fixe en haut à droite
- Fermeture manuelle avec bouton X
- Icônes contextuelles

---

## Pagination

Composant de pagination complet avec navigation et sélecteur d'items par page.

### Utilisation

```jsx
import Pagination from '../../components/common/Pagination';

function MyList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalItems = 250; // Total des items dans votre liste

  return (
    <div>
      {/* Votre liste d'items */}
      <YourItemsList />

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
        showItemsPerPage={true}
        itemsPerPageOptions={[10, 25, 50, 100]}
      />
    </div>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | number | 1 | Page actuelle |
| `totalItems` | number | 0 | Nombre total d'items |
| `itemsPerPage` | number | 10 | Items par page |
| `onPageChange` | function | - | Callback lors du changement de page |
| `onItemsPerPageChange` | function | - | Callback lors du changement d'items par page |
| `showItemsPerPage` | boolean | true | Afficher le sélecteur d'items par page |
| `itemsPerPageOptions` | array | [10, 25, 50, 100] | Options pour le sélecteur |

### Features
- Navigation complète (First, Previous, Next, Last)
- Numéros de pages avec ellipses intelligentes
- Sélecteur d'items par page
- Indicateur de range (Ex: "Affichage 1 à 10 sur 250")
- Responsive (indicateur simplifié sur mobile)
- Navigation clavier accessible
- Labels ARIA pour l'accessibilité

---

## Lightbox

Visionneuse d'images en plein écran avec contrôles avancés.

### Utilisation

```jsx
import { useState } from 'react';
import Lightbox from '../../components/common/Lightbox';

function MyGallery() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    {
      url: '/image1.jpg',
      title: 'Photo 1',
      photographer: 'John Doe',
      alt: 'Description'
    },
    {
      url: '/image2.jpg',
      title: 'Photo 2',
      photographer: 'Jane Smith'
    },
  ];

  const handleImageClick = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  return (
    <div>
      {/* Votre galerie */}
      {images.map((img, index) => (
        <img
          key={index}
          src={img.url}
          onClick={() => handleImageClick(index)}
        />
      ))}

      <Lightbox
        isOpen={isOpen}
        images={images}
        currentIndex={currentIndex}
        onClose={() => setIsOpen(false)}
        onNavigate={setCurrentIndex}
        showDownload={true}
        showNavigation={true}
      />
    </div>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | boolean | - | Contrôle l'ouverture du lightbox |
| `images` | array | [] | Tableau d'objets image |
| `currentIndex` | number | 0 | Index de l'image actuelle |
| `onClose` | function | - | Callback lors de la fermeture |
| `onNavigate` | function | - | Callback lors de la navigation |
| `showDownload` | boolean | false | Afficher le bouton téléchargement |
| `showNavigation` | boolean | true | Afficher les boutons de navigation |

### Format des images

```javascript
{
  url: string,        // URL de l'image (requis)
  src: string,        // Alternative à url
  title: string,      // Titre de l'image (optionnel)
  photographer: string, // Nom du photographe (optionnel)
  alt: string         // Texte alternatif (optionnel)
}
```

### Features
- Vue plein écran avec overlay sombre
- Navigation entre images (prev/next)
- Contrôles de zoom (0.5x à 3x)
- Rotation à 90°
- Bouton téléchargement optionnel
- Navigation clavier:
  - `ESC`: Fermer
  - `←` / `→`: Navigation
  - `+` / `-`: Zoom
- Gestes tactiles (mobile ready)
- Compteur d'images
- Header avec infos (titre, photographe)
- Toolbar avec contrôles
- Empêche le scroll du body
- Animations smooth

---

## Notes de développement

### Installation requise
Ces composants utilisent `lucide-react` pour les icônes. Assurez-vous qu'il est installé:

```bash
pnpm add lucide-react
```

### Intégration
Le `ToastProvider` doit être ajouté au niveau racine de l'application dans `App.jsx`:

```jsx
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/common/Toast';

function App() {
  return (
    <ToastProvider>
      <ToastContainer />
      {/* Reste de l'application */}
    </ToastProvider>
  );
}
```

### Accessibilité
Tous les composants suivent les bonnes pratiques d'accessibilité:
- Labels ARIA appropriés
- Navigation clavier
- Focus management
- Rôles sémantiques
- Contrastes de couleurs conformes WCAG AA

### Responsive
Tous les composants sont optimisés pour mobile, tablet et desktop avec des breakpoints Tailwind standard.
