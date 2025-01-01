"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SignIn() {
  return (
    <div className="w-full h-[916px] flex p-8 justify-between bg-slate-100">
      <div className="w-[668px] h-full px-20 pt-24 pb-[72px] flex flex-col bg-white/65 border-[2.5px] border-white/80 shadow-qele-drawer backdrop-blur-xl rounded-3xl">
        <div className="w-full h-full flex flex-col gap-8 ">
          <div className="flex gap-6 items-center h-12">
            <Image
              src="/image/logo-lg.webp"
              width={48}
              height={48}
              alt="logoQIK"
              className="flex-shrink-0"
            />
            <Separator
              orientation="horizontal"
              className="w-56 bg-slate-200 text-slate-200"
            />
            <p className="w-fit flex-shrink-0 text-slate-500 font-normal text-lg tracking-tight">
              Đăng nhập / Đăng ký
            </p>
          </div>
          <Button
            className="p-4 w-full h-16 bg-[#f1f5f9]/70 border border-white/70 hover:bg-[#f1f5f9] rounded-xl"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <div className="w-full flex gap-0 items-center ">
              <Image
                src={"svg/google1.svg"}
                width={24}
                height={24}
                alt="google-logo"
              />
              <p className="w-full font-medium text-lg text-slate-700">
                Tiếp tục với Gmail
              </p>
            </div>
          </Button>
        </div>
        <div className="w-full flex justify-between items-center">
          <p className="text-sm font-medium text-slate-500">
            © 2024 QIK Finance
          </p>
          <Image
            src={"/svg/logoMarkup.svg"}
            width={115}
            height={20}
            alt="logOliver"
          />
        </div>
      </div>
      <div className="w-[564px] h-full"></div>
      <video
        height={1920}
        width={912}
        className="w-full h-auto max-h-[912px] absolute top-0 left-0 right-0 -z-20"
        autoPlay
        muted
        loop
      >
        <source src="/image/aurabg.webm" type="video/webm" />
      </video>
    </div>
  );
}

// <div className="flex min-h-screen items-center justify-center">
//   <div className="w-full max-w-sm space-y-4 p-4">
//     <div className="text-center">
//       <h1 className="text-2xl font-bold">Sign In</h1>
//       <p className="text-gray-600">Choose your sign in method</p>
//     </div>

//     <div className="space-y-2">
//       <Button
//         className="w-full"
//         onClick={() => signIn("google", { callbackUrl: "/" })}
//       >
//         <div className="flex items-center justify-center gap-2">
//           <svg className="h-5 w-5" /* Add your Google icon SVG here */ />
//           <span>Continue with Google</span>
//         </div>
//       </Button>
//     </div>
//   </div>
// </div>
