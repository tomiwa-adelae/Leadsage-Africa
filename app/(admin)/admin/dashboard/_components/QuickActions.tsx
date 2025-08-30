import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconBan } from "@tabler/icons-react";
import { Calendar, CircleCheckBig, Download, User } from "lucide-react";
import React from "react";

export const QuickActions = () => {
  return (
    <Card className="@container/card gap-0">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="mt-2.5 grid gap-4">
        <div className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm">
          <div className="p-2.5 inline-block bg-blue-600/20 dark:bg-blue-600/70 text-blue-600 dark:text-white rounded-lg">
            <CircleCheckBig className="size-4" />
          </div>
          Approve new listings
        </div>
        <div className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm">
          <div className="p-2.5 inline-block bg-green-600/20 dark:bg-green-600/70 text-green-600 dark:text-white rounded-lg">
            <Calendar className="size-4" />
          </div>
          Review pending bookings
        </div>
        <div className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm">
          <div className="p-2.5 inline-block bg-purple-600/20 dark:bg-purple-600/70 text-purple-600 dark:text-white rounded-lg">
            <IconBan className="size-4" />
          </div>
          Review flagged listings
        </div>
      </CardContent>
    </Card>
  );
};
