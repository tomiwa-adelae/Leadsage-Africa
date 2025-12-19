import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { Searchbar } from "@/components/Searchbar";
import { SiteHeader } from "@/components/sidebar/site-header";
import { DEFAULT_LIMIT } from "@/constants";
import React from "react";
import { ShortletsCard } from "../_components/ShortletsCard";
import { getCustomerShortlets } from "@/app/data/booking/get-customer-shortlets";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My shortlets | Leadsage",
};

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;
  const paginatedShortlets = await getCustomerShortlets({
    query,
    page,
    limit: DEFAULT_LIMIT,
  });

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <PageHeader
          description={"View and manage all shortlets"}
          title={"My shortlets"}
        />

        <div className="mt-4 space-y-6">
          <Searchbar search={query} placeholder="Search by name..." />

          {paginatedShortlets.shortlets.length === 0 && (
            <EmptyState
              title={"No shortlets booked"}
              description={
                "You have not booked any shortlets yet! They would appear here once you do"
              }
            />
          )}
          {paginatedShortlets.shortlets.length !== 0 && (
            <div className="mt-2.5">
              {paginatedShortlets.shortlets.map((shortlet) => (
                <ShortletsCard key={shortlet.id} shortlet={shortlet} />
              ))}
            </div>
          )}
          {paginatedShortlets.shortlets.length !== 0 && (
            <Pagination
              page={paginatedShortlets.pagination.page}
              totalPages={paginatedShortlets.pagination.totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
