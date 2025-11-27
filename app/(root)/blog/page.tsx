import { Header } from "../_components/Header";
import { Footer } from "../_components/Footer";
import { getPublishedPosts } from "@/app/data/blog/get-published-posts";
import { getPublicBlogCategories } from "@/app/data/blog/get-public-blog-categories";
import { BlogCard } from "./_components/BlogCard";
import { BlogSidebar } from "./_components/BlogSidebar";
import { Pagination } from "@/components/Pagination";

import type { Metadata } from "next";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { Searchbar } from "@/components/Searchbar";

export const metadata: Metadata = {
  title: "Blog | Leadsage",
  description:
    "Read the latest articles about real estate, property investment, and home buying tips in Nigeria.",
};

interface Props {
  searchParams: Promise<{
    query?: string;
    page?: string;
    category?: string;
    tag?: string;
  }>;
}

const BlogPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const query = params.query || "";
  const page = parseInt(params.page || "1");
  const categorySlug = params.category;
  const tag = params.tag;

  const [{ posts, pagination }, categories] = await Promise.all([
    getPublishedPosts({
      query,
      page,
      limit: 9,
      categorySlug,
      tag,
    }),
    getPublicBlogCategories(),
  ]);

  return (
    <div>
      <Header />
      <main className="min-h-screen">
        <div className="bg-muted/50 py-12 md:py-16">
          <div className="container">
            <h1 className="text-3xl md:text-4xl font-bold text-center">Blog</h1>
            <p className="text-muted-foreground text-center mt-2 max-w-2xl mx-auto">
              Discover insights, tips, and guides about real estate in Nigeria
            </p>
          </div>
        </div>

        <div className="container py-8 md:py-12">
          <div className="lg:hidden mb-4">
            <Searchbar />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <aside className="hidden lg:block lg:col-span-1 order-2 lg:order-1">
              <div className="sticky top-24">
                <BlogSidebar
                  categories={categories}
                  currentCategory={categorySlug}
                />
              </div>
            </aside>

            <div className="lg:col-span-3 order-1 lg:order-2">
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {query || categorySlug || tag
                      ? "No posts found matching your criteria"
                      : "No blog posts yet. Check back soon!"}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                    {posts.map((post) => (
                      <BlogCard key={post.id} post={post} />
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
        </div>
      </main>
    </div>
  );
};

export default BlogPage;
