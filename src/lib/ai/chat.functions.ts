import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1).max(4000),
});

const InputSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(40),
  context: z
    .object({
      totalKgPerYear: z.number().optional(),
      ecoScore: z.number().optional(),
      level: z.string().optional(),
      breakdown: z
        .object({
          transport: z.number(),
          electricity: z.number(),
          food: z.number(),
          water: z.number(),
          waste: z.number(),
        })
        .optional(),
    })
    .optional(),
});

const SYSTEM_PROMPT = `You are an environmental sustainability expert AI assistant for EcoTrack AI.
Analyze user lifestyle data and provide:
- Clear carbon-impact analysis
- Personalized, practical sustainability suggestions
- Easy eco-friendly improvements anyone can start today
- Motivational, encouraging guidance

Tone: friendly, motivational, actionable, concise. Use short paragraphs and bullet points.
Never shame the user. Celebrate progress. When you have their footprint data, reference specific numbers and the largest impact category.`;

export const ecoChat = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      return { reply: "AI is not configured. Please set LOVABLE_API_KEY." };
    }

    const contextNote = data.context
      ? `\n\nUser's current footprint snapshot: ${JSON.stringify(data.context)}`
      : "";

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + contextNote },
          ...data.messages,
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      if (res.status === 429) return { reply: "I'm a bit overwhelmed right now — please try again in a moment." };
      if (res.status === 402) return { reply: "AI credits are exhausted for this workspace. Please add credits to continue." };
      console.error("AI gateway error", res.status, text);
      return { reply: "Sorry, I couldn't think of a reply just now. Try again shortly." };
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = json.choices?.[0]?.message?.content ?? "I don't have a response right now.";
    return { reply };
  });

const RecInputSchema = z.object({
  totalKgPerYear: z.number(),
  ecoScore: z.number(),
  breakdown: z.object({
    transport: z.number(),
    electricity: z.number(),
    food: z.number(),
    water: z.number(),
    waste: z.number(),
  }),
});

export const ecoRecommendations = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => RecInputSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return { recommendations: fallbackRecs(data) };

    const prompt = `Based on this annual carbon footprint (kg CO2e): ${JSON.stringify(data)}, give 5 highly personalized, practical recommendations to reduce impact. Focus first on the largest categories. Return a JSON array of objects with keys: title (short), description (one sentence), impact ("low"|"medium"|"high"), category ("transport"|"electricity"|"food"|"water"|"waste"). Only output JSON.`;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "You output only valid JSON arrays. No prose, no markdown fences." },
            { role: "user", content: prompt },
          ],
        }),
      });
      if (!res.ok) return { recommendations: fallbackRecs(data) };
      const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const text = json.choices?.[0]?.message?.content ?? "[]";
      const cleaned = text.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
      const parsed = JSON.parse(cleaned) as unknown;
      if (Array.isArray(parsed)) return { recommendations: parsed };
      return { recommendations: fallbackRecs(data) };
    } catch {
      return { recommendations: fallbackRecs(data) };
    }
  });

function fallbackRecs(d: z.infer<typeof RecInputSchema>) {
  const entries = Object.entries(d.breakdown).sort((a, b) => b[1] - a[1]);
  const top = entries[0]?.[0] ?? "transport";
  return [
    { title: "Audit your top category", description: `Your largest impact is ${top}. Focus reductions there first.`, impact: "high", category: top },
    { title: "Switch to LEDs", description: "Cut lighting electricity by up to 80% with LED bulbs.", impact: "medium", category: "electricity" },
    { title: "One meatless day per week", description: "A single plant-based day saves ~250 kg CO2e per year.", impact: "medium", category: "food" },
    { title: "Shorter showers", description: "Aim for 5 minutes to reduce hot water use and energy.", impact: "low", category: "water" },
    { title: "Recycle and compost", description: "Diverting organics from landfill significantly cuts methane.", impact: "medium", category: "waste" },
  ];
}