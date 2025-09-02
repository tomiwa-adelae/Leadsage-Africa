import { getUncompletedApplications } from "@/app/data/admin/application/get-uncompleted-applications";
import { EmptyState } from "@/components/EmptyState";
import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { ApplicationsTable } from "../../_components/ApplicationsTable";
import { ApplicationsList } from "../../_components/ApplicationsList";

const page = async () => {
  const uncompletedApplications = await getUncompletedApplications();

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold">
              Uncompleted applications
            </h1>
            <p className="text-muted-foreground text-base mt-2.5">
              Manage all uncompleted applications
            </p>
          </div>
        </div>
        {uncompletedApplications.length === 0 && (
          <EmptyState
            title={"No applications"}
            description={"There are no uncompleted applications yet"}
          />
        )}
        {uncompletedApplications.length !== 0 && (
          <div className="mt-2.5">
            <ApplicationsTable applications={uncompletedApplications} />
            <ApplicationsList applications={uncompletedApplications} />
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
