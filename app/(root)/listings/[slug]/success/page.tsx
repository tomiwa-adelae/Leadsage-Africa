import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Confetti } from "@/components/Confetti";

const page = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl md:text-4xl font-semibold">You're all set!</h1>
      <p className="text-muted-foreground text-base mt-2.5">
        Your visit has been scheduled. We’ve sent the details to your email.
      </p>
      <div className="grid grid-cols-2 gap-4 mt-8">
        <Button size="md" asChild variant={"outline"} className="w-full">
          <Link href={`/dashboard`}>Visit my dashboard</Link>
        </Button>
        <Button className="w-full" asChild size="md">
          <Link href={`/listings`}>Continue browsing</Link>
        </Button>
      </div>
      <Confetti />
    </div>
  );
};

export default page;
