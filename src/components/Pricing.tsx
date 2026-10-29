"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { INCLUDED, PRICING, PROMO } from "@/data/site";
import { useFadeIn } from "./Motion";
import SectionIntro from "./SectionIntro";

const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={`mt-1.5 h-3.5 w-3.5 shrink-0 ${className}`} fill="none" aria-hidden>
      <path d="m3 8.5 3.2 3L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Pricing() {
  const root = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(0);
  useFadeIn(root);

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-plan]",
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out", overwrite: "auto" },
      );
    },
    { dependencies: [idx], scope: root },
  );

  const group = PRICING[idx];

  return (
    <section id="preturi" ref={root} className="relative bg-bone py-28 text-ink sm:py-36">
      <div className="wrap">
        <SectionIntro
          tone="light"
          label="05 — Prețuri și oferte"
          title="Prețuri clare de la început. Fără surprize la final."
          text="Tarife orientative pe tipuri de lucrări. Oferta finală o primești după o vizită la fața locului, fără costuri."
        />

        {PROMO.enabled && (
          <a
            href={PROMO.ctaHref}
            data-fade
            className="group mt-12 flex flex-col gap-4 bg-ink px-6 py-6 text-bone transition-colors hover:bg-ink-2 sm:flex-row sm:items-center sm:justify-between sm:px-8"
          >
            <span className="flex items-center gap-4">
              <span className="mono shrink-0 bg-volt px-3 py-1.5 text-ink">Ofertă de lansare</span>
              <span className="text-lg font-medium sm:text-xl">{PROMO.message}</span>
            </span>
            <span className="mono shrink-0 text-volt">{PROMO.ctaLabel} →</span>
          </a>
        )}

        <div data-fade className="mt-12 flex flex-wrap gap-2" role="tablist">
          {PRICING.map((g, i) => (
            <button
              key={g.id}
              role="tab"
              aria-selected={i === idx}
              onClick={() => setIdx(i)}
              className={`rounded-full border px-6 py-3 text-sm font-semibold transition-colors duration-300 sm:text-base ${
                i === idx ? "border-ink bg-ink text-volt" : "border-ink/25 text-ink/70 hover:border-ink hover:text-ink"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        <p data-fade className="mt-6 max-w-2xl text-base text-ink/60 sm:text-lg">
          {group.note}
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {group.plans.map((p) => {
            const dark = p.featured;
            return (
              <article
                key={`${group.id}-${p.name}`}
                data-plan
                className={`relative flex flex-col p-7 sm:p-9 ${
                  dark ? "bg-ink text-bone lg:-my-3 lg:py-12" : "border border-ink/15 bg-bone-2/60"
                }`}
              >
                {dark && (
                  <span className="mono absolute right-6 top-6 bg-volt px-2.5 py-1 text-ink">Recomandat</span>
                )}
                <h3 className="display text-[clamp(1.5rem,2.2vw,2rem)]">{p.name}</h3>
                <p className={`mt-3 text-base leading-relaxed ${dark ? "text-bone/70" : "text-ink/65"}`}>{p.blurb}</p>

                <div className="mt-8 flex items-baseline gap-2">
                  {p.price === null ? (
                    <span className="display text-5xl">La ofertă</span>
                  ) : (
                    <>
                      <span className={`mono ${dark ? "text-volt" : "text-ink/60"}`}>de la</span>
                      <span className="display text-6xl tracking-tight">{fmt(p.price)}</span>
                      <span className={`text-lg font-medium ${dark ? "text-bone/70" : "text-ink/65"}`}>{p.unit}</span>
                    </>
                  )}
                </div>

                <ul className={`mt-8 space-y-3 border-t pt-7 ${dark ? "border-line" : "border-ink/15"}`}>
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-3 text-base leading-snug sm:text-lg">
                      <Check className={dark ? "text-volt" : "text-ink"} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`btn mt-10 self-start ${dark ? "btn-volt" : "bg-ink text-bone hover:bg-volt hover:text-ink"}`}
                >
                  {p.price === null ? "Cere ofertă" : "Solicită ofertă"}
                </a>
              </article>
            );
          })}
        </div>

        <ul data-fade className="mt-16 grid gap-x-8 gap-y-4 border-t border-ink/15 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {INCLUDED.map((t) => (
            <li key={t} className="flex gap-3 text-base font-medium sm:text-lg">
              <Check className="text-ink" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p data-fade className="mt-6 text-sm text-ink/50">
          Prețurile sunt orientative, exprimate fără TVA, și depind de complexitatea și de condițiile din teren.
        </p>
      </div>
    </section>
  );
}
