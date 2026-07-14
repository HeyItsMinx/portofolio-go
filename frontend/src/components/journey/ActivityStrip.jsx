import { useState, useRef, useEffect } from 'react';
import { motion, useAnimationFrame, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion';
import ImageModal from '../media/ImageModal';

export default function ActivityStrip({ milestones, imgBase }) {
  const [modal, setModal] = useState(null);
  const scrollRef = useRef(null);
  const isInteracting = useRef(false);
  const resumeTimeout = useRef(null);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [-2000, 0, 2000], [5, 1, 5], { clamp: false });

  const baseSpeed = 24;

  useAnimationFrame((t, delta) => {
    const el = scrollRef.current;
    if (!el || isInteracting.current) return;

    const factor = velocityFactor.get();
    const moveBy = baseSpeed * factor * (delta / 1000);

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;

    let next = el.scrollLeft + moveBy;
    if (next >= maxScroll) next = 0; 
    el.scrollLeft = next;
  });

  const pause = () => {
    isInteracting.current = true;
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
  };

  const resumeAfterDelay = () => {
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => {
      isInteracting.current = false;
    }, 1200); 
  };

  useEffect(() => {
    return () => {
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    };
  }, []);

  if (milestones.length === 0) return null;

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-8 mb-8">
        <p className="text-[var(--blood)] uppercase tracking-[0.3em] text-xs font-bold">Activity</p>
      </div>

      <div
        ref={scrollRef}
        onPointerDown={pause}
        onPointerUp={resumeAfterDelay}
        onPointerLeave={resumeAfterDelay}
        onWheel={pause}
        className="flex gap-5 overflow-x-auto px-8 pb-4 snap-x snap-mandatory scrollbar-hide"
      >
        {milestones.map((m, i) => {
          const images = (m.gallery_images || []).map(url => `${imgBase}${url}`);
          const cover = images[0];

          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="relative shrink-0 w-72 snap-start bg-neutral-950 border-2 border-neutral-800 hover:border-[var(--blood)] transition-colors duration-150"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
            >
              {cover ? (
                <img
                  src={cover}
                  alt={m.title}
                  onClick={() => setModal({ images, index: 0 })}
                  className="w-full aspect-[4/5] object-cover cursor-zoom-in"
                />
              ) : (
                <div className="w-full aspect-[4/5] bg-neutral-900 flex items-center justify-center text-neutral-700 text-xs uppercase tracking-widest">
                  No Photo
                </div>
              )}

              <div className="p-4">
                <h3 className="text-white font-bold text-base mb-1">{m.title}</h3>
                {m.organization && <p className="text-[var(--blood)] text-xs uppercase tracking-wide mb-1">{m.organization}</p>}
                <p className="text-neutral-500 text-xs uppercase tracking-widest">{m.date_label}</p>
                {m.description && <p className="text-gray-400 text-xs leading-relaxed mt-2">{m.description}</p>}
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