import { Pagination } from "@/components/Pagination";
import { SiteHeader } from "@/components/sidebar/site-header";
import { LeasesTable } from "../../_components/LeasesTable";
import { LeasesList } from "../../_components/LeasesList";
import { EmptyState } from "@/components/EmptyState";
import { Searchbar } from "@/components/Searchbar";
import { DEFAULT_LIMIT } from "@/constants";
import { getTerminatedLeases } from "@/app/data/admin/lease/get-terminated-leases";
import { PageHeader } from "@/components/PageHeader";

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;

  const leases = await getTerminatedLeases({
    query,
    page,
    limit: DEFAULT_LIMIT,
  });

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <PageHeader
          title={"Terminated Leases"}
          description={"View and manage all terminated lease agreements."}
        />
        <div className="mt-4 space-y-6">
          <Searchbar search={query} placeholder="Search by name, Lease ID..." />
          {leases.leases.length === 0 && (
            <EmptyState
              title={"No leases"}
              description={
                "There are no terminated leases at this moment! They would appear here once you do"
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
