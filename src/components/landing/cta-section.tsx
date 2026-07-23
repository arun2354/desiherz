import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { ArrowRight } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CtaSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const sectionRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; note?: string }>({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = "Please tell us your name.";
    if (!email.trim()) nextErrors.email = "Please add an email so we can write back.";
    else if (!EMAIL_RE.test(email.trim())) nextErrors.email = "That email doesn't look right.";
    if (!note.trim()) nextErrors.note = "A line or two helps us understand you.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSent(false);
      return;
    }

    const subject = encodeURIComponent(`Private enquiry from ${name.trim()}`);
    const body = encodeURIComponent(`${note.trim()}\n\n— ${name.trim()} (${email.trim()})`);
    window.location.href = `mailto:hello@desiherz.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  const inputClass = (hasError: boolean) =>
    `w-full bg-foreground/[0.03] border px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none transition-colors ${
      hasError ? "border-destructive" : "border-foreground/15 focus:border-foreground/50"
    }`;

  return (
    <section id="contact" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          ref={sectionRef}
          className={`relative border border-foreground/40 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          onMouseMove={handleMouseMove}
        >
          {/* Spotlight effect */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(236,168,214,0.06), transparent 40%)`,
            }}
          />

          <div className="relative z-10 px-8 lg:px-16 py-16 lg:py-24">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left content */}
              <div className="lg:col-span-6">
                <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
                  <span className="w-8 h-px bg-foreground/30" />
                  Begin privately
                </span>
                <h2 className="text-5xl md:text-6xl lg:text-[72px] font-display tracking-tight mb-8 leading-[0.95]">
                  Send a single line.
                  <br />
                  <span className="text-muted-foreground">We&rsquo;ll write back.</span>
                </h2>

                <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl">
                  No public profile. Your note is seen only by the principal matchmaker.
                </p>

                <p className="text-sm text-muted-foreground font-mono">
                  First consultation &amp; screening —{" "}
                  <span className="text-rose">€39</span>
                </p>
              </div>

              {/* Right: enquiry form */}
              <form onSubmit={handleSubmit} noValidate className="lg:col-span-6 flex flex-col gap-5">
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    Your name
                  </span>
                  <input
                    type="text"
                    placeholder="As your family calls you"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={inputClass(!!errors.name)}
                  />
                  {errors.name && (
                    <span className="text-xs text-destructive" id="name-error">
                      {errors.name}
                    </span>
                  )}
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    Email
                  </span>
                  <input
                    type="email"
                    placeholder="discreet@you.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={inputClass(!!errors.email)}
                  />
                  {errors.email && (
                    <span className="text-xs text-destructive" id="email-error">
                      {errors.email}
                    </span>
                  )}
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    A note
                  </span>
                  <input
                    type="text"
                    placeholder="One or two sentences is enough."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    aria-invalid={!!errors.note}
                    aria-describedby={errors.note ? "note-error" : undefined}
                    className={inputClass(!!errors.note)}
                  />
                  {errors.note && (
                    <span className="text-xs text-destructive" id="note-error">
                      {errors.note}
                    </span>
                  )}
                </label>

                <button
                  type="submit"
                  className="mt-2 group inline-flex items-center justify-center gap-2 bg-foreground hover:bg-foreground/90 text-background h-14 px-8 text-base rounded-full font-medium transition-colors"
                >
                  Request consultation
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                {sent && (
                  <p className="text-sm text-rose" role="status">
                    Opening your email client to send this to hello@desiherz.com&hellip;
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Decorative corners */}
          <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-foreground/10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-t border-r border-foreground/10" />
        </div>
      </div>
    </section>
  );
}
