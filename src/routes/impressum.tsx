import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [{ title: "Impressum — DesiHerz" }],
  }),
  component: Impressum,
});

function Impressum() {
  return (
    <main className="legal-page">
      <Link to="/" className="legal-back">← Back to DesiHerz</Link>
      <h1>Impressum</h1>

      <h2>Angaben gemäß § 5 TMG</h2>
      <p>
        DesiHerz ist eine Initiative/Projekt von Rahul und Kapil Kumar eGbR<br />
        Ludwig Str. 17<br />
        65479 Raunheim<br />
        Germany
      </p>

      <h2>Kontakt</h2>
      <p>
        Telefon: 080000 60452<br />
        E-Mail: info@pflege-raunheim.de
      </p>

      <h2>Vertretungsberechtigt</h2>
      <p>
        Rahul Kumar, Kapil Kumar
        <br />
        <em>[Bitte bestätigen: sind beide Gesellschafter einzeln vertretungsberechtigt?]</em>
      </p>

      <h2>Registereintrag</h2>
      <p>
        [Gesellschaftsregister und Registernummer der eGbR eintragen]<br />
        [Falls zutreffend] Umsatzsteuer-ID gemäß § 27a UStG: [VAT ID]
      </p>

      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>
        Rahul Kumar / Kapil Kumar<br />
        Ludwig Str. 17, 65479 Raunheim
      </p>

      <h2>Streitschlichtung</h2>
      <p>
        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
        bereit: https://ec.europa.eu/consumers/odr/. Wir sind nicht verpflichtet und nicht
        bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
        teilzunehmen.
      </p>
    </main>
  );
}
