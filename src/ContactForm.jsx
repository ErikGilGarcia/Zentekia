import { useState } from "react";

/*
  Formulario de contacto.
  Por ahora, al enviar abre el correo del visitante con todo ya escrito
  hacia CONTACT_EMAIL (no necesita servidor).
  Para recibir los mensajes sin que el visitante use su correo, crea un
  formulario gratis en https://formspree.io, pega su URL en FORMSPREE_URL
  y listo: se envía directo y muestra el mensaje de éxito.
*/
const CONTACT_EMAIL = "hola@zentekia.com";
const FORMSPREE_URL = ""; // ej: "https://formspree.io/f/abcd1234"

const services = [
  "Agentes de IA",
  "Automatización de procesos",
  "Consultoría + implementación",
  "Contact center",
  "Infraestructura / cableado (ingenia)",
  "Otro",
];

const empty = { nombre: "", email: "", empresa: "", servicio: "", mensaje: "" };

export default function ContactForm() {
  const [data, setData] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const set = (k) => (e) => {
    setData((d) => ({ ...d, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!data.nombre.trim()) er.nombre = "Escribe tu nombre";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) er.email = "Revisa tu correo";
    if (!data.servicio) er.servicio = "Elige una opción";
    if (data.mensaje.trim().length < 10) er.mensaje = "Cuéntanos un poco más";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (FORMSPREE_URL) {
      setStatus("sending");
      try {
        const res = await fetch(FORMSPREE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error();
        setStatus("sent");
        setData(empty);
      } catch {
        setStatus("error");
      }
      return;
    }

    const subject = `Contacto web — ${data.servicio} — ${data.nombre}`;
    const body =
      `Nombre: ${data.nombre}\nCorreo: ${data.email}\nEmpresa: ${data.empresa || "—"}\n` +
      `Interés: ${data.servicio}\n\n${data.mensaje}`;
    window.location.href =
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <div className="hb-form hb-form-done" role="status">
        <div className="hb-done-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </div>
        <h3>Mensaje listo</h3>
        <p>
          {FORMSPREE_URL
            ? "Lo recibimos. Te respondemos en menos de 24 horas hábiles."
            : "Se abrió tu correo con el mensaje escrito; solo dale enviar. Te respondemos en menos de 24 horas hábiles."}
        </p>
        <button className="hb-btn-ghost" onClick={() => setStatus("idle")}>
          Enviar otro mensaje →
        </button>
      </div>
    );
  }

  return (
    <form className="hb-form" onSubmit={submit} noValidate>
      <div className="hb-form-head hb-mono">
        <span>NUEVA SOLICITUD</span>
        <span className="hb-live"><i /> canal abierto</span>
      </div>

      <div className="hb-row">
        <Field label="Nombre" error={errors.nombre}>
          <input value={data.nombre} onChange={set("nombre")} autoComplete="name" placeholder="Tu nombre" />
        </Field>
        <Field label="Correo" error={errors.email}>
          <input type="email" value={data.email} onChange={set("email")} autoComplete="email" placeholder="tu@empresa.com" />
        </Field>
      </div>

      <div className="hb-row">
        <Field label="Empresa" optional>
          <input value={data.empresa} onChange={set("empresa")} autoComplete="organization" placeholder="Nombre de tu empresa" />
        </Field>
        <Field label="Me interesa" error={errors.servicio}>
          <select value={data.servicio} onChange={set("servicio")}>
            <option value="" disabled>Elige una opción</option>
            {services.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>

      <Field label="¿Qué quieres que corra solo?" error={errors.mensaje}>
        <textarea
          rows={4}
          value={data.mensaje}
          onChange={set("mensaje")}
          placeholder="Ej: recibimos 300 mensajes al día por WhatsApp y el equipo no alcanza a responder…"
        />
      </Field>

      {status === "error" && (
        <p className="hb-form-error">No se pudo enviar. Intenta de nuevo o escríbenos a {CONTACT_EMAIL}.</p>
      )}

      <div className="hb-form-foot">
        <span className="hb-form-note">O escríbenos directo a <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></span>
        <button type="submit" className="hb-btn" disabled={status === "sending"}>
          {status === "sending" ? "Enviando…" : "Enviar solicitud →"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, error, optional, children }) {
  return (
    <label className={error ? "hb-field has-error" : "hb-field"}>
      <span className="hb-field-label">
        {label} {optional && <em className="hb-opt">opcional</em>}
      </span>
      {children}
      <span className="hb-field-line" aria-hidden="true" />
      {error && <span className="hb-field-error">{error}</span>}
    </label>
  );
}
