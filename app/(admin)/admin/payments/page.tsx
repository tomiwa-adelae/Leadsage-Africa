import { SiteHeader } from "@/components/sidebar/site-header";
import { EmptyState } from "@/components/EmptyState";

import { getAllPayments } from "@/app/data/admin/payment/get-all-payments";
import { getPendingPayments } from "@/app/data/admin/payment/get-pending-payments";
import { getSuccessfulPayments } from "@/app/data/admin/payment/get-successful-payments";
import { getFailedPayments } from "@/app/data/admin/payment/get-failed-payments";
import { PaymentsTable } from "../_components/PaymentsTable";
import { PaymentsList } from "../_components/PaymentsList";
import { PaymentsCards } from "../_components/PaymentsCards";
import { DEFAULT_LIMIT } from "@/constants";
import { Pagination } from "@/components/Pagination";
import { Searchbar } from "@/components/Searchbar";

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { query, page } = await searchParams;

  const payments = await getAllPayments();
  const pendingPayments = await getPendingPayments();
  const successfulPayments = await getSuccessfulPayments();
  const failedPayments = await getFailedPayments();
  const paginatedPayments = await getAllPayments({
    query,
    page,
    limit: DEFAULT_LIMIT,
  });
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <h1 className="text-3xl md:text-4xl font-semibold">
          All Payments & Transactions
        </h1>
        <p className="text-muted-foreground text-base mt-2.5">
          View and manage all payments & transactions
        </p>
        <div className="mt-4 space-y-6">
          <PaymentsCards
            pendingPayments={pendingPayments.payments}
            successfulPayments={successfulPayments.payments}
            failedPayments={failedPayments.payments}
            payments={payments.payments}
          />
          <h3 className="font-medium text-lg mb-1.5">Payments</h3>
          <Searchbar search={query} placeholder="Search by name, Lease ID..." />

          {paginatedPayments.payments.length === 0 && (
            <EmptyState
              title={"No payments"}
              description={
                "There are no payments at this moment! They would appear here once you do"
              }
            />
          )}
          {paginatedPayments.payments.length !== 0 && (
            <div className="mt-2.5">
              <PaymentsTable payments={paginatedPayments.payments} />
              <PaymentsList payments={paginatedPayments.payments} />
            </div>
          )}
          {paginatedPayments.payments.length !== 0 && (
            <Pagination
              page={paginatedPayments.pagination.page}
              totalPages={paginatedPayments.pagination.totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
