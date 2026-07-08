import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import RichTextEditor from '@/components/editor/RichTextEditor';
import ImageUpload from '@/components/editor/ImageUpload';
import GalleryUpload from '@/components/editor/GalleryUpload';

const TABS = ['Overview', 'Narrative', 'Tech & Meta'];

export default function ProjectForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const existingProject = location.state?.project;
  const [activeTab, setActiveTab] = useState('Overview');

  const [form, setForm] = useState({
    slug: '', title: '', client_label: '', category: '', summary: '',
    description: '', cover_image_url: '', gallery_images: [],
    problem: '', my_role: '', key_decision: '', outcome: '',
    tech_stack: '', is_featured: false, sort_order: 0
  });

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
      ? api.UpdateProject(existingProject.id, payload, navigate)
      : api.CreateProject(payload, navigate);

    call.then(() => navigate('/admin/projects')).catch(err => console.error("Submit error:", err));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const inputStyles = "bg-black border-2 border-neutral-800 text-white p-3 w-full focus:outline-none focus:border-[var(--blood)] transition-colors duration-150";

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-white uppercase font-black text-2xl tracking-wide">
          {existingProject ? 'Update Case Study' : 'New Case Study'}
        </h2>
        <Link to="/admin/projects" className="text-gray-400 hover:text-white uppercase font-bold text-sm tracking-widest border-2 border-neutral-800 px-4 py-2 hover:border-[var(--blood)] transition-colors duration-150">
          Abort
        </Link>
      </div>

      {/* Tab bar */}
      <div className="flex border-b-2 border-neutral-800 mb-8">
        {TABS.map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 uppercase text-sm font-bold tracking-widest border-b-2 -mb-[2px] transition-colors duration-150 ${
              activeTab === tab
                ? 'border-[var(--blood)] text-white'
                : 'border-transparent text-gray-500 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl">
        {activeTab === 'Overview' && (
          <>
            <div className="flex gap-4">
              <input name="title" placeholder="Project Title" value={form.title} onChange={handleChange} className={inputStyles} required />
              <input name="slug" placeholder="URL Slug" value={form.slug} onChange={handleChange} className={inputStyles} required />
            </div>
            <div className="flex gap-4">
              <input name="client_label" placeholder="Client Label" value={form.client_label} onChange={handleChange} className={inputStyles} required />
              <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className={inputStyles} required />
            </div>
            <textarea name="summary" placeholder="Executive Summary (card teaser)" value={form.summary} onChange={handleChange} className={`${inputStyles} min-h-[100px]`} />
            <ImageUpload value={form.cover_image_url} onChange={(url) => setForm(prev => ({ ...prev, cover_image_url: url }))} />
            <GalleryUpload
              images={form.gallery_images}
              onChange={(images) => setForm(prev => ({ ...prev, gallery_images: images }))}
            />
          </>
        )}

        {activeTab === 'Narrative' && (
          <>
            <div>
              <label className="block text-gray-400 uppercase text-xs tracking-widest mb-2">Full Description</label>
              <RichTextEditor
                content={form.description}
                onChange={(html) => setForm(prev => ({ ...prev, description: html }))}
                placeholder="Write the full case study narrative..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <textarea name="problem" placeholder="The Problem" value={form.problem} onChange={handleChange} className={`${inputStyles} min-h-[100px]`} />
              <textarea name="my_role" placeholder="My Role" value={form.my_role} onChange={handleChange} className={`${inputStyles} min-h-[100px]`} />
              <textarea name="key_decision" placeholder="Key Decision" value={form.key_decision} onChange={handleChange} className={`${inputStyles} min-h-[100px]`} />
              <textarea name="outcome" placeholder="The Outcome" value={form.outcome} onChange={handleChange} className={`${inputStyles} min-h-[100px]`} />
            </div>
          </>
        )}

        {activeTab === 'Tech & Meta' && (
          <>
            <input name="tech_stack" placeholder="Tech Stack (Go, React, Redis)" value={form.tech_stack} onChange={handleChange} className={inputStyles} required />
            <div className="flex items-center gap-8">
              <label className="flex items-center gap-2 text-gray-400 uppercase text-xs tracking-widest cursor-pointer">
                <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} className="w-4 h-4 accent-[var(--blood)]" />
                Featured
              </label>
              <label className="flex items-center gap-2 text-gray-400 uppercase text-xs tracking-widest">
                Sort Order
                <input name="sort_order" type="number" value={form.sort_order} onChange={handleChange} className={`${inputStyles} w-20`} />
              </label>
            </div>
          </>
        )}

        <button type="submit" className="bg-white text-black font-bold uppercase p-4 mt-4 hover:bg-[var(--blood)] hover:text-white transition-colors duration-150 tracking-widest text-lg">
          {existingProject ? 'Save Changes' : 'Deploy Case Study'}
        </button>
      </form>
    </div>
  );
}