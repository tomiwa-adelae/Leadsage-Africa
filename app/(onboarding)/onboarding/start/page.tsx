import React from "react";
import { RoleForm } from "./_components/RoleForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserInfo } from "@/app/data/user/get-user-info";

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
