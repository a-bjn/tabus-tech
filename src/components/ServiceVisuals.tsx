"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, NO_MOTION, useGSAP } from "@/lib/gsap";
import CameraMonitor from "./CameraMonitor";

const ALERT = "#ff5a36";
const VOLT = "#D4FF3A";

const TEXT = {
  fontFamily: "var(--font-code), ui-monospace, monospace",
  fontSize: 9,
  letterSpacing: "0.06em",
  fill: "currentColor",
} as const;

/** Shared frame for the schematic-style service demos. */
function Frame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-line bg-ink-2 text-volt">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />
      <p className="mono absolute left-4 top-3.5 z-10 text-bone/60">{label}</p>
      <p className="mono absolute right-4 top-3.5 z-10 flex items-center gap-1.5 text-bone/60">
        <span className="rec-dot h-1.5 w-1.5 rounded-full bg-volt" />
        Live
      </p>
      <svg viewBox="0 0 400 250" className="absolute inset-0 h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {children}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 01 — Instalații electrice: monofilar scheme with live current        */
/* ------------------------------------------------------------------ */
function ElectricVisual() {
  const amps = useRef<SVGTextElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      if (amps.current) amps.current.textContent = `TG · ${(17 + Math.random() * 3).toFixed(1).replace(".", ",")} A`;
    }, 900);
    return () => clearInterval(t);
  }, []);

  return (
    <Frame label="Schemă monofilară">
      {/* source */}
      <circle cx="200" cy="52" r="9" />
      <circle cx="200" cy="64" r="9" />
      <path d="M200 73V84" />
      {/* breaker */}
      <path d="M200 84V92M200 92l-8 14M200 106V128" />
      <path className="sv-flow" d="M200 73V128" stroke={VOLT} />
      {/* bus */}
      <path d="M52 128H348" strokeWidth="3" />
      <text ref={amps} x="212" y="104" {...TEXT} stroke="none">
        TG · 18,4 A
      </text>
      {/* feeders */}
      {[70, 200, 330].map((x) => (
        <g key={x}>
          <path d={`M${x} 128V176`} />
          <path className="sv-flow" d={`M${x} 128V176`} stroke={VOLT} />
        </g>
      ))}
      {/* lamp */}
      <circle className="sv-load" cx="70" cy="194" r="16" />
      <path d="M59 183 81 205M81 183 59 205" />
      {/* socket */}
      <circle className="sv-load" cx="200" cy="194" r="16" style={{ animationDelay: "0.5s" }} />
      <path d="M194 187v14M206 187v14" />
      {/* motor */}
      <circle className="sv-load" cx="330" cy="194" r="16" style={{ animationDelay: "1s" }} />
      <text x="330" y="199" textAnchor="middle" {...TEXT} fontSize={13} stroke="none">
        M
      </text>
      <text x="70" y="232" textAnchor="middle" {...TEXT} stroke="none">
        ILUMINAT
      </text>
      <text x="200" y="232" textAnchor="middle" {...TEXT} stroke="none">
        PRIZE
      </text>
      <text x="330" y="232" textAnchor="middle" {...TEXT} stroke="none">
        MOTOR
      </text>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 02 — Forță, comandă & protecție: a breaker trips, the rest stay on   */
/* ------------------------------------------------------------------ */
const MODULES = [
  ["C10", "10 A"],
  ["C16", "16 A"],
  ["C20", "20 A"],
  ["RCD", "30 mA"],
  ["C32", "32 A"],
];
const MX = (i: number) => 32 + i * 74;

function ProtectionVisual() {
  const root = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_MOTION, () => {
        const status = root.current!.querySelector<SVGTextElement>(".pv-status")!;
        const say = (t: string) => () => {
          status.textContent = t;
        };
        const tl = gsap.timeline({ repeat: -1 });
        tl.set(".pv-handle-2", { y: 0, fill: VOLT })
          .set(".pv-body-2", { stroke: "currentColor" })
          .set(".pv-flow-2", { autoAlpha: 1 })
          .set(".pv-spark", { autoAlpha: 0 })
          .call(say("TOATE CIRCUITELE ALIMENTATE"))
          // overload builds up
          .to(".pv-spark", { autoAlpha: 1, duration: 0.08, repeat: 7, yoyo: true }, 1.4)
          .set(".pv-body-2", { stroke: ALERT }, 1.4)
          .call(say("SUPRASARCINĂ PE C20"), undefined, 1.4)
          // protection trips
          .to(".pv-handle-2", { y: 22, fill: ALERT, duration: 0.28, ease: "back.out(3)" }, 2.3)
          .set(".pv-spark", { autoAlpha: 0 }, 2.3)
          .set(".pv-flow-2", { autoAlpha: 0 }, 2.3)
          .call(say("DECLANȘAT · RESTUL RĂMÂN ALIMENTATE"), undefined, 2.3)
          // re-arm
          .to(".pv-handle-2", { y: 0, fill: VOLT, duration: 0.35, ease: "power2.out" }, 5.2)
          .set(".pv-body-2", { stroke: "currentColor" }, 5.2)
          .set(".pv-flow-2", { autoAlpha: 1 }, 5.2)
          .call(say("REARMAT"), undefined, 5.2)
          .to({}, { duration: 1.2 }, 5.4);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <Frame label="Protecții & selectivitate">
      <g ref={root}>
        <path d="M18 56H382" strokeWidth="3" />
        <text x="20" y="46" {...TEXT} stroke="none">
          TG · 32 A
        </text>
        {MODULES.map(([name, rating], i) => {
          const x = MX(i);
          return (
            <g key={name}>
              <path d={`M${x + 30} 56V90`} />
              <path className={`sv-flow pv-flow-${i}`} d={`M${x + 30} 56V90`} stroke={VOLT} />
              <rect className={`pv-body-${i}`} x={x} y="90" width="60" height="100" rx="5" />
              <rect x={x + 22} y="108" width="16" height="48" rx="2" opacity="0.45" />
              <rect className={`pv-handle-${i}`} x={x + 20} y="110" width="20" height="22" rx="2" fill={VOLT} stroke="none" />
              <text x={x + 30} y="176" textAnchor="middle" {...TEXT} stroke="none">
                {name}
              </text>
              <text x={x + 30} y="214" textAnchor="middle" {...TEXT} stroke="none" opacity="0.6">
                {rating}
              </text>
            </g>
          );
        })}
        {/* fault spark on the C20 feeder */}
        <path className="pv-spark" d="M203 62l8 7-8 7 8 7" stroke={ALERT} strokeWidth="2" style={{ opacity: 0 }} />
        <text className="pv-status" x="200" y="241" textAnchor="middle" {...TEXT} stroke="none">
          TOATE CIRCUITELE ALIMENTATE
        </text>
      </g>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 03 — Automatizări industriale: PLC reads a sensor, counts boxes      */
/* ------------------------------------------------------------------ */
function AutomationVisual() {
  const root = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_MOTION, () => {
        const q = gsap.utils.selector(root.current);
        const boxes = q(".au-box");
        const count = q(".au-count")[0] as unknown as SVGTextElement;
        const i0 = q(".au-i0");
        const beam = q(".au-beam");
        let n = 0;
        let hit = false;

        boxes.forEach((b, i) => {
          gsap.to(b, { x: 250, duration: 7.5, ease: "none", repeat: -1 }).progress(i / 3);
        });
        // belt rollers
        gsap.to(q(".au-roller"), { rotation: 360, transformOrigin: "50% 50%", duration: 1.6, ease: "none", repeat: -1 });
        gsap.to(q(".au-run"), { opacity: 0.25, duration: 0.6, yoyo: true, repeat: -1, ease: "sine.inOut" });

        const tick = () => {
          // beam sits at x = 270 (viewBox); boxes are 26 wide, starting at x = 140
          const busy = boxes.some((b) => {
            const x = 140 + (gsap.getProperty(b, "x") as number);
            return x < 270 + 3 && x + 26 > 270 - 3;
          });
          if (busy && !hit) {
            n += 1;
            count.textContent = `PIESE ${String(n % 1000).padStart(3, "0")}`;
          }
          hit = busy;
          gsap.set(i0, { opacity: busy ? 1 : 0.2 });
          gsap.set(beam, { opacity: busy ? 1 : 0.45 });
        };
        gsap.ticker.add(tick);
        return () => gsap.ticker.remove(tick);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <Frame label="Automatizare · PLC">
      <g ref={root}>
        {/* PLC */}
        <rect x="24" y="38" width="100" height="128" rx="4" />
        <path d="M24 58H124" opacity="0.5" />
        <text x="34" y="52" {...TEXT} stroke="none">
          PLC
        </text>
        {[
          ["RUN", "au-run", 80],
          ["I0.0", "au-i0", 102],
          ["Q0.0", "au-q0", 124],
        ].map(([label, cls, y]) => (
          <g key={label as string}>
            <circle className={cls as string} cx="40" cy={y as number} r="4.5" fill={VOLT} stroke="none" />
            <text x="54" y={(y as number) + 3} {...TEXT} stroke="none">
              {label}
            </text>
          </g>
        ))}
        <path d="M82 80h30M82 102h30M82 124h30" opacity="0.35" />
        <text className="au-count" x="24" y="196" {...TEXT} stroke="none">
          PIESE 000
        </text>

        {/* input wire PLC -> sensor, output wire PLC -> motor */}
        <path className="sv-flow" d="M124 70H270V104" stroke={VOLT} />
        <path d="M124 70H270V104" opacity="0.35" />
        <path className="sv-flow" d="M124 150H142V220H316" stroke={VOLT} />
        <path d="M124 150H142V220H316" opacity="0.35" />

        {/* sensor + beam */}
        <path d="M270 104V112" />
        <rect x="262" y="112" width="16" height="12" rx="2" />
        <path className="au-beam" d="M270 124V176" strokeDasharray="3 4" />
        <text x="284" y="122" {...TEXT} stroke="none">
          SENZOR
        </text>

        {/* belt */}
        <path d="M150 178H390M150 194H390" />
        {[168, 208, 248, 288, 328, 368].map((x) => (
          <g key={x} className="au-roller">
            <circle cx={x} cy="186" r="5" />
            <path d={`M${x - 5} 186h10`} />
          </g>
        ))}
        {/* boxes */}
        {[0, 1, 2].map((i) => (
          <rect key={i} className="au-box" x="140" y="152" width="26" height="24" rx="2" fill="rgba(212,255,58,.12)" />
        ))}

        {/* motor */}
        <circle cx="332" cy="220" r="14" />
        <text x="332" y="225" textAnchor="middle" {...TEXT} fontSize={13} stroke="none">
          M
        </text>
        <path d="M332 206V194" strokeDasharray="2 3" />
        <text x="354" y="224" {...TEXT} stroke="none">
          M1
        </text>
      </g>
    </Frame>
  );
}

export function ServiceVisual({ kind }: { kind: "electric" | "protection" | "automation" | "cctv" }) {
  switch (kind) {
    case "electric":
      return <ElectricVisual />;
    case "protection":
      return <ProtectionVisual />;
    case "automation":
      return <AutomationVisual />;
    case "cctv":
      return <CameraMonitor />;
  }
}
