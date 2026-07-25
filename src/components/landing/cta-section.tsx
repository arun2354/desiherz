import { useState, type FormEvent, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandMark } from "@/components/landing/brand-mark";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EASE = [0.16, 1, 0.3, 1] as const;

// Web3Forms: a free form-delivery service — submissions POST straight to
// their API and land in the inbox tied to this access key. No backend code
// needed on our side. Sign up at web3forms.com with the inbox you want
// enquiries to reach, then set VITE_WEB3FORMS_KEY (see .env.example).
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

export function CtaSection() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; note?: string; form?: string }>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

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
    if (!name.trim()) nextErrors.name = "Please tell us your name.";
    if (!email.trim()) nextErrors.email = "Please add an email so we can write back.";
    else if (!EMAIL_RE.test(email.trim())) nextErrors.email = "That email doesn't look right.";
    if (!note.trim()) nextErrors.note = "A line or two helps us understand you.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (!WEB3FORMS_KEY) {
      // Not configured yet — fall back to mailto rather than silently failing.
      const subject = encodeURIComponent(`Private enquiry from ${name.trim()}`);
      const body = encodeURIComponent(`${note.trim()}\n\n— ${name.trim()} (${email.trim()})`);
      window.location.href = `mailto:hello@desiherz.com?subject=${subject}&body=${body}`;
      setStatus("sent");
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
      setErrors({ form: "That didn't send — please try again, or email hello@desiherz.com directly." });
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
                  Begin privately
                </span>
                <h2 className="mb-8 text-5xl leading-[0.95] tracking-tight md:text-6xl lg:text-[72px] font-display">
                  Send a single line.
                  <br />
                  <span className="font-accent text-muted-foreground">We&rsquo;ll write back.</span>
                </h2>

                <p className="mb-10 max-w-xl text-xl leading-relaxed text-muted-foreground">
                  No public profile. Your note is seen only by the principal matchmaker.
                </p>

                <p className="font-mono text-sm text-muted-foreground">
                  First consultation &amp; screening — <span className="text-gold">€39</span>
                </p>
              </div>

              {/* Right: enquiry form */}
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 lg:col-span-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cta-name" className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                    Your name
                  </Label>
                  <Input
                    id="cta-name"
                    type="text"
                    placeholder="As your family calls you"
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
                    Email
                  </Label>
                  <Input
                    id="cta-email"
                    type="email"
                    placeholder="discreet@you.com"
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
                    A note
                  </Label>
                  <Input
                    id="cta-note"
                    type="text"
                    placeholder="One or two sentences is enough."
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
                      Sending&hellip;
                    </>
                  ) : (
                    <>
                      Request consultation
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
                    Thank you — we&rsquo;ve received your note and will write back privately.
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
