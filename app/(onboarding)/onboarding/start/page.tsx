import React from "react";
import { RoleForm } from "./_components/RoleForm";
import { getUserInfo } from "@/app/data/user/get-user-info";

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
      <h1 className="text-3xl md:text-4xl font-semibold">
        Let's begin! Which of these best describe you?
      </h1>
      <RoleForm role={user.role} />
    </div>
  );
};

export default page;
