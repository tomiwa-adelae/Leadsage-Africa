import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { NotificationBox } from "./_components/NotificationBox";
import { EmptyState } from "@/components/EmptyState";
import { getNotifications } from "@/app/data/notification/get-notifications";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My notifications | Leadsage",
};

const page = async () => {
  const notifications = await getNotifications();

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <h1 className="text-3xl md:text-4xl font-medium">Notifications</h1>
        <p className="text-muted-foreground text-base mt-2.5">
          Stay updated with your latest activities and messages
        </p>
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
