import { useState, useEffect } from 'react';

export default function GlitchText({ text, className = '' }) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 180);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      {isGlitching && (
        <>
          <span
            className="absolute top-0 left-0 z-0 text-[var(--blood)]"
            style={{ transform: 'translate(-3px, 2px)', clipPath: 'polygon(0 20%, 100% 20%, 100% 40%, 0 40%)' }}
            aria-hidden="true"
          >
            {text}
          </span>
          <span
            className="absolute top-0 left-0 z-0 text-cyan-400"
            style={{ transform: 'translate(3px, -2px)', clipPath: 'polygon(0 60%, 100% 60%, 100% 80%, 0 80%)' }}
            aria-hidden="true"
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
}