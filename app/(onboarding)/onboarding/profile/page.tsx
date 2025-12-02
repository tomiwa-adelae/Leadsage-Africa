import React from "react";
import { ProfileForm } from "./_components/ProfileForm";
import { getUserInfo } from "@/app/data/user/get-user-info";
import { PageHeader } from "@/components/PageHeader";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Completed your profile | Leadsage",
};

const page = async () => {
  const user = await getUserInfo();

  return (
    <div className="w-full">
      <PageHeader
        title={"Let's Complete Your Profile"}
        description={"We just need a few more details to tailor your renting experience on Leadsage."}
      />
      <ProfileForm data={user} />
    </div>
  );
};

export default page;
