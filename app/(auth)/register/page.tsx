import React from "react";
import { RegisterForm } from "./_components/RegisterForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Leadsage",
};

const page = () => {
  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-semibold">Join us today</h1>
      <p className="text-muted-foreground text-base mt-1.5">
        Create your free Leadsage account and get started in minutes. Whether
        you're a renter searching for verified listings or a landlord listing
        your property, Leadsage makes it effortless, fast, and secure.
      </p>
      <RegisterForm />
    </div>
  );
};

export default page;
