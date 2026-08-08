import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [
      { title: "Impressum — DesiHerz" },
      { name: "description", content: "Impressum für DesiHerz, ein Projekt und Angebot der Rahul und Kapil Kumar eGbR." },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "https://desiherz.de/impressum" }],
  }),
  component: Impressum,
});

function Impressum() {
  return (
    <main className="legal-page">
      <Link to="/" className="legal-back">← Zurück zu DesiHerz</Link>
      <h1>Impressum</h1>

      <p className="legal-note">DesiHerz ist ein Projekt und Angebot der Rahul und Kapil Kumar eGbR.</p>

      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        Rahul und Kapil Kumar eGbR<br />
        Ludwig Str. 17<br />
        65479 Raunheim<br />
        Deutschland
      </p>

      <h2>Kontakt</h2>
      <p>
        Telefon: <a href="tel:+498000060452">0800 0060452</a><br />
        E-Mail: <a href="mailto:hello@desiherz.de">hello@desiherz.de</a>
      </p>

      <h2>Vertretungsberechtigt</h2>
      <p>Rahul Kumar und Kapil Kumar</p>

      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>
        Rahul Kumar und Kapil Kumar<br />
        Ludwig Str. 17<br />
        65479 Raunheim
      </p>

      <h2>Verbraucherstreitbeilegung</h2>
      <p>
        Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.
      </p>
    </main>
  );
}
