"use client";

import { Input } from "@/components/ui/input";
import { IconSearch } from "@tabler/icons-react";
import { LoaderCircleIcon, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function ShowcaseSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const urlQuery = searchParams.get("query") || "";
    setQuery(urlQuery);
  }, [searchParams]);

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
      // ✅ else: do nothing — no redirect when query is empty
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchParams, router]);

  return (
    <div className="relative w-full bg-white rounded-full pl-6 pr-2 py-1 mt-4 md:mt-8">
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
        className="border-0 text-black h-8 md:h-11"
        placeholder="Search title, description..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
