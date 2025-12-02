import React, { Suspense } from "react";
import { ResetPasswordForm } from "./_components/ResetPasswordForm";

import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Reset password | Leadsage",
};

const page = () => {
  return (
    <div>
      <PageHeader
        description={
          "For your security, please create a new password below. Make sure it’s something strong and unique."
        }
        title={"Reset your password"}
      />
      <Suspense fallback={<p>Loading...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
};

export default page;
