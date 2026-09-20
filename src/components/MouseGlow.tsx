import React, { useEffect, useState } from 'react';

export const MouseGlow: React.FC = () => {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-1 transition-opacity duration-500 overflow-hidden"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    >
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '560px',
          height: '560px',
          top: 0,
          left: 0,
          transform: `translate3d(${pos.x - 280}px, ${pos.y - 280}px, 0)`,
          willChange: 'transform',
          background:
            'radial-gradient(circle, rgba(58, 74, 99, 0.18) 0%, rgba(35, 46, 69, 0.08) 45%, transparent 70%)',
          filter: 'blur(32px)',
        }}
      />
    </div>
  );
};
