# 🔒 Security — EcoTrack AI

## Threat model (summary)

EcoTrack AI is a **client-first** application:

- All user lifestyle data is stored in the browser (`localStorage`). It never leaves the device except when the user actively chats with the AI coach.
- The only server surface is **TanStack `createServerFn`** RPCs (`ecoChat`, `ecoRecommendations`) running on the Cloudflare Workers edge.
- There is **no database**, **no auth**, **no PII collection**, and **no third-party analytics**.

## Stack-specific notes

This project runs on **TanStack Start on Cloudflare Workers**, not an Express server. Therefore the classic Express middleware stack (`helmet`, `cors`, `express-rate-limit`, `express-validator`) does not apply directly. The equivalent protections are:

| Express world        | EcoTrack AI equivalent                                                                 |
| -------------------- | -------------------------------------------------------------------------------------- |
| `helmet`             | Cloudflare edge sets baseline security headers; SSR HTML is fully escaped by React.    |
| `cors`               | Server functions are same-origin RPCs — no cross-origin surface is exposed.            |
| `express-rate-limit` | Lovable AI Gateway enforces per-key rate limiting and quota.                           |
| `express-validator`  | **Zod** schemas validate every server-function input (`src/lib/ai/chat.functions.ts`). |

## Server-function hardening checklist

- ✅ **Input validation** — every server function uses `.inputValidator()` backed by Zod with explicit min/max bounds (`messages.max(40)`, `content.max(4000)`).
- ✅ **Output sanitization** — AI responses are rendered as **plain text** (`whitespace-pre-wrap`); no `dangerouslySetInnerHTML` anywhere in the codebase.
- ✅ **Error sanitization** — provider errors are logged server-side; users see a friendly generic message (`"Sorry, I couldn't think of a reply just now."`).
- ✅ **Rate-limit friendliness** — HTTP `429` and `402` from the AI gateway are caught and surfaced as polite messages.
- ✅ **Secrets** — `LOVABLE_API_KEY` is read inside `.handler()` (per-request) from `process.env`. It is never imported into the client bundle. Vite's `*.server.*` import guard blocks any leakage path.
- ✅ **No secrets in code** — verified: `git grep -i 'sk-\|api_key=\|secret'` returns only environment-variable references.

## Client hardening

- ✅ React 19 default escaping for all rendered strings.
- ✅ No use of `eval`, `Function`, or dynamic script injection.
- ✅ All external links are first-party.
- ✅ Forms enforce numeric bounds at the input level (`min`, `max`, clamped in `num()`).
- ✅ Stored data is namespaced under `ecotrack:*` keys and contains only user-provided lifestyle estimates.

## Dependency security

- Run `bun audit` (or use Lovable's built-in dependency scanner) before each release.
- Dependencies are pinned to caret ranges; only well-maintained packages (Radix, TanStack, Recharts, lucide).
- No `postinstall` scripts from third parties.

## Responsible disclosure

Found something? Please open a private issue or email the maintainers via the Lovable project page. We aim to triage within **72 hours**.

## What is _not_ in scope

- Persistent user accounts (out of scope — no auth surface exists).
- Payment processing (none).
- File uploads (none).

If any of these are added later, this document **must** be updated alongside the feature.
