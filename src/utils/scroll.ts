/**
 * High-performance, fast smooth scroll utility with configurable duration and cubic easing.
 * Eliminates the sluggish, dragging delay of browser default smooth scrolling.
 */
export const fastScrollTo = (targetY: number, duration = 380): void => {
  const startY = window.pageYOffset || document.documentElement.scrollTop;
  const distance = targetY - startY;

  // If already at or within 4px of target, snap immediately
  if (Math.abs(distance) <= 4) {
    window.scrollTo(0, targetY);
    return;
  }

  let startTime: number | null = null;
  let cancelled = false;

  // If user scrolls or presses key during smooth scroll, cancel immediately to maintain control
  const cancelScroll = () => {
    cancelled = true;
    cleanup();
  };

  const cleanup = () => {
    window.removeEventListener('wheel', cancelScroll);
    window.removeEventListener('touchmove', cancelScroll);
    window.removeEventListener('keydown', cancelScroll);
  };

  window.addEventListener('wheel', cancelScroll, { passive: true });
  window.addEventListener('touchmove', cancelScroll, { passive: true });
  window.addEventListener('keydown', cancelScroll, { passive: true });

  // easeOutQuart for a fast start and silky smooth deceleration
  const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

  const step = (currentTime: number) => {
    if (cancelled) return;
    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeOutQuart(progress);

    window.scrollTo(0, Math.round(startY + distance * ease));

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      cleanup();
    }
  };

  requestAnimationFrame(step);
};

export const scrollToElement = (elementId: string, offset = 76, duration = 380): void => {
  const el = document.getElementById(elementId);
  if (!el) return;

  const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
  const elementTop = el.getBoundingClientRect().top + currentScrollY;
  const targetY = Math.max(0, elementTop - offset);

  fastScrollTo(targetY, duration);
};
