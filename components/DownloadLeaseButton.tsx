"use client";
import { Button } from "@/components/ui/button";
import { IconDownload } from "@tabler/icons-react";
import { Loader } from "./Loader";
import { GetLeaseDetailsType } from "@/app/data/admin/lease/get-lease";
import { useDownloadLease } from "@/hooks/use-download-lease";

interface Props {
  lease: GetLeaseDetailsType;
}

export const DownloadLeaseButton = ({ lease }: Props) => {
  const { isGenerating, handleDownload } = useDownloadLease({
    leaseId: lease.leaseId,
    createdAt: lease.createdAt,
    landlordName: lease.Listing.User.name,
    landlordAddress: lease.Listing.User.address!,
    tenantName: lease.User.name,
    tenantEmail: lease.User.email,
    tenantPhoneNumber: lease.User.phoneNumber!,
    propertyAddress: `${lease.Listing.address}, ${lease.Listing.city}, ${lease.Listing.state}, ${lease.Listing.country}`,
    propertyCategory: lease.Listing.Category.name,
    startDate: lease.startDate,
    endDate: lease.endDate,
    duration: lease.Listing.paymentFrequency!,
    price: lease.Listing.price!,
    paymentFrequency: lease.Listing.paymentFrequency!,
    securityDeposit: lease.Listing.securityDeposit!,
    petRule:
      lease.Listing.petPolicy === "yes"
        ? "Pets are allowed"
        : "No pets allowed",
    smokingRule:
      lease.Listing.smokingPolicy === "yes"
        ? "Smoking is allowed"
        : "No smoking allowed",
    partyRule:
      lease.Listing.partyPolicy === "yes"
        ? "Parties are allowed"
        : "No parties allowed",
    additionalRule: lease.Listing.additionalPolicies,
    moveInDate: lease.moveInDate,
    tenantSignature: lease.tenantSignature,
    landlordSignature: lease.landlordSignature,
  });

  return (
    <div className="space-y-3 flex justify-end w-full md:w-auto">
      <Button
        size="md"
        className="w-full sm:w-auto"
        onClick={handleDownload}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <Loader text="Downloading..." />
        ) : (
          <>
            <IconDownload />
            <span className="sm:hidden md:inline-block">
              Download Lease PDF
            </span>
          </>
        )}
      </Button>
    </div>
  );
};
