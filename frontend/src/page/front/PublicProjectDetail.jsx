import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Briefcase, LayoutGrid, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../../lib/api';
import ImageModal from '@/components/media/ImageModal';
import NarrativeTimeline from '@/components/detail/NarrativeTimeline';
import GallerySection from '@/components/detail/GallerySection';

export default function PublicProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [coverModalOpen, setCoverModalOpen] = useState(false);

  const imgBase = import.meta.env.VITE_API_URL.replace('/api', '');

  useEffect(() => {
    api.GetProjectBySlug(slug)
      .then(res => {
        if (res.status === 404) { setNotFound(true); return null; }
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => data && setProject(data))
      .catch(err => console.error("Fetch error:", err));
  }, [slug]);

  useEffect(() => {
    if (project) {
      document.title = `Samuel R | ${project.title}`;
    } else if (notFound) {
      document.title = "Samuel R | Project Not Found";
    } else {
      document.title = "Samuel R | Loading Project..."; 
    }
  }, [project, notFound]);

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-gray-500 uppercase tracking-widest">Project not found.</p>
      </div>
    );
  }

  if (!project) return null;

  const coverSrc = project.cover_image_url ? `${imgBase}${project.cover_image_url}` : null;

  const facts = [
    { label: 'Client', value: project.client_label, icon: Briefcase },
    { label: 'Category', value: project.category, icon: LayoutGrid },
    { label: 'Stack', value: `${project.tech_stack?.length || 0} Technologies`, icon: Code2 },
  ].filter(f => f.value);

  return (
    <div className="min-h-screen bg-black text-white">
      {coverSrc && (
        <div className="relative h-[50vh] min-h-[360px] overflow-hidden">
          <img
            src={coverSrc}
            onClick={() => setCoverModalOpen(true)}
            alt={project.title}
            className="w-full h-full object-cover cursor-zoom-in"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div
            className="absolute bottom-0 left-0 right-0 h-16 bg-black"
            style={{ clipPath: 'polygon(0 100%, 100% 40%, 100% 100%)' }}
          />
          <ImageModal src={coverSrc} alt={project.title} open={coverModalOpen} onOpenChange={setCoverModalOpen} />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-8 -mt-4 relative z-10">
        <Link to="/project" className="text-gray-400 hover:text-white uppercase text-sm tracking-widest">
          &larr; Back to Archive
        </Link>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mt-6 mb-8">
          <span className="category-tag">{project.category}</span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wide mt-3">{project.title}</h1>
          {project.client_label && <p className="client-label mt-2">{project.client_label}</p>}
        </motion.div>

        {facts.length > 0 && (
          <div className="grid grid-cols-3 gap-4 border-y-2 border-neutral-800 py-6 mb-12">
            {facts.map(f => (
              <div key={f.label} className="flex items-start gap-3">
                <f.icon size={18} className="text-[var(--blood)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-neutral-600 uppercase text-[10px] tracking-widest mb-1">{f.label}</p>
                  <p className="text-white font-bold text-sm md:text-base">{f.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-xl text-gray-300 leading-relaxed mb-12">{project.summary}</p>

        {project.description && (
          <div
            className="prose prose-invert max-w-none mb-16 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: project.description }}
          />
        )}

        <NarrativeTimeline
          steps={[
            { label: 'The Problem', text: project.problem },
            { label: 'My Role', text: project.my_role },
            { label: 'The Key Decision', text: project.key_decision },
            { label: 'The Outcome', text: project.outcome },
          ]}
        />

        <GallerySection images={project.gallery_images} imgBase={imgBase} />

        <div className="tech-pills mt-16 mb-16">
          {project.tech_stack?.map(t => <span key={t} className="pill">{t}</span>)}
        </div>
      </div>
    </div>
  );
}