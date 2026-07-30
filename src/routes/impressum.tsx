import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [
      { title: "Impressum — DesiHerz" },
      {
        name: "description",
        content: "Anbieterkennzeichnung für DesiHerz, ein Angebot der Rahul und Kapil Kumar eGbR.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "https://desiherz.de/impressum" }],
  }),
  component: Impressum,
});

function Impressum() {
  return (
    <main className="legal-page">
      <Link to="/" className="legal-back">
        ← Zurück zu DesiHerz
      </Link>
      <h1>Impressum</h1>

      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        DesiHerz
        <br />
        Ein Angebot der Rahul und Kapil Kumar eGbR
        <br />
        Ludwig Str. 17
        <br />
        65479 Raunheim
        <br />
        Deutschland
      </p>

      <h2>Vertreten durch</h2>
      <p>Rahul Kumar und Kapil Kumar, Gesellschafter der eGbR</p>

      <h2>Kontakt</h2>
      <p>
        Telefon: <a href="tel:+4961429421212">06142 9421212</a>
        <br />
        Telefax: 06142 9421214
        <br />
        E-Mail: <a href="mailto:info@goethecare.de">info@goethecare.de</a>
      </p>

      <h2>Umsatzsteuer-Identifikationsnummer</h2>
      <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: DE 815623156</p>

      <h2>Verantwortlich für journalistisch-redaktionelle Inhalte</h2>
      <p>
        Rahul Kumar und Kapil Kumar
        <br />
        Ludwig Str. 17
        <br />
        65479 Raunheim
      </p>

      <h2>Verbraucherstreitbeilegung</h2>
      <p>
        Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.
      </p>

      <h2>Haftung für Inhalte und Links</h2>
      <p>
        Wir erstellen die Inhalte dieser Website mit größtmöglicher Sorgfalt. Für die Inhalte
        externer Seiten, auf die wir verlinken, sind ausschließlich deren Betreiber verantwortlich.
        Sollten uns konkrete Rechtsverletzungen bekannt werden, entfernen wir entsprechende Links
        unverzüglich.
      </p>

      <h2>Urheberrecht</h2>
      <p>
        Die durch uns erstellten Inhalte und Werke auf dieser Website unterliegen dem deutschen
        Urheberrecht. Jede Verwertung außerhalb der gesetzlichen Grenzen bedarf unserer vorherigen
        schriftlichen Zustimmung.
      </p>
    </main>
  );
}
