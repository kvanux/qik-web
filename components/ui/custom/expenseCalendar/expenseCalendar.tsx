"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { Expense } from "@prisma/client";
import prisma from "@/prisma/client";
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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { isSameDay } from "date-fns";

const ExpenseCalendar = ({ expenses }: { expenses: Expense[] }) => {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [maxCells, setMaxCells] = useState<number>(10);

  // Get days in selected month
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

  // Group expenses by date
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

  // Calculate daily sums
  const dailySums = useMemo(() => {
    const sums: { [key: string]: number } = {};
    Object.entries(expensesByDate).forEach(([date, dayExpenses]) => {
      sums[date] = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    });
    return sums;
  }, [expensesByDate]);

  // Get current day
  const today = new Date();

  // Event Handler

  return (
    <div id="section-Data" className="flex flex-col gap-4 w-full">
      <div id="sectionTitle-Data" className="w-full flex items-center">
        <h2 className="text-xl font-semibold text-neutral-800 w-full">
          QIK Cashflow
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
                {selectedMonth.toLocaleString("default", { month: "long" })}
                {", "}
                {selectedMonth.getFullYear()}
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
      <div id="sectionContent-Data">
        <div className="overflow-x-scroll w-full h-[30rem]">
          <Table className="w-full border-collapse table-fixed">
            <TableHeader>
              <TableRow>
                {daysInMonth.map((day) => (
                  <TableHead
                    key={format(day, "yyyy-MM-dd")}
                    className={`border-b border-b-slate-30 p-2 text-left text-sm font-normal min-w-[80px] w-24 h-8 sticky top-0 z-10 justify-start ${
                      isSameDay(day, today)
                        ? "bg-gradient-to-b from-qik-ter-400 to-qik-pri-400"
                        : "bg-white"
                    }`}
                  >
                    {format(day, "d")}
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
                          <span>
                            {"-"}
                            {expense.amount}
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
                          {daySum}
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
