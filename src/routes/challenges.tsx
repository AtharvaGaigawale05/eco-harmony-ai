import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { CHALLENGES, BADGES } from "@/lib/eco/challenges";
import { loadChallenges, saveChallenges, type ChallengeState } from "@/lib/eco/storage";
import { Check, Flame, Trophy, Zap } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/challenges")({
  head: () => ({
    meta: [
      { title: "Eco Challenges — EcoTrack AI" },
      { name: "description", content: "Take on weekly eco challenges, earn XP, and unlock sustainability achievements." },
    ],
  }),
  component: ChallengesPage,
});

function ChallengesPage() {
  const [state, setState] = useState<ChallengeState>({});

  useEffect(() => { setState(loadChallenges()); }, []);

  const totals = useMemo(() => {
    const completed = Object.values(state).filter((c) => c.completed).length;
    const xp = CHALLENGES.reduce((s, c) => s + (state[c.id]?.completed ? c.xp : 0), 0);
    return { completed, xp };
  }, [state]);

  const unlocked = BADGES.filter((b) => totals.completed >= b.threshold);

  function toggleComplete(id: string) {
    setState((prev) => {
      const cur = prev[id] ?? { completed: false, progress: 0 };
      const next: ChallengeState = { ...prev, [id]: { completed: !cur.completed, progress: !cur.completed ? 100 : 0 } };
      saveChallenges(next);
      if (!cur.completed) toast.success("Challenge completed — nice work! 🌿");
      return next;
    });
  }

  function setProgress(id: string, value: number) {
    setState((prev) => {
      const cur = prev[id] ?? { completed: false, progress: 0 };
      const completed = value >= 100;
      const next: ChallengeState = { ...prev, [id]: { completed, progress: Math.min(100, Math.max(0, value)) } };
      saveChallenges(next);
      return next;
    });
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
        <header>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Eco Challenges</h1>
          <p className="mt-2 text-muted-foreground">Build habits with weekly missions. Earn XP, unlock badges.</p>
        </header>

        <div className="grid sm:grid-cols-3 gap-4">
          <Stat icon={<Flame className="size-4" />} label="Completed" value={String(totals.completed)} />
          <Stat icon={<Zap className="size-4" />} label="Total XP" value={totals.xp.toLocaleString()} />
          <Stat icon={<Trophy className="size-4" />} label="Badges" value={`${unlocked.length} / ${BADGES.length}`} />
        </div>

        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHALLENGES.map((c) => {
            const cur = state[c.id] ?? { completed: false, progress: 0 };
            return (
              <li key={c.id} className="glass rounded-2xl p-5 shadow-elegant flex flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-primary font-semibold">{c.category}</div>
                    <h3 className="mt-1 font-semibold">{c.title}</h3>
                  </div>
                  <span className="rounded-full bg-primary/15 text-primary text-xs px-2 py-0.5">+{c.xp} XP</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground flex-1">{c.description}</p>
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                    <span>Progress</span><span>{cur.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary/60 overflow-hidden">
                    <div className="h-full bg-gradient-eco transition-all" style={{ width: `${cur.progress}%` }} />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={10}
                    value={cur.progress}
                    onChange={(e) => setProgress(c.id, Number(e.target.value))}
                    aria-label={`${c.title} progress`}
                    className="w-full mt-2 accent-[var(--primary)]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => toggleComplete(c.id)}
                  className={`mt-3 inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    cur.completed
                      ? "bg-primary/15 text-primary border border-primary/40"
                      : "bg-gradient-eco text-primary-foreground shadow-glow hover:opacity-90"
                  }`}
                  aria-pressed={cur.completed}
                >
                  <Check className="size-4" aria-hidden />
                  {cur.completed ? "Completed" : "Mark complete"}
                </button>
              </li>
            );
          })}
        </ul>

        <section className="glass rounded-2xl p-6 shadow-elegant">
          <h2 className="font-semibold flex items-center gap-2"><Trophy className="size-4 text-primary" aria-hidden /> Badges</h2>
          <ul className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {BADGES.map((b) => {
              const isUnlocked = totals.completed >= b.threshold;
              return (
                <li key={b.id} className={`rounded-xl p-4 border ${isUnlocked ? "border-primary/40 bg-primary/10" : "border-border bg-secondary/30 opacity-70"}`}>
                  <div className="text-sm font-medium">{b.name}</div>
                  <div className="text-xs text-muted-foreground">{b.description}</div>
                  <div className="text-[11px] mt-1 text-primary">{isUnlocked ? "Unlocked" : `Complete ${b.threshold} challenges`}</div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-5 shadow-elegant flex items-center gap-3">
      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">{icon}</span>
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="text-xl font-semibold">{value}</div>
      </div>
    </div>
  );
}