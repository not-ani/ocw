import { getServerAuthSession } from "@/server/auth"
import { MobileSidebar } from "./mobile-sidebar"
import { NavbarRoutes } from "./navbar-routes"
import { ModeToggle } from "@/components/color"

export const Navbar = async () => {
  const session = await getServerAuthSession()

  return (
    <div className="p-4 border-b h-full flex items-center bg-background shadow-sm">
      <MobileSidebar />
      <div></div>
      <div className="flex flex-row gap-2">
        <ModeToggle />
        <NavbarRoutes session={session!} />
      </div>
    </div>
  )
}
