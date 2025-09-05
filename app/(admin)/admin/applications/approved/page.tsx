import { EmptyState } from "@/components/EmptyState";
import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { ApplicationsTable } from "../../_components/ApplicationsTable";
import { ApplicationsList } from "../../_components/ApplicationsList";
import { getApprovedApplications } from "@/app/data/admin/application/get-approved-applications";
import { DEFAULT_LIMIT } from "@/constants";
import { Searchbar } from "@/components/Searchbar";
import { Pagination } from "@/components/Pagination";

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;
  const approvedApplications = await getApprovedApplications({
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
              Approved applications
            </h1>
            <p className="text-muted-foreground text-base mt-2.5">
              Manage all approved applications
            </p>
          </div>
        </div>
        <Searchbar search={query} placeholder="Search by name..." />

        {approvedApplications.applications.length === 0 && (
          <EmptyState
            title={"No applications"}
            description={"There are no approved applications yet"}
          />
        )}
        {approvedApplications.applications.length !== 0 && (
          <div className="mt-2.5">
            <ApplicationsTable
              applications={approvedApplications.applications}
            />
            <ApplicationsList
              applications={approvedApplications.applications}
            />
          </div>
        )}
        {approvedApplications.applications.length !== 0 && (
          <Pagination
            page={approvedApplications.pagination.page}
            totalPages={approvedApplications.pagination.totalPages}
          />
        )}
      </div>
    </div>
  );
};

export default page;
