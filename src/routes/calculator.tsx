import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { FootprintChart } from "@/components/eco/FootprintChart";
import { ScoreRing } from "@/components/eco/ScoreRing";
import { calculate, DEFAULT_INPUT } from "@/lib/eco/calculate";
import type { CalculatorInput } from "@/lib/eco/types";
import { loadInput, saveInput, saveHistoryEntry } from "@/lib/eco/storage";
import { ArrowRight, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Carbon Calculator — EcoTrack AI" },
      {
        name: "description",
        content:
          "Estimate your annual carbon footprint from transport, energy, food, water and waste.",
      },
    ],
  }),
  component: CalculatorPage,
});

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-medium">{label}</span>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg bg-secondary/40 border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent transition";

function CalculatorPage() {
  const [input, setInput] = useState<CalculatorInput>(DEFAULT_INPUT);

  useEffect(() => {
    const saved = loadInput();
    if (saved) setInput(saved);
  }, []);

  const result = useMemo(() => calculate(input), [input]);

  function update<K extends keyof CalculatorInput>(key: K, value: CalculatorInput[K]) {
    setInput((prev) => {
      const next = { ...prev, [key]: value };
      saveInput(next);
      return next;
    });
  }

  function num(v: string): number {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  }

  function onSave() {
    saveHistoryEntry({ ...result, id: crypto.randomUUID(), input });
    toast.success("Snapshot saved to your dashboard");
  }

  function onReset() {
    setInput(DEFAULT_INPUT);
    saveInput(DEFAULT_INPUT);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Carbon Calculator</h1>
          <p className="mt-2 text-muted-foreground">
            Adjust the inputs — your footprint updates in real time.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <form
            className="lg:col-span-3 glass rounded-2xl p-6 shadow-elegant space-y-6"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Carbon footprint inputs"
          >
            <fieldset className="space-y-4">
              <legend className="text-sm uppercase tracking-widest text-primary font-semibold">
                Transport
              </legend>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Car km / week" hint="0-1000">
                  <input
                    type="number"
                    min={0}
                    max={2000}
                    inputMode="numeric"
                    className={inputCls}
                    value={input.carKmPerWeek}
                    onChange={(e) => update("carKmPerWeek", num(e.target.value))}
                  />
                </Field>
                <Field label="Public transit km / week">
                  <input
                    type="number"
                    min={0}
                    max={1000}
                    className={inputCls}
                    value={input.publicTransitKmPerWeek}
                    onChange={(e) => update("publicTransitKmPerWeek", num(e.target.value))}
                  />
                </Field>
                <Field label="Flights / year" hint="round trips">
                  <input
                    type="number"
                    min={0}
                    max={50}
                    className={inputCls}
                    value={input.flightsPerYear}
                    onChange={(e) => update("flightsPerYear", num(e.target.value))}
                  />
                </Field>
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="text-sm uppercase tracking-widest text-primary font-semibold">
                Energy
              </legend>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Electricity kWh / month">
                  <input
                    type="number"
                    min={0}
                    max={5000}
                    className={inputCls}
                    value={input.electricityKwhPerMonth}
                    onChange={(e) => update("electricityKwhPerMonth", num(e.target.value))}
                  />
                </Field>
                <Field label={`Renewable share: ${input.renewableShare}%`}>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    className="w-full accent-[var(--primary)]"
                    value={input.renewableShare}
                    onChange={(e) => update("renewableShare", num(e.target.value))}
                  />
                </Field>
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="text-sm uppercase tracking-widest text-primary font-semibold">
                Food
              </legend>
              <Field label="Diet">
                <select
                  className={inputCls}
                  value={input.dietType}
                  onChange={(e) =>
                    update("dietType", e.target.value as CalculatorInput["dietType"])
                  }
                >
                  <option value="vegan">Vegan</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="omnivore">Omnivore</option>
                  <option value="heavy_meat">Heavy meat</option>
                </select>
              </Field>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="text-sm uppercase tracking-widest text-primary font-semibold">
                Water & waste
              </legend>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Water L / day">
                  <input
                    type="number"
                    min={0}
                    max={1000}
                    className={inputCls}
                    value={input.waterLitersPerDay}
                    onChange={(e) => update("waterLitersPerDay", num(e.target.value))}
                  />
                </Field>
                <Field label="Waste kg / week">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className={inputCls}
                    value={input.wasteKgPerWeek}
                    onChange={(e) => update("wasteKgPerWeek", num(e.target.value))}
                  />
                </Field>
                <Field label={`Recycling share: ${input.recyclingShare}%`}>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    className="w-full accent-[var(--primary)]"
                    value={input.recyclingShare}
                    onChange={(e) => update("recyclingShare", num(e.target.value))}
                  />
                </Field>
              </div>
            </fieldset>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onSave}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-eco px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-90"
              >
                <Save className="size-4" aria-hidden /> Save snapshot
              </button>
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-2 rounded-lg glass px-4 py-2 text-sm hover:bg-secondary/60"
              >
                <RefreshCw className="size-4" aria-hidden /> Reset
              </button>
            </div>
          </form>

          <aside className="lg:col-span-2 space-y-4">
            <div className="glass rounded-2xl p-6 shadow-elegant">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    Annual footprint
                  </div>
                  <div className="mt-1 text-3xl font-semibold">
                    {result.totalKgPerYear.toLocaleString()}{" "}
                    <span className="text-base text-muted-foreground">kg CO₂e</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{result.rating}</div>
                </div>
              </div>
              <div className="mt-6">
                <ScoreRing score={result.ecoScore} level={result.level} />
              </div>
            </div>

            <div className="glass rounded-2xl p-4 shadow-elegant">
              <h2 className="px-2 pt-1 text-sm font-semibold">Category breakdown</h2>
              <FootprintChart breakdown={result.breakdown} />
              <ul className="grid grid-cols-2 gap-2 px-2 pb-2 text-xs">
                {Object.entries(result.breakdown).map(([k, v]) => (
                  <li key={k} className="flex justify-between rounded-lg bg-secondary/40 px-2 py-1">
                    <span className="capitalize text-muted-foreground">{k}</span>
                    <span className="font-medium">{v} kg</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/assistant"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-eco px-4 py-3 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-90"
            >
              Get AI recommendations <ArrowRight className="size-4" aria-hidden />
            </Link>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
