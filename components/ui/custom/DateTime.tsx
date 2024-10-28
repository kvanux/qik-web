"use client";

import { useDateTime } from "@/lib/hooks/useDateTime";

interface DateTimeProps {
  className?: string;
}

export const DateTime = ({ className }: DateTimeProps) => {
  const { date, time } = useDateTime();

  return (
    <p className={className}>
      Today is <span className="text-cyan-600">{date}</span>, at{" "}
      <span className="text-teal-600">{time}</span>
    </p>
  );
};
