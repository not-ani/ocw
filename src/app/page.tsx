import { Hero } from "@/components/landing/hero";
import { getCurrentUser } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Home() {


  return (
    <div>
      <Hero />
    </div>
  );
}
