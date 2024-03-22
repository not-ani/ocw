import { getCurrentUser } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getCurrentUser()
  if (session?.user) {
    redirect('/home')
  }

  return (
    <div>

    </div>
  );
}
