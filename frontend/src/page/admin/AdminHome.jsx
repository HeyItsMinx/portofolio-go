import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

export default function AdminHome() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    api.getProjects()
      .then(data => setCount((data || []).length))
      .catch(() => setCount(0));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-white text-3xl font-black uppercase tracking-wide mb-8">
        Control Panel
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-950 border-2 border-neutral-800 p-6">
          <p className="text-gray-500 uppercase text-xs tracking-widest mb-2">Total Case Studies</p>
          <p className="text-[var(--blood)] text-5xl font-black">
            {count === null ? '—' : count}
          </p>
        </div>

        <Link
          to="/admin/projects"
          className="bg-neutral-950 border-2 border-neutral-800 hover:border-[var(--blood)] p-6 transition-colors duration-150 flex flex-col justify-between"
        >
          <p className="text-white font-black uppercase text-lg">Manage Projects</p>
          <p className="text-gray-500 text-sm mt-2">View, edit, or purge existing entries</p>
        </Link>

        <Link
          to="/admin/projects/new"
          className="bg-neutral-950 border-2 border-neutral-800 hover:border-[var(--blood)] p-6 transition-colors duration-150 flex flex-col justify-between"
        >
          <p className="text-white font-black uppercase text-lg">+ New Case Study</p>
          <p className="text-gray-500 text-sm mt-2">Inject a new entry directly</p>
        </Link>
      </div>
    </div>
  );
}