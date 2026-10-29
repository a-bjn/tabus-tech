import { Reveal } from "./Motion";

/**
 * Shared opening for a section: a label with a rule that fills the row,
 * the headline on a wide measure, and the supporting text right beneath it.
 */
export default function SectionIntro({
  label,
  title,
  text,
  tone = "dark",
  className = "",
}: {
  label: string;
  title: string;
  text?: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  const light = tone === "light";
  return (
    <header className={className}>
      <div className="mb-6 flex items-center gap-5 sm:mb-8">
        <p className={`section-label shrink-0 ${light ? "text-ink/60" : "text-volt"}`}>{label}</p>
        <span aria-hidden className={`h-px flex-1 ${light ? "bg-ink/15" : "bg-line"}`} />
      </div>
      <Reveal as="h2" className="display max-w-5xl text-[clamp(2.1rem,4.7vw,4.4rem)] leading-[0.98]">
        {title}
      </Reveal>
      {text ? (
        <p
          data-fade
          className={`mt-6 max-w-2xl text-lg leading-relaxed sm:mt-8 sm:text-xl sm:leading-relaxed ${
            light ? "text-ink/70" : "text-bone/70"
          }`}
        >
          {text}
        </p>
      ) : null}
    </header>
  );
}
