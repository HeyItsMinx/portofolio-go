import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { api } from '../../lib/api';
import ScrambleText from '../text/ScrambleText';

const imgBase = import.meta.env.VITE_API_URL.replace('/api', '');

export default function FeaturedGrid() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.GetProjects()
      .then(data => {
        const list = data || [];
        const flagged = list.filter(p => p.is_featured);
        setFeatured(flagged.length > 0 ? flagged : list.slice(0, 3));
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  if (featured.length === 0) return null;

  return (
    <section className="bg-black py-24 px-8 border-t-2 border-neutral-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <p className="text-[var(--blood)] uppercase tracking-[0.3em] text-xs font-bold">
            <ScrambleText text="Featured Projects" />
          </p>
          <Link
            to="/project"
            className="text-gray-400 hover:text-white uppercase text-xs font-bold tracking-widest flex items-center gap-1 transition-colors duration-150"
          >
            View All <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p, i) => {
            const coverSrc = p.cover_image_url ? `${imgBase}${p.cover_image_url}` : null;

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
              >
                <Link
                  to={`/project/${p.slug}`}
                  className="group relative block aspect-video overflow-hidden border-2 border-neutral-800 hover:border-[var(--blood)] transition-colors duration-150"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)' }}
                >
                  {coverSrc ? (
                    <img
                      src={coverSrc}
                      alt={p.title}
                      loading="lazy"
                      className="w-full h-full object-cover grayscale-[35%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-950 flex items-center justify-center">
                      <span className="text-neutral-800 text-4xl font-black uppercase">
                        {p.category?.[0] || '?'}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest bg-black/80 backdrop-blur-sm text-gray-300 px-3 py-1 border border-neutral-700">
                    {p.category}
                  </span>

                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-5">
                    <p className="text-[var(--blood)] uppercase font-black text-xs tracking-widest mb-1">
                      {p.client_label}
                    </p>
                    <h3 className="text-white font-black uppercase text-lg mb-3 line-clamp-1">
                      {p.title}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-white text-xs font-bold uppercase tracking-widest border border-white px-3 py-2 w-fit hover:bg-[var(--blood)] hover:border-[var(--blood)] transition-colors duration-150">
                        View Case Study <ArrowUpRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}