export default function CategoryFilter({ categories, active, onChange }) {
  const allOptions = ['All', ...categories];

  return (
    <div className="flex flex-wrap gap-2 mb-10">
      {allOptions.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-5 py-2 uppercase text-xs font-bold tracking-widest border-2 transition-colors duration-150 ${
            active === cat
              ? 'border-[var(--blood)] text-white bg-neutral-900'
              : 'border-neutral-800 text-gray-500 hover:text-white hover:border-neutral-600'
          }`}
          style={{ clipPath: 'polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px)' }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}