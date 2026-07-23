import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [{ title: "Datenschutzerklärung — DesiHerz" }],
  }),
  component: Datenschutz,
});

function Datenschutz() {
  return (
    <main className="legal-page">
      <Link to="/" className="legal-back">← Back to DesiHerz</Link>
      <h1>Datenschutzerklärung</h1>
      <p className="legal-note">
        This page is a placeholder — replace the bracketed fields with the business's real
        details before launch, and have it reviewed against current GDPR/TMG/TTDSG
        obligations before publishing.
      </p>

      <h2>1. Verantwortlicher</h2>
      <p>
        [Full legal name of the business/owner]<br />
        [Street and house number]<br />
        [Postal code and city], Germany<br />
        E-Mail: [contact email]
      </p>

      <h2>2. Hosting</h2>
      <p>
        Diese Website wird bei Vercel Inc. gehostet. Beim Aufruf der Seite verarbeitet der
        Hoster automatisch technische Informationen (u. a. IP-Adresse, Datum und Uhrzeit
        des Zugriffs, angeforderte Seite) in Server-Logs, um die Website sicher und
        stabil auszuliefern.
      </p>

      <h2>3. Schriftarten</h2>
      <p>
        Wir binden Schriftarten von Google Fonts ein, die beim Laden der Seite direkt von
        Google-Servern abgerufen werden. Dabei kann die IP-Adresse des Aufrufers an Google
        übertragen werden.
      </p>

      <h2>4. Kontaktformular</h2>
      <p>
        Das Kontaktformular übermittelt Ihre Eingaben nicht an einen Server, sondern öffnet
        Ihr eigenes E-Mail-Programm mit einer vorausgefüllten Nachricht an
        hello@desiherz.com. Die eigentliche Übermittlung Ihrer Daten erfolgt erst, wenn Sie
        diese E-Mail selbst absenden.
      </p>

      <h2>5. Cookies und Tracking</h2>
      <p>
        Diese Website setzt derzeit keine Analyse- oder Marketing-Cookies und keine
        Tracking-Tools ein.
      </p>

      <h2>6. Ihre Rechte</h2>
      <p>
        Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der
        Verarbeitung Ihrer personenbezogenen Daten sowie das Recht auf
        Datenübertragbarkeit und Widerspruch. Wenden Sie sich hierzu an die oben genannte
        Kontaktadresse. Ihnen steht zudem ein Beschwerderecht bei einer
        Datenschutz-Aufsichtsbehörde zu.
      </p>
    </main>
  );
}
