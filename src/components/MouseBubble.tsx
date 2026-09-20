import React, { useEffect, useState, useRef } from 'react';

interface TrailBubble {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  vx: number;
  vy: number;
}

export const MouseBubble: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trailBubbles, setTrailBubbles] = useState<TrailBubble[]>([]);

  // Smooth position tracking with lerp
  const mousePos = useRef({ x: -100, y: -100 });
  const bubblePos = useRef({ x: -100, y: -100 });
  const bubbleRef = useRef<HTMLDivElement>(null);
  const animFrameId = useRef<number | null>(null);
  const lastTrailTime = useRef<number>(0);
  const trailIdCounter = useRef<number>(0);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      // Check if hovering over clickable element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, input, textarea, select, [role="button"], label');
        setIsHovering(!!interactive);
      }

      // Emit tiny trailing bubbles when moving
      const now = performance.now();
      if (now - lastTrailTime.current > 70) {
        lastTrailTime.current = now;
        const newId = trailIdCounter.current++;
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.5;

        setTrailBubbles((prev) => [
          ...prev.slice(-7), // Keep array small for high performance
          {
            id: newId,
            x: e.clientX + (Math.random() - 0.5) * 8,
            y: e.clientY + (Math.random() - 0.5) * 8,
            size: 6 + Math.random() * 8,
            opacity: 0.7,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.8, // subtle upward buoyancy
          },
        ]);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      // Spawn 3 tiny pop bubbles on click
      const newBubbles: TrailBubble[] = Array.from({ length: 4 }).map(() => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        return {
          id: trailIdCounter.current++,
          x: e.clientX,
          y: e.clientY,
          size: 5 + Math.random() * 6,
          opacity: 0.9,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
        };
      });
      setTrailBubbles((prev) => [...prev.slice(-6), ...newBubbles]);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Continuous 60fps render loop for butter-smooth motion
    const updateLoop = () => {
      // Lerp bubble toward mouse
      const ease = 0.22;
      bubblePos.current.x += (mousePos.current.x - bubblePos.current.x) * ease;
      bubblePos.current.y += (mousePos.current.y - bubblePos.current.y) * ease;

      if (bubbleRef.current) {
        bubbleRef.current.style.transform = `translate3d(${bubblePos.current.x}px, ${bubblePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // Update trail bubbles position & fade
      setTrailBubbles((prev) => {
        if (prev.length === 0) return prev;
        return prev
          .map((b) => ({
            ...b,
            x: b.x + b.vx,
            y: b.y + b.vy,
            opacity: b.opacity - 0.045,
            size: Math.max(0, b.size - 0.2),
          }))
          .filter((b) => b.opacity > 0.05);
      });

      animFrameId.current = requestAnimationFrame(updateLoop);
    };

    animFrameId.current = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[80] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Tiny floating trail bubbles */}
      {trailBubbles.map((tb) => (
        <div
          key={tb.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${tb.x}px`,
            top: `${tb.y}px`,
            width: `${tb.size}px`,
            height: `${tb.size}px`,
            transform: 'translate(-50%, -50%)',
            opacity: tb.opacity,
            background:
              'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.95), rgba(56, 189, 248, 0.5) 45%, rgba(14, 165, 233, 0.15) 80%, transparent 100%)',
            border: '1px solid rgba(186, 230, 253, 0.7)',
            boxShadow: '0 0 6px rgba(56, 189, 248, 0.5), inset 0 0 4px rgba(255, 255, 255, 0.6)',
          }}
        />
      ))}

      {/* Main interactive glass mouse bubble */}
      <div
        ref={bubbleRef}
        className="absolute top-0 left-0 pointer-events-none transition-size duration-200 ease-out"
        style={{
          width: isClicking ? '22px' : isHovering ? '42px' : '30px',
          height: isClicking ? '22px' : isHovering ? '42px' : '30px',
          transition: 'width 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), height 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s ease',
        }}
      >
        {/* Outer glowing iridescent sphere */}
        <div
          className="w-full h-full rounded-full relative animate-pulse-subtle"
          style={{
            background: isHovering
              ? 'radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.9) 0%, rgba(125, 211, 252, 0.55) 30%, rgba(14, 165, 233, 0.25) 60%, rgba(2, 132, 199, 0.1) 85%, transparent 100%)'
              : 'radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.85) 0%, rgba(186, 230, 253, 0.45) 28%, rgba(56, 189, 248, 0.2) 65%, rgba(14, 165, 233, 0.08) 85%, transparent 100%)',
            border: isHovering
              ? '1.5px solid rgba(186, 230, 253, 0.95)'
              : '1.2px solid rgba(186, 230, 253, 0.75)',
            boxShadow: isHovering
              ? '0 0 16px rgba(56, 189, 248, 0.7), inset 0 0 8px rgba(255, 255, 255, 0.75), inset -2px -2px 6px rgba(14, 165, 233, 0.4)'
              : '0 0 10px rgba(56, 189, 248, 0.45), inset 0 0 6px rgba(255, 255, 255, 0.6), inset -1.5px -1.5px 4px rgba(14, 165, 233, 0.3)',
            backdropFilter: 'blur(1px)',
          }}
        >
          {/* Glass specular highlight glint */}
          <div
            className="absolute rounded-full bg-white"
            style={{
              top: '18%',
              left: '22%',
              width: isHovering ? '7px' : '5px',
              height: isHovering ? '4.5px' : '3.5px',
              transform: 'rotate(-35deg)',
              opacity: 0.9,
              boxShadow: '0 0 3px rgba(255, 255, 255, 0.9)',
            }}
          />

          {/* Secondary smaller bottom-right reflex highlight */}
          <div
            className="absolute rounded-full"
            style={{
              bottom: '20%',
              right: '22%',
              width: isHovering ? '4.5px' : '3px',
              height: isHovering ? '4.5px' : '3px',
              background: 'rgba(186, 230, 253, 0.65)',
              filter: 'blur(0.5px)',
            }}
          />
        </div>

        {/* Center pointer bead */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-150"
          style={{
            width: isHovering ? '0px' : '3px',
            height: isHovering ? '0px' : '3px',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            boxShadow: '0 0 4px rgba(56, 189, 248, 0.8)',
            opacity: isHovering ? 0 : 0.8,
          }}
        />
      </div>
    </div>
  );
};
