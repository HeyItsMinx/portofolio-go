import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SpotlightCard from '../../components/magic/SpotlightCard';

export default function PublicProjectList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/project')
      .then(res => res.json())
      .then(data => setProjects(data || []))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  return (
    <div className="min-h-screen p-8 bg-[radial-gradient(circle_at_top_right,_#1a0000,_#000)] text-white">
      <header className="mb-12 max-w-7xl mx-auto">
        <div className="bg-red-600 text-black px-8 py-3 inline-block -skew-x-12 shadow-[8px_8px_0_rgba(255,255,255,0.1)]">
          <h1 className="skew-x-12 uppercase font-black tracking-widest text-2xl m-0">Case Studies</h1>
        </div>
      </header>

      <main className="flex flex-col gap-6 max-w-7xl mx-auto">
        {projects.map(p => (
          <Link key={p.id} to={`/project/${p.slug}`}>
            <SpotlightCard className="flex bg-neutral-900 -skew-x-[2deg] hover:-translate-x-2 hover:shadow-[-5px_5px_0_#e60000] transition-all duration-300 border border-neutral-800 hover:border-red-900/50">
              <div className="flex w-full">
                <div className="w-4 bg-red-600 shrink-0"></div>
                <div className="p-6 skew-x-[2deg] w-full">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold m-0 flex items-center gap-3 text-white">
                      {p.title}
                      <span className="category-tag">{p.category}</span>
                    </h3>
                  </div>
                  <p className="client-label">{p.client_label}</p>
                  <p className="text-gray-400 leading-relaxed mb-4">{p.summary}</p>
                  <div className="tech-pills">
                    {p.tech_stack?.map(t => <span key={t} className="pill">{t}</span>)}
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </Link>
        ))}
      </main>
    </div>
  );
}