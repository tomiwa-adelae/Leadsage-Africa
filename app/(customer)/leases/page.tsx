import { getMyLeases } from "@/app/data/user/lease/get-my-leases";
import { EmptyState } from "@/components/EmptyState";
import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { LeasesTable } from "../_components/LeasesTable";

const page = async () => {
  const leases = await getMyLeases();

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold">
            My leases & Agreements
          </h1>
          <p className="text-muted-foreground text-base mt-2.5">
            Manage and view all your leases and agreements from here
          </p>
        </div>
        {leases.length === 0 && (
          <EmptyState
            title={"No bookings"}
            description={
              "You have no bookings yet! They would appear here once you do"
            }
          />
        )}
        {leases.length !== 0 && (
          <div className="mt-2.5">
            <LeasesTable leases={leases} />
            {/* <BookingsList leases={leases} /> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
