import { useEffect, useState } from "react";
import "./LandingHub.css";
import Cursor from "./Cursor";
import ContactForm from "./ContactForm";
import { useReveal, useInteractions, Scramble, ScrollProgress, NeuralField, Tilt, Marquee } from "./Effects";

/* ---------- contenido editable ---------- */

const navLinks = [
  { href: "#hub", label: "Hub" },
  { href: "#ecosistema", label: "Ecosistema" },
  { href: "#metodo", label: "Método" },
  { href: "#stack", label: "Stack" },
];

const agents = [
  { name: "Ventas", tone: "blue" },
  { name: "Soporte", tone: "blue" },
  { name: "Operaciones", tone: "slate" },
];

// Eventos de ejemplo que "transmite" el panel del hero
const feed = [
  { agent: "Ventas", text: "Cotización enviada", ch: "WhatsApp" },
  { agent: "Soporte", text: "Ticket resuelto sin escalar", ch: "Web" },
  { agent: "Operaciones", text: "Factura registrada en CRM", ch: "Sistema" },
  { agent: "Ventas", text: "Cita agendada para mañana", ch: "Voz" },
  { agent: "Soporte", text: "Caso escalado a humano", ch: "Contact center" },
  { agent: "Operaciones", text: "Inventario sincronizado", ch: "Sistema" },
  { agent: "Ventas", text: "Seguimiento a prospecto frío", ch: "WhatsApp" },
];

const orbitNodes = ["WhatsApp", "Voz", "Web", "CRM", "Facturación", "Contact center"];

const steps = [
  {
    n: "01",
    title: "Diagnóstico",
    text: "Entramos a tu operación, medimos dónde se pierde tiempo y qué procesos frenan al equipo, incluido tu contact center.",
  },
  {
    n: "02",
    title: "Rediseño",
    text: "Redibujamos el proceso antes de automatizarlo. Automatizar un proceso roto solo lo rompe más rápido.",
  },
  {
    n: "03",
    title: "Operación",
    text: "Implementamos agentes y automatizaciones, los conectamos a tus sistemas y los seguimos operando contigo.",
  },
];

const layers = [
  {
    k: "CAPA 03",
    title: "Agentes de IA",
    text: "Conversan, deciden y ejecutan en cada canal con el contexto real de tu negocio.",
    tone: "blue",
  },
  {
    k: "CAPA 02",
    title: "Automatización",
    text: "CRM, facturación y soporte conectados: los datos se mueven solos.",
    tone: "mid",
  },
  {
    k: "CAPA 01",
    title: "Infraestructura física",
    text: "Cableado estructurado certificado y redes: la base que sostiene todo.",
    tone: "slate",
    by: "por ingenia",
  },
];

const principles = [
  { title: "Tu equipo técnico interno", text: "Operamos como el área técnica que tu empresa aún no tiene." },
  { title: "Humanos cuando importa", text: "Los agentes escalan a una persona en el momento justo, no antes ni después." },
  { title: "Evidencia técnica", text: "Cada proyecto entrega documentación clara y verificable." },
];

const extras = ["Diseño web", "Marketing digital", "Soporte técnico"];

/* ---------- componentes ---------- */

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className={open ? "hb-nav open" : "hb-nav"}>
      <div className="hb-wrap hb-nav-row">
        <a href="#top" className="hb-logo">zentekia<span>.</span></a>
        <div className="hb-links">
          {navLinks.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
        </div>
        <div className="hb-nav-right">
          <a className="hb-btn hb-btn-sm hb-magnet" href="#contacto">Agendar llamada</a>
          <button
            className="hb-menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span />
          </button>
        </div>
      </div>
      <div className="hb-mobile">
        {navLinks.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
        ))}
        <a href="#contacto" onClick={() => setOpen(false)}>Agendar llamada</a>
      </div>
    </nav>
  );
}

function LiveConsole() {
  // Un solo estado: el contador. Las 4 filas visibles se calculan a partir
  // de él, así nunca pueden acumularse ni duplicarse.
  const [count, setCount] = useState(4);

  useEffect(() => {
    const t = setInterval(() => setCount((c) => c + 1), 1500);
    return () => clearInterval(t);
  }, []);

  const items = [0, 1, 2, 3].map((k) => {
    const id = count - 1 - k;
    return { ...feed[((id % feed.length) + feed.length) % feed.length], id };
  });

  return (
    <Tilt className="hb-console-tilt">
    <div className="hb-console" id="hub">
      <div className="hb-scan" aria-hidden="true" />
      <div className="hb-console-head">
        <Scramble className="hb-mono" text="ZENTEKIA HUB" />
        <span className="hb-live"><i /> en vivo</span>
      </div>
      <div className="hb-agents">
        {agents.map((a) => (
          <div key={a.name} className={`hb-agent hb-spot ${a.tone}`}>
            <i />
            <span>{a.name}</span>
            <small className="hb-mono">activo</small>
          </div>
        ))}
      </div>
      <ul className="hb-feed">
        {items.map((it) => (
          <li key={it.id}>
            <span className="hb-mono hb-feed-agent">{it.agent}</span>
            <span className="hb-feed-text">{it.text}</span>
            <span className="hb-feed-ch">{it.ch}</span>
          </li>
        ))}
      </ul>
      <div className="hb-console-foot hb-mono">
        <span>{count} acciones hoy</span>
        <span className="hb-foot-note">demo ilustrativa</span>
      </div>
    </div>
    </Tilt>
  );
}

function Orbit() {
  return (
    <div className="hb-orbit" aria-hidden="true">
      <div className="hb-ring hb-ring-3" />
      <div className="hb-ring hb-ring-2" />
      <div className="hb-ring hb-ring-1">
        {orbitNodes.map((n, i) => (
          <div
            key={n}
            className="hb-node"
            style={{ "--a": `${(360 / orbitNodes.length) * i}deg` }}
          >
            <span>{n}</span>
          </div>
        ))}
      </div>
      <div className="hb-pulse hb-pulse-1" />
      <div className="hb-pulse hb-pulse-2" />
      <div className="hb-pulse hb-pulse-3" />
      <div className="hb-core">
        <span className="hb-mono">HUB</span>
        <b>zentekia.</b>
      </div>
    </div>
  );
}

/* ---------- página ---------- */

// Palabras del titular; las marcadas con em salen en cursiva azul
const heroWords = [
  ..."Agentes de IA que".split(" ").map((t) => ({ t })),
  ..."operan tu empresa".split(" ").map((t) => ({ t, em: true })),
  ..."mientras tú la diriges.".split(" ").map((t) => ({ t })),
];

export default function LandingHub() {
  useReveal();
  useInteractions();
  return (
    <div className="hb" id="top">
      <Cursor />
      <ScrollProgress />
      <div className="hb-bg" aria-hidden="true">
        <div className="hb-glow hb-glow-a" />
        <div className="hb-glow hb-glow-b" />
        <div className="hb-aurora hb-aurora-1" />
        <div className="hb-aurora hb-aurora-2" />
        <div className="hb-aurora hb-aurora-3" />
        <div className="hb-grid" />
        <NeuralField />
      </div>

      <Nav />

      {/* HERO */}
      <header className="hb-hero">
        <div className="hb-wrap hb-hero-grid">
          <div className="hb-par-a">
            <span className="hb-pill hb-intro" style={{ "--d": "0ms" }}><i /> Hecho a la medida de tu operación</span>
            <h1 className="hb-h1 hb-glitch">
              {heroWords.map((w, i) => (
                <span className="hb-word" key={i} style={{ "--d": `${120 + i * 70}ms` }}>
                  {w.em ? <em className="hb-shine">{w.t}</em> : w.t}&nbsp;
                </span>
              ))}
            </h1>
            <p className="hb-lede hb-intro" style={{ "--d": "760ms" }}>
              Diseñamos tu propio ecosistema de agentes, lo conectamos a tus sistemas y lo
              operamos contigo: ventas, soporte y procesos corriendo solos, con humanos solo
              cuando hace falta.
            </p>
            <div className="hb-actions hb-intro" style={{ "--d": "880ms" }}>
              <a className="hb-btn hb-magnet" href="#contacto">Hablar con un consultor</a>
              <a className="hb-btn-ghost" href="#ecosistema">Ver cómo funciona →</a>
            </div>
          </div>
          <div className="hb-par-b"><div className="hb-intro" style={{ "--d": "400ms" }}><LiveConsole /></div></div>
        </div>
        <a href="#ecosistema" className="hb-scroll-hint hb-mono" aria-label="Bajar">
          <span>SCROLL</span><i />
        </a>
      </header>

      <div className="hb-marquees">
        <Marquee items={["Agentes de IA", "Automatización", "Consultoría", "Contact center", "WhatsApp", "Voz", "CRM"]} />
        <Marquee reverse outline items={["Del agente al cable", "Operación 24/7", "Hecho a tu medida", "LATAM"]} />
      </div>

      {/* ECOSISTEMA */}
      <section className="hb-section hb-eco" id="ecosistema">
        <div className="hb-wrap hb-eco-grid">
          <div data-reveal>
            <Scramble className="hb-eyebrow hb-mono" text="ECOSISTEMA" />
            <h2>Un solo cerebro, <em>todos tus canales.</em></h2>
            <p>
              Cada canal de tu negocio se conecta al Hub. El agente que responde un WhatsApp sabe lo
              que pasó en la llamada de ayer y lo que dice tu CRM hoy.
            </p>
            <div className="hb-chips">
              {extras.map((e) => <span key={e}>+ {e}</span>)}
            </div>
          </div>
          <div data-reveal style={{ "--d": "150ms" }}><Orbit /></div>
        </div>
      </section>

      {/* MÉTODO */}
      <section className="hb-section" id="metodo">
        <div className="hb-wrap">
          <Scramble className="hb-eyebrow hb-mono" text="MÉTODO" />
          <h2 className="hb-h2-wide" data-reveal>Consultoría que <em>no se queda en el papel.</em></h2>
          <div className="hb-steps" data-reveal>
            {steps.map((s, i) => (
              <div className="hb-step hb-spot" key={s.n} style={{ "--d": `${200 + i * 180}ms` }}>
                <span className="hb-step-n hb-mono">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STACK */}
      <section className="hb-section" id="stack">
        <div className="hb-wrap hb-stack-grid">
          <div data-reveal>
            <Scramble className="hb-eyebrow hb-mono" text="STACK COMPLETO" />
            <h2>Del agente <em>al cable.</em></h2>
            <p>
              Somos dos empresas hermanas trabajando en la misma operación: Zentekia construye la capa
              inteligente e ingenia la infraestructura física que la sostiene.
            </p>
            <a className="hb-link" href="https://ingenia.mx" target="_blank" rel="noopener noreferrer">
              Conocer ingenia →
            </a>
          </div>
          <div className="hb-layers" data-reveal>
            {layers.map((l, i) => (
              <div className={`hb-layer hb-spot ${l.tone}`} key={l.k} style={{ "--d": `${i * 160}ms` }}>
                <div className="hb-layer-top">
                  <span className="hb-mono">{l.k}</span>
                  {l.by && <span className="hb-by hb-mono">{l.by}</span>}
                </div>
                <h3>{l.title}</h3>
                <p>{l.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRINCIPIOS */}
      <section className="hb-section hb-principles">
        <div className="hb-wrap">
          <div className="hb-princ-grid" data-reveal>
            {principles.map((p, i) => (
              <div key={p.title} className="hb-princ hb-spot" style={{ "--d": `${i * 140}ms` }}>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <footer className="hb-footer" id="contacto">
        <div className="hb-wrap">
          <div className="hb-contact">
            <div className="hb-contact-copy" data-reveal>
              <Scramble className="hb-eyebrow hb-mono" text="CONTACTO" />
              <h2>¿Qué parte de tu empresa <em>debería correr sola?</em></h2>
              <p>Cuéntanos tu operación y te decimos por dónde empezar. Sin compromiso y sin presentaciones de 40 diapositivas.</p>
              <ul className="hb-contact-list">
                <li><span className="hb-mono">01</span> Te respondemos en menos de 24 h hábiles</li>
                <li><span className="hb-mono">02</span> Llamada de diagnóstico de 30 min</li>
                <li><span className="hb-mono">03</span> Propuesta con alcance, tiempos y costo</li>
              </ul>
            </div>
            <div data-reveal style={{ "--d": "150ms" }}>
              <ContactForm />
            </div>
          </div>
          <div className="hb-foot">
            <span>© {new Date().getFullYear()} Zentekia</span>
            <span className="hb-mono">CDMX · LATAM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}