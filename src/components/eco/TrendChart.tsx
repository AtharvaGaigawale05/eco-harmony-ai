import { memo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { HistoryEntry } from "@/lib/eco/types";

function TrendChartBase({ history }: { history: HistoryEntry[] }) {
  const data = [...history]
    .reverse()
    .slice(-12)
    .map((h, i) => ({
      name: `#${i + 1}`,
      total: h.totalKgPerYear,
      score: h.ecoScore,
    }));
  return (
    <div className="h-64 w-full" role="img" aria-label="Trend of your footprint over time">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.6} />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
          <YAxis stroke="var(--muted-foreground)" fontSize={12} />
          <Tooltip
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              color: "var(--foreground)",
            }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="var(--chart-1)"
            strokeWidth={2}
            fill="url(#g1)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export const TrendChart = memo(TrendChartBase);
