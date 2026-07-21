import { motion } from 'framer-motion';
import ScrambleText from '../text/ScrambleText';

const PILLARS = [
  {
    title: 'Enterprise Architecture',
    desc: 'Architecting multi-tenant ERPs, HRIS, and custom CRMs. PostgreSQL, modular workflows, and heavy data pipelines built to run entire businesses.',
  },
  {
    title: 'Frontend & Portals',
    desc: 'React and state-heavy ecosystems. From data-dense financial dashboards to custom conversational commerce pipelines, built for velocity and absolute control.',
  },
  {
    title: 'Real-Time Systems',
    desc: 'Kotlin, Godot, bare-metal UDP networking, and embedded ONNX machine learning. Bridging raw hardware sensors with zero-latency interactive environments.',
  },
];

export default function WhatIDo() {
  return (
    <section className="bg-black py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <p className="text-[var(--blood)] uppercase tracking-[0.3em] text-xs font-bold mb-4">
          <ScrambleText text="What I Do" />
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {PILLARS.map((p, i) => (
            <motion.div
                key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.1 }}
              className="bg-black border-2 border-neutral-800 hover:border-[var(--blood)] transition-colors duration-150 p-6"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)' }}
            >
              <h3 className="text-white font-black uppercase text-xl mb-3">{p.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}