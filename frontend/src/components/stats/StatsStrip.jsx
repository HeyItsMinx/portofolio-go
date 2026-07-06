import { motion } from 'framer-motion';

const STATS = [
  { value: '23+', label: 'Enterprise Apps Managed' },
  { value: '5', label: 'Core Languages' },
  { value: '100%', label: 'Containerized Workflow' },
  { value: '0', label: 'Rounded Corners' },
];

export default function StatsStrip() {
  return (
    <section className="bg-black border-y-2 border-neutral-800 py-12 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="text-center md:text-left"
          >
            <p className="text-[var(--blood)] text-5xl md:text-6xl font-black">{stat.value}</p>
            <p className="text-gray-400 uppercase text-xs tracking-widest mt-2">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}