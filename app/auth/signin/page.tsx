"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SignIn() {
  const handleSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="w-full h-[916px] flex p-8 justify-between min-[360px]:max-[800px]:p-4 min-[360px]:max-[800px]:w-screen min-[360px]:max-[800px]:h-screen overflow-clip">
      <div className="w-[668px] h-full px-20 pt-24 pb-[72px] flex flex-col bg-white/50 border-[2.5px] border-slate-100/50 shadow-qele-drawer backdrop-blur-xl rounded-3xl min-[360px]:max-[800px]:w-full min-[360px]:max-[800px]:px-6 min-[360px]:max-[800px]:pt-8 min-[360px]:max-[800px]:pb-6 max-[1366px]:w-[600px]">
        <div className="w-full h-full flex flex-col gap-8 ">
          <div className="flex gap-6 items-center h-12 max-[1366px]:justify-between max-[1366px]:gap-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
            >
              <path
                d="M39.6632 27.7895C39.6166 27.7895 39.5789 27.7518 39.5789 27.7053V24C39.5789 15.396 32.604 8.42105 24 8.42105C15.396 8.42105 8.42105 15.396 8.42105 24C8.42105 32.604 15.396 39.5789 24 39.5789H27.7053C27.7518 39.5789 27.7895 39.6166 27.7895 39.6632V47.9158C27.7895 47.9623 27.7518 48 27.7053 48H24C10.7452 48 0 37.2548 0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24V27.7053C48 27.7518 47.9623 27.7895 47.9158 27.7895H39.6632Z"
                fill="url(#paint0_linear_2439_8560)"
              />
              <path
                d="M29.4737 29.4737H48V48H29.4737V29.4737Z"
                fill="url(#paint1_linear_2439_8560)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_2439_8560"
                  x1="48"
                  y1="48"
                  x2="7"
                  y2="2"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#0EDFA2" stop-opacity="0.64" />
                  <stop
                    offset="0.255"
                    stop-color="#30DDC5"
                    stop-opacity="0.727816"
                  />
                  <stop offset="0.4" stop-color="#69D9FF" />
                  <stop offset="0.45" stop-color="#69D9FF" />
                  <stop offset="0.5" stop-color="#69D9FF" />
                  <stop offset="0.548028" stop-color="#69D9FF" />
                  <stop offset="0.6" stop-color="#69D9FF" />
                  <stop offset="1" stop-color="#27C1F5" stop-opacity="0.72" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_2439_8560"
                  x1="48"
                  y1="48"
                  x2="7"
                  y2="2"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#0EDFA2" stop-opacity="0.64" />
                  <stop
                    offset="0.255"
                    stop-color="#30DDC5"
                    stop-opacity="0.727816"
                  />
                  <stop offset="0.4" stop-color="#69D9FF" />
                  <stop offset="0.45" stop-color="#69D9FF" />
                  <stop offset="0.5" stop-color="#69D9FF" />
                  <stop offset="0.548028" stop-color="#69D9FF" />
                  <stop offset="0.6" stop-color="#69D9FF" />
                  <stop offset="1" stop-color="#27C1F5" stop-opacity="0.72" />
                </linearGradient>
              </defs>
            </svg>
            <Separator
              orientation="horizontal"
              className="w-56 bg-slate-200 min-[360px]:max-[800px]:w-10 max-[1366px]:w-40"
            />
            <p className="w-fit flex-shrink-0 text-slate-500 font-normal text-lg tracking-tight">
              Đăng nhập / Đăng ký
            </p>
          </div>
          <Button
            className="p-4 w-full h-16 bg-[#f1f5f9]/70 border border-white/70 hover:bg-[#e5e8ec] rounded-xl min-[360px]:max-[800px]:h-12"
            onClick={() => handleSignIn("google")}
          >
            <div className="w-full flex gap-0 items-center ">
              <Image
                src={
                  "https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
                }
                width={24}
                height={24}
                alt="google-logo"
                priority
              />
              <p className="w-full font-medium text-lg text-slate-700 min-[360px]:max-[800px]:text-base">
                Tiếp tục với Gmail
              </p>
            </div>
          </Button>
        </div>
        <div className="w-full flex justify-between items-center gap-2">
          <div className="flex gap-2">
            <p className="text-sm font-medium text-slate-500">
              © 2024 QIK Finance
            </p>
            <Link
              href="/privacy"
              className="text-qik-pri-900 font-medium text-sm"
            >
              Privacy Policy
            </Link>
          </div>
          <Link
            href="/privacy"
            className="text-qik-pri-800 font-medium text-sm"
          >
            Privacy
          </Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="19"
            viewBox="0 0 20 19"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 -0.5V16.5L3 19.5H16V11L4.5 -0.5H0ZM1.99992 1.50002H3.99992L13.9999 11.5V17.5H3.49992L1.99992 16V1.50002Z"
              fill="#121314"
            />
            <path d="M20 19.5V9.5L10 -0.5H7.5L18 10V19.5H20Z" fill="#121314" />
            <path d="M0 10.25V8.74998H13.25L14.75 10.25H0Z" fill="#121314" />
          </svg>
        </div>
      </div>
      <div className="w-[564px] h-full flex-col justify-center items-end gap-7 inline-flex pr-8 min-[360px]:max-[800px]:hidden">
        <div className="w-[564px] text-right">
          <span className="text-[#013d65] text-6xl font-light font-[manrope] capitalize leading-[80px]">
            Bắt đầu hành trình{" "}
          </span>
          <span className="text-[#013d65] text-6xl font-bold font-[manrope] capitalize leading-[80px]">
            làm chủ tài chính
          </span>
        </div>
        <div className="self-stretch text-right text-[#016fb9] text-[22px] font-semibold">
          Nhanh chóng, dễ sử dụng và hoàn toàn miễn phí.
        </div>
        <div className="w-[532px] text-justify text-[#01568e] text-lg font-normal">
          Được thiết kế và xây dựng với năng lực điện toán mạnh mẽ, công cụ của
          chúng tôi không chỉ giúp quản lý chi tiêu mà còn phân tích, đưa ra gợi
          ý thông minh, và hỗ trợ bạn xây dựng kế hoạch tài chính lâu dài.
        </div>
      </div>
      <div className="w-full h-[800px] absolute top-[10%] left-0 right-0 -z-20 min-[360px]:max-[800px]:w-screen min-[360px]:max-[800px]:h-screen min-[360px]:max-[800px]:overflow-clip">
        <div
          id="m1"
          className="absolute top-[524px] left-[0px] w-[402.28px] h-[179.37px] bg-[#69d9ff] rounded-full blur-[320px] transform-gpu will-change-transform animate-m12"
        />
        <div
          id="m2"
          className="absolute top-[343px] left-[242px] w-[491.42px] h-[307.49px] bg-[#69d9ff] rounded-full blur-[320px] transform-gpu will-change-transform animate-m12"
        />
        <div
          id="m3"
          className="absolute top-[84px] left-[636px] w-[632.94px] h-[511.37px] bg-[#69d9ff] rounded-full blur-[320px] transform-gpu will-change-transform animate-m3"
        />
        <div
          id="m4"
          className="absolute top-[78px] left-[1157px] w-[518.17px] h-[191.63px] bg-[#18f2b2] rounded-full blur-[320px] transform-gpu will-change-transform animate-m4"
        />
        <div
          id="m5"
          className="absolute top-[163px] left-[1482px] w-[437.93px] h-[454.55px] bg-[#18f2b2] rounded-full blur-[320px] transform-gpu will-change-transform animate-m5 "
        />
        <div
          id="s1 "
          className="absolute top-[389px] left-[110px] w-[262.98px] h-[174.91px] bg-[#016fb9] rounded-full blur-[320px] transform-gpu will-change-transform animate-s1 "
        ></div>
        <div
          id="s2 "
          className="absolute top-[528px] left-[624px] w-[262.98px] h-[122.55px] bg-[#016fb9] rounded-full blur-[320px] transform-gpu will-change-transform animate-s2 "
        ></div>
        <div
          id="s3 "
          className="absolute top-[0px] left-[973px] w-[275.24px] h-[189.40px] bg-[#18f2b2] rounded-full blur-[320px] transform-gpu will-change-transform animate-s3"
        ></div>
        <div
          id="s4 "
          className="absolute top-[173px] left-[1222px] w-[402.28px] h-[179.37px] bg-[#69d9ff] rounded-full blur-[320px] transform-gpu will-change-transform animate-s4"
        ></div>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="901"
        height="1024"
        viewBox="0 0 901 1024"
        fill="none"
        className="absolute right-0 -top-12 h-[960px] overflow-clip -z-10 min-[360px]:max-[800px]:hidden"
      >
        <g opacity="0.2" filter="url(#filter0_b_2267_59820)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M906.436 696.375C905.369 696.089 904.736 694.992 905.022 693.925L927.798 608.924C980.686 411.541 863.551 208.657 666.168 155.768C468.786 102.88 265.901 220.015 213.013 417.398C160.124 614.78 277.26 817.665 474.642 870.553L559.644 893.329C560.711 893.615 561.344 894.712 561.058 895.779L510.329 1085.1C510.044 1086.17 508.947 1086.8 507.88 1086.51L422.878 1063.74C118.803 982.262 -61.6492 669.71 19.8276 365.634C101.304 61.5582 413.857 -118.894 717.932 -37.417C1022.01 44.0598 1202.46 356.612 1120.98 660.688L1098.21 745.689C1097.92 746.756 1096.82 747.389 1095.76 747.103L906.436 696.375Z"
            fill="url(#paint0_linear_2267_59820)"
          />
        </g>
        <defs>
          <filter
            id="filter0_b_2267_59820"
            x="-79.7361"
            y="-136.981"
            width="1300.28"
            height="1303.56"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="40" />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_backgroundBlur_2267_59820"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_backgroundBlur_2267_59820"
              result="shape"
            />
          </filter>
          <linearGradient
            id="paint0_linear_2267_59820"
            x1="479.239"
            y1="-37.1874"
            x2="887.301"
            y2="1264.27"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="0.0971232" stopColor="#E5F8FF" />
            <stop offset="0.33905" stopColor="#F8FDFF" />
            <stop offset="0.449732" stopColor="#FAFEFF" />
            <stop offset="0.552717" stopColor="white" />
            <stop offset="0.708759" stopColor="#F8FFFF" />
            <stop offset="0.859014" stopColor="#E5F8FF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
