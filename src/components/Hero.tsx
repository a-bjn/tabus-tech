"use client";

import { useRef } from "react";
import { gsap, NO_MOTION, scrollToId, useGSAP } from "@/lib/gsap";
import { Magnetic } from "./Motion";
import HeroScene from "./HeroScene";

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

        /* ---------- cursor: glow, card tilt ---------- */
        const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        const target = { x: el.clientWidth * 0.7, y: el.clientHeight * 0.4 };
        const cur = { ...target };

        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          target.x = e.clientX - r.left;
          target.y = e.clientY - r.top;
        };
        if (fine) el.addEventListener("pointermove", onMove);

        const rotX = gsap.quickTo(".hero-card", "rotationX", { duration: 0.8, ease: "power3.out" });
        const rotY = gsap.quickTo(".hero-card", "rotationY", { duration: 0.8, ease: "power3.out" });

        const tick = () => {
          cur.x += (target.x - cur.x) * 0.12;
          cur.y += (target.y - cur.y) * 0.12;
          el.style.setProperty("--mx", `${cur.x}px`);
          el.style.setProperty("--my", `${cur.y}px`);
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

      <div className="hero-content hero-offset-top wrap relative z-10 flex min-h-[100svh] flex-col justify-center pb-16 pt-4">
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

          <h1 className="display text-[clamp(2.25rem,6.8vw,6.25rem)] leading-[0.92]">
            {["Proiectăm.", "Executăm.", "Automatizăm."].map((w, i) => (
              <span key={w} className="block overflow-hidden pb-[0.1em] pt-[0.02em]">
                <span className={`hero-word block origin-left ${i === 2 ? "text-volt" : ""}`}>{w}</span>
              </span>
            ))}
          </h1>

          <p className="hero-fade max-w-xl text-base leading-relaxed text-bone/70 sm:text-lg">
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
      </div>

      <div className="absolute right-[max(1.5rem,calc((100vw-1400px)/2+3rem))] top-1/2 z-10 hidden -translate-y-[46%] xl:block">
        <HeroScene />
      </div>
    </section>
  );
}
