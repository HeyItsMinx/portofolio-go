import { Plus, X } from 'lucide-react';

export default function MetricsEditor({ metrics, onChange }) {
  const addRow = () => {
    onChange([...metrics, { id: `m-${Date.now()}`, label: '', value: '' }]);
  };

  const updateRow = (id, field, val) => {
    onChange(metrics.map(m => m.id === id ? { ...m, [field]: val } : m));
  };

  const removeRow = (id) => {
    onChange(metrics.filter(m => m.id !== id));
  };

  const inputStyles = "bg-black border-2 border-neutral-800 text-white p-2 w-full text-sm focus:outline-none focus:border-[var(--blood)] transition-colors duration-150";

  return (
    <div>
      <label className="block text-gray-400 uppercase text-xs tracking-widest mb-2">
        Impact Metrics (optional)
      </label>
      <div className="flex flex-col gap-2">
        {metrics.map((m) => (
          <div key={m.id} className="flex gap-2 items-center">
            <input
              placeholder="Label (e.g. Report Turnaround)"
              value={m.label}
              onChange={(e) => updateRow(m.id, 'label', e.target.value)}
              className={inputStyles}
            />
            <input
              placeholder="Value (e.g. 3 days -> 4 hours)"
              value={m.value}
              onChange={(e) => updateRow(m.id, 'value', e.target.value)}
              className={inputStyles}
            />
            <button type="button" onClick={() => removeRow(m.id)} className="text-red-500 hover:text-red-400 shrink-0 p-2">
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
        <Plus size={14} /> Add Metric
      </button>
    </div>
  );
}