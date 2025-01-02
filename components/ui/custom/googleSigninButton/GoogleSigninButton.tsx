"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function GoogleSigninButton() {
  return (
    <Button
      className="p-4 w-full h-16 bg-[#f1f5f9]/70 border border-white/70 hover:bg-[#f1f5f9] rounded-xl"
      onClick={() => signIn("google", { callbackUrl: "/" })}
    >
      <div className="w-full flex gap-0 items-center ">
        <Image
          src={"/svg/google1.svg"}
          width={24}
          height={24}
          alt="google-logo"
          priority
        />
        <p className="w-full font-medium text-lg text-slate-700">
          Tiếp tục với Gmail
        </p>
      </div>
    </Button>
  );
}
