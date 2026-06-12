import { Link } from "@tanstack/react-router";
import { Leaf, LayoutDashboard, Calculator, Bot, Trophy, Home } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/calculator", label: "Calculator", icon: Calculator },
  { to: "/assistant", label: "Assistant", icon: Bot },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/challenges", label: "Challenges", icon: Trophy },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border/60 backdrop-blur-xl bg-background/60">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 group" aria-label="EcoTrack AI home">
            <span className="size-9 rounded-xl bg-gradient-eco grid place-items-center shadow-glow">
              <Leaf className="size-5 text-primary-foreground" aria-hidden />
            </span>
            <span className="font-semibold tracking-tight text-lg">
              EcoTrack <span className="text-gradient-eco">AI</span>
            </span>
          </Link>
          <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                activeProps={{
                  className: "px-3 py-2 rounded-lg text-sm text-foreground bg-secondary/80",
                }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            to="/calculator"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-gradient-eco px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-90 transition"
          >
            Get started
          </Link>
        </div>
        <nav
          aria-label="Primary mobile"
          className="md:hidden border-t border-border/60 overflow-x-auto"
        >
          <ul className="flex items-center gap-1 px-2 py-2 min-w-max">
            {nav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground"
                  activeProps={{
                    className:
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-foreground bg-secondary/80",
                  }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  <item.icon className="size-4" aria-hidden />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/60 mt-12">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground flex items-center justify-between">
          <span>© {new Date().getFullYear()} EcoTrack AI — Built for the planet 🌱</span>
          <span>Estimates are educational, not audited.</span>
        </div>
      </footer>
    </div>
  );
}
