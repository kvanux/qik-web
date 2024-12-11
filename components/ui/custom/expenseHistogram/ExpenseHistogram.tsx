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

const Histogram: React.FC<HistogramProps> = ({
  data,
  width = 800,
  height = 400,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 0,
          left: 0,
          bottom: 30,
        }}
      >
        <CartesianGrid vertical={false} stroke="#E2E8F0" />
        <YAxis
          orientation="left"
          stroke="#888888"
          fontSize={14}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          width={24}
        />
        <Tooltip
          content={({ active, payload }: TooltipProps<ValueType, NameType>) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="rounded-lg bg-white/90 p-3 shadow-sm">
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
                    <span className="font-medium text-muted-foreground text-slate-800 text-base">
                      Số lần chi: {formatNumber(payload[0].value as number)}
                    </span>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="y" fill="#016FB9" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Histogram;
