import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../lib/api';
import ScrollTimeline from '@/components/journey/ScrollTimeline';

export default function Journey() {
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    api.getMilestones()
      .then(data => setMilestones(data || []))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  return (
    <div className="bg-black min-h-screen">
      <section className="pt-24 pb-16 px-8 max-w-5xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-[var(--blood)] uppercase tracking-[0.3em] text-xs font-bold mb-4"
        >
          The Journey
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-white text-4xl md:text-6xl font-black uppercase tracking-tight"
        >
          Roadmap & Activity
        </motion.h1>
      </section>

      <ScrollTimeline milestones={milestones} />
    </div>
  );
}