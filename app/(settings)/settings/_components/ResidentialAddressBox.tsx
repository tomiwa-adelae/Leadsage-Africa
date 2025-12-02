"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ResponsiveModal } from "@/components/ResponsiveModal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import React, { useState, useTransition } from "react";
import {
  editAddressFormSchema,
  EditAddressFormSchemaType,
} from "@/lib/zodSchemas";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/use-try-catch";
import { Loader } from "@/components/Loader";
import { saveAddress } from "../actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries, states } from "@/constants";

interface Props {
  address: string | null;
  state: string | null;
  city: string | null;
  country: string | null;
}

export const ResidentialAddressBox = ({
  address,
  city,
  state,
  country,
}: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [pending, startTransition] = useTransition();
  const form = useForm<EditAddressFormSchemaType>({
    resolver: zodResolver(editAddressFormSchema),
    defaultValues: {
      address: address || "",
      city: city || "",
      country: country as EditAddressFormSchemaType["country"],
      state: state as EditAddressFormSchemaType["state"],
    },
  });
  const handleCloseModal = () => {
    setOpenModal(false);
    form.reset();
  };
  function onSubmit(data: EditAddressFormSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(saveAddress(data));

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
          <p className="text-base font-medium">Residential address</p>
          <p className="text-sm text-muted-foreground">
            {address ? (
              `${address}, ${city}, ${state}, ${country}`
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
          {address ? "Edit" : "Add"}
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
                Change residential address
              </h5>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="bg-accent/50 py-8 overflow-y-auto max-h-[55vh]">
                  <div className="container space-y-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {states.map((state) => (
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
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem value={country} key={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
