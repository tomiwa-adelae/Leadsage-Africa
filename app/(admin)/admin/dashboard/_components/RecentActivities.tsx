import { NotificationBox } from "@/app/(customer)/notifications/_components/NotificationBox";
import { GetNotificationsType } from "@/app/data/notification/get-notifications";
import { EmptyState } from "@/components/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface Props {
  notifications: GetNotificationsType[];
}

export const RecentActivities = ({ notifications }: Props) => {
  return (
    <Card className="@container/card gap-0">
      <CardHeader>
        <CardTitle>Recent activities</CardTitle>
      </CardHeader>
      <CardContent className="mt-2.5 grid gap-4">
        {notifications.length === 0 && (
          <EmptyState
            title="No notifications yet"
            description="You’ve got a blank state (for now). We’ll let you know when updates arrive."
          />
        )}
        {notifications.map((notification) => (
          <NotificationBox key={notification.id} notification={notification} />
        ))}
      </CardContent>
    </Card>
  );
};
