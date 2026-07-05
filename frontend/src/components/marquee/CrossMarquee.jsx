export default function CrossMarquee({ lineA, lineB }) {
  return (
    <section className="relative h-[420px] overflow-hidden">
      <div
        className="absolute w-[160%] left-1/2 bg-[var(--blood)] py-5 shadow-[0_10px_40px_rgba(255,0,0,0.3)] z-10"
        style={{ top: '35%', transform: 'translateX(-50%) rotate(-7deg)' }}
      >
        <MarqueeRow text={lineA} baseVelocity={2} textColor="text-black" />
      </div>

      <div
        className="absolute w-[160%] left-1/2 bg-black border-y-2 border-white py-5 shadow-[0_10px_40px_rgba(0,0,0,0.6)] z-20"
        style={{ top: '58%', transform: 'translateX(-50%) rotate(7deg)' }}
      >
        <MarqueeRow text={lineB} baseVelocity={-2} textColor="text-white" />
      </div>
    </section>
  );
}

import MarqueeRow from './MarqueeRow';