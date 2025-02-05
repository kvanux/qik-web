"use client";

import React from "react";
import { useState, useMemo } from "react";
import { cn, yearList } from "@/lib/utils";
import {
  Expense,
  Income,
  Billing,
  Category,
  MonthlyBalance,
} from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import ExpenseHistogram from "@/components/ui/custom/expenseHistogram/ExpenseHistogram";
import { YearChart } from "@/components/ui/custom/yearChart/YearChart";
import CategoryChart from "@/components/ui/custom/categoryChart/CategoryChart";
import InsightsCard from "@/components/ui/custom/insightsCard/InsightsCard";

interface DataProps {
  expenses: Expense[];
  incomes: Income[];
  billings: Billing[];
  balances: MonthlyBalance[];
  categories: Category[];
}

const DataDashboard = ({
  expenses,
  incomes,
  billings,
  balances,
  categories,
}: DataProps) => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const expenseList = useMemo(() => {
    const filterExpense = expenses.filter(
      (expense) => expense.date.getFullYear() === year
    );
    return filterExpense;
  }, [expenses, year]);
  const incomeList = useMemo(() => {
    const filterIncome = incomes.filter(
      (income) => income.month.getFullYear() === year
    );
    return filterIncome;
  }, [incomes, year]);
  const billingList = useMemo(() => {
    const filterBilling = billings.filter(
      (billing) => billing.month.getFullYear() === year
    );
    return filterBilling;
  }, [billings, year]);
  const balanceList = useMemo(() => {
    const filterBalance = balances.filter((balance) => balance.year === year);
    filterBalance.push(
      balances.find(
        (balance) => balance.year === year - 1 && balance.month === 12
      )!
    );
    return filterBalance;
  }, [balances, year]);

  const comboChartData = useMemo(() => {
    const groups = Array.from({ length: 12 }, (_, i) => {
      const inSum = incomeList
        .filter((income) => income.month.getMonth() === i)
        .reduce((sum, income) => sum + income.amount, 0);
      const billingSum = billingList
        .filter((billing) => billing.month.getMonth() === i)
        .reduce((sum, billing) => sum + billing.amount, 0);
      const expenseSum = expenseList
        .filter((expense) => expense.date.getMonth() === i)
        .reduce((sum, expense) => sum + expense.amount, 0);
      const outSum = billingSum + expenseSum;
      const leftover =
        i === 0
          ? balanceList.find(
              (balance) => balance.year === year - 1 && balance.month === 12
            )!.balance
          : balanceList.find((balance) => balance.month === i) === undefined
          ? 0
          : balanceList.find((balance) => balance.month === i)!.balance;

      const total = inSum > 0 || outSum > 0 ? inSum - outSum + leftover : 0;

      return {
        month: `Tháng ${i + 1}`,
        green: inSum,
        red: outSum,
        line: total,
      };
    });

    return groups;
  }, [expenseList, incomeList, billingList, balanceList]);

  const histogramData = useMemo(() => {
    if (!expenseList || expenseList.length === 0) {
      return [
        {
          x: "0",
          y: 0,
        },
      ];
    }
    const maxAmount = expenseList.reduce(
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
    expenseList.forEach((expense) => {
      const index = Math.floor(expense.amount / 100);
      if (index < columns.length) {
        columns[index].amount += 1;
      }
    });

    return columns.map((column) => ({
      x: column.label,
      y: column.amount,
    }));
  }, [expenseList]);

  const pieChartData = useMemo(() => {
    const groups: {
      id: number | undefined;
      label: string;
      amount: number;
      fill: string;
    }[] = [
      { id: undefined, label: "Không ghi rõ", amount: 0, fill: "#94A3B8" },
    ];
    const fillArray: string[] = [
      "#69D9FF",
      "#016FB9",
      "#18F2B2",
      "#6366F1",
      "#A3E635",
      "#F59E0B",
      "#14B8A6",
      "#0EA5E9",
      "#8B5CF6",
      "#D946EF",
      "#F43F5E",
      "#3B82F6",
      "#EC4899",
      "#22D3EE",
      "#F97316",
    ];
    categories.forEach((category) => {
      const loopCount = Math.floor(
        categories.indexOf(category) / fillArray.length
      );
      groups.push({
        id: category.id,
        label: category.title,
        amount: 0,
        fill: fillArray[
          categories.indexOf(category) - fillArray.length * loopCount
        ],
      });
    });

    expenseList.forEach((expense) => {
      expense.categoryID === null
        ? (groups[0].amount += expense.amount)
        : (groups.find((item) => item.id === expense.categoryID)!.amount +=
            expense.amount);
    });

    return groups;
  }, [categories, expenseList]);

  const insights = useMemo(() => {
    const groups: {
      type: string;
      title: string;
      content: string;
    }[] = [];

    for (let i = 0; i <= 11; i++) {
      const expSum = expenseList
        .filter((expense) => expense.date.getMonth() === i)
        .reduce((sum, expense) => sum + expense.amount, 0);
      const billSum = billingList
        .filter((billing) => billing.month.getMonth() === i)
        .reduce((sum, billing) => sum + billing.amount, 0);
      const inSum = incomeList
        .filter((income) => income.month.getMonth() === i)
        .reduce((sum, income) => sum + income.amount, 0);

      // render severe
      expSum + billSum > inSum &&
        groups.push({
          type: "severe",
          title: "Chi phí vượt mức",
          content: `Tổng chi phí và hoá đơn trong tháng ${
            i + 1
          } cao hơn tổng thu nhập tháng.`,
        });
      billSum / inSum > 0.7 &&
        groups.push({
          type: "severe",
          title: "Hóa đơn quá cao",
          content: `Tổng hoá đơn tháng ${i + 1} chiếm đến ${Math.floor(
            (billSum / inSum) * 100
          )}% tổng thu nhập.`,
        });

      // render warning
      billSum / inSum > 0.4 &&
        billSum / inSum <= 0.7 &&
        groups.push({
          type: "warning",
          title: "Hóa đơn quá cao",
          content: `Tổng hoá đơn tháng ${i + 1} chiếm đến ${Math.floor(
            (billSum / inSum) * 100
          )}% tổng thu nhập.`,
        });

      // render success
      (billSum + expSum) / inSum < 0.8 &&
        groups.push({
          type: "success",
          title: `Tháng ${i + 1} xuất sắc`,
          content: `Bạn tiết kiệm được hơn 20% tổng thu nhập tháng.`,
        });

      // render recommend
    }

    // render info
    groups.length === 0 &&
      groups.push({
        type: "info",
        title: "Chưa có phân tích mới",
        content: "",
      });

    return groups;
  }, [expenseList, incomeList, billingList, balanceList]);

  return (
    <div className="grid grid-cols-12 gap-6 w-full h-full max-w-[1840px] self-center min-[360px]:max-[800px]:flex min-[360px]:max-[800px]:flex-col">
      <div className="flex flex-col h-full gap-6 col-span-9 bg-white rounded-xl p-5 shadow-qele-panel min-[360px]:max-[800px]:p-4">
        <div className="h-full w-full flex flex-col gap-3">
          <div className="w-full flex h-10 justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-800 w-full min-[360px]:max-[800px]:text-lg">
              Tài chính năm
            </h2>
            <Select
              value={year.toString()}
              onValueChange={(newValue) => {
                setYear(Number(newValue));
              }}
            >
              <SelectTrigger className="w-56 text-base focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0 focus:border-qik-pri-600 focus:bg-slate-50 hover:bg-slate-50 focus:border-2">
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
          <div>
            <YearChart data={comboChartData}></YearChart>
          </div>
        </div>
        <div className="h-full w-full grid grid-cols-9 gap-6 min-[360px]:max-[800px]:flex min-[360px]:max-[800px]:flex-col min-[360px]:max-[800px]:gap-2">
          <div className="h-full col-span-6 flex flex-col gap-5 min-[360px]:max-[800px]:w-full">
            <div className="w-full flex h-10 gap-3 items-center min-[360px]:max-[800px]:gap-0">
              <h2 className="text-lg font-medium text-slate-800 w-full min-[360px]:max-[800px]:text-base min-[360px]:max-[800px]:font-semibold">
                Phân lượng chi tiêu
              </h2>
            </div>
            <div className="flex w-full">
              <ExpenseHistogram data={histogramData} />
            </div>
          </div>
          <div className="h-full col-span-3 flex flex-col gap-5 min-[360px]:max-[800px]:w-full">
            <div className="w-full flex h-10 gap-3 items-center min-[360px]:max-[800px]:gap-0">
              <h2 className="text-lg font-medium text-slate-800 w-full min-[360px]:max-[800px]:text-base min-[360px]:max-[800px]:font-semibold">
                Phân loại chi tiêu
              </h2>
            </div>
            <div className="flex w-full">
              <CategoryChart data={pieChartData} />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-3 h-[800px] flex flex-col gap-4 bg-white rounded-xl p-5 shadow-qele-panel">
        <div className="w-full flex h-10 gap-3 items-center">
          <h2 className="text-xl font-semibold text-neutral-800 w-full min-[360px]:max-[800px]:text-lg">
            Phân tích tổng quan
          </h2>
          <Separator orientation="vertical" className="h-7" />
          <p className="text-slate-500 text-base">{year}</p>
        </div>
        <div className="flex flex-col gap-3 w-full h-full overflow-scroll">
          {insights.map((insight) => (
            <InsightsCard
              key={insights.indexOf(insight)}
              type={insight.type}
              title={insight.title}
              content={insight.content}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataDashboard;
