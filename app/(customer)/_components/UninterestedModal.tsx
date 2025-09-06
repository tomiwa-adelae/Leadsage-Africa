"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import RestoreAnimation from "@/public/assets/animations/uninterested.json";
import { useRef, useTransition } from "react";
import { Loader } from "@/components/Loader";
import { tryCatch } from "@/hooks/use-try-catch";
import { uninterestedBooking } from "../bookings/[id]/actions";
import { useRouter } from "next/navigation";
import {
  uninterestedModalFormSchema,
  UninterestedModalFormSchemaType,
} from "@/lib/zodSchemas";
import { uninterestedReasons } from "@/constants";

export function UninterestedModal({
  open,
  closeModal,
  id,
  slug,
}: {
  open: boolean;
  closeModal: () => void;
  id: string;
  slug: string;
}) {
  const form = useForm<UninterestedModalFormSchemaType>({
    resolver: zodResolver(uninterestedModalFormSchema),
  });
  const router = useRouter();
  const animationRef = useRef<LottieRefCurrentProps>(null);

  const [pending, startPending] = useTransition();

  function onSubmit(data: UninterestedModalFormSchemaType) {
    startPending(async () => {
      const { data: result, error } = await tryCatch(
        uninterestedBooking(id, data)
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        closeModal();
      } else {
        toast.error(result.message);
      }
    });
  }

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
            Not Interested in this property?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            We’ll let the landlord know you’re not interested. Could you tell us
            why? (Your feedback helps improve listings and recommendations.)
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="reasons"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Feedback options</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col"
                    >
                      {uninterestedReasons.map((reason) => (
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value={reason} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {reason}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              <Button size="md" type="submit" disabled={pending}>
                {pending ? <Loader text="Submitting..." /> : "Confirm & Submit"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
