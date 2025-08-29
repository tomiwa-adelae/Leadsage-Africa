"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { Logo } from "../Logo";

// 1. Define your custom props
type Props = React.ComponentProps<typeof Sidebar> & {
  navLinks: {
    navMain: any[];
    navSecondary?: any[];
    title?: string;
  };
};

export function AppSidebar({ navLinks, ...props }: Props) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Logo invert />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {navLinks.title && (
        <h2 className="font-semibold container text-lg mt-2">
          {navLinks.title}
        </h2>
      )}
      <SidebarContent>
        <NavMain items={navLinks.navMain} />
        {navLinks.navSecondary && (
          <NavSecondary items={navLinks?.navSecondary} className="mt-auto" />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
