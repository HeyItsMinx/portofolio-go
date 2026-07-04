import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import Hero from '../../components/hero/Hero';
import BentoGrid from '../../components/bento/BentoGrid';

export default function PublicProjectList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.getProjects()
      .then(data => setProjects(data || []))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  return (
    <>
      <Hero />
      <div className="p-8">
        <main className="max-w-7xl mx-auto">
          <BentoGrid projects={projects} />
        </main>
      </div>
    </>
  );
}