"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, NO_MOTION, useGSAP } from "@/lib/gsap";
import { CAMERAS } from "@/data/site";

type SceneId = (typeof CAMERAS)[number]["scene"];

const DETECT: Record<SceneId, string> = {
  gate: "PERSOANĂ",
  hall: "OPERATOR",
  lot: "VEHICUL",
  rack: "MIȘCARE",
};

function Scene({ scene }: { scene: SceneId }) {
  const s = "rgba(212,255,58,.55)";
  return (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" className="cam-scene absolute inset-0 h-full w-full" fill="none" aria-hidden>
      <defs>
        <linearGradient id={`sky-${scene}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f1a14" />
          <stop offset="1" stopColor="#070b09" />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill={`url(#sky-${scene})`} />
      {/* floor perspective */}
      <g stroke="rgba(212,255,58,.14)">
        {Array.from({ length: 17 }, (_, i) => (
          <line key={i} x1="160" y1="78" x2={-240 + i * 50} y2="180" />
        ))}
        {[88, 100, 116, 138, 168].map((y) => (
          <line key={y} x1="0" y1={y} x2="320" y2={y} />
        ))}
      </g>
      <line x1="0" y1="78" x2="320" y2="78" stroke="rgba(212,255,58,.3)" />

      <g stroke={s} strokeWidth="1.2" strokeLinejoin="round">
        {scene === "gate" && (
          <>
            <path d="M70 78V38H250V78" />
            <path d="M100 78V50M130 78V50M160 78V50M190 78V50M220 78V50" />
            <path d="M70 38 250 38M40 78V30M280 78V30" />
            <path d="M20 120H60V96H20ZM260 120H300V96H260Z" strokeDasharray="3 3" />
          </>
        )}
        {scene === "hall" && (
          <>
            <path d="M30 78V52H110V78M130 78V40H200V78M220 78V58H290V78" />
            <path d="M30 124H290M30 132H290" />
            <path d="M60 124l8 8M120 124l8 8M180 124l8 8M240 124l8 8" />
            <path d="M90 60H50M165 50V58" />
          </>
        )}
        {scene === "lot" && (
          <>
            <path d="M60 170 100 100M130 170 140 100M200 170 180 100M270 170 220 100" />
            <path d="M120 112h40l8 12v10h-56v-10z" />
            <path d="M200 140h56l10 16v14h-76v-14z" />
            <circle cx="132" cy="136" r="4" />
            <circle cx="236" cy="172" r="5" />
          </>
        )}
        {scene === "rack" && (
          <>
            <path d="M40 78V30M110 78V30M180 78V30M250 78V30M40 30H250" />
            <path d="M40 46H250M40 62H250" />
            <path d="M50 46V36h22v10M84 46V38h18v8M120 62V50h24v12M190 62V48h22v14M222 46V34h20v12" />
            <path d="M60 140H300M30 150H280" strokeDasharray="4 4" />
          </>
        )}
      </g>
    </svg>
  );
}

function CameraView({
  cam,
  compact = false,
  now,
}: {
  cam: (typeof CAMERAS)[number];
  compact?: boolean;
  now: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const conf = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_MOTION, () => {
        gsap.fromTo(".scan", { top: "-3%" }, { top: "103%", duration: 3.6, ease: "none", repeat: -1, delay: Math.random() * 2 });
        const det = root.current!.querySelector(".det");
        gsap.set(det, {
          left: `${gsap.utils.random(15, 60)}%`,
          top: `${gsap.utils.random(38, 62)}%`,
        });
        const tl = gsap.timeline({
          repeat: -1,
          onRepeat: () => {
            if (conf.current) conf.current.textContent = String(Math.round(gsap.utils.random(88, 99)));
          },
        });
        for (let i = 0; i < 4; i++) {
          tl.to(det, {
            left: `${gsap.utils.random(10, 68)}%`,
            top: `${gsap.utils.random(36, 64)}%`,
            duration: gsap.utils.random(2.2, 3.8),
            ease: "sine.inOut",
          }).to({}, { duration: gsap.utils.random(0.3, 1) });
        }
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative h-full w-full overflow-hidden bg-[#070b09]">
      <Scene scene={cam.scene} />
      <div className="scan absolute inset-x-0 h-[2px] bg-volt/50 shadow-[0_0_18px_4px_rgba(212,255,58,0.35)]" />
      <div
        className="det absolute border border-volt"
        style={{ width: compact ? "16%" : "13%", aspectRatio: "1 / 1.7", left: "35%", top: "45%" }}
      >
        {!compact && (
          <span className="mono absolute -top-5 left-[-1px] whitespace-nowrap bg-volt px-1.5 py-0.5 text-[0.6rem] text-ink">
            {DETECT[cam.scene]} <span ref={conf}>94</span>%
          </span>
        )}
      </div>

      {/* chrome */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,.65))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background:repeating-linear-gradient(to_bottom,transparent_0_2px,#000_2px_3px)]" />
      <div className="pointer-events-none absolute inset-2 sm:inset-3">
        <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-bone/60" />
        <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-bone/60" />
        <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-bone/60" />
        <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-bone/60" />
      </div>
      <div className="mono absolute left-4 top-4 flex items-center gap-2 text-[0.6rem] text-bone sm:left-5 sm:top-5">
        CAM {cam.id}
        {!compact && <span className="text-bone/60">· {cam.name}</span>}
      </div>
      <div className="mono absolute right-4 top-4 flex items-center gap-1.5 text-[0.6rem] text-bone sm:right-5 sm:top-5">
        <span className="rec-dot h-1.5 w-1.5 rounded-full bg-alert" />
        REC
      </div>
      {!compact && (
        <div className="mono absolute bottom-4 left-4 right-4 flex justify-between text-[0.6rem] text-bone/70 sm:bottom-5 sm:left-5 sm:right-5">
          <span suppressHydrationWarning>{now}</span>
          <span>1080p · H.265</span>
        </div>
      )}
    </div>
  );
}


/** Security monitor with a switchable camera channel and a thumbnail strip. */
export default function CameraMonitor() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [now, setNow] = useState("");

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleString("ro-RO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    const t = setInterval(() => setNow(fmt()), 500);
    return () => clearInterval(t);
  }, []);

  // channel-switch effect
  useGSAP(
    () => {
      gsap.fromTo(
        stage.current,
        { clipPath: "inset(0 0 100% 0)", filter: "brightness(2.2)" },
        { clipPath: "inset(0 0 0% 0)", filter: "brightness(1)", duration: 0.55, ease: "power3.out", clearProps: "clipPath,filter" },
      );
    },
    { dependencies: [active], scope: root },
  );

  const cam = CAMERAS[active];

  return (
    <div ref={root} className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-xl border border-line">
        <div ref={stage} className="aspect-video w-full">
          <CameraView key={cam.id} cam={cam} now={now} />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {CAMERAS.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            aria-label={`Camera ${c.id}: ${c.name}`}
            className={`relative aspect-video overflow-hidden rounded-lg border transition-all duration-300 ${
              i === active ? "border-volt" : "border-line opacity-60 hover:opacity-100"
            }`}
          >
            <CameraView cam={c} compact now={now} />
          </button>
        ))}
      </div>
    </div>
  );
}