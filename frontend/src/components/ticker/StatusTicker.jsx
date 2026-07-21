const STATUS_LINES = [
  'STATUS: Refactoring auth middleware',
  'LAST COMMIT: Pushing to Production',
  'CURRENTLY BUILDING: Public Portofolio',
  'INFRASTRUCTURE: 100% Containerized',
  'METRIC: 23+ Enterprise Apps Delivered',
];


function TickerTrack() {
  return (
    <div className="flex gap-12 shrink-0 pr-12">
      {STATUS_LINES.map((line, i) => (
        <span key={i} className="shrink-0 font-mono text-xs text-gray-400 uppercase tracking-widest flex items-center gap-3">
          <span className="w-1.5 h-1.5 bg-[var(--blood)] inline-block animate-pulse" />
          {line}
        </span>
      ))}
    </div>
  );
}
 
export default function StatusTicker() {
  return (
    <div className="bg-black border-b-2 border-neutral-800 overflow-hidden py-2">
      <div className="flex w-max animate-[ticker-scroll_22s_linear_infinite]">
        <TickerTrack />
        <TickerTrack />
      </div>
    </div>
  );
}