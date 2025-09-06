import { EmptyState } from "@/components/EmptyState";
import { SiteHeader } from "@/components/sidebar/site-header";
import { ApplicationsTable } from "../../_components/ApplicationsTable";
import { ApplicationsList } from "../../_components/ApplicationsList";
import { getRejectedApplications } from "@/app/data/admin/application/get-rejected-applications";
import { DEFAULT_LIMIT } from "@/constants";
import { Pagination } from "@/components/Pagination";
import { Searchbar } from "@/components/Searchbar";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rejected applications - Admin | Leadsage",
};

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;

  const rejectedApplications = await getRejectedApplications({
    query,
    page,
    limit: DEFAULT_LIMIT,
  });

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold">
              Rejected applications
            </h1>
            <p className="text-muted-foreground text-base mt-2.5">
              Manage all rejected applications
            </p>
          </div>
        </div>
        <Searchbar search={query} placeholder="Search by name..." />

        {rejectedApplications.applications.length === 0 && (
          <EmptyState
            title={"No applications"}
            description={"There are no rejected applications yet"}
          />
        )}
        {rejectedApplications.applications.length !== 0 && (
          <div className="mt-2.5">
            <ApplicationsTable
              applications={rejectedApplications.applications}
            />
            <ApplicationsList
              applications={rejectedApplications.applications}
            />
          </div>
        )}
        {rejectedApplications.applications.length !== 0 && (
          <Pagination
            page={rejectedApplications.pagination.page}
            totalPages={rejectedApplications.pagination.totalPages}
          />
        )}
      </div>
    </div>
  );
};

export default page;
