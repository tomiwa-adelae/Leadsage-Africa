"use client";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    slug: string;
    icon?: any;
    group?: boolean;
    items?: {
      title: string;
      slug: string;
      icon: any;
    }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* <SidebarMenu>
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
        </SidebarMenu> */}
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon;
            return item.group ? (
              <Collapsible
                key={item.title}
                asChild
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant={"ghost"}
                      className={cn(
                        "w-full dark:bg-accent/50 dark:hover:bg-accent text-left justify-start",
                        pathname.startsWith(item.slug) &&
                          "bg-[#F7F7F7] dark:bg-primary/70"
                      )}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <Button
                            variant={"ghost"}
                            className={cn(
                              "w-full dark:bg-accent/50 dark:hover:bg-accent text-left justify-start",
                              pathname.startsWith(subItem.slug) &&
                                "bg-[#F7F7F7] dark:bg-primary/70"
                            )}
                            asChild
                          >
                            <Link href={subItem.slug}>
                              {subItem.icon && <subItem.icon />}
                              <span>{subItem.title}</span>
                            </Link>
                          </Button>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
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
