import { EmptyState } from "@/components/EmptyState";
import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { ApplicationsTable } from "../../_components/ApplicationsTable";
import { ApplicationsList } from "../../_components/ApplicationsList";
import { getApprovedApplications } from "@/app/data/admin/application/get-approved-applications";
import { DEFAULT_LIMIT } from "@/constants";
import { Searchbar } from "@/components/Searchbar";
import { Pagination } from "@/components/Pagination";

import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Approved applications - Admin | Leadsage",
};

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
        <PageHeader
          title={"Approved applications"}
          description={"View and manage all approved rental applications."}
        />
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
