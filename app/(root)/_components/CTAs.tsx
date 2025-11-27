import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export const CTAs = () => {
  return (
    <div className="container mt-12">
      <div className="relative w-full max-w-screen overflow-hidden rounded-[40px] bg-primary container px-6 py-10 sm:p-10 md:p-20">
        <div className="absolute inset-0 hidden h-full w-full overflow-hidden md:block">
          <div className="absolute top-1/2 right-[-10%] aspect-square h-[800px] w-[800px] -translate-y-1/2">
            <div className="absolute inset-0 rounded-full bg-green-400 opacity-30"></div>
            <div className="absolute inset-0 scale-[0.8] rounded-full bg-green-300 opacity-30"></div>
            <div className="absolute inset-0 scale-[0.6] rounded-full bg-green-200 opacity-30"></div>
            <div className="absolute inset-0 scale-[0.4] rounded-full bg-green-100 opacity-30"></div>
            <div className="absolute inset-0 scale-[0.2] rounded-full bg-green-50 opacity-30"></div>
            <div className="absolute inset-0 scale-[0.1] rounded-full bg-white/50 opacity-30"></div>
          </div>
        </div>
        <div className="relative z-10 text-white">
          <h2 className="text-2xl md:text-3xl font-medium">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="text-base mt-2.5">
            Search verified listings, connect with trusted landlords, and move
            into your next home with confidence
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 mt-8">
            <Button
              asChild
              variant={"black"}
              className="w-full sm:w-auto"
              size={"md"}
            >
              <Link href={"/listings"}>Browse Listings</Link>
            </Button>
            <Button variant={"ghost"} className="w-full sm:w-auto" size={"md"}>
              Become a Landlord
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
