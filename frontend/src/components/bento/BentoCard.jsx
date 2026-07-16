import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SpotlightCard from '../magic/SpotlightCard';

const imgBase = import.meta.env.VITE_API_URL.replace('/api', '');

export default function BentoCard({ project, featured = false }) {
  const coverSrc = project.cover_image_url ? `${imgBase}${project.cover_image_url}` : null;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={featured ? 'md:col-span-2 md:row-span-2' : ''}
    >
      <SpotlightCard className="h-full">
        <Link
          to={`/project/${project.slug}`}
          className="group flex flex-col h-full bg-black border-2 border-neutral-800 hover:border-[var(--blood)] transition-colors duration-150 clip-corner-cut relative overflow-hidden"
        >
          {/* Cover image */}
          <div className={`relative overflow-hidden shrink-0 ${featured ? 'h-64 md:h-80' : 'h-40'}`}>
            {coverSrc ? (
              <img
                src={coverSrc}
                alt={project.title}
                loading="lazy"
                className="w-full h-full object-cover grayscale-[35%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300 ease-out"
              />
            ) : (
              <div className="w-full h-full bg-neutral-950 flex items-center justify-center">
                <span className="text-neutral-800 text-5xl font-black uppercase">
                  {project.category?.[0] || '?'}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest bg-black/80 backdrop-blur-sm text-gray-300 px-3 py-1 border border-neutral-700">
              {project.category}
            </span>
            {project.is_featured && (
              <span className="absolute top-3 right-3 text-[10px] uppercase tracking-widest bg-[var(--blood)] text-black px-3 py-1 font-black">
                Featured
              </span>
            )}
          </div>

          <div className="p-6 flex flex-col flex-1">
            <h3 className={`font-black uppercase text-white leading-tight mb-2 ${featured ? 'text-3xl' : 'text-xl'}`}>
              {project.title}
            </h3>

            <p className="text-[var(--blood)] font-bold uppercase text-xs tracking-wider mb-3">
              {project.client_label}
            </p>

            <p className="text-gray-400 text-sm leading-relaxed flex-1 line-clamp-3">
              {project.summary}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {project.tech_stack?.slice(0, featured ? 6 : 3).map(t => (
                <span
                  key={t}
                  className="text-[10px] uppercase tracking-wide bg-neutral-900 text-gray-300 px-2 py-1 border border-neutral-800 group-hover:border-red-900/50 transition-colors duration-150"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div
            className="absolute top-0 right-0 w-8 h-8 bg-[var(--blood)] opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
          />
        </Link>
      </SpotlightCard>
    </motion.div>
  );
}