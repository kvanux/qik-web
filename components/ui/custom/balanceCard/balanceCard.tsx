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
  subStat1: number;
  subStat2: number;
  type: CardType;
  cardTitle: string;
  subLabel1: string;
  subLabel2: string;
}

const BalanceCard = ({
  mainStat,
  subStat1,
  subStat2,
  type,
  cardTitle,
  subLabel1,
  subLabel2,
}: Props) => {
  return (
    <div
      className={`w-full rounded-2xl flex flex-col overflow-clip ${
        type == CardType.Primary && "bg-qik-pri-900"
      } ${type == CardType.Tertiary && "bg-qik-ter-800"}`}
    >
      <div
        id="cardTitle"
        className="flex px-4 py-2 h-10 bg-gradient-to-r from-white/30 to-transparent"
      >
        <span className="text-white w-64 font-semibold text-base">
          {cardTitle}
        </span>
        {type == CardType.Primary && (
          <Image
            src="/svg/inhandWalletIllustration.svg"
            width={96}
            height={96}
            alt=""
            className="relative w-28 h-28 -rotate-[16] -right-[16px] -bottom-[36px]"
          ></Image>
        )}
        {type == CardType.Tertiary && (
          <Image
            src="/svg/masterCardIllustration.svg"
            width={109}
            height={104}
            alt=""
            className="relative w-[109px] h-[104px] -rotate-[7] -right-[16px] -bottom-[36px]"
          ></Image>
        )}
      </div>
      <div
        id="cardContent"
        className={`p-4 flex flex-col justify-center items-start 
        ${
          type == CardType.Primary &&
          "bg-gradient-to-t from-qik-pri-400 from-[-20%] to-qik-pri-400/20"
        } ${
          type == CardType.Tertiary &&
          "bg-gradient-to-t from-qik-ter-400 from-[-20%] to-qik-ter-400/20"
        }
        `}
      >
        <div id="mainStat" className="flex gap-2 items-end">
          <Image
            src="/svg/dongIconMW.svg"
            width={17}
            height={24}
            alt=""
            className="pb-[6px]"
          />
          <span className="text-[32px] leading-10 font-semibold text-white">
            {formatNumber(mainStat)}
            {mainStat != 0 && <span className="text-white/60">,000</span>}
          </span>
        </div>
        <div id="subStat" className="flex gap-2">
          <span className="font-semibold text-sm text-white/60">
            {subLabel1}
            {":"}
          </span>
          <span className="font-semibold text-sm text-white">
            {formatNumber(subStat1)}
            {type == CardType.Primary && (
              <span className="text-white/60">,000</span>
            )}
          </span>
        </div>
        <div id="subStat" className="flex gap-2">
          <span className="font-semibold text-sm text-white/60">
            {subLabel2}
            {":"}
          </span>
          <span className="font-semibold text-sm text-white">
            {formatNumber(subStat2)}
            {type == CardType.Primary && (
              <span className="text-white/60">,000</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
