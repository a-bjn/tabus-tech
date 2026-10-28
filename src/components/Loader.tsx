"use client";

import { useRef } from "react";
import { gsap, NO_MOTION, REDUCED_MOTION, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { LogoMark } from "./Logo";

/* ---------- palette (kept local so the illustration stays self-contained) ---------- */
const SKIN_CLIENT = "#f1c9a5";
const SKIN_WORKER = "#c98f64";
const JACKET = "#34404f";
const TROUSERS = "#232b37";
const GLOVE = "#2b3441";
const BOOT = "#141922";
const OUTLINE = "rgba(236,235,228,.22)";

/** Arm drawn as shoulder → elbow → hand. The elbow bows downward. */
function armPath(sx: number, sy: number, hx: number, hy: number, bend: number) {
  const mx = (sx + hx) / 2;
  const my = (sy + hy) / 2;
  const dx = hx - sx;
  const dy = hy - sy;
  const len = Math.hypot(dx, dy) || 1;
  let px = -dy / len;
  let py = dx / len;
  if (py < 0) {
    px = -px;
    py = -py;
  }
  return `M${sx} ${sy} L${mx + px * bend} ${my + py * bend} L${hx} ${hy}`;
}

function Face({ y = 0 }: { y?: number }) {
  return (
    <g transform={`translate(0 ${y})`}>
      {/* calm, friendly */}
      <g className="face-neutral">
        <circle cx="-12" cy="118" r="3.4" fill="#1b1f27" />
        <circle cx="12" cy="118" r="3.4" fill="#1b1f27" />
        <path d="M-11 133 Q0 142 11 133" stroke="#1b1f27" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      {/* very pleased: squinting eyes, wide smile, cheeks */}
      <g className="face-happy" style={{ opacity: 0, visibility: "hidden" }}>
        <path d="M-18 120 Q-12 111 -6 120" stroke="#1b1f27" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M6 120 Q12 111 18 120" stroke="#1b1f27" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M-15 129 Q0 152 15 129Z" fill="#8c2f2f" />
        <path d="M-12.5 130 H12.5 Q0 136 -12.5 130Z" fill="#fff" />
        <circle cx="-23" cy="132" r="5.5" fill="rgba(255,120,100,.45)" />
        <circle cx="23" cy="132" r="5.5" fill="rgba(255,120,100,.45)" />
      </g>
    </g>
  );
}

function Client() {
  return (
    <g className="ch-client">
      {/* legs + shoes */}
      <rect x="-26" y="282" width="22" height="70" rx="6" fill={TROUSERS} stroke={OUTLINE} />
      <rect x="4" y="282" width="22" height="70" rx="6" fill={TROUSERS} stroke={OUTLINE} />
      <rect x="-30" y="346" width="28" height="14" rx="6" fill={BOOT} stroke={OUTLINE} />
      <rect x="2" y="346" width="28" height="14" rx="6" fill={BOOT} stroke={OUTLINE} />
      {/* idle arm (outer side) */}
      <path d="M-34 190 Q-50 232 -44 272" stroke={OUTLINE} strokeWidth="22" strokeLinecap="round" fill="none" />
      <path d="M-34 190 Q-50 232 -44 272" stroke={JACKET} strokeWidth="18" strokeLinecap="round" fill="none" />
      <circle cx="-44" cy="276" r="10" fill={SKIN_CLIENT} />
      {/* torso: jacket, shirt, tie */}
      <rect x="-40" y="168" width="80" height="130" rx="24" fill={JACKET} stroke={OUTLINE} />
      <path d="M-14 168 L0 216 L14 168Z" fill="#f4f3ee" />
      <path d="M-4 192 H4 L7 232 L0 242 L-7 232Z" fill="var(--volt)" />
      <path d="M-14 168 L-22 232 M14 168 L22 232" stroke={TROUSERS} strokeWidth="2" />
      {/* neck + head */}
      <rect x="-8" y="150" width="16" height="22" rx="5" fill={SKIN_CLIENT} />
      <circle cx="-33" cy="124" r="6" fill={SKIN_CLIENT} />
      <circle cx="33" cy="124" r="6" fill={SKIN_CLIENT} />
      <circle cx="0" cy="120" r="34" fill={SKIN_CLIENT} />
      <path d="M-35 118 C-40 76 40 76 35 118 C30 100 -30 100 -35 118Z" fill="#5a3b26" />
      <Face />
    </g>
  );
}

function Worker() {
  return (
    <g className="ch-worker">
      {/* coverall legs, reflective bands, boots */}
      <rect x="-26" y="282" width="22" height="70" rx="6" fill="var(--volt)" />
      <rect x="4" y="282" width="22" height="70" rx="6" fill="var(--volt)" />
      <rect x="-26" y="318" width="22" height="6" fill="#f4f3ee" opacity=".9" />
      <rect x="4" y="318" width="22" height="6" fill="#f4f3ee" opacity=".9" />
      <rect x="-30" y="344" width="28" height="16" rx="6" fill={BOOT} stroke={OUTLINE} />
      <rect x="2" y="344" width="28" height="16" rx="6" fill={BOOT} stroke={OUTLINE} />
      {/* idle arm (outer side) */}
      <path d="M34 190 Q50 232 44 272" stroke="#a8c92a" strokeWidth="22" strokeLinecap="round" fill="none" />
      <path d="M34 190 Q50 232 44 272" stroke="var(--volt)" strokeWidth="18" strokeLinecap="round" fill="none" />
      <circle cx="44" cy="276" r="10.5" fill={GLOVE} />
      {/* coverall torso */}
      <rect x="-40" y="168" width="80" height="130" rx="24" fill="var(--volt)" />
      <rect x="-40" y="226" width="80" height="8" fill="#f4f3ee" opacity=".9" />
      <path d="M0 182 V298" stroke="rgba(7,9,13,.3)" strokeWidth="2" />
      <path d="M-15 168 L0 186 L15 168Z" fill="#a8c92a" />
      <rect x="-30" y="192" width="22" height="22" rx="3" fill="none" stroke="rgba(7,9,13,.35)" strokeWidth="2" />
      {/* tool belt */}
      <rect x="-40" y="276" width="80" height="12" fill="#3b2f26" />
      <rect x="14" y="278" width="18" height="22" rx="3" fill="#5a4636" />
      <rect x="-30" y="278" width="10" height="18" rx="2" fill="#5a4636" />
      {/* neck + head */}
      <rect x="-8" y="150" width="16" height="22" rx="5" fill={SKIN_WORKER} />
      <circle cx="0" cy="120" r="34" fill={SKIN_WORKER} />
      <Face y={7} />
      {/* hard hat */}
      <path d="M-37 110 A37 37 0 0 1 37 110Z" fill="#f4f3ee" />
      <rect x="-6" y="72" width="12" height="38" rx="4" fill="#d9d7ca" />
      <rect x="-43" y="106" width="86" height="9" rx="4.5" fill="#e3e1d6" />
    </g>
  );
}

const SPARKS: [number, number][] = [
  [372, 204],
  [430, 198],
  [350, 244],
  [452, 246],
  [400, 282],
];

export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      const finish = () => {
        html.classList.remove("is-loading");
        html.dataset.ready = "true";
        window.dispatchEvent(new Event("tabus:ready"));
        ScrollTrigger.refresh();
      };

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION, () => {
        gsap.set(root.current, { display: "none" });
        finish();
      });

      mm.add(NO_MOTION, () => {
        html.classList.add("is-loading");
        const el = root.current!;
        const q = <T extends Element>(s: string) => el.querySelector<T>(s)!;

        const client = q<SVGGElement>(".ch-client");
        const worker = q<SVGGElement>(".ch-worker");
        const armC = q<SVGPathElement>(".arm-c");
        const armCo = q<SVGPathElement>(".arm-c-o");
        const armW = q<SVGPathElement>(".arm-w");
        const armWo = q<SVGPathElement>(".arm-w-o");
        const handC = q<SVGCircleElement>(".hand-c");
        const handW = q<SVGCircleElement>(".hand-w");
        const check = q<SVGPathElement>(".deal-check");
        const checkLen = check.getTotalLength();
        gsap.set(check, { strokeDasharray: checkLen, strokeDashoffset: checkLen });

        // One state object drives both people; render() redraws from it.
        const S = { cx: -130, wx: 930, phase: 0, r: 0, py: 0 };
        const MEET_X = 400;
        const MEET_Y = 240;

        const render = () => {
          const bob = -Math.abs(Math.sin(S.phase)) * 9 + S.py * 0.18;
          client.setAttribute("transform", `translate(${S.cx} ${bob})`);
          worker.setAttribute("transform", `translate(${S.wx} ${bob})`);

          const my = MEET_Y + S.py;
          const bend = 3 + 19 * S.r;

          // client reaches with the right arm, worker with the left
          const csx = S.cx + 34;
          const csy = 192 + bob;
          const crx = S.cx + 42;
          const cry = 274 + bob;
          const chx = crx + (MEET_X - 6 - crx) * S.r;
          const chy = cry + (my - cry) * S.r;
          const dC = armPath(csx, csy, chx, chy, bend);
          armC.setAttribute("d", dC);
          armCo.setAttribute("d", dC);
          handC.setAttribute("cx", String(chx));
          handC.setAttribute("cy", String(chy));

          const wsx = S.wx - 34;
          const wsy = 192 + bob;
          const wrx = S.wx - 42;
          const wry = 274 + bob;
          const whx = wrx + (MEET_X + 6 - wrx) * S.r;
          const why = wry + (my - wry) * S.r;
          const dW = armPath(wsx, wsy, whx, why, bend);
          armW.setAttribute("d", dW);
          armWo.setAttribute("d", dW);
          handW.setAttribute("cx", String(whx));
          handW.setAttribute("cy", String(why));
        };
        render();

        const p = { v: 0 };
        const tl = gsap.timeline({ onComplete: finish });

        tl.from(".ld-fade", { autoAlpha: 0, y: 20, duration: 0.6, stagger: 0.08, ease: "power3.out" }, 0)
          // 1. both walk in, with a little step bounce (5 steps)
          .to(S, { cx: 305, duration: 1.0, ease: "power2.out", onUpdate: render }, 0.25)
          .to(S, { wx: 495, duration: 1.0, ease: "power2.out", onUpdate: render }, 0.25)
          .to(S, { phase: Math.PI * 4, duration: 1.0, ease: "power1.out", onUpdate: render }, 0.25)
          // 2. reach out and meet in the middle
          .to(S, { r: 1, duration: 0.5, ease: "power2.inOut", onUpdate: render }, 1.4)
          // 3. the deal: faces light up, badge and sparks pop
          .to(".face-neutral", { autoAlpha: 0, duration: 0.1 }, 1.9)
          .to(".face-happy", { autoAlpha: 1, duration: 0.2 }, 1.9)
          .fromTo(
            ".deal-badge",
            { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%" },
            { scale: 1, autoAlpha: 1, duration: 0.45, ease: "back.out(2.6)" },
            2.0,
          )
          .to(check, { strokeDashoffset: 0, duration: 0.3, ease: "power2.out" }, 2.15)
          .fromTo(
            ".spark",
            { scale: 0, autoAlpha: 1, transformOrigin: "50% 50%" },
            { scale: 1, duration: 0.3, stagger: 0.05, ease: "back.out(3)" },
            2.0,
          )
          .to(".spark", { autoAlpha: 0, scale: 0.4, duration: 0.35, stagger: 0.04, ease: "power2.in" }, 2.65)
          .to(".ld-deal", { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }, 2.15)
          // 4. firm handshake: three pumps
          .to(S, { py: -14, duration: 0.16, ease: "sine.inOut", onUpdate: render }, 2.0)
          .to(S, { py: 10, duration: 0.2, ease: "sine.inOut", onUpdate: render }, ">")
          .to(S, { py: -12, duration: 0.2, ease: "sine.inOut", onUpdate: render }, ">")
          .to(S, { py: 8, duration: 0.2, ease: "sine.inOut", onUpdate: render }, ">")
          .to(S, { py: 0, duration: 0.22, ease: "sine.out", onUpdate: render }, ">")
          // progress counter follows the whole story
          .to(
            p,
            {
              v: 100,
              duration: 2.9,
              ease: "power1.inOut",
              onUpdate: () => {
                if (count.current) count.current.textContent = String(Math.round(p.v)).padStart(3, "0");
              },
            },
            0.25,
          )
          // 5. exit
          .to(".ld-fade, .ld-deal", { autoAlpha: 0, y: -16, duration: 0.4, stagger: 0.04, ease: "power2.in" }, 3.35)
          .to(root.current, { yPercent: -100, duration: 0.95, ease: "power4.inOut" }, ">-0.1")
          .set(root.current, { display: "none" });

        return () => {
          html.classList.remove("is-loading");
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink px-6 py-8 sm:px-12"
      aria-hidden
    >
      <div className="ld-fade flex items-center justify-between">
        <span className="flex items-center gap-3 font-bold">
          <LogoMark className="h-7 w-7" /> tabus.tech
        </span>
        <span className="mono text-mute">Se încarcă</span>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6">
        <svg viewBox="0 0 800 380" className="w-full overflow-visible" fill="none">
          {/* ground */}
          <line x1="40" y1="362" x2="760" y2="362" stroke="rgba(236,235,228,.14)" strokeWidth="2" />

          <Client />
          <Worker />

          {/* reaching arms are drawn in shared coordinates so they can meet */}
          <path className="arm-c-o" stroke={OUTLINE} strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path className="arm-c" stroke={JACKET} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path className="arm-w-o" stroke="#a8c92a" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path className="arm-w" stroke="var(--volt)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle className="hand-c" r="11" fill={SKIN_CLIENT} />
          <circle className="hand-w" r="11.5" fill={GLOVE} stroke="rgba(236,235,228,.25)" />

          {/* the agreement */}
          <g transform="translate(400 150)">
            <g className="deal-badge" style={{ opacity: 0, visibility: "hidden" }}>
              <circle r="21" fill="var(--volt)" />
              <path className="deal-check" d="M-9 0 L-3 7 L10 -7" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
          {SPARKS.map(([x, y]) => (
            <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
              <path
                className="spark"
                d="M0 -9V9M-9 0H9"
                stroke="var(--volt)"
                strokeWidth="3"
                strokeLinecap="round"
                style={{ opacity: 0, visibility: "hidden" }}
              />
            </g>
          ))}
        </svg>

        <p className="ld-deal mono text-center text-bone" style={{ opacity: 0, visibility: "hidden", transform: "translateY(10px)" }}>
          Înțelegere confirmată. Încredere de ambele părți.
        </p>
      </div>

      <div className="ld-fade flex items-end justify-between">
        <p className="mono max-w-[16rem] text-mute">
          Client și executant.
          <br />
          Un cuvânt dat, o lucrare bine făcută.
        </p>
        <span ref={count} className="display text-[clamp(3rem,9vw,7rem)] tabular-nums text-bone">
          000
        </span>
      </div>
    </div>
  );
}
