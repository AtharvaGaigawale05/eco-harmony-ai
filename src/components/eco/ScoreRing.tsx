export function ScoreRing({ score, level }: { score: number; level: string }) {
  const radius = 56;
  const c = 2 * Math.PI * radius;
  const offset = c - (Math.max(0, Math.min(100, score)) / 100) * c;
  return (
    <div className="flex items-center gap-4">
      <div className="relative size-32" aria-label={`Eco score ${score} out of 100`} role="img">
        <svg viewBox="0 0 140 140" className="size-32 -rotate-90">
          <circle cx="70" cy="70" r={radius} stroke="var(--border)" strokeWidth="10" fill="none" />
          <circle
            cx="70" cy="70" r={radius}
            stroke="url(#ring)" strokeWidth="10" fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 600ms ease" }}
          />
          <defs>
            <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--accent)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="text-3xl font-semibold">{score}</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Eco score</div>
          </div>
        </div>
      </div>
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Level</div>
        <div className="text-xl font-semibold text-gradient-eco">{level}</div>
      </div>
    </div>
  );
}