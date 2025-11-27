"use client";

import { GetPublicBlogCategoriesType } from "@/app/data/blog/get-public-blog-categories";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { Searchbar } from "@/components/Searchbar";
import { Button } from "@/components/ui/button";

interface Props {
  categories: GetPublicBlogCategoriesType[];
  currentCategory?: string;
}

export const BlogSidebar = ({ categories, currentCategory }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set("query", searchQuery);
    } else {
      params.delete("query");
    }
    params.delete("page");
    router.push(`/blog?${params.toString()}`);
  };

  const handleCategoryClick = (categorySlug?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categorySlug) {
      params.set("category", categorySlug);
    } else {
      params.delete("category");
    }
    params.delete("page");
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Search</h3>
        <Searchbar />
      </div>

      <div>
        <h3 className="font-medium mb-3">Categories</h3>
        <div className="space-y-2">
          <Button
            variant={!currentCategory ? "default" : "secondary"}
            onClick={() => handleCategoryClick()}
            className={`w-full justify-start`}
          >
            All Posts
          </Button>
          {categories.map((category) => (
            <Button
              variant={
                currentCategory === category.slug ? "default" : "secondary"
              }
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className="w-full justify-start overflow-hidden"
              // className={`flex items-center line-clamp-1 justify-between w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              //   currentCategory === category.slug
              //     ? "bg-primary text-primary-foreground"
              //     : "hover:bg-muted"
              // }`}
            >
              <span>{category.name}</span>
              <Badge variant="outline">{category._count.posts}</Badge>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
