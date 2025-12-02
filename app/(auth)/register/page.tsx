import React from "react";
import { RegisterForm } from "./_components/RegisterForm";

import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Register | Leadsage",
};

const page = () => {
  return (
    <div>
      <PageHeader
        description={
          "Create your free Leadsage account and get started in minutes. Whether you're a renter searching for verified listings or a landlord listing your property, Leadsage makes it effortless, fast, and secure."
        }
        title={"Join us today"}
      />
      <RegisterForm />
    </div>
  );
};

export default page;
