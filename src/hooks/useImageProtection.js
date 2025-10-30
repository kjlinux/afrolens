import { useEffect } from 'react';

/**
 * Hook personnalisé pour protéger les images contre le téléchargement
 * Bloque les raccourcis clavier, le clic droit et désactive certains outils de développement
 *
 * IMPORTANT: Cette protection n'est pas infaillible et peut être contournée par des utilisateurs techniques
 * Elle sert principalement à décourager les téléchargements non autorisés par des utilisateurs non techniques
 *
 * @param {Object} options - Options de configuration
 * @param {boolean} options.blockKeyboardShortcuts - Bloquer les raccourcis clavier (Ctrl+S, F12, etc.) - défaut: true
 * @param {boolean} options.blockRightClick - Bloquer le clic droit sur les images - défaut: true
 * @param {boolean} options.blockPrintScreen - Tenter de bloquer Print Screen (efficacité limitée) - défaut: false
 * @param {boolean} options.showAlert - Afficher une alerte lors des tentatives de capture - défaut: false
 */
export default function useImageProtection(options = {}) {
  const {
    blockKeyboardShortcuts = true,
    blockRightClick = true,
    blockPrintScreen = false,
    showAlert = false
  } = options;

  useEffect(() => {
    // Gestionnaire pour les raccourcis clavier
    const handleKeyDown = (e) => {
      if (!blockKeyboardShortcuts) return;

      // Bloquer Ctrl+S / Cmd+S (Sauvegarder)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (showAlert) {
          alert('Le téléchargement de cette image n\'est pas autorisé.');
        }
        return false;
      }

      // Bloquer F12 (Outils de développement)
      if (e.key === 'F12') {
        e.preventDefault();
        if (showAlert) {
          alert('Les outils de développement sont désactivés.');
        }
        return false;
      }

      // Bloquer Ctrl+Shift+I / Cmd+Shift+I (Inspecter)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        if (showAlert) {
          alert('Les outils de développement sont désactivés.');
        }
        return false;
      }

      // Bloquer Ctrl+Shift+C / Cmd+Shift+C (Console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }

      // Bloquer Ctrl+Shift+J / Cmd+Shift+J (Console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }

      // Bloquer Ctrl+U / Cmd+U (Voir la source)
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        return false;
      }

      // Bloquer Print Screen (efficacité limitée - fonctionne principalement sur Windows)
      if (blockPrintScreen && e.key === 'PrintScreen') {
        e.preventDefault();
        // Tenter de vider le presse-papiers
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('');
        }
        if (showAlert) {
          alert('Les captures d\'écran sont désactivées.');
        }
        return false;
      }
    };

    // Gestionnaire pour le clic droit
    const handleContextMenu = (e) => {
      if (!blockRightClick) return;

      // Bloquer le clic droit uniquement sur les images
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
        if (showAlert) {
          alert('Le clic droit sur les images est désactivé.');
        }
        return false;
      }
    };

    // Bloquer la sélection de texte sur les images
    const handleSelectStart = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    };

    // Bloquer le glisser-déposer d'images
    const handleDragStart = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    };

    // Attacher les événements
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);

    // Détection de DevTools ouverts (optionnel - peut être invasif)
    // Cette méthode n'est pas fiable à 100% mais peut décourager certains utilisateurs
    let devtoolsOpen = false;
    const detectDevTools = () => {
      const threshold = 160;
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        if (!devtoolsOpen) {
          devtoolsOpen = true;
          console.warn('Protection des images active');
        }
      } else {
        devtoolsOpen = false;
      }
    };

    // Vérifier périodiquement si DevTools est ouvert
    const devToolsInterval = setInterval(detectDevTools, 1000);

    // Nettoyage
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      clearInterval(devToolsInterval);
    };
  }, [blockKeyboardShortcuts, blockRightClick, blockPrintScreen, showAlert]);
}
