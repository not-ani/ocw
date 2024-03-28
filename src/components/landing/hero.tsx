import Link from "next/link";
import { Button } from "../ui/button";

export function Hero() {
  return (
    <section className="text-center mt-16 md:mt-18 items-center flex flex-col">
      <Link href="/discover">
        <Button
          variant="outline"
          className="rounded-full border-border flex space-x-2 items-center"
        >
          <span>Explore Free Courses</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={12}
            height={12}
            fill="none"
          >
            <path
              fill="currentColor"
              d="M8.783 6.667H.667V5.333h8.116L5.05 1.6 6 .667 11.333 6 6 11.333l-.95-.933 3.733-3.733Z"
            />
          </svg>
        </Button>
      </Link>

      <h1 className="text-6xl font-medium mt-6">Education for Everyone.</h1>

      <p className="mt-4 md:mt-6 text-[#707070] max-w-[600px]">
        Our mission is to democratize education by making high-quality courses accessible to all, regardless of financial or geographical barriers. Join our community of learners and educators today.
      </p>

      <div className="mt-8">
        <div className="flex items-center space-x-4">
          <Link href="/about">
            <Button
              variant="outline"
              className="border border-primary h-12 px-6"
            >
              Learn More About Us
            </Button>
          </Link>

          <a href="https://access.opencourseware.example.com">
            <Button className="h-12 px-5">Access Courses</Button>
          </a>
        </div>
      </div>

      <p className="text-xs text-[#707070] mt-6">Completely free. Start learning today.</p>
    </section>
  );
}
