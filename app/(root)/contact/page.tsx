import React from "react";

import type { Metadata } from "next";
import { Testimonials } from "@/app/(auth)/_components/Testimonials";
import { Logo } from "@/components/Logo";
import { ContactForm } from "../_components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Leadsage",
  description:
    "Have questions or need support? Get in touch with the Leadsage team today. We’re here to help landlords, tenants, and partners with housing needs.",
};

const page = () => {
  return (
    <div className="py-8 md:py-16">
      <div className="container">
        <h1 className="font-semibold text-3xl sm:text-4xl leading-snug md:text-5xl md:leading-snug">
          We’d Love to Hear From You
        </h1>
        <p className="text-muted-foreground mt-2.5 md:mt-4 text-base md:text-lg">
          Questions, support, or partnership inquiries? Our team is here to help
          you every step of the way.
        </p>
        <ContactForm />
      </div>
    </div>
  );
};

export default page;
