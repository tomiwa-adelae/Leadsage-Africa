import React, { ReactNode } from "react";
import { Testimonials } from "./_components/Testimonials";
import { Logo } from "@/components/Logo";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserInfo } from "../data/user/get-user-info";

const layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) redirect("/");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
      <Testimonials />
      <div className="min-h-screen lg:col-span-2 py-4 flex flex-col items-start justify-center container">
        <Logo invert />
        <div className="flex-1 pt-14 pb-12 w-full flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default layout;
