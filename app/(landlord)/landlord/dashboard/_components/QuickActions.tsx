import { Calendar, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

export const QuickActions = () => {
  return (
    <div>
      <h3 className="font-medium text-lg">Quick actions</h3>
      <div className="mt-2.5 grid grid-cols-1 md:grid-cols-2 gap-2">
        <Link
          href="/landlord/listings/new"
          className="flex items-center justify-start gap-2.5 hover:bg-muted p-2 rounded-md transition-all"
        >
          <div className="p-2.5 inline-block bg-blue-600/20 dark:bg-blue-600/70 text-blue-600 dark:text-white rounded-full">
            <Plus className="size-5" />
          </div>
          <p className="text-sm font-medium">Create new listing</p>
        </Link>
        <Link
          href="/landlord/bookings"
          className="flex items-center justify-start gap-2.5 hover:bg-muted p-2 rounded-md transition-all"
        >
          <div className="p-2.5 inline-block bg-purple-400/20 dark:bg-purple-400/70 text-purple-400 dark:text-white rounded-full">
            <Calendar className="size-5" />
          </div>
          <p className="text-sm font-medium">Manage bookings</p>
        </Link>
      </div>
    </div>
  );
};
