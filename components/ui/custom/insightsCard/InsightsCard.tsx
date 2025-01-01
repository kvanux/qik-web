import React from "react";
import {
  Info,
  InfoIcon,
  CircleCheck,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";

interface InsightsProps {
  type: string;
  title: string;
  content: string;
}

const InsightsCard = ({ type, title, content }: InsightsProps) => {
  const colorMap = new Map([
    ["info", "text-slate-800"],
    ["recommend", "text-qik-pri-900"],
    ["success", "text-qik-ter-900"],
    ["warning", "text-orange-800"],
    ["severe", "text-rose-800"],
  ]);
  const bgMap = new Map([
    ["info", "bg-slate-100"],
    ["recommend", "bg-qik-pri-100"],
    ["success", "bg-emerald-50"],
    ["warning", "bg-orange-50"],
    ["severe", "bg-rose-50"],
  ]);
  const iconMap = new Map([
    ["info", <Info className={`w-6 h-6 ${colorMap.get(type)}`} />],
    ["recommend", <Lightbulb className={`w-6 h-6 ${colorMap.get(type)}`} />],
    ["success", <CircleCheck className={`w-6 h-6 ${colorMap.get(type)}`} />],
    ["warning", <AlertTriangle className={`w-6 h-6 ${colorMap.get(type)}`} />],
    ["severe", <AlertTriangle className={`w-6 h-6 ${colorMap.get(type)}`} />],
  ]);

  return (
    <div className={`flex p-4 gap-3 ${bgMap.get(type)} rounded-2xl`}>
      <div className="flex pt-1">{iconMap.get(type)}</div>
      <div className="flex flex-col gap-1">
        <p className={`text-base font-semibold ${colorMap.get(type)}`}>
          {title}
        </p>
        <p className={`text-sm font-normal ${colorMap.get(type)}`}>{content}</p>
      </div>
    </div>
  );
};

export default InsightsCard;
