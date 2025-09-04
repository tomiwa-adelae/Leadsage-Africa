"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import RestoreAnimation from "@/public/assets/animations/delete-animation.json";
import { useRef, useTransition } from "react";
import { Loader } from "@/components/Loader";
import { tryCatch } from "@/hooks/use-try-catch";
import { toast } from "sonner";
import { applyForListing, cancelBooking } from "../bookings/[id]/actions";
import { useRouter } from "next/navigation";
import { Confetti } from "@/components/Confetti";
import { GetLeaseDetailsType } from "@/app/data/user/lease/get-lease-details";
import { usePaystackPayment } from "react-paystack";
import { env } from "@/lib/env";
import { GetUserInfoType } from "@/app/data/user/get-user-info";
import { formatMoneyInput, removeCommas } from "@/lib/utils";
import { useConfetti } from "@/hooks/use-confetti";
import { markLeaseAsPaid } from "../actions";

export function MakePaymentModal({
  open,
  closeModal,
  lease,
  user,
}: {
  open: boolean;
  closeModal: () => void;
  lease: GetLeaseDetailsType;
  user: GetUserInfoType;
}) {
  const router = useRouter();
  const animationRef = useRef<LottieRefCurrentProps>(null);

  const [pending, startTransition] = useTransition();

  const amount =
    (Number(removeCommas(lease.Listing.price)) +
      Number(removeCommas(lease.Listing.securityDeposit))) *
    100;

  const config = {
    reference: new Date().getTime().toString(),
    email: user.email,
    // amount: Number(removeCommas(lease.Listing.price)) * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    amount: 10000, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: env.NEXT_PUBLIC_PS_PUBLIC_KEY,
    metadata: {
      name: user.name,
      custom_fields: [
        {
          display_name: "Full Name",
          variable_name: "full_name",
          value: user.name,
        },
        {
          display_name: "Phone Number",
          variable_name: "phone_number",
          value: user.phoneNumber,
        },
      ],
    },
  };
  const initializePayment = usePaystackPayment(config);
  const { triggerConfetti } = useConfetti();

  const handlePayment = () => {
    closeModal();
    initializePayment({
      onSuccess: (reference) => {
        console.log(reference);
        startTransition(async () => {
          toast.loading("Saving payment...");
          const { data: result, error } = await tryCatch(
            markLeaseAsPaid(
              lease.id,
              formatMoneyInput(
                Number(removeCommas(lease.Listing.price)) +
                  Number(removeCommas(lease.Listing.securityDeposit))
              ),
              reference.trxref,
              reference.transaction,
              reference.reference,
              reference.status === "success" ? "SUCCESS" : "FAILED",
              "Online Payment"
            )
          );

          if (error) {
            toast.error(error.message);
            return;
          }

          if (result.status === "success") {
            toast.success(result.message);
            triggerConfetti();
            router.push(
              `/leases/${lease.leaseId}/payments/success?id=${result?.payment?.id}`
            );
          } else {
            toast.error(result.message);
          }
          toast.dismiss();
        });
      },
      onClose: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={closeModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center justify-center">
            <div className="h-60 w-60">
              <Lottie
                lottieRef={animationRef}
                animationData={RestoreAnimation}
              />
            </div>
          </div>
          <AlertDialogTitle className="text-center">
            Landlord has signed the lease agreement
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Great news! Your landlord has signed the lease agreement for{" "}
            {lease.Listing.address}, {lease.Listing.city}, {lease.Listing.state}
            , {lease.Listing.country}. To complete your move-in process, please
            make your first payment and confirm your move-in date.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div></div>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={(e) => {
              e.preventDefault(); // stops the Link from navigating
              e.stopPropagation();
              closeModal();
            }}
            disabled={pending}
          >
            Cancel
          </AlertDialogCancel>
          <Button
            size="md"
            onClick={(e) => {
              e.preventDefault(); // stops the Link from navigating
              e.stopPropagation();
              handlePayment();
            }}
            disabled={pending}
          >
            {pending ? (
              <Loader text="Paying..." />
            ) : (
              `Pay now ₦${formatMoneyInput(
                Number(removeCommas(lease.Listing.price)) +
                  Number(removeCommas(lease.Listing.securityDeposit))
              )}`
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
      <Confetti />
    </AlertDialog>
  );
}
