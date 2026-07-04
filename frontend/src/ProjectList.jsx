import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SpotlightCard from './components/magic/SpotlightCard';

export default function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: '' });
    const navigate = useNavigate();

    const fetchProjects = () => {
        fetch('http://localhost:8080/api/project')
            .then(res => res.json())
            .then(data => setProjects(data || []))
            .catch(err => console.error("Fetch error:", err));
    };
  
    useEffect(() => {
        fetchProjects();
    }, []);

    const confirmDelete = () => {
        fetch(`http://localhost:8080/api/project/${deleteModal.id}`, { method: 'DELETE' })
        .then(res => {
            if (!res.ok) throw new Error("Failed to delete");
            setDeleteModal({ isOpen: false, id: null, title: '' });
            fetchProjects();
        })
        .catch(err => console.error("Delete error:", err));
    };

    return (
        <div className="min-h-screen p-8 bg-[radial-gradient(circle_at_top_right,_#1a0000,_#000)] text-white">
            <header className="flex justify-between items-center mb-12 max-w-7xl mx-auto">
                <div className="bg-red-600 text-black px-8 py-3 inline-block -skew-x-12 shadow-[8px_8px_0_rgba(255,255,255,0.1)]">
                <h1 className="skew-x-12 uppercase font-black tracking-widest text-2xl m-0">Architecture Archive</h1>
                </div>
                <Link 
                to="/form" 
                className="bg-white text-black font-bold uppercase px-6 py-3 -skew-x-12 hover:bg-red-600 hover:text-white transition-colors duration-200"
                >
                <span className="block skew-x-12">+ New Entry</span>
                </Link>
            </header>

            <main className="flex flex-col gap-6 max-w-7xl mx-auto">
                {projects.length === 0 ? (
                    <p className="text-gray-500 text-center py-12">No case studies found. Initialize a new entry.</p>
                    ) : (
                    projects.map(p => (
                        <SpotlightCard key={p.id} className="flex bg-neutral-900 -skew-x-[2deg] hover:-translate-x-2 hover:shadow-[-5px_5px_0_#e60000] transition-all duration-300 relative group border border-neutral-800 hover:border-red-900/50">
                        <div className="flex w-full">
                            <div className="w-4 bg-red-600 shrink-0"></div>
                            <div className="p-6 skew-x-[2deg] w-full">
                            
                            {/* Action Buttons */}
                            <div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                <button 
                                onClick={() => navigate('/form', { state: { project: p } })}
                                className="text-white border border-white px-4 py-1 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors -skew-x-12"
                                >
                                <span className="block skew-x-12">Edit</span>
                                </button>
                                <button 
                                onClick={() => setDeleteModal({ isOpen: true, id: p.id, title: p.title })}
                                className="text-red-500 border border-red-500 px-4 py-1 text-xs font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors -skew-x-12"
                                >
                                <span className="block skew-x-12">Purge</span>
                                </button>
                            </div>

                            <div className="flex justify-between items-start mb-2 pr-40">
                                <h3 className="text-2xl font-bold m-0 flex items-center gap-3 text-white">
                                {p.title} 
                                <span className="text-xs bg-neutral-800 px-3 py-1 rounded-full text-gray-300 font-normal tracking-wide">{p.category}</span>
                                </h3>
                            </div>
                            <p className="text-red-500 font-bold uppercase text-sm tracking-wider m-0 mb-4">{p.client_label}</p>
                            <p className="text-gray-400 leading-relaxed mb-4">{p.summary}</p>
                            </div>
                        </div>
                        </SpotlightCard>
                    ))
                )}
            </main>

            {/* SHADCN UI DELETE MODAL */}
            <Dialog open={deleteModal.isOpen} onOpenChange={(isOpen) => !isOpen && setDeleteModal({ isOpen: false, id: null, title: '' })}>
                <DialogContent className="bg-neutral-950 border-2 border-red-600 rounded-none -skew-x-[2deg] text-white">
                <DialogHeader className="skew-x-[2deg]">
                    <DialogTitle className="text-red-600 font-black text-2xl uppercase tracking-widest">Confirm Data Purge</DialogTitle>
                    <DialogDescription className="text-gray-400 mt-2 text-base">
                    Are you certain you want to permanently delete <strong className="text-white">{deleteModal.title}</strong>? This action cannot be reversed and the architecture data will be lost.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="skew-x-[2deg] mt-6 gap-3 sm:gap-0">
                    <Button 
                    variant="outline" 
                    onClick={() => setDeleteModal({ isOpen: false, id: null, title: '' })}
                    className="bg-transparent border-neutral-600 text-gray-300 hover:bg-neutral-800 hover:text-white uppercase font-bold rounded-none"
                    >
                    Cancel
                    </Button>
                    <Button 
                    variant="destructive" 
                    onClick={confirmDelete}
                    className="bg-red-600 text-black hover:bg-red-500 uppercase font-black tracking-widest rounded-none shadow-[4px_4px_0_rgba(255,255,255,0.1)]"
                    >
                    Execute Purge
                    </Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}