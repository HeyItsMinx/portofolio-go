import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import BackgroundSection from '@/components/hero/BackgroundSection';
import Hero from '@/components/hero/Hero';
import CrossMarquee from '@/components/marquee/CrossMarquee';
import BentoGrid from '@/components/bento/BentoGrid';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.GetProjects()
      .then(data => setProjects(data || []))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    document.title = "Samuel R | Project";
  }, []);

  return (
    <>
      <BackgroundSection>
        <Hero />
        <CrossMarquee
          lineA="Systems That Scale — Decisions That Hold —"
          lineB="Built To Last — Engineered With Intent —"
        />
      </BackgroundSection>

      <div id="vault" className="p-8 bg-black">
        <main className="max-w-7xl mx-auto">
          <BentoGrid projects={projects} />
        </main>
      </div>
    </>
  );
}