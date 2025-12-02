import { getMyLeases } from "@/app/data/user/lease/get-my-leases";
import { EmptyState } from "@/components/EmptyState";
import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { LeasesTable } from "../_components/LeasesTable";
import { LeasesList } from "../_components/LeasesList";
import { Searchbar } from "@/components/Searchbar";
import { DEFAULT_LIMIT } from "@/constants";
import { Pagination } from "@/components/Pagination";
import { PageHeader } from "@/components/PageHeader";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My leases | Leadsage",
};

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;
  const leases = await getMyLeases({ query, page, limit: DEFAULT_LIMIT });

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <PageHeader
          title={"My Leases & Agreements"}
          description={"Manage and view all your leases and agreements from here."}
        />
        <Searchbar search={query} placeholder="Search by name, lease ID..." />

        {leases.leases.length === 0 && (
          <EmptyState
            title={"No leases & agreements"}
            description={
              "You have no leases & agreements yet! They would appear here once you do"
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
  );
};

export default page;
