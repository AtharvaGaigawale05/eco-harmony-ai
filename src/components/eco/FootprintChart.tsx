import { memo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { Breakdown } from "@/lib/eco/types";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function FootprintChartBase({ breakdown }: { breakdown: Breakdown }) {
  const data = [
    { name: "Transport", value: breakdown.transport },
    { name: "Electricity", value: breakdown.electricity },
    { name: "Food", value: breakdown.food },
    { name: "Water", value: breakdown.water },
    { name: "Waste", value: breakdown.waste },
  ];
  return (
    <div className="h-64 w-full" role="img" aria-label="Carbon footprint breakdown by category">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={90}
            stroke="none"
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              color: "var(--foreground)",
            }}
            formatter={(v: number, n: string) => [`${v} kg`, n]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export const FootprintChart = memo(FootprintChartBase);
