"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ResponsiveModal } from "@/components/ResponsiveModal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn, formatPhoneNumber } from "@/lib/utils";
import { X } from "lucide-react";
import React, { useState, useTransition } from "react";
import {
  editPhoneNumberFormSchema,
  EditPhoneNumberFormSchemaType,
} from "@/lib/zodSchemas";
import { tryCatch } from "@/hooks/use-try-catch";
import { Loader } from "@/components/Loader";
import { savePhoneNumber } from "../actions";
import * as RPNInput from "react-phone-number-input";
import {
  CountrySelect,
  FlagComponent,
  PhoneInput,
} from "@/components/PhoneNumberInput";

interface Props {
  phoneNumber: string | null;
}

export const PhoneNumberBox = ({ phoneNumber }: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [pending, startTransition] = useTransition();
  const form = useForm<EditPhoneNumberFormSchemaType>({
    resolver: zodResolver(editPhoneNumberFormSchema),
    defaultValues: {
      phoneNumber: phoneNumber || "",
    },
  });
  const handleCloseModal = () => {
    setOpenModal(false);
    form.reset();
  };
  function onSubmit(data: EditPhoneNumberFormSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(savePhoneNumber(data));

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        setOpenModal(false);
      } else {
        toast.error(result.message);
      }
    });
  }
  return (
    <div className="hover:bg-accent/50 transition-all border-b p-6 hover:rounded-md hover:border-transparent">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-medium">Phone number</p>
          <p className="text-sm text-muted-foreground">
            {phoneNumber ? (
              <a href={`tel:${phoneNumber}`}>
                {formatPhoneNumber(phoneNumber)}
              </a>
            ) : (
              <span className="italic">Not provided</span>
            )}
          </p>
        </div>
        <Button
          disabled={pending}
          onClick={() => setOpenModal(true)}
          size="md"
          variant={"ghost"}
        >
          {phoneNumber ? "Edit" : "Add"}
        </Button>
      </div>
      {openModal && (
        <ResponsiveModal open={openModal} closeModal={handleCloseModal}>
          <div>
            <div className="py-4 container flex items-center justify-center">
              <Button
                disabled={pending}
                onClick={handleCloseModal}
                size="icon"
                variant="ghost"
              >
                <X className="size-5" />
              </Button>
              <h5 className="flex-1 text-center font-medium text-base">
                Change phone number
              </h5>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="">
                <div className="bg-accent/50 py-8">
                  <div className="container">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone number</FormLabel>
                          <FormControl>
                            <RPNInput.default
                              className="flex rounded-md shadow-xs"
                              international
                              flagComponent={FlagComponent}
                              countrySelectComponent={CountrySelect}
                              inputComponent={PhoneInput}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                            />
                          </FormControl>
                          <FormDescription>
                            Contact number (for confirmed touring and Leadsage
                            Africa to get in touch).
                          </FormDescription>
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
                    onClick={handleCloseModal}
                    type="button"
                    variant={"ghost"}
                    size={"md"}
                    disabled={pending}
                  >
                    Close
                  </Button>
                  <Button disabled={pending} type="submit" size={"md"}>
                    {pending ? <Loader text="Saving..." /> : "Save"}
                  </Button>
                </footer>
              </form>
            </Form>
          </div>
        </ResponsiveModal>
      )}
    </div>
  );
};
