"use client";

import { useRef } from "react";
import { PROJECTS, type ProjectArt } from "@/data/site";
import { useFadeIn } from "./Motion";
import SectionIntro from "./SectionIntro";

/** Line-art illustration per project type; strokes follow the card's text colour. */
function Art({ type }: { type: ProjectArt }) {
  return (
    <svg
      viewBox="0 0 240 130"
      className="h-full w-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M0 118H240" opacity="0.4" />
      {type === "substation" && (
        <>
          {/* pylon */}
          <path d="M34 118 42 30 50 118M38 90H46M36 70H48M40 50H44M24 36H60M28 28H56M42 30V18" />
          <path d="M24 36 18 44M60 36 66 44" />
          {/* line to transformer */}
          <path className="pj-flow" d="M60 36C100 40 108 64 132 64" />
          {/* transformer */}
          <rect x="128" y="64" width="46" height="54" rx="2" />
          <path d="M136 64V52M150 64V52M164 64V52" />
          <path d="M134 78H168M134 88H168M134 98H168" opacity="0.6" />
          {/* hall */}
          <path d="M184 118V76L204 66 224 76V118" />
          <path className="pj-flow" d="M174 100H184" />
          <path d="M196 118V96H212V118" opacity="0.6" />
        </>
      )}
      {type === "plc" && (
        <>
          <rect x="20" y="22" width="84" height="64" rx="3" />
          <path d="M20 40H104" opacity="0.6" />
          <circle cx="32" cy="31" r="2.2" />
          <circle cx="42" cy="31" r="2.2" />
          <circle cx="52" cy="31" r="2.2" opacity="0.5" />
          <path d="M32 52H92M32 62H92M32 72H78" opacity="0.6" />
          <path className="pj-flow" d="M104 54H130C140 54 140 36 150 36H168" />
          <path className="pj-flow" d="M104 62H168" />
          <path className="pj-flow" d="M104 70H130C140 70 140 88 150 88H168" />
          <circle cx="188" cy="36" r="14" />
          <circle cx="188" cy="62" r="14" />
          <circle cx="188" cy="88" r="14" />
          <path d="M183 36h10M183 62h10M183 88h10" opacity="0.7" />
        </>
      )}
      {type === "home" && (
        <>
          <path d="M40 118V62L100 22 160 62V118" />
          <path d="M30 66 100 16 170 66" />
          <rect x="82" y="84" width="36" height="34" rx="1" opacity="0.7" />
          <rect x="54" y="72" width="20" height="16" rx="1" opacity="0.6" />
          <rect x="126" y="72" width="20" height="16" rx="1" opacity="0.6" />
          {/* bolt */}
          <path className="pj-flow" d="M190 28 176 62h14l-8 30" />
          <path d="M200 100h24M200 108h24" opacity="0.5" />
        </>
      )}
      {type === "retail" && (
        <>
          <rect x="22" y="36" width="196" height="82" rx="2" />
          <path d="M22 54H218" opacity="0.6" />
          <rect x="40" y="70" width="52" height="48" opacity="0.7" />
          <rect x="106" y="70" width="28" height="48" opacity="0.7" />
          <rect x="148" y="70" width="52" height="48" opacity="0.7" />
          {[46, 80, 114, 148, 182].map((x) => (
            <circle key={x} className="pj-flow" cx={x} cy="45" r="2.4" />
          ))}
        </>
      )}
      {type === "cctv" && (
        <>
          <path d="M20 118V26H60" />
          <rect x="52" y="20" width="46" height="22" rx="3" transform="rotate(14 75 31)" />
          <path d="M96 42 150 24M96 52 150 92" opacity="0.5" />
          <path className="pj-flow" d="M96 47 150 58" />
          <rect x="150" y="26" width="70" height="66" rx="2" strokeDasharray="4 4" opacity="0.7" />
          <path d="M170 92V66a8 8 0 0 1 16 0v26" opacity="0.8" />
          <circle cx="178" cy="54" r="5" opacity="0.8" />
        </>
      )}
    </svg>
  );
}

const SPAN = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
];

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  useFadeIn(root);

  return (
    <section id="proiecte" ref={root} className="relative bg-ink py-28 sm:py-36">
      <div className="wrap">
        <SectionIntro
          className="mb-12 sm:mb-14"
          label="03 — Proiecte realizate"
          title="Lucrări livrate la termen, de la locuințe la hale industriale."
          text="O parte din proiectele pe care le-am dus de la proiect până la punerea în funcțiune."
        />

        <div className="grid gap-5 lg:grid-cols-12">
          {PROJECTS.map((p, i) => {
            const big = i < 2;
            return (
              <article
                key={p.id}
                data-fade
                className={`group relative flex flex-col overflow-hidden border border-line bg-ink-2 transition-colors duration-500 hover:border-volt/60 ${SPAN[i]}`}
              >
                <div
                  className={`relative border-b border-line bg-ink/60 p-6 text-bone/45 transition-colors duration-500 group-hover:text-volt ${
                    big ? "h-56 sm:h-64" : "h-44"
                  }`}
                >
                  <Art type={p.art} />
                  <span className="mono absolute left-5 top-4 text-mute">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mono absolute right-5 top-4 text-mute">
                    {p.place} · {p.year}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <p className="mono text-volt">{p.kind}</p>
                  <h3
                    className={`display mt-3 ${
                      big ? "text-[clamp(1.5rem,2.3vw,2.1rem)]" : "text-[clamp(1.3rem,1.8vw,1.6rem)]"
                    } leading-[1.05]`}
                  >
                    {p.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-bone/70">{p.result}</p>

                  <div className="mt-auto pt-6">
                    <dl className="flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-5">
                      {p.specs.map(([k, v]) => (
                        <div key={k}>
                          <dt className="mono text-mute">{k}</dt>
                          <dd className="mt-1 text-lg font-semibold">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </article>
            );
          })}

          <a
            href="#contact"
            data-fade
            className="group flex min-h-40 items-center justify-between gap-6 border border-volt/40 bg-volt/[0.06] p-7 transition-colors hover:bg-volt hover:text-ink lg:col-span-12"
          >
            <span className="display text-[clamp(1.4rem,2.6vw,2.2rem)]">Ai un proiect asemănător? Hai să-l discutăm.</span>
            <span className="mono shrink-0 text-volt transition-colors group-hover:text-ink">Cere ofertă →</span>
          </a>
        </div>
      </div>
    </section>
  );
}
