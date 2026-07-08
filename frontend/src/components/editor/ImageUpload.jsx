import { useState } from 'react';
import { api } from '../../lib/api';
import ImageModal from '../media/ImageModal';
import DragDropZone from './DragDropZone';
import { useNavigate } from 'react-router-dom';

const MAX_SIZE = 5 * 1024 * 1024;

export default function ImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const imgBase = import.meta.env.VITE_API_URL.replace('/api', '');
  const fullSrc = value ? `${imgBase}${value}` : '';

  const handleFile = async (file) => {
    if (file.size > MAX_SIZE) {
      setError('Image too large — max 5MB.');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const url = await api.uploadImage(file);
      if (value) {
        api.deleteImage(value, navigate).catch(err => console.error("Old file cleanup failed:", err));
      }
      onChange(url);
    } catch (err) {
      setError('Upload failed. Try a smaller image or different format.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    if (value) {
      api.deleteImage(value, navigate).catch(err => console.error("Delete failed:", err));
    }
    onChange('');
  };

  return (
    <div>
      <label className="block text-gray-400 uppercase text-xs tracking-widest mb-2">Cover Image</label>

      {value ? (
        <div className="relative border-2 border-neutral-800 group">
          <img
            src={fullSrc}
            alt="Cover"
            onClick={() => setModalOpen(true)}
            className="w-full aspect-video object-cover cursor-zoom-in"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-black border border-red-600 text-red-500 text-xs uppercase font-bold px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:bg-red-600 hover:text-white"
          >
            Remove
          </button>
          <ImageModal src={fullSrc} alt="Cover full view" open={modalOpen} onOpenChange={setModalOpen} />
        </div>
      ) : (
        <DragDropZone onFile={handleFile} uploading={uploading} error={error} />
      )}
    </div>
  );
}