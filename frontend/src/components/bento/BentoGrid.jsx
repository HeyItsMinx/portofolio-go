import BentoCard from './BentoCard';

export default function BentoGrid({ projects }) {
  if (projects.length === 0) {
    return (
      <p className="text-gray-500 text-center py-24 uppercase tracking-widest text-sm">
        No project found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(p => (
        <BentoCard key={p.id} project={p} featured={p.is_featured} />
      ))}
    </div>
  );
}