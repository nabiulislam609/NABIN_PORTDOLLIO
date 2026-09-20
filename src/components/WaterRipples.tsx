import React, { useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  progress: number; // 0 to 1
  opacity: number;
  lineWidth: number;
  rings: number;
  isClick: boolean;
}

export const WaterRipples: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const animIdRef = useRef<number | null>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const lastTimeRef = useRef<number>(0);
  const isLoopRunningRef = useRef<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Handle high-DPI displays
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Animation render loop
    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const ripples = ripplesRef.current;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];

        // Advance progress
        r.progress += r.speed;
        r.radius = r.maxRadius * Math.sin((r.progress * Math.PI) / 2); // smooth ease-out expansion
        const currentOpacity = r.opacity * (1 - r.progress);

        if (r.progress >= 1 || currentOpacity <= 0.01) {
          ripples.splice(i, 1);
          continue;
        }

        // Draw concentric water rings
        for (let ring = 0; ring < r.rings; ring++) {
          const ringOffset = ring * (r.isClick ? 14 : 9);
          const ringRadius = r.radius - ringOffset;
          if (ringRadius <= 0) continue;

          const ringAlpha = Math.max(0, currentOpacity * (1 - ring * 0.28));
          const ringWidth = Math.max(0.6, r.lineWidth * (1 - r.progress * 0.7) * (1 - ring * 0.2));

          // Draw outer water crest
          ctx.beginPath();
          ctx.arc(r.x, r.y, ringRadius, 0, Math.PI * 2);
          ctx.strokeStyle = ring === 0 
            ? `rgba(186, 230, 253, ${ringAlpha * 0.95})` // Bright specular highlight on leading edge
            : `rgba(56, 189, 248, ${ringAlpha * 0.75})`;  // Cyan refraction wave body
          ctx.lineWidth = ringWidth;
          ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
          ctx.shadowBlur = r.isClick ? 8 : 4;
          ctx.stroke();

          // Subtle internal water caustic sheen for click ripples
          if (r.isClick && ring === 0 && ringRadius > 10) {
            const grad = ctx.createRadialGradient(
              r.x,
              r.y,
              Math.max(0, ringRadius - 12),
              r.x,
              r.y,
              ringRadius
            );
            grad.addColorStop(0, 'transparent');
            grad.addColorStop(0.7, `rgba(56, 189, 248, ${ringAlpha * 0.08})`);
            grad.addColorStop(1, `rgba(186, 230, 253, ${ringAlpha * 0.15})`);

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(r.x, r.y, ringRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      if (ripples.length > 0) {
        animIdRef.current = requestAnimationFrame(render);
      } else {
        isLoopRunningRef.current = false;
      }
    };

    const startLoopIfNeeded = () => {
      if (!isLoopRunningRef.current) {
        isLoopRunningRef.current = true;
        animIdRef.current = requestAnimationFrame(render);
      }
    };

    const addRipple = (x: number, y: number, isClick: boolean) => {
      if (ripplesRef.current.length > 25) {
        ripplesRef.current.shift(); // keep array bounded for high performance
      }

      ripplesRef.current.push({
        x,
        y,
        radius: 0,
        maxRadius: isClick ? 105 : 48,
        speed: isClick ? 0.016 : 0.024,
        progress: 0,
        opacity: isClick ? 0.65 : 0.32,
        lineWidth: isClick ? 2.2 : 1.4,
        rings: isClick ? 3 : 2,
        isClick,
      });

      startLoopIfNeeded();
    };

    // Mouse movement water disturbance
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const pos = { x: e.clientX, y: e.clientY };

      if (!lastPosRef.current) {
        lastPosRef.current = pos;
        lastTimeRef.current = now;
        return;
      }

      const dx = pos.x - lastPosRef.current.x;
      const dy = pos.y - lastPosRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Trigger wake ripple if moved enough distance or elapsed interval
      if (dist > 28 && now - lastTimeRef.current > 75) {
        addRipple(pos.x, pos.y, false);
        lastPosRef.current = pos;
        lastTimeRef.current = now;
      }
    };

    // Mouse click water drop ripple
    const handleMouseDown = (e: MouseEvent) => {
      addRipple(e.clientX, e.clientY, true);
    };

    // Touch support for mobile taps
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        addRipple(touch.clientX, touch.clientY, true);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('touchstart', handleTouchStart);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[12] w-full h-full"
      style={{
        mixBlendMode: 'screen',
        transform: 'translateZ(0)',
        contain: 'strict',
      }}
      aria-hidden="true"
    />
  );
};
