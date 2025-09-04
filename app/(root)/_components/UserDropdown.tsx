"use client";
import { ChevronDownIcon, Info, LogOutIcon, Settings } from "lucide-react";

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
import {
  adminDropdownLinks,
  landlordDropdownLinks,
  userDropdownLinks,
} from "@/constants";

interface Props {
  image: string;
  name: string;
  email: string;
  role: string | null;
}

export function UserDropdown({ image, name, email, role }: Props) {
  const handleSignout = useSignout();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-transparent">
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
          {(role === "user"
            ? userDropdownLinks
            : role === "landlord"
            ? landlordDropdownLinks
            : adminDropdownLinks
          ).map(({ slug, label, icon }, index) => {
            const Icon = icon;
            return (
              <DropdownMenuItem asChild key={index}>
                <Link href={slug}>
                  <Icon size={16} className="opacity-60" aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings size={16} className="opacity-60" aria-hidden="true" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/help-center">
            <Info size={16} className="opacity-60" aria-hidden="true" />
            <span>Help Center</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignout}>
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
