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
import {
	ClipboardList,
	FolderPlus,
	Info,
	LayoutDashboardIcon,
	LayoutList,
	MessageSquareMore,
	Settings,
	Wallet,
} from "lucide-react";

const data = {
	navMain: [
		{
			title: "Dashboard",
			slug: "/landlord/dashboard",
			icon: LayoutDashboardIcon,
		},
		{
			title: "My listings",
			slug: "/landlord/listings",
			icon: LayoutList,
		},
		{
			title: "Create new listing",
			slug: "/landlord/listings/new",
			icon: FolderPlus,
		},
		{
			title: "Booking Requests",
			slug: "/landlord/bookings",
			icon: ClipboardList,
		},
		{
			title: "Messages",
			slug: "/landlord/messages",
			icon: MessageSquareMore,
		},
		{
			title: "Earnings",
			slug: "/landlord/earnings",
			icon: Wallet,
		},
	],
	navSecondary: [
		{
			title: "Settings",
			slug: "/landlord/settings",
			icon: Settings,
		},
		{
			title: "Get Help",
			slug: "/help-center",
			icon: Info,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
