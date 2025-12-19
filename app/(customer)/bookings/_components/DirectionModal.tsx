import { ContactLandlordButton } from "@/components/messaging";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React from "react";

export const DirectionModal = ({
  open,
  closeModal,
  address,
  additionalDirections,
  shortletDetails,
}: {
  open: boolean;
  closeModal: () => void;
  address: string;
  additionalDirections: string | null;
  shortletDetails: any;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={closeModal}>
      <AlertDialogContent className=" w-full overflow-hidden max-h-[70vh] max-w-[90vw] sm:max-w-xl sm:max-h-[min(640px,80vh)] flex flex-col">
        <AlertDialogHeader>
          <AlertDialogTitle>Getting there</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="overflow-y-auto custom-scroll p-2 w-full flex-1">
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">Address location:</span> {address}
            </p>
            <p>
              <span className="font-semibold">Additional Information:</span>{" "}
              {additionalDirections}
            </p>
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
