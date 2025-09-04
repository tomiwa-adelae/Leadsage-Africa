import { EmptyState } from "@/components/EmptyState";
import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { PaymentsTable } from "../_components/PaymentsTable";
import { getMyPayments } from "@/app/data/user/payment/get-my-payments";
import { PaymentsList } from "../_components/PaymentsList";

const page = async () => {
  const payments = await getMyPayments();
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold">My payments</h1>
          <p className="text-muted-foreground text-base mt-2.5">
            Manage and view all your payments from here
          </p>
        </div>
        {payments.length === 0 && (
          <EmptyState
            title={"No payments"}
            description={
              "You have not made any payments yet! They would appear here once you do"
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
  );
};

export default page;
