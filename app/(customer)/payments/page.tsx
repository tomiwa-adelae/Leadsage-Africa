import { EmptyState } from "@/components/EmptyState";
import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { PaymentsTable } from "../_components/PaymentsTable";
import { getMyPayments } from "@/app/data/user/payment/get-my-payments";
import { PaymentsList } from "../_components/PaymentsList";
import { Pagination } from "@/components/Pagination";
import { DEFAULT_LIMIT } from "@/constants";
import { Searchbar } from "@/components/Searchbar";
import { PageHeader } from "@/components/PageHeader";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My payments | Leadsage",
};

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;

  const payments = await getMyPayments({ query, page, limit: DEFAULT_LIMIT });
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <PageHeader
          title={"My Payments"}
          description={"Manage and view all your payments from here."}
        />
        <Searchbar search={query} placeholder="Search by name, lease ID..." />

        {payments.payments.length === 0 && (
          <EmptyState
            title={"No payments"}
            description={
              "You have not made any payments yet! They would appear here once you do"
            }
          />
        )}
        {payments.payments.length !== 0 && (
          <div className="mt-2.5">
            <PaymentsTable payments={payments.payments} />
            <PaymentsList payments={payments.payments} />
          </div>
        )}
        {payments.payments.length !== 0 && (
          <Pagination
            page={payments.pagination.page}
            totalPages={payments.pagination.totalPages}
          />
        )}
      </div>
    </div>
  );
};

export default page;
