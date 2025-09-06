import React from "react";
import { ForgotPasswordForm } from "./_components/ForgotPasswordForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot password | Leadsage",
};

const page = () => {
  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-semibold">
        Forgot your password?
      </h1>
      <p className="text-muted-foreground text-base mt-1.5">
        We’ve got you. Just provide your email, and we’ll help you get back on
        track.
      </p>
      <ForgotPasswordForm />
    </div>
  );
};

export default page;
