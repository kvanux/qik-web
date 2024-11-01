import React from "react";
import { FC } from "react";
import { formatNumber } from "@/lib/formatNumber";
import { LucideIcon } from "lucide-react";
import Image from "next/image";

export enum StatsColor {
  green,
  red,
  orange,
  purple,
}

interface StatsProps {
  Icon: LucideIcon;
  label: string;
  value: number;
  type: StatsColor;
}

const ColoredStats: FC<StatsProps> = ({ Icon, label, value, type }) => {
  return (
    <div
      className={` flex flex-col gap-1 pr-6 ${
        type == StatsColor.purple && "pl-4 shrink-0 border-l border-l-slate-300"
      }`}
    >
      <div className="flex items-center gap-1">
        <Icon
          size={20}
          className={`pt-[2px] 
          ${type == StatsColor.green && "text-green-500"}
          ${type == StatsColor.red && "text-rose-700"}
          ${type == StatsColor.orange && "text-amber-600"}
          ${type == StatsColor.purple && " text-indigo-600"}
          `}
        ></Icon>
        <p
          className={`text-sm align-middle
          ${type == StatsColor.green && "text-green-800"}
          ${type == StatsColor.red && "text-rose-800"}
          ${type == StatsColor.orange && "text-amber-700"}
          ${type == StatsColor.purple && "text-indigo-800"}
          `}
        >
          {label}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Image
          src="/svg/dongIconM.svg"
          width={11.43}
          height={16}
          alt=""
          className="w-3 pt-[2px] ml-[3px] border-slate-700"
        />

        <span className="text-xl font-semibold text-slate-800">
          {type == StatsColor.red && <span>-</span>}
          {formatNumber(value)}
          {value != 0 && <span className="text-slate-400">,000</span>}
        </span>
      </div>
    </div>
  );
};

export default ColoredStats;
