"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  XAxis,
  Line,
  ResponsiveContainer,
} from "recharts";
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartContainer,
  ChartConfig,
} from "@/components/ui/chart";

interface YearChartProps {
  data: {
    month: number;
    green: number;
    red: number;
    line: number | undefined;
  }[];
}

const chartConfig = {} satisfies ChartConfig;

export function Year2({ data }: YearChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <ComposedChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <Bar
          dataKey="green"
          fill="#0CD498"
          opacity={0.7}
          radius={[4, 4, 0, 0]}
        />
        <Bar dataKey="red" fill="#F43F5E" opacity={0.7} radius={[4, 4, 0, 0]} />
        <Line dataKey="line" stroke="#00B8F5" />
      </ComposedChart>
    </ChartContainer>
  );
}
