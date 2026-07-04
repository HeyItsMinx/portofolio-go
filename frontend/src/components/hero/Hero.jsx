import { motion } from 'framer-motion';
import DotField from './DotField';
import GlitchText from './GlitchText';

export default function Hero() {
  return (
    <section className="relative h-[70vh] min-h-[500px] bg-black overflow-hidden clip-diagonal-divider">
      <DotField />
      <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-[var(--blood)] uppercase tracking-[0.3em] text-sm font-bold mb-4"
        >
          Full-Stack Engineer
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-white text-6xl md:text-8xl font-black uppercase tracking-tight leading-none"
        >
          <GlitchText text="Architecture" /><br />
          <GlitchText text="Archive" />
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-gray-400 text-lg mt-6 max-w-xl"
        >
          Case studies in systems design — the problems, the decisions, the outcomes.
        </motion.p>
      </div>
    </section>
  );
}