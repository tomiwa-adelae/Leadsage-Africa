import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export const SecondCTA = () => {
  return (
    <div className="container py-16 ">
      <div className="relative w-full max-w-screen overflow-hidden rounded-[40px] bg-primary container px-6 py-16 sm:p-10 md:p-20">
        <div className="relative z-10 text-center text-white flex flex-col items-center justify-center gap-8">
          <h2 className="text-2xl md:text-3xl font-medium">
            Are you a landlord? List your property on Leadsage today!
          </h2>
          <Button
            asChild
            variant={"secondary"}
            className="w-full sm:w-auto"
            size={"md"}
          >
            <Link href={"/register"}>Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
