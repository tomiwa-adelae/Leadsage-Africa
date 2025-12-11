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
import { Badge } from "@/components/ui/badge";

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
        <Button
          variant="ghost"
          size="icon"
          className="ml-4 hover:bg-transparent"
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
          {(role === "user" || role === "renter"
            ? userDropdownLinks
            : role === "landlord"
            ? landlordDropdownLinks
            : role === "admin"
            ? adminDropdownLinks
            : []
          ).map(({ slug, label, icon, comingSoon }, index) => {
            const Icon = icon;
            return comingSoon ? (
              <DropdownMenuItem disabled key={index}>
                <Icon size={16} className="opacity-60" aria-hidden="true" />
                <span>
                  {label} <Badge variant={"secondary"}>Soon</Badge>
                </span>
              </DropdownMenuItem>
            ) : (
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
        <DropdownMenuItem disabled>
          <Info size={16} className="opacity-60" aria-hidden="true" />
          <span>
            Help Center <Badge variant={"secondary"}>Soon</Badge>
          </span>
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
