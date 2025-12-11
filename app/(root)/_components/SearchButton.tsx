"use client";

import { useEffect, useState } from "react";
import { LoaderCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconSearch } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

export function SearchButton() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
    setIsLoading(false);
  }, [query]);

  // Keep query state in sync with URL param
  useEffect(() => {
    const urlQuery = searchParams.get("query") || "";
    setQuery(urlQuery);
  }, [searchParams]);

  // Debounced update to URL when query changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("query", query);
        params.delete("page");

        const newUrl = `/search?${params.toString()}`;
        router.push(newUrl, { scroll: false });
      }
      // ✅ do nothing if query is empty
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchParams, router]);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline" aria-label="Search">
            <IconSearch />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="mt-4 max-w-96 w-screen">
          <div className="relative w-full">
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              {isLoading ? (
                <LoaderCircleIcon
                  className="animate-spin"
                  size={16}
                  role="status"
                  aria-label="Loading..."
                />
              ) : (
                <IconSearch size={16} aria-hidden="true" />
              )}
            </div>
            <Input
              className="pl-9 border-2"
              placeholder={"Search title..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
