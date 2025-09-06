import React from "react";
import { LoginForm } from "./_components/LoginForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Leadsage",
};

const page = () => {
  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-semibold">Welcome back!</h1>
      <p className="text-muted-foreground text-base mt-1.5">
        Log in to continue your journey with Leadsage, whether you're listing a
        property or booking your dream apartment.
      </p>
      <LoginForm />
    </div>
  );
};

export default page;
