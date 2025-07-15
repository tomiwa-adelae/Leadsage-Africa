import React from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { navLinks } from "@/constants";
import { Button } from "@/components/ui/button";
import { MobileNavbar } from "./MobileNavbar";

export const Header = () => {
	const user: any = null;
	return (
		<header className="z-50 bg-white py-4 h-20 flex items-center justify-center fixed top-0 w-full shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)]">
			<div className="container flex items-center justify-between gap-4">
				<Logo invert />
				<nav className="hidden flex-1 lg:flex items-center justify-center gap-2 lg:gap-8">
					{navLinks.map(({ label, slug }) => (
						<Link
							key={slug}
							href={slug}
							className="text-sm font-medium hover:text-primary transition-all"
						>
							{label}
						</Link>
					))}
				</nav>
				<div className="flex items-center justify-end gap-4">
					<div className="hidden md:block">
						{user?.isLandlord && (
							<Button variant="secondary" asChild size="md">
								<Link href="/landlord">Landlord Dashboard</Link>
							</Button>
						)}
						{!user?.isAdmin && (
							<div className="flex items-center justify-end gap-2">
								<Button variant="ghost" asChild size="md">
									<Link href="/register?type=landlord">
										Become a landlord
									</Link>
								</Button>
								<Button asChild size="md">
									<Link href="/listings">
										Browse listings
									</Link>
								</Button>
							</div>
						)}
					</div>
					{/* <SignedIn>
						<ProfileDropdown user={user} />
					</SignedIn> */}
					<div className="lg:hidden">
						<MobileNavbar />
					</div>
				</div>
			</div>
		</header>
	);
};
