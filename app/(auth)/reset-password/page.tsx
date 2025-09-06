import React, { Suspense } from "react";
import { ResetPasswordForm } from "./_components/ResetPasswordForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset password | Leadsage",
};

const page = () => {
  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-semibold">
        Reset your password
      </h1>
      <p className="text-muted-foreground text-base mt-1.5">
        For your security, please create a new password below. Make sure it’s
        something strong and unique.
      </p>
      <Suspense fallback={<p>Loading...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
};

export default page;
