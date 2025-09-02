import { SiteHeader } from "@/components/sidebar/site-header";
import { EmptyState } from "@/components/EmptyState";
import { getApplications } from "@/app/data/landlord/application/get-applications";
import { getPendingApplications } from "@/app/data/landlord/application/get-pending-applications";
import { getApprovedApplications } from "@/app/data/landlord/application/get-approved-applications";
import { getReviewingApplications } from "@/app/data/landlord/application/get-reviewing-applications";
import { getRejectedApplications } from "@/app/data/landlord/application/get-rejected-applications";
import { ApplicationsCards } from "./_components/ApplicationsCards";
import { ApplicationsTable } from "../_components/ApplicationsTable";
import { ApplicationsList } from "../_components/ApplicationsList";

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
        <h1 className="text-3xl md:text-4xl font-semibold">My Applications</h1>
        <p className="text-muted-foreground text-base mt-2.5">
          View and manage all applications
        </p>
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
