import { useState, useEffect, useMemo } from 'react';
import { api } from '../../lib/api';
import BackgroundSection from '@/components/hero/BackgroundSection';
import Hero from '@/components/hero/Hero';
import CrossMarquee from '@/components/marquee/CrossMarquee';
import BentoGrid from '@/components/bento/BentoGrid';
import CategoryFilter from '@/components/bento/CategoryFilter';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    api.GetProjects()
      .then(data => {
        const sorted = [...(data || [])].sort((a, b) => {
          if (a.is_featured !== b.is_featured) {
            return a.is_featured ? -1 : 1;
          }
          return (a.sort_order ?? 0) - (b.sort_order ?? 0);
        });
        setProjects(sorted);
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    document.title = "Samuel R | Project";
  }, []);

  const categories = useMemo(
    () => [...new Set(projects.map(p => p.category).filter(Boolean))].sort(),
    [projects]
  );

  const filteredProjects = useMemo(
    () => activeCategory === 'All' ? projects : projects.filter(p => p.category === activeCategory),
    [projects, activeCategory]
  );

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
          {categories.length > 1 && (
            <CategoryFilter
              categories={categories}
              active={activeCategory}
              onChange={setActiveCategory}
            />
          )}
          <BentoGrid projects={filteredProjects} />
        </main>
      </div>
    </>
  );
}