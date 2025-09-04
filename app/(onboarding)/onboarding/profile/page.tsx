import React from "react";
import { ProfileForm } from "./_components/ProfileForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserInfo, GetUserInfoType } from "@/app/data/user/get-user-info";

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
