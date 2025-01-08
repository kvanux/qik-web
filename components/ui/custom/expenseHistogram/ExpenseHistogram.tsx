import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  Brush,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { formatNumber } from "@/lib/formatNumber";

interface HistogramProps {
  data: {
    x: string;
    y: number;
  }[];
  width?: number;
  height?: number;
}

const Histogram: React.FC<HistogramProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={312}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 0,
          left: 0,
          bottom: 30,
        }}
        barGap={0}
        barCategoryGap={0}
      >
        <CartesianGrid vertical={false} stroke="#E2E8F0" />
        {screen.width > 800 && (
          <YAxis
            orientation="left"
            stroke="#888888"
            fontSize={14}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            width={48}
          />
        )}

        <Tooltip
          cursor={{ fill: "#EBFAFF" }}
          content={({ active, payload }: TooltipProps<ValueType, NameType>) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="rounded-lg bg-white/95 p-3 shadow-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-normal text-slate-500 uppercase text-muted-foreground">
                      {data.x === 0
                        ? "Khoản chi dưới 100,000đ"
                        : `Khoản chi từ ${formatNumber(
                            data.x * 100000
                          )}đ - ${formatNumber(
                            (parseInt(data.x) + 1) * 100000
                          )}đ`}
                    </span>
                    <span className="font-medium text-muted-foreground text-slate-700 text-base">
                      <span className="font-normal">Số lần chi: </span>
                      {payload[0].value}
                    </span>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="y" fill="#016FB9" radius={[4, 4, 0, 0]} opacity={0.8} />
        {/* <Brush stroke="#CBD5E1" radius={4} /> */}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Histogram;
