"use client";
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
import { rejectApplication } from "../actions";
import { toast } from "sonner";
import { Loader } from "@/components/Loader";
import {
  rejectApplicationFormSchema,
  RejectApplicationFormSchemaType,
} from "@/lib/zodSchemas";
import { Textarea } from "@/components/ui/textarea";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import RestoreAnimation from "@/public/assets/animations/reject.json";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  id: string;
  open: boolean;
  closeModal: () => void;
}

export const RejectApplicationModal = ({ id, open, closeModal }: Props) => {
  const animationRef = useRef<LottieRefCurrentProps>(null);
  const [pending, startPending] = useTransition();

  const form = useForm<RejectApplicationFormSchemaType>({
    resolver: zodResolver(rejectApplicationFormSchema),
  });

  function onSubmit(data: RejectApplicationFormSchemaType) {
    startPending(async () => {
      const { data: result, error } = await tryCatch(
        rejectApplication(id, data)
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
            Oops! Are you sure you want to reject this application?
          </DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="container space-y-4">
                <FormField
                  control={form.control}
                  name="reasons"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reasons</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="pb-4 pt-0">
                  <Button
                    onClick={closeModal}
                    type="button"
                    variant={"ghost"}
                    size={"md"}
                    disabled={pending}
                  >
                    Close
                  </Button>
                  <Button
                    variant={"warning"}
                    disabled={pending}
                    type="submit"
                    size={"md"}
                  >
                    {pending ? (
                      <Loader text="Rejecting..." />
                    ) : (
                      "Yes, reject it"
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
