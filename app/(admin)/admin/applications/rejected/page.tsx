import { EmptyState } from "@/components/EmptyState";
import { SiteHeader } from "@/components/sidebar/site-header";
import { ApplicationsTable } from "../../_components/ApplicationsTable";
import { ApplicationsList } from "../../_components/ApplicationsList";
import { getRejectedApplications } from "@/app/data/admin/application/get-rejected-applications";
import { DEFAULT_LIMIT } from "@/constants";
import { Pagination } from "@/components/Pagination";
import { Searchbar } from "@/components/Searchbar";

import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

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
        <PageHeader
          title={"Rejected applications"}
          description={"View and manage all rejected rental applications."}
        />
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
