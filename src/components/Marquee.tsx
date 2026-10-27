"use client";

import { useRef } from "react";
import { gsap, NO_MOTION, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { MARQUEE } from "@/data/site";

export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_MOTION, () => {
        const tween = gsap.to(track.current, {
          xPercent: -50,
          duration: 38,
          ease: "none",
          repeat: -1,
        });
        // scroll velocity speeds the strip up (and reverses with direction)
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const v = gsap.utils.clamp(-3000, 3000, self.getVelocity());
            gsap.to(tween, {
              timeScale: self.direction * (1 + Math.abs(v) / 350),
              duration: 0.2,
              overwrite: true,
              onComplete: () => {
                gsap.to(tween, { timeScale: 1, duration: 1.2, ease: "power2.out" });
              },
            });
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const row = [...MARQUEE, ...MARQUEE];

  return (
    <div
      ref={root}
      className="relative z-10 -rotate-[1.2deg] overflow-hidden border-y border-ink bg-volt py-4 text-ink"
      aria-hidden
    >
      <div ref={track} className="flex w-max whitespace-nowrap">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {row.map((w, i) => (
              <span key={`${k}-${i}`} className="display flex items-center text-3xl sm:text-4xl">
                <span className="px-6">{w}</span>
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
                  <path d="M11 1 3 12h6l-1 7 9-12h-6z" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
