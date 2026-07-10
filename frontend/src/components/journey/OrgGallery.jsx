import { useState } from 'react';
import { motion } from 'framer-motion';
import ImageModal from '../media/ImageModal';

export default function OrgGallery({ milestones, imgBase }) {
  const [modal, setModal] = useState(null);

  if (milestones.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-8 py-16">
      <p className="text-[var(--blood)] uppercase tracking-[0.3em] text-xs font-bold mb-8">Organization</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {milestones.map((m, i) => {
          const images = (m.gallery_images || []).map(url => `${imgBase}${url}`);
          const cover = images[0];

          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="relative bg-neutral-950 border-2 border-neutral-800 hover:border-[var(--blood)] transition-colors duration-150 overflow-hidden"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 92%, 92% 100%, 0 100%)' }}
            >
              {cover && (
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={cover}
                    alt={m.title}
                    onClick={() => setModal({ images, index: 0 })}
                    className="w-full h-full object-cover cursor-zoom-in"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-black text-xl">{m.title}</h3>
                  <span className="text-neutral-500 text-xs uppercase tracking-widest shrink-0 ml-3">{m.date_label}</span>
                </div>
                {m.organization && <p className="text-[var(--blood)] text-sm uppercase tracking-wide mb-3">{m.organization}</p>}
                {m.description && <p className="text-gray-400 text-sm leading-relaxed mb-4">{m.description}</p>}

                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.slice(1, 5).map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt=""
                        onClick={() => setModal({ images, index: idx + 1 })}
                        className="w-full aspect-square object-cover border border-neutral-800 hover:border-[var(--blood)] transition-colors duration-150 cursor-zoom-in"
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {modal && (
        <ImageModal
          images={modal.images}
          currentIndex={modal.index}
          open={true}
          onOpenChange={(open) => !open && setModal(null)}
          onNavigate={(i) => setModal(prev => ({ ...prev, index: i }))}
        />
      )}
    </section>
  );
}