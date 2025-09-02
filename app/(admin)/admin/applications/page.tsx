import { SiteHeader } from "@/components/sidebar/site-header";
import { getPendingApplications } from "@/app/data/user/application/get-pending-applications";
import { getApprovedApplications } from "@/app/data/user/application/get-approved-applications";
import { getReviewingApplications } from "@/app/data/user/application/get-reviewing-applications";
import { getApplications } from "@/app/data/user/application/get-applications";
import { EmptyState } from "@/components/EmptyState";
import { getTotalApplicaitons } from "@/app/data/admin/application/get-all-applications";
import { getPendingReviewApplicaitons } from "@/app/data/admin/application/get-pending-review-applications";
import { getApprovedApplicaitons } from "@/app/data/admin/application/get-approved-applications";
import { ApplicationsCards } from "../_components/ApplicationsCard";
import { ApplicationsTable } from "../_components/ApplicationsTable";
import { ApplicationsList } from "../_components/ApplicationsList";
import { getRejectedApplications } from "@/app/data/admin/application/get-rejected-applications";

const page = async () => {
  const applications = await getTotalApplicaitons();
  const pendingReviewApplications = await getPendingReviewApplicaitons();
  const approvedApplications = await getApprovedApplicaitons();
  const rejectedApplications = await getRejectedApplications();
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <h1 className="text-3xl md:text-4xl font-semibold">All Applications</h1>
        <p className="text-muted-foreground text-base mt-2.5">
          View and manage all applications
        </p>
        <div className="mt-4 space-y-6">
          <ApplicationsCards
            pendingReviewApplications={pendingReviewApplications}
            approvedApplications={approvedApplications}
            rejectedApplications={rejectedApplications}
            applications={applications}
          />
          <h3 className="font-medium text-lg mb-1.5">Applications</h3>
          {applications.length === 0 && (
            <EmptyState
              title={"No applications"}
              description={
                "There are no applications at this moment! They would appear here once you do"
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
