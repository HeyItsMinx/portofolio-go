import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LINES = [
    'INITIALIZING SYSTEM...',
    'LOADING ARCHITECTURE MODULES...',
    'VERIFYING CONTAINER INTEGRITY... OK',
    'MOUNTING CASE STUDIES...',
    'ACCESS GRANTED.',
];

export default function BootSequence({ onComplete }) {
    const [visibleLines, setVisibleLines] = useState([]);
    const [done, setDone] = useState(false);

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
        i += 1;
        setVisibleLines(LINES.slice(0, i));
        if (i >= LINES.length) {
            clearInterval(interval);
            setTimeout(() => setDone(true), 400);
        }
        }, 280);
        return () => clearInterval(interval);
    }, []);

    return (
    <AnimatePresence onExitComplete={onComplete}>
      {!done && (
        <motion.div
          exit={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-[999] bg-black flex items-center justify-center font-mono"
        >
          <div className="w-full max-w-xl px-8">
            {visibleLines.map((line, i) => (
              <p key={i} className="text-sm md:text-base mb-2">
                <span className="text-[var(--blood)]">$</span>{' '}
                <span className={i === LINES.length - 1 ? 'text-[var(--blood)] font-bold' : 'text-gray-300'}>
                  {line}
                </span>
              </p>
            ))}
            <span className="inline-block w-2 h-4 bg-white animate-pulse" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}