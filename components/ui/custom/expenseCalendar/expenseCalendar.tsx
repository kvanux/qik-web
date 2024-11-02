"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { Expense, Income, Billing, MonthlyBalance } from "@prisma/client";
import { MonthPicker } from "../../monthPicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { isSameDay } from "date-fns";
import BalanceCard from "../balanceCard/balanceCard";
import { CardType } from "../balanceCard/balanceCard";
import ColoredStats from "../coloredStats/coloredStats";
import { StatsColor } from "../coloredStats/coloredStats";
import { formatNumber } from "@/lib/formatNumber";
import {
  CircleChevronUp,
  CircleChevronDown,
  ArchiveRestore,
  Banknote,
  X,
  Trash2,
} from "lucide-react";
import MonthExpenseChart from "../monthExpenseChart/monthExpenseChart";
import { Drawer } from "vaul";
import IncomeInputForm from "../singleInputForm/IncomeInputForm";
import BillingInputForm from "../singleInputForm/BillingInputForm";

interface DataProps {
  expenses: Expense[];
  income: Income[];
  billing: Billing[];
}

const ExpenseCalendar = ({ expenses, income, billing }: DataProps) => {
  // Get current day
  const today = new Date();
  const defaultMonth = today.getMonth();
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [maxCells, setMaxCells] = useState<number>(8);

  // Get days
  const daysInMonth = useMemo(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const date = new Date(year, month, 1);
    const days: Date[] = [];

    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [selectedMonth]);

  const adjustSelectedMonth = useMemo(() => {
    const adjustedMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() + 1
    );

    if (selectedMonth !== today) return adjustedMonth;
    else return selectedMonth;
  }, [selectedMonth, today]);

  // Compute expense
  const expensesByDate = useMemo(() => {
    const grouped: { [key: string]: Expense[] } = {};

    daysInMonth.forEach((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      grouped[dateStr] = expenses.filter(
        (expense) => format(new Date(expense.date), "yyyy-MM-dd") === dateStr
      );

      if (grouped[dateStr].length > maxCells) {
        setMaxCells(grouped[dateStr].length);
      }
    });

    return grouped;
  }, [daysInMonth, expenses, maxCells]);

  // Compute income
  const incomeList = useMemo(() => {
    const filterIncome = income.filter(
      (income) => income.month.getMonth() === selectedMonth.getMonth()
    );
    return filterIncome;
  }, [selectedMonth, income]);

  const currentIncome = useMemo(() => {
    const incomeSum = incomeList.reduce(
      (sum, income) => sum + income.amount,
      0
    );
    return incomeSum;
  }, [income, incomeList]);

  //  Compute billing
  const billingList = useMemo(() => {
    const filterBilling = billing.filter(
      (billing) => billing.month.getMonth() === selectedMonth.getMonth()
    );
    return filterBilling;
  }, [selectedMonth, billing]);

  const currentBilling = useMemo(() => {
    const billingList = billing.filter(
      (billing) => billing.month.getMonth() === selectedMonth.getMonth()
    );
    const billingSum = billingList.reduce(
      (sum, billing) => sum + billing.amount,
      0
    );
    return billingSum;
  }, [billingList, billing]);

  // Calculate daily sums
  const dailySums = useMemo(() => {
    const sums: { [key: string]: number } = {};
    Object.entries(expensesByDate).forEach(([date, dayExpenses]) => {
      sums[date] = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    });
    return sums;
  }, [expensesByDate]);

  // Calculate month aggregation
  const monthlyData = useMemo(() => {
    const chartData = daysInMonth.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const daySum = dailySums[dateStr] || 0;

      return {
        date: format(day, "dd/MM"),
        amount: daySum,
      };
    });

    const total = chartData.reduce((sum, item) => sum + item.amount, 0);

    return {
      chartData,
      monthTotal: total,
      averageDaily: Math.trunc(total / daysInMonth.length),
    };
  }, [daysInMonth, dailySums]);

  return (
    <div id="section-Data" className="flex flex-col gap-4 w-full">
      <div id="sectionTitle-Data" className="w-full flex items-center">
        <h2 className="text-xl font-semibold text-neutral-800 w-full">
          Dòng tiền
        </h2>
        <div id="interactGroup-Data" className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal text-base text-slate-900"
                )}
              >
                <CalendarIcon className="h-4 w-4 text-slate-700" />
                {selectedMonth.getMonth() == today.getMonth()
                  ? `Tháng này`
                  : `${selectedMonth.toLocaleString("default", {
                      month: "2-digit",
                    })}/${selectedMonth.getFullYear()}`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <MonthPicker
                selectedMonth={selectedMonth}
                onMonthSelect={(date) => setSelectedMonth(date)}
                onYearForward={() =>
                  setSelectedMonth(
                    new Date(
                      selectedMonth.setFullYear(selectedMonth.getFullYear() + 1)
                    )
                  )
                }
                onYearBackward={() =>
                  setSelectedMonth(
                    new Date(
                      selectedMonth.setFullYear(selectedMonth.getFullYear() - 1)
                    )
                  )
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div id="sectionContent-Stats" className="grid grid-cols-9 gap-6 w-full">
        <div
          id="leftContent-Stats"
          className="col-span-5 h-fit flex flex-col gap-4 "
        >
          <div
            id="cardTop"
            className="w-full rounded-xl flex bg-gradient-to-r from-slate-200 to-slate-100 p-4 gap-3 items-start"
          >
            <Drawer.Root direction="right">
              <Drawer.Trigger className="hover:bg-slate-300 hover:shadow-sm cursor-pointer rounded-xl transition-all duration-200 ease-in-out hover:p-1">
                <ColoredStats
                  label="Thu nhập tháng"
                  value={currentIncome}
                  type={StatsColor.green}
                  Icon={CircleChevronUp}
                />
              </Drawer.Trigger>
              <Drawer.Portal>
                <Drawer.Content
                  className="right-6 top-6 bottom-6 fixed z-10 outline-none w-[600px] flex"
                  style={
                    {
                      "--initial-transform": "calc(100% + 8px)",
                    } as React.CSSProperties
                  }
                >
                  <div className="bg-white/80 backdrop-blur-[6px] shadow-md h-full w-full grow flex flex-col rounded-[16px]">
                    <div className="w-full flex px-6 py-5 justify-between items-center">
                      <Drawer.Title className="font-semibold text-xl text-slate-800">
                        Điều chỉnh thu nhập
                        <span className="text-slate-500 ml-3 font-normal text-lg">
                          {selectedMonth.toLocaleString("default", {
                            month: "2-digit",
                          })}
                          {"/"}
                          {selectedMonth.getFullYear()}
                        </span>
                      </Drawer.Title>
                      <Drawer.Close>
                        <Button variant="ghost" size="icon" className="bg-none">
                          <X className="text-slate-900 w-6 h-6"></X>
                        </Button>
                      </Drawer.Close>
                    </div>
                    <div className="w-full h-full flex flex-col gap-5 px-6 py-5">
                      <ul className="w-full flex flex-col gap-2">
                        {incomeList.map((income) => (
                          <li
                            key={income.id}
                            className="flex gap-2 items-center pl-4"
                          >
                            <span className="text-base font-medium text-slate-600 w-full">
                              {income.title}
                              {income.title == null && (
                                <span className="text-slate-400 font-normal">
                                  Không ghi rõ
                                </span>
                              )}
                            </span>
                            <span className="text-base font-medium text-slate-900 w-full">
                              {formatNumber(income.amount)}
                              <span className="text-slate-400">,000</span>
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className=" shrink-0"
                            >
                              <Trash2 className="w-5 h-5 text-red-800" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                      <IncomeInputForm currentMonth={adjustSelectedMonth} />
                    </div>
                  </div>
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.Root>
            <Drawer.Root direction="right">
              <Drawer.Trigger className="hover:bg-slate-300 hover:shadow-sm cursor-pointer rounded-xl transition-all duration-200 ease-in-out hover:p-1">
                <ColoredStats
                  label="Hóa đơn tháng"
                  value={currentBilling}
                  type={StatsColor.red}
                  Icon={CircleChevronDown}
                />
              </Drawer.Trigger>
              <Drawer.Portal>
                <Drawer.Content
                  className="right-6 top-6 bottom-6 fixed z-10 outline-none w-[600px] flex"
                  style={
                    {
                      "--initial-transform": "calc(100% + 8px)",
                    } as React.CSSProperties
                  }
                >
                  <div className="bg-white/80 backdrop-blur-[6px] shadow-md h-full w-full grow flex flex-col rounded-[16px]">
                    <div className="w-full flex px-6 py-5 justify-between items-center">
                      <Drawer.Title className="font-semibold text-xl text-slate-800">
                        Điều chỉnh hóa đơn tháng
                        <span className="text-slate-500 ml-3 font-normal text-lg">
                          {selectedMonth.toLocaleString("default", {
                            month: "2-digit",
                          })}
                          {"/"}
                          {selectedMonth.getFullYear()}
                        </span>
                      </Drawer.Title>
                      <Drawer.Close>
                        <Button variant="ghost" size="icon" className="bg-none">
                          <X className="text-slate-900 w-6 h-6"></X>
                        </Button>
                      </Drawer.Close>
                    </div>
                    <div className="w-full h-full flex flex-col gap-5 px-6 py-5">
                      <ul className="w-full flex flex-col gap-2">
                        {billingList.map((billing) => (
                          <li
                            key={billing.id}
                            className="flex gap-2 items-center pl-4"
                          >
                            <span className="text-base font-medium text-slate-600 w-full">
                              {billing.title}
                              {billing.title == null && (
                                <span className="text-slate-400 font-normal">
                                  Không ghi rõ
                                </span>
                              )}
                            </span>
                            <span className="text-base font-medium text-slate-900 w-full">
                              {formatNumber(billing.amount)}
                              <span className="text-slate-400">,000</span>
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className=" shrink-0"
                            >
                              <Trash2 className="w-5 h-5 text-red-800" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                      <BillingInputForm currentMonth={adjustSelectedMonth} />
                    </div>
                  </div>
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.Root>

            <ColoredStats
              label="Dư tháng trước"
              value={0}
              type={StatsColor.orange}
              Icon={ArchiveRestore}
            />
            <ColoredStats
              label="Số dư đầu tháng"
              value={currentIncome - currentBilling}
              type={StatsColor.purple}
              Icon={Banknote}
            />
          </div>
          <div id="rowBottom" className="w-full flex gap-4 shrink-0">
            <BalanceCard
              mainStat={0}
              subStat1={0}
              subStat2={0}
              type={CardType.Tertiary}
              cardTitle="Trích tiết kiệm"
              subLabel1="% Tổng thu nhập"
              subLabel2="Lần trích"
            />
            <BalanceCard
              mainStat={currentIncome - currentBilling - monthlyData.monthTotal}
              subStat1={monthlyData.monthTotal}
              subStat2={monthlyData.averageDaily}
              type={CardType.Primary}
              cardTitle="Số dư hiện tại"
              subLabel1="Đã chi"
              subLabel2="Bình quân ngày"
            />
          </div>
        </div>
        <div id="rightContent-Stats" className="col-span-4 h-full">
          <MonthExpenseChart data={monthlyData.chartData} />
        </div>
      </div>
      <div id="sectionContent-Data">
        <div className="w-full h-[25rem]">
          <Table className="w-full border-collapse table-fixed">
            <TableHeader>
              <TableRow>
                {daysInMonth.map((day) => (
                  <TableHead
                    key={format(day, "yyyy-MM-dd")}
                    className={`border-b border-b-slate-30 p-2 text-left text-sm font-normal min-w-[80px] w-24 h-8 sticky top-0 z-10 justify-start ${
                      isSameDay(day, today)
                        ? "bg-gradient-to-b from-qik-ter-500 to-qik-pri-500 text-white font-semibold"
                        : "bg-white"
                    }`}
                  >
                    {format(day, "dd/MM")}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: maxCells }, (_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {daysInMonth.map((day) => {
                    const dateStr = format(day, "yyyy-MM-dd");
                    const dayExpenses = expensesByDate[dateStr] || [];
                    const expense = dayExpenses[rowIndex];

                    return (
                      <TableCell
                        key={`${dateStr}-${rowIndex}`}
                        className={`p-2 text-left text-sm h-10 w-24 justify-start ${
                          expense
                            ? "text-slate-800 font-medium"
                            : "text-slate-300 font-normal"
                        } ${
                          isSameDay(day, today)
                            ? "border-x border-x-qik-pri-300"
                            : ""
                        }`}
                      >
                        {expense ? (
                          <span className="transition-all duration-500 delay-500">
                            {"-"}
                            {formatNumber(expense.amount)}
                            <span className="text-slate-400">,000</span>
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
              <TableRow>
                {daysInMonth.map((day) => {
                  const dateStr = format(day, "yyyy-MM-dd");
                  const daySum = dailySums[dateStr] || 0;
                  return (
                    <td
                      key={`${dateStr}-sum`}
                      className={`p-2 text-left text-sm h-10 w-24 sticky bottom-0 font-bold ${
                        daySum === 0 ? "text-slate-300" : "text-slate-800"
                      } ${
                        isSameDay(day, today)
                          ? "border-x border-qik-pri-300"
                          : ""
                      }`}
                    >
                      {daySum === 0 ? (
                        <span>0</span>
                      ) : (
                        <span>
                          {"-"}
                          {formatNumber(daySum)}
                          <span className="text-slate-400">,000</span>
                        </span>
                      )}
                    </td>
                  );
                })}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCalendar;
