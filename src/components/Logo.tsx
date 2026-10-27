export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <rect x="1" y="1" width="30" height="30" rx="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 10h16M16 10v13" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="16" cy="23.5" r="2.6" fill="var(--volt)" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2.5 font-bold tracking-tight">
      <LogoMark />
      <span className="text-lg leading-none">
        tabus<span className="text-volt">.</span>tech
      </span>
    </span>
  );
}
