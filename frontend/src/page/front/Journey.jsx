import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import ScrollTimeline from '@/components/journey/ScrollTimeline';
import OrgGallery from '@/components/journey/OrgGallery';
import ActivityStrip from '@/components/journey/ActivityStrip';

export default function Journey() {
  const [milestones, setMilestones] = useState([]);
  const imgBase = import.meta.env.VITE_API_URL.replace('/api', '');

  useEffect(() => {
    api.getMilestones()
      .then(data => setMilestones(data || []))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    document.title = "Samuel R | Journey";
  }, []);

  const workMilestones = milestones.filter(m => ['Work', 'Education', 'Certification'].includes(m.milestone_type));
  const orgMilestones = milestones.filter(m => m.milestone_type === 'Organization');
  const activityMilestones = milestones.filter(m => m.milestone_type === 'Activity');

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

      {workMilestones.length > 0 && (
        <>
          <div className="max-w-5xl mx-auto px-8">
            <p className="text-[var(--blood)] uppercase tracking-[0.3em] text-xs font-bold mb-4">Work Experience</p>
          </div>
          <ScrollTimeline milestones={workMilestones} />
        </>
      )}

      <OrgGallery milestones={orgMilestones} imgBase={imgBase} />
      <ActivityStrip milestones={activityMilestones} imgBase={imgBase} />
    </div>
  );
}