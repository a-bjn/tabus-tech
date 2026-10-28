import { PROMO } from "@/data/site";

export default function PromoBanner() {
  if (!PROMO.enabled) return null;

  return (
    <aside className="promo-bar" aria-label="Ofertă de lansare">
      <div className="wrap flex min-h-[var(--promo-h)] flex-wrap items-center justify-center gap-x-4 gap-y-1 py-2 text-center sm:justify-between sm:text-left">
        <p className="text-sm font-medium leading-snug text-ink sm:text-[0.9375rem]">{PROMO.message}</p>
        <a href={PROMO.ctaHref} className="promo-bar-cta shrink-0 text-sm font-semibold text-ink underline decoration-2 underline-offset-4 hover:decoration-transparent">
          {PROMO.ctaLabel}
        </a>
      </div>
    </aside>
  );
}
