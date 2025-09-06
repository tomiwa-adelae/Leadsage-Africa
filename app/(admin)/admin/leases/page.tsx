import { SiteHeader } from "@/components/sidebar/site-header";
import { EmptyState } from "@/components/EmptyState";
import { LeasesCards } from "../_components/LeasesCards";
import { getExpiredLeases } from "@/app/data/admin/lease/get-expired-leases";
import { getAllLeases } from "@/app/data/admin/lease/get-all-leases";
import { getActiveLeases } from "@/app/data/admin/lease/get-active-leases";
import { getTerminatedLeases } from "@/app/data/admin/lease/get-terminated-leases";
import { LeasesTable } from "../_components/LeasesTable";
import { LeasesList } from "../_components/LeasesList";
import { Searchbar } from "@/components/Searchbar";
import { DEFAULT_LIMIT } from "@/constants";
import { Pagination } from "@/components/Pagination";

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;

  const leases = await getAllLeases();
  const expiredLeases = await getExpiredLeases();
  const activeLeases = await getActiveLeases();
  const terminatedLeases = await getTerminatedLeases();
  const paginatedLeases = await getAllLeases({
    query,
    page,
    limit: DEFAULT_LIMIT,
  });
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <h1 className="text-3xl md:text-4xl font-semibold">
          All Leases & Agreementsss
        </h1>
        <p className="text-muted-foreground text-base mt-2.5">
          View and manage all leases & agreements
        </p>
        <div className="mt-4 space-y-6">
          <LeasesCards
            expiredLeases={expiredLeases.leases}
            activeLeases={activeLeases.leases}
            terminatedLeases={terminatedLeases.leases}
            leases={leases.leases}
          />
          <h3 className="font-medium text-lg mb-1.5">Leases</h3>
          <Searchbar search={query} placeholder="Search by name, Lease ID..." />
          {paginatedLeases.leases.length === 0 && (
            <EmptyState
              title={"No leases"}
              description={
                "There are no leases at this moment! They would appear here once you do"
              }
            />
          )}
          {paginatedLeases.leases.length !== 0 && (
            <div className="mt-2.5">
              <LeasesTable leases={paginatedLeases.leases} />
              <LeasesList leases={paginatedLeases.leases} />
            </div>
          )}
          {paginatedLeases.leases.length !== 0 && (
            <Pagination
              page={paginatedLeases.pagination.page}
              totalPages={paginatedLeases.pagination.totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
