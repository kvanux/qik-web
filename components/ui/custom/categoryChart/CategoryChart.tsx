import React from "react";
import {
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Cell,
  Tooltip,
  TooltipProps,
  Legend,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

interface CategoryChartProps {
  data: {
    id: number | undefined;
    label: string;
    amount: number;
    fill: string;
  }[];
}

const CategoryChart = ({ data }: CategoryChartProps) => {
  const totalCategories = data.length;
  const totalAmount = data.reduce((sum, category) => sum + category.amount, 0);

  return (
    <ResponsiveContainer width="100%" height={312}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="label"
          fill="#69D9FF"
          innerRadius={60}
          strokeWidth={5}
        >
          {data.map((category, index) => (
            <Cell key={`cell-${index}`} fill={category.fill} />
          ))}
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 8}
                      className="text-slate-800 text-3xl font-bold"
                    >
                      {totalCategories}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="text-slate-600"
                    >
                      Phân loại
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
        <Tooltip
          content={({ active, payload }: TooltipProps<ValueType, NameType>) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="rounded-lg bg-white/95 p-3 shadow-sm">
                  <div className="flex flex-col gap-2">
                    <div className="w-56 flex justify-between">
                      <div className="flex gap-1 items-center">
                        <div
                          className={`w-3 h-3 rounded-sm mt-[2px] bg-[${data.fill}]`}
                        />
                        <span className="font-normal text-slate-600 text-sm">
                          {data.label}:{" "}
                        </span>
                      </div>
                      <span className="font-medium text-muted-foreground text-slate-800 text-sm">
                        {Math.floor((data.amount / totalAmount) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryChart;
