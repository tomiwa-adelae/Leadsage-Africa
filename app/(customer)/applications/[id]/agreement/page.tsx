import { ListingPhoto } from "@/app/(landlord)/landlord/bookings/_components/ListingPhoto";
import { getApplication } from "@/app/data/user/application/get-application";
import { SiteHeader } from "@/components/sidebar/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AgreementForm } from "./_components/AgreementForm";

type Params = Promise<{
  id: string;
}>;

const page = async ({ params }: { params: Params }) => {
  const { id } = await params;

  const application = await getApplication(id);

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold">
            Lease Agreement for {application.Listing.title}
          </h1>
          <p className="text-muted-foreground text-base mt-2.5">
            Your application has been approved! Complete these final steps to
            secure your new home. Please review the terms of your lease before
            signing
          </p>
        </div>
        <div className="mt-4 space-y-4">
          <Card className="@container/card gap-0">
            <CardHeader className="border-b">
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="mt-2.5 space-y-3 text-sm font-medium">
              <ListingPhoto photos={application.Listing.photos} />
              <p className="mt-4">
                Name:{" "}
                <span className="text-muted-foreground">
                  {application.Listing.title}
                </span>
              </p>
              <Separator />{" "}
              <p>
                Category:{" "}
                <span className="text-muted-foreground">
                  {application.Listing.Category.name}
                </span>
              </p>
              <Separator />{" "}
              <p>
                Location:{" "}
                <span className="text-muted-foreground">
                  {application.Listing.address}, {application.Listing.city},{" "}
                  {application.Listing.state}, {application.Listing.country}
                </span>
              </p>
              <Separator />
              <p>
                Landlord's name:{" "}
                <span className="text-muted-foreground">
                  {application.Listing.User.name}
                </span>
              </p>
            </CardContent>
          </Card>
          <AgreementForm application={application} />
        </div>
      </div>
    </div>
  );
};

export default page;
