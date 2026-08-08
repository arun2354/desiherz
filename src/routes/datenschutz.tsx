import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutzerklärung — DesiHerz" },
      { name: "description", content: "Privacy policy for DesiHerz, a private matrimony service operated by Rahul und Kapil Kumar eGbR in Raunheim, Germany." },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "https://desiherz.de/datenschutz" }],
  }),
  component: Datenschutz,
});

function Datenschutz() {
  return (
    <main className="legal-page">
      <Link to="/" className="legal-back">← Back to DesiHerz</Link>
      <h1>Datenschutzerklärung</h1>

      <h2>1. Verantwortlicher</h2>
      <p>
        DesiHerz ist eine Initiative/Projekt von Rahul und Kapil Kumar eGbR<br />
        Ludwig Str. 17<br />
        65479 Raunheim, Deutschland<br />
        E-Mail: info@pflege-raunheim.de<br />
        Telefon: 0800 0060452
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
        Wenn Sie unser Kontaktformular nutzen, werden die von Ihnen eingegebenen Daten
        (Name, E-Mail-Adresse, Nachricht) über den Dienst Web3Forms an unsere
        Kontakt-E-Mail-Adresse übermittelt. Web3Forms verarbeitet diese Daten ausschließlich
        zur Zustellung Ihrer Nachricht und speichert sie nicht dauerhaft. Weitere
        Informationen: <a href="https://web3forms.com/privacy" target="_blank" rel="noopener noreferrer">web3forms.com/privacy</a>.
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
