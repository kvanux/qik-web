"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Expense, Income, Billing } from "@prisma/client";
import { MonthPicker } from "@/components/ui/monthPicker";
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
import { toast } from "sonner";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { isSameDay } from "date-fns";
import BalanceCard from "@/components/ui/custom/balanceCard/balanceCard";
import { CardType } from "@/components/ui/custom/balanceCard/balanceCard";
import ColoredStats from "@/components/ui/custom/coloredStats/coloredStats";
import { StatsColor } from "@/components/ui/custom/coloredStats/coloredStats";
import { formatNumber } from "@/lib/formatNumber";
import {
  CircleChevronUp,
  CircleChevronDown,
  ArchiveRestore,
  Banknote,
  X,
  Trash2,
} from "lucide-react";
import MonthExpenseChart from "@/components/ui/custom/monthExpenseChart/monthExpenseChart";
import { Drawer } from "vaul";
import IncomeInputForm from "@/components/ui/custom/singleInputForm/IncomeInputForm";
import BillingInputForm from "@/components/ui/custom/singleInputForm/BillingInputForm";
import { revalidateExpenses } from "@/app/actions";

interface DataProps {
  expenses: Expense[];
  income: Income[];
  billing: Billing[];
  currentUserId: string;
}

const ExpenseCalendar = ({
  expenses,
  income,
  billing,
  currentUserId,
}: DataProps) => {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [maxCells, setMaxCells] = useState<number>(8);

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
      selectedMonth.getMonth(),
      15
    );

    if (selectedMonth !== today) return adjustedMonth;
    else return selectedMonth;
  }, [selectedMonth, today]);

  const getLeftoverMonth = useMemo(() => {
    if (selectedMonth.getMonth() === 0) {
      return {
        year: selectedMonth.getFullYear() - 1,
        month: 12,
      };
    } else {
      return {
        year: selectedMonth.getFullYear(),
        month: selectedMonth.getMonth(),
      };
    }
  }, [selectedMonth]);

  const [leftover, setLeftover] = useState(0);

  useEffect(() => {
    async function fetchBalance() {
      const response = await fetch(
        `/api/balance?year=${getLeftoverMonth.year}&month=${getLeftoverMonth.month}&userID=${currentUserId}`,
        { credentials: "include" }
      );
      if (!response.ok) throw new Error("Failed to fetch balance");

      const data = await response.json();
      setLeftover(data.balance);
    }

    fetchBalance();
  }, [getLeftoverMonth]);

  const deleteExpense = async function (expenseId: number) {
    try {
      const response = await fetch(`/api/expense?id=${expenseId}`, {
        method: "DELETE",
      });
      await revalidateExpenses();
      toast.info("Xóa thành công.");
      return response;
    } catch (error) {
      toast.error("Có lỗi xảy ra.", { description: `${error}` });
    }
  };
  const deleteIncome = async function (incomeId: number) {
    try {
      const response = await fetch(`/api/income?id=${incomeId}`, {
        method: "DELETE",
      });
      await revalidateExpenses();
      toast.info("Xóa thành công.");
      return response;
    } catch (error) {
      toast.error("Có lỗi xảy ra.", { description: `${error}` });
    }
  };
  const deleteBilling = async function (billingId: number) {
    try {
      const response = await fetch(`/api/billing?id=${billingId}`, {
        method: "DELETE",
      });
      await revalidateExpenses();
      toast.info("Xóa thành công.");
      return response;
    } catch (error) {
      toast.error("Có lỗi xảy ra.", { description: `${error}` });
    }
  };

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

  const incomeList = useMemo(() => {
    const filterIncome = income.filter(
      (income) =>
        income.month.getMonth() === selectedMonth.getMonth() &&
        income.month.getFullYear() === selectedMonth.getFullYear()
    );
    return filterIncome;
  }, [selectedMonth, income]);

  const currentIncome = useMemo(() => {
    const incomeSum = incomeList.reduce(
      (sum, income) => sum + income.amount,
      0
    );
    return incomeSum;
  }, [incomeList]);

  const billingList = useMemo(() => {
    const filterBilling = billing.filter(
      (billing) =>
        billing.month.getMonth() === selectedMonth.getMonth() &&
        billing.month.getFullYear() === selectedMonth.getFullYear()
    );
    return filterBilling;
  }, [selectedMonth, billing]);

  const currentBilling = useMemo(() => {
    const billingSum = billingList.reduce(
      (sum, billing) => sum + billing.amount,
      0
    );
    return billingSum;
  }, [billingList]);

  const dailySums = useMemo(() => {
    const sums: { [key: string]: number } = {};
    Object.entries(expensesByDate).forEach(([date, dayExpenses]) => {
      sums[date] = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    });
    return sums;
  }, [expensesByDate]);

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
    const dayAm =
      today.getMonth() === selectedMonth.getMonth()
        ? today.getDate()
        : daysInMonth.length;

    return {
      chartData,
      monthTotal: total,
      averageDaily: Math.trunc(total / dayAm),
    };
  }, [daysInMonth, dailySums, today]);

  const todayRef = useRef<HTMLTableCellElement>(null);

  useEffect(() => {
    daysInMonth.forEach((day) => {
      if (isSameDay(day, today) && todayRef.current) {
        todayRef.current.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "end",
        });
      }
    });
  }, [daysInMonth, today]);

  const maxMonth = new Date(2086, 0);
  const minMonth = new Date(2000, 0);

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
                maxDate={maxMonth}
                minDate={minMonth}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div
        id="sectionContent-Stats"
        className="grid grid-cols-9 max-[1700px]:grid-cols-10 max-[1280px]:grid-cols-none gap-6 w-full"
      >
        <div
          id="leftContent-Stats"
          className="col-span-5 max-[1700px]:col-span-6 w-full flex flex-col gap-4 "
        >
          <div
            id="cardTop"
            className="w-full rounded-xl flex bg-gradient-to-r from-slate-200 to-slate-100 p-4 justify-between items-start"
          >
            <Drawer.Root direction="right">
              <Drawer.Trigger className="hover:bg-slate-300 hover:shadow-[-4px_0px_0px_4px_#cbd5e1] shrink-0 cursor-pointer rounded-sm transition-all duration-300 ease-in-out">
                <ColoredStats
                  label="Thu nhập"
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
                    <div className="w-full flex px-6 py-6 justify-between items-center">
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
                        <X className="text-slate-900 w-6 h-6"></X>
                      </Drawer.Close>
                    </div>
                    <div className="w-full h-full flex flex-col gap-5 px-6">
                      <ul className="w-full flex flex-col gap-2">
                        {incomeList.map((income) => (
                          <li
                            key={income.id}
                            className="flex gap-2 items-center pl-4"
                          >
                            <span className="text-base font-medium text-slate-900 flex-shrink-0 w-32 animate-numEntry">
                              {formatNumber(income.amount)}
                              <span className="text-slate-400">,000</span>
                            </span>
                            <span className="text-base font-medium text-slate-600 w-full">
                              {income.title}
                              {income.title == null && (
                                <span className="text-slate-400 font-normal">
                                  Không ghi rõ
                                </span>
                              )}
                            </span>
                            <Button
                              onClick={() => deleteIncome(income.id)}
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
              <Drawer.Trigger className="hover:bg-slate-300 hover:shadow-[-4px_0px_0px_4px_#cbd5e1] shrink-0 cursor-pointer rounded-sm transition-all duration-300 ease-in-out">
                <ColoredStats
                  label="Hóa đơn"
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
                    <div className="w-full flex px-6 py-6 justify-between items-center">
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
                        <X className="text-slate-900 w-6 h-6"></X>
                      </Drawer.Close>
                    </div>
                    <div className="w-full h-full flex flex-col gap-5 px-6">
                      <ul className="w-full flex flex-col gap-2">
                        {billingList.map((billing) => (
                          <li
                            key={billing.id}
                            className="flex gap-2 items-center pl-4"
                          >
                            <span className="text-base font-medium text-slate-900 flex-shrink-0 w-32 animate-numEntry">
                              {formatNumber(billing.amount)}
                              <span className="text-slate-400">,000</span>
                            </span>
                            <span className="text-base font-medium text-slate-600 w-full">
                              {billing.title}
                              {billing.title == null && (
                                <span className="text-slate-400 font-normal">
                                  Không ghi rõ
                                </span>
                              )}
                            </span>
                            <Button
                              onClick={() => deleteBilling(billing.id)}
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
              value={leftover}
              type={StatsColor.orange}
              Icon={ArchiveRestore}
            />
            <ColoredStats
              label="Số dư đầu tháng"
              value={currentIncome - currentBilling + leftover}
              type={StatsColor.purple}
              Icon={Banknote}
            />
          </div>
          <div id="rowBottom" className="w-full flex gap-4 shrink-0">
            <BalanceCard
              type={CardType.Tertiary}
              cardTitle="Tổng đã chi"
              mainStat={monthlyData.monthTotal}
              subLabel="Bình quân chi"
              subStat={monthlyData.averageDaily}
            />
            <BalanceCard
              type={CardType.Primary}
              cardTitle="Số dư hiện tại"
              mainStat={
                currentIncome +
                leftover -
                currentBilling -
                monthlyData.monthTotal
              }
              subLabel="Được phép chi tối đa"
              subStat={
                (currentIncome +
                  leftover -
                  currentBilling -
                  monthlyData.monthTotal) /
                (today.getMonth() === selectedMonth.getMonth()
                  ? daysInMonth.length - today.getDate()
                  : daysInMonth.length)
              }
            />
          </div>
        </div>
        <div
          id="rightContent-Stats"
          className="col-span-4 h-full max-[1280px]:hidden"
        >
          <MonthExpenseChart data={monthlyData.chartData} />
        </div>
      </div>
      <div id="sectionContent-Data">
        <div className="w-full">
          <Table className="w-full border-collapse table-fixed">
            <TableHeader>
              <TableRow>
                {daysInMonth.map((day) => (
                  <TableHead
                    ref={isSameDay(day, today) ? todayRef : null}
                    key={format(day, "yyyy-MM-dd")}
                    className={`border-b border-b-slate-30 p-2 text-left text-sm font-normal min-w-[80px] w-32 h-8 sticbetweenp-0 z-10 justify-start ${
                      isSameDay(day, today) &&
                      "bg-gradient-to-b from-qik-ter-500 to-qik-pri-500 text-white font-semibold border-b-qik-pri-400"
                    }
                    ${
                      (day.getDay() === 6 || day.getDay() === 0) &&
                      "bg-slate-100"
                    }`}
                  >
                    {format(day, "dd/MM")}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: maxCells }, (_, rowIndex) => (
                <TableRow key={rowIndex} className="flex flex-row w-fit">
                  {daysInMonth.map((day) => {
                    const dateStr = format(day, "yyyy-MM-dd");
                    const dayExpenses = expensesByDate[dateStr] || [];
                    const expense = dayExpenses[rowIndex];

                    return (
                      <TableCell
                        key={
                          expense
                            ? `${dateStr}-${expense.id}`
                            : `${dateStr}-${rowIndex}`
                        }
                        className={`group py-2 pl-2 pr-0 text-left text-sm h-10 w-32 justify-between items-center transition-all duration-500 flex ${
                          expense
                            ? "text-slate-800 font-medium"
                            : "text-slate-300 font-normal"
                        } ${isSameDay(day, today) && "bg-qik-pri-100"}
                        ${
                          (day.getDay() === 6 || day.getDay() === 0) &&
                          !isSameDay(day, today)
                            ? "bg-slate-50"
                            : ""
                        }`}
                      >
                        {expense ? (
                          <span className="animate-numEntry">
                            {"-"}
                            {formatNumber(expense.amount)}
                            <span className="text-slate-400">,000</span>
                          </span>
                        ) : (
                          "-"
                        )}
                        {expense && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteExpense(expense.id)}
                            className="hidden group-hover:flex transition-all duration-300 shrink-0 hover:bg-rose-100"
                          >
                            <Trash2 className="w-5 h-5 text-red-800" />
                          </Button>
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
                    <TableCell
                      key={`${dateStr}-sum`}
                      className={`p-2 pb-5 text-left text-sm h-10 w-32 bottom-0between-bold animate-numEntry ${
                        daySum === 0
                          ? "text-slate-300"
                          : "text-slate-800 font-semibold"
                      } ${isSameDay(day, today) && "bg-qik-pri-100"}
                      ${
                        (day.getDay() === 6 || day.getDay() === 0) &&
                        !isSameDay(day, today)
                          ? "bg-slate-50"
                          : ""
                      } 
                      `}
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
                    </TableCell>
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
