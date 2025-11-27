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

import type { Metadata } from "next";
import { getTotalUsers } from "@/app/data/admin/user/get-all-users";
import { getAdmins } from "@/app/data/admin/user/get-admins";
import { getLandlords } from "@/app/data/admin/user/get-landlords";
import { UsersCards } from "../_components/UsersCards";
import { UsersTable } from "../_components/UsersTable";
import { UsersList } from "../_components/UsersList";

export const metadata: Metadata = {
  title: "All Users - Admin | Leadsage",
};

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;

  const users = await getTotalUsers();
  const admins = await getAdmins();
  const landlords = await getLandlords();
  const paginatedUsers = await getTotalUsers({
    query,
    page,
    limit: DEFAULT_LIMIT,
  });
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <h1 className="text-3xl md:text-4xl font-medium">All users</h1>
        <p className="text-muted-foreground text-base mt-2.5">
          View and manage all users from here
        </p>
        <div className="mt-4 space-y-6">
          <UsersCards
            admins={admins.admins}
            renters={users.users}
            landlords={landlords.landlords}
            // users={users.users}
          />
          <h3 className="font-medium text-lg mb-1.5">Users</h3>
          <Searchbar
            search={query}
            placeholder="Search by name, email, role, ID..."
          />
          {paginatedUsers.users.length === 0 && (
            <EmptyState
              title={"No users"}
              description={
                "There are no users at this moment! They would appear here once you do"
              }
            />
          )}
          {paginatedUsers.users.length !== 0 && (
            <div className="mt-2.5">
              <UsersTable users={paginatedUsers.users} />
              <UsersList users={paginatedUsers.users} />
            </div>
          )}
          {paginatedUsers.users.length !== 0 && (
            <Pagination
              page={paginatedUsers.pagination.page}
              totalPages={paginatedUsers.pagination.totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
