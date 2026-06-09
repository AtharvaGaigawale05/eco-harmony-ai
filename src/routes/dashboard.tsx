import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { FootprintChart } from "@/components/eco/FootprintChart";
import { TrendChart } from "@/components/eco/TrendChart";
import { ScoreRing } from "@/components/eco/ScoreRing";
import { loadHistory, loadChallenges } from "@/lib/eco/storage";
import { BADGES } from "@/lib/eco/challenges";
import type { HistoryEntry } from "@/lib/eco/types";
import { Calculator, Trophy, Sparkles } from "lucide-react";
import { ecoRecommendations } from "@/lib/ai/chat.functions";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — EcoTrack AI" },
      { name: "description", content: "Track trends, eco score, and AI-driven recommendations on your sustainability dashboard." },
    ],
  }),
  component: DashboardPage,
});

type Rec = { title: string; description: string; impact: string; category: string };

function DashboardPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [completed, setCompleted] = useState(0);
  const [recs, setRecs] = useState<Rec[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  useEffect(() => {
    setHistory(loadHistory());
    const ch = loadChallenges();
    setCompleted(Object.values(ch).filter((c) => c.completed).length);
  }, []);

  const latest = history[0];

  useEffect(() => {
    if (!latest) return;
    let cancelled = false;
    setLoadingRecs(true);
    ecoRecommendations({ data: { totalKgPerYear: latest.totalKgPerYear, ecoScore: latest.ecoScore, breakdown: latest.breakdown } })
      .then((r) => { if (!cancelled) setRecs(r.recommendations as Rec[]); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingRecs(false); });
    return () => { cancelled = true; };
  }, [latest]);

  const monthlyAvg = useMemo(() => {
    if (!history.length) return 0;
    return Math.round(history.slice(0, 4).reduce((s, h) => s + h.totalKgPerYear, 0) / Math.min(4, history.length) / 12);
  }, [history]);

  const unlockedBadges = BADGES.filter((b) => completed >= b.threshold);

  if (!latest) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-3xl font-semibold">No data yet</h1>
          <p className="mt-2 text-muted-foreground">Save your first footprint snapshot to unlock the dashboard.</p>
          <Link to="/calculator" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-eco px-5 py-3 text-sm font-medium text-primary-foreground shadow-glow">
            <Calculator className="size-4" aria-hidden /> Open calculator
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
        <header>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Your dashboard</h1>
          <p className="mt-2 text-muted-foreground">Live snapshot, trends and personalized AI insights.</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-6 shadow-elegant">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Today's impact</div>
            <div className="mt-1 text-3xl font-semibold">{Math.round(latest.totalKgPerYear / 365)} <span className="text-base text-muted-foreground">kg/day</span></div>
            <div className="text-xs text-muted-foreground mt-1">{latest.totalKgPerYear.toLocaleString()} kg / year</div>
          </div>
          <div className="glass rounded-2xl p-6 shadow-elegant">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Monthly average</div>
            <div className="mt-1 text-3xl font-semibold">{monthlyAvg} <span className="text-base text-muted-foreground">kg/month</span></div>
            <div className="text-xs text-muted-foreground mt-1">Across last {Math.min(4, history.length)} snapshots</div>
          </div>
          <div className="glass rounded-2xl p-6 shadow-elegant flex items-center justify-between">
            <ScoreRing score={latest.ecoScore} level={latest.level} />
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 glass rounded-2xl p-4 shadow-elegant">
            <h2 className="px-2 pt-1 text-sm font-semibold">Trend</h2>
            <TrendChart history={history} />
          </div>
          <div className="lg:col-span-2 glass rounded-2xl p-4 shadow-elegant">
            <h2 className="px-2 pt-1 text-sm font-semibold">Breakdown</h2>
            <FootprintChart breakdown={latest.breakdown} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 glass rounded-2xl p-6 shadow-elegant">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2"><Sparkles className="size-4 text-primary" aria-hidden /> AI recommendations</h2>
              {loadingRecs && <span className="text-xs text-muted-foreground">Thinking…</span>}
            </div>
            <ul className="mt-4 grid sm:grid-cols-2 gap-3">
              {recs.length === 0 && !loadingRecs && (
                <li className="text-sm text-muted-foreground">No recommendations yet.</li>
              )}
              {recs.map((r, i) => (
                <li key={i} className="rounded-xl bg-secondary/40 p-4 border border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">{r.title}</h3>
                    <span className="text-[10px] uppercase tracking-widest rounded-full px-2 py-0.5 bg-primary/15 text-primary">{r.impact}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{r.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-2xl p-6 shadow-elegant">
            <h2 className="font-semibold flex items-center gap-2"><Trophy className="size-4 text-primary" aria-hidden /> Achievements</h2>
            <ul className="mt-4 space-y-2">
              {BADGES.map((b) => {
                const unlocked = unlockedBadges.includes(b);
                return (
                  <li key={b.id} className={`rounded-lg p-3 border ${unlocked ? "border-primary/40 bg-primary/10" : "border-border bg-secondary/30 opacity-70"}`}>
                    <div className="text-sm font-medium">{b.name}</div>
                    <div className="text-xs text-muted-foreground">{b.description}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}