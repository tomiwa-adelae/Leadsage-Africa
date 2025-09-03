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
import { LeasesCards } from "../_components/LeasesCards";
import { getExpiredLeases } from "@/app/data/admin/lease/get-expired-leases";
import { getAllLeases } from "@/app/data/admin/lease/get-all-leases";
import { getActiveLeases } from "@/app/data/admin/lease/get-active-leases";
import { getTerminatedLeases } from "@/app/data/admin/lease/get-terminated-leases";
import { LeasesTable } from "../_components/LeasesTable";
import { LeasesList } from "../_components/LeasesList";

const page = async () => {
  const leases = await getAllLeases();
  const expiredLeases = await getExpiredLeases();
  const activeLeases = await getActiveLeases();
  const terminatedLeases = await getTerminatedLeases();
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <h1 className="text-3xl md:text-4xl font-semibold">
          All Leases & Agreements
        </h1>
        <p className="text-muted-foreground text-base mt-2.5">
          View and manage all leases & agreements
        </p>
        <div className="mt-4 space-y-6">
          <LeasesCards
            expiredLeases={expiredLeases}
            activeLeases={activeLeases}
            terminatedLeases={terminatedLeases}
            leases={leases}
          />
          <h3 className="font-medium text-lg mb-1.5">Leases</h3>
          {leases.length === 0 && (
            <EmptyState
              title={"No leases"}
              description={
                "There are no leases at this moment! They would appear here once you do"
              }
            />
          )}
          {leases.length !== 0 && (
            <div className="mt-2.5">
              <LeasesTable leases={leases} />
              <LeasesList leases={leases} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
