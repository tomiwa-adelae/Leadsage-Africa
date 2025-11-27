import { SiteHeader } from "@/components/sidebar/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { PasswordBox } from "./_components/PasswordBox";
import { getUserInfo } from "@/app/data/user/get-user-info";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SocialBox } from "./_components/SocialBox";
import { EmptyState } from "@/components/EmptyState";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login & Security | Leadsage",
};

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = await getUserInfo();

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6 space-y-4">
        <h1 className="text-3xl md:text-4xl font-medium">Login & security</h1>
        <div className="space-y-8 mt-8">
          <Card className="gap-0 pb-0">
            <CardHeader className="border-b">
              <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <PasswordBox
                password={user.accounts[user.accounts.length - 1].password}
                lastUpdated={user.updatedAt}
                token={session?.session.token}
              />
            </CardContent>
          </Card>
          <Card className="gap-0 pb-0">
            <CardHeader className="border-b">
              <CardTitle>Social accounts</CardTitle>
            </CardHeader>
            <CardContent className="p-2 grid gap-2">
              {user.accounts.filter(
                (account) => account.providerId !== "credential"
              ).length === 0 && (
                <EmptyState
                  title="No social accounts"
                  description="Your account is not connected to any of your socials"
                />
              )}
              {user.accounts
                .filter((account) => account.providerId !== "credential")
                .map((account) => (
                  <SocialBox
                    key={account.id}
                    socialName={account.providerId}
                    accountId={account.accountId}
                  />
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default page;
