import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ecoChat } from "@/lib/ai/chat.functions";
import { loadHistory } from "@/lib/eco/storage";
import { Bot, Send, User, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Sustainability Coach — EcoTrack AI" },
      {
        name: "description",
        content: "Chat with your AI sustainability coach for personalized eco-friendly advice.",
      },
    ],
  }),
  component: AssistantPage,
});

type Msg = { id: string; role: "user" | "assistant"; content: string };

const STARTERS = [
  "What are the easiest changes I can make this week?",
  "How can I cut my transport emissions in half?",
  "Is plant-based diet really that impactful?",
  "Give me a 30-day sustainability plan.",
];

function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi 👋 I'm your EcoTrack AI coach. Ask me anything about reducing your carbon footprint — I'll personalize advice using your latest data.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    const history = loadHistory();
    const latest = history[0];
    try {
      const res = await ecoChat({
        data: {
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          context: latest
            ? {
                totalKgPerYear: latest.totalKgPerYear,
                ecoScore: latest.ecoScore,
                level: latest.level,
                breakdown: latest.breakdown,
              }
            : undefined,
        },
      });
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "assistant", content: res.reply },
      ]);
    } catch {
      toast.error("Couldn't reach the AI coach. Try again.");
    } finally {
      setLoading(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-8 flex flex-col h-[calc(100dvh-8rem)]">
        <header className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight flex items-center gap-2">
            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-gradient-eco shadow-glow">
              <Bot className="size-5 text-primary-foreground" aria-hidden />
            </span>
            AI Sustainability Coach
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Personalized, motivational guidance for a lighter footprint.
          </p>
        </header>

        <div
          ref={scrollerRef}
          className="flex-1 overflow-y-auto glass rounded-2xl p-4 sm:p-6 shadow-elegant space-y-4"
          aria-live="polite"
          aria-busy={loading}
        >
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "assistant" && (
                <span className="shrink-0 size-8 rounded-lg bg-primary/15 text-primary grid place-items-center">
                  <Bot className="size-4" aria-hidden />
                </span>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-gradient-eco text-primary-foreground rounded-br-sm"
                    : "bg-secondary/60 text-foreground rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
              {m.role === "user" && (
                <span className="shrink-0 size-8 rounded-lg bg-secondary grid place-items-center">
                  <User className="size-4" aria-hidden />
                </span>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 items-center text-sm text-muted-foreground">
              <span className="shrink-0 size-8 rounded-lg bg-primary/15 text-primary grid place-items-center">
                <Bot className="size-4" aria-hidden />
              </span>
              <span className="inline-flex gap-1">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                <span className="size-1.5 rounded-full bg-primary animate-pulse [animation-delay:120ms]" />
                <span className="size-1.5 rounded-full bg-primary animate-pulse [animation-delay:240ms]" />
              </span>
              Thinking…
            </div>
          )}
        </div>

        {messages.length <= 1 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {STARTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-full glass px-3 py-1.5 text-xs hover:bg-secondary/60 inline-flex items-center gap-1.5"
              >
                <Sparkles className="size-3 text-primary" aria-hidden /> {s}
              </button>
            ))}
          </div>
        )}

        <form
          className="mt-3 glass rounded-2xl p-2 flex items-end gap-2 shadow-elegant"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <label className="sr-only" htmlFor="chat-input">
            Ask your AI coach
          </label>
          <textarea
            id="chat-input"
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            placeholder="Ask anything — e.g. 'How can I lower my electricity impact?'"
            className="flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground max-h-40"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send message"
            className="inline-flex items-center justify-center size-10 rounded-xl bg-gradient-eco text-primary-foreground shadow-glow disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          >
            <Send className="size-4" aria-hidden />
          </button>
        </form>
      </div>
    </AppShell>
  );
}
