import { Pagination } from "@/components/Pagination";
import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { LeasesTable } from "../../_components/LeasesTable";
import { LeasesList } from "../../_components/LeasesList";
import { EmptyState } from "@/components/EmptyState";
import { getActiveLeases } from "@/app/data/admin/lease/get-active-leases";
import { Searchbar } from "@/components/Searchbar";
import { DEFAULT_LIMIT } from "@/constants";

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;

  const leases = await getActiveLeases({ query, page, limit: DEFAULT_LIMIT });

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <h1 className="text-3xl md:text-4xl font-semibold">Active Leases</h1>
        <p className="text-muted-foreground text-base mt-2.5">
          View and manage all active leases
        </p>
        <div className="mt-4 space-y-6">
          <Searchbar search={query} placeholder="Search by name, Lease ID..." />
          {leases.leases.length === 0 && (
            <EmptyState
              title={"No leases"}
              description={
                "There are no active leases at this moment! They would appear here once you do"
              }
            />
          )}
          {leases.leases.length !== 0 && (
            <div className="mt-2.5">
              <LeasesTable leases={leases.leases} />
              <LeasesList leases={leases.leases} />
            </div>
          )}
          {leases.leases.length !== 0 && (
            <Pagination
              page={leases.pagination.page}
              totalPages={leases.pagination.totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
