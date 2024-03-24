"use client";

import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { SearchInput } from "./search-input";
import { UserAccountNav } from "@/components/user-account-nav";
import { Session } from "next-auth";
import SignInButton from "./SignInButton";
import { ModeToggle } from "@/components/color";

export const NavbarRoutes = (props: {
  session: Session | null
}) => {
  const { session } = props

  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/dashboard");
  const isDashboard = pathname?.includes("/dashboard")
  const isSearchPage = pathname === "/home";
  const isCoursePage = pathname?.includes("/courses");

  return (
    <>
      {
        isSearchPage || isTeacherPage ? <div className="hidden md:block">
          <SearchInput />
        </div> : null
      }
      <div className="flex gap-x-2 ml-auto">
        {isDashboard || isCoursePage ? (
          <Link href="/home">
            <Button className="h-[2.5rem]" size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : null}
        <ModeToggle />
        {
          session?.user ? <UserAccountNav
            user={{
              name: session.user.name,
              image: session.user.image,
              email: session.user.email
            }}
          /> : <SignInButton />}
      </div>
    </>
  )
}
