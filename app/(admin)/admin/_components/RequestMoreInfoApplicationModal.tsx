"use client";
import { X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRef, useTransition } from "react";
import { tryCatch } from "@/hooks/use-try-catch";
import {
  rejectApplication,
  rejectListing,
  requestMoreInformationApplication,
} from "../actions";
import { toast } from "sonner";
import { Loader } from "@/components/Loader";
import {
  rejectApplicationFormSchema,
  RejectApplicationFormSchemaType,
  rejectListingFormSchema,
  RejectListingFormSchemaType,
  requestMoreInfoApplicationFormSchema,
  RequestMoreInfoApplicationFormSchemaType,
} from "@/lib/zodSchemas";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import RestoreAnimation from "@/public/assets/animations/delete-animation.json";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  id: string;
  open: boolean;
  closeModal: () => void;
}

export const RequestMoreInfoApplicationModal = ({
  id,
  open,
  closeModal,
}: Props) => {
  const animationRef = useRef<LottieRefCurrentProps>(null);
  const [pending, startPending] = useTransition();

  const form = useForm<RequestMoreInfoApplicationFormSchemaType>({
    resolver: zodResolver(requestMoreInfoApplicationFormSchema),
  });

  function onSubmit(data: RequestMoreInfoApplicationFormSchemaType) {
    startPending(async () => {
      const { data: result, error } = await tryCatch(
        requestMoreInformationApplication(id, data)
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
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DialogHeader>
          <div className="flex items-center justify-center">
            <div className="h-60 w-60">
              <Lottie
                lottieRef={animationRef}
                animationData={RestoreAnimation}
              />
            </div>
          </div>
          <DialogTitle className="text-center container mb-4">
            Need more information?
          </DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="container space-y-4">
                <FormField
                  control={form.control}
                  name="additionalInformation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="py-4 pt-0">
                  <Button
                    onClick={closeModal}
                    type="button"
                    variant={"ghost"}
                    size={"md"}
                    disabled={pending}
                  >
                    Close
                  </Button>
                  <Button disabled={pending} type="submit" size={"md"}>
                    {pending ? (
                      <Loader text="Requesting..." />
                    ) : (
                      "Yes, request it"
                    )}
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
