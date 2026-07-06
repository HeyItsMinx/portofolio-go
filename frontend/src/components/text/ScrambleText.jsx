import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

const CHARS = '!<>-_\\/[]{}—=+*^?#________';

export default function ScrambleText({ text, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [display, setDisplay] = useState(text.replace(/[^\s]/g, ' '));

  useEffect(() => {
    if (!isInView) return;

    let frame = 0;
    const totalFrames = 18;

    const interval = setInterval(() => {
      frame += 1;
      const revealCount = Math.floor((frame / totalFrames) * text.length);

      setDisplay(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (i < revealCount) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );

      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplay(text);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [isInView, text]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}