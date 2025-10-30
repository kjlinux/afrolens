import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download, Maximize2 } from 'lucide-react';

const Lightbox = ({
  isOpen,
  images = [],
  currentIndex = 0,
  onClose,
  onNavigate,
  showDownload = false,
  showNavigation = true,
}) => {
  const [index, setIndex] = useState(currentIndex);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const currentImage = images[index];

  // Update index when currentIndex prop changes
  useEffect(() => {
    setIndex(currentIndex);
  }, [currentIndex]);

  // Reset zoom and rotation when image changes
  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setIsZoomed(false);
  }, [index]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          handleClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
        case '_':
          handleZoomOut();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, index, zoom]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handlePrevious = useCallback(() => {
    if (images.length > 1) {
      const newIndex = index > 0 ? index - 1 : images.length - 1;
      setIndex(newIndex);
      if (onNavigate) onNavigate(newIndex);
    }
  }, [index, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (images.length > 1) {
      const newIndex = index < images.length - 1 ? index + 1 : 0;
      setIndex(newIndex);
      if (onNavigate) onNavigate(newIndex);
    }
  }, [index, images.length, onNavigate]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
    setIsZoomed(true);
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
    if (zoom <= 1) setIsZoomed(false);
  };

  const handleResetZoom = () => {
    setZoom(1);
    setIsZoomed(false);
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = () => {
    if (!currentImage) return;

    const link = document.createElement('a');
    link.href = currentImage.url || currentImage.src;
    link.download = currentImage.title || `image-${index + 1}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen || !currentImage) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black bg-opacity-95 flex items-center justify-center"
      onClick={handleClose}
    >
      {/* Header with controls */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="container mx-auto flex items-center justify-between text-white">
          {/* Image info */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold truncate">
              {currentImage.title || `Image ${index + 1}`}
            </h3>
            {currentImage.photographer && (
              <p className="text-sm text-gray-300">
                Par {currentImage.photographer}
              </p>
            )}
          </div>

          {/* Image counter */}
          {images.length > 1 && (
            <div className="hidden sm:block text-sm text-gray-300 mx-4">
              {index + 1} / {images.length}
            </div>
          )}

          {/* Close button */}
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main image container */}
      <div
        className="relative w-full h-full flex items-center justify-center p-16"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImage.url || currentImage.src}
          alt={currentImage.title || currentImage.alt || 'Image'}
          className="max-w-full max-h-full object-contain transition-transform duration-300 select-none"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            cursor: isZoomed ? 'zoom-out' : 'zoom-in',
          }}
          onClick={isZoomed ? handleResetZoom : handleZoomIn}
          draggable={false}
        />
      </div>

      {/* Navigation buttons */}
      {showNavigation && images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
            aria-label="Image précédente"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
            aria-label="Image suivante"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Bottom toolbar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="container mx-auto flex items-center justify-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-black/50 rounded-lg p-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
              disabled={zoom <= 0.5}
              className="p-2 hover:bg-white/10 rounded disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
              aria-label="Dézoomer"
            >
              <ZoomOut className="w-5 h-5" />
            </button>

            <span className="text-white text-sm px-3 min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomIn();
              }}
              disabled={zoom >= 3}
              className="p-2 hover:bg-white/10 rounded disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
              aria-label="Zoomer"
            >
              <ZoomIn className="w-5 h-5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleResetZoom();
              }}
              className="p-2 hover:bg-white/10 rounded text-white transition-colors"
              aria-label="Réinitialiser le zoom"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Rotate button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRotate();
            }}
            className="p-2 bg-black/50 hover:bg-white/10 rounded-lg text-white transition-colors"
            aria-label="Pivoter"
          >
            <RotateCw className="w-5 h-5" />
          </button>

          {/* Download button */}
          {showDownload && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="p-2 bg-black/50 hover:bg-white/10 rounded-lg text-white transition-colors"
              aria-label="Télécharger"
            >
              <Download className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Mobile counter */}
        {images.length > 1 && (
          <div className="sm:hidden text-center text-sm text-gray-300 mt-2">
            {index + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lightbox;
