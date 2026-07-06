import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function Cursor() {
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { damping: 25, stiffness: 400, mass: 0.3 });
  const springY = useSpring(y, { damping: 25, stiffness: 400, mass: 0.3 });

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target;
      const interactive = target.closest('a, button, [role="button"], input, textarea');
      setIsPointer(!!interactive);
    };

    const hide = () => setIsVisible(false);

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', hide);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', hide);
    };
  }, [isVisible, x, y]);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:block"
      style={{ x: springX, y: springY, opacity: isVisible ? 1 : 0 }}
    >
      <motion.div
        animate={{
          width: isPointer ? 36 : 20,
          height: isPointer ? 36 : 20,
          borderColor: isPointer ? 'var(--blood)' : '#ffffff',
        }}
        transition={{ duration: 0.15 }}
        className="relative -translate-x-1/2 -translate-y-1/2 border-2"
        style={{ clipPath: 'polygon(0 0, 30% 0, 30% 8%, 8% 8%, 8% 30%, 0 30%, 0 70%, 8% 70%, 8% 92%, 30% 92%, 30% 100%, 70% 100%, 70% 92%, 92% 92%, 92% 70%, 100% 70%, 100% 30%, 92% 30%, 92% 8%, 70% 8%, 70% 0, 100% 0, 100% 100%, 0 100%)' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-[var(--blood)]"
      />
    </motion.div>
  );
}