"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { approveKyc } from "../actions";
import { toast } from "sonner";
import { Loader } from "@/components/Loader";
import Lottie from "lottie-react";
import ApproveAnimation from "@/public/assets/animations/approve.json";

interface Props {
  kycId: string;
  open: boolean;
  closeModal: () => void;
}

export const ApproveKycModal = ({ kycId, open, closeModal }: Props) => {
  const [pending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveKyc(kycId);
      if (result.status === "success") {
        toast.success(result.message);
        closeModal();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={closeModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center justify-center h-40">
            <Lottie
              animationData={ApproveAnimation}
              loop={false}
              className="h-40"
            />
          </div>
          <AlertDialogTitle className="text-center">
            Confirm Identity Verification
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            This will verify the user's BVN and ID, and automatically generate
            their Anchor Bank Account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <Button onClick={handleApprove} disabled={pending}>
            {pending ? (
              <Loader text="Processing..." />
            ) : (
              "Approve & Create Wallet"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
