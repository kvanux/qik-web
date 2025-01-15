"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserCard from "@/components/ui/custom/userCard/UserCard";
import { useSession } from "next-auth/react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { signOut } from "next-auth/react";

const Header = () => {
  const { status, data: session } = useSession();
  const [userName, userEmail, userAvatar] = [
    session?.user.name,
    session?.user.email,
    session?.user.image,
  ];
  const pathName = usePathname();

  return (
    <div className="w-full max-w-[1840px] my-6 flex self-center justify-between px-5 py-2 bg-white rounded-xl items-center shadow-qele-panel">
      <div id="leftBtnsGroup" className="flex gap-3 items-center">
        <Image
          src="/image/logo-lg.webp"
          alt="logo"
          width={44}
          height={44}
          className="min-[360px]:max-[800px]:hidden"
        />
        <Separator
          orientation="vertical"
          className="h-11 min-[360px]:max-[800px]:hidden"
        />
        <NavigationMenu className="pt-1">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" passHref legacyBehavior>
                <NavigationMenuLink
                  className={`${
                    pathName === "/" &&
                    "text-slate-900 bg-slate-200 min-[360px]:max-[800px]:h-10 min-[360px]:max-[800px]:border-qik-pri-600"
                  } gap-1 inline-flex h-auto w-max items-center justify-center rounded-md px-2 py-1 text-base text-slate-500 font-medium transition-colors hover:bg-slate-100 hover:text-slate-600 focus:bg-slate-100 focus:text-slate-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-slate-100/50 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus:bg-slate-800 dark:focus:text-slate-50`}
                >
                  {pathName === "/" ? (
                    <Image
                      src="/svg/navItem_InOut.svg"
                      alt="illus"
                      width={36}
                      height={36}
                      className="min-[360px]:max-[800px]:hidden"
                    />
                  ) : (
                    <Image
                      src="/svg/navItem_InOut_Inactive.svg"
                      alt="illus"
                      width={36}
                      height={36}
                      className="min-[360px]:max-[800px]:hidden"
                    />
                  )}
                  Dòng tiền
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/summary" passHref legacyBehavior>
                <NavigationMenuLink
                  className={`${
                    pathName === "/summary" && "text-slate-800 bg-slate-200"
                  } gap-1 inline-flex h-auto w-max items-center justify-center rounded-md px-2 py-1 text-base text-slate-500 font-medium transition-colors hover:bg-slate-100 hover:text-slate-600 focus:bg-slate-100 focus:text-slate-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-slate-100/50 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus:bg-slate-800 dark:focus:text-slate-50`}
                >
                  {pathName === "/summary" ? (
                    <Image
                      src="/svg/navItem_Summary.svg"
                      alt="illus"
                      width={36}
                      height={36}
                      className="min-[360px]:max-[800px]:hidden"
                    />
                  ) : (
                    <Image
                      src="/svg/navItem_Summary_Inactive.svg"
                      alt="illus"
                      width={36}
                      height={36}
                      className="min-[360px]:max-[800px]:hidden"
                    />
                  )}
                  Tổng quan
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div id="rightBtnsGroup" className="flex gap-3 items-center">
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
            <DropdownMenuContent className="w-40">
              <DropdownMenuItem
                asChild
                className="hover:cursor-pointer hover:bg-slate-100"
              >
                <Button
                  variant="ghost"
                  className="w-full text-slate-900 font-medium justify-start px-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                  onClick={() => signOut()}
                >
                  <LogOut />
                  Đăng xuất
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {status === "unauthenticated" && (
          <Button asChild variant="outline">
            <User className="text-slate-700" />
            <Link href="/api/auth/signin" className="text-slate-900">
              Đăng nhập/Đăng ký
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
