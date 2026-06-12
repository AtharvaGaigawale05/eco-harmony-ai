# 🌱 EcoTrack AI

> A premium AI-powered Carbon Footprint Awareness Platform — your futuristic sustainability coach.

EcoTrack AI helps users **measure**, **understand**, and **reduce** their environmental impact through a fast carbon calculator, a context-aware AI coach, a live analytics dashboard, and gamified eco challenges.

**Live:** https://eco-harmony-ai.lovable.app

---

## ✨ Features

- **Smart Carbon Calculator** — transport, energy, food, water & waste, in seconds.
- **AI Sustainability Coach** — personalized advice grounded in your real footprint data (Gemini 2.5 Flash via the Lovable AI Gateway).
- **Live Dashboard** — eco score, trends, category breakdown, and AI-generated reduction tips.
- **Gamified Challenges** — XP, badges, and milestones to build sustainable habits.
- **Private by default** — your data lives in your browser (localStorage). No accounts required.

## 🧱 Tech Stack

- **Framework:** TanStack Start v1 (React 19, SSR, Vite 7)
- **Styling:** Tailwind CSS v4 + semantic design tokens (glassmorphism, eco theme)
- **Charts:** Recharts
- **AI:** Lovable AI Gateway (`google/gemini-2.5-flash`)
- **Validation:** Zod (server input validation)
- **UI Primitives:** Radix UI + shadcn/ui
- **Icons:** lucide-react
- **Runtime:** Cloudflare Workers (edge SSR)

## 🚀 Quick Start

```bash
# 1. Install
bun install

# 2. Configure environment (see .env.example)
cp .env.example .env

# 3. Run dev server
bun run dev

# 4. Production build
bun run build
bun run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── eco/              # Domain UI: ScoreRing, FootprintChart, TrendChart
│   ├── layout/           # AppShell (nav + footer)
│   └── ui/               # shadcn primitives
├── lib/
│   ├── ai/               # AI server functions (chat, recommendations)
│   ├── eco/              # Calculation engine, types, storage, challenges
│   └── utils.ts
├── routes/               # File-based routes (TanStack Router)
│   ├── __root.tsx        # Root layout + <head>
│   ├── index.tsx         # Landing
│   ├── calculator.tsx
│   ├── assistant.tsx
│   ├── dashboard.tsx
│   └── challenges.tsx
└── styles.css            # Tailwind v4 tokens
```

## 🧪 Testing

See **[TESTING.md](./TESTING.md)** for full test instructions, coverage targets, and how to add new tests.

## 🔒 Security

See **[SECURITY.md](./SECURITY.md)** for the threat model, server-function hardening, and disclosure policy.

## 🚢 Deployment

The app deploys automatically on **Lovable** (Cloudflare Workers edge runtime).

- **Publish:** Open the project in Lovable → click **Publish**.
- **Custom domain:** Project Settings → Domains.
- **Required runtime secrets:** `LOVABLE_API_KEY` (auto-provisioned when Lovable AI is enabled).

Self-hosting on any Workers-compatible target:

```bash
bun run build       # outputs to .output/
# Deploy .output/ with your Workers/Node adapter of choice
```

## ♿ Accessibility

- Semantic HTML landmarks (`<main>`, `<nav aria-label>`, `<header>`, `<footer>`).
- All icon-only buttons carry `aria-label`; decorative icons use `aria-hidden`.
- Form fields use associated `<label>`s; chat input uses `sr-only` label.
- Live regions on the assistant (`aria-live="polite"`, `aria-busy`).
- Focus-visible rings on every interactive element via design tokens.
- Color contrast meets WCAG AA using design-system tokens (no arbitrary grays).
- Mobile viewport uses `h-dvh`, tap targets ≥ 40×40.

## 📦 Branching

> **This project ships from a single `main` branch.** All evaluation builds should be performed on `main`. No feature branches, no PRs required for the hackathon submission.

## 📝 License

MIT — built for Hack2Skill PromptWars 2026.
