"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { STEPS } from "@/data/site";
import { Reveal } from "./Motion";

/* ---------- the bus: three parallel traces (L1 L2 L3) routed with 45° bends ---------- */
type Pt = [number, number];

const ROUTE: Pt[] = [
  [30, 70],
  [150, 70],
  [200, 120],
  [200, 200],
  [250, 250],
  [370, 250],
  [420, 300],
  [420, 380],
  [470, 430],
  [540, 430],
];

/** Parallel copy of a polyline, mitered at the corners. */
function offsetPath(pts: Pt[], d: number) {
  const dirs = pts.slice(1).map((p, i) => {
    const dx = p[0] - pts[i][0];
    const dy = p[1] - pts[i][1];
    const l = Math.hypot(dx, dy);
    return [dx / l, dy / l] as Pt;
  });
  const normal = ([dx, dy]: Pt): Pt => [-dy, dx];
  const out = pts.map((p, i) => {
    const a = dirs[i - 1];
    const b = dirs[i];
    if (!a) {
      const n = normal(b);
      return [p[0] + n[0] * d, p[1] + n[1] * d];
    }
    if (!b) {
      const n = normal(a);
      return [p[0] + n[0] * d, p[1] + n[1] * d];
    }
    const na = normal(a);
    const nb = normal(b);
    const k = 1 + na[0] * nb[0] + na[1] * nb[1];
    return [p[0] + ((na[0] + nb[0]) / k) * d, p[1] + ((na[1] + nb[1]) / k) * d];
  });
  return out.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
}

const LANES = [-7, 0, 7];
const LANE_PATHS = LANES.map((d) => offsetPath(ROUTE, d));

/** Side routes ending in vias, like unused traces on a board. */
const STUBS: { d: string; end: Pt }[] = [
  { d: "M150 70 V28 H230", end: [230, 28] },
  { d: "M200 200 H120 V262", end: [120, 262] },
  { d: "M250 250 V300 H300", end: [300, 300] },
  { d: "M370 250 V200 H440", end: [440, 200] },
  { d: "M420 380 H490 V340", end: [490, 340] },
];

/** Where each label sits relative to its station: [dx, dy, anchor]. */
const LABELS: [number, number, "start" | "end"][] = [
  [-18, -26, "start"],
  [-24, 5, "end"],
  [-18, -26, "start"],
  [-24, 5, "end"],
  [18, 38, "end"],
];

const DIM = "rgba(236,235,228,.14)";

export default function Lifecycle() {
  const root = useRef<HTMLElement>(null);
  const base = useRef<SVGPathElement>(null);
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
        const drawn = gsap.utils.toArray<SVGPathElement>(".proc-drawn", section);
        const path = base.current!;
        const len = path.getTotalLength();
        const lens = drawn.map((d) => d.getTotalLength());
        const n = steps.length;

        // place nodes along the path at equal fractions of its length
        nodes.forEach((node, i) => {
          const pt = path.getPointAtLength((i / (n - 1)) * len);
          node.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
          const label = node.querySelector("text.node-label")!;
          const [dx, dy, anchor] = LABELS[i] ?? LABELS[0];
          label.setAttribute("x", String(dx));
          label.setAttribute("y", String(dy));
          label.setAttribute("text-anchor", anchor);
        });

        drawn.forEach((d, i) => gsap.set(d, { strokeDasharray: lens[i], strokeDashoffset: lens[i] }));
        gsap.set(steps.slice(1), { autoAlpha: 0, y: 40 });

        let lastIdx = -1;
        const render = (p: number) => {
          drawn.forEach((d, i) => {
            d.style.strokeDashoffset = String(lens[i] * (1 - p));
          });
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
          gsap.set([...steps, ...drawn], { clearProps: "all" });
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
    <section id="proces" ref={root} className="proc relative flex flex-col justify-center bg-ink py-24 lg:py-0">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
          {/* left: heading, then the active step */}
          <div className="flex flex-col">
            <div className="mb-10 lg:mb-9">
              <p className="section-label mb-4 text-volt">01 — Proces</p>
              <Reveal as="h2" className="display max-w-xl text-[clamp(2rem,3.7vw,3.5rem)] leading-[0.98]">
                De la schiță la mentenanță. Același partener, același standard.
              </Reveal>
            </div>

            <div className="proc-steps relative flex flex-col gap-14 lg:gap-0">
              {STEPS.map((s) => (
                <article key={s.n} className="proc-step">
                  <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                    <span className="display shrink-0 text-[clamp(3.25rem,9vh,6.5rem)] leading-none text-transparent [-webkit-text-stroke:1.5px_var(--volt)]">
                      {s.n}
                    </span>
                    <h3 className="display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-none">{s.title}</h3>
                  </div>
                  <p className="mt-4 text-xl text-bone">{s.lead}</p>
                  <p className="mt-3 max-w-xl text-lg leading-relaxed text-bone/70 sm:text-xl sm:leading-relaxed">{s.text}</p>
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
          </div>

          {/* right: the bus */}
          <div className="hidden lg:flex lg:items-center lg:justify-center">
            <svg
              viewBox="0 0 570 520"
              className="w-full max-h-[64svh]"
              fill="none"
              role="img"
              aria-label="Magistrală cu trei trasee care parcurge cele cinci etape ale ciclului de lucru"
            >
              {/* board decoration: unused traces with vias, and a controller footprint */}
              <g stroke={DIM} strokeWidth="1.5" strokeLinejoin="round">
                {STUBS.map((s) => (
                  <g key={s.d}>
                    <path d={s.d} />
                    <circle cx={s.end[0]} cy={s.end[1]} r="4.5" fill="var(--ink)" />
                  </g>
                ))}
                <rect x="36" y="372" width="86" height="58" rx="4" />
                {[0, 1, 2, 3, 4].map((i) => (
                  <g key={i}>
                    <path d={`M${50 + i * 17} 372 v-9`} />
                    <path d={`M${50 + i * 17} 430 v9`} />
                  </g>
                ))}
                <text x="79" y="405" textAnchor="middle" fill={DIM} stroke="none" fontSize="11" className="font-mono">
                  PLC
                </text>
                <rect x="4" y="54" width="12" height="32" rx="2" />
                <rect x="548" y="414" width="12" height="32" rx="2" />
              </g>

              {/* base traces */}
              {LANE_PATHS.map((d, i) => (
                <path
                  key={d}
                  ref={i === 1 ? base : undefined}
                  d={d}
                  stroke="rgba(236,235,228,.16)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              ))}

              {/* energised traces, drawn as you scroll */}
              {LANE_PATHS.map((d, i) => (
                <path
                  key={`on-${d}`}
                  className="proc-drawn"
                  d={d}
                  stroke="var(--volt)"
                  strokeOpacity={i === 1 ? 1 : 0.5}
                  strokeWidth={i === 1 ? 2.6 : 2}
                  strokeLinejoin="round"
                  style={i === 1 ? { filter: "drop-shadow(0 0 7px rgba(212,255,58,.65))" } : undefined}
                />
              ))}

              {STEPS.map((s) => (
                <g key={s.n} className="proc-node" data-on="true">
                  <circle r="19" fill="var(--ink)" stroke="rgba(236,235,228,.3)" strokeWidth="1.5" />
                  <circle r="12" fill="none" stroke="rgba(236,235,228,.14)" strokeWidth="1" />
                  <circle className="node-core" r="7" fill="var(--volt)" />
                  <text className="node-label font-mono" fill="var(--bone)" fontSize="12" letterSpacing="1">
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
      </div>
    </section>
  );
}
