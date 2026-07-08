import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageModal({ src, alt, images, currentIndex, open, onOpenChange, onNavigate }) {
  const isGallery = Array.isArray(images);
  const activeSrc = isGallery ? images[currentIndex] : src;
  const hasMultiple = isGallery && images.length > 1;

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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => onOpenChange(false)}
          className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-6"
        >
          <motion.div
            key={activeSrc}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-[95vw] max-h-[95vh] border-2 border-[var(--blood)]"
          >
            <button
              onClick={() => onOpenChange(false)}
              className="absolute -top-11 right-0 flex items-center gap-2 text-white hover:text-[var(--blood)] uppercase text-xs font-bold tracking-widest transition-colors duration-100"
            >
              Close <X size={16} />
            </button>

            {hasMultiple && (
              <span className="absolute -top-11 left-0 text-white text-xs uppercase tracking-widest font-mono">
                {currentIndex + 1} / {images.length}
              </span>
            )}

            <img
              src={activeSrc}
              alt={alt || `Image ${currentIndex + 1}`}
              className="block max-w-[95vw] max-h-[95vh] w-auto h-auto object-contain"
            />

            {hasMultiple && (
              <>
                <button
                  onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 border border-white text-white p-2 hover:border-[var(--blood)] hover:text-[var(--blood)] transition-colors duration-100"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => onNavigate((currentIndex + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 border border-white text-white p-2 hover:border-[var(--blood)] hover:text-[var(--blood)] transition-colors duration-100"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[var(--blood)]" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}