"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { LOADS, MAIN_BREAKER_AMPS } from "@/data/site";
import { Reveal, useFadeIn } from "./Motion";

const SCALE_MAX = MAIN_BREAKER_AMPS * 1.3;

type OnMap = Record<string, boolean>;

export default function BreakerPanel() {
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const shown = useRef({ v: 0 });
  const [on, setOn] = useState<OnMap>({});
  const [tripped, setTripped] = useState(false);
  useFadeIn(root);

  const total = useMemo(() => LOADS.reduce((s, l) => s + (on[l.id] ? l.amps : 0), 0), [on]);
  const overload = total > MAIN_BREAKER_AMPS;
  const level: "ok" | "high" | "over" = overload ? "over" : total > MAIN_BREAKER_AMPS * 0.8 ? "high" : "ok";

  // thermal-style trip: overload must persist for a moment
  useEffect(() => {
    if (tripped || !overload) return;
    const t = setTimeout(() => {
      setTripped(true);
      setOn({});
    }, 1200);
    return () => clearTimeout(t);
  }, [overload, tripped, total]);

  const toggle = (id: string) => {
    if (tripped) {
      gsap.fromTo(".main-lever", { x: -4 }, { x: 0, duration: 0.6, ease: "elastic.out(1,.2)" });
      return;
    }
    setOn((o) => ({ ...o, [id]: !o[id] }));
  };

  const reset = () => {
    setTripped(false);
    setOn({});
  };

  /* ---- animations driven by state ---- */
  useGSAP(
    () => {
      // module levers
      LOADS.forEach((l) => {
        gsap.to(`[data-lever="${l.id}"]`, {
          y: on[l.id] ? 0 : 34,
          duration: 0.35,
          ease: "back.out(2.2)",
        });
      });
      // gauge
      gsap.to(".gauge-fill", {
        scaleX: Math.min(total / SCALE_MAX, 1),
        duration: 0.7,
        ease: "power3.out",
      });
      gsap.to(shown.current, {
        v: total,
        duration: 0.7,
        ease: "power3.out",
        onUpdate: () => {
          if (readout.current) readout.current.textContent = Math.round(shown.current.v).toString().padStart(2, "0");
        },
      });
    },
    { dependencies: [on, total], scope: root },
  );

  useGSAP(
    () => {
      if (tripped) {
        gsap.to(".main-lever", { y: 26, duration: 0.18, ease: "power4.out" });
        gsap.fromTo(panel.current, { x: -10 }, { x: 0, duration: 0.8, ease: "elastic.out(1,.15)" });
        gsap.fromTo(".trip-flash", { opacity: 0.55 }, { opacity: 0, duration: 0.9, ease: "power2.out" });
      } else {
        gsap.to(".main-lever", { y: 0, duration: 0.5, ease: "back.out(2)" });
      }
    },
    { dependencies: [tripped], scope: root },
  );

  const status = tripped
    ? { text: "Declanșat · protecție la suprasarcină", cls: "text-alert" }
    : overload
      ? { text: "Suprasarcină — declanșare iminentă", cls: "text-[#ffb020] animate-pulse" }
      : total === 0
        ? { text: "Alimentat · fără consumatori", cls: "text-volt" }
        : { text: "Alimentat · funcționare normală", cls: "text-volt" };

  const fillColor = level === "over" ? "bg-alert" : level === "high" ? "bg-[#ffb020]" : "bg-volt";

  return (
    <section id="tablou" ref={root} className="relative bg-ink py-28 sm:py-36">
      <div className="wrap grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <p className="mono mb-4 text-volt">03 — Tablou live</p>
          <Reveal as="h2" className="display text-[clamp(2.4rem,5.4vw,5rem)]">
            Încearcă să-l supraîncarci.
          </Reveal>
          <p data-fade className="mt-6 max-w-md text-lg leading-relaxed text-bone/70">
            Pornește consumatorii pe rând. Tabloul are un întrerupător general de {MAIN_BREAKER_AMPS} A: când
            suma depășește capacitatea, protecția declanșează — exact pentru asta există.
          </p>
          <p data-fade className="mt-4 max-w-md leading-relaxed text-bone/50">
            Într-un proiect real, fiecare circuit se dimensionează după sarcină, cablu și selectivitatea
            protecțiilor. Aici începe lucrul bine făcut.
          </p>
          <ul data-fade className="mono mt-8 flex flex-wrap gap-2 text-mute">
            <li className="rounded-full border border-line px-3 py-1.5">Suprasarcină</li>
            <li className="rounded-full border border-line px-3 py-1.5">Scurtcircuit</li>
            <li className="rounded-full border border-line px-3 py-1.5">Selectivitate</li>
          </ul>
        </div>

        <div data-fade>
          <div
            ref={panel}
            className="relative overflow-hidden rounded-[2rem] border border-line bg-ink-2 p-5 shadow-[0_50px_120px_-40px_rgba(212,255,58,0.18)] sm:p-8"
          >
            <div className="trip-flash pointer-events-none absolute inset-0 bg-alert opacity-0" />

            {/* header plate */}
            <div className="mono flex flex-wrap items-center justify-between gap-3 text-mute">
              <span>TG1 · Tablou general</span>
              <span className={`flex items-center gap-2 ${status.cls}`}>
                <span className="h-2 w-2 rounded-full bg-current shadow-[0_0_10px_currentColor]" />
                {status.text}
              </span>
            </div>

            {/* readout + gauge */}
            <div className="mt-8">
              <div className="flex items-end justify-between">
                <div className="flex items-end gap-2">
                  <span ref={readout} className="display text-7xl tabular-nums sm:text-8xl">
                    00
                  </span>
                  <span className="mono mb-3 text-mute">A consumați</span>
                </div>
                <div className="mono mb-3 text-right text-mute">
                  <div>General</div>
                  <div className="text-bone">C{MAIN_BREAKER_AMPS} · {MAIN_BREAKER_AMPS} A</div>
                </div>
              </div>
              <div className="relative mt-3 h-3 overflow-hidden rounded-full bg-ink-3">
                <div className={`gauge-fill h-full origin-left scale-x-0 rounded-full ${fillColor} transition-colors duration-300`} />
              </div>
              <div className="relative mt-2 h-4">
                <span
                  className="mono absolute -translate-x-1/2 text-alert"
                  style={{ left: `${(MAIN_BREAKER_AMPS / SCALE_MAX) * 100}%` }}
                >
                  ▲ limită
                </span>
              </div>
            </div>

            {/* breakers */}
            <div className="mt-6 flex items-end gap-3 rounded-2xl border border-line bg-black/40 p-3 sm:gap-4 sm:p-4">
              {/* main */}
              <button
                type="button"
                onClick={reset}
                disabled={!tripped}
                aria-label={tripped ? "Resetează întrerupătorul general" : "Întrerupător general"}
                className="flex w-[22%] disabled:cursor-default shrink-0 flex-col items-center gap-2 rounded-xl border border-line bg-ink-3 px-2 pb-3 pt-2"
              >
                <span className="mono text-[0.62rem] text-mute">QF0</span>
                <span className="relative block h-28 w-full max-w-16 overflow-hidden rounded-md bg-black">
                  <span
                    className={`main-lever absolute left-1.5 right-1.5 top-1.5 block h-14 rounded-md ${
                      tripped ? "bg-alert" : "bg-bone"
                    } shadow-[0_6px_0_rgba(0,0,0,.5)] transition-colors`}
                  >
                    <span className="mono absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[0.65rem] text-ink">
                      {tripped ? "TRIP" : "ON"}
                    </span>
                  </span>
                </span>
                <span className="mono text-[0.62rem] text-bone">C{MAIN_BREAKER_AMPS}</span>
              </button>

              {LOADS.map((l) => {
                const isOn = !!on[l.id];
                return (
                  <button
                    key={l.id}
                    type="button"
                    role="switch"
                    aria-checked={isOn}
                    aria-label={`${l.label}, ${l.amps} A`}
                    onClick={() => toggle(l.id)}
                    className={`group flex min-w-0 flex-1 flex-col items-center gap-2 rounded-xl border bg-ink-3 px-1.5 pb-3 pt-2 transition-colors ${
                      isOn ? "border-volt/60" : "border-line hover:border-bone/30"
                    } ${tripped ? "opacity-50" : ""}`}
                  >
                    <span className="mono text-[0.62rem] text-mute">{l.rating}</span>
                    <span className="relative block h-28 w-full max-w-12 overflow-hidden rounded-md bg-black">
                      <span
                        data-lever={l.id}
                        style={{ transform: "translateY(34px)" }}
                        className={`absolute left-1 right-1 top-1 block h-16 rounded-sm shadow-[0_5px_0_rgba(0,0,0,.5)] transition-colors ${
                          isOn ? "bg-volt" : "bg-bone/80"
                        }`}
                      />
                    </span>
                    <span className="mono text-center text-[0.58rem] leading-tight text-bone">{l.label}</span>
                    <span className={`mono text-[0.62rem] ${isOn ? "text-volt" : "text-mute"}`}>{l.amps} A</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex min-h-12 items-center justify-between gap-4">
              <p className="text-sm text-bone/60">
                {tripped
                  ? "Totul s-a oprit — fără ca vreun cablu să se încălzească. Resetează și încearcă o combinație mai sigură."
                  : "Atinge un întrerupător ca să pornești sau să oprești un consumator."}
              </p>
              {tripped && (
                <button type="button" onClick={reset} className="btn btn-volt shrink-0 !px-5 !py-2.5 text-sm">
                  Resetează
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
