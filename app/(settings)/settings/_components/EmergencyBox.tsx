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
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import React, { useState, useTransition } from "react";
import {
  editEmergencyFormSchema,
  EditEmergencyFormSchemaType,
} from "@/lib/zodSchemas";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/use-try-catch";
import { Loader } from "@/components/Loader";
import { saveEmergencyContact } from "../actions";
import { languages } from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as RPNInput from "react-phone-number-input";
import {
  CountrySelect,
  FlagComponent,
  PhoneInput,
} from "@/components/PhoneNumberInput";

interface Props {
  emergencyName: string | null;
  emergencyRelationship: string | null;
  emergencyLanguage: string | null;
  emergencyEmail: string | null;
  emergencyPhoneNumber: string | null;
}

export const EmergencyBox = ({
  emergencyName,
  emergencyLanguage,
  emergencyRelationship,
  emergencyEmail,
  emergencyPhoneNumber,
}: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [pending, startTransition] = useTransition();
  const form = useForm<EditEmergencyFormSchemaType>({
    resolver: zodResolver(editEmergencyFormSchema),
    defaultValues: {
      emergencyName: emergencyName || "",
      emergencyEmail: emergencyEmail || "",
      emergencyRelationship: emergencyRelationship || "",
      emergencyLanguage:
        emergencyLanguage as EditEmergencyFormSchemaType["emergencyLanguage"],
      emergencyPhoneNumber: emergencyPhoneNumber || "",
    },
  });
  const handleCloseModal = () => {
    setOpenModal(false);
    form.reset();
  };
  function onSubmit(data: EditEmergencyFormSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        saveEmergencyContact(data)
      );

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
    <div className="hover:bg-accent/50 transition-all p-6 hover:rounded-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-medium">Emergency contact</p>
          <p className="text-sm text-muted-foreground">
            {emergencyName || <span className="italic">Not provided</span>}
          </p>
        </div>
        <Button
          disabled={pending}
          onClick={() => setOpenModal(true)}
          size="md"
          variant={"ghost"}
        >
          {emergencyName ? "Edit" : "Add"}
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
                Change emergency contact
              </h5>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="bg-accent/50 py-8 overflow-y-auto max-h-[55vh]">
                  <div className="space-y-4 container">
                    <FormField
                      control={form.control}
                      name="emergencyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            A trusted contact we can alert in an urgent
                            situation.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emergencyRelationship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relationship</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emergencyLanguage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Language</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {languages.map((state) => (
                                <SelectItem value={state} key={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emergencyEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emergencyPhoneNumber"
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
