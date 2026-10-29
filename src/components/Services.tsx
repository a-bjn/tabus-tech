"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SERVICES } from "@/data/site";
import { useFadeIn } from "./Motion";
import SectionIntro from "./SectionIntro";
import { ServiceVisual } from "./ServiceVisuals";

export default function Services() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  // keep the previous panel's demo mounted while it collapses, then unmount it
  const [leaving, setLeaving] = useState<number | null>(null);
  const timer = useRef<number>(0);
  const select = (i: number) => {
    if (i === active) return;
    setLeaving(active);
    setActive(i);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setLeaving(null), 900);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);
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
        }
      });
    },
    { dependencies: [active], scope: root },
  );

  return (
    <section id="servicii" ref={root} className="relative bg-bone py-28 text-ink sm:py-36">
      <div className="wrap">
        <SectionIntro
          className="mb-12 sm:mb-14"
          tone="light"
          label="02 — Servicii"
          title="Patru domenii. O singură echipă care răspunde de tot."
          text="Nu împărțim un proiect între mai mulți executanți. Alege un serviciu și vezi, în câteva secunde, cum lucrează."
        />

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
                  onClick={() => select(i)}
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
                  <div className="grid gap-8 px-5 pb-8 sm:px-8 sm:pb-10 lg:grid-cols-[1fr_1.15fr] lg:items-start md:pl-[calc(2rem+2rem+2rem)]">
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
                    <div data-in className="w-full">
                      {(open || i === leaving) && <ServiceVisual kind={s.visual} />}
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
