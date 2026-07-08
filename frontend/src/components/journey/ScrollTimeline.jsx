import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

const TYPE_COLORS = {
  work: 'var(--blood)',
  education: '#ffffff',
  project: 'var(--blood)',
  certification: '#ffffff',
  activity: 'var(--blood)',
};

function TimelineNode({ milestone, index }) {
  const isEven = index % 2 === 0;
  const color = TYPE_COLORS[milestone.milestone_type] || 'var(--blood)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.4 }}
      className={`relative flex ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center mb-16`}
    >
      <div
        className="absolute left-[19px] md:left-1/2 md:-translate-x-1/2 w-4 h-4 z-10"
        style={{ background: color, clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)' }}
      />

      <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
        <div
          className="inline-block bg-neutral-950 border-2 border-neutral-800 hover:border-[var(--blood)] transition-colors duration-150 p-6 text-left max-w-md"
          style={{ clipPath: isEven
            ? 'polygon(0 0, 100% 0, 100% 90%, 92% 100%, 0 100%)'
            : 'polygon(8% 0, 100% 0, 100% 100%, 0 100%, 0 10%)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 border" style={{ borderColor: color, color }}>
              {milestone.milestone_type}
            </span>
            <span className="text-neutral-500 text-xs uppercase tracking-widest">{milestone.date_label}</span>
          </div>
          <h3 className="text-white font-black text-xl mb-1">{milestone.title}</h3>
          {milestone.organization && (
            <p className="text-[var(--blood)] text-sm uppercase tracking-wide mb-3">{milestone.organization}</p>
          )}
          {milestone.description && (
            <p className="text-gray-400 text-sm leading-relaxed">{milestone.description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ScrollTimeline({ milestones }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.5'],
  });

  const lineHeight = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '100%']), {
    stiffness: 60,
    damping: 20,
  });

  if (milestones.length === 0) {
    return <p className="text-gray-500 text-center py-24 uppercase tracking-widest text-sm">No milestones yet.</p>;
  }

  return (
    <div ref={containerRef} className="relative max-w-5xl mx-auto px-8 py-8">
      <div className="absolute left-[26px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-neutral-800" />

      <motion.div
        className="absolute left-[26px] md:left-1/2 md:-translate-x-1/2 top-0 w-[2px] bg-[var(--blood)] origin-top"
        style={{
          height: lineHeight,
          boxShadow: '0 0 12px 2px rgba(255,0,0,0.6)',
        }}
      />

      {milestones.map((m, i) => (
        <TimelineNode key={m.id} milestone={m} index={i} />
      ))}
    </div>
  );
}