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
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import RestoreAnimation from "@/public/assets/animations/payment.json";
import { useRef, useState, useTransition } from "react";
import { Loader } from "@/components/Loader";
import { tryCatch } from "@/hooks/use-try-catch";
import { toast } from "sonner";
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
  const { triggerConfetti } = useConfetti();

  const [gateway, setGateway] = useState<"paystack" | "interswitch">(
    "paystack"
  );
  const [pending, startTransition] = useTransition();

  const amount =
    Number(removeCommas(lease.Listing.price)) +
    Number(removeCommas(lease.Listing.securityDeposit));

  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email: user.email,
    amount: amount * 100, // convert to kobo
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

  const initializePayment = usePaystackPayment(paystackConfig);

  const handleSuccess = (reference: any) => {
    startTransition(async () => {
      toast.loading("Saving payment...");
      const { data: result, error } = await tryCatch(
        markLeaseAsPaid(
          lease.id,
          formatMoneyInput(amount),
          reference.trxref,
          reference.transaction,
          reference.reference,
          reference.status === "success" ? "SUCCESS" : "FAILED",
          "Online Payment"
        )
      );

      toast.dismiss();

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
    });
  };

  const handlePayment = () => {
    closeModal();

    if (gateway === "paystack") {
      initializePayment({
        onSuccess: handleSuccess,
        onClose: () => console.log("Paystack closed"),
      });
    }

    if (gateway === "interswitch") {
      closeModal();
      startTransition(async () => {
        await handleInterswitchPayment();
      });
    }
  };

  const handleInterswitchPayment = async () => {
    toast.loading("Connecting to Interswitch...");

    const res = await fetch("/api/payments/interswitch/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leaseId: lease.id,
        amount,
      }),
    });

    toast.dismiss();

    const data = await res.json();
    if (!data?.params) {
      toast.error("Failed to start Interswitch test payment");
      return;
    }

    // Load inline checkout script dynamically
    const script = document.createElement("script");
    script.src = "https://newwebpay.qa.interswitchng.com/inline-checkout.js";
    script.onload = () => {
      const paymentRequest = {
        ...data.params,
        onComplete: async (response: any) => {
          toast.loading("Saving payment...");

          // Only consider successful payments
          if (response.resp === "00") {
            const { data: result, error } = await tryCatch(
              markLeaseAsPaid(
                lease.id,
                formatMoneyInput(amount),
                response.txnref, // txn reference from Interswitch
                response.payRef, // payRef
                response.retRef, // retRef
                "SUCCESS", // status
                "Online Payment" // method
              )
            );

            toast.dismiss();

            if (error) {
              toast.error(error.message);
              router.push(`/leases/payment-failed?ref=${response.txnref}`);
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
              router.push(`/leases/payment-failed?ref=${response.txnref}`);
            }
          } else {
            toast.dismiss();
            toast.error(response.desc || "Payment failed");
            router.push(`/leases/payment-failed?ref=${response.txnref}`);
          }
        },
      };

      // @ts-ignore
      window.webpayCheckout(paymentRequest);
    };
    document.body.appendChild(script);
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
            Great news! Your landlord has signed the lease for{" "}
            {lease.Listing.address}, {lease.Listing.city}, {lease.Listing.state}
            . Please make your payment to complete the process.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex flex-col gap-2 sm:flex-row">
          <div className="flex flex-col gap-2 w-full">
            <AlertDialogCancel
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                closeModal();
              }}
              disabled={pending}
            >
              Cancel
            </AlertDialogCancel>
            <Button
              variant={gateway === "paystack" ? "default" : "outline"}
              onClick={() => {
                setGateway("paystack");
                handlePayment();
              }}
            >
              Pay with Paystack
            </Button>

            <Button
              variant={gateway === "interswitch" ? "default" : "outline"}
              onClick={() => {
                setGateway("interswitch");
                handlePayment();
              }}
            >
              Pay with Interswitch
            </Button>

            {/* <Button onClick={handlePayment} disabled={pending}>
              {pending ? (
                <Loader text="Processing..." />
              ) : (
                `Pay ₦${formatMoneyInput(amount)} via ${gateway}`
              )}
            </Button> */}
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
      <Confetti />
    </AlertDialog>
  );
}
