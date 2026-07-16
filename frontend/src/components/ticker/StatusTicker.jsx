const STATUS_LINES = [
  'STATUS: Refactoring auth middleware',
  'LAST COMMIT: 2h ago',
  'CURRENTLY BUILDING: Public Portofolio',
  'UPTIME: 100% containerized',
];

export default function StatusTicker() {
  const looped = [...STATUS_LINES, ...STATUS_LINES];

  return (
    <div className="bg-black border-b-2 border-neutral-800 overflow-hidden py-2">
      <div className="flex gap-12 w-max animate-[ticker-scroll_22s_linear_infinite]">
        {looped.map((line, i) => (
          <span key={i} className="shrink-0 font-mono text-xs text-gray-400 uppercase tracking-widest flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-[var(--blood)] inline-block animate-pulse" />
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}