import { getServerAuthSession } from "@/server/auth"
import { MobileSidebar } from "./mobile-sidebar"
import { NavbarRoutes } from "./navbar-routes"

export const Navbar = async () => {
  const session = await getServerAuthSession()

  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <MobileSidebar />
      <NavbarRoutes session={session!} />
    </div>
  )
}
