import { Plus, X } from 'lucide-react';

const TYPES = ['demo', 'repo', 'other'];

export default function LinksEditor({ links, onChange }) {
  const addRow = () => {
    onChange([...links, { id: `l-${Date.now()}`, label: '', url: '', type: 'demo' }]);
  };

  const updateRow = (id, field, val) => {
    onChange(links.map(l => l.id === id ? { ...l, [field]: val } : l));
  };

  const removeRow = (id) => {
    onChange(links.filter(l => l.id !== id));
  };

  const inputStyles = "bg-black border-2 border-neutral-800 text-white p-2 text-sm focus:outline-none focus:border-[var(--blood)] transition-colors duration-150";

  return (
    <div>
      <label className="block text-gray-400 uppercase text-xs tracking-widest mb-2">
        Live Links (optional)
      </label>
      <div className="flex flex-col gap-2">
        {links.map((l) => (
          <div key={l.id} className="flex gap-2 items-center">
            <input
              placeholder="Label (e.g. ERP Demo)"
              value={l.label}
              onChange={(e) => updateRow(l.id, 'label', e.target.value)}
              className={`${inputStyles} w-40 shrink-0`}
            />
            <input
              placeholder="https://..."
              value={l.url}
              onChange={(e) => updateRow(l.id, 'url', e.target.value)}
              className={`${inputStyles} flex-1`}
            />
            <select
              value={l.type}
              onChange={(e) => updateRow(l.id, 'type', e.target.value)}
              className={`${inputStyles} w-28 shrink-0`}
            >
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button type="button" onClick={() => removeRow(l.id)} className="text-red-500 hover:text-red-400 shrink-0 p-2">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addRow}
        className="mt-3 flex items-center gap-1 text-gray-400 hover:text-white text-xs uppercase tracking-widest font-bold"
      >
        <Plus size={14} /> Add Link
      </button>
    </div>
  );
}