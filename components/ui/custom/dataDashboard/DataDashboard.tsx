"use client";

import React from "react";
import { useState, useMemo } from "react";
import { cn, yearList } from "@/lib/utils";
import { Expense, Income, Billing } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ExpenseHistogram from "@/components/ui/custom/expenseHistogram/ExpenseHistogram";

interface DataProps {
  expenses: Expense[];
  income: Income[];
  billing: Billing[];
}

const DataDashboard = ({ expenses, income, billing }: DataProps) => {
  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState(currentYear);

  const comboChartData = null;
  const pieChartData = null;

  const histogramData = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return [
        {
          x: "0",
          y: 0,
        },
      ];
    }

    const maxAmount = expenses.reduce(
      (max, expense) => Math.max(max, expense.amount),
      0
    );

    if (maxAmount === 0) {
      return [
        {
          x: "0",
          y: 0,
        },
      ];
    }

    const columns: { label: string; amount: number }[] = [];

    for (let i = 0; i <= Math.floor(maxAmount / 100); i++) {
      columns.push({
        label: i.toString(),
        amount: 0,
      });
    }

    expenses.forEach((expense) => {
      const index = Math.floor(expense.amount / 100);
      if (index < columns.length) {
        columns[index].amount += 1;
      }
    });

    console.log(maxAmount);

    console.log(columns);

    return columns.map((column) => ({
      x: column.label,
      y: column.amount,
    }));
  }, [expenses, currentYear]);

  return (
    <div className="grid grid-cols-12 gap-6 w-full h-full max-w-[1840px] self-center">
      <div className="col-span-3 flex flex-col gap-4 bg-white rounded-xl p-5 shadow-qele-panel">
        <div className="w-full flex h-10 gap-3 items-center">
          <h2 className="text-xl font-semibold text-neutral-800 w-full">
            Phân tích tổng quan
          </h2>
          <Separator orientation="vertical" className="h-7" />
          <p className="text-slate-500 text-base font-medium">{year}</p>
        </div>
        <div className="flex w-full">Insights Cards go here...</div>
      </div>
      <div className="flex flex-col h-full gap-6 col-span-9">
        <div className="h-full w-full flex flex-col gap-4 bg-white rounded-xl p-5 shadow-qele-panel">
          <div className="w-full flex h-10 justify-between items-center">
            <h2 className="text-xl font-semibold text-neutral-800 w-full">
              Tài chính theo năm
            </h2>
            <Select
              value={year.toString()}
              onValueChange={(newValue) => {
                setYear(Number(newValue));
              }}
            >
              <SelectTrigger className="w-56 text-base">
                <SelectValue defaultValue={currentYear} />
              </SelectTrigger>
              <SelectContent>
                {yearList.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>Combo Chart goes here...</div>
        </div>
        <div className="h-full w-full flex gap-6">
          <div className="h-full w-full flex flex-col gap-4 bg-white rounded-xl p-5 shadow-qele-panel">
            <div className="w-full flex h-10 gap-3 items-center">
              <h2 className="text-xl font-semibold text-neutral-800 w-full">
                Phân lượng chi tiêu
              </h2>
              <Separator orientation="vertical" className="h-7" />
              <p className="text-slate-500 text-base font-medium">{year}</p>
            </div>
            <div className="flex w-full">
              <ExpenseHistogram data={histogramData} />
            </div>
          </div>
          <div className="h-full w-full flex flex-col gap-4 bg-white rounded-xl p-5 shadow-qele-panel">
            <div className="w-full flex h-10 gap-3 items-center">
              <h2 className="text-xl font-semibold text-neutral-800 w-full">
                Phân loại chi tiêu
              </h2>
              <Separator orientation="vertical" className="h-7" />
              <p className="text-slate-500 text-base font-medium">{year}</p>
            </div>
            <div className="flex w-full">Pie Chart goes here...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataDashboard;
