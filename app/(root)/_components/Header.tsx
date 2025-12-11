import Link from "next/link";
import { Logo } from "@/components/Logo";
import { DEFAULT_PROFILE_PICTURE, navLinks } from "@/constants";
import { Button } from "@/components/ui/button";
import { MobileNavbar } from "./MobileNavbar";
import { UserDropdown } from "./UserDropdown";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SearchButton } from "./SearchButton";

export const Header = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

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
        <div className="flex items-center justify-end gap-2">
          <div className="flex items-center justify-end gap-2">
            <SearchButton />
          </div>
          <div className="hidden md:flex items-center justify-end gap-2">
            <ThemeToggle />
            {!session?.user && (
              <Button asChild variant="secondary">
                <Link href={"/login"}>Login</Link>
              </Button>
            )}
            <Button asChild>
              <Link href={"/listings"}>Browse listings</Link>
            </Button>
          </div>

          {session?.user && (
            <>
              <div className="md:hidden">
                <ThemeToggle />
              </div>
              <UserDropdown
                name={session?.user?.name}
                email={session?.user?.email}
                role={session?.user?.role || "user"}
                image={session?.user?.image || DEFAULT_PROFILE_PICTURE}
              />
            </>
          )}
          <div className="md:hidden flex items-center justify-end gap-2">
            {!session?.user && (
              <Button className="lg:hidden" size="sm" asChild>
                <Link href={"/login"}>Login</Link>
              </Button>
            )}
            <MobileNavbar session={session} />
          </div>
        </div>
      </div>
    </header>
  );
};
