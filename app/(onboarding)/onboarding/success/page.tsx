import { Confetti } from "@/components/Confetti";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Welcome to Leadsage | Account Created Successfully",
  description:
    "Your Leadsage account has been created. Start exploring properties, managing applications, and connecting with trusted landlords and tenants.",
};

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { role } = await searchParams;
  return (
    <div>
      <PageHeader title={"You're all set!"} />
      <p className="text-muted-foreground text-base mt-1.5">
        {role === "renter"
          ? "You’ve completed your profile. Start browsing spaces tailored to your preferences."
          : "Your profile is ready. You can now create your first listing and connect with potential renters."}
      </p>
      <div className="grid mt-8 grid-cols-2 gap-4">
        <Button size={"md"} className="w-full" asChild variant={"outline"}>
          <Link
            href={role === "landlord" ? "/landlord/listings/new" : "/listings"}
          >
            {role === "landlord" ? "Create first listing" : "Browse listings"}
          </Link>
        </Button>
        <Button size={"md"} className="w-full" asChild>
          <Link
            href={role === "landlord" ? "/landlord/dashboard" : "/dashboard"}
          >
            Dashboard
          </Link>
        </Button>
      </div>
      <Confetti />
    </div>
  );
};

export default page;
