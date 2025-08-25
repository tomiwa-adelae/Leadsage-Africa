"use client";

import * as React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    slug: string;
    icon: any;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={item.title}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full dark:bg-accent/50 dark:hover:bg-accent text-left justify-start",
                    pathname.startsWith(item.slug) && "bg-[#F7F7F7]"
                  )}
                  asChild
                >
                  <Link href={item.slug}>
                    <Icon />
                    <span>{item.title}</span>
                  </Link>
                </Button>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
