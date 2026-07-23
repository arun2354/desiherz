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
      <p className="legal-note">
        Angaben gemäß § 5 TMG / § 18 MStV. This page is a placeholder — replace the
        bracketed fields with the business's real registration details before launch.
      </p>

      <h2>Angaben gemäß § 5 TMG</h2>
      <p>
        [Full legal name of the business/owner]<br />
        [Street and house number]<br />
        [Postal code and city]<br />
        Germany
      </p>

      <h2>Kontakt</h2>
      <p>
        Telefon: [phone number]<br />
        E-Mail: [contact email]
      </p>

      <h2>Vertretungsberechtigt</h2>
      <p>[Name of the person(s) legally representing the business]</p>

      <h2>Registereintrag</h2>
      <p>
        [If registered: register court, e.g. Amtsgericht Frankfurt am Main]<br />
        [Registration number, e.g. HRB XXXXX]<br />
        [If applicable] Umsatzsteuer-ID gemäß § 27a UStG: [VAT ID]
      </p>

      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>
        [Name and address of the person responsible for editorial content]
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
