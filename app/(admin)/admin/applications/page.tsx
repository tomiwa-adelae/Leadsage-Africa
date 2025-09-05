import { SiteHeader } from "@/components/sidebar/site-header";
import { getPendingApplications } from "@/app/data/user/application/get-pending-applications";
import { getReviewingApplications } from "@/app/data/user/application/get-reviewing-applications";
import { getApplications } from "@/app/data/user/application/get-applications";
import { EmptyState } from "@/components/EmptyState";
import { getTotalApplications } from "@/app/data/admin/application/get-all-applications";
import { getPendingReviewApplications } from "@/app/data/admin/application/get-pending-review-applications";
import { getApprovedApplications } from "@/app/data/admin/application/get-approved-applications";
import { ApplicationsCards } from "../_components/ApplicationsCard";
import { ApplicationsTable } from "../_components/ApplicationsTable";
import { ApplicationsList } from "../_components/ApplicationsList";
import { getRejectedApplications } from "@/app/data/admin/application/get-rejected-applications";
import { Pagination } from "@/components/Pagination";
import { DEFAULT_LIMIT } from "@/constants";
import { Searchbar } from "@/components/Searchbar";

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;

  const applications = await getTotalApplications();
  const pendingReviewApplications = await getPendingReviewApplications();
  const approvedApplications = await getApprovedApplications();
  const rejectedApplications = await getRejectedApplications();
  const paginatedApplications = await getTotalApplications({
    query,
    page,
    limit: DEFAULT_LIMIT,
  });
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
            applications={applications.applications}
          />
          <h3 className="font-medium text-lg mb-1.5">Applications</h3>
          <Searchbar search={query} placeholder="Search by name..." />

          {paginatedApplications.applications.length === 0 && (
            <EmptyState
              title={"No applications"}
              description={
                "There are no applications at this moment! They would appear here once you do"
              }
            />
          )}
          {applications.applications.length !== 0 && (
            <div className="mt-2.5">
              <ApplicationsTable
                applications={paginatedApplications.applications}
              />
              <ApplicationsList
                applications={paginatedApplications.applications}
              />
            </div>
          )}
          {paginatedApplications.applications.length !== 0 && (
            <Pagination
              page={paginatedApplications.pagination.page}
              totalPages={paginatedApplications.pagination.totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
