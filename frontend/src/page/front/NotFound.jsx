import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import GlitchText from '@/components/hero/GlitchText';

export default function NotFound() {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    document.title = "404 | Not Found";

    const sequence = [
      'ROUTE LOOKUP FAILED...',
      'PATH DOES NOT EXIST IN REGISTRY...',
      'ERROR CODE: 404',
    ];

    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setLines(sequence.slice(0, i));
      if (i >= sequence.length) clearInterval(interval);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-8 font-mono text-center">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[var(--blood)] uppercase tracking-[0.3em] text-xs font-bold mb-6"
      >
        System / Error
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-white text-7xl md:text-9xl font-black uppercase tracking-tight leading-none mb-8"
      >
        <GlitchText text="404" />
      </motion.h1>

      <div className="w-full max-w-md text-left mb-10">
        {lines.map((line, i) => (
          <p key={i} className="text-sm mb-2">
            <span className="text-[var(--blood)]">$</span>{' '}
            <span className={i === lines.length - 1 ? 'text-[var(--blood)] font-bold' : 'text-gray-400'}>
              {line}
            </span>
          </p>
        ))}
        <span className="inline-block w-2 h-4 bg-white animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        <Link
          to="/"
          className="bg-white text-black font-black uppercase tracking-widest px-8 py-4 text-sm hover:bg-[var(--blood)] hover:text-white transition-colors duration-150"
        >
          Return Home
        </Link>
        <Link
          to="/project"
          className="border-2 border-white text-white font-black uppercase tracking-widest px-8 py-4 text-sm hover:border-[var(--blood)] hover:text-[var(--blood)] transition-colors duration-150"
        >
          View The Vault
        </Link>
      </motion.div>
    </div>
  );
}