import { SiteHeader } from "@/components/sidebar/site-header";
import { ApplicationsCards } from "./_components/ApplicationsCards";
import { getPendingApplications } from "@/app/data/user/application/get-pending-applications";
import { getApprovedApplications } from "@/app/data/user/application/get-approved-applications";
import { getReviewingApplications } from "@/app/data/user/application/get-reviewing-applications";
import { getRejectedApplications } from "@/app/data/user/application/get-rejected-applications";
import { getApplications } from "@/app/data/user/application/get-applications";
import { EmptyState } from "@/components/EmptyState";
import { ApplicationsTable } from "../_components/ApplicationsTable";
import { ApplicationsList } from "../_components/ApplicationsList";
import { PageHeader } from "@/components/PageHeader";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My applications | Leadsage",
};

const page = async () => {
  const applications = await getApplications();
  const pendingApplications = await getPendingApplications();
  const approvedApplications = await getApprovedApplications();
  const reviewingApplications = await getReviewingApplications();
  const rejectedApplications = await getRejectedApplications();
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <PageHeader
          title={"My Applications"}
          description={"View and manage all your applications."}
        />
        <div className="mt-4 space-y-6">
          <ApplicationsCards
            pendingApplications={pendingApplications}
            approvedApplications={approvedApplications}
            reviewingApplications={reviewingApplications}
            rejectedApplications={rejectedApplications}
          />
          <h3 className="font-medium text-lg mb-1.5">Applications</h3>
          {applications.length === 0 && (
            <EmptyState
              title={"No applications"}
              description={
                "You have not applied for any property yet! They would appear here once you do"
              }
            />
          )}
          {applications.length !== 0 && (
            <div className="mt-2.5">
              <ApplicationsTable applications={applications} />
              <ApplicationsList applications={applications} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
