import React from "react";
import { ForgotPasswordForm } from "./_components/ForgotPasswordForm";
import { PageHeader } from "@/components/PageHeader";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot password | Leadsage",
};

const page = () => {
  return (
    <div>
      <PageHeader
        title={"Forgot your password?"}
        description={"We've got you. Just provide your email, and we'll help you get back on track."}
      />
      <ForgotPasswordForm />
    </div>
  );
};

export default page;
