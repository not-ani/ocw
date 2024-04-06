import { Hero } from "@/components/landing/hero";
import { getCurrentUser } from "@/server/auth";

export default async function Home() {


  return (
    <div>
      <Hero />
    </div>
  );
}

