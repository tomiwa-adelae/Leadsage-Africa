"use client";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    slug: string;
    icon?: any;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={item.title}>
                <Button
                  variant={"ghost"}
                  className={cn(
                    "w-full dark:bg-accent/50 dark:hover:bg-accent text-left justify-start",
                    pathname.startsWith(item.slug) &&
                      "bg-[#F7F7F7] dark:bg-primary/70"
                  )}
                  asChild
                >
                  <Link href={item.slug}>
                    {item.icon && <Icon />}
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
