import React from "react";
import {
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
  ComposedChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { formatNumber } from "@/lib/formatNumber";

interface YearChartProps {
  data: {
    month: string;
    green: number;
    red: number;
    line: number | undefined;
  }[];
}

export function YearChart({ data }: YearChartProps) {
  const minY = Math.min(...data.map((d) => d.line as number));

  return (
    <ResponsiveContainer width="100%" height={312}>
      <ComposedChart
        data={data}
        margin={{
          bottom: 0,
        }}
        barGap={0}
      >
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#69D9FF" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#18F2B2" stopOpacity={0.07} />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} stroke="#E2E8F0" />
        <YAxis
          key="line "
          domain={["auto", "auto"]}
          type="number"
          allowDataOverflow
          hide
          width={0}
        />
        {screen.width > 800 && (
          <XAxis
            dataKey="month"
            stroke="#64748B"
            tickMargin={12}
            fontSize={14}
            height={20}
            domain={["auto", "auto"]}
            strokeWidth={minY < 0 ? 0 : 1}
          />
        )}
        <XAxis
          dataKey="month"
          stroke="#64748B"
          tickMargin={0}
          fontSize={12}
          height={4}
          domain={["auto", "auto"]}
          strokeWidth={minY < 0 ? 0 : 1}
          tick={false}
        />
        {minY < 0 && (
          <ReferenceLine
            y={0}
            stroke="#64748B"
            strokeWidth={1}
            strokeOpacity={0.8}
          />
        )}
        <Tooltip
          cursor={{ stroke: "#69D9FF" }}
          content={({ active, payload }: TooltipProps<ValueType, NameType>) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="rounded-lg bg-white/95 p-3 shadow-sm min-[360px]:max-[800px]:shadow-md">
                  <div className="flex flex-col gap-2">
                    <span className="text-slate-600 font-medium">
                      {data.month}
                    </span>
                    <div className="w-56 flex justify-between">
                      <div className="flex gap-1 items-center">
                        <div className="w-3 h-3 rounded-sm mt-[2px] bg-qik-ter-600" />
                        <span className="font-normal text-slate-600 text-sm">
                          Thu nhập:{" "}
                        </span>
                      </div>
                      <span className="font-medium text-muted-foreground text-slate-800 text-sm">
                        {formatNumber(data.green as number)}
                        {data.green != 0 && (
                          <span className="text-slate-400">,000đ</span>
                        )}
                      </span>
                    </div>
                    <div className="w-56 flex justify-between">
                      <div className="flex gap-1 items-center">
                        <div className="w-3 h-3 rounded-sm mt-[2px] bg-rose-500" />
                        <span className="font-normal text-slate-600 text-sm">
                          Chi phí:{" "}
                        </span>
                      </div>
                      <span className="font-medium text-muted-foreground text-slate-800 text-sm">
                        {formatNumber(data.red as number)}
                        {data.red != 0 && (
                          <span className="text-slate-400">,000đ</span>
                        )}
                      </span>
                    </div>
                    <div className="w-56 flex justify-between">
                      <div className="flex gap-1 items-center">
                        <div className="w-3 h-3 rounded-sm mt-[2px] bg-qik-pri-700" />
                        <span className="font-normal text-slate-600 text-sm">
                          Tổng:{" "}
                        </span>
                      </div>
                      <span className="font-medium text-muted-foreground text-slate-800 text-sm">
                        {formatNumber(data.line as number)}
                        {data.line != 0 && (
                          <span className="text-slate-400">,000đ</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar
          dataKey="green"
          fill="#0CD498"
          opacity={0.7}
          radius={[4, 4, 0, 0]}
        />
        <Bar dataKey="red" fill="#F43F5E" opacity={0.7} radius={[4, 4, 0, 0]} />
        <Area
          type="monotone"
          dataKey="line"
          stroke="#00B8F5"
          strokeWidth={2}
          fill="url(#colorTotal)"
          dot={{
            fill: "#fff",
          }}
          activeDot={{
            r: 6,
          }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
