"use client";

import { useRef } from "react";
import { gsap, NO_MOTION, REDUCED_MOTION, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { LogoMark } from "./Logo";

export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const line = useRef<SVGPathElement>(null);
  const spark = useRef<HTMLDivElement>(null);

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
        const p = { v: 0 };
        const path = line.current!;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

        const tl = gsap.timeline({ onComplete: finish });
        tl.from(".ld-fade", { autoAlpha: 0, y: 20, duration: 0.6, stagger: 0.08, ease: "power3.out" })
          .to(
            p,
            {
              v: 100,
              duration: 1.7,
              ease: "power2.inOut",
              onUpdate: () => {
                if (count.current) count.current.textContent = String(Math.round(p.v)).padStart(3, "0");
                const pt = path.getPointAtLength((p.v / 100) * len);
                gsap.set(spark.current, { left: `${(pt.x / 800) * 100}%`, top: `${(pt.y / 120) * 100}%` });
              },
            },
            0.2,
          )
          .to(path, { strokeDashoffset: 0, duration: 1.7, ease: "power2.inOut" }, 0.2)
          .to(".ld-fade", { autoAlpha: 0, y: -16, duration: 0.4, stagger: 0.04, ease: "power2.in" }, ">0.15")
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
        <span className="mono text-mute">Pornire sistem</span>
      </div>

      <div className="relative mx-auto w-full max-w-4xl">
        <svg viewBox="0 0 800 120" className="w-full overflow-visible" fill="none">
          <path
            d="M0 60 H240 L280 20 H420 L460 100 H560 L600 60 H800"
            stroke="rgba(236,235,228,.12)"
            strokeWidth="2"
          />
          <path
            ref={line}
            d="M0 60 H240 L280 20 H420 L460 100 H560 L600 60 H800"
            stroke="var(--volt)"
            strokeWidth="2.5"
          />
        </svg>
        <div
          ref={spark}
          className="absolute left-0 top-[50%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-volt shadow-[0_0_30px_8px_rgba(212,255,58,0.7)]"
        />
      </div>

      <div className="ld-fade flex items-end justify-between">
        <p className="mono max-w-[16rem] text-mute">
          Verificăm circuitele.
          <br />
          Alimentăm interfața.
        </p>
        <span
          ref={count}
          className="display text-[clamp(4rem,14vw,11rem)] tabular-nums text-bone"
        >
          000
        </span>
      </div>
    </div>
  );
}
