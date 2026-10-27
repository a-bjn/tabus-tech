"use client";

import { useRef, useState } from "react";
import { gsap, NO_MOTION, ScrollTrigger, scrollToId, useGSAP } from "@/lib/gsap";
import { NAV } from "@/data/site";
import { Wordmark } from "./Logo";
import { Magnetic } from "./Motion";

export default function Nav() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_MOTION, () => {
        const intro = gsap.from(root.current, {
          yPercent: -120,
          duration: 1,
          ease: "power4.out",
          paused: true,
        });
        const play = () => intro.play();
        if (document.documentElement.dataset.ready) play();
        else window.addEventListener("tabus:ready", play, { once: true });

        // scroll progress bar
        gsap.fromTo(
          progress.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
          },
        );

        // hide on scroll down, reveal on scroll up
        const show = gsap
          .to(root.current, { y: -90, duration: 0.45, ease: "power3.inOut", paused: true })
          .progress(0);
        ScrollTrigger.create({
          start: 120,
          end: "max",
          onUpdate: (self) => {
            if (self.direction === 1) show.play();
            else show.reverse();
          },
          onLeaveBack: () => show.reverse(),
        });
        return () => window.removeEventListener("tabus:ready", play);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  useGSAP(
    () => {
      const el = menu.current;
      if (!el) return;
      gsap.to(el, {
        clipPath: open ? "circle(150% at 92% 4%)" : "circle(0% at 92% 4%)",
        duration: open ? 0.9 : 0.6,
        ease: open ? "power4.inOut" : "power3.inOut",
        pointerEvents: open ? "auto" : "none",
      });
      if (open) {
        gsap.fromTo(
          "[data-menu-item]",
          { yPercent: 100, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, stagger: 0.07, duration: 0.8, ease: "power4.out", delay: 0.3 },
        );
      }
      document.documentElement.style.overflow = open ? "hidden" : "";
    },
    { dependencies: [open], scope: menu },
  );

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => scrollToId(id), open ? 450 : 0);
  };

  return (
    <>
      <header
        ref={root}
        className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/70 backdrop-blur-xl"
      >
        <div ref={progress} className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-volt" />
        <div className="wrap flex h-16 items-center justify-between">
          <a href="#top" onClick={go("top")} aria-label="Tabus Tech - sus">
            <Wordmark />
          </a>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={go(n.id)}
                className="group relative text-sm text-bone/80 transition-colors hover:text-bone"
              >
                {n.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-volt transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <Magnetic strength={0.25}>
                <a href="#contact" onClick={go("contact")} className="btn btn-volt !px-5 !py-2.5 text-sm">
                  Cere ofertă
                </a>
              </Magnetic>
            </div>
            <button
              className="relative z-[60] flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Închide meniul" : "Deschide meniul"}
              aria-expanded={open}
            >
              <span
                className={`h-0.5 w-6 bg-bone transition-transform duration-300 ${open ? "translate-y-2 rotate-45" : ""}`}
              />
              <span className={`h-0.5 w-6 bg-bone transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
              <span
                className={`h-0.5 w-6 bg-bone transition-transform duration-300 ${open ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menu}
        className="pointer-events-none fixed inset-0 z-[55] flex flex-col justify-center bg-volt px-8 text-ink md:hidden"
        style={{ clipPath: "circle(0% at 92% 4%)" }}
      >
        <ul className="flex flex-col gap-2">
          {[...NAV, { id: "contact", label: "Contact" }].map((n) => (
            <li key={n.id} className="overflow-hidden">
              <a
                data-menu-item
                href={`#${n.id}`}
                onClick={go(n.id)}
                className="display block text-6xl"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
