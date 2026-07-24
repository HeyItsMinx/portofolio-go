import { useEffect } from 'react';
import TerminalFooter from '../footer/TerminalFooter';
import Navbar from '../nav/Navbar';
import StatusTicker from '../ticker/StatusTicker';

export default function PublicLayout({ children }) {
  useEffect(() => {
    document.documentElement.classList.add('public-scrollbar');
    return () => document.documentElement.classList.remove('public-scrollbar');
  }, []);

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />
      <StatusTicker />
      <main className="flex-1">{children}</main>
      <TerminalFooter />
    </div>
  );
}