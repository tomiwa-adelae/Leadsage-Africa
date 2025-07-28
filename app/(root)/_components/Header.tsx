import Link from "next/link";
import { Logo } from "@/components/Logo";
import { DEFAULT_PROFILE_PICTURE, navLinks } from "@/constants";
import { Button } from "@/components/ui/button";
import { MobileNavbar } from "./MobileNavbar";
import { getUserInfo } from "@/app/data/user/get-user-info";
import { UserDropdown } from "./UserDropdown";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const Header = async () => {
	const user = await getUserInfo();

	return (
		<header className="z-50 bg-white dark:bg-black py-4 h-20 flex items-center justify-center fixed top-0 w-full shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)]">
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
				<div className="flex items-center justify-end gap-6">
					<ThemeToggle />
					<div className="hidden md:flex items-center justify-end gap-4">
						{!user && (
							<>
								<Button asChild variant="ghost">
									<Link href={"/register"}>
										Become a landlord
									</Link>
								</Button>
							</>
						)}
						<Button asChild>
							<Link href={"/listings"}>Browse listings</Link>
						</Button>
					</div>

					{user && (
						<UserDropdown
							name={user?.name}
							email={user?.email}
							image={user?.image || DEFAULT_PROFILE_PICTURE}
						/>
					)}
					<div className="lg:hidden">
						<MobileNavbar />
					</div>
				</div>
			</div>
		</header>
	);
};
