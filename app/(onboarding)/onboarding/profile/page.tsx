import React from "react";
import { ProfileForm } from "./_components/ProfileForm";
import { getUserInfo } from "@/app/data/user/get-user-info";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Completed your profile | Leadsage",
};

const page = async () => {
  const user = await getUserInfo();

  return (
    <div className="w-full">
      <h1 className="text-3xl md:text-4xl font-semibold">
        Let's Complete Your Profile
      </h1>
      <p className="text-muted-foreground text-base mt-1.5">
        We just need a few more details to tailor your renting experience on
        Leadsage.
      </p>
      <ProfileForm data={user} />
    </div>
  );
};

export default page;
