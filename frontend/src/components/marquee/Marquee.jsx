export default function Marquee({ items, speed = 30 }) {
    const looped = [...items, ...items];

    return (
    <div className="relative overflow-hidden bg-black border-y-2 border-neutral-800 py-6">
      <div
        className="flex gap-4 w-max"
        style={{
          animation: `marquee-scroll ${speed}s linear infinite`,
        }}
      >
        {looped.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="shrink-0 uppercase text-sm font-bold tracking-widest text-white bg-black border border-neutral-700 px-5 py-2 hover:border-[var(--blood)] hover:text-[var(--blood)] transition-colors duration-150"
            style={{ clipPath: 'polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px)' }}
          >
            {item}
          </span>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent" />
    </div>
  );
}