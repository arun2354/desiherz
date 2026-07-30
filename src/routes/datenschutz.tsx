import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutzerklärung — DesiHerz" },
      {
        name: "description",
        content: "Datenschutzerklärung für DesiHerz, ein Angebot der Rahul und Kapil Kumar eGbR.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "https://desiherz.de/datenschutz" }],
  }),
  component: Datenschutz,
});

function Datenschutz() {
  return (
    <main className="legal-page">
      <Link to="/" className="legal-back">
        ← Zurück zu DesiHerz
      </Link>
      <h1>Datenschutzerklärung</h1>

      <p>
        Der Schutz Ihrer personenbezogenen Daten ist uns wichtig. Nachfolgend informieren wir Sie
        darüber, welche Daten beim Besuch dieser Website und bei einer Kontaktaufnahme verarbeitet
        werden.
      </p>

      <h2>1. Verantwortlicher</h2>
      <p>
        Rahul und Kapil Kumar eGbR
        <br />
        Burggraffenlacher Weg 20
        <br />
        65428 Rüsselsheim am Main
        <br />
        Deutschland
        <br />
        Telefon: <a href="tel:+4961429421212">06142 9421212</a>
        <br />
        E-Mail: <a href="mailto:info@goethecare.de">info@goethecare.de</a>
      </p>

      <h2>2. Bereitstellung der Website und Hosting</h2>
      <p>
        Diese Website wird über Vercel bereitgestellt. Beim Aufruf der Website werden technisch
        erforderliche Verbindungsdaten verarbeitet. Dazu können insbesondere IP-Adresse, Datum und
        Uhrzeit des Zugriffs, aufgerufene URL, übertragene Datenmenge, Referrer-URL, Browsertyp und
        Betriebssystem gehören.
      </p>
      <p>
        Die Verarbeitung erfolgt, um die Website sicher, stabil und fehlerfrei auszuliefern. Die
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in der
        sicheren und zuverlässigen Bereitstellung unseres Online-Angebots. Bei einer Verarbeitung in
        Drittländern werden die hierfür vorgesehenen Datenschutzgarantien eingesetzt.
      </p>

      <h2>3. Kontaktformular und E-Mail</h2>
      <p>
        Wenn Sie uns über das Kontaktformular oder per E-Mail kontaktieren, verarbeiten wir Ihren
        Namen, Ihre E-Mail-Adresse, den Inhalt Ihrer Nachricht und die für die Übermittlung
        erforderlichen technischen Daten. Das Formular übermittelt Ihre Nachricht serverseitig über
        ein IONOS-Mailkonto; ein lokales E-Mail-Programm wird dabei nicht geöffnet.
      </p>
      <p>
        Wir verwenden diese Daten ausschließlich zur Bearbeitung Ihrer Anfrage und der damit
        verbundenen Kommunikation. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die
        Anfrage der Anbahnung eines Vertrags dient, ansonsten Art. 6 Abs. 1 lit. f DSGVO. Unser
        berechtigtes Interesse liegt in der Beantwortung Ihrer Anfrage. Wir löschen die Daten,
        sobald sie hierfür nicht mehr erforderlich sind und keine gesetzlichen
        Aufbewahrungspflichten entgegenstehen.
      </p>

      <h2>4. Schriftarten</h2>
      <p>
        Zur einheitlichen Darstellung werden Schriftarten von Google Fonts geladen. Dabei wird eine
        Verbindung zu Servern von Google hergestellt, wodurch insbesondere Ihre IP-Adresse
        verarbeitet werden kann. Die Einbindung dient der lesbaren und einheitlichen Darstellung der
        Website. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Es kann zu einer Verarbeitung in
        den USA kommen; hierfür werden die vorgesehenen Datenschutzgarantien eingesetzt.
      </p>

      <h2>5. Cookies, Analyse und Marketing</h2>
      <p>
        DesiHerz setzt derzeit keine Analyse- oder Marketing-Cookies und keine Reichweitenmessungs-
        oder Werbetracking-Tools ein. Technisch notwendige Speicherungen können eingesetzt werden,
        soweit sie für eine ausdrücklich gewünschte Funktion der Website erforderlich sind.
      </p>

      <h2>6. Empfänger von Daten</h2>
      <p>
        Daten erhalten nur diejenigen Dienstleister und Personen, die sie für die beschriebenen
        Zwecke benötigen. Hierzu können insbesondere unser Hosting-Anbieter Vercel und bei
        Kontaktanfragen unser E-Mail-Anbieter IONOS gehören. Eine darüber hinausgehende Weitergabe
        erfolgt nur, wenn sie gesetzlich erlaubt ist oder Sie eingewilligt haben.
      </p>

      <h2>7. Ihre Rechte</h2>
      <p>Sie haben nach Maßgabe der gesetzlichen Voraussetzungen insbesondere das Recht auf:</p>
      <ul>
        <li>Auskunft über Ihre verarbeiteten Daten (Art. 15 DSGVO),</li>
        <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO),</li>
        <li>Löschung Ihrer Daten (Art. 17 DSGVO),</li>
        <li>Einschränkung der Verarbeitung (Art. 18 DSGVO),</li>
        <li>Datenübertragbarkeit (Art. 20 DSGVO) und</li>
        <li>Widerspruch gegen eine Verarbeitung (Art. 21 DSGVO).</li>
      </ul>
      <p>
        Erteilte Einwilligungen können Sie jederzeit mit Wirkung für die Zukunft widerrufen.
        Außerdem haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren
        (Art. 77 DSGVO).
      </p>

      <h2>8. Datensicherheit</h2>
      <p>
        Wir treffen angemessene technische und organisatorische Maßnahmen, um Ihre Daten vor
        Verlust, unbefugtem Zugriff und Missbrauch zu schützen. Die Übertragung dieser Website
        erfolgt verschlüsselt über HTTPS.
      </p>

      <h2>9. Stand dieser Datenschutzerklärung</h2>
      <p>Stand: Juli 2026</p>
    </main>
  );
}
