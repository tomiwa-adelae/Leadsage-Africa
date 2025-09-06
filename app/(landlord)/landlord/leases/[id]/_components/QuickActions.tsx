"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeaseStatus } from "@/lib/generated/prisma";
import { IconContract, IconDownload } from "@tabler/icons-react";
import SignaturePad from "react-signature-canvas";
import React, { useRef, useState } from "react";
import { Mail } from "lucide-react";
import { useDownloadLease } from "@/hooks/use-download-lease";
import { GetLeaseDetailsType } from "@/app/data/user/lease/get-lease-details";
import { SignLeaseModal } from "../../../_components/SignLeaseModal";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Props {
  landlordSignature: string | null;
  id: string;
  status: LeaseStatus;
  lease: GetLeaseDetailsType;
}

export const QuickActions = ({
  landlordSignature,
  id,
  status,
  lease,
}: Props) => {
  const [openSignLeaseModal, setOpenSignLeaseModal] = useState(false);

  const [signature, setSignature] = useState(null); // create a state that will contain our image url
  const [isEmpty, setIsEmpty] = useState(true);

  const sigCanvas = useRef<any>({});

  const clear = () => {
    setSignature(null);
    sigCanvas.current.clear();
    setIsEmpty(true); // reset empty state
  };

  const save = () => {
    if (!sigCanvas.current.isEmpty()) {
      setSignature(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
      setIsEmpty(false);
    }
  };

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
    <>
      <Card className="@container/card gap-0">
        <CardHeader className="border-b">
          <CardTitle>Signatures</CardTitle>
        </CardHeader>
        <CardContent className="mt-4 space-y-3 text-sm font-medium grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-muted-foreground text-base mt-4">
              Tenant's Signature
            </p>
            <div className="border-2 max-w-[200px] rounded-lg border-dashed mt-2.5">
              <Image
                src={lease.tenantSignature}
                alt="Tenant's signature"
                width={200}
                height={200}
                className="aspect-auto object-cover"
              />
            </div>
          </div>
          <div>
            <p className="text-muted-foreground text-base mt-4">
              Landlord's Signature
            </p>
            {lease.landlordSignature ? (
              <div className="border-2 w-fit rounded-lg border-dashed">
                <Image
                  src={lease.landlordSignature}
                  alt="Landlord's signature"
                  width={200}
                  height={200}
                  className="aspect-auto object-cover"
                />
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-muted-foreground">Sign here</p>
                <div className="border-2 w-[200px] h-[200px] overflow-hidden rounded-lg border-dashed">
                  {signature && (
                    <Image
                      src={signature}
                      alt="my signature"
                      width={200}
                      height={200}
                      className=" aspect-auto object-cover"
                    />
                  )}

                  {!signature && (
                    <SignaturePad
                      ref={sigCanvas}
                      onEnd={() => setIsEmpty(sigCanvas.current.isEmpty())} // check if user signed
                      canvasProps={{
                        className: "signatureCanvas",
                      }}
                    />
                  )}
                </div>
                <div className="mt-4 flex items-center justify-start gap-2">
                  <Button
                    disabled={isEmpty}
                    size="md"
                    variant={"outline"}
                    onClick={clear}
                  >
                    Clear
                  </Button>
                  <Button disabled={isEmpty} size="md" onClick={save}>
                    Save
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="@container/card gap-0">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="mt-2.5 grid gap-4">
          {signature && !landlordSignature && (
            <div
              onClick={() => setOpenSignLeaseModal(true)}
              className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
            >
              <div className="p-2.5 inline-block bg-green-600/20 dark:bg-green-600/70 text-green-600 dark:text-white rounded-lg">
                <IconContract className="size-4" />
              </div>
              Sign lease
            </div>
          )}
          <div
            onClick={handleDownload}
            className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm"
          >
            <div className="p-2.5 inline-block bg-purple-600/20 dark:bg-purple-600/70 text-purple-600 dark:text-white rounded-lg">
              <IconDownload className="size-4" />
            </div>
            {isGenerating ? "Downloading..." : "Download Lease Agreement"}
          </div>
          <div className="w-full flex items-center justify-start gap-2 cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground dark:bg-accent dark:hover:bg-accent/50 font-medium h-12 px-2 transition-all text-xs lg:text-sm">
            <div className="p-2.5 inline-block bg-blue-600/20 dark:bg-blue-600/70 text-blue-600 dark:text-white rounded-lg">
              <Mail className="size-4" />
            </div>
            Message Tenant
          </div>
        </CardContent>

        {openSignLeaseModal && signature && (
          <SignLeaseModal
            open={openSignLeaseModal}
            closeModal={() => setOpenSignLeaseModal(false)}
            id={id}
            signature={signature}
          />
        )}
      </Card>
    </>
  );
};
