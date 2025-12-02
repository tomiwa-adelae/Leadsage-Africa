import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { EmptyState } from "@/components/EmptyState";
import { getNotifications } from "@/app/data/notification/get-notifications";
import { NotificationBox } from "@/app/(customer)/notifications/_components/NotificationBox";

import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "My notifications | Leadsage",
};

const page = async () => {
  const notifications = await getNotifications();

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <PageHeader description={"Stay updated with your latest activities and messages"} title={"Notifications"} />
       
        <div className="mt-4 grid gap-1">
          {notifications.length === 0 && (
            <EmptyState
              title="No notifications yet"
              description="You’ve got a blank state (for now). We’ll let you know when updates arrive."
            />
          )}
          {notifications.map((notification) => (
            <NotificationBox
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
