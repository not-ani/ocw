import { Header } from "@/components/header";
import { Navbar } from "../_components/navbar";
import { headers } from "next/headers";

const Layout = ({
  children
}: {
  children: React.ReactNode;
}) => {

  const heads = headers()

  const pathname = heads.get('next-url')
  console.log(pathname)

  const isS = pathname?.includes("lessons")
  return (
    <div className="h-full">
      <div className={isS ? `block` : "h-[80px] fixed inset-y-0 w-full z-50"}>
        <Header />
      </div>
      <main className="pt-[80px] h-full">
        {children}
      </main>
    </div>
  );
}

export default Layout;
