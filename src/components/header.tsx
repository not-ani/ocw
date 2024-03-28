import { SearchInput } from "@/app/_components/search-input";
import { UserMenu } from "@/components/UserMenu";
import { Skeleton } from "@/components/ui/skeleton";
import { headers } from "next/headers";
import { Suspense } from "react";

export function Header() {

  const heads = headers()

  const pathname = heads.get('next-url')
  console.log(pathname)

  const isS = pathname?.includes("lessons")
  const isHome = pathname?.includes("home")
  const cls = isS ? 'hidden' : "border-b-[1px] flex justify-between py-4 px-4 items-center todesktop:sticky todesktop:top-0 todesktop:bg-background todesktop:z-10 todesktop:border-none"

  return (
    <header className={cls}>
      {
        isHome && (
          <SearchInput></SearchInput>
        )
      }


      <Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
        <UserMenu onlySignOut={false} />
      </Suspense>
    </header>
  );
}
