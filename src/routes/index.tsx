import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Cursor } from "@/components/Cursor";
import { Nav } from "@/components/Nav";
import { SmoothScroll } from "@/components/SmoothScroll";
import coupleHero from "@/assets/couple-hero.jpg";
import coupleStory1 from "@/assets/couple-story-1.jpg";
import coupleStory2 from "@/assets/couple-story-2.jpg";
import coupleHands from "@/assets/couple-hands.jpg";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SITE = {
  name: "DesiHerz",
  description:
    "DesiHerz is an invitation-only matrimony house pairing rooted families with character, taste and intention in Frankfurt and across Germany.",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DesiHerz — Private Matrimony for the Discerning" },
      { name: "description", content: SITE.description },
      { property: "og:title", content: "DesiHerz — Private Matrimony" },
      { property: "og:description", content: SITE.description },
      { property: "og:type", content: "website" },
      { name: "theme-color", content: "#09050a" },
      {
        name: "keywords",
        content:
          "private matrimony, luxury matchmaking, Indian matrimony, invitation only matchmaking, Frankfurt matrimony, Germany",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" } as any,
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=Inter:wght@300;400;500&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "DesiHerz",
          description: SITE.description,
          url: "/",
          areaServed: "Germany",
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative selection:bg-[#c9a04a] selection:text-[#09050a]" style={{ backgroundColor: "#09050a", color: "#f5ede0" }}>
      {mounted && (
        <>
          <SmoothScroll />
          <Cursor />
        </>
      )}
      <Nav />
      <Hero />
      <About />
      <Pledges />
      <Process />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}

/* ─────────────────────────────────────────────
   HERO — Asymmetrical Luxury Parallax Scroll
───────────────────────────────────────────── */
<h1>Two hearts. One quiet introduction.</h1>

/* ─────────────────────────────────────────────
   ABOUT
───────────────────────────────────────────── */
function About() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
      gsap.from(".about-fade", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: { trigger: ref.current, start: "top 75%", toggleActions: "play none none none" },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="about" className="py-32 px-6" style={{ background: "#09050a" }}>
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-center">
        <div className="about-fade">
          <p className="eyebrow mb-8 uppercase" style={{ fontSize: "0.6rem", letterSpacing: "0.4em", color: "#c9a04a" }}>
            A Different Way
          </p>
          <h2 className="font-display font-normal" style={{ fontSize: "clamp(2.8rem, 5vw, 4.5rem)", lineHeight: 1.05, color: "#f5ede0" }}>
            Not an app.<br />
            Not a database.<br />
            <em style={{ color: "#c9a04a", fontStyle: "italic" }}>A trusted house.</em>
          </h2>
          <div className="mt-10 w-16" style={{ height: "1px", background: "rgba(201,160,74,0.3)" }} />
          <p className="mt-10 font-sans leading-relaxed" style={{ color: "rgba(245,237,224,0.65)", fontSize: "1.05rem", maxWidth: "480px" }}>
            We are a small, deliberate firm based in Frankfurt, working with a few dozen members at a time. Membership begins with a private consultation — in person, in your home, or wherever you feel most yourself. We listen twice before we ever speak.
          </p>
          <div className="grid grid-cols-2 gap-8 mt-16 pt-12" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <div>
              <div className="font-display text-4xl mb-2" style={{ color: "#c9a04a" }}>12+</div>
              <div className="font-sans uppercase text-[0.55rem] tracking-[0.2em] text-white/50">Years of curated<br/>matchmaking</div>
            </div>
            <div>
              <div className="font-display text-4xl mb-2" style={{ color: "#c9a04a" }}>320</div>
              <div className="font-sans uppercase text-[0.55rem] tracking-[0.2em] text-white/50">Marriages, quietly<br/>arranged</div>
            </div>
          </div>
        </div>

        <div className="about-fade relative h-[80vh]">
          <div className="absolute top-0 right-0 w-[85%] h-[75%] overflow-hidden" style={{ border: "1px solid rgba(201,160,74,0.15)" }}>
             <img src={coupleStory1} alt="Couple" className="w-full h-full object-cover grayscale-[20%]" />
          </div>
          <div className="absolute bottom-0 left-0 w-[55%] h-[50%] overflow-hidden" style={{ border: "1px solid rgba(201,160,74,0.15)", background: "#1c0a10" }}>
             <img src={coupleStory2} alt="Couple" className="w-full h-full object-cover opacity-90" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PLEDGES
───────────────────────────────────────────── */
const PLEDGES = [
  { n: "01", title: "Absolute Privacy", body: "Your profile is never public. No browsing, no swiping, no leaks. Introductions are made one at a time, by people you've met." },
  { n: "02", title: "Verified Members", body: "Identity, background and intentions are confirmed before anyone enters our circle. Discretion is enforced by contract." },
  { n: "03", title: "Human Curation", body: "We listen, we read between the lines, we travel to meet you. Then we propose two or three people — not two hundred." },
  { n: "04", title: "Family-Aware", body: "We respect tradition without bending you to it. Parents are welcome; partners are chosen by you." },
];

function Pledges() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
      gsap.from(".pledge-card", {
        y: 40, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.15,
        scrollTrigger: { trigger: ref.current, start: "top 70%", toggleActions: "play none none none" },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="pledges" className="py-32 px-6" style={{ background: "linear-gradient(to bottom, #09050a, #15060b)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-4">
             <p className="eyebrow mb-6 uppercase" style={{ fontSize: "0.6rem", letterSpacing: "0.4em", color: "#c9a04a" }}>Our Promise</p>
             <h2 className="font-display font-normal" style={{ fontSize: "clamp(2.5rem, 4vw, 4rem)", lineHeight: 1.1, color: "#f5ede0" }}>
               Four pledges —<br />
               <em style={{ color: "#c9a04a", fontStyle: "italic" }}>sealed,</em> not<br />advertised.
             </h2>
             <p className="mt-8 font-sans leading-relaxed text-white/60 text-[1rem]">
                DesiHerz exists because algorithms cannot understand a family, a faith or a feeling. Everything we do is bound by these four lines.
             </p>
          </div>

          <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">
            {PLEDGES.map((p) => (
              <div key={p.n} className="pledge-card p-10 flex flex-col" style={{ background: "rgba(61,12,24,0.15)", border: "1px solid rgba(201,160,74,0.1)" }}>
                <span className="font-sans font-medium mb-6 tracking-[0.2em]" style={{ fontSize: "0.65rem", color: "#c9a04a" }}>{p.n}</span>
                <h3 className="font-display font-normal mb-4" style={{ fontSize: "1.8rem", color: "#f5ede0" }}>{p.title}</h3>
                <p className="font-sans leading-relaxed" style={{ color: "rgba(245,237,224,0.6)", fontSize: "0.95rem" }}>{p.body}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PROCESS — vertical timeline
───────────────────────────────────────────── */
const STEPS = [
  { roman: "I", title: "Quiet conversation", body: "We meet over chai, coffee, or a video call. You speak, we listen. Nothing is written down until you ask us to." },
  { roman: "II", title: "Discreet onboarding", body: "Identity, background, family context — verified privately. Your information never leaves our vault." },
  { roman: "III", title: "Thoughtful curation", body: "We propose two or three people we genuinely believe in. Often only one. Sometimes we ask you to wait." },
  { roman: "IV", title: "The first meeting", body: "Arranged at a place of your choosing. Chaperoned if you wish, private if you don't. We are nearby, never present." },
  { roman: "V", title: "A life together", body: "From engagement through wedding, we remain a quiet hand. Many members return — to introduce a sibling, a friend, a child." },
];

function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
      gsap.from(lineRef.current, {
        scaleY: 0, transformOrigin: "top center", duration: 2, ease: "power2.inOut",
        scrollTrigger: { trigger: ref.current, start: "top 65%", toggleActions: "play none none none" },
      });
      gsap.from(".process-step", {
        opacity: 0, y: 30, duration: 1, ease: "power3.out", stagger: 0.2,
        scrollTrigger: { trigger: ref.current, start: "top 65%", toggleActions: "play none none none" },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="process" className="py-32 px-6" style={{ background: "#09050a" }}>
      <div className="max-w-5xl mx-auto text-center mb-24">
        <p className="eyebrow mb-6 uppercase" style={{ fontSize: "0.6rem", letterSpacing: "0.4em", color: "#c9a04a" }}>The Process</p>
        <h2 className="font-display font-normal text-[#f5ede0]" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
          Five <em style={{ color: "#c9a04a", fontStyle: "italic" }}>unhurried</em> steps
        </h2>
      </div>

      <div className="max-w-4xl mx-auto relative py-10">
        {/* Central Axis Line */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[1px]">
          <div ref={lineRef} className="w-full h-full" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(201,160,74,0.5) 10%, rgba(201,160,74,0.5) 90%, transparent 100%)" }} />
        </div>

        <div className="space-y-16 md:space-y-0">
          {STEPS.map((s, i) => (
            <div key={s.roman} className={`process-step relative md:grid md:grid-cols-2 md:gap-20 items-center ${i % 2 === 0 ? "" : "md:[direction:rtl]"}`} style={{ padding: "3rem 0" }}>
              <div style={{ direction: "ltr" }} className={i % 2 === 0 ? "md:text-right" : "md:text-left"}>
                
                {/* Gold Node */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[30px] h-[30px] rounded-full items-center justify-center" style={{ border: "1px solid rgba(201,160,74,0.4)", background: "#09050a" }}>
                   <div className="w-[6px] h-[6px] rounded-full" style={{ background: "#c9a04a" }} />
                </div>

                <div className="flex items-center gap-6 mb-4 justify-start md:justify-end" style={{ flexDirection: i % 2 === 0 ? "row" : "row-reverse" }}>
                  <h3 className="font-display font-normal text-[#f5ede0]" style={{ fontSize: "2rem" }}>{s.title}</h3>
                  <span className="font-display italic" style={{ fontSize: "3.5rem", color: "#c9a04a", lineHeight: 0.8 }}>{s.roman}</span>
                </div>
                <p className="font-sans leading-relaxed text-white/60 text-[1rem] max-w-sm" style={{ marginLeft: i % 2 === 0 ? "auto" : "0", marginRight: i % 2 !== 0 ? "auto" : "0" }}>
                  {s.body}
                </p>
              </div>
              <div className="hidden md:block" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────── */
function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
      gsap.from(".quote-card", {
        y: 40, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.15,
        scrollTrigger: { trigger: ref.current, start: "top 70%", toggleActions: "play none none none" },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="testimonials" className="py-32 px-6" style={{ background: "linear-gradient(to top, #15060b, #09050a)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p className="eyebrow mb-6 uppercase" style={{ fontSize: "0.6rem", letterSpacing: "0.4em", color: "#c9a04a" }}>In their voices</p>
            <h2 className="font-display font-normal text-[#f5ede0]" style={{ fontSize: "clamp(2.5rem, 4vw, 4rem)", lineHeight: 1.1 }}>
              Spoken <em style={{ color: "#c9a04a", fontStyle: "italic" }}>softly</em>,<br />
              with permission.
            </h2>
          </div>
          <p className="font-sans text-white/50 text-[0.85rem] max-w-xs">
            Every name has been shortened, every detail honoured. We share only what our members ask us to share.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { q: "DesiHerz introduced us with more care than we'd ever received from any platform. It felt like family, not a service.", n: "A. & R.", l: "FRANKFURT" },
            { q: "No public profile, no swiping, no embarrassment. Just two thoughtful introductions and an unforgettable conversation.", n: "S. & K.", l: "MUNICH" },
            { q: "They understood our families' expectations and our personal hopes. The match was effortless and honest.", n: "P. & N.", l: "BERLIN" }
          ].map((t, i) => (
            <div key={i} className="quote-card p-12 flex flex-col justify-between" style={{ border: "1px solid rgba(201,160,74,0.15)", background: "#0c0406" }}>
              <div>
                <span className="font-display text-4xl block mb-6" style={{ color: "#c9a04a", lineHeight: 0.5 }}>"</span>
                <p className="font-display italic text-[1.3rem] leading-relaxed text-[#f5ede0]">{t.q}</p>
              </div>
              <div className="flex items-center gap-4 mt-12">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ border: "1px solid rgba(201,160,74,0.3)" }}>
                  <span style={{ color: "#c9a04a", fontSize: "0.7rem" }}>♥</span>
                </div>
                <div>
                  <div className="font-display text-[1.1rem] text-[#f5ede0]">{t.n}</div>
                  <div className="font-sans uppercase tracking-[0.2em] text-[0.6rem] text-white/50">{t.l}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────── */
function Contact() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
      gsap.from(".contact-inner > *", {
        y: 30, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: ref.current, start: "top 75%", toggleActions: "play none none none" },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="contact" className="py-32 px-6" style={{ background: "#09050a", borderTop: "1px solid rgba(201,160,74,0.15)" }}>
      <div className="max-w-4xl mx-auto text-center contact-inner">
        <h2 className="font-display font-normal text-[#f5ede0]" style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)", lineHeight: 1.05 }}>
          Send a single line.<br />
          <em style={{ color: "#c9a04a", fontStyle: "italic" }}>We'll write back.</em>
        </h2>
        <p className="mt-8 font-sans leading-relaxed text-white/50 text-[1rem] max-w-md mx-auto">
          No public profile is created. Your details are seen only by our principal matchmaker and are never shared.
        </p>

        <form className="mt-20 text-left" onSubmit={(e) => e.preventDefault()}>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 mb-10">
            {[
              { label: "Your Name", type: "text", placeholder: "As your family calls you" },
              { label: "Email", type: "email", placeholder: "discreet@youremail.com" },
              { label: "Phone (Optional)", type: "text", placeholder: "+49 ..." },
              { label: "City", type: "text", placeholder: "Frankfurt" },
            ].map((f, i) => (
              <div key={i}>
                <label className="block font-sans mb-3 uppercase tracking-[0.25em] text-[0.6rem] text-[#c9a04a]">{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  className="w-full bg-transparent outline-none font-sans text-[#f5ede0] text-[0.95rem] pb-3"
                  style={{ borderBottom: "1px solid rgba(201,160,74,0.3)", transition: "border-color 0.3s" }}
                  onFocus={(e) => e.currentTarget.style.borderBottomColor = "#c9a04a"}
                  onBlur={(e) => e.currentTarget.style.borderBottomColor = "rgba(201,160,74,0.3)"}
                />
              </div>
            ))}
          </div>

          <div className="mb-16">
             <label className="block font-sans mb-3 uppercase tracking-[0.25em] text-[0.6rem] text-[#c9a04a]">A Note (Optional)</label>
             <textarea
               rows={1}
               placeholder="One or two sentences is enough."
               className="w-full bg-transparent outline-none font-sans text-[#f5ede0] text-[0.95rem] pb-3 resize-none"
               style={{ borderBottom: "1px solid rgba(201,160,74,0.3)", transition: "border-color 0.3s" }}
               onFocus={(e) => e.currentTarget.style.borderBottomColor = "#c9a04a"}
               onBlur={(e) => e.currentTarget.style.borderBottomColor = "rgba(201,160,74,0.3)"}
             />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
             <p className="font-sans text-[0.7rem] text-white/40 max-w-sm">
                By submitting, you agree to be contacted privately by DesiHerz. We will never publish or share your information.
             </p>
             <button type="submit" className="px-10 py-4 font-sans uppercase tracking-[0.25em] text-[0.65rem] whitespace-nowrap" style={{
                color: "#c9a04a", border: "1px solid rgba(201,160,74,0.5)", background: "transparent", transition: "all 0.3s ease"
             }}
             onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(61,12,24,0.4)"; e.currentTarget.style.borderColor = "#c9a04a"; }}
             onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(201,160,74,0.5)"; }}
             >
                Request Consultation
             </button>
          </div>
        </form>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="py-20 px-6" style={{ background: "#050203", borderTop: "1px solid rgba(201,160,74,0.1)" }}>
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 items-start">
        
        <div>
          <div className="font-display text-[1.8rem] text-[#f5ede0] mb-6 flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a04a" strokeWidth="1.5">
               <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            DesiHerz
          </div>
          <p className="font-sans text-white/50 text-[0.85rem] max-w-xs leading-relaxed">
            Private matrimony for the South Asian community in Frankfurt and across Germany. By introduction only.
          </p>
        </div>

        <div>
          <h4 className="font-sans uppercase tracking-[0.25em] text-[0.65rem] text-[#c9a04a] mb-6">Office</h4>
          <ul className="font-sans text-[#f5ede0] text-[0.9rem] space-y-3 opacity-70">
            <li>Frankfurt am Main, Germany</li>
            <li>By appointment only</li>
            <li>hello@desiherz.com</li>
          </ul>
        </div>

        <div>
          <h4 className="font-sans uppercase tracking-[0.25em] text-[0.65rem] text-[#c9a04a] mb-6">Quiet Promise</h4>
          <ul className="font-sans text-[#f5ede0] text-[0.9rem] space-y-3 opacity-70 max-w-xs">
            <li>No public profiles. No advertising. No noise.</li>
            <li>Only thoughtful, private introductions.</li>
          </ul>
        </div>

      </div>
    </footer>
  );
}