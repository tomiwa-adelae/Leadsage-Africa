import { getUncompletedApplications } from "@/app/data/admin/application/get-uncompleted-applications";
import { EmptyState } from "@/components/EmptyState";
import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { ApplicationsTable } from "../../_components/ApplicationsTable";
import { ApplicationsList } from "../../_components/ApplicationsList";
import { Pagination } from "@/components/Pagination";
import { Searchbar } from "@/components/Searchbar";
import { DEFAULT_LIMIT } from "@/constants";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uncompleted applications - Admin | Leadsage",
};

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;
  const uncompletedApplications = await getUncompletedApplications({
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
            <h1 className="text-3xl md:text-4xl font-medium">
              Uncompleted applications
            </h1>
            <p className="text-muted-foreground text-base mt-2.5">
              Manage all uncompleted applications
            </p>
          </div>
        </div>
        <Searchbar search={query} placeholder="Search by name, booking ID..." />

        {uncompletedApplications.applications.length === 0 && (
          <EmptyState
            title={"No applications"}
            description={"There are no uncompleted applications yet"}
          />
        )}
        {uncompletedApplications.applications.length !== 0 && (
          <div className="mt-2.5">
            <ApplicationsTable
              applications={uncompletedApplications.applications}
            />
            <ApplicationsList
              applications={uncompletedApplications.applications}
            />
          </div>
        )}
        {uncompletedApplications.applications.length !== 0 && (
          <Pagination
            page={uncompletedApplications.pagination.page}
            totalPages={uncompletedApplications.pagination.totalPages}
          />
        )}
      </div>
    </div>
  );
};

export default page;
