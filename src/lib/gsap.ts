"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, SplitText);

export { gsap, ScrollTrigger, SplitText, useGSAP };

export const NO_MOTION = "(prefers-reduced-motion: no-preference)";
export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

export function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  gsap.to(window, {
    scrollTo: { y: target, autoKill: true },
    duration: 1.3,
    ease: "power3.inOut",
  });
}
