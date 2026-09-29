import { useState } from "react";
import "./Landing.css";

const services = [
  {
    tag: "AGENTE",
    title: "Agentes de IA",
    text: "Operan en cada canal — WhatsApp, voz, web — con el contexto real de tu negocio: cotizan, agendan, dan seguimiento y escalan solo cuando hace falta un humano.",
    lead: true,
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M4 6h16v11H8l-4 4V6z" />
        <circle cx="9" cy="11.5" r="0.8" className="fill" />
        <circle cx="13" cy="11.5" r="0.8" className="fill" />
        <circle cx="17" cy="11.5" r="0.8" className="fill" />
      </svg>
    ),
  },
  {
    tag: "PROCESO",
    title: "Automatización de procesos",
    text: "Conectamos tus sistemas — CRM, facturación, soporte — para que la información se mueva sola y nadie copie datos dos veces.",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M4 7h6M14 7h6M4 17h6M14 17h6" />
        <circle cx="12" cy="7" r="2.2" />
        <circle cx="12" cy="17" r="2.2" />
        <path d="M12 9.2V14.8" />
      </svg>
    ),
  },
  {
    tag: "ESTRATEGIA + EJECUCIÓN",
    title: "Consultoría + implementación",
    text: "Analizamos tu operación, rediseñamos los procesos que la frenan — desde equipos administrativos hasta contact centers con alto volumen — y los implementamos nosotros mismos.",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M15 9l-3.5 6.5L9 15l3.5-6.5z" />
      </svg>
    ),
  },
];

const engineFiles = [
  { name: "ventas.md", note: "cotiza y agenda" },
  { name: "soporte.md", note: "resuelve y escala" },
  { name: "operaciones.md", note: "procesos y datos" },
  { name: "memoria.md", note: "contexto del negocio" },
];

const extras = ["Diseño web", "Marketing digital", "Soporte técnico"];

const stats = [
  { big: "LATAM", small: "Clientes atendidos en México y la región" },
  { big: "IA + infra", small: "Del agente conversacional al cable que lo sostiene" },
  { big: "Evidencia técnica", small: "Cada proyecto entrega documentación verificable" },
];

const navLinks = [
  { href: "#que-hacemos", label: "Qué hacemos" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#contacto", label: "Contacto" },
];

function BackgroundField() {
  return (
    <div className="bg-field" aria-hidden="true">
      <div className="bg-glow-a" />
      <div className="bg-glow-b" />
      <svg viewBox="0 0 1200 1400" preserveAspectRatio="xMidYMin slice">
        <defs>
          <pattern id="dots" width="34" height="34" patternUnits="userSpaceOnUse">
            <circle cx="1.2" cy="1.2" r="1.2" fill="#1b1f29" />
          </pattern>
        </defs>
        <rect width="1200" height="1400" fill="url(#dots)" opacity="0.55" />
        <g stroke="#20345f" strokeWidth="1" opacity="0.5" fill="none">
          <path d="M60 120 L340 120 L340 260 L640 260" />
          <path d="M1140 60 L860 60 L860 220 L560 220 L560 40" />
          <path d="M40 720 L300 720 L300 900" />
          <path d="M1160 980 L900 980 L900 760 L700 760" />
        </g>
        <g fill="#6ea8ff">
          {[[340, 120], [640, 260], [860, 220], [300, 900], [700, 760]].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.4" />
          ))}
        </g>
      </svg>
    </div>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className={open ? "nav open" : "nav"}>
      <div className="wrap nav-row">
        <div className="logo">
          zentekia<span>.</span>
        </div>
        <div className="navlinks">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </div>
        <div className="nav-right">
          <a className="navcta" href="#contacto">Agendar llamada</a>
          <button
            className="menu-btn"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span />
          </button>
        </div>
      </div>
      <div className="mobile-menu">
        {navLinks.map((l) => (
          <a key={l.href} href={l.href} onClick={close}>{l.label}</a>
        ))}
      </div>
    </nav>
  );
}

export default function Landing() {
  return (
    <div className="zk">
      <BackgroundField />
      <Nav />

      <header className="hero">
        <div className="wrap">
          <div className="hero-tag mono">
            AGENTES DE IA · AUTOMATIZACIÓN · CONSULTORÍA + IMPLEMENTACIÓN
          </div>
          <h1 className="headline">Consultoría e IA que rediseñan y operan tu negocio.</h1>
          <p className="lede">
            Analizamos y rediseñamos los procesos de tu empresa — incluso con equipos de contact
            center — y los implementamos con agentes de IA y automatización, de principio a fin,
            no solo en el papel.
          </p>
          <div className="hero-actions">
            <a className="btn-primary" href="#contacto">Hablar con un consultor</a>
            <a className="btn-secondary" href="#que-hacemos">Ver qué hacemos</a>
          </div>
        </div>
      </header>

      <section className="core" id="que-hacemos">
        <div className="wrap">
          <div className="core-head">
            <h2>Tres disciplinas, un mismo objetivo: que tu operación corra sola.</h2>
            <p>
              Construimos el cerebro conversacional, el proceso automatizado detrás de él, y la
              estrategia que sostiene ambos en el tiempo.
            </p>
          </div>
          <div className="core-grid">
            {services.map((s) => (
              <div key={s.title} className={s.lead ? "core-item lead" : "core-item"}>
                <span className="mono">{s.tag}</span>
                {s.icon}
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="arch">
        <div className="wrap arch-grid">
          <div className="arch-copy">
            <h2>Así opera tu empresa con IA.</h2>
            <p>
              Tres capas trabajando juntas: un agente que decide, procesos que ejecutan, y el
              contexto de tu negocio que lo alimenta todo.
            </p>
            <div className="arch-tags">
              <span>Agentes de IA</span>
              <span>Automatización</span>
            </div>
          </div>
          <div className="editor-card">
            <div className="editor-head">
              <span className="dot red" />
              <span className="dot amber" />
              <span className="dot green" />
              <span className="editor-title mono">ZENTEKIA — MOTOR DE AGENTES</span>
            </div>
            <div className="editor-body mono">
              <div>zentekia-ia/</div>
              {engineFiles.map((f, i) => (
                <div key={f.name}>
                  {i === engineFiles.length - 1 ? "└─ " : "├─ "}
                  <b>{f.name}</b> <span className="cmt">← {f.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="also">
        <div className="wrap also-row">
          <span className="lbl mono">Y CUANDO LO NECESITAS, TAMBIÉN:</span>
          <div className="also-chips">
            {extras.map((e) => <span key={e}>{e}</span>)}
          </div>
        </div>
      </section>

      <section className="group">
        <div className="wrap">
          <div className="group-head">
            <div className="group-eyebrow mono">HUB ZENTEKIA</div>
            <h2>Empresas que construimos y operamos.</h2>
            <p>
              Dos frentes activos, cada uno con equipo propio y operación independiente: la capa
              digital e inteligente del negocio, y la infraestructura física que la sostiene.
            </p>
          </div>
          <div className="group-cards">
            <div className="gcard">
              <span className="tag mono">IA + AUTOMATIZACIÓN · CONSULTORÍA DE PROCESOS</span>
              <div className="brand"><span className="dot" />zentekia.</div>
              <p>
                Agentes de IA, automatización de procesos y consultoría para optimizar
                operaciones — incluido contact center —, más diseño web, marketing y soporte para
                la operación digital completa de tu negocio.
              </p>
              <span className="glink active">Estás aquí ↑</span>
            </div>
            <div className="gcard ingenia">
              <span className="tag mono">INFRAESTRUCTURA FÍSICA · CABLEADO ESTRUCTURADO</span>
              <div className="brand"><span className="dot" />ingenia</div>
              <p>
                Instalación y certificación de cableado estructurado bajo norma, redes y
                conectividad física para empresas que necesitan la base sólida antes que el
                software.
              </p>
              <a className="glink" href="https://ingenia.mx" target="_blank" rel="noopener noreferrer">
                ingenia.mx →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="credo" id="nosotros">
        <div className="wrap credo-grid">
          <h2>Operamos como el equipo técnico interno que tu empresa aún no tiene.</h2>
          <div className="credo-stats">
            {stats.map((s) => (
              <div className="stat" key={s.big}>
                <b>{s.big}</b>
                <span>{s.small}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="contacto">
        <div className="wrap">
          <div className="footer-cta">
            <h2>¿Por dónde empezamos?</h2>
            <a className="btn-primary" href="mailto:hola@zentekia.com">hola@zentekia.com</a>
          </div>
          <div className="foot-bottom">
            <span>© {new Date().getFullYear()} Zentekia</span>
            <span className="mono">CDMX · LATAM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
