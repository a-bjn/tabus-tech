"use client";

import { useRef } from "react";
import { gsap, NO_MOTION, scrollToId, useGSAP } from "@/lib/gsap";
import { NAV, SITE } from "@/data/site";

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_MOTION, () => {
        gsap.from(".foot-char", {
          yPercent: 110,
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.05,
          scrollTrigger: { trigger: ".foot-word", start: "top 95%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="relative overflow-hidden bg-ink pt-16">
      <div className="wrap flex flex-wrap items-start justify-between gap-10">
        <div className="max-w-xs">
          <p className="text-lg font-semibold">Instalații electrice, automatizări și CCTV.</p>
          <p className="mt-2 text-bone/55">De la proiect la mentenanță, pentru rezidențial și industrial.</p>
        </div>
        <nav className="mono flex flex-wrap gap-x-8 gap-y-3 text-mute" aria-label="Subsol">
          {[...NAV, { id: "contact", label: "Contact" }].map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToId(n.id);
              }}
              className="transition-colors hover:text-volt"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => scrollToId("top")}
          className="btn btn-ghost !px-5 !py-2.5 text-sm"
        >
          Sus <span aria-hidden>↑</span>
        </button>
      </div>

      <div
        className="foot-word display wrap select-none overflow-hidden whitespace-nowrap pb-4 pt-12 text-[clamp(3.5rem,17.5vw,20rem)] leading-[0.85]"
        aria-hidden
      >
        {"tabus.tech".split("").map((c, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <span className={`foot-char inline-block ${c === "." ? "text-volt" : ""}`}>{c}</span>
          </span>
        ))}
      </div>

      <div className="wrap mono flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 text-mute">
        <span>© {SITE.name}</span>
        <span>Lucrări realizate conform normativelor și cerințelor de autorizare aplicabile</span>
      </div>
    </footer>
  );
}
