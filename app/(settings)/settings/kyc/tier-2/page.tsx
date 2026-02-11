import React from "react";
import { DocumentsForm } from "../../_components/DocumentsForm";
import { SiteHeader } from "@/components/sidebar/site-header";
import { PageHeader } from "@/components/PageHeader";

const KycTier2Page = () => {
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <PageHeader
          description={
            " Complete your Tier 2 verification to unlock your wallet and start transacting."
          }
          title={"Verification"}
        />
        <div className="mt-4">
          <DocumentsForm />
        </div>
      </div>
    </div>
  );
};

export default KycTier2Page;
