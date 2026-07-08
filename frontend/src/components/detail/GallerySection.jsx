import { useState } from 'react';
import ImageModal from '../media/ImageModal';

export default function GallerySection({ images, imgBase }) {
  const [modalIndex, setModalIndex] = useState(null);

  if (!images || images.length === 0) return null;

  const fullUrls = images.map(url => `${imgBase}${url}`);

  return (
    <section className="mt-16">
      <p className="text-[var(--blood)] uppercase tracking-[0.3em] text-xs font-bold mb-6">Gallery</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {fullUrls.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Gallery ${i + 1}`}
            onClick={() => setModalIndex(i)}
            className="w-full aspect-square object-cover border-2 border-neutral-800 hover:border-[var(--blood)] transition-colors duration-150 cursor-zoom-in"
          />
        ))}
      </div>

      <ImageModal
        images={fullUrls}
        currentIndex={modalIndex}
        open={modalIndex !== null}
        onOpenChange={(open) => !open && setModalIndex(null)}
        onNavigate={setModalIndex}
      />
    </section>
  );
}