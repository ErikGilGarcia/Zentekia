import { useEffect, useRef } from "react";

/*
  Cursor personalizado: un punto que sigue al mouse exacto y un anillo
  que lo persigue con retraso. Crece sobre links/botones y se oculta
  en campos de texto. Solo se activa con mouse (no en celulares).
*/
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const trail = useRef([]);

  useEffect(() => {
    const hasMouse =
      window.matchMedia("(any-pointer: fine)").matches || window.matchMedia("(hover: hover)").matches;
    if (!hasMouse) return;

    const root = document.documentElement;
    root.classList.add("hb-cursor-on");

    let mx = -100, my = -100, rx = -100, ry = -100, raf;
    const tp = Array.from({ length: 8 }, () => ({ x: -100, y: -100 }));

    const move = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${mx}px, ${my}px)`;
      root.classList.remove("hb-cursor-hidden");
    };

    const over = (e) => {
      const el = e.target;
      const isText = el.closest("input, textarea, select");
      const isLink = el.closest("a, button, label, [role='button']");
      root.classList.toggle("hb-cursor-text", !!isText);
      root.classList.toggle("hb-cursor-hover", !isText && !!isLink);
    };

    const down = () => root.classList.add("hb-cursor-down");
    const up = () => root.classList.remove("hb-cursor-down");
    const leave = () => root.classList.add("hb-cursor-hidden");

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      let px = mx, py = my;
      tp.forEach((t, i) => {
        t.x += (px - t.x) * 0.35;
        t.y += (py - t.y) * 0.35;
        px = t.x; py = t.y;
        const el = trail.current[i];
        if (el) el.style.transform = `translate(${t.x}px, ${t.y}px) scale(${1 - i / 9})`;
      });
      raf = requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.addEventListener("mouseleave", leave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.removeEventListener("mouseleave", leave);
      root.classList.remove("hb-cursor-on", "hb-cursor-hover", "hb-cursor-text", "hb-cursor-down", "hb-cursor-hidden");
    };
  }, []);

  return (
    <>
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} ref={(el) => (trail.current[i] = el)} className="hb-cursor-trail" aria-hidden="true"
          style={{ opacity: 0.55 - i * 0.06 }}><span /></div>
      ))}
      <div ref={ring} className="hb-cursor-ring" aria-hidden="true"><span /></div>
      <div ref={dot} className="hb-cursor-dot" aria-hidden="true"><span /></div>
    </>
  );
}
