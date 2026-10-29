"use client";

import { useRef } from "react";
import { gsap, NO_MOTION, useGSAP } from "@/lib/gsap";

const PHASES = [
  { n: "01", label: "Proiectare", text: "Releveu, calcul de sarcină, scheme monofilare și dimensionarea protecțiilor." },
  { n: "02", label: "Execuție", text: "Posturi, tablouri, trasee de cabluri, iluminat, forță și comandă." },
  { n: "03", label: "Punere în funcțiune", text: "Verificări, măsurători, parametrizare PLC și CCTV, apoi predare." },
  { n: "04", label: "Mentenanță", text: "Revizii, depanare, diagnosticare și remedierea defectelor." },
];

/** Start time of each phase inside the master timeline (seconds). */
const PHASE_AT = [0, 3.6, 7.6, 11.4];

const BRIGHT = "rgba(236,235,228,.88)";
const DIM = "rgba(236,235,228,.32)";

/** Cables, in the direction the current flows. */
const CABLES = [
  "M102 160 Q132 192 170 312",
  "M94 212 Q126 250 170 312",
  "M190 400 V424 H272 V400",
  "M284 316 V260 H498",
  "M306 352 H347 V318",
  "M364 305 H378 V366",
];

const LAMPS = [330, 386, 442];

const CHECKS: [number, number][] = [
  [210, 332],
  [306, 316],
  [392, 366],
  [518, 262],
];

export default function HeroScene() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const mm = gsap.matchMedia();

      mm.add(NO_MOTION, () => {
        const pills = gsap.utils.toArray<HTMLElement>(".hs-pill");
        const cap = el.querySelector<HTMLElement>(".hs-cap")!;
        const step = el.querySelector<HTMLElement>(".hs-step")!;
        const structure = gsap.utils.toArray<SVGGeometryElement>(".hs-s > *");
        const cables = gsap.utils.toArray<SVGGeometryElement>(".hs-cable");

        const setPhase = (i: number) => {
          pills.forEach((p, k) => {
            p.dataset.on = String(k === i);
          });
          step.textContent = `${PHASES[i].n} / 04`;
          gsap.fromTo(cap, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.4, overwrite: true });
          cap.textContent = PHASES[i].text;
        };

        /* always-running loops (kept outside the master timeline so it can repeat) */
        const spin = gsap.to(".hs-spin", {
          rotation: 360,
          svgOrigin: "378 380",
          duration: 1.2,
          ease: "none",
          repeat: -1,
          paused: true,
        });
        const flow = gsap.to(".hs-flow", { strokeDashoffset: -48, duration: 1.8, ease: "none", repeat: -1 });
        const blink = gsap.to(".hs-led", {
          opacity: 0.2,
          duration: 0.45,
          ease: "steps(1)",
          yoyo: true,
          repeat: -1,
          stagger: 0.17,
        });

        /* ---------- master timeline ---------- */
        const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.3, defaults: { ease: "power2.out" } });
        /* progress rule hits each phase node exactly when that phase starts */
        PHASE_AT.forEach((at, i) => {
          const end = i === PHASE_AT.length - 1 ? 15.4 : PHASE_AT[i + 1];
          const from = i / PHASES.length;
          const to = (i + 1) / PHASES.length;
          if (i === 0) tl.fromTo(".hs-bar", { scaleX: from }, { scaleX: to, duration: end - at, ease: "none" }, at);
          else tl.to(".hs-bar", { scaleX: to, duration: end - at, ease: "none" }, at);
        });

        tl.set(".hs-scene", { autoAlpha: 1 }, 0)
          .call(
            () => {
              setPhase(0);
              spin.pause();
              spin.timeScale(1);
            },
            [],
            0,
          )

          /* 01 · Proiectare: the plan draws itself, with dimensions */
          .fromTo(".hs-s", { stroke: DIM }, { stroke: BRIGHT, duration: 0.8 }, PHASE_AT[1]);
        structure.forEach((s, i) => {
          const len = s.getTotalLength();
          tl.fromTo(
            s,
            { strokeDasharray: len, strokeDashoffset: len },
            { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" },
            0.15 + i * 0.07,
          );
        });
        tl.fromTo(".hs-dim", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, stagger: 0.12 }, 1.4).to(
          ".hs-dim",
          { autoAlpha: 0, duration: 0.4 },
          PHASE_AT[1] - 0.1,
        );

        /* 02 · Execuție: cables are pulled, equipment installed */
        tl.call(() => setPhase(1), [], PHASE_AT[1]);
        cables.forEach((c, i) => {
          const len = c.getTotalLength();
          tl.fromTo(
            c,
            { strokeDasharray: len, strokeDashoffset: len },
            { strokeDashoffset: 0, duration: 0.9, ease: "power1.inOut" },
            3.9 + i * 0.3,
          );
        });
        tl.fromTo(
          ".hs-dev",
          { autoAlpha: 0, scale: 0.5 },
          { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)", stagger: 0.12 },
          4.6,
        ).fromTo(".hs-tag", { autoAlpha: 0, y: 4 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.1 }, 5.4);

        /* 03 · Punere în funcțiune: power on */
        tl.call(
          () => {
            setPhase(2);
            spin.play();
          },
          [],
          PHASE_AT[2],
        )
          .fromTo(".hs-flow", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, PHASE_AT[2] + 0.2)
          .fromTo(".hs-lcone", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, stagger: 0.15 }, PHASE_AT[2] + 0.6)
          .fromTo(".hs-ccone", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, PHASE_AT[2] + 1.5);

        /* 04 · Mentenanță: a fault is found and fixed */
        tl.call(() => setPhase(3), [], PHASE_AT[3])
          .fromTo(
            ".hs-warn",
            { autoAlpha: 0, scale: 0 },
            { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(3)" },
            PHASE_AT[3] + 0.3,
          )
          .to(spin, { timeScale: 0.12, duration: 0.5 }, PHASE_AT[3] + 0.3)
          .to(".hs-warn", { autoAlpha: 0, scale: 0, duration: 0.25 }, PHASE_AT[3] + 1.5)
          .to(spin, { timeScale: 1, duration: 0.6 }, PHASE_AT[3] + 1.5)
          .fromTo(
            ".hs-chk",
            { autoAlpha: 0, scale: 0 },
            { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(3)", stagger: 0.15 },
            PHASE_AT[3] + 1.6,
          )
          .to(".hs-scene", { autoAlpha: 0, duration: 0.6 }, 15.4);

        /* start once the loader is gone */
        const play = () => tl.play(0);
        if (document.documentElement.dataset.ready) play();
        else window.addEventListener("tabus:ready", play, { once: true });

        /* click a phase to jump to it */
        const onPill = (e: Event) => {
          const i = Number((e.currentTarget as HTMLElement).dataset.i);
          tl.seek(PHASE_AT[i] + 0.01, true).play();
          setPhase(i);
          if (i >= 2) spin.play();
          else spin.pause();
        };
        pills.forEach((p) => p.addEventListener("click", onPill));

        return () => {
          window.removeEventListener("tabus:ready", play);
          pills.forEach((p) => p.removeEventListener("click", onPill));
          tl.kill();
          spin.kill();
          flow.kill();
          blink.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="hero-card-wrap [perspective:1200px]">
      <div className="hero-card relative w-[min(40vw,640px)] [transform-style:preserve-3d]">
        <div className="mono flex items-center justify-between text-mute">
          <span>Ciclul unui proiect</span>
          <span className="flex items-center gap-2 text-volt">
            <span className="rec-dot h-1.5 w-1.5 rounded-full bg-volt" />
            <span className="hs-step">04 / 04</span>
          </span>
        </div>

        {/* drawing sits straight on the hero grid, framed only by registration marks */}
        <div className="relative mt-4">
          <span aria-hidden className="pointer-events-none absolute -left-3 -top-3 h-3 w-3 border-l border-t border-bone/35" />
          <span aria-hidden className="pointer-events-none absolute -right-3 -top-3 h-3 w-3 border-r border-t border-bone/35" />
          <span aria-hidden className="pointer-events-none absolute -bottom-3 -left-3 h-3 w-3 border-b border-l border-bone/35" />
          <span aria-hidden className="pointer-events-none absolute -bottom-3 -right-3 h-3 w-3 border-b border-r border-bone/35" />
        <svg
          viewBox="0 96 560 344"
          className="w-full"
          fill="none"
          role="img"
          aria-label="Animație: un proiect electric de la schiță la execuție, punere în funcțiune și mentenanță"
        >
          <g className="hs-scene">
            {/* light and camera beams sit behind the structure */}
            {LAMPS.map((x) => (
              <path
                key={x}
                className="hs-lcone"
                d={`M${x - 6} 271 L${x - 30} 398 L${x + 30} 398 L${x + 6} 271 Z`}
                fill="rgba(212,255,58,.07)"
              />
            ))}
            <path
              className="hs-ccone"
              d="M498 270 L392 346 L428 398 Z"
              fill="rgba(212,255,58,.07)"
              stroke="rgba(212,255,58,.5)"
              strokeDasharray="3 4"
            />

            {/* structure: ground, pylon, substation, hall, equipment */}
            <g
              className="hs-s"
              stroke={BRIGHT}
              strokeWidth="1.6"
              strokeLinecap="butt"
              strokeLinejoin="round"
              fill="none"
            >
              <path d="M10 400H550" />
              <path d="M70 118 L50 400" />
              <path d="M70 118 L90 400" />
              <path d="M38 160H102" />
              <path d="M46 212H94" />
              <path d="M63 212 L83 300 M77 212 L57 300" />
              <circle cx="102" cy="160" r="2.5" />
              <circle cx="38" cy="160" r="2.5" />
              <circle cx="94" cy="212" r="2.5" />
              <circle cx="46" cy="212" r="2.5" />
              <rect x="130" y="332" width="80" height="68" rx="4" />
              <path d="M130 332 L170 312 L210 332" />
              <rect x="152" y="356" width="36" height="44" rx="2" />
              <rect x="250" y="252" width="272" height="148" />
              <path d="M240 254 L386 204 L532 254" />
              <rect x="262" y="316" width="44" height="84" rx="3" />
              <rect x="352" y="360" width="122" height="40" rx="3" />
              <rect x="408" y="346" width="60" height="10" rx="5" />
              <rect x="424" y="332" width="16" height="14" rx="2" />
              <rect x="330" y="292" width="34" height="26" rx="3" />
              <rect x="498" y="262" width="20" height="10" rx="2" />
              {LAMPS.map((x) => (
                <path key={x} d={`M${x - 9} 262 h18 l-5 9 h-8 z`} />
              ))}
            </g>

            {/* cables (drawn in during execution) with a flowing overlay once powered */}
            <g stroke="var(--volt)" strokeWidth="2" strokeLinecap="butt" strokeLinejoin="round" fill="none">
              {CABLES.map((d) => (
                <path key={d} className="hs-cable" d={d} />
              ))}
            </g>
            <g stroke="#fff" strokeWidth="2.6" strokeDasharray="3 9" strokeLinecap="round" fill="none">
              {CABLES.map((d) => (
                <path key={d} className="hs-flow" d={d} />
              ))}
            </g>

            {/* equipment that pops in */}
            <g className="hs-dev" stroke="var(--volt)" strokeWidth="1.5">
              <circle cx="165" cy="378" r="7" />
              <circle cx="176" cy="378" r="7" />
            </g>
            <g className="hs-dev" stroke="var(--volt)" strokeWidth="1.5">
              {[324, 338, 352, 366].flatMap((y) => [268, 288].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="12" height="8" rx="1.5" />))}
            </g>
            <g className="hs-dev" fill="var(--volt)">
              <circle className="hs-led" cx="338" cy="300" r="2.2" />
              <circle className="hs-led" cx="347" cy="300" r="2.2" />
              <circle className="hs-led" cx="356" cy="300" r="2.2" />
              <rect x="336" y="306" width="22" height="5" rx="1.5" fill="rgba(212,255,58,.35)" />
            </g>
            <g className="hs-dev">
              <circle cx="378" cy="380" r="14" stroke="var(--volt)" strokeWidth="1.8" fill="var(--ink-2)" />
              <g className="hs-spin" stroke="var(--volt)" strokeWidth="2" strokeLinecap="round">
                <path d="M378 380 V370" />
                <path d="M378 380 L386.7 385" />
                <path d="M378 380 L369.3 385" />
              </g>
              <circle cx="378" cy="380" r="2.2" fill="var(--volt)" />
            </g>
            <g className="hs-dev" fill="var(--volt)">
              <circle className="hs-led" cx="502" cy="267" r="2.6" />
            </g>

            {/* labels */}
            <g className="font-mono" fontSize="10" fill="rgba(236,235,228,.7)">
              <text className="hs-tag" x="108" y="150">MT 20 kV</text>
              <text className="hs-tag" x="204" y="438">JT 0,4 kV</text>
              <text className="hs-tag" x="332" y="287">PLC</text>
              <text className="hs-tag" x="352" y="355">MOTOR</text>
              <text className="hs-tag" x="470" y="246">CCTV</text>
            </g>

            {/* blueprint annotations (phase 1 only) */}
            <g className="hs-dim" opacity="0" stroke="rgba(212,255,58,.7)" strokeWidth="1" fill="none">
              <path d="M250 190 H522 M250 184 V196 M522 184 V196" />
              <path d="M22 118 V400 M16 118 H28 M16 400 H28" />
              <rect x="430" y="104" width="120" height="34" rx="2" />
              <text x="370" y="184" textAnchor="middle" className="font-mono" fontSize="10" fill="rgba(212,255,58,.9)" stroke="none">42,0 m</text>
              <text x="26" y="262" className="font-mono" fontSize="10" fill="rgba(212,255,58,.9)" stroke="none">18 m</text>
              <text x="126" y="418" className="font-mono" fontSize="10" fill="rgba(212,255,58,.9)" stroke="none">630 kVA</text>
              <text x="282" y="416" className="font-mono" fontSize="10" fill="rgba(212,255,58,.9)" stroke="none">3×400 V</text>
              <text x="440" y="119" className="font-mono" fontSize="10" fill="rgba(212,255,58,.9)" stroke="none">PROIECT TEHNIC</text>
              <text x="440" y="132" className="font-mono" fontSize="9" fill="rgba(212,255,58,.6)" stroke="none">scara 1:50</text>
            </g>

            {/* maintenance: fault, then OK badges */}
            <g transform="translate(392 366)">
              <g className="hs-warn" opacity="0">
                <circle r="8" fill="#ffb020" />
                <text y="3.6" textAnchor="middle" fontSize="11" fontWeight="700" fill="#07090d" className="font-mono">!</text>
              </g>
            </g>
            {CHECKS.map(([x, y]) => (
              <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
                <g className="hs-chk">
                  <circle r="7.5" fill="var(--volt)" />
                  <path d="M-3.6 0.2 L-1 3 L3.6 -3" stroke="#07090d" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </g>
              </g>
            ))}
          </g>
        </svg>
        </div>

        {/* timeline: a rule that fills as the project moves through its phases */}
        <div className="relative mt-9">
          <div className="absolute inset-x-0 top-0 h-px bg-line" />
          <div className="hs-bar absolute left-0 top-[-0.5px] h-[2px] w-full origin-left bg-volt" />
          <ul className="relative grid grid-cols-4">
            {PHASES.map((p, i) => (
              <li key={p.n}>
                <button
                  type="button"
                  data-i={i}
                  data-on={i === PHASES.length - 1}
                  aria-label={`${p.n} ${p.label}`}
                  className="hs-pill group mono relative block w-full pr-3 pt-4 text-left text-[0.62rem] leading-tight text-mute transition-colors duration-300 hover:text-bone data-[on=true]:text-bone"
                >
                  <span className="absolute left-0 top-[-4px] h-[9px] w-[9px] border border-line bg-ink transition-colors duration-300 group-data-[on=true]:border-volt group-data-[on=true]:bg-volt" />
                  <span className="block text-volt opacity-0 transition-opacity duration-300 group-data-[on=true]:opacity-100">{p.n}</span>
                  <span className="block">{p.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <p className="hs-cap mt-5 min-h-[2.8em] max-w-md text-sm leading-snug text-bone/75">
          {PHASES[PHASES.length - 1].text}
        </p>
      </div>
    </div>
  );
}
