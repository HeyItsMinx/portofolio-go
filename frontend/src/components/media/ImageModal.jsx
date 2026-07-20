import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageModal({ src, alt, images, currentIndex, open, onOpenChange, onNavigate }) {
  const isGallery = Array.isArray(images);
  const activeSrc = isGallery ? images[currentIndex] : src;
  const hasMultiple = isGallery && images.length > 1;

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [activeSrc]);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
      if (e.key === 'Escape') onOpenChange(false);
      if (hasMultiple && e.key === 'ArrowRight') onNavigate((currentIndex + 1) % images.length);
      if (hasMultiple && e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onOpenChange, hasMultiple, currentIndex, images, onNavigate]);

  if (!activeSrc) return null;

  const modal = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => onOpenChange(false)}
          className="fixed inset-0 z-[999] bg-black/90 flex flex-col"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between px-4 md:px-6 py-4 shrink-0"
          >
            <span className="text-white text-xs uppercase tracking-widest font-mono">
              {hasMultiple ? `${currentIndex + 1} / ${images.length}` : ''}
            </span>
            <button
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-2 text-white hover:text-[var(--blood)] uppercase text-xs font-bold tracking-widest transition-colors duration-100"
            >
              Close <X size={16} />
            </button>
          </div>

          <div className="relative flex-1 min-h-0 flex items-center justify-center gap-3 md:gap-6 px-3 md:px-8 pb-6">
            {hasMultiple && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate((currentIndex - 1 + images.length) % images.length);
                }}
                className="shrink-0 bg-black/70 border border-white text-white p-2 md:p-3 hover:border-[var(--blood)] hover:text-[var(--blood)] transition-colors duration-100"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            <motion.div
              key={activeSrc}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative min-w-[220px] min-h-[220px] flex items-center justify-center border-2 border-[var(--blood)]"
            >
              {!isLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-950 font-mono">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-6 h-6 border-2 border-neutral-700 border-t-[var(--blood)]"
                  />
                  <span className="text-[var(--blood)] text-[10px] uppercase tracking-widest animate-pulse">
                    Loading_Image...
                  </span>
                </div>
              )}

              <img
                src={activeSrc}
                alt={alt || `Image ${currentIndex + 1}`}
                onLoad={() => setIsLoaded(true)}
                className={`block max-w-[75vw] md:max-w-[70vw] max-h-[calc(100vh-8rem)] w-auto h-auto object-contain transition-opacity duration-200 ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {isLoaded && (
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[var(--blood)]" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
              )}
            </motion.div>

            {hasMultiple && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate((currentIndex + 1) % images.length);
                }}
                className="shrink-0 bg-black/70 border border-white text-white p-2 md:p-3 hover:border-[var(--blood)] hover:text-[var(--blood)] transition-colors duration-100"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}