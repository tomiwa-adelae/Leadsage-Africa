"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMemo, useState, useTransition } from "react";
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RequiredAsterisk } from "@/components/RequiredAsterisk";
import { registerFormSchema, RegisterFormSchemaType } from "@/lib/zodSchemas";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Loader } from "@/components/Loader";
import { useRouter } from "next/navigation";
import { triggerUserCreationNotifications } from "@/app/actions";

export function RegisterForm() {
  const router = useRouter();
  const [emailPending, startEmailTransition] = useTransition();
  const [googlePending, startGoogleTransition] = useTransition();

  const form = useForm<RegisterFormSchemaType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const password = form.watch("password");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

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

  function onSubmit(data: RegisterFormSchemaType) {
    startEmailTransition(async () => {
      await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
        callbackURL: "/login?=true",
        fetchOptions: {
          onSuccess: async () => {
            toast.success(
              `Your account was successfully created. You will be redirected...`
            );
            router.push("/?login=true");
            await triggerUserCreationNotifications();
          },
          onError: (error) => {
            toast.error(error.error.message || "Oops! Internal server error");
          },
        },
      });
    });
  }

  function onGoogleAuthentication() {
    startGoogleTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/onboarding",
        fetchOptions: {
          onSuccess: () => {
            toast.success(`Continuing with google. You will be redirected...`);
          },
          onError: (error) => {
            toast.error(error.error.message || "Internal server error");
          },
        },
      });
    });
  }

  return (
    <div className="mt-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  First name <RequiredAsterisk />
                </FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Last name <RequiredAsterisk />
                </FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email <RequiredAsterisk />
                </FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password <RequiredAsterisk />
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="pe-9"
                      placeholder="Password"
                      type={isVisible ? "text" : "password"}
                      {...field}
                    />
                    <Button
                      className="absolute top-[50%] translate-y-[-50%] end-1 text-muted-foreground/80"
                      variant={"ghost"}
                      size="icon"
                      type="button"
                      onClick={toggleVisibility}
                      aria-label={isVisible ? "Hide password" : "Show password"}
                      aria-pressed={isVisible}
                      aria-controls="password"
                    >
                      {isVisible ? (
                        <EyeOffIcon className="size-4" aria-hidden="true" />
                      ) : (
                        <EyeIcon className="size-4" aria-hidden="true" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
                <div
                  className={cn(
                    password.length !== 0 ? "block mt-2 space-y-3" : "hidden"
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
                      <li key={index} className="flex items-center gap-2">
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
          <Button
            disabled={googlePending || emailPending}
            className="w-full"
            type="submit"
            size={"md"}
          >
            {emailPending ? <Loader text="Registering..." /> : "Register"}
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <Button
            onClick={onGoogleAuthentication}
            disabled={googlePending || emailPending}
            className="w-full"
            variant="outline"
            type="button"
            size={"md"}
          >
            {googlePending ? (
              <Loader />
            ) : (
              <>
                <Image
                  src="/assets/icons/google.svg"
                  alt="Google icon"
                  width={20}
                  height={20}
                />
                Google
              </>
            )}
          </Button>
          <p className="text-muted-foreground text-sm text-balance text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary hover:underline "
            >
              Login
            </Link>{" "}
          </p>
        </form>
      </Form>
    </div>
  );
}
