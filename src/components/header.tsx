import { UserMenu } from "@/components/UserMenu";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export function Header() {
  return (
    <header className="border-b-[1px] flex justify-between py-4 px-4 items-center todesktop:sticky todesktop:top-0 todesktop:bg-background todesktop:z-10 todesktop:border-none">

      <div className="flex space-x-2 no-drag ml-auto">
        <Suspense>
        </Suspense>

        <Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
          <UserMenu onlySignOut={false} />
        </Suspense>
      </div>
    </header>
  );
}
