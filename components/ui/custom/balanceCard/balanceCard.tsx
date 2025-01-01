import React from "react";
import Image from "next/image";
import { formatNumber } from "@/lib/formatNumber";

export enum CardType {
  Primary,
  Secondary,
  Tertiary,
}

interface Props {
  mainStat: number;
  subStat: number;
  type: CardType;
  cardTitle: string;
  subLabel: string;
}

const BalanceCard = ({
  mainStat,
  subStat,
  type,
  cardTitle,
  subLabel,
}: Props) => {
  return (
    <div
      className={`w-full min-w-40 rounded-2xl flex flex-col overflow-clip ${
        type == CardType.Primary && "bg-qik-pri-900"
      } ${type == CardType.Tertiary && "bg-qik-ter-800"}`}
    >
      <div
        id="cardTitle"
        className="flex px-4 py-2 h-10 bg-gradient-to-r from-white/30 to-transparent"
      >
        <span className="text-white w-64 min-w-28 font-semibold text-base">
          {cardTitle}
        </span>
        {type == CardType.Primary && (
          <Image
            src="/svg/inhandWalletIllustration.svg"
            width={96}
            height={96}
            alt=""
            className="relative w-28 h-28 -rotate-[16] -right-[16px] -bottom-[40px]"
          ></Image>
        )}
        {type == CardType.Tertiary && (
          <Image
            src="/svg/masterCardIllustration.svg"
            width={109}
            height={104}
            alt=""
            className="relative w-[109px] h-[104px] -rotate-[7] -right-[16px] -bottom-[40px]"
          ></Image>
        )}
      </div>
      <div
        id="cardContent"
        className={`p-4 flex flex-col justify-center items-start gap-1
        ${
          type == CardType.Primary &&
          "bg-gradient-to-t from-qik-pri-600 from-[-20%] to-qik-pri-400/20"
        } ${
          type == CardType.Tertiary &&
          "bg-gradient-to-t from-qik-ter-600 from-[-20%] to-qik-ter-400/20"
        }
        `}
      >
        <div id="mainStat" className="flex gap-2 items-end">
          <Image
            src="/svg/dongIconMW.svg"
            width={17}
            height={24}
            alt=""
            className="pb-1"
          />
          <span className="text-3xl font-semibold text-white">
            {formatNumber(mainStat)}
            {mainStat != 0 && <span className="text-white/60">,000</span>}
          </span>
        </div>
        <div id="subStat" className="flex flex-col">
          <span className="font-semibold text-sm text-white/80">
            {subLabel}
            {":"}
          </span>
          <span className="font-semibold text-base text-white">
            {isNaN(subStat) || subStat === 0 ? "--" : formatNumber(subStat)}
            {subStat != 0 && !isNaN(subStat) && (
              <span className="text-white/60">,000</span>
            )}
            {subStat != 0 && !isNaN(subStat) && <span>/ngày</span>}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
