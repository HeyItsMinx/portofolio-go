import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../../lib/api';
import ScrambleText from '../text/ScrambleText';

export default function FeaturedTeaser() {
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    api.getProjects()
      .then(data => {
        const list = data || [];
        setFeatured(list.find(p => p.is_featured) || list[0] || null);
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  if (!featured) return null;

  return (
    <section className="bg-black py-24 px-8 border-t-2 border-neutral-800">
      <div className="max-w-5xl mx-auto">
        <p className="text-[var(--blood)] uppercase tracking-[0.3em] text-xs font-bold mb-6">
          <ScrambleText text="Featured Project" />
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-black border-2 border-neutral-800 hover:border-[var(--blood)] transition-colors duration-150 p-10"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 94%, 94% 100%, 0 100%)' }}
        >
          <h2 className="text-white text-3xl md:text-5xl font-black uppercase mb-3">
            {featured.title}
          </h2>
          <p className="text-[var(--blood)] font-bold uppercase text-xs tracking-widest mb-6">
            {featured.client_label}
          </p>
          <p className="text-gray-400 leading-relaxed max-w-2xl mb-8">
            {featured.summary}
          </p>
          <Link
            to={`/project/${featured.slug}`}
            className="inline-block bg-white text-black font-black uppercase tracking-widest px-6 py-3 text-sm hover:bg-[var(--blood)] hover:text-white transition-colors duration-150"
          >
            Read the Full Study
          </Link>
        </motion.div>
      </div>
    </section>
  );
}