"use client";

import { useRef, useState } from "react";
import { gsap, NO_MOTION, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { CONTACT_TOPICS, SITE } from "@/data/site";
import { Magnetic, Reveal, useFadeIn } from "./Motion";

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  useFadeIn(root);

  // big bolt in the background drifts with scroll
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_MOTION, () => {
        gsap.to(".contact-bolt", {
          yPercent: -18,
          rotate: 8,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
        ScrollTrigger.refresh();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const toggle = (t: string) =>
    setTopics((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const subject = `Cerere ofertă — ${f.get("name") ?? ""}`;
    const body = [
      `Nume: ${f.get("name")}`,
      `Contact: ${f.get("contact")}`,
      `Domeniu: ${topics.length ? topics.join(", ") : "—"}`,
      "",
      `${f.get("message") ?? ""}`,
    ].join("\n");
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const field =
    "w-full border-0 border-b-2 border-ink/25 bg-transparent py-3 text-lg text-ink placeholder:text-ink/40 transition-colors focus:border-ink focus:outline-none";

  return (
    <section id="contact" ref={root} className="relative overflow-hidden bg-volt py-28 text-ink sm:py-36">
      <svg
        viewBox="0 0 20 20"
        className="contact-bolt pointer-events-none absolute -right-10 top-10 h-[60vw] max-h-[44rem] w-[60vw] max-w-[44rem] text-ink/[0.06]"
        fill="currentColor"
        aria-hidden
      >
        <path d="M11 1 3 12h6l-1 7 9-12h-6z" />
      </svg>

      <div className="wrap relative grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
        <div>
          <p className="section-label mb-4 text-ink/60">06 — Contact</p>
          <Reveal as="h2" className="display text-[clamp(3rem,8vw,7.5rem)]">
            Dăm drumul la curent?
          </Reveal>
          <p data-fade className="mt-8 max-w-md text-xl leading-relaxed text-ink/75">
            Spune-ne ce ai de făcut: o instalație nouă, un tablou, o automatizare, un sistem CCTV sau o
            defecțiune care nu-ți dă pace. Revenim cu o discuție clară și o ofertă.
          </p>

          <dl data-fade className="mt-12 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="mono text-ink/55">E-mail</dt>
              <dd className="mt-1 text-lg font-semibold">
                <a href={`mailto:${SITE.email}`} className="underline decoration-2 underline-offset-4 hover:decoration-transparent">
                  {SITE.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="mono text-ink/55">Telefon</dt>
              <dd className="mt-1 text-lg font-semibold">
                <a href={SITE.phoneHref} className="underline decoration-2 underline-offset-4 hover:decoration-transparent">
                  {SITE.phone}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <form data-fade onSubmit={onSubmit} className="flex flex-col gap-8">
          <label className="block">
            <span className="mono text-ink/55">Nume / firmă</span>
            <input name="name" required autoComplete="name" className={field} placeholder="Ion Popescu / SC Exemplu SRL" />
          </label>
          <label className="block">
            <span className="mono text-ink/55">Telefon sau e-mail</span>
            <input name="contact" required autoComplete="email" className={field} placeholder="07xx xxx xxx" />
          </label>

          <fieldset>
            <legend className="mono mb-3 text-ink/55">Ce te interesează?</legend>
            <div className="flex flex-wrap gap-2">
              {CONTACT_TOPICS.map((t) => {
                const on = topics.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(t)}
                    className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${
                      on ? "border-ink bg-ink text-volt" : "border-ink/25 hover:border-ink"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="block">
            <span className="mono text-ink/55">Detalii</span>
            <textarea name="message" rows={3} className={`${field} resize-none`} placeholder="Locație, tip de obiectiv, termen dorit…" />
          </label>

          <div className="flex flex-wrap items-center gap-5">
            <Magnetic>
              <button type="submit" className="btn bg-ink text-bone hover:bg-bone hover:text-ink">
                Trimite cererea <span aria-hidden>→</span>
              </button>
            </Magnetic>
            {sent && (
              <p role="status" className="text-sm font-semibold">
                Se deschide aplicația de e-mail cu mesajul pregătit.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
