import { motion } from 'framer-motion';

export default function NarrativeTimeline({ steps }) {
  const filled = steps.filter(s => s.text);

  return (
    <div className="relative pl-10">
      <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-neutral-800" />

      {filled.map((step, i) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.35, delay: i * 0.08 }}
          className="relative mb-10 last:mb-0"
        >
          <div className="absolute -left-10 top-1 w-4 h-4 bg-[var(--blood)]" style={{ clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)' }} />
          <h2 className="text-[var(--blood)] uppercase font-black text-sm tracking-widest mb-2">{step.label}</h2>
          <p className="text-gray-300 leading-relaxed">{step.text}</p>
        </motion.div>
      ))}
    </div>
  );
}