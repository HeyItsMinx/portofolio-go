import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import GalleryUpload from '@/components/editor/GalleryUpload';

const TYPES = ['Work', 'Organization', 'Activity', 'Education', 'Certification'];
const PHOTO_FOCUSED_TYPES = ['Organization', 'Activity'];

export default function MilestoneForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const existing = location.state?.milestone;

  const [form, setForm] = useState({
    title: '', organization: '', milestone_type: 'Work',
    description: '', date_label: '', gallery_images: [], sort_order: 0
  });

  useEffect(() => {
    if (existing) setForm({ ...existing, gallery_images: existing.gallery_images || [] });
  }, [existing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, sort_order: parseInt(form.sort_order, 10) };

    const call = existing
      ? api.updateMilestone(existing.id, payload, navigate)
      : api.createMilestone(payload, navigate);

    call.then(() => navigate('/admin/milestones')).catch(err => console.error("Submit error:", err));
  };

  const inputStyles = "bg-black border-2 border-neutral-800 text-white p-3 w-full focus:outline-none focus:border-[var(--blood)] transition-colors duration-150";
  const isPhotoFocused = PHOTO_FOCUSED_TYPES.includes(form.milestone_type);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-white uppercase font-black text-2xl tracking-wide">
          {existing ? 'Update Milestone' : 'New Milestone'}
        </h2>
        <Link to="/admin/milestones" className="text-gray-400 hover:text-white uppercase font-bold text-sm tracking-widest border-2 border-neutral-800 px-4 py-2 hover:border-[var(--blood)] transition-colors duration-150">
          Abort
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
        <div className="flex gap-4">
          <input name="title" placeholder="Title (e.g. Backend Engineer)" value={form.title} onChange={handleChange} className={inputStyles} required />
          <input name="organization" placeholder="Organization / Company (optional)" value={form.organization} onChange={handleChange} className={inputStyles} />
        </div>

        <div className="flex gap-4">
          <select name="milestone_type" value={form.milestone_type} onChange={handleChange} className={inputStyles}>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input name="date_label" placeholder="Date Label (e.g. 2023 — Present)" value={form.date_label} onChange={handleChange} className={inputStyles} />
        </div>

        <textarea
          name="description"
          placeholder={isPhotoFocused ? "Short caption (optional)" : "What did you actually do here?"}
          value={form.description}
          onChange={handleChange}
          className={`${inputStyles} min-h-[120px]`}
        />

        {isPhotoFocused && (
          <GalleryUpload
            images={form.gallery_images}
            onChange={(images) => setForm(prev => ({ ...prev, gallery_images: images }))}
          />
        )}

        <label className="flex items-center gap-2 text-gray-400 uppercase text-xs tracking-widest">
          Sort Order
          <input name="sort_order" type="number" value={form.sort_order} onChange={handleChange} className={`${inputStyles} w-20`} />
        </label>

        <button type="submit" className="bg-white text-black font-bold uppercase p-4 mt-2 hover:bg-[var(--blood)] hover:text-white transition-colors duration-150 tracking-widest text-lg">
          {existing ? 'Save Changes' : 'Add Milestone'}
        </button>
      </form>
    </div>
  );
}