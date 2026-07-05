const TECH = ['Go 1.26', 'PostgreSQL', 'React + Vite', 'Laravel', 'Jetpack Compose', 'Docker', 'Godot'];

export default function TechMarquee() {
  const looped = [...TECH, ...TECH];

  return (
    <section className="relative overflow-hidden bg-black border-y-2 border-neutral-800 py-8">
      <div className="flex gap-4 w-max animate-[tech-scroll_28s_linear_infinite]">
        {looped.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="shrink-0 uppercase text-sm font-bold tracking-widest text-white bg-black border border-neutral-700 px-6 py-3 hover:border-[var(--blood)] hover:text-[var(--blood)] transition-colors duration-100"
            style={{ clipPath: 'polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px)' }}
          >
            {item}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent" />
    </section>
  );
}