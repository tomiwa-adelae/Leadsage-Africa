import { EmptyState } from "@/components/EmptyState";
import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { ApplicationsTable } from "../../_components/ApplicationsTable";
import { ApplicationsList } from "../../_components/ApplicationsList";
import { getApprovedApplicaitons } from "@/app/data/admin/application/get-approved-applications";

const page = async () => {
  const approvedApplications = await getApprovedApplicaitons();

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold">
              Approved applications
            </h1>
            <p className="text-muted-foreground text-base mt-2.5">
              Manage all approved applications
            </p>
          </div>
        </div>
        {approvedApplications.length === 0 && (
          <EmptyState
            title={"No applications"}
            description={"There are no approved applications yet"}
          />
        )}
        {approvedApplications.length !== 0 && (
          <div className="mt-2.5">
            <ApplicationsTable applications={approvedApplications} />
            <ApplicationsList applications={approvedApplications} />
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
