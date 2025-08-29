"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreditCardIcon, WalletIcon } from "lucide-react";
import { usePaymentInputs } from "react-payment-inputs";
import images, { type CardImages } from "react-payment-inputs/images";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  addPaymentMethodFormSchema,
  AddPaymentMethodFormSchemaType,
} from "@/lib/zodSchemas";
import { useState, useTransition } from "react";
import { tryCatch } from "@/hooks/use-try-catch";
import { addPaymentMethod } from "../actions";
import { Loader } from "@/components/Loader";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];

export function AddPaymentMethod({
  variant = "default",
}: {
  variant?: ButtonVariant;
}) {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const {
    meta,
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
    getCardImageProps,
  } = usePaymentInputs();

  const form = useForm<AddPaymentMethodFormSchemaType>({
    resolver: zodResolver(addPaymentMethodFormSchema),
    defaultValues: {
      nameOnCard: "",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      default: false,
    },
  });

  function onSubmit(data: AddPaymentMethodFormSchemaType) {
    const cardType =
      meta.cardType?.displayName || meta.cardType?.type || "unknown";
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        addPaymentMethod(data, cardType)
      );
      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        setOpen(false); // Close the modal on success
        form.reset(); // Reset the form
        return;
      } else {
        toast.error(result.message);
        return;
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={"md"} className="z-50">
          Add payment method
        </Button>
      </DialogTrigger>
      <DialogContent className="p-6">
        <div className="flex flex-col gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <WalletIcon className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="text-left">Add card details</DialogTitle>
            <DialogDescription className="text-left">
              This card would be used for future payments
            </DialogDescription>
          </DialogHeader>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nameOnCard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of card</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...getCardNumberProps({
                          onChange: field.onChange,
                          value: field.value,
                          onBlur: field.onBlur,
                        })}
                        placeholder="0000 0000 0000 0000"
                        className="peer pe-9 [direction:inherit]"
                      />
                      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                        {meta.cardType ? (
                          <svg
                            className="overflow-hidden rounded-sm"
                            {...getCardImageProps({
                              images: images as unknown as CardImages,
                            })}
                            width={20}
                          />
                        ) : (
                          <CreditCardIcon size={16} aria-hidden="true" />
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Expiry date</FormLabel>
                    <FormControl>
                      <Input
                        {...getExpiryDateProps({
                          onChange: (e: any) => {
                            field.onChange(e.target.value);
                          },
                          onBlur: field.onBlur,
                        })}
                        value={field.value}
                        className="[direction:inherit]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cvc"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>CVC</FormLabel>
                    <FormControl>
                      <Input
                        {...getCVCProps({
                          onChange: (e: any) => {
                            field.onChange(e.target.value);
                          },
                          onBlur: field.onBlur,
                        })}
                        value={field.value}
                        className="[direction:inherit]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="default"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-muted-foreground font-normal">
                    Set as default payment method
                  </FormLabel>
                </FormItem>
              )}
            />
            <Button
              disabled={pending}
              size="md"
              className="w-full"
              type="submit"
            >
              {pending ? <Loader text="Saving..." /> : "Done"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
