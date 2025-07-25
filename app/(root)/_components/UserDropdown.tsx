"use client";
import {
	ChevronDownIcon,
	ClipboardList,
	Heart,
	Info,
	LogOutIcon,
	MessageSquareMore,
	Settings,
	User,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useSignout } from "@/hooks/use-signout";

interface Props {
	image: string;
	name: string;
	email: string;
}

export function UserDropdown({ image, name, email }: Props) {
	const handleSignout = useSignout();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="hover:bg-transparent"
				>
					<Avatar>
						<AvatarImage src={image} alt={`${name}'s picture`} />
						<AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
					</Avatar>
					<ChevronDownIcon
						size={16}
						className="opacity-60"
						aria-hidden="true"
					/>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-64">
				<DropdownMenuLabel className="flex min-w-0 flex-col">
					<span className="text-foreground truncate text-sm font-medium">
						{name}
					</span>
					<span className="text-muted-foreground truncate text-xs font-normal">
						{email}
					</span>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link href="/profile">
							<User
								size={16}
								className="opacity-60"
								aria-hidden="true"
							/>
							<span>My profile</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/my-bookings">
							<ClipboardList
								size={16}
								className="opacity-60"
								aria-hidden="true"
							/>
							<span>My bookings</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/my-messages">
							<MessageSquareMore
								size={16}
								className="opacity-60"
								aria-hidden="true"
							/>
							<span>Messages</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/my-wishlists">
							<Heart
								size={16}
								className="opacity-60"
								aria-hidden="true"
							/>
							<span>Wishlist</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/become-a-landlord">
							<Heart
								size={16}
								className="opacity-60"
								aria-hidden="true"
							/>
							<span>Become a Landlord</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/settings">
							<Settings
								size={16}
								className="opacity-60"
								aria-hidden="true"
							/>
							<span>Settings</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/help-center">
							<Info
								size={16}
								className="opacity-60"
								aria-hidden="true"
							/>
							<span>Help Center</span>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleSignout}>
					<LogOutIcon
						size={16}
						className="opacity-60"
						aria-hidden="true"
					/>
					<span>Logout</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
