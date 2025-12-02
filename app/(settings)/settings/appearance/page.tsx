import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { Themes } from "./_components/Themes";
import { PageHeader } from "@/components/PageHeader";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apperance | Leadsage",
};

const page = () => {
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6 space-y-4">
        <PageHeader
          title={"Theme Preferences"}
          description={"Customize how Leadsage looks for you."}
        />
        <Themes />
      </div>
    </div>
  );
};

export default page;
