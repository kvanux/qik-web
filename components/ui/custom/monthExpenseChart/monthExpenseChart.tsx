import {
  Area,
  AreaChart,
  ResponsiveContainer,
  YAxis,
  Tooltip,
  CartesianGrid,
  TooltipProps,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { formatNumber } from "@/lib/formatNumber";

const MonthExpenseChart = ({
  data,
}: {
  data: Array<{ date: string; amount: number }>;
}) => {
  return (
    <div className="h-full w-full flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-slate-800">Spending Trend</h2>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 12,
            right: 8,
            left: 0,
            bottom: 4,
          }}
        >
          <defs>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#69D9FF" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#18F2B2" stopOpacity={0.07} />
            </linearGradient>
          </defs>

          <YAxis
            orientation="right"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) =>
              `${formatNumber(Math.trunc(value))}${value !== 0 && ",000"}`
            }
            width={80}
          />
          <CartesianGrid vertical={false} stroke="#E2E8F0" />
          <Tooltip
            content={({
              active,
              payload,
            }: TooltipProps<ValueType, NameType>) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg bg-white/90 p-3 shadow-sm">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-normal text-slate-500 uppercase text-muted-foreground">
                        {data.date}
                      </span>
                      <span className="font-medium text-muted-foreground text-slate-800 text-base">
                        {formatNumber(payload[0].value as number)}
                        {payload[0].value != 0 && (
                          <span className="text-slate-400">,000</span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#69D9FF"
            strokeWidth={2}
            fill="url(#colorExpense)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthExpenseChart;
