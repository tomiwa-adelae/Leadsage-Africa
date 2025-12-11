"use client";

import { Input } from "@/components/ui/input";
import { IconSearch } from "@tabler/icons-react";
import { LoaderCircleIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  search?: string;
}

export const SearchForm = ({ search }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(search || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Keep query state in sync with URL param
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
      // ✅ do nothing if query is empty
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchParams, router]);

  return (
    <div className="py-4 md:py-10 bg-muted/10 dark:bg-[#171718] border-b">
      <div className="border container max-w-3xl overflow-hidden rounded-full px-6 py-4 gap-4 flex items-center justify-center dark:bg-[#171718]">
        <div className="group relative w-full">
          <label className="origin-start text-muted-foreground/70 group-focus-within:text-muted-foreground has-[+input:not(:placeholder-shown)]:text-muted-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium">
            <span className="inline-flex px-2">Search title, location...</span>
          </label>
          <Input
            className="border-none shadow-none"
            placeholder=""
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

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
    </div>
  );
};
