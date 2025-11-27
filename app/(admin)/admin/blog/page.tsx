import { SiteHeader } from "@/components/sidebar/site-header";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { getAllBlogPosts } from "@/app/data/admin/blog/get-all-blog-posts";
import { BlogPostCard } from "./_components/BlogPostCard";
import { Searchbar } from "@/components/Searchbar";
import { Pagination } from "@/components/Pagination";
import { EmptyState } from "@/components/EmptyState";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Posts | Admin - Leadsage",
  description: "Manage blog posts",
};

interface Props {
  searchParams: Promise<{ query?: string; page?: string }>;
}

const AdminBlogPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const query = params.query || "";
  const page = parseInt(params.page || "1");

  const { posts, pagination } = await getAllBlogPosts({
    query,
    page,
    limit: 10,
  });

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-medium">Blog Posts</h1>
            <p className="text-muted-foreground text-base mt-2.5">
              Manage your blog posts
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/blog/create">
              <IconPlus className="h-4 w-4 mr-2" />
              New Post
            </Link>
          </Button>
        </div>

        <Searchbar search={query} placeholder="Search posts..." />

        {posts.length === 0 ? (
          <EmptyState
            title="No blog posts"
            description={
              query
                ? "No posts found matching your search"
                : "There are no blog posts yet"
            }
          />
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
            {pagination.totalPages > 1 && (
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminBlogPage;
