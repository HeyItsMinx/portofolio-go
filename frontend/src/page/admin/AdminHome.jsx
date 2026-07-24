import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { msUntilExpiry } from '@/lib/auth';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function StatusLine({ ok, label, value }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={ok ? 'text-[var(--blood)]' : 'text-yellow-500'}>{ok ? '[OK]' : '[WARN]'}</span>
      <span className="text-neutral-500 uppercase tracking-widest">{label}</span>
      <span className="text-white ml-auto">{value}</span>
    </div>
  );
}

function WarnLine({ items, label }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const hideTimeout = useRef(null);

  if (items.length === 0) return null;

  const show = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setVisible(true);
  };

  const scheduleHide = () => {
    hideTimeout.current = setTimeout(() => setVisible(false), 200);
  };

  const OFFSET = 16;
  const tooltipHeight = items.length * 32 + 40;
  const clampedX = Math.min(pos.x + OFFSET, window.innerWidth - 260);
  const clampedY = Math.min(pos.y + OFFSET, window.innerHeight - tooltipHeight);

  return (
    <div className="relative w-fit">
      <p
        className="text-xs cursor-default"
        onMouseEnter={(e) => { show(); setPos({ x: e.clientX, y: e.clientY }); }}
        onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
        onMouseLeave={scheduleHide}
      >
        <span className="text-yellow-500">[WARN]</span>{' '}
        <span className="text-gray-300 underline decoration-dotted decoration-neutral-600 underline-offset-4">
          {items.length} {label}
        </span>
      </p>

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onMouseEnter={show}
            onMouseLeave={scheduleHide}
            className="fixed z-[999] bg-black border-2 border-yellow-500 min-w-[220px] max-w-xs shadow-[0_8px_24px_rgba(0,0,0,0.6)] origin-top-left"
            style={{ left: clampedX, top: clampedY }}
          >
            <p className="text-neutral-600 text-[10px] uppercase tracking-widest px-3 pt-2 pb-1">
              Click to fix &rarr;
            </p>
            {items.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => navigate('/admin/projects/new', { state: { project: p } })}
                className="block w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-neutral-900 hover:text-white transition-colors duration-100 truncate"
              >
                → {p.title}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BreakdownLine({ label, count }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-300">{label}</span>
      <span className="text-[var(--blood)] font-bold">{count}</span>
    </div>
  );
}

export default function AdminHome() {
  const [projects, setProjects] = useState(null);
  const [milestones, setMilestones] = useState(null);
  const [apiOnline, setApiOnline] = useState(null);

  useEffect(() => {
    document.title = "Admin | Home";
  }, []);

  useEffect(() => {
    api.GetProjects()
      .then(data => { setProjects(data || []); setApiOnline(true); })
      .catch(() => { setProjects([]); setApiOnline(false); });

    api.getMilestones()
      .then(data => setMilestones(data || []))
      .catch(() => setMilestones([]));
  }, []);

  const loading = projects === null || milestones === null;

  const featuredCount = projects?.filter(p => p.is_featured).length || 0;
  const missingCover = projects?.filter(p => !p.cover_image_url) || [];
  const missingStack = projects?.filter(p => !p.tech_stack || p.tech_stack.length === 0) || [];
  const missingGallery = projects?.filter(p => !p.gallery_images || p.gallery_images.length === 0) || [];
  const totalWarnings = missingCover.length + missingStack.length + missingGallery.length;

  const categoryCounts = (projects || []).reduce((acc, p) => {
    const key = p.category || 'Uncategorized';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const milestoneTypeCounts = (milestones || []).reduce((acc, m) => {
    const key = m.milestone_type || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const activity = [
    ...(projects || []).map(p => ({
      id: `project-${p.id}`,
      title: p.title,
      kind: 'project',
      link: '/admin/projects',
      created: p.created_at,
      updated: p.updated_at,
    })),
    ...(milestones || []).map(m => ({
      id: `milestone-${m.id}`,
      title: m.title,
      kind: 'milestone',
      link: '/admin/milestones',
      created: m.created_at,
      updated: m.updated_at,
    })),
  ]
    .map(item => {
      const createdTime = new Date(item.created).getTime();
      const updatedTime = new Date(item.updated).getTime();
      const action = Math.abs(updatedTime - createdTime) < 3000 ? 'created' : 'updated';
      return { ...item, action, timestamp: item.updated };
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 8);

  const sessionMs = msUntilExpiry(localStorage.getItem('token'));
  const sessionMins = Math.max(0, Math.floor(sessionMs / 60000));

  return (
    <div className="p-8">
      <h1 className="text-white text-3xl font-black uppercase tracking-wide mb-8">
        Control Panel
      </h1>

      <div className="bg-neutral-950 border-2 border-neutral-800 p-6 font-mono mb-6">
        <p className="text-gray-500 text-xs mb-4">
          <span className="text-[var(--blood)]">$</span> system.status --verbose
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-6 pb-6 border-b border-neutral-800">
          <StatusLine
            ok={apiOnline !== false}
            label="API"
            value={apiOnline === null ? 'checking...' : apiOnline ? 'ONLINE' : 'OFFLINE'}
          />
          <StatusLine
            ok={apiOnline !== false}
            label="DATABASE"
            value={apiOnline === null ? 'checking...' : apiOnline ? 'CONNECTED' : 'UNREACHABLE'}
          />
          <StatusLine
            ok={sessionMins > 5}
            label="SESSION"
            value={`~${sessionMins} min remaining`}
          />
          <StatusLine
            ok={totalWarnings === 0}
            label="CONTENT HEALTH"
            value={totalWarnings === 0 ? 'ALL CLEAR' : `${totalWarnings} WARNING${totalWarnings > 1 ? 'S' : ''}`}
          />
        </div>

        <p className="text-gray-500 text-xs mb-3">
          <span className="text-[var(--blood)]">$</span> content.health --check
        </p>
        <div className="flex flex-col gap-1.5 mb-6 pb-6 border-b border-neutral-800">
          <WarnLine items={missingCover} label="project(s) missing a cover image" />
          <WarnLine items={missingStack} label="project(s) missing a tech stack" />
          <WarnLine items={missingGallery} label="project(s) missing gallery images" />
          {totalWarnings === 0 && !loading && (
            <p className="text-neutral-600 text-xs">// no issues found</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 pb-6 border-b border-neutral-800">
          <div>
            <p className="text-gray-500 text-xs mb-3">
              <span className="text-[var(--blood)]">$</span> projects.by_category
            </p>
            <div className="flex flex-col gap-1.5">
              {Object.keys(categoryCounts).length === 0 && (
                <p className="text-neutral-600 text-xs">// no projects yet</p>
              )}
              {Object.entries(categoryCounts).map(([cat, count]) => (
                <BreakdownLine key={cat} label={cat} count={count} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-3">
              <span className="text-[var(--blood)]">$</span> milestones.by_type
            </p>
            <div className="flex flex-col gap-1.5">
              {Object.keys(milestoneTypeCounts).length === 0 && (
                <p className="text-neutral-600 text-xs">// no milestones yet</p>
              )}
              {Object.entries(milestoneTypeCounts).map(([type, count]) => (
                <BreakdownLine key={type} label={type} count={count} />
              ))}
            </div>
          </div>
        </div>

        <p className="text-gray-500 text-xs mb-3">
          <span className="text-[var(--blood)]">$</span> tail --lines=8 activity.log
        </p>
        <div className="flex flex-col gap-1.5">
          {activity.length === 0 && !loading && (
            <p className="text-neutral-600 text-xs">// no activity recorded</p>
          )}
          {activity.map(item => (
            <Link
              key={item.id}
              to={item.link}
              className="flex items-center justify-between text-xs hover:bg-neutral-900 px-2 -mx-2 py-1 transition-colors duration-100"
            >
              <span className="text-gray-300 truncate">
                <span className={item.action === 'created' ? 'text-[var(--blood)]' : 'text-yellow-500'}>
                  [{item.action}]
                </span>{' '}
                {item.kind}: {item.title}
              </span>
              <span className="text-neutral-600 shrink-0 ml-4">{timeAgo(item.timestamp)}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-950 border-2 border-neutral-800 p-6 flex flex-col justify-center">
          <p className="text-gray-500 uppercase text-xs tracking-widest mb-2">Total Projects</p>
          <p className="text-[var(--blood)] text-5xl font-black">
            {loading ? '—' : projects.length}
          </p>
          <p className="text-neutral-600 text-xs mt-2">{featuredCount} featured</p>
        </div>

        <Link
          to="/admin/projects"
          className="bg-neutral-950 border-2 border-neutral-800 hover:border-[var(--blood)] p-6 transition-colors duration-150 flex flex-col justify-center gap-2"
        >
          <p className="text-white font-black uppercase text-lg">Manage Projects</p>
          <p className="text-gray-500 text-sm">View, edit, or purge existing entries</p>
        </Link>

        <Link
          to="/admin/projects/new"
          className="bg-neutral-950 border-2 border-neutral-800 hover:border-[var(--blood)] p-6 transition-colors duration-150 flex flex-col justify-center gap-2"
        >
          <p className="text-white font-black uppercase text-lg">+ New Project</p>
          <p className="text-gray-500 text-sm">Inject a new entry directly</p>
        </Link>
      </div>
    </div>
  );
}