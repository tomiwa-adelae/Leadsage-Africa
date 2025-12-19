import { ContactLandlordButton } from "@/components/messaging";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { IconKey, IconMapPin2, IconWifi } from "@tabler/icons-react";
import React from "react";

export const CheckInModal = ({
  open,
  closeModal,
  address,
  checkInDate,
  instructions,
  wifiPassword,
  wifiName,
  shortletDetails,
}: {
  open: boolean;
  closeModal: () => void;
  address: string;
  checkInDate: Date;
  instructions: string | null;
  wifiPassword: string | null;
  wifiName: string | null;
  shortletDetails: any;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={closeModal}>
      <AlertDialogContent className=" w-full overflow-hidden max-h-[70vh] max-w-[90vw] sm:max-w-xl sm:max-h-[min(640px,80vh)] flex flex-col">
        <AlertDialogHeader>
          <AlertDialogTitle>Your check-in details</AlertDialogTitle>
          <AlertDialogDescription>
            {formatDate(checkInDate)} after 2:00 PM
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="overflow-y-auto custom-scroll p-2 w-full flex-1">
          <div className="space-y-2">
            <Card className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all">
              <CardContent className="px-0 flex items-center justify-start gap-2">
                <div className="p-4 inline-block bg-muted text-primary rounded-md">
                  <IconMapPin2 />
                </div>
                <div className="space-y-1">
                  <CardTitle>Getting there</CardTitle>
                  <CardDescription>{address}</CardDescription>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all">
              <CardContent className="px-0 flex items-start justify-start gap-2">
                <div className="p-4 inline-block bg-muted text-primary rounded-md">
                  <IconKey />
                </div>
                <div className="space-y-1">
                  <CardTitle>How to get inside</CardTitle>
                  <CardDescription>{instructions}</CardDescription>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all">
              <CardContent className="px-0 flex items-center justify-start gap-2">
                <div className="p-4 inline-block bg-muted text-primary rounded-md">
                  <IconWifi />
                </div>
                <div className="space-y-1">
                  <CardTitle>Wifi Info</CardTitle>
                  <CardDescription>
                    <p>Network: {wifiName}</p>
                    <p>Password: {wifiPassword}</p>
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <AlertDialogFooter className="flex flex-col gap-2 sm:flex-row">
          <AlertDialogCancel
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              closeModal();
            }}
            //   disabled={pending}
          >
            Cancel
          </AlertDialogCancel>
          {
            <ContactLandlordButton
              landlordId={shortletDetails.Listing.User.id}
              listingId={shortletDetails.Listing.id || ""}
              listingTitle={shortletDetails.Listing.title || undefined}
              buttonName="Message Host"
            />
          }
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
