import { getServerAuthSession } from "@/server/auth"
import { NavbarRoutes } from "./navbar-routes"
import { headers } from "next/headers"

export const Navbar = async () => {
  const session = await getServerAuthSession()
  const heads = headers()

  const pathname = heads.get('next-url')
  console.log(pathname)

  const isS = pathname?.includes("lessons")
  return (
    <div className="h-full">
      <div className={isS ? `block` : "h-[80px] fixed inset-y-0 w-full z-50"}>
        <NavbarRoutes session={session} />
      </div>
    </div>
  )
}
