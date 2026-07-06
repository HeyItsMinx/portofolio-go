import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { api } from '../../lib/api';

export default function ProjectForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const existingProject = location.state?.project;

  const [form, setForm] = useState({
    slug: '', title: '', client_label: '', category: '', summary: '',
    problem: '', my_role: '', key_decision: '', outcome: '', 
    tech_stack: '', is_featured: false, sort_order: 0
  });

  // Pre-fill form
  useEffect(() => {
    if (existingProject) {
      setForm({
        ...existingProject,
        tech_stack: existingProject.tech_stack ? existingProject.tech_stack.join(', ') : ''
      });
    }
  }, [existingProject]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      sort_order: parseInt(form.sort_order, 10),
      tech_stack: form.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
      metrics: {},
      architecture: {}
    };

    const call = existingProject
      ? api.updateProject(existingProject.id, payload, navigate)
      : api.createProject(payload, navigate);

    call
      .then(() => navigate('/admin/projects'))
      .catch(err => console.error("Submit error:", err));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const inputStyles = "bg-black border border-neutral-800 text-white p-3 w-full focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors";

  return (
    <div className="min-h-screen p-8 bg-[radial-gradient(circle_at_top_right,_#1a0000,_#000)] text-white flex justify-center items-center">
      <section className="bg-neutral-950 border-2 border-neutral-900 p-8 -skew-x-[2deg] relative group max-w-4xl w-full">
        <div className="absolute -top-0.5 -left-0.5 w-8 h-8 border-t-4 border-l-4 border-red-600"></div>
        
        <div className="flex justify-between items-center mb-8 skew-x-[2deg]">
          <h2 className="text-red-600 uppercase font-black text-2xl m-0 tracking-wide">
            {existingProject ? 'Update Architecture Target' : 'Inject New Case Study'}
          </h2>
          <Link to="/admin/projects" className="text-gray-400 hover:text-white uppercase font-bold text-sm tracking-widest border border-neutral-700 px-4 py-2 hover:border-red-600 transition-colors">
            Abort
          </Link>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 skew-x-[2deg]">
          <div className="flex gap-4">
            <input name="title" placeholder="Project Title" value={form.title} onChange={handleChange} className={inputStyles} required />
            <input name="slug" placeholder="URL Slug" value={form.slug} onChange={handleChange} className={inputStyles} required />
          </div>
          
          <div className="flex gap-4">
            <input name="client_label" placeholder="Client Label" value={form.client_label} onChange={handleChange} className={inputStyles} required />
            <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className={inputStyles} required />
          </div>

          <textarea name="summary" placeholder="Executive Summary" value={form.summary} onChange={handleChange} className={`${inputStyles} min-h-[100px]`} required />
          
          <div className="grid grid-cols-2 gap-4">
            <textarea name="problem" placeholder="The Problem" value={form.problem} onChange={handleChange} className={`${inputStyles} min-h-[100px]`} required />
            <textarea name="my_role" placeholder="My Role" value={form.my_role} onChange={handleChange} className={`${inputStyles} min-h-[100px]`} required />
            <textarea name="key_decision" placeholder="Key Decision" value={form.key_decision} onChange={handleChange} className={`${inputStyles} min-h-[100px]`} required />
            <textarea name="outcome" placeholder="The Outcome" value={form.outcome} onChange={handleChange} className={`${inputStyles} min-h-[100px]`} required />
          </div>

          <input name="tech_stack" placeholder="Tech Stack (Go, React, Redis)" value={form.tech_stack} onChange={handleChange} className={inputStyles} required />
          
          <button type="submit" className="bg-white text-black font-bold uppercase p-4 mt-6 -skew-x-6 hover:bg-red-600 hover:text-white transition-colors duration-200 tracking-widest text-lg">
            {existingProject ? 'Execute Overwrite' : 'Deploy Case Study'}
          </button>
        </form>
      </section>
    </div>
  );
}