"use client";
import Link from "next/link";
import { useState } from "react";
import {
  adminDropdownLinks,
  landlordDropdownLinks,
  navLinks,
  userDropdownLinks,
} from "@/constants";
import { Info, LogOutIcon, Menu, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSignout } from "@/hooks/use-signout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function MobileNavbar({ session }: { session: any }) {
  const [openMobile, setOpenMobile] = useState(false); // <-- add state
  const pathname = usePathname();

  const handleSignout = useSignout();

  const handleClick = () => {
    if (setOpenMobile) {
      setOpenMobile(false);
    }
  };

  const isActive = (slug: string) =>
    pathname === slug || pathname.startsWith(`${slug}/`);

  return (
    <Sheet open={openMobile} onOpenChange={setOpenMobile}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="size-10" size={"icon"}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="h-screen py-4" side={"left"}>
        <ScrollArea className="h-screen">
          <div className="container pb-20">
            <div className="flex flex-1 flex-col overflow-x-hidden">
              <SheetClose asChild>
                <Logo invert={true} />
              </SheetClose>
              <div className="mt-8 flex flex-col gap-1">
                {navLinks.map(({ label, slug }, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    size="md"
                    className={`w-full justify-start gap-2 group/sidebar
                            ${
                              isActive(slug) && "bg-[#F2F2F2] dark:bg-muted"
                            } hover:bg-[#F2F2F2] dark:bg-muted/20 px-4 py-3 rounded-md
                            `}
                    onClick={handleClick}
                  >
                    <Link href={slug}>{label}</Link>
                  </Button>
                ))}
              </div>
              {/* <div className="flex flex-col mt-4 w-full items-center justify-end gap-2">
                {!session?.user ? (
                  <>
                    <SheetClose asChild>
                      <Button className="w-full" asChild size="md">
                        <Link href="/register">Login</Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button
                        className="w-full"
                        variant="ghost"
                        asChild
                        size="md"
                      >
                        <Link href="/register">Sign up</Link>
                      </Button>
                    </SheetClose>
                  </>
                ) : (
                  ""
                )}
              </div> */}

              <div className="flex flex-col mt-4 w-full items-center justify-end gap-2">
                {session?.user ? (
                  <>
                    {/* User info */}
                    <div className="flex flex-col items-center mb-4">
                      <Avatar>
                        <AvatarImage
                          src={session.user.image}
                          alt={session.user.name}
                        />
                        <AvatarFallback>
                          {session.user.name[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="mt-2 font-medium">
                        {session.user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {session.user.email}
                      </span>
                    </div>

                    {/* User actions as buttons */}
                    {(session.user.role === "user" ||
                    session.user.role === "renter"
                      ? userDropdownLinks
                      : session.user.role === "landlord"
                      ? landlordDropdownLinks
                      : session.user.role === "admin"
                      ? adminDropdownLinks
                      : []
                    ).map(({ slug, label, icon: Icon, comingSoon }, index) =>
                      comingSoon ? (
                        <Button
                          className="w-full justify-start gap-2"
                          variant="ghost"
                          size="md"
                          disabled
                        >
                          <Icon
                            size={16}
                            className="opacity-60"
                            aria-hidden="true"
                          />
                          {label}
                          <Badge variant={"secondary"}>Soon</Badge>
                        </Button>
                      ) : (
                        <SheetClose asChild key={index}>
                          <Button
                            asChild
                            className="w-full justify-start gap-2"
                            variant="ghost"
                            size="md"
                          >
                            <Link href={slug}>
                              <Icon
                                size={16}
                                className="opacity-60"
                                aria-hidden="true"
                              />
                              {label}
                            </Link>
                          </Button>
                        </SheetClose>
                      )
                    )}

                    {/* Other actions */}
                    <SheetClose asChild>
                      <Button
                        asChild
                        className="w-full justify-start gap-2"
                        variant="ghost"
                        size="md"
                      >
                        <Link href="/settings">
                          <Settings
                            size={16}
                            className="opacity-60"
                            aria-hidden="true"
                          />
                          Settings
                        </Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button
                        // asChild
                        className="w-full justify-start gap-2"
                        variant="ghost"
                        size="md"
                        disabled
                      >
                        {/* <Link href="/help-center"> */}
                        <Info
                          size={16}
                          className="opacity-60"
                          aria-hidden="true"
                        />
                        Help Center<Badge variant={"secondary"}>Soon</Badge>
                        {/* </Link> */}
                      </Button>
                    </SheetClose>
                    <Button
                      onClick={() => {
                        handleSignout(); // call your logout function
                        setOpenMobile(false); // close the mobile sheet
                      }}
                      className="w-full justify-start gap-2"
                      variant="ghost"
                      size="md"
                    >
                      <LogOutIcon
                        size={16}
                        className="opacity-60"
                        aria-hidden="true"
                      />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Button className="w-full" asChild size="md">
                        <Link href="/register">Login</Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button
                        className="w-full"
                        variant="ghost"
                        asChild
                        size="md"
                      >
                        <Link href="/register">Sign up</Link>
                      </Button>
                    </SheetClose>
                  </>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
