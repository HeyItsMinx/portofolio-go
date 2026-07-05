import { useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';

function wrap(min, max, v) {
  const range = max - min;
  return (((v - min) % range) + range) % range + min;
}

export default function MarqueeRow({ text, baseVelocity = 2, textColor = 'text-white' }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [-2000, 0, 2000], [6, 1, 6], { clamp: false });

  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const directionRef = useRef(baseVelocity < 0 ? -1 : 1);

  useAnimationFrame((t, delta) => {
    const factor = velocityFactor.get();
    const moveBy = directionRef.current * Math.abs(baseVelocity) * factor * (delta / 1000);
    baseX.set(baseX.get() + moveBy);
  });

  const repeated = Array(8).fill(text);

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div className="flex gap-10 w-max" style={{ x }}>
        {repeated.map((t, i) => (
          <span key={i} className={`text-3xl md:text-5xl font-black uppercase tracking-tight ${textColor} flex items-center gap-10 shrink-0`}>
            {t}
            <span className="opacity-60">/</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}