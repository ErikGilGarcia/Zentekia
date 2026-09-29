import { useEffect, useRef, useState } from "react";

// La página siempre anima (el usuario lo pidió así), aunque Windows
// tenga "reducir movimiento" activado.
const reduceMotion = () => false;
const hasMouse = () =>
  window.matchMedia("(any-pointer: fine)").matches || window.matchMedia("(hover: hover)").matches;

/* ---------- Aparece al hacer scroll ---------- */
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    if (reduceMotion() || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ---------- Texto que se "decodifica" ---------- */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>_";

export function Scramble({ text, className = "" }) {
  const ref = useRef(null);
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (reduceMotion()) return;
    const el = ref.current;
    let raf, frame = 0, started = false;

    const run = () => {
      const total = text.length * 2 + 10;
      const tick = () => {
        frame++;
        const revealed = Math.floor((frame / total) * text.length);
        setOut(
          text
            .split("")
            .map((ch, i) =>
              ch === " " || i < revealed ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]
            )
            .join("")
        );
        if (frame < total) raf = requestAnimationFrame(tick);
        else setOut(text);
      };
      tick();
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        started = true;
        run();
        io.disconnect();
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </span>
  );
}

/* ---------- Barra de progreso de scroll ---------- */
export function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div ref={ref} className="hb-progress" aria-hidden="true" />;
}

/* ---------- Red de partículas: reacciona al mouse, explota al hacer clic ---------- */
export function NeuralField() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let w, h, dpr, pts = [], waves = [], raf, t = 0;
    const mouse = { x: -9999, y: -9999 };

    const init = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(150, Math.floor((w * h) / 9000));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 1.8 + 0.6,
        hue: Math.random() < 0.25 ? 190 : 218, // algunos cian, la mayoría azules
      }));
    };

    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      // ondas de choque del clic
      waves = waves.filter((wv) => wv.r < 520);
      for (const wv of waves) {
        wv.r += 9;
        const a = 1 - wv.r / 520;
        ctx.strokeStyle = `rgba(110,168,255,${a * 0.7})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(wv.x, wv.y, wv.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = `rgba(80,220,255,${a * 0.35})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(wv.x, wv.y, wv.r * 0.7, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99; p.vy *= 0.99;
        // velocidad mínima para que nunca se queden quietas
        const sp = Math.hypot(p.vx, p.vy);
        if (sp < 0.25) { p.vx += (Math.random() - 0.5) * 0.08; p.vy += (Math.random() - 0.5) * 0.08; }
        if (p.x < 0) { p.x = 0; p.vx *= -1; } if (p.x > w) { p.x = w; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; } if (p.y > h) { p.y = h; p.vy *= -1; }
        // el mouse las atrae en órbita
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < 220 && d > 1) {
          p.vx += (dx / d) * 0.05 - (dy / d) * 0.04;
          p.vy += (dy / d) * 0.05 + (dx / d) * 0.04;
        }
        // la onda las empuja
        for (const wv of waves) {
          const wd = Math.hypot(p.x - wv.x, p.y - wv.y);
          if (Math.abs(wd - wv.r) < 30 && wd > 1) {
            p.vx += ((p.x - wv.x) / wd) * 1.4;
            p.vy += ((p.y - wv.y) / wd) * 1.4;
          }
        }
      }

      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          if (Math.abs(dx) > 140 || Math.abs(dy) > 140) continue;
          const d = Math.hypot(dx, dy);
          if (d < 140) {
            ctx.strokeStyle = `rgba(110,168,255,${(1 - d / 140) * 0.28})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (md < 220) {
          ctx.strokeStyle = `rgba(120,200,255,${(1 - md / 220) * 0.7})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
        const tw = 0.6 + Math.sin(t * 3 + i) * 0.4; // parpadeo
        ctx.fillStyle = md < 220 ? `hsla(${a.hue},100%,80%,1)` : `hsla(${a.hue},100%,70%,${0.45 + tw * 0.4})`;
        ctx.shadowColor = `hsla(${a.hue},100%,65%,1)`;
        ctx.shadowBlur = md < 220 ? 12 : 6;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r * (md < 220 ? 1.6 : 1), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(draw);
    };

    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    const onClick = (e) => { waves.push({ x: e.clientX, y: e.clientY, r: 0 }); };

    init();
    draw();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onClick);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", init);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onClick);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", init);
    };
  }, []);

  return <canvas ref={ref} className="hb-neural" aria-hidden="true" />;
}

/* ---------- Botones magnéticos + brillo que sigue al mouse en tarjetas + parallax ---------- */
export function useInteractions() {
  useEffect(() => {
    const root = document.documentElement;

    const onScroll = () => root.style.setProperty("--sy", String(window.scrollY));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (!hasMouse()) return () => window.removeEventListener("scroll", onScroll);

    const onMove = (e) => {
      // brillo tipo linterna en tarjetas
      const card = e.target.closest?.(".hb-spot");
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--sx", `${e.clientX - r.left}px`);
        card.style.setProperty("--sy2", `${e.clientY - r.top}px`);
      }
      // botones magnéticos
      document.querySelectorAll(".hb-magnet").forEach((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = e.clientX - cx, dy = e.clientY - cy;
        const d = Math.hypot(dx, dy);
        if (d < 120) el.style.transform = `translate(${dx * 0.3}px, ${dy * 0.4}px)`;
        else if (el.style.transform) el.style.transform = "";
      });
      // el hero se mueve con el mouse (profundidad)
      const nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
      root.style.setProperty("--px", nx.toFixed(3));
      root.style.setProperty("--py", ny.toFixed(3));
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);
}

/* ---------- Cinta infinita de texto ---------- */
export function Marquee({ items, reverse = false, outline = false }) {
  const row = [...items, ...items];
  return (
    <div className={`hb-marquee ${reverse ? "rev" : ""} ${outline ? "outline" : ""}`} aria-hidden="true">
      <div className="hb-marquee-track">
        {row.map((t, i) => (
          <span key={i}>{t}<i>✦</i></span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Inclinación 3D siguiendo el mouse ---------- */
export function Tilt({ children, className = "", max = 6 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!hasMouse()) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${x * max}deg) rotateX(${-y * max}deg)`;
      el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
      el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
    };
    const leave = () => { el.style.transform = ""; };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [max]);
  return <div ref={ref} className={`hb-tilt ${className}`}>{children}</div>;
}
