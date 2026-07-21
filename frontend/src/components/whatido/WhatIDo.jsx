import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlitchText from '../hero/GlitchText';

const PROCESSES = [
  {
    id: '01',
    pid: '4471',
    name: 'sys_architecture',
    title: 'Complex Business Logic',
    segments: [
      { text: 'Engineering automated workflows, dynamic calculation engines, and multi-tenant database schemas. Building the structural backbone required to run ' },
      { text: 'enterprise-scale operations', hl: true },
      { text: ' behind the scenes flawlessly.' },
    ],
  },
  {
    id: '02',
    pid: '5518',
    name: 'dynamic_render',
    title: 'High Density Interfaces',
    segments: [
      { text: 'Managing massive client-side state for extensive product catalogs and dense financial dashboards. Transforming heavy data into ' },
      { text: 'kinetic, zero-lag environments', hl: true },
      { text: ' that prioritize speed and deliberate design.' },
    ],
  },
  {
    id: '03',
    pid: '6032',
    name: 'system_integration',
    title: 'Seamless Integrations',
    segments: [
      { text: 'Bridging isolated platforms into unified ecosystems. Expertise in hooking web platforms into third-party communication APIs, syncing real-time data streams, and building ' },
      { text: 'direct-to-consumer pipelines', hl: true },
      { text: ' from the ground up.' },
    ],
  },
];

export default function WhatIDo() {
  const [active, setActive] = useState(0);
  const interactedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (interactedRef.current) return;
      setActive((prev) => (prev + 1) % PROCESSES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (i) => {
    interactedRef.current = true;
    setActive(i);
  };

  const current = PROCESSES[active];

  return (
    <section className="bg-black py-24 px-8 border-t-2 border-neutral-800">
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-sm text-gray-500 mb-4">
          <span className="text-[var(--blood)]">$</span> cat capabilities.log
        </p>
        <h2 className="text-white text-4xl md:text-6xl font-black uppercase tracking-tight mb-12">
          <GlitchText text="What I Actually Do" />
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] border-2 border-neutral-800">
          {/* Process list rail */}
          <div className="border-b-2 md:border-b-0 md:border-r-2 border-neutral-800 font-mono">
            {PROCESSES.map((p, i) => {
              const isActive = i === active;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelect(i)}
                  className={`w-full text-left px-5 py-5 border-l-4 flex items-center gap-4 transition-colors duration-150 ${
                    isActive
                      ? 'border-[var(--blood)] bg-neutral-950 text-white'
                      : 'border-transparent text-neutral-600 hover:text-gray-300 hover:bg-neutral-950/50'
                  }`}
                >
                  <span className="text-xs tracking-widest shrink-0">{p.id}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-xs uppercase tracking-widest truncate">{p.name}</span>
                    <span className={`block text-[10px] tracking-widest mt-1 ${isActive ? 'text-[var(--blood)]' : 'text-neutral-700'}`}>
                      {isActive ? '● running' : 'idle'}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Log output pane */}
          <div className="relative bg-neutral-950 p-8 md:p-10 min-h-[320px] flex flex-col justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <p className="text-neutral-600 text-xs uppercase tracking-widest mb-3 font-mono">
                  PID {current.pid} <span className="mx-2">/</span> process_{current.id}
                </p>
                <h3 className="text-white font-black uppercase text-2xl md:text-3xl mb-6">
                  {current.title}
                </h3>
                <p className="font-mono text-gray-300 text-base md:text-lg leading-relaxed">
                  {current.segments.map((seg, i) =>
                    seg.hl ? (
                      <span key={i} className="text-[var(--blood)] font-bold">{seg.text}</span>
                    ) : (
                      <span key={i}>{seg.text}</span>
                    )
                  )}
                  <span className="inline-block w-2 h-4 bg-white ml-1 align-middle animate-pulse" />
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-800" />
          </div>
        </div>
      </div>
    </section>
  );
}