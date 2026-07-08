import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const links = [
  { label: 'Home', to: '/' },  
  { label: 'Journey', to: '/journey' },  
  { label: 'Vault', to: '/project' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav
      className="sticky top-0 z-50 bg-black border-b-2 border-neutral-800"
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 40px 100%, 0 calc(100% - 40px))' }}
    >
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-white font-black uppercase tracking-widest text-lg">
          <span className="text-[var(--blood)]">/ </span>Portfolio
        </Link>

        <div className="flex items-center gap-8">
          {links.map(link => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className="relative uppercase text-sm font-bold tracking-widest text-gray-400 hover:text-white transition-colors duration-150 py-2"
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-[2px] left-0 right-0 h-[3px] bg-[var(--blood)]"
                    transition={{ duration: 0.15 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}