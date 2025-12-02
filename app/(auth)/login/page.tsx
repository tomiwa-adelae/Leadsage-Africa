import React from "react";
import { LoginForm } from "./_components/LoginForm";
import { PageHeader } from "@/components/PageHeader";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Leadsage",
};

const page = () => {
  return (
    <div>
      <PageHeader
        title={"Welcome back!"}
        description={"Log in to continue your journey with Leadsage, whether you're listing a property or booking your dream apartment."}
      />
      <LoginForm />
    </div>
  );
};

export default page;
