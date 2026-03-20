import { useEffect, useRef } from 'react';

export default function CursorFollower() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const mouse   = useRef({ x: -300, y: -300 });
  const lagged  = useRef({ x: -300, y: -300 });
  const raf     = useRef(null);
  const visible = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.style.cursor = 'none';

    const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, [tabindex]:not([tabindex="-1"])';

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!visible.current) {
        lagged.current = { x: e.clientX, y: e.clientY };
        visible.current = true;
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
      }
    };

    const onLeave = () => {
      visible.current = false;
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
    };

    const onEnter = () => {
      visible.current = true;
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
    };

    const onOver = (e) => {
      if (e.target.closest(INTERACTIVE)) {
        dot.classList.add('cf-active');
        ring.classList.add('cf-active');
      }
    };

    const onOut = (e) => {
      if (e.target.closest(INTERACTIVE)) {
        dot.classList.remove('cf-active');
        ring.classList.remove('cf-active');
      }
    };

    document.addEventListener('mousemove',  onMove,  { passive: true });
    document.addEventListener('mouseleave', onLeave, { passive: true });
    document.addEventListener('mouseenter', onEnter, { passive: true });
    document.addEventListener('mouseover',  onOver,  { passive: true });
    document.addEventListener('mouseout',   onOut,   { passive: true });

    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      const { x: mx, y: my } = mouse.current;

      dot.style.transform = `translate(${mx}px, ${my}px)`;

      lagged.current.x = lerp(lagged.current.x, mx, 0.09);
      lagged.current.y = lerp(lagged.current.y, my, 0.09);
      ring.style.transform = `translate(${lagged.current.x}px, ${lagged.current.y}px)`;

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover',  onOver);
      document.removeEventListener('mouseout',   onOut);
      cancelAnimationFrame(raf.current);
      document.documentElement.style.cursor = '';
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cf-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cf-ring" aria-hidden="true" />
    </>
  );
}
