import React, { useMemo } from 'react';

interface Bubble {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
  opacity: number;
}

export const FloatingBubbles: React.FC = () => {
  // Generate a deterministic collection of 18 bubbles to maintain smooth 60fps performance
  const bubbles = useMemo<Bubble[]>(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      size: 24 + ((i * 19) % 52), // Sizes between 24px and 76px
      left: ((i * 17) % 94) + 3, // Spread evenly across 3% to 97% width
      duration: 18 + ((i * 7) % 16), // 18s to 34s duration for calm, slow upward motion
      delay: -((i * 4.3) % 20), // Staggered start times so bubbles are already floating on load
      opacity: 0.12 + ((i * 3) % 15) / 100, // 0.12 to 0.27 subtle opacity
    }));
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      style={{
        contain: 'strict',
        transform: 'translateZ(0)',
      }}
      aria-hidden="true"
    >
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full floating-bubble"
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            left: `${b.left}%`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            background:
              'radial-gradient(circle at 35% 35%, rgba(184, 198, 220, 0.28), rgba(58, 74, 99, 0.08) 60%, transparent 80%)',
            border: '1px solid rgba(184, 198, 220, 0.25)',
            boxShadow:
              'inset 0 0 12px rgba(184, 198, 220, 0.15), 0 0 15px rgba(58, 74, 99, 0.1)',
            opacity: b.opacity,
          }}
        />
      ))}
    </div>
  );
};
