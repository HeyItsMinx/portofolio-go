import { useRef, useEffect } from 'react';

export default function DotField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let mouse = { x: -9999, y: -9999 };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spacing = 28;
    let dots = [];

    const buildDots = () => {
      dots = [];
      for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
          dots.push({ x, y, baseX: x, baseY: y });
        }
      }
    };
    buildDots();
    window.addEventListener('resize', buildDots);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const container = canvas.parentElement;
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(dot => {
        const dx = mouse.x - dot.baseX;
        const dy = mouse.y - dot.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist / 160);

        const size = 1.5 + influence * 3;
        const isRed = influence > 0.15;

        ctx.beginPath();
        ctx.arc(dot.baseX, dot.baseY, size, 0, Math.PI * 2);
        ctx.fillStyle = isRed
          ? `rgba(255, 0, 0, ${0.4 + influence * 0.6})`
          : `rgba(255, 255, 255, ${0.15 + influence * 0.2})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('resize', buildDots);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
    />
  );
}