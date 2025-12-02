import { SiteHeader } from "@/components/sidebar/site-header";
import { EmptyState } from "@/components/EmptyState";
import { Searchbar } from "@/components/Searchbar";
import { DEFAULT_LIMIT } from "@/constants";
import { Pagination } from "@/components/Pagination";

import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { getTotalUsers } from "@/app/data/admin/user/get-all-users";
import { getAdmins } from "@/app/data/admin/user/get-admins";
import { getRenters } from "@/app/data/admin/user/get-renters";
import { UsersTable } from "../../_components/UsersTable";
import { UsersList } from "../../_components/UsersList";

export const metadata: Metadata = {
  title: "Renters - Admin | Leadsage",
};

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;

  const renters = await getRenters({
    query,
    page,
    limit: DEFAULT_LIMIT,
  });
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <PageHeader
          title={"All renters"}
          description={"View and manage all registered renters."}
        />
        <div className="mt-4 space-y-6">
          <Searchbar
            search={query}
            placeholder="Search by name, email, role, ID..."
          />
          {renters.renters.length === 0 && (
            <EmptyState
              title={"No renters"}
              description={
                "There are no renters at this moment! They would appear here once you do"
              }
            />
          )}
          {renters.renters.length !== 0 && (
            <div className="mt-2.5">
              <UsersTable users={renters.renters} />
              <UsersList users={renters.renters} />
            </div>
          )}
          {renters.renters.length !== 0 && (
            <Pagination
              page={renters.pagination.page}
              totalPages={renters.pagination.totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
