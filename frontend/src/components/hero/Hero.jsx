import { motion } from 'framer-motion';
import GlitchText from './GlitchText';

export default function Hero() {
  return (
    <section className="h-[65vh] min-h-[500px] flex flex-col justify-center max-w-7xl mx-auto px-8">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-[var(--blood)] uppercase tracking-[0.3em] text-sm font-bold mb-4"
      >
        Home / Projects
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-white text-6xl md:text-8xl font-black uppercase tracking-tight leading-none"
      >
        <GlitchText text="Project" /><br />
        <GlitchText text="Archive" />
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-gray-400 text-lg mt-6 max-w-xl"
      >
        All the project that've been conquered.
      </motion.p>
    </section>
  );
}