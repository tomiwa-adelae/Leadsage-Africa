import { getListingDetails } from "@/app/data/listing/get-listing-details";
import { SiteHeader } from "@/components/sidebar/site-header";
import React from "react";
import { getApplication } from "@/app/data/user/application/get-application";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUserInfo } from "@/app/data/user/get-user-info";
import { Separator } from "@/components/ui/separator";
import { formatPhoneNumber } from "@/lib/utils";
import { NairaIcon } from "@/components/NairaIcon";
import { TermsAndAgreements } from "../../_components/TermsAndAgreements";

type Params = Promise<{
  slug: string;
  id: string;
}>;

const page = async ({ params }: { params: Params }) => {
  const { slug, id } = await params;

  const listing = await getListingDetails(slug);
  const application = await getApplication(id);
  const user = await getUserInfo();

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-medium">
            Application for {listing.title}
          </h1>
          <p className="text-muted-foreground text-base mt-2.5">
            Review your application to move forward with this property.
          </p>
        </div>

        <div className="mt-4 space-y-4">
          <Card>
            <CardHeader className="border-b flex items-center justify-between gap-4">
              <CardTitle>Personal Information</CardTitle>
              <Button size={"sm"} variant={"ghost"} asChild>
                <Link
                  href={`/listings/${listing.slug!}/application?id=${
                    application.id
                  }`}
                >
                  Edit
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 text-sm font-medium">
              <p>
                Name: <span className="text-muted-foreground">{user.name}</span>
              </p>
              <Separator />
              <p>
                Email:{" "}
                <a
                  href={`mailto:${user.email}`}
                  className="text-muted-foreground hover:text-primary hover:underline"
                >
                  {user.email}
                </a>
              </p>
              <Separator />
              <p>
                Phone number:{" "}
                <a
                  href={`tel:${user.phoneNumber}`}
                  className="text-muted-foreground hover:text-primary hover:underline"
                >
                  {formatPhoneNumber(user.phoneNumber)}
                </a>
              </p>
              <Separator />{" "}
              <p>
                Gender:{" "}
                <span className="text-muted-foreground">{user.gender}</span>
              </p>
              <Separator />{" "}
              <p>
                Current address:{" "}
                <span className="text-muted-foreground">{user.address}</span>
              </p>
              <Separator />{" "}
              <p>
                Current city:{" "}
                <span className="text-muted-foreground">{user.city}</span>
              </p>
              <Separator />{" "}
              <p>
                Current state:{" "}
                <span className="text-muted-foreground">{user.state}</span>
              </p>
              <Separator />{" "}
              <p>
                Current country:{" "}
                <span className="text-muted-foreground">{user.country}</span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="border-b flex items-center justify-between gap-4">
              <CardTitle>Emergency contact</CardTitle>
              <Button size={"sm"} variant={"ghost"} asChild>
                <Link
                  href={`/listings/${listing.slug!}/application?id=${
                    application.id
                  }`}
                >
                  Edit
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 text-sm font-medium">
              <p>
                Name:{" "}
                <span className="text-muted-foreground">
                  {user.emergencyName}
                </span>
              </p>
              <Separator />
              <p>
                Email:{" "}
                <a
                  href={`mailto:${user.emergencyEmail}`}
                  className="text-muted-foreground hover:text-primary hover:underline"
                >
                  {user.emergencyEmail}
                </a>
              </p>
              <Separator />
              <p>
                Phone number:{" "}
                <a
                  href={`tel:${user.emergencyPhoneNumber}`}
                  className="text-muted-foreground hover:text-primary hover:underline"
                >
                  {formatPhoneNumber(user.emergencyPhoneNumber)}
                </a>
              </p>
              <Separator />{" "}
              <p>
                Relationship:{" "}
                <span className="text-muted-foreground">
                  {user.emergencyRelationship}
                </span>
              </p>
              <Separator />{" "}
              <p>
                Preferred language:{" "}
                <span className="text-muted-foreground">
                  {user.emergencyLanguage}
                </span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="border-b flex items-center justify-between gap-4">
              <CardTitle>Employment & Income</CardTitle>
              <Button size={"sm"} variant={"ghost"} asChild>
                <Link
                  href={`/listings/${listing.slug!}/application/id=${
                    application.id
                  }/employment`}
                >
                  Edit
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 text-sm font-medium">
              <p>
                Employment status:{" "}
                <span className="text-muted-foreground">
                  {application.employmentStatus}
                </span>
              </p>
              <Separator />
              {application.employmentStatus !== "Student" &&
                application.employmentStatus !== "Unemployed" && (
                  <>
                    <p>
                      Job title:{" "}
                      <span className="text-muted-foreground">
                        {application.jobTitle}
                      </span>
                    </p>
                    <Separator />
                    <p>
                      Employer's name:{" "}
                      <span className="text-muted-foreground">
                        {application.employerName}
                      </span>
                    </p>
                    <Separator />
                    <p>
                      Employer's email:{" "}
                      <a
                        href={`mailto:${application.employerEmail}`}
                        className="text-muted-foreground hover:text-primary hover:underline"
                      >
                        {application.employerEmail}
                      </a>
                    </p>
                    <Separator />
                    <p>
                      Employer's phone number:{" "}
                      <a
                        href={`tel:${application.employerPhoneNumber}`}
                        className="text-muted-foreground hover:text-primary hover:underline"
                      >
                        {formatPhoneNumber(application.employerPhoneNumber)}
                      </a>
                    </p>
                    <Separator />{" "}
                  </>
                )}
              {application.monthlyIncome && (
                <p>
                  Monthly income:{" "}
                  <span className="text-muted-foreground">
                    <NairaIcon />
                    {application.monthlyIncome}
                  </span>
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="border-b flex items-center justify-between gap-4">
              <CardTitle>Rental History</CardTitle>
              <Button size={"sm"} variant={"ghost"} asChild>
                <Link
                  href={`/listings/${listing.slug!}/application/id=${
                    application.id
                  }/rental-history`}
                >
                  Edit
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 text-sm font-medium">
              {!application.currentLandlordEmail &&
                !application.currentLandlordName &&
                !application.currentLandlordPhoneNumber &&
                !application.reasonsForMoving && (
                  <p className="italic text-muted-foreground">
                    Nothing to show
                  </p>
                )}
              {application.currentLandlordName && (
                <>
                  <p>
                    Landlord's name:{" "}
                    <span className="text-muted-foreground">
                      {application.currentLandlordName}
                    </span>
                  </p>
                  <Separator />
                </>
              )}
              {application.currentLandlordEmail && (
                <>
                  <p>
                    Landlord's email:{" "}
                    <a
                      href={`mailto:${application.currentLandlordEmail}`}
                      className="text-muted-foreground"
                    >
                      {application.currentLandlordEmail}
                    </a>
                  </p>
                  <Separator />
                </>
              )}
              {application.currentLandlordPhoneNumber && (
                <>
                  <p>
                    Landlord's email:{" "}
                    <a
                      href={`tel:${application.currentLandlordPhoneNumber}`}
                      className="text-muted-foreground"
                    >
                      {formatPhoneNumber(
                        application.currentLandlordPhoneNumber
                      )}
                    </a>
                  </p>
                  <Separator />
                </>
              )}
              {application.reasonsForMoving && (
                <p>
                  Reasons for moving:{" "}
                  <span className="text-muted-foreground">
                    {application.reasonsForMoving}
                  </span>
                </p>
              )}
            </CardContent>
          </Card>
          <TermsAndAgreements
            applicationId={application.id}
            data={application}
            slug={slug}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
