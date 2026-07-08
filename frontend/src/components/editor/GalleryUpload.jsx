import { useState } from 'react';
import { api } from '../../lib/api';
import ImageModal from '../media/ImageModal';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MAX_SIZE = 5 * 1024 * 1024;

export default function GalleryUpload({ images = [], onChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [modalIndex, setModalIndex] = useState(null);
  const navigate = useNavigate();

  const imgBase = import.meta.env.VITE_API_URL.replace('/api', '');

  const uploadFiles = async (files) => {
    const valid = Array.from(files).filter(f => {
      if (f.size > MAX_SIZE) {
        setError(`Skipped "${f.name}" — over 5MB.`);
        return false;
      }
      return true;
    });
    if (valid.length === 0) return;

    setUploading(true);
    setError('');
    try {
      const urls = await Promise.all(valid.map(f => api.uploadImage(f)));
      onChange([...images, ...urls]);
    } catch (err) {
      setError('One or more uploads failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    uploadFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e) => {
    uploadFiles(e.target.files);
    e.target.value = '';
  };

  const removeAt = (index) => {
    const url = images[index];
    api.deleteImage(url, navigate).catch(err => console.error("Delete failed:", err));
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-gray-400 uppercase text-xs tracking-widest mb-2">
        Gallery Images ({images.length})
      </label>

      <label
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center h-28 border-2 border-dashed cursor-pointer transition-colors duration-150 mb-4 ${
          isDragging ? 'border-[var(--blood)] bg-red-950/10' : 'border-neutral-800 hover:border-neutral-600'
        }`}
      >
        <span className={`uppercase text-xs tracking-widest font-bold ${isDragging ? 'text-[var(--blood)]' : 'text-gray-500'}`}>
          {uploading ? 'Uploading...' : isDragging ? 'Drop them' : 'Drag & drop multiple, or click to browse'}
        </span>
        <input type="file" accept="image/*" multiple onChange={handleInputChange} className="hidden" disabled={uploading} />
      </label>

      {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((url, i) => (
            <div key={url + i} className="relative group border-2 border-neutral-800 hover:border-[var(--blood)] transition-colors duration-150">
              <img
                src={`${imgBase}${url}`}
                alt={`Gallery ${i + 1}`}
                onClick={() => setModalIndex(i)}
                className="w-full aspect-square object-cover cursor-zoom-in"
              />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-1 right-1 bg-black border border-red-600 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:bg-red-600 hover:text-white p-1"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <ImageModal
        images={images.map(url => `${imgBase}${url}`)}
        currentIndex={modalIndex}
        open={modalIndex !== null}
        onOpenChange={(open) => !open && setModalIndex(null)}
        onNavigate={setModalIndex}
      />
    </div>
  );
}