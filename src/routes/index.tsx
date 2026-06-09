import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Bot, Calculator, LayoutDashboard, Trophy, Leaf, Sparkles, ShieldCheck, Gauge } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoTrack AI — Your AI Sustainability Coach" },
      { name: "description", content: "Track your carbon footprint, get personalized AI sustainability advice, and build eco-friendly habits with gamified challenges." },
      { property: "og:title", content: "EcoTrack AI — Your AI Sustainability Coach" },
      { property: "og:description", content: "Track your carbon footprint and get personalized AI sustainability advice." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <AppShell>
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 size-[800px] rounded-full bg-primary/15 blur-[140px]" />
          <div className="absolute bottom-[-40%] right-[-10%] size-[600px] rounded-full bg-accent/10 blur-[120px]" />
        </div>
        <div className="mx-auto max-w-6xl px-4 pt-20 pb-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" aria-hidden />
            AI-powered sustainability coach
          </span>
          <h1 className="mt-6 text-4xl sm:text-6xl font-semibold tracking-tight">
            Understand your impact.<br />
            <span className="text-gradient-eco">Live lighter on the planet.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-muted-foreground text-base sm:text-lg">
            EcoTrack AI calculates your carbon footprint, coaches you with personalized AI advice, and turns daily habits into a gamified mission for the planet.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/calculator" className="inline-flex items-center gap-2 rounded-xl bg-gradient-eco px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90 transition">
              <Calculator className="size-4" aria-hidden /> Calculate my footprint
            </Link>
            <Link to="/assistant" className="inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm font-medium hover:bg-secondary/60 transition">
              <Bot className="size-4" aria-hidden /> Chat with the AI coach
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-20">
          {[
            { icon: Calculator, title: "Smart calculator", desc: "Transport, energy, food, water and waste — measured in seconds." },
            { icon: Bot, title: "AI coach", desc: "Personalized, motivational guidance grounded in your data." },
            { icon: LayoutDashboard, title: "Live dashboard", desc: "Beautiful charts that show trends and category breakdowns." },
            { icon: Trophy, title: "Eco challenges", desc: "Gamified missions and badges to build sustainable habits." },
          ].map((f) => (
            <div key={f.title} className="glass rounded-2xl p-5 shadow-elegant">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <f.icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-24">
          <div className="glass rounded-3xl p-8 sm:p-12 text-center shadow-elegant">
            <Leaf className="mx-auto size-8 text-primary" aria-hidden />
            <h2 className="mt-3 text-2xl sm:text-3xl font-semibold">Every action counts</h2>
            <p className="mt-2 max-w-xl mx-auto text-muted-foreground text-sm sm:text-base">
              Small, consistent changes compound. Start with your footprint and let your AI coach take it from there.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-4 text-primary" aria-hidden /> Private — data stays in your browser</span>
              <span className="inline-flex items-center gap-1.5"><Gauge className="size-4 text-primary" aria-hidden /> Fast, accessible UI</span>
              <span className="inline-flex items-center gap-1.5"><Sparkles className="size-4 text-primary" aria-hidden /> Powered by Lovable AI</span>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
