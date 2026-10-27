"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SERVICES } from "@/data/site";
import { Reveal, useFadeIn } from "./Motion";

const ICONS: Record<string, string[]> = {
  bolt: ["M66 8 24 68h30l-8 44 50-64H64z"],
  panel: [
    "M20 12H100V108H20Z",
    "M20 44H100",
    "M20 76H100",
    "M34 22h12v14H34z",
    "M54 22h12v14H54z",
    "M74 22h12v14H74z",
    "M34 54h12v14H34z",
    "M54 54h12v14H54z",
    "M34 88h52",
  ],
  gear: [
    "M60 38a22 22 0 1 0 .01 0z",
    "M60 52a8 8 0 1 0 .01 0z",
    "M60 10V28",
    "M60 92V110",
    "M10 60H28",
    "M92 60H110",
    "M25 25l13 13",
    "M82 82l13 13",
    "M95 25 82 38",
    "M38 82 25 95",
  ],
  eye: [
    "M14 36H86V76H14Z",
    "M50 56a10 10 0 1 0 .01 0z",
    "M86 52 106 44V68L86 60",
    "M30 76V100",
    "M20 100H40",
  ],
};

export default function Services() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  useFadeIn(root);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const d = reduce ? 0 : 0.75;
      panels.current.forEach((panel, i) => {
        if (!panel) return;
        const open = i === active;
        gsap.to(panel, {
          height: open ? "auto" : 0,
          duration: d,
          ease: "power3.inOut",
          overwrite: "auto",
          onComplete: open ? () => ScrollTrigger.refresh() : undefined,
        });
        if (open) {
          gsap.fromTo(
            panel.querySelectorAll("[data-in]"),
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: d ? 0.7 : 0, stagger: 0.07, delay: d ? 0.25 : 0, ease: "power3.out", overwrite: "auto" },
          );
          gsap.fromTo(
            panel.querySelectorAll(".icon-draw"),
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: d ? 1.4 : 0, stagger: 0.05, delay: d ? 0.3 : 0, ease: "power2.inOut", overwrite: "auto" },
          );
        }
      });
    },
    { dependencies: [active], scope: root },
  );

  return (
    <section id="servicii" ref={root} className="relative bg-bone py-28 text-ink sm:py-36">
      <div className="wrap">
        <div className="mb-14 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="mono mb-4 text-ink/60">02 — Servicii</p>
            <Reveal as="h2" className="display text-[clamp(2.4rem,6vw,5.6rem)]">
              Patru domenii. O singură echipă care răspunde de tot.
            </Reveal>
          </div>
          <p data-fade className="max-w-md text-lg leading-relaxed text-ink/70 lg:justify-self-end">
            Nu împărțim un proiect între mai mulți executanți. Același sistem, de la proiect la
            întreținere, rămâne în aceeași mână.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {SERVICES.map((s, i) => {
            const open = i === active;
            return (
              <div
                key={s.n}
                data-fade
                data-active={open}
                className="group rounded-3xl border border-ink/15 transition-colors duration-500 data-[active=true]:border-ink data-[active=true]:bg-ink data-[active=true]:text-bone"
              >
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-expanded={open}
                  aria-controls={`svc-${s.n}`}
                  className="flex w-full items-center gap-4 px-5 py-6 text-left sm:gap-8 sm:px-8 sm:py-8"
                >
                  <span className="mono w-8 shrink-0 opacity-60">{s.n}</span>
                  <span className="display flex-1 text-[clamp(1.7rem,4vw,3.6rem)] transition-transform duration-500 group-hover:translate-x-2">
                    {s.title}
                  </span>
                  <span className="mono hidden opacity-60 md:block">{s.kicker}</span>
                  <span
                    className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                      open ? "rotate-45 border-volt bg-volt text-ink" : "border-ink/30"
                    }`}
                    aria-hidden
                  >
                    <svg viewBox="0 0 20 20" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
                      <path d="M10 2v16M2 10h16" />
                    </svg>
                  </span>
                </button>

                <div
                  id={`svc-${s.n}`}
                  ref={(el) => {
                    panels.current[i] = el;
                  }}
                  className="overflow-hidden"
                  style={{ height: open ? "auto" : 0 }}
                >
                  <div className="grid gap-8 px-5 pb-8 sm:px-8 sm:pb-10 md:grid-cols-[1.2fr_1fr] md:pl-[calc(2rem+2rem+2rem)]">
                    <div>
                      <p data-in className="max-w-xl text-lg leading-relaxed text-bone/80">
                        {s.text}
                      </p>
                      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                        {s.points.map((p) => (
                          <li key={p} data-in className="flex gap-3 text-bone/90">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-volt" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="hidden items-center justify-center md:flex">
                      <svg viewBox="0 0 120 120" className="h-44 w-44 text-volt" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        {ICONS[s.icon].map((d) => (
                          <path key={d} d={d} className="icon-draw" pathLength={1} style={{ strokeDasharray: 1 }} />
                        ))}
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p data-fade className="mono mt-10 max-w-2xl text-ink/50 normal-case tracking-normal">
          Proiectarea și execuția instalațiilor de joasă și medie tensiune se realizează în
          conformitate cu normativele și cerințele de autorizare aplicabile fiecărei lucrări.
        </p>
      </div>
    </section>
  );
}
