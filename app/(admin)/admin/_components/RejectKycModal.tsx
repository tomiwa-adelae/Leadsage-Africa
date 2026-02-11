"use client";
import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { rejectKyc } from "../actions";
import { toast } from "sonner";

export const RejectKycModal = ({
  kycId,
  open,
  closeModal,
}: {
  kycId: string;
  open: boolean;
  closeModal: () => void;
}) => {
  const [reason, setReason] = useState("");
  const [pending, startTransition] = useTransition();

  const handleReject = () => {
    if (!reason) return toast.error("Please provide a reason for rejection");
    startTransition(async () => {
      const result = await rejectKyc(kycId, reason);
      if (result.status === "success") {
        toast.success(result.message);
        closeModal();
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={closeModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject KYC Documents</AlertDialogTitle>
          <p className="text-sm text-muted-foreground">
            Explain to the user why their ID was rejected (e.g., "Image too
            blurry").
          </p>
        </AlertDialogHeader>
        <Textarea
          placeholder="Reason for rejection..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="my-4"
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={pending}
          >
            Confirm Rejection
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
