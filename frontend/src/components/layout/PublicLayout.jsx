import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import TerminalFooter from '../footer/TerminalFooter';
import Navbar from '../nav/Navbar';
import StatusTicker from '../ticker/StatusTicker';

export default function PublicLayout({ children }) {
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.add('public-scrollbar');
    return () => document.documentElement.classList.remove('public-scrollbar');
  }, []);

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />
      <StatusTicker />
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex-1"
      >
        {children}
      </motion.main>
      <TerminalFooter />
    </div>
  );
}