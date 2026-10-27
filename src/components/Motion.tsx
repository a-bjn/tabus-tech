"use client";

import { useRef, type ReactNode, type RefObject } from "react";
import { gsap, NO_MOTION, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

type RevealProps = {
  as?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  delay?: number;
  children: ReactNode;
};

/** Line-by-line masked text reveal, triggered when scrolled into view. */
export function Reveal({ as = "div", className, delay = 0, children }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_MOTION, () => {
        const el = ref.current;
        if (!el) return;
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.1,
              ease: "power4.out",
              stagger: 0.09,
              delay,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            });
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const Tag = as as "div";
  return (
    <Tag ref={ref as RefObject<HTMLDivElement>} className={className}>
      {children}
    </Tag>
  );
}

/** Fades up every `[data-fade]` element inside the scope as it enters the viewport. */
export function useFadeIn(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_MOTION, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-fade]", scope.current);
        if (!items.length) return;
        gsap.set(items, { autoAlpha: 0, y: 44 });
        ScrollTrigger.batch(items, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.1,
              overwrite: true,
            }),
        });
      });
      return () => mm.revert();
    },
    { scope },
  );
}

/** Wraps a CTA so it gently follows the pointer. */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.5)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.5)" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`inline-block ${className ?? ""}`}>
      {children}
    </div>
  );
}
