"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "../../calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useForm, SubmitHandler } from "react-hook-form";
import { revalidateExpenses } from "@/app/actions";

interface ExpenseForm {
  amount: number;
  date: string;
}

const QikLogger = () => {
  const [date, setDate] = useState<Date>(new Date());

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ExpenseForm>({
    defaultValues: {
      date: new Date().toISOString(),
    },
  });

  const formatDateToUTC = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return new Date(Date.UTC(year, month, day)).toISOString();
  };

  useEffect(() => {
    setValue("date", formatDateToUTC(date));
  }, [date, setValue]);

  const onSubmit: SubmitHandler<ExpenseForm> = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/api/expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Validation errors:", errorData);
      } else {
        const newExpense = await response.json();
        console.log("Expense added:", newExpense);
        await revalidateExpenses();
      }
    } catch (error) {
      console.error("Failed to add expense:", error);
    }
  };

  const { ref: inputRefRegister, ...inputRegisterRest } = register("amount", {
    required: "Amount is required",
    valueAsNumber: true,
  });

  return (
    <form
      id="loggerContainer"
      className="flex flex-col gap-2 w-full focus:border-qik-pri-600"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <img
            src="/svg/dongIconM.svg"
            alt="Dong Icon"
            className="w-[14px] h-auto text-slate-700"
          />
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-base font-medium text-slate-400">
          ,000
        </div>
        <Input
          ref={(e) => {
            inputRefRegister(e);
            if (e) {
              e.focus();
            }
          }}
          placeholder="Enter expense amount"
          className="w-full pl-10 pr-12 text-base focus:outline-none focus-visible:ring-0 focus-visible:border-2 focus-visible:ring-offset-0 focus-visible:border-qik-pri-400"
          {...inputRegisterRest}
        />
      </div>
      {/* {errors.amount && (
        <span className="text-red-700 text-sm">{errors.amount.message}</span>
      )} */}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start text-left text-base text-slate-900 items-center font-normal border-slate-200",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="h-4 w-4 text-slate-700" />
            {isToday(date) ? "Today" : format(date, "dd/MM/yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (newDate) {
                setDate(newDate);
                setValue("date", formatDateToUTC(newDate));
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button
        type="submit"
        className="text-white bg-qik-pri-900 hover:bg-qik-pri-700 font-medium text-base mt-2"
      >
        Submit
      </Button>
    </form>
  );
};

export default QikLogger;
