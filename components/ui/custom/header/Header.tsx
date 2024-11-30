"use client";

import Image from "next/image";
import Link from "next/link";
import UserCard from "../userCard/UserCard";
import { useSession } from "next-auth/react";
import { User } from "lucide-react";
import { Button } from "../../button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../dropdown-menu";

const Header = () => {
  const { status, data: session } = useSession();
  const [userName, userEmail, userAvatar] = [
    session?.user.name,
    session?.user.email,
    session?.user.image,
  ];

  return (
    <div className="w-full max-w-[1840px] my-6 flex self-center justify-between px-5 py-2 bg-white rounded-xl items-center shadow-qele-panel">
      <Image
        src="/image/logo-lg.png"
        alt="logo"
        width={40}
        height={40}
        className="w-10 h-10"
      />
      <div id="rightBtnsGroup">
        {status === "loading" && (
          <span className="h-full flex items-center">Loading...</span>
        )}
        {status === "authenticated" && (
          <DropdownMenu>
            <DropdownMenuTrigger className="group flex gap-3 p-2 rounded-xl hover:bg-slate-100 focus-visible:outline-none">
              <UserCard
                name={userName as string}
                email={userEmail as string}
                avatar={userAvatar as string}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem
                asChild
                className="hover:cursor-pointer hover:bg-slate-100"
              >
                <Link
                  href="/api/auth/signout"
                  className="text-slate-900 font-medium"
                >
                  Sign Out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {status === "unauthenticated" && (
          <Button asChild variant="outline">
            <User className="text-slate-700" />
            <Link href="/api/auth/signin" className="text-slate-900">
              Sign In
            </Link>
          </Button>
        )}
        {/* <ChevronDown className="text-slate-700 transition duration-300 ease-in-out group-open:rotate-180" /> */}
      </div>
    </div>
  );
};

export default Header;
