"use client";

import { useRef } from "react";
import { gsap, NO_MOTION, scrollToId, useGSAP } from "@/lib/gsap";
import { Magnetic } from "./Motion";

const TRACES = [
  "M0 220 H260 L320 280 H620 L680 220 H1100",
  "M0 640 H180 L240 580 H520 L580 640 H900 L960 700 H1440",
  "M1440 180 H1180 L1120 240 H900",
  "M300 900 V760 L360 700 V420 L420 360 H700",
  "M1440 520 H1260 L1200 460 H1000 L940 400 V0",
  "M700 900 V820 L760 760 H1000 L1060 820 H1440",
];

function CircuitField() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div className="field-grid" />
      <div className="field-glow" />
      <svg
        className="hero-traces absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {TRACES.map((d) => (
          <path key={d} d={d} stroke="rgba(236,235,228,.1)" strokeWidth="1.5" />
        ))}
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,transparent_30%,var(--ink)_95%)]" />
    </div>
  );
}

const BRANCHES = [
  { x: 60, label: "ILUM.", rating: "B6", glyph: "L" },
  { x: 126, label: "PRIZE", rating: "B16", glyph: "P" },
  { x: 194, label: "MOTOR", rating: "C16", glyph: "M" },
  { x: 260, label: "CCTV", rating: "B2", glyph: "C" },
];

function SchematicCard() {
  return (
    <div className="hero-card-wrap [perspective:1200px]">
      <div className="hero-card relative w-[330px] rounded-2xl border border-line bg-ink-2/80 p-5 shadow-[0_40px_120px_-30px_rgba(212,255,58,0.25)] backdrop-blur-md [transform-style:preserve-3d]">
        <div className="mono flex items-center justify-between text-mute">
          <span>Schemă monofilară</span>
          <span className="flex items-center gap-1.5 text-volt">
            <span className="rec-dot h-1.5 w-1.5 rounded-full bg-volt" /> live
          </span>
        </div>
        <svg viewBox="0 0 320 350" className="mt-3 w-full" fill="none" role="img" aria-label="Schemă monofilară a unui tablou electric">
          <g stroke="rgba(236,235,228,.55)" strokeWidth="1.5">
            <path d="M160 14V70M160 104V140" />
            <path d="M36 140H284" stroke="var(--volt)" strokeWidth="4" strokeLinecap="round" />
            <rect x="148" y="70" width="24" height="34" rx="3" fill="var(--ink-2)" />
            <path d="M153 98 168 76" />
          </g>
          <text x="182" y="92" fill="var(--bone)" fontSize="10" className="font-mono">
            QF0 · C32
          </text>
          <text x="172" y="22" fill="var(--mute)" fontSize="9" className="font-mono">
            L1 L2 L3 N
          </text>
          {BRANCHES.map((b) => (
            <g key={b.label}>
              <g stroke="rgba(236,235,228,.55)" strokeWidth="1.5">
                <path d={`M${b.x} 140V186M${b.x} 214V280`} />
                <rect x={b.x - 9} y="186" width="18" height="28" rx="3" fill="var(--ink-2)" />
                <path d={`M${b.x - 4} 208 ${b.x + 4} 192`} />
              </g>
              <circle cx={b.x} cy="298" r="15" stroke="var(--volt)" strokeWidth="1.5" fill="rgba(212,255,58,.08)" />
              <text x={b.x} y="302" textAnchor="middle" fill="var(--volt)" fontSize="12" fontWeight="700" className="font-mono">
                {b.glyph}
              </text>
              <text x={b.x} y="332" textAnchor="middle" fill="var(--mute)" fontSize="8.5" className="font-mono">
                {b.label}
              </text>
              <text x={b.x + 13} y="204" fill="var(--bone)" fontSize="8.5" className="font-mono">
                {b.rating}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function Oscilloscope() {
  return (
    <div className="hero-fade">
      <div className="mono mb-2 flex items-center justify-between text-mute">
        <span>230 V ~ 50 Hz</span>
        <span className="text-volt">mișcă cursorul</span>
      </div>
      <svg viewBox="0 0 300 64" className="osc w-64 overflow-visible sm:w-80" fill="none" aria-hidden>
        <line x1="0" y1="32" x2="300" y2="32" stroke="rgba(236,235,228,.15)" strokeDasharray="3 5" />
        <polyline
          className="osc-line"
          points="0,32 300,32"
          stroke="var(--volt)"
          strokeWidth="2"
          strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 0 4px rgba(212,255,58,.8))" }}
        />
      </svg>
    </div>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const mm = gsap.matchMedia();

      mm.add(NO_MOTION, () => {
        /* ---------- intro timeline (waits for loader) ---------- */
        const intro = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
        intro
          .from(".hero-traces", { autoAlpha: 0, duration: 1.6, ease: "power2.out" }, 0)
          .from(".hero-word", { yPercent: 115, rotate: 4, duration: 1.3, stagger: 0.12 }, 0.1)
          .from(".hero-fade", { autoAlpha: 0, y: 28, duration: 1, stagger: 0.1 }, 0.55)
          .from(".hero-card-wrap", { autoAlpha: 0, x: 80, rotateY: -25, duration: 1.4 }, 0.5);
        const play = () => intro.play();
        if (document.documentElement.dataset.ready) play();
        else window.addEventListener("tabus:ready", play, { once: true });

        /* ---------- cursor: glow, card tilt, oscilloscope ---------- */
        const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        const target = { x: el.clientWidth * 0.7, y: el.clientHeight * 0.4 };
        const cur = { ...target };
        const norm = { x: 0.5, y: 0.5 };
        const normCur = { x: 0.5, y: 0.5 };

        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          target.x = e.clientX - r.left;
          target.y = e.clientY - r.top;
          norm.x = gsap.utils.clamp(0, 1, (e.clientX - r.left) / r.width);
          norm.y = gsap.utils.clamp(0, 1, (e.clientY - r.top) / r.height);
        };
        if (fine) el.addEventListener("pointermove", onMove);

        const rotX = gsap.quickTo(".hero-card", "rotationX", { duration: 0.8, ease: "power3.out" });
        const rotY = gsap.quickTo(".hero-card", "rotationY", { duration: 0.8, ease: "power3.out" });

        const line = el.querySelector<SVGPolylineElement>(".osc-line")!;
        let t = 0;
        const tick = (_: number, dt: number) => {
          cur.x += (target.x - cur.x) * 0.12;
          cur.y += (target.y - cur.y) * 0.12;
          el.style.setProperty("--mx", `${cur.x}px`);
          el.style.setProperty("--my", `${cur.y}px`);

          normCur.x += (norm.x - normCur.x) * 0.06;
          normCur.y += (norm.y - normCur.y) * 0.06;
          const freq = 0.025 + normCur.x * 0.05;
          const amp = 6 + (1 - normCur.y) * 22;
          t += dt * 0.0045;
          let pts = "";
          for (let x = 0; x <= 300; x += 4) {
            const y = 32 + Math.sin(x * freq - t) * amp + Math.sin(x * freq * 3 - t * 2) * amp * 0.12;
            pts += `${x},${y.toFixed(1)} `;
          }
          line.setAttribute("points", pts);
        };
        gsap.ticker.add(tick);

        const onCardMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          rotY(((e.clientX - r.left) / r.width - 0.5) * 16);
          rotX(-((e.clientY - r.top) / r.height - 0.5) * 12);
        };
        if (fine) el.addEventListener("pointermove", onCardMove);

        /* ---------- scroll: content drifts away ---------- */
        gsap.to(".hero-content", {
          yPercent: -14,
          autoAlpha: 0.1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".hero-traces", {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });

        return () => {
          gsap.ticker.remove(tick);
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointermove", onCardMove);
          window.removeEventListener("tabus:ready", play);
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="top"
      ref={root}
      className="relative isolate min-h-[100svh] overflow-hidden"
      style={{ ["--mx" as string]: "70%", ["--my" as string]: "40%" }}
    >
      <CircuitField />

      <div className="hero-content hero-offset-top wrap relative z-10 flex min-h-[100svh] flex-col justify-between pb-10">
        <div className="flex flex-col gap-10">
          <p className="hero-fade mono flex flex-wrap items-center gap-x-4 gap-y-2 text-mute">
            <span className="flex items-center gap-2 text-volt">
              <span className="rec-dot h-2 w-2 rounded-full bg-volt" />
              Sistem online
            </span>
            <span>Instalații electrice</span>
            <span className="text-line">/</span>
            <span>Automatizări</span>
            <span className="text-line">/</span>
            <span>CCTV</span>
          </p>

          <h1 className="display text-[clamp(3rem,9.4vw,9rem)]">
            {["Proiectăm.", "Executăm.", "Automatizăm."].map((w, i) => (
              <span key={w} className="block overflow-hidden pb-[0.1em] pt-[0.02em]">
                <span className={`hero-word block origin-left ${i === 2 ? "text-volt" : ""}`}>{w}</span>
              </span>
            ))}
          </h1>

          <p className="hero-fade max-w-xl text-lg leading-relaxed text-bone/70 sm:text-xl">
            Instalații electrice, automatizări industriale și sisteme CCTV — de la proiect la punere în
            funcțiune și mentenanță. Pentru locuințe, spații comerciale și industrie.
          </p>

          <div className="hero-fade flex flex-wrap items-center gap-4">
            <Magnetic>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("contact");
                }}
                className="btn btn-volt"
              >
                Solicită o ofertă
                <span aria-hidden>→</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#proces"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("proces");
                }}
                className="btn btn-ghost"
              >
                Cum lucrăm
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-end justify-between gap-8">
          <Oscilloscope />
          <dl className="hero-fade mono grid grid-cols-3 gap-6 text-mute sm:gap-12">
            {[
              ["JT + MT", "instalații"],
              ["Proiect → mentenanță", "ciclu complet"],
              ["Rezidențial + industrial", "orice scară"],
            ].map(([a, b]) => (
              <div key={a}>
                <dt className="text-bone">{a}</dt>
                <dd>{b}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="absolute right-[max(1.5rem,calc((100vw-1400px)/2+3rem))] top-1/2 z-10 hidden -translate-y-[46%] xl:block">
        <SchematicCard />
      </div>
    </section>
  );
}
