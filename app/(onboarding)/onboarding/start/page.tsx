import React from "react";
import { RoleForm } from "./_components/RoleForm";
import { getUserInfo } from "@/app/data/user/get-user-info";
import { PageHeader } from "@/components/PageHeader";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Select role | Leadsage Onboarding",
  description:
    "Join Leadsage and start your journey to better housing. Create your account to access verified listings, manage bookings, and connect with landlords.",
};

const page = async () => {
  const user = await getUserInfo();
  return (
    <div>
      <PageHeader
        title={"Let's begin! Which of these best describe you?"}
      />
      <RoleForm role={user.role} />
    </div>
  );
};

export default page;
