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
import { cn, timeAgo } from "@/lib/utils";
import { CheckIcon, EyeIcon, EyeOffIcon, X, XIcon } from "lucide-react";
import React, { useMemo, useState, useTransition } from "react";
import {
  editPasswordFormSchema,
  EditPasswordFormSchemaType,
} from "@/lib/zodSchemas";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/use-try-catch";
import { Loader } from "@/components/Loader";
import { Progress } from "@/components/ui/progress";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { createPassword, triggerUpdateUser } from "../actions";

interface Props {
  password: string | null;
  lastUpdated: Date;
  token: string | undefined;
}

export const PasswordBox = ({
  password: hashPassword,
  lastUpdated,
  token,
}: Props) => {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [pending, startTransition] = useTransition();

  const form = useForm<EditPasswordFormSchemaType>({
    resolver: zodResolver(editPasswordFormSchema),
    defaultValues: {
      newPassword: "",
      oldPassword: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("newPassword");
  const [isNewVisible, setIsNewVisible] = useState<boolean>(false);
  const [isOldVisible, setIsOldVisible] = useState<boolean>(false);
  const [isConfirmVisible, setConfirmIsVisible] = useState<boolean>(false);

  const toggleNewVisibility = () => setIsNewVisible((prevState) => !prevState);
  const toggleOldVisibility = () => setIsOldVisible((prevState) => !prevState);
  const toggleConfirmVisibility = () =>
    setConfirmIsVisible((prevState) => !prevState);

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
      {
        regex: /[!@#$%^&*(),.?":{}|<>]/,
        text: "At least 1 special character",
      },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(password);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score === 3) return "Medium password";
    return "Strong password";
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    form.reset();
  };

  const [passwordSuccess, setPasswordSuccess] = useState(false);

  function onSubmit(data: EditPasswordFormSchemaType) {
    startTransition(async () => {
      if (hashPassword) {
        if (!data.oldPassword) {
          toast.error("Please enter your old password");
          return;
        }

        const result = await authClient.changePassword({
          newPassword: data.newPassword,
          currentPassword: data.oldPassword,
          fetchOptions: {
            onSuccess: () => {
              toast.success("Password successfully saved");
              return;
            },
            onError: (error) => {
              toast.error(error.error.message || "Oops! Password not saved");
              return;
            },
          },
        });

        // Check if the operation failed and return early
        if (!result || result.error) {
          return; // Don't continue with the rest of the function
        }
      } else {
        const { data: result, error } = await tryCatch(
          createPassword(data, token)
        );

        if (error) {
          toast.error(error.message);
          return;
        }

        if (result.status === "success") {
          toast.success(result.message);
          return;
        } else {
          toast.error(result.message);
          return;
        }
      }
      await triggerUpdateUser();
      router.refresh();
      handleCloseModal();
    });
  }

  return (
    <div className="hover:bg-accent/50 transition-all p-6 hover:rounded-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-medium">Password</p>
          <p className="text-sm text-muted-foreground">
            {hashPassword ? (
              `Last updated ${timeAgo(lastUpdated)}`
            ) : (
              <span className="italic">Not created</span>
            )}
          </p>
        </div>
        <Button
          disabled={pending}
          onClick={() => setOpenModal(true)}
          size="md"
          variant={"ghost"}
        >
          {hashPassword ? "Update" : "Create"}
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
                Change password
              </h5>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="">
                <div className="bg-accent/50 py-8 overflow-y-auto max-h-[55vh]">
                  <div className="container space-y-4">
                    {hashPassword && (
                      <FormField
                        control={form.control}
                        name="oldPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={isOldVisible ? "text" : "password"}
                                  placeholder="Enter your current password"
                                  {...field}
                                />
                                <Button
                                  className="absolute top-[50%] translate-y-[-50%] end-1 text-muted-foreground/80"
                                  variant={"ghost"}
                                  size="icon"
                                  type="button"
                                  onClick={toggleOldVisibility}
                                  aria-label={
                                    isOldVisible
                                      ? "Hide password"
                                      : "Show password"
                                  }
                                  aria-pressed={isOldVisible}
                                  aria-controls="password"
                                >
                                  {isOldVisible ? (
                                    <EyeOffIcon
                                      className="size-4"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <EyeIcon
                                      className="size-4"
                                      aria-hidden="true"
                                    />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                className="pe-9"
                                placeholder="Password"
                                type={isNewVisible ? "text" : "password"}
                                {...field}
                              />
                              <Button
                                className="absolute top-[50%] translate-y-[-50%] end-1 text-muted-foreground/80"
                                variant={"ghost"}
                                size="icon"
                                type="button"
                                onClick={toggleNewVisibility}
                                aria-label={
                                  isNewVisible
                                    ? "Hide password"
                                    : "Show password"
                                }
                                aria-pressed={isNewVisible}
                                aria-controls="password"
                              >
                                {isNewVisible ? (
                                  <EyeOffIcon
                                    className="size-4"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <EyeIcon
                                    className="size-4"
                                    aria-hidden="true"
                                  />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                          <div
                            className={cn(
                              password.length !== 0
                                ? "block mt-2 space-y-3"
                                : "hidden"
                            )}
                          >
                            <Progress
                              value={(strengthScore / 5) * 100}
                              className={cn("h-1")}
                            />
                            {/* Password strength description */}
                            <p className="text-foreground mb-2 text-sm font-medium">
                              {getStrengthText(strengthScore)}. Must contain:
                            </p>

                            {/* Password requirements list */}
                            <ul
                              className="space-y-1.5"
                              aria-label="Password requirements"
                            >
                              {strength.map((req, index) => (
                                <li
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  {req.met ? (
                                    <CheckIcon
                                      size={16}
                                      className="text-emerald-500"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <XIcon
                                      size={16}
                                      className="text-muted-foreground/80"
                                      aria-hidden="true"
                                    />
                                  )}
                                  <span
                                    className={`text-xs ${
                                      req.met
                                        ? "text-emerald-600"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {req.text}
                                    <span className="sr-only">
                                      {req.met
                                        ? " - Requirement met"
                                        : " - Requirement not met"}
                                    </span>
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={isConfirmVisible ? "text" : "password"}
                                placeholder="Enter your password"
                                {...field}
                              />
                              <Button
                                className="absolute top-[50%] translate-y-[-50%] end-1 text-muted-foreground/80"
                                variant={"ghost"}
                                size="icon"
                                type="button"
                                onClick={toggleConfirmVisibility}
                                aria-label={
                                  isConfirmVisible
                                    ? "Hide password"
                                    : "Show password"
                                }
                                aria-pressed={isConfirmVisible}
                                aria-controls="password"
                              >
                                {isConfirmVisible ? (
                                  <EyeOffIcon
                                    className="size-4"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <EyeIcon
                                    className="size-4"
                                    aria-hidden="true"
                                  />
                                )}
                              </Button>
                            </div>
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
