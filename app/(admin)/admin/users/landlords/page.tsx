import { SiteHeader } from "@/components/sidebar/site-header";
import { EmptyState } from "@/components/EmptyState";
import { Searchbar } from "@/components/Searchbar";
import { DEFAULT_LIMIT } from "@/constants";
import { Pagination } from "@/components/Pagination";

import type { Metadata } from "next";
import { getTotalUsers } from "@/app/data/admin/user/get-all-users";
import { getAdmins } from "@/app/data/admin/user/get-admins";
import { getLandlords } from "@/app/data/admin/user/get-landlords";
import { UsersTable } from "../../_components/UsersTable";
import { UsersList } from "../../_components/UsersList";

export const metadata: Metadata = {
  title: "Landlords - Admin | Leadsage",
};

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;

  const landlords = await getLandlords({
    query,
    page,
    limit: DEFAULT_LIMIT,
  });
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <h1 className="text-3xl md:text-4xl font-medium">All landlords</h1>
        <p className="text-muted-foreground text-base mt-2.5">
          View and manage all landlords from here
        </p>
        <div className="mt-4 space-y-6">
          <Searchbar
            search={query}
            placeholder="Search by name, email, role, ID..."
          />
          {landlords.landlords.length === 0 && (
            <EmptyState
              title={"No landlords"}
              description={
                "There are no landlords at this moment! They would appear here once you do"
              }
            />
          )}
          {landlords.landlords.length !== 0 && (
            <div className="mt-2.5">
              <UsersTable users={landlords.landlords} />
              <UsersList users={landlords.landlords} />
            </div>
          )}
          {landlords.landlords.length !== 0 && (
            <Pagination
              page={landlords.pagination.page}
              totalPages={landlords.pagination.totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
