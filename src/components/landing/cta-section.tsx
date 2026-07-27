import { useState, type FormEvent, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandMark } from "@/components/landing/brand-mark";
import { useLocale } from "@/lib/use-locale";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EASE = [0.16, 1, 0.3, 1] as const;
const CONTACT_EMAIL = "hello@desiherz.de";

const copy = {
  en: {
    eyebrow: "Begin privately",
    heading: ["Send a single line.", "We’ll write back."],
    intro: "No public profile. Your note is seen only by the principal matchmaker.",
    priceLine: ["First consultation & screening — ", "€39"],
    nameLabel: "Your name",
    namePlaceholder: "As your family calls you",
    emailLabel: "Email",
    emailPlaceholder: "discreet@you.com",
    noteLabel: "A note",
    notePlaceholder: "One or two sentences is enough.",
    sending: "Sending…",
    submit: "Request consultation",
    sent: "Thank you — we’ve received your note and will write back privately.",
    mailtoIntro: "We’ve opened your email app with your note ready to send — if nothing opened,",
    mailtoMiddle: "and email it to",
    mailtoEnd: "directly.",
    copyNote: "copy your note",
    copied: "Copied",
    errors: {
      name: "Please tell us your name.",
      emailRequired: "Please add an email so we can write back.",
      emailInvalid: "That email doesn't look right.",
      note: "A line or two helps us understand you.",
      submitFailed: `That didn't send — please try again, or email ${CONTACT_EMAIL} directly.`,
    },
  },
  de: {
    eyebrow: "Privat beginnen",
    heading: ["Schreiben Sie eine Zeile.", "Wir schreiben zurück."],
    intro: "Kein öffentliches Profil. Ihre Nachricht sieht nur die leitende Vermittlerin.",
    priceLine: ["Erstes Beratungsgespräch & Prüfung — ", "39 €"],
    nameLabel: "Ihr Name",
    namePlaceholder: "Wie Ihre Familie Sie nennt",
    emailLabel: "E-Mail",
    emailPlaceholder: "diskret@sie.de",
    noteLabel: "Eine Nachricht",
    notePlaceholder: "Ein oder zwei Sätze reichen.",
    sending: "Wird gesendet…",
    submit: "Beratung anfragen",
    sent: "Vielen Dank — wir haben Ihre Nachricht erhalten und schreiben Ihnen privat zurück.",
    mailtoIntro: "Wir haben Ihre E-Mail-App mit der fertigen Nachricht geöffnet — falls sich nichts geöffnet hat,",
    mailtoMiddle: "und senden Sie sie direkt an",
    mailtoEnd: "",
    copyNote: "Nachricht kopieren",
    copied: "Kopiert",
    errors: {
      name: "Bitte nennen Sie uns Ihren Namen.",
      emailRequired: "Bitte geben Sie eine E-Mail-Adresse an, damit wir zurückschreiben können.",
      emailInvalid: "Diese E-Mail-Adresse scheint nicht korrekt zu sein.",
      note: "Ein oder zwei Zeilen helfen uns, Sie zu verstehen.",
      submitFailed: `Das hat nicht funktioniert — bitte versuchen Sie es erneut oder schreiben Sie direkt an ${CONTACT_EMAIL}.`,
    },
  },
} as const;

// mailto: links (including ones triggered via window.location.href, as
// below) open an OS app-chooser when there's no default mail client, and
// picking a plain browser from that list does nothing — undetectable
// from JS, so we can't know whether it actually worked. This gives a
// guaranteed-working fallback: copy the note to the clipboard.
function CopyButton({ value, label, copiedLabel }: { value: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        });
      }}
      className="font-medium text-gold underline underline-offset-2 hover:text-gold-light"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}

// Web3Forms: a free form-delivery service — submissions POST straight to
// their API and land in the inbox tied to this access key. No backend code
// needed on our side. Sign up at web3forms.com with the inbox you want
// enquiries to reach, then set VITE_WEB3FORMS_KEY (see .env.example).
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

export function CtaSection() {
  const locale = useLocale();
  const t = copy[locale];
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; note?: string; form?: string }>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "mailto-fallback">("idle");

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = t.errors.name;
    if (!email.trim()) nextErrors.email = t.errors.emailRequired;
    else if (!EMAIL_RE.test(email.trim())) nextErrors.email = t.errors.emailInvalid;
    if (!note.trim()) nextErrors.note = t.errors.note;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (!WEB3FORMS_KEY) {
      // Not configured yet — best-effort mailto, but JS has no way to
      // detect whether it actually opened a mail client (an OS
      // app-chooser with no default mail app just silently does
      // nothing), so don't claim the note was sent — show a fallback
      // that's guaranteed to work instead.
      const subject = encodeURIComponent(`Private enquiry from ${name.trim()}`);
      const body = encodeURIComponent(`${note.trim()}\n\n— ${name.trim()} (${email.trim()})`);
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      setStatus("mailto-fallback");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Private enquiry from ${name.trim()}`,
          from_name: "DesiHerz — Private enquiry",
          name: name.trim(),
          email: email.trim(),
          message: note.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Submission failed");
      setStatus("sent");
    } catch {
      setStatus("idle");
      setErrors({ form: t.errors.submitFailed });
    }
  }

  const fieldClass = (hasError: boolean) =>
    `h-auto rounded-none border-0 border-b bg-transparent px-0 py-3.5 text-sm text-foreground shadow-none placeholder:text-muted-foreground/50 focus-visible:ring-0 ${
      hasError ? "border-destructive" : "border-foreground/15 focus-visible:border-gold"
    }`;

  return (
    <section id="contact" className="relative overflow-hidden py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: EASE }}
          onMouseMove={handleMouseMove}
          className="relative border border-gold/30 bg-card"
        >
          {/* Spotlight effect */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(184,134,62,0.08), transparent 40%)`,
            }}
          />

          <div className="relative z-10 px-8 py-16 lg:px-16 lg:py-24">
            <div className="mb-12 flex justify-center lg:hidden">
              <BrandMark size={32} />
            </div>

            <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Left content */}
              <div className="lg:col-span-6">
                <div className="mb-8 hidden lg:block">
                  <BrandMark size={34} />
                </div>
                <span className="mb-8 inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
                  <span className="h-px w-8 bg-gold/50" />
                  {t.eyebrow}
                </span>
                <h2 className="mb-8 text-5xl leading-[0.95] tracking-tight md:text-6xl lg:text-[72px] font-display">
                  {t.heading[0]}
                  <br />
                  <span className="font-accent text-muted-foreground">{t.heading[1]}</span>
                </h2>

                <p className="mb-10 max-w-xl text-xl leading-relaxed text-muted-foreground">{t.intro}</p>

                <p className="font-mono text-sm text-muted-foreground">
                  {t.priceLine[0]}
                  <span className="text-gold">{t.priceLine[1]}</span>
                </p>
              </div>

              {/* Right: enquiry form */}
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 lg:col-span-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cta-name" className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                    {t.nameLabel}
                  </Label>
                  <Input
                    id="cta-name"
                    type="text"
                    placeholder={t.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={fieldClass(!!errors.name)}
                  />
                  {errors.name && (
                    <span className="text-xs text-destructive" id="name-error">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="cta-email" className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                    {t.emailLabel}
                  </Label>
                  <Input
                    id="cta-email"
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={fieldClass(!!errors.email)}
                  />
                  {errors.email && (
                    <span className="text-xs text-destructive" id="email-error">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="cta-note" className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                    {t.noteLabel}
                  </Label>
                  <Input
                    id="cta-note"
                    type="text"
                    placeholder={t.notePlaceholder}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    aria-invalid={!!errors.note}
                    aria-describedby={errors.note ? "note-error" : undefined}
                    className={fieldClass(!!errors.note)}
                  />
                  {errors.note && (
                    <span className="text-xs text-destructive" id="note-error">
                      {errors.note}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group mt-2 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-foreground px-8 text-base font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-60"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t.sending}
                    </>
                  ) : (
                    <>
                      {t.submit}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                {errors.form && (
                  <p className="text-sm text-destructive" role="alert">
                    {errors.form}
                  </p>
                )}
                {status === "sent" && (
                  <p className="text-sm text-gold" role="status">
                    {t.sent}
                  </p>
                )}
                {status === "mailto-fallback" && (
                  <p className="text-sm text-muted-foreground" role="status">
                    {t.mailtoIntro}{" "}
                    <CopyButton
                      value={`${note.trim()}\n\n— ${name.trim()} (${email.trim()})`}
                      label={t.copyNote}
                      copiedLabel={t.copied}
                    />{" "}
                    {t.mailtoMiddle}{" "}
                    <CopyButton value={CONTACT_EMAIL} label={CONTACT_EMAIL} copiedLabel={t.copied} /> {t.mailtoEnd}
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Decorative corners */}
          <div className="absolute top-0 right-0 h-32 w-32 border-b border-l border-gold/25" />
          <div className="absolute bottom-0 left-0 h-32 w-32 border-t border-r border-gold/25" />
        </motion.div>
      </div>
    </section>
  );
}
