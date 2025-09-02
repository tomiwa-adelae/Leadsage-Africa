import { EmptyState } from "@/components/EmptyState";
import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { ApplicationsTable } from "../../_components/ApplicationsTable";
import { ApplicationsList } from "../../_components/ApplicationsList";
import { getApprovedApplicaitons } from "@/app/data/admin/application/get-approved-applications";
import { getPendingReviewApplicaitons } from "@/app/data/admin/application/get-pending-review-applications";

const page = async () => {
  const pendingReviewApplications = await getPendingReviewApplicaitons();

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold">
              Applications under review
            </h1>
            <p className="text-muted-foreground text-base mt-2.5">
              Manage all applications under review
            </p>
          </div>
        </div>
        {pendingReviewApplications.length === 0 && (
          <EmptyState
            title={"No applications"}
            description={"There are no applications pending review yet"}
          />
        )}
        {pendingReviewApplications.length !== 0 && (
          <div className="mt-2.5">
            <ApplicationsTable applications={pendingReviewApplications} />
            <ApplicationsList applications={pendingReviewApplications} />
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
