import { Link, useLocation, useNavigate } from 'react-router-dom';

const MODULES = [
  { label: 'Dashboard', to: '/admin', end: true },
  { label: 'Projects', to: '/admin/projects', end: false },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (mod) =>
    mod.end ? location.pathname === mod.to : location.pathname.startsWith(mod.to);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className="w-64 shrink-0 bg-neutral-950 border-r-2 border-neutral-800 flex flex-col min-h-screen">
      <div className="p-6 border-b-2 border-neutral-800">
        <span className="text-white font-black uppercase tracking-widest text-lg">
          <span className="text-[var(--blood)]">/</span>Control
        </span>
      </div>

      <nav className="flex-1 py-6">
        {MODULES.map((mod) => (
          <Link
            key={mod.to}
            to={mod.to}
            className={`block px-6 py-3 uppercase text-sm font-bold tracking-widest border-l-4 transition-colors duration-150 ${
              isActive(mod)
                ? 'border-[var(--blood)] text-white bg-neutral-900'
                : 'border-transparent text-gray-500 hover:text-white hover:border-neutral-700'
            }`}
          >
            {mod.label}
          </Link>
        ))}

        <div className="px-6 py-3 mt-4 text-xs uppercase tracking-widest text-neutral-700 border-l-4 border-transparent">
          Coming Soon —
        </div>
      </nav>

      <div className="p-6 border-t-2 border-neutral-800">
        <button
          onClick={handleLogout}
          className="w-full text-red-500 border border-red-500 py-2 text-xs font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors duration-150"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}