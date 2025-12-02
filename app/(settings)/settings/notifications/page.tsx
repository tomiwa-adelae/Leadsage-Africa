import { SiteHeader } from "@/components/sidebar/site-header";
import { BookingBox } from "./_components/BookingBox";
import { getUserInfo } from "@/app/data/user/get-user-info";
import { ListingBox } from "./_components/ListingBox";
import { PromotionalBox } from "./_components/PromotionalBox";
import { AccountBox } from "./_components/AccountBox";

import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Notifications | Leadsage",
};

const page = async () => {
  const user = await getUserInfo();
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6 space-y-4">
        <PageHeader title={"Notifications"} />
        <div className="space-y-1">
          <BookingBox value={user.bookingNotifications} />
          <ListingBox value={user.listingNotifications} />
          <PromotionalBox value={user.promotionalNotifications} />
          <AccountBox value={user.accountNotifications} />
        </div>
      </div>
    </div>
  );
};

export default page;
