"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-day-picker/dist/style.css";

interface CalendarProps {
  mode?: "single" | "multiple" | "range";
  selected?: Date | Date[] | { from: Date; to: Date };
  onSelect?: (date: Date | undefined) => void;
  className?: string;
}

function Calendar({
  mode = "single",
  selected,
  onSelect,
  className,
}: CalendarProps) {
  return (
    <DayPicker
      mode={mode}
      selected={selected}
      onSelect={onSelect}
      className={className}
      showOutsideDays
      classNames={{
        months: "flex flex-col",
        month: "space-y-4",
        caption: "flex justify-between pt-1 relative items-center",
        caption_label: "text-base font-medium",
        nav: "flex items-center fixed justify-between w-[88%]",
        nav_button: "h-7 w-7 bg-transparent p-0 hover:opacity-70",
        nav_button_previous: "",
        nav_button_next: "",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell: "text-muted-foreground w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "text-center text-sm relative p-0",
        day: "h-8 w-8 p-0 font-normal hover:bg-gray-100 rounded-full",
        day_selected: "bg-black text-white hover:bg-black hover:text-white",
        day_today: "text-black font-semibold",
        day_outside: "text-gray-400",
        day_disabled: "text-gray-400",
        day_hidden: "invisible",
      }}
      components={{
        IconLeft: ({ ...props }) => (
          <ChevronLeft className="h-4 w-4 text-slate-700" color="gray" />
        ),
        IconRight: ({ ...props }) => (
          <ChevronRight className="h-4 w-4 text-slate-700" color="gray" />
        ),
      }}
    />
  );
}

export { Calendar };
