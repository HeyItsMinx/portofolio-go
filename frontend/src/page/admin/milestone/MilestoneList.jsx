import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from '@/lib/api';
import { useNotification } from '@/components/context/NotificationContext';

export default function MilestoneList() {
  const [milestones, setMilestones] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: '' });
  const navigate = useNavigate();
  const { notify } = useNotification();

  const fetchMilestones = () => {
    api.getMilestones()
      .then(data => setMilestones(data || []))
      .catch(err => console.error("Fetch error:", err));
  };

  useEffect(() => { fetchMilestones(); }, []);

  const confirmDelete = () => {
    api.deleteMilestone(deleteModal.id, navigate)
      .then(() => {
        notify(`"${deleteModal.title}" purged`, { type: 'delete' });
        setDeleteModal({ isOpen: false, id: null, title: '' });
        fetchMilestones();
      })
      .catch(err => {
        console.error("Delete error:", err);
        notify(`Failed to purge "${deleteModal.title}"`, { type: 'error' });
      });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-white uppercase font-black tracking-widest text-2xl">Journey</h1>
        <button
          onClick={() => navigate('/admin/milestones/new')}
          className="bg-white text-black font-bold uppercase px-6 py-3 hover:bg-[var(--blood)] hover:text-white transition-colors duration-150"
        >
          + New Milestone
        </button>
      </div>

      {milestones.length === 0 ? (
        <p className="text-gray-500 text-center py-24">No milestones yet. Add your first one.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {milestones.map(m => (
            <div key={m.id} className="bg-neutral-950 border-2 border-neutral-800 hover:border-[var(--blood)] transition-colors duration-150 p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] bg-neutral-800 text-gray-300 uppercase px-2 py-0.5 tracking-widest">{m.milestone_type}</span>
                  <p className="text-neutral-500 text-xs uppercase tracking-widest">{m.date_label}</p>
                </div>
                <h3 className="text-white font-bold text-lg">{m.title}</h3>
                {m.organization && <p className="text-[var(--blood)] text-sm uppercase tracking-wide">{m.organization}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => navigate('/admin/milestones/new', { state: { milestone: m } })}
                  className="text-white border border-neutral-700 px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-150"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteModal({ isOpen: true, id: m.id, title: m.title })}
                  className="text-red-500 border border-red-500 px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors duration-150"
                >
                  Purge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={deleteModal.isOpen} onOpenChange={(isOpen) => !isOpen && setDeleteModal({ isOpen: false, id: null, title: '' })}>
        <DialogContent className="bg-neutral-950 border-2 border-red-600 rounded-none text-white">
          <DialogHeader>
            <DialogTitle className="text-red-600 font-black text-2xl uppercase tracking-widest">Confirm Purge</DialogTitle>
            <DialogDescription className="text-gray-400 mt-2 text-base">
              Delete <strong className="text-white">{deleteModal.title}</strong>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-3 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteModal({ isOpen: false, id: null, title: '' })} className="bg-transparent border-neutral-600 text-gray-300 hover:bg-neutral-800 hover:text-white uppercase font-bold rounded-none">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} className="bg-red-600 text-black hover:bg-red-500 uppercase font-black tracking-widest rounded-none">
              Execute Purge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}