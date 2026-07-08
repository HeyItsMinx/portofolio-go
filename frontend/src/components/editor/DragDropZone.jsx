import { useState, useRef } from 'react';

export default function DragDropZone({ onFile, uploading, error }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  return (
    <label
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center h-40 border-2 border-dashed cursor-pointer transition-colors duration-150 ${
        isDragging ? 'border-[var(--blood)] bg-red-950/10' : 'border-neutral-800 hover:border-neutral-600'
      }`}
    >
      <span className={`uppercase text-xs tracking-widest font-bold ${isDragging ? 'text-[var(--blood)]' : 'text-gray-500'}`}>
        {uploading ? 'Uploading...' : isDragging ? 'Drop it' : 'Drag & drop, or click to browse'}
      </span>
      <span className="text-neutral-700 text-[10px] uppercase tracking-widest mt-2">
        JPG, PNG, WEBP, GIF — max 15MB
      </span>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleInputChange} className="hidden" disabled={uploading} />
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </label>
  );
}