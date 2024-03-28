import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Image from "next/image"
import Link from "next/link";
import { DropdownMenuShortcut } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ThemeSwitch } from "./ThemeSwitch";
import { getCurrentUser } from "@/server/auth";


export async function UserMenu({ onlySignOut }: {
  onlySignOut: boolean;
}) {
  const session = await getCurrentUser()
  const userData = session?.user

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="rounded-full w-8 h-8 cursor-pointer">
          {userData?.image && (
            <Image
              src={userData?.image}
              alt={userData?.name || "User avatar"}
              width={32}
              height={32} />
          )}
          <AvatarFallback>
            <span className="text-xs">
              {userData?.name?.charAt(0)?.toUpperCase()}
            </span>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px]" sideOffset={10} align="end">
        {!onlySignOut && (
          <>
            <DropdownMenuLabel>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="truncate">{userData?.name}</span>
                  <span className="truncate text-xs text-[#606060] font-normal">
                    {userData?.email}
                  </span>
                </div>
                <div className="border py-0.5 px-3 rounded-full text-[11px] font-normal">
                  Beta
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <Link href="/account">
                <DropdownMenuItem>
                  Account
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
              </Link>

              <Link href="/account/teams">
                <DropdownMenuItem>
                  Teams
                  <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
                </DropdownMenuItem>
              </Link>

              {/* <Link href="/apps">
                      <DropdownMenuItem>
                        Apps
                        <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </Link> */}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <div className="flex flex-row justify-between items-center p-2">
              <p className="text-sm">Theme</p>
              <ThemeSwitch />
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

      </DropdownMenuContent>
    </DropdownMenu>
  );
}

