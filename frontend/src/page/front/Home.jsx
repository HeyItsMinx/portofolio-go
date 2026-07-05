import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DotField from '@/components/hero/DotField';
import GlitchText from '@/components/hero/GlitchText';
import Narrative from '@/components/narrative/Narrative';
import TechMarquee from '@/components/marquee/TechMarquee';

export default function Home() {
  return (
    <>
      <section className="relative h-screen min-h-[600px] bg-black overflow-hidden flex flex-col justify-center">
        <DotField />
        <div className="relative z-10 max-w-5xl mx-auto px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-[var(--blood)] uppercase tracking-[0.4em] text-sm font-bold mb-6"
          >
            Fullstack Engineer | AI Enthusiast
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-white text-6xl md:text-9xl font-black uppercase tracking-tight leading-[0.95]"
          >
            <GlitchText text="Samuel Revaldo T" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-gray-400 text-lg md:text-xl mt-8 max-w-2xl mx-auto"
          >
            Engineering enterprise architecture. Designing unapologetic interfaces.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-10"
          >
            <Link
              to="/projects"
              className="bg-[var(--blood)] text-black font-black uppercase tracking-widest px-8 py-4 text-sm hover:bg-white transition-colors duration-150"
            >
              View The Vault
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white font-black uppercase tracking-widest px-8 py-4 text-sm hover:border-[var(--blood)] hover:text-[var(--blood)] transition-colors duration-150"
            >
              Get In Touch
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-black pointer-events-none z-20" />
      </section>

      <Narrative />
      <TechMarquee />
    </>
  );
}