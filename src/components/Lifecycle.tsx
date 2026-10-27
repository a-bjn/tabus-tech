"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { STEPS } from "@/data/site";
import { Reveal } from "./Motion";

const PATH =
  "M40 50 H400 L440 90 V150 L400 190 H160 L120 230 V290 L160 330 H400 L440 370 V430 L400 470 H160 L120 510 V570 L160 610 H520";

export default function Lifecycle() {
  const root = useRef<HTMLElement>(null);
  const base = useRef<SVGPathElement>(null);
  const drawn = useRef<SVGPathElement>(null);
  const tip = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const mm = gsap.matchMedia();

      /* ---------- desktop: pinned, scroll-scrubbed diagram ---------- */
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        section.classList.add("proc-pinned");

        const steps = gsap.utils.toArray<HTMLElement>(".proc-step", section);
        const nodes = gsap.utils.toArray<SVGGElement>(".proc-node", section);
        const rail = gsap.utils.toArray<HTMLElement>("[data-rail]", section);
        const path = base.current!;
        const len = path.getTotalLength();
        const n = steps.length;

        // place nodes along the path at equal fractions of its length
        nodes.forEach((node, i) => {
          const pt = path.getPointAtLength((i / (n - 1)) * len);
          node.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
          const label = node.querySelector("text.node-label")!;
          const left = pt.x > 300;
          label.setAttribute("x", left ? "18" : "-18");
          label.setAttribute("text-anchor", left ? "end" : "start");
        });

        gsap.set(drawn.current, { strokeDasharray: len, strokeDashoffset: len });
        gsap.set(steps.slice(1), { autoAlpha: 0, y: 40 });

        let lastIdx = -1;
        const render = (p: number) => {
          gsap.set(drawn.current, { strokeDashoffset: len * (1 - p) });
          const pt = path.getPointAtLength(p * len);
          gsap.set(tip.current, { x: pt.x, y: pt.y });
          const idx = Math.min(n - 1, Math.floor(p * (n - 1) + 0.02));
          if (idx !== lastIdx) {
            nodes.forEach((node, i) => {
              const on = i <= idx;
              if (node.dataset.on !== String(on)) {
                node.dataset.on = String(on);
                gsap.to(node.querySelector(".node-core"), {
                  scale: on ? 1 : 0,
                  duration: on ? 0.5 : 0.25,
                  ease: on ? "back.out(3)" : "power2.in",
                  transformOrigin: "50% 50%",
                  overwrite: true,
                });
              }
            });
            rail.forEach((r, i) => (r.dataset.active = String(i === idx)));
            lastIdx = idx;
          }
        };
        const proxy = { p: 0 };
        nodes.forEach((node) => (node.dataset.on = "false"));
        gsap.set(".node-core", { scale: 0, transformOrigin: "50% 50%" });
        render(0);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=340%",
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
          },
        });
        tl.to(proxy, { p: 1, duration: n - 1, onUpdate: () => render(proxy.p) }, 0);
        for (let i = 1; i < n; i++) {
          tl.to(steps[i - 1], { autoAlpha: 0, y: -40, duration: 0.3, ease: "power2.in" }, i - 0.35).to(
            steps[i],
            { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" },
            i - 0.05,
          );
        }
        tl.to({}, { duration: 0.3 }); // short hold on the final step

        return () => {
          section.classList.remove("proc-pinned");
          gsap.set([...steps, drawn.current], { clearProps: "all" });
        };
      });

      /* ---------- smaller screens: simple staggered reveal ---------- */
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        const steps = gsap.utils.toArray<HTMLElement>(".proc-step", section);
        gsap.set(steps, { autoAlpha: 0, y: 40 });
        ScrollTrigger.batch(steps, {
          start: "top 88%",
          once: true,
          onEnter: (b) => gsap.to(b, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12 }),
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="proces"
      ref={root}
      className="proc relative flex flex-col justify-center bg-ink py-24 lg:py-0"
    >
      <div className="wrap">
        <div className="mb-12 lg:mb-8">
          <p className="mono mb-4 text-volt">01 — Proces</p>
          <Reveal as="h2" className="display max-w-4xl text-[clamp(2.2rem,5vw,4.6rem)]">
            De la schiță la mentenanță. Același partener, același standard.
          </Reveal>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="proc-steps relative flex flex-col gap-14 lg:gap-0">
            {STEPS.map((s) => (
              <article key={s.n} className="proc-step lg:pr-10">
                <span className="display block text-[clamp(4.5rem,13vh,9rem)] leading-none text-transparent [-webkit-text-stroke:1.5px_var(--volt)]">
                  {s.n}
                </span>
                <h3 className="display mt-3 text-4xl sm:text-5xl">{s.title}</h3>
                <p className="mt-3 text-xl text-bone">{s.lead}</p>
                <p className="mt-4 max-w-lg leading-relaxed text-bone/60">{s.text}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <li key={t} className="mono rounded-full border border-line px-3 py-1.5 text-bone/80">
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="hidden lg:block">
            <svg viewBox="0 0 560 660" className="w-full max-h-[62vh]" fill="none" role="img" aria-label="Diagramă a ciclului de lucru">
              <path ref={base} d={PATH} stroke="rgba(236,235,228,.14)" strokeWidth="2" strokeLinejoin="round" />
              <path
                ref={drawn}
                d={PATH}
                stroke="var(--volt)"
                strokeWidth="3"
                strokeLinejoin="round"
                style={{ filter: "drop-shadow(0 0 8px rgba(212,255,58,.7))" }}
              />
              {STEPS.map((s) => (
                <g key={s.n} className="proc-node" data-on="true">
                  <circle r="16" fill="var(--ink)" stroke="rgba(236,235,228,.3)" strokeWidth="1.5" />
                  <circle className="node-core" r="7" fill="var(--volt)" />
                  <text className="node-label font-mono" y="-26" fill="var(--bone)" fontSize="12" letterSpacing="1">
                    {s.n} · {s.title.split(" ")[0].toUpperCase()}
                  </text>
                </g>
              ))}
              <g ref={tip}>
                <circle r="14" fill="rgba(212,255,58,.18)" />
                <circle r="5" fill="var(--volt)" />
              </g>
            </svg>
          </div>
        </div>

        <ol className="mono mt-8 hidden grid-cols-5 gap-3 border-t border-line pt-4 lg:grid">
          {STEPS.map((s) => (
            <li
              key={s.n}
              data-rail
              data-active="false"
              className="text-mute transition-colors duration-300 data-[active=true]:text-volt"
            >
              {s.n} {s.title.split(" ")[0]}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
