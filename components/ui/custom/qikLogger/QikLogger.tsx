"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendarAlt";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const QikLogger = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const isToday = (date?: Date) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div
      id="loggerContainer"
      className="flex flex-col gap-2 w-full focus:border-qik-pri-600"
    >
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <img
            src="/svg/dongIconM.svg"
            alt="Dong Icon"
            className="w-[14px] h-auto text-slate-700"
          />
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-base font-medium text-neutral-400">
          ,000
        </div>
        <Input
          ref={inputRef}
          type="text"
          placeholder="Enter expense amount"
          className="w-full pl-10 pr-12 text-base focus:outline-none focus-visible:ring-0 focus-visible:border-2 focus-visible:ring-offset-0 focus-visible:border-qik-pri-400 "
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left text-base text-slate-900 items-center font-normal border-slate-200",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="h-4 w-4 text-slate-700" />
            {date
              ? isToday(date)
                ? "Today"
                : format(date, "dd/MM/yyyy")
              : "Select a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </PopoverContent>
      </Popover>

      <Button className="text-white bg-qik-pri-900 hover:bg-qik-pri-700 font-medium text-base mt-2">
        Submit
      </Button>
    </div>
  );
};

export default QikLogger;
