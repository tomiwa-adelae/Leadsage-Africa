"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { EyeIcon, EyeOffIcon, XIcon } from "lucide-react";

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
import { loginFormSchema, LoginFormSchemaType } from "@/lib/zodSchemas";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/Loader";
import { getUserInfo } from "@/app/data/user/get-user-info";

export function LoginForm() {
  const router = useRouter();
  const [emailPending, startEmailTransition] = useTransition();
  const [googlePending, startGoogleTransition] = useTransition();

  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  function onGoogleAuthentication() {
    startGoogleTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
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

  function onSubmit(data: LoginFormSchemaType) {
    startEmailTransition(async () => {
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/login?=true",
        fetchOptions: {
          onSuccess: async () => {
            toast.success(
              `Welcome back to Leadsage. You will be redirected...`
            );
            router.push("/?login=true");
          },
          onError: (error) => {
            toast.error(error.error.message || "Oops! Internal server error");
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
              </FormItem>
            )}
          />
          <p className="text-muted-foreground text-sm text-balance">
            <Link
              href="/forgot-password"
              className="font-medium text-primary hover:text-primary hover:underline "
            >
              Forgotten password?
            </Link>
          </p>
          <Button
            disabled={googlePending || emailPending}
            className="w-full"
            type="submit"
            size={"md"}
          >
            {emailPending ? <Loader /> : "Continue"}
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
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary hover:underline "
            >
              Register
            </Link>{" "}
          </p>
        </form>
      </Form>
    </div>
  );
}
