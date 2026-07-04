import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function PublicProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8080/api/project/slug/${slug}`)
      .then(res => {
        if (res.status === 404) { setNotFound(true); return null; }
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => data && setProject(data))
      .catch(err => console.error("Fetch error:", err));
  }, [slug]);

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-gray-500 uppercase tracking-widest">Case study not found.</p>
      </div>
    );
  }

  if (!project) return null; // or a loading state

  return (
    <div className="min-h-screen p-8 bg-[radial-gradient(circle_at_top_right,_#1a0000,_#000)] text-white">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-gray-400 hover:text-white uppercase text-sm tracking-widest">&larr; Back to Archive</Link>

        <div className="mt-6 mb-10">
          <h1 className="text-4xl font-black uppercase tracking-wide">{project.title}</h1>
          <p className="client-label">{project.client_label}</p>
          <span className="category-tag">{project.category}</span>
        </div>

        <p className="text-xl text-gray-300 leading-relaxed mb-10">{project.summary}</p>

        {[
          ['The Problem', project.problem],
          ['My Role', project.my_role],
          ['The Key Decision', project.key_decision],
          ['The Outcome', project.outcome],
        ].map(([label, text]) => (
          <section key={label} className="mb-8 border-l-4 border-red-600 pl-6">
            <h2 className="text-red-600 uppercase font-black text-sm tracking-widest mb-2">{label}</h2>
            <p className="text-gray-300 leading-relaxed">{text}</p>
          </section>
        ))}

        <div className="tech-pills mt-10">
          {project.tech_stack?.map(t => <span key={t} className="pill">{t}</span>)}
        </div>
      </div>
    </div>
  );
}