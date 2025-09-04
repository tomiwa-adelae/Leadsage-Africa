import { SiteHeader } from "@/components/sidebar/site-header";
import { EmptyState } from "@/components/EmptyState";

import { getAllPayments } from "@/app/data/admin/payment/get-all-payments";
import { getPendingPayments } from "@/app/data/admin/payment/get-pending-payments";
import { getSuccessfulPayments } from "@/app/data/admin/payment/get-successful-payments";
import { getFailedPayments } from "@/app/data/admin/payment/get-failed-payments";
import { PaymentsTable } from "../_components/PaymentsTable";
import { PaymentsList } from "../_components/PaymentsList";
import { PaymentsCards } from "../_components/PaymentsCards";

const page = async () => {
  const payments = await getAllPayments();
  const pendingPayments = await getPendingPayments();
  const successfulPayments = await getSuccessfulPayments();
  const failedPayments = await getFailedPayments();
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
            pendingPayments={pendingPayments}
            successfulPayments={successfulPayments}
            failedPayments={failedPayments}
            payments={payments}
          />
          <h3 className="font-medium text-lg mb-1.5">Payments</h3>
          {payments.length === 0 && (
            <EmptyState
              title={"No payments"}
              description={
                "There are no payments at this moment! They would appear here once you do"
              }
            />
          )}
          {payments.length !== 0 && (
            <div className="mt-2.5">
              <PaymentsTable payments={payments} />
              <PaymentsList payments={payments} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
