"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SECTORS } from "@/data/site";
import { Reveal, useFadeIn } from "./Motion";

export default function Sectors() {
  const root = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const list_ = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  useFadeIn(root);

  // keep the sliding pill aligned if fonts load late or the layout resizes
  useGSAP(
    () => {
      const list = list_.current;
      if (!list) return;
      let first = true; // observers report once on observe(); that is not a resize
      const place = () => {
        if (first) {
          first = false;
          return;
        }
        const btn = tabs.current[idx];
        if (btn) gsap.set(".tab-thumb", { x: btn.offsetLeft, width: btn.offsetWidth });
      };
      const ro = new ResizeObserver(place);
      ro.observe(list);
      return () => ro.disconnect();
    },
    { dependencies: [idx], scope: root },
  );

  useGSAP(
    () => {
      const btn = tabs.current[idx];
      if (btn) {
        gsap.to(".tab-thumb", {
          x: btn.offsetLeft,
          width: btn.offsetWidth,
          duration: 0.6,
          ease: "power4.out",
          overwrite: "auto",
        });
      }
      gsap.fromTo(
        "[data-swap]",
        { autoAlpha: 0, y: 36 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.07, ease: "power3.out", overwrite: "auto" },
      );
      gsap.fromTo(
        ".ghost-word",
        { xPercent: 8, autoAlpha: 0 },
        { xPercent: 0, autoAlpha: 1, duration: 1.1, ease: "power4.out", overwrite: "auto" },
      );
    },
    { dependencies: [idx], scope: root },
  );

  const s = SECTORS[idx];

  return (
    <section id="domenii" ref={root} className="relative overflow-hidden bg-ink py-28 sm:py-36">
      <div
        className="ghost-word display pointer-events-none absolute -right-[4vw] top-10 select-none text-[clamp(8rem,26vw,26rem)] text-transparent [-webkit-text-stroke:1px_rgba(236,235,228,0.09)]"
        aria-hidden
      >
        {s.label}
      </div>

      <div className="wrap relative">
        <p className="mono mb-4 text-volt">05 — Domenii de activitate</p>
        <Reveal as="h2" className="display max-w-4xl text-[clamp(2.4rem,5.8vw,5.4rem)]">
          Rezidențial, comercial sau industrial. Aceeași rigoare.
        </Reveal>

        <div
          ref={list_}
          data-fade
          className="relative mt-12 inline-flex rounded-full border border-line bg-ink-2 p-1.5"
          role="tablist"
        >
          <span className="tab-thumb absolute left-0 top-1.5 h-[calc(100%-0.75rem)] w-24 rounded-full bg-volt" />
          {SECTORS.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              aria-selected={i === idx}
              onClick={() => setIdx(i)}
              className={`relative z-10 rounded-full px-5 py-3 text-sm font-semibold transition-colors duration-300 sm:px-8 sm:text-base ${
                i === idx ? "text-ink" : "text-bone/70 hover:text-bone"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h3 data-swap className="display text-[clamp(2rem,4.4vw,4rem)]">
              {s.headline}
            </h3>
            <p data-swap className="mt-6 max-w-lg text-lg leading-relaxed text-bone/70">
              {s.text}
            </p>
          </div>
          <ul className="border-t border-line">
            {s.items.map((it, i) => (
              <li
                key={it}
                data-swap
                className="group flex items-center gap-5 border-b border-line py-5 transition-colors hover:text-volt"
              >
                <span className="mono text-mute">0{i + 1}</span>
                <span className="text-xl font-medium transition-transform duration-300 group-hover:translate-x-2">
                  {it}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
