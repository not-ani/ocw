"use client";

import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { SearchInput } from "./search-input";
import { UserAccountNav } from "@/components/user-account-nav";
import { Session } from "next-auth";
import SignInButton from "./SignInButton";

export const NavbarRoutes = (props: {
  session: Session
}) => {
  const { session } = props

  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isCoursePage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : null}
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
