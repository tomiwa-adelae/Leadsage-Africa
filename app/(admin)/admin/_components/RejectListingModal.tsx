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
import { useTransition } from "react";
import { tryCatch } from "@/hooks/use-try-catch";
import { rejectListing } from "../actions";
import { toast } from "sonner";
import { Loader } from "@/components/Loader";
import {
  rejectListingFormSchema,
  RejectListingFormSchemaType,
} from "@/lib/zodSchemas";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Props {
  listingId: string;
  open: boolean;
  closeModal: () => void;
}

export const RejectListingModal = ({ listingId, open, closeModal }: Props) => {
  const [pending, startPending] = useTransition();

  const form = useForm<RejectListingFormSchemaType>({
    resolver: zodResolver(rejectListingFormSchema),
  });

  function onSubmit(data: RejectListingFormSchemaType) {
    startPending(async () => {
      const { data: result, error } = await tryCatch(
        rejectListing(listingId, data)
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
      <DialogContent>
        <div>
          <div className="py-4 container flex items-center justify-center">
            <Button
              disabled={pending}
              onClick={closeModal}
              size="icon"
              variant="ghost"
            >
              <X className="size-5" />
            </Button>
            <h5 className="flex-1 text-center font-medium text-base">
              Reject listing
            </h5>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="bg-accent/50 py-8 overflow-y-auto max-h-[55vh]">
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
                </div>
              </div>
              <footer
                className={cn(
                  "container py-4 bg-white dark:bg-dark flex items-center justify-end gap-4"
                )}
              >
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
                  {pending ? <Loader text="Rejecting..." /> : "Reject"}
                </Button>
              </footer>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
