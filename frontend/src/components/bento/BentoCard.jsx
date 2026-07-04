import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BentoCard({ project, featured = false }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={featured ? 'md:col-span-2 md:row-span-2' : ''}
    >
      <Link
        to={`/project/${project.slug}`}
        className="group block h-full bg-black border-2 border-neutral-800 hover:border-[var(--blood)] transition-colors duration-150 clip-corner-cut relative overflow-hidden"
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs uppercase tracking-widest bg-neutral-900 text-gray-400 px-3 py-1 border border-neutral-700">
              {project.category}
            </span>
          </div>

          <h3 className={`font-black uppercase text-white leading-tight mb-2 ${featured ? 'text-3xl' : 'text-xl'}`}>
            {project.title}
          </h3>

          <p className="text-[var(--blood)] font-bold uppercase text-xs tracking-wider mb-4">
            {project.client_label}
          </p>

          <p className="text-gray-400 text-sm leading-relaxed flex-1">
            {project.summary}
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {project.tech_stack?.slice(0, featured ? 6 : 3).map(t => (
              <span key={t} className="text-[10px] uppercase tracking-wide bg-neutral-900 text-gray-300 px-2 py-1 border border-neutral-800 group-hover:border-red-900/50 transition-colors duration-150">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="absolute top-0 right-0 w-8 h-8 bg-[var(--blood)] opacity-0 group-hover:opacity-100 transition-opacity duration-150" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
      </Link>
    </motion.div>
  );
}