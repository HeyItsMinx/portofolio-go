import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ImageModal from '@/components/media/ImageModal';
import { api } from '../../lib/api';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: '' });
  const [modalImage, setModalImage] = useState(null);
  const navigate = useNavigate();

  const fetchProjects = () => {
    api.GetProjects()
      .then(data => setProjects(data || []))
      .catch(err => console.error("Fetch error:", err));
  };

  useEffect(() => { fetchProjects(); }, []);

  const confirmDelete = () => {
    api.DeleteProject(deleteModal.id, navigate)
      .then(() => {
        setDeleteModal({ isOpen: false, id: null, title: '' });
        fetchProjects();
      })
      .catch(err => console.error("Delete error:", err));
  };

  const imgBase = import.meta.env.VITE_API_URL.replace('/api', '');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-white uppercase font-black tracking-widest text-2xl">Projects</h1>
        <button
          onClick={() => navigate('/admin/projects/new')}
          className="bg-white text-black font-bold uppercase px-6 py-3 hover:bg-[var(--blood)] hover:text-white transition-colors duration-150"
        >
          + New Entry
        </button>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-500 text-center py-24">No project found. Initialize a new entry.</p>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map(p => (
            <div key={p.id} className="bg-neutral-950 border-2 border-neutral-800 hover:border-[var(--blood)] transition-colors duration-150 group">
              {p.cover_image_url ? (
                <img
                  src={`${imgBase}${p.cover_image_url}`}
                  alt={p.title}
                  onClick={() => setModalImage({ src: `${imgBase}${p.cover_image_url}`, title: p.title })}
                  className="w-full aspect-video object-cover border-b-2 border-neutral-800 cursor-zoom-in"
                />
              ) : (
                <div className="w-full aspect-video bg-neutral-900 border-b-2 border-neutral-800 flex items-center justify-center text-neutral-700 text-xs uppercase tracking-widest">
                  No Image
                </div>
              )}

              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-bold text-lg">{p.title}</h3>
                  {p.is_featured && <span className="text-[10px] bg-[var(--blood)] text-black font-bold uppercase px-2 py-0.5">Featured</span>}
                </div>
                <p className="text-[var(--blood)] uppercase text-xs font-bold tracking-wider mb-3">{p.client_label}</p>
                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">{p.summary}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/admin/projects/new', { state: { project: p } })}
                    className="flex-1 text-white border border-neutral-700 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-150"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, id: p.id, title: p.title })}
                    className="flex-1 text-red-500 border border-red-500 py-2 text-xs font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors duration-150"
                  >
                    Purge
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <ImageModal
          src={modalImage?.src}
          alt={modalImage?.title}
          open={!!modalImage}
          onOpenChange={(open) => !open && setModalImage(null)}
        />
        </>
      )}

      <Dialog open={deleteModal.isOpen} onOpenChange={(isOpen) => !isOpen && setDeleteModal({ isOpen: false, id: null, title: '' })}>
        <DialogContent className="bg-neutral-950 border-2 border-red-600 rounded-none text-white">
          <DialogHeader>
            <DialogTitle className="text-red-600 font-black text-2xl uppercase tracking-widest">Confirm Data Purge</DialogTitle>
            <DialogDescription className="text-gray-400 mt-2 text-base">
              Are you certain you want to permanently delete <strong className="text-white">{deleteModal.title}</strong>? This action cannot be reversed.
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